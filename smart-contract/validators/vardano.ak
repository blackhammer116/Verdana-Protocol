
use aiken/collection/list
use cardano/transaction.{Transaction,  Input, Output, OutputReference}
use cardano/address.{Address,  VerificationKey}
use cardano/assets.{   from_asset,quantity_of}

// Data types for our contract

// Represents a tree planting record
pub type TreePlantingRecord {
    farmer_id: ByteArray,
    location: Location,
    tree_type: ByteArray,
    planted_timestamp: Int,
    tree_count: Int,
}

// Location coordinates
pub type Location {
    latitude: Int,  // Scaled by 1,000,000 for precision
    longitude: Int, // Scaled by 1,000,000 for precision
}

// Carbon measurement data from satellite/monitoring
pub type CarbonData {
    farmer_id: ByteArray,
    ndvi: Int,        // Scaled by 1,000 for precision (0.123 -> 123)
    co2_absorbed: Int, // In kg, scaled by 100 (1.5kg -> 150)
    timestamp: Int,
}

// Contract datum for our validator
pub type Datum {
    farmers: List<ByteArray>,
    tree_records: List<TreePlantingRecord>,
    carbon_data: List<CarbonData>,
    token_mints: List<(ByteArray, Int)>,
}

// Redeemer actions for our validator
pub type Redeemer {
    RegisterFarmer(ByteArray)
    PlantTrees(TreePlantingRecord)
    UpdateCarbonData(CarbonData)
    MintTokens(ByteArray, Int)
    SpendTokens(ByteArray, Int, ByteArray)
}

// Token policy for our carbon credit tokens
const token_policy_id = #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"

// Token name
const token_name = "COTREE"

// Main validator function
validator vardano_protocol {
    spend(datum: Option<Datum>, redeemer: Redeemer, _own_ref: OutputReference, ctx: Transaction) -> Bool {
        when datum is {
            Some(d) -> {
                let transaction = ctx

                when redeemer is {
                    RegisterFarmer(farmer_id) -> 
                        !list.has(d.farmers, farmer_id)
                    
                    PlantTrees(record) -> 
                        list.has(d.farmers, record.farmer_id) &&
                        must_be_signed_by(transaction, record.farmer_id)
                    
                    UpdateCarbonData(data) -> 
                        
                        list.has(d.farmers, data.farmer_id)
                    
                    MintTokens(farmer_id, amount) -> 
                        
                        list.has(d.farmers, farmer_id) &&
                        validate_token_amount(d.carbon_data, farmer_id, amount) &&
                        validate_mint_operation(transaction, farmer_id, amount)
                    
                    SpendTokens(farmer_id, amount, receiver) -> 
                        must_be_signed_by(transaction, farmer_id) &&
                        validate_spend_operation(transaction, farmer_id, amount, receiver)
                }
            }

            None -> False  // No datum provided, reject transaction
        }
    }
}


// Helper functions

fn must_be_signed_by(transaction: Transaction, pkh: ByteArray) -> Bool {
    list.has(transaction.extra_signatories, pkh)
}

fn validate_token_amount(carbon_data: List<CarbonData>, farmer_id: ByteArray, amount: Int) -> Bool {
    let farmer_data = list.filter(carbon_data, fn(data: CarbonData) { data.farmer_id == farmer_id })

    let total_co2 = list.foldl(farmer_data, 0, fn(data: CarbonData, acc: Int) { acc + data.co2_absorbed })


    let max_tokens = total_co2 / 100
    amount <= max_tokens
}

fn validate_mint_operation(tx: Transaction, farmer_id: ByteArray, amount: Int) -> Bool {
    let expected_mint = from_asset(token_policy_id, token_name, amount)
    let actual_mint = tx.mint
    quantity_of(actual_mint, token_policy_id, token_name) == quantity_of(expected_mint, token_policy_id, token_name)
 &&
    verify_tokens_to_farmer(tx, farmer_id, amount)
}

fn verify_tokens_to_farmer(tx: Transaction, farmer_id: ByteArray, amount: Int) -> Bool {
    let outputs = tx.outputs
    let farmer_outputs = list.filter(outputs, fn(output) {
        when output.address.payment_credential is {
            VerificationKey(vk) -> vk == farmer_id
            _ -> False
        }
    })
    list.any(farmer_outputs, fn(output) {
        let token_amount = quantity_of(output.value, token_policy_id, token_name)
        token_amount >= amount
    })
}
fn validate_spend_operation(tx: Transaction, farmer_id: ByteArray, amount: Int, receiver: ByteArray) -> Bool {
    let farmer_inputs = list.filter(tx.inputs, fn(input) {
        when input.output.address.payment_credential is {
            VerificationKey(vk) -> vk == farmer_id
            _ -> False
        }
    })

   let total_input_tokens = list.foldl(farmer_inputs, 0, fn(input: Input, acc: Int) {
    acc + quantity_of(input.output.value, token_policy_id, token_name)
})

    let receiver_outputs = list.filter(tx.outputs, fn(output) {
        when output.address.payment_credential is {
            VerificationKey(vk) -> vk == receiver
            _ -> False
        }
    })

    let total_receiver_tokens = list.foldl(receiver_outputs, 0, fn(output: Output, acc: Int) {
    acc + quantity_of(output.value, token_policy_id, token_name)
})


    total_input_tokens >= amount && total_receiver_tokens >= amount
}
