# ZRO Token Research Report
## Aragon Ownership Token Framework Analysis

**Date:** 2026-02-25
**Token:** ZRO (LayerZero)
**Primary Contract:** `0x6985884c4392d348587b19cb9eaaf157f13271cd`
**Network:** Ethereum (also deployed on Arbitrum, Optimism, Base, Polygon, BSC)
**Author:** Research Agent

---

## Executive Summary

ZRO is the governance token of the LayerZero cross-chain messaging protocol. This report evaluates ZRO against the Aragon Ownership Token Framework's three core questions:

### 1. What do I own?

**Limited governance scope.** ZRO holders have a single governance power: voting in a bi-annual fee switch referendum. This vote determines whether the protocol charges a fee on cross-chain messages, with collected fees used for buyback-and-burn of ZRO. **However, the voting contract address cannot be verified from public sources**, making the binding nature and immutability of this mechanism unverifiable.

ZRO holders do **not** control:
- Protocol upgrades (EndpointV2 and MessageLibs are controlled by a 3/5 multisig)
- Default DVN/Executor configuration
- Protocol parameters
- Treasury allocation

### 2. Why should it have value?

**No active value accrual.** The fee switch has been voted on three times (Dec 2024, Jun 2025, Dec 2025) and failed to reach quorum each time. Currently, no protocol fees are collected, and no value flows to ZRO holders.

The **potential** value accrual mechanism:
- If fee switch is activated: protocol charges fees equal to DVN/Executor costs
- Fees are converted to ZRO and burned (deflationary)
- This would reduce supply over time

**Forward-looking:** The Zero blockchain announcement (Feb 2026) positions ZRO as the native asset of a new L1, potentially creating substantial utility. This is NOT currently live.

### 3. What threatens that value?

**Key risks:**
1. **Governance scope is extremely narrow** - ZRO only controls the fee switch, not the protocol
2. **Multisig can override** - 3/5 OneSig controls all protocol contracts; no tokenholder oversight
3. **Fee switch voting contract unverified** - Cannot confirm the vote is binding or immutable
4. **No quorum reached** - Three consecutive referendums failed to activate the fee
5. **High concentration** - Large allocations to Strategic Partners (32.2%) and Core Contributors (25.5%) with ongoing vesting
6. **Licensing controlled by Labs** - LZBL-1.2 license is controlled by LayerZero Labs Ltd., not tokenholders

---

## Contract Architecture

### Core Protocol Contracts

| Contract | Address | Chain | Upgradeable | Owner |
|----------|---------|-------|-------------|-------|
| ZRO Token | `0x6985884c4392d348587b19cb9eaaf157f13271cd` | Ethereum | No | 3/5 OneSig |
| EndpointV2 | `0x1a44076050125825900e736c501f859c50fE728c` | Ethereum | No | 3/5 OneSig |
| SendUln302 | `0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1` | Ethereum | No | 3/5 OneSig |
| ReceiveUln302 | `0xc02Ab410f0734EFa3F14628780e6e695156024C2` | Ethereum | No | 3/5 OneSig |

### Verification

**ZRO Token Owner:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0x6985884c4392d348587b19cb9eaaf157f13271cd "owner()(address)"
Result: 0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92
```

**ZRO Owner Multisig Threshold:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92 "getThreshold()(uint256)"
Result: 3
```

**ZRO Owner Multisig Signers:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92 "getOwners()(address[])"
Result: [
  0xB981a2664f5f547291Df5F8dCD4505f7015912CF,
  0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0,
  0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e,
  0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327,
  0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e
]
```

**EndpointV2 Owner:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0x1a44076050125825900e736c501f859c50fE728c "owner()(address)"
Result: 0xBe010A7e3686FdF65E93344ab664D065A0B02478
```

**EndpointV2 Owner Multisig Threshold:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0xBe010A7e3686FdF65E93344ab664D065A0B02478 "threshold()(uint256)"
Result: 3
```

**EndpointV2 Owner Multisig Signers:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0xBe010A7e3686FdF65E93344ab664D065A0B02478 "getSigners()(address[])"
Result: [
  0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47,
  0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c,
  0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e,
  0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e,
  0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7
]
```

**Note:** The ZRO Token owner and EndpointV2 owner are **different multisigs** with overlapping signers:
- Shared signers: `0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e`, `0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e`

### Proxy Status

**ZRO Token is NOT a proxy:**
```
cast implementation --rpc-url https://ethereum-rpc.publicnode.com 0x6985884c4392d348587b19cb9eaaf157f13271cd
Result: 0x0000000000000000000000000000000000000000
```

**EndpointV2 is NOT a proxy:**
```
cast implementation --rpc-url https://ethereum-rpc.publicnode.com 0x1a44076050125825900e736c501f859c50fE728c
Result: 0x0000000000000000000000000000000000000000
```

---

## Governance and Ownership Model

### Ownership Topology

```
ZRO Token (0x6985...71cd)
    │
    └── Owner: 3/5 Gnosis Safe Multisig (0xCDa8...4C92)
              │
              └── 5 Signers (EOAs - identities unknown)
                        │
                        └── NO ZRO governance oversight

EndpointV2 (0x1a44...728c)
    │
    └── Owner: 3/5 OneSig Multisig (0xBe01...d478)
              │
              └── 5 Signers (EOAs - identities unknown)
                        │
                        └── NO ZRO governance oversight

Fee Switch Voting Contract
    │
    └── [ADDRESS UNKNOWN - UNVERIFIABLE]
              │
              └── Claims: Immutable, binding referendum
              └── Status: Cannot verify without contract address
```

### Role Matrix

| Contract | Role | Current Holder | Holder Type | Verified Via | Who Controls Holder |
|----------|------|----------------|-------------|--------------|---------------------|
| ZRO Token | `owner()` | `0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92` | 3/5 Gnosis Safe | `cast call owner()` | 5 EOA signers |
| EndpointV2 | `owner()` | `0xBe010A7e3686FdF65E93344ab664D065A0B02478` | 3/5 OneSig | `cast call owner()` | 5 EOA signers |
| SendUln302 | `owner()` | `0xBe010A7e3686FdF65E93344ab664D065A0B02478` | 3/5 OneSig | `cast call owner()` | Same as EndpointV2 |
| ReceiveUln302 | `owner()` | `0xBe010A7e3686FdF65E93344ab664D065A0B02478` | 3/5 OneSig | `cast call owner()` | Same as EndpointV2 |
| Fee Switch | Unknown | Unknown | Unknown | [UNVERIFIED] | Unknown |

### Owner Functions

**EndpointV2 (`onlyOwner` functions):**
- `setLzToken(address)` - Set the LayerZero token for fee payments
- `recoverToken(address,address,uint256)` - Recover accidentally sent tokens
- `registerLibrary(address)` - Register new message libraries
- `setDefaultSendLibrary(uint32,address)` - Set default send library per chain
- `setDefaultReceiveLibrary(uint32,address,uint256)` - Set default receive library with grace period
- `setDefaultReceiveLibraryTimeout(uint32,address,uint256)` - Set timeout for receive library

**Source:** [EndpointV2.sol](https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/packages/layerzero-v2/evm/protocol/contracts/EndpointV2.sol)

**ZRO Token (`onlyOwner` functions via OAppCore):**
- `setPeer(uint32,bytes32)` - Set trusted peer addresses for cross-chain bridging
- `setDelegate(address)` - Set delegate for endpoint configuration
- `setMsgInspector(address)` - Set optional message inspector

**Source:** [OAppCore.sol](https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/packages/layerzero-v2/evm/oapp/contracts/oapp/OAppCore.sol), [OFTCore.sol](https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/packages/layerzero-v2/evm/oapp/contracts/oft/OFTCore.sol)

---

## Fee Switch Referendum

### Mechanism Description

According to LayerZero Foundation documentation:
- An "immutable voting contract" enforces a public on-chain referendum every six months
- ZRO holders vote on whether to activate the protocol fee switch
- If activated, fees equal to DVN/Executor costs would be charged
- Collected fees would be converted to ZRO and burned
- Quorum requirement: 40.59% of circulating ZRO (~230M tokens)
- Passing requirement: >50% in favor

### Referendum History

| Vote | Date | Result | Quorum Met |
|------|------|--------|------------|
| #1 | Dec 20-27, 2024 | Off | No |
| #2 | Jun 20-27, 2025 | Off | No |
| #3 | Dec 20-27, 2025 | Off | No |

### Critical Gap: [UNVERIFIED]

**The fee switch voting contract address cannot be located from primary evidence.**

Searched:
- LayerZero-v2 GitHub repository: No voting/referendum contracts found
- layerzero.foundation/fee-switch: References "View Contract" button but no address in page source
- Etherscan searches for contracts deployed by Foundation wallet: Foundation wallet has no code (`0x2650e83effab4ca0fad4fbf91f70d17faeb24535`)
- LayerZeroScan: No governance contract references
- Snapshot.org (lzfoundation.eth): Space does not exist

**Without the contract address, the following cannot be verified:**
1. That the voting contract is truly immutable
2. That the vote is binding (not advisory)
3. That no admin can override the vote result
4. The exact quorum and threshold parameters
5. How the result executes the fee switch activation

**Classification:** Criteria 1.1 (Onchain Governance Workflow) must be marked as **UNKNOWN** per framework methodology.

---

## Value Accrual Mechanism

### Current Status: NO ACTIVE ACCRUAL

**Revenue Sources:** None active
- Protocol fee switch is OFF
- No fees are collected on cross-chain messages
- No protocol revenue flows to tokenholders

**Potential Mechanism (if fee switch ON):**
1. Protocol charges fee equal to cost of verification + execution per message
2. Fees collected in various tokens
3. Fees converted to ZRO
4. ZRO burned (deflationary)

**Control over value flows:**
- Fee switch: ZRO holders (via referendum) - [UNVERIFIED]
- Fee parameters: Unknown - cannot verify without fee switch contract
- Conversion mechanism: Unknown
- Burn mechanism: Unknown

### Treasury

**Foundation Wallet:** `0x2650e83effab4ca0fad4fbf91f70d17faeb24535`
- Status: EOA (no contract code on Ethereum)
- Control: Unknown - likely Foundation-controlled, not ZRO governance

**Initial Mint Recipient:** `0x3437F6F7BD47D75780981d0B5A0Ce9a038f19ed3`
- Received initial token supply at TGE

**ZRO Total Supply:**
```
cast call --rpc-url https://ethereum-rpc.publicnode.com 0x6985884c4392d348587b19cb9eaaf157f13271cd "totalSupply()(uint256)"
Result: 949,639,523,950,846,000,000,000,000 (~949.64M ZRO)
```

Note: Total supply is less than 1B due to some tokens being burned.

---

## Token Analysis

### Token Type

ZRO is an OFT (Omnichain Fungible Token) - an ERC-20 token with cross-chain bridging capabilities built-in.

**Source:** [OFT.sol](https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/packages/layerzero-v2/evm/oapp/contracts/oft/OFT.sol)

### Supply Control

- **Max Supply:** 1,000,000,000 ZRO (fixed at deployment)
- **Current Supply:** ~949.64M ZRO
- **Minting:** Only via cross-chain bridge `_credit()` - mints on destination when tokens are burned on source
- **Burning:** Only via cross-chain bridge `_debit()` - burns on source when sending to another chain
- **No inflationary minting:** Contract has no `mint()` function callable by owner

### Censorship Capabilities

**Tested and NOT present:**
```
cast call "paused()(bool)" - REVERTED (no pause function)
cast call "blacklisted(address)(bool)" - REVERTED (no blacklist function)
cast call "isFrozen(address)(bool)" - REVERTED (no freeze function)
```

**The ZRO token has NO censorship mechanisms:**
- No pause function
- No blacklist/blocklist
- No freeze function
- No transfer restrictions

### Upgrade Authority

**ZRO is NOT upgradeable:**
- Not a proxy contract (implementation = 0x0)
- No upgrade functions in source code
- Token behavior is immutable

---

## Token Distribution

### Allocation

| Category | Percentage | Amount | Vesting |
|----------|------------|--------|---------|
| LayerZero Community | 38.30% | 383M | Cliff vesting (airdrop) |
| Strategic Partners | 32.20% | 322M | 3-year: 1-year cliff + 2-year linear |
| Core Contributors | 25.50% | 255M | 3-year: 1-year cliff + 2-year linear |
| Tokens Repurchased | 4.00% | 40M | Unknown |

**Source:** [Tokenomist](https://tokenomist.ai/layerzero)

### Current Circulating Supply

~202.6M ZRO (20.26% of total supply) as of Feb 2026

### Upcoming Unlocks

| Date | Amount | Recipient |
|------|--------|-----------|
| Mar 20, 2026 | 25,708,334 ZRO | Core Contributors |

### Concentration Concerns

**High insider allocation:**
- Strategic Partners (32.2%) + Core Contributors (25.5%) = **57.7%** held by insiders
- These parties have ongoing vesting through 2027
- Community allocation (38.3%) includes airdrop recipients who may have sold

---

## Offchain Dependencies

### Trademark

**[UNVERIFIED] - Complex situation:**
- "LayerZero" trademark at USPTO is owned by **LayerZero Power Systems, Inc.** (a power systems company, unrelated to blockchain)
- LayerZero Labs' blockchain trademark status unclear
- Terms of Use claim "LayerZero and its related entities own all intellectual property"

### Domains

| Domain | Owner |
|--------|-------|
| layerzero.network | Unknown (WHOIS privacy) |
| layerzero.foundation | Unknown (WHOIS privacy) |

### Legal Entities

| Entity | Type | Location |
|--------|------|----------|
| LayerZero Labs Ltd. | Operating company | Vancouver, Canada |
| LayerZero Foundation | Foundation | Unknown jurisdiction |

### Licensing

**LZBL-1.2 (LayerZero Business License 1.2):**
- Licensor: LayerZero Labs Ltd.
- NOT open source until Change Date (Dec 14, 2027)
- After Change Date: Converts to GPL-2.0 compatible
- Permissionless Applications only
- Permissioned Applications (regulated/KYC) may NOT use without commercial license

**Key Risk:** LayerZero Labs controls the license. ZRO tokenholders have no authority over licensing terms.

**Source:** [LICENSE-LZBL-1.2](https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/LICENSE-LZBL-1.2)

---

## Zero Network Announcement (Forward-Looking Context)

### Announcement Details (Feb 10, 2026)

LayerZero announced "Zero," a new Layer-1 blockchain targeting fall 2026 launch.

**Key features claimed:**
- Millions of TPS with near-zero fees
- Three initial "zones": EVM, privacy-focused payments, trading infrastructure
- ZRO as native asset for governance and security

**Strategic partnerships:**
- Citadel Securities: Market structure expertise + strategic ZRO investment
- DTCC: Exploring digital securities infrastructure
- ICE (Intercontinental Exchange): Collaboration on market infrastructure
- Google Cloud: Micropayments and AI agent resource trading
- ARK Invest: Equity and ZRO investment; Cathie Wood joining advisory board

**Sources:**
- [BusinessWire Announcement](https://www.businesswire.com/news/home/20260210491975/en/)
- [CoinDesk Coverage](https://www.coindesk.com/tech/2026/02/10/citadel-securities-backs-layerzero-as-it-unveils-zero-blockchain-for-global-markets)
- [The Block Coverage](https://www.theblock.co/post/389295/citadel-and-ark-invest-back-layerzero-as-it-launches-blockchain-partners-with-google-cloud-and-dtcc)

### Critical Note

**This is forward-looking and MUST NOT be used for current scoring.**

The Zero network:
- Does not exist yet
- Is scheduled for fall 2026
- Has no deployed contracts
- Has no verifiable technical specifications

The announcement changes ZRO's utility thesis significantly IF the network launches as described, but represents no current change to ZRO's value accrual or governance capabilities.

---

## Framework Criteria Assessment

### Metric 1: Onchain Control

| Criteria | Status | Notes |
|----------|--------|-------|
| 1.1 Onchain Governance Workflow | TBD | Fee switch referendum claimed but contract unverified |
| 1.2 Role Accountability | ❌ | Multisig signers not tokenholder-accountable |
| 1.3 Protocol Upgrade Authority | ❌ | Multisig controls, not tokenholders |
| 1.4 Token Upgrade Authority | ✅ | Token is not upgradeable |
| 1.5 Supply Control | ✅ | Fixed supply, no inflationary minting |
| 1.6 Privileged Access Gating | ⚠️ | Multisig can set default libraries |
| 1.7 Token Censorship | ✅ | No pause/blacklist/freeze functions |

### Metric 2: Value Accrual

| Criteria | Status | Notes |
|----------|--------|-------|
| 2.1 Accrual Active | ❌ | Fee switch is OFF, no fees collected |
| 2.2 Treasury Ownership | ❌ | No evidence ZRO controls treasury |
| 2.3 Accrual Mechanism Control | TBD | Fee switch mechanism unverified |
| 2.4 Offchain Value Accrual | ❌ | No binding offchain mechanisms |

### Metric 3: Verifiability

| Criteria | Status | Notes |
|----------|--------|-------|
| 3.1 Token Contract Source | ✅ | Verified on Etherscan, matches OFT source |
| 3.2 Protocol Component Source | ✅ | All core contracts verified |

### Metric 4: Token Distribution

| Criteria | Status | Notes |
|----------|--------|-------|
| 4.1 Ownership Concentration | ⚠️ | 57.7% to Strategic Partners + Core Contributors |
| 4.2 Future Token Unlocks | ⚠️ | Ongoing vesting through 2027 |

### Metric 5: Offchain Dependencies

| Criteria | Status | Notes |
|----------|--------|-------|
| 5.1 Trademark | TBD | Cannot verify LayerZero Labs trademark ownership |
| 5.2 Distribution (Domains) | ⚠️ | Domains privately held |
| 5.3 Licensing | ❌ | LZBL-1.2 controlled by Labs, not tokenholders |

---

## Open Questions and Unverified Claims

1. **Fee switch voting contract address** - Cannot locate from any primary source. This is the most critical gap.

2. **Multisig signer identities** - Who are the 5 signers controlling ZRO and EndpointV2? Are they LayerZero Labs employees?

3. **Foundation legal structure** - What jurisdiction? What is the relationship between Foundation and Labs?

4. **Treasury control** - Who actually controls the Foundation wallet and token allocation wallets?

5. **DVN economics** - Does ZRO play any role in DVN staking/security? CryptoEconomic DVN framework was announced but deployment status unclear.

---

## Conclusion

ZRO presents significant limitations as an "ownership token":

1. **Extremely narrow governance scope** - Only controls the fee switch (if verifiable), not the protocol
2. **No active value accrual** - Fee switch has never been activated
3. **Multisig control without tokenholder oversight** - 3/5 multisigs control all protocol contracts
4. **Key mechanism unverifiable** - Cannot confirm the fee switch vote is binding or immutable
5. **High insider concentration** - 57.7% allocated to Strategic Partners and Core Contributors

The Zero network announcement represents a potential significant change to ZRO's utility thesis, but is forward-looking and not relevant to current token value assessment.

---

## Sources

### Primary (On-chain)
- ZRO Token: https://etherscan.io/address/0x6985884c4392d348587b19cb9eaaf157f13271cd
- EndpointV2: https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c

### Code
- LayerZero-v2: https://github.com/LayerZero-Labs/LayerZero-v2
- OneSig: https://github.com/LayerZero-Labs/onesig

### Documentation
- LayerZero Docs: https://docs.layerzero.network/v2
- Fee Switch: https://layerzero.foundation/fee-switch

### Analytics
- Tokenomist: https://tokenomist.ai/layerzero
- CryptoRank: https://cryptorank.io/price/layerzero/vesting

### News
- Zero Announcement: https://www.businesswire.com/news/home/20260210491975/en/
- Fee Switch Referendum #3 Result: https://x.com/LayerZero_Fndn/status/2004741540053430601
