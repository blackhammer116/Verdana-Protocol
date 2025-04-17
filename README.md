# 🌍 Verdana Protocol  
**Decentralized Rewards for Tree Planters | Built on Cardano**

---

## 📌 Overview

**Verdana Protocol** is a blockchain-powered platform that transforms how environmental contributions—especially tree planting and carbon sequestration—are tracked, verified, and rewarded. 

By combining remote sensing, smart contracts, native tokens, AI agents, and privacy-preserving tech, Verdana ensures fair compensation for farmers and land stewards while offering verifiable carbon credits for companies and organizations.

> 🌱 *"Grow trees. Capture carbon. Earn rewards. Empower the planet."*

---

## ❗ The Problem

Today’s Payment for Ecosystem Services (PES) systems are broken:

- 🌫 **Lack of transparency** – Reports are manual and often unreliable.
- 🛠 **Difficult to monitor** – Measuring real carbon capture is complex.
- 🧾 **Manual and fragmented** – No standardized reward system.
- 🔁 **Double-counted carbon credits** – Erodes trust and value.
- 🕒 **Delayed or unfair payments** – Discourages farmer participation.

---

## 🌟 The Solution: Verdana Protocol

Verdana leverages **Cardano blockchain**, **satellite data**, **AI coordination**, and **privacy-preserving verification** to build a transparent, trustworthy PES platform.

### 🌱 Core Workflow

1. **Farmer Registration**  
   Register with GPS coordinates, tree type, and land size. All data is securely stored on-chain.

2. **Remote Tree Monitoring**  
   Use AI + NDVI satellite data (simulated during hackathon) to measure vegetation growth and estimate CO₂ absorption.

3. **Smart Contract Activation**  
   If CO₂ captured > threshold, a smart contract mints **COTREE tokens** directly to the farmer’s Cardano wallet.

4. **Carbon Token Utility**  
   - Sell tokens on a **carbon credit DEX**
   - Offset carbon footprints for companies
   - Convert to ADA or fiat

5. **AI Assistant (MASUMI)**  
   Helps farmers understand rewards, and assists carbon buyers.

6. **Tamper-Proof Proof (See3)**  
   Land and tree ownership validated via images with metadata, GPS, and timestamp hashing via IPFS.

7. **Privacy with zkPass**  
   Farmers prove identity eligibility using zero-knowledge proofs—no sensitive data shared.

---

## 🔁 End-to-End Demo (Hackathon)

| Module               | Feature/Simulation                              |
|----------------------|--------------------------------------------------|
| Farmer Registration  | Form with GPS + tree type                       |
| NDVI Data            | Dummy NDVI JSON from SentinelHub                |
| Smart Contract       | Mint tokens if `CO₂ ≥ 1.0`                      |
| Wallet               | Show COTREE balance and CO₂ captured            |
| Carbon Market        | Table showing tradable tokens                   |
| MASUMI AI            | Voice/text interface for guidance               |
| See3 Proof System    | Simulated image upload + hash storage           |

---

## 🧪 Tech Stack

| Layer             | Tool/Tech                               |
|------------------|------------------------------------------|
| **Blockchain**    | Cardano + Aiken (smart contract lang)    |
| **AI Agent**      | MASUMI (Crew AI / LangChain)             |
| **Backend**       | Node.js / Python                         |
| **Frontend**      | Vercel (Lucid.js or Mesh.js)             |
| **Storage**       | IPFS (media, metadata)                   |
| **Monitoring**    | See3 + Simulated NDVI from SentinelHub   |
| **Privacy**       | zkPass (Zero-Knowledge Proof ID)         |

---

## 💸 Tokenomics: COTREE Token

- 1 COTREE = 1 ton of verified CO₂ captured
- Estimated Value: ~$6 per token (can vary)
- Example:  
  - 100 trees = 10 tons/year → $60 annually  
  - Scales across villages and cooperatives

---

## 🎯 Stakeholder Benefits

| Stakeholder     | Value Provided                                           |
|------------------|----------------------------------------------------------|
| **Farmers**       | Earn secure, fair, transparent payments for tree growth |
| **NGOs**          | Trustworthy project validation and fund tracking        |
| **Corporates**    | Verified carbon offsets for ESG goals                   |
| **Governments**   | Help monitor national climate goals (NDCs)              |
| **Planet**        | Real, trackable CO₂ removal through verified forestry 🌍 |

---

## 📊 Impact Summary

- 🔐 Transparent carbon registry on Cardano
- 🌱 Verified afforestation and reforestation at scale
- 🛰 Satellite and AI-driven carbon estimation
- 🤝 Bridging digital finance with climate resilience

---

## 🚀 Getting Started (Hackathon Edition)

1. Clone this repo  
2. Run backend `Node.js` server with dummy data endpoints  
3. Interact with frontend UI (deployed via Vercel)  
4. Connect wallet (Cardano testnet)  
5. Upload NDVI simulation → trigger smart contract  
6. View COTREE token balance + available credits

---

## 🌐 Future Scope

- Real-time satellite integration via SentinelHub/Google Earth Engine  
- DEX integration for open carbon trading  
- DAO governance for community decisions  
- Mobile app for farmers with offline syncing  
- Integration with local governments and certifiers (e.g. Verra, Gold Standard)

---

## 📛 Naming Origins

**Verdana Protocol**  
"Verdant" = lush, green growth  
"Protocol" = secure, repeatable system  
→ A system for green rewards, rooted in transparency 🌿

---

## 🤝 Contributors

- Nebiyu Samuel
- Hauwa Muhammad Bello
- Armel Munyaneza.

---

## 📬 Contact & Community

- 💌 Email: hello@verdanaprotocol.org  
- 🗨 Discord: [Coming Soon]  
- 🌐 Website: [verdanaprotocol.org](#)  
- 🧪 Powered by Cardano, See3, MASUMI AI, and zkPass

---
