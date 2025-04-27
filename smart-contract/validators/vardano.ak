use aiken/dict
use aiken/hash
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{Address, Credential, VerificationKey}
use aiken/transaction/value

// Data types for our contract

// Represents a tree planting record
type TreePlantingRecord {
  farmer_id: ByteArray,
  location: Location,
  tree_type: ByteArray,
  planted_timestamp: Int,
  tree_count: Int,
}

// Location coordinates
type Location {
  latitude: Int,  // Scaled by 1,000,000 for precision
  longitude: Int, // Scaled by 1,000,000 for precision
}

// Carbon measurement data from satellite/monitoring
type CarbonData {
  farmer_id: ByteArray,
  ndvi: Int,        // Scaled by 1,000 for precision (0.123 -> 123)
  co2_absorbed: Int, // In kg, scaled by 100 (1.5kg -> 150)
  timestamp: Int,
}

// Contract datum for our validator
type Datum {
  admin: ByteArray,
  farmers: List(ByteArray),
  tree_records: List(TreePlantingRecord),
  carbon_data: List(CarbonData),
  token_mints: Dict.Dict<ByteArray, Int>,
}

// Redeemer actions for our validator
type Redeemer {
  RegisterFarmer { farmer_id: ByteArray }
  PlantTrees { record: TreePlantingRecord }
  UpdateCarbonData { data: CarbonData }
  MintTokens { farmer_id: ByteArray, amount: Int }
}

// Validator function
validator {
  fn vardano_protocol(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    let transaction = ctx.transaction
    let admin_pkh = datum.admin

    when redeemer is {
      // Register a new farmer
      RegisterFarmer { farmer_id } -> {
        // Check if caller is admin
        must_be_signed_by(transaction, admin_pkh) && 
        // Check if farmer isn't already registered
        !list.has(datum.farmers, farmer_id)
      }
      
      // Record new tree planting
      PlantTrees { record } -> {
        // Verify the farmer is registered
        list.has(datum.farmers, record.farmer_id) &&
        // Verify the transaction is signed by the farmer
        must_be_signed_by(transaction, record.farmer_id)
      }
      
      // Update carbon data from off-chain sources
      UpdateCarbonData { data } -> {
        // Only admin can update carbon data
        must_be_signed_by(transaction, admin_pkh) &&
        // Check if the farmer exists
        list.has(datum.farmers, data.farmer_id)
      }
      
      // Mint carbon tokens based on carbon absorption
      MintTokens { farmer_id, amount } -> {
        // Only admin can trigger minting
        must_be_signed_by(transaction, admin_pkh) &&
        // Check if farmer exists
        list.has(datum.farmers, farmer_id) &&
        // Validate the amount based on carbon data
        validate_token_amount(datum.carbon_data, farmer_id, amount)
      }
    }
  }
}

// Helper functions

// Check if a transaction is signed by the given public key hash
fn must_be_signed_by(transaction: Transaction, pkh: ByteArray) -> Bool {
  list.has(transaction.extra_signatories, pkh)
}

// Validate token amount based on carbon data
fn validate_token_amount(carbon_data: List<CarbonData>, farmer_id: ByteArray, amount: Int) -> Bool {
  // Find all carbon data for this farmer
  let farmer_data = list.filter(carbon_data, fn(data) { data.farmer_id == farmer_id })
  
  // Calculate total CO2 absorbed from all data points
  let total_co2 = list.foldr(
    farmer_data,
    0,
    fn(data, acc) { acc + data.co2_absorbed }
  )
  
  // Token minting formula: 1 token per kg of CO2 (with scaling factor)
  // CO2 is stored with 100x scaling, so we divide by 100
  let max_tokens = total_co2 / 100
  
  // Amount should be less than or equal to calculated max
  amount <= max_tokens
}