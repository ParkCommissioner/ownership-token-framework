# ZRO Token Research Plan
## Aragon Ownership Token Framework Analysis

**Date:** 2026-02-25
**Token:** ZRO (LayerZero)
**Contract:** `0x6985884c4392d348587b19cb9eaaf157f13271cd`
**Network:** Ethereum (also deployed on Arbitrum, Optimism, Base, Polygon, BSC)

---

## Executive Summary

This research plan maps the Aragon Ownership Token Framework's five metrics (18 criteria total) to specific LayerZero sources and investigation approaches. The plan addresses the three core questions:

1. **What do I own?** What does a ZRO tokenholder unilaterally control?
2. **Why should it have value?** What economic value accrues to ZRO holders?
3. **What threatens that value?** What conflicts or risks exist?

### Key Research Challenges

- **Limited on-chain governance scope**: ZRO's primary governance function is the fee switch referendum, not protocol upgrades
- **Foundation vs Labs separation**: Unclear on-chain boundary between LayerZero Foundation and LayerZero Labs
- **Protocol immutability claims**: EndpointV2 is described as immutable but has owner-controlled functions
- **Multi-chain complexity**: ZRO exists across 6+ chains; governance scope per chain needs verification
- **Zero network announcement**: Future utility claims (ZRO as native asset of Zero L1) must be distinguished from current state

---

## Resource Inventory

### Confirmed Sources (URLs Verified)

#### Smart Contracts

| Contract | Address | Chain | Verified |
|----------|---------|-------|----------|
| ZRO Token | `0x6985884c4392d348587b19cb9eaaf157f13271cd` | Ethereum | Yes |
| EndpointV2 | `0x1a44076050125825900e736c501f859c50fE728c` | Ethereum | Yes |
| SendUln302 | `0x6c26c61a97006888ea9E4FA36584c7df57Cd9dA3` | Ethereum | Yes |
| ReceiveUln302 | `0x1322871e4ab09Bc7f5717189434f97bBD9546e95` | Ethereum | Yes |
| LZ Executor | `0xe25741bda30bb79a66ADf656E7f2D3f0C4fb3191` | Ethereum | Yes |
| Foundation Wallet | `0x2650e83effab4ca0fad4fbf91f70d17faeb24535` | Ethereum | Yes |
| Initial Mint Recipient | `0x3437F6F7BD47D75780981d0B5A0Ce9a038f19ed3` | Ethereum | Yes |

#### GitHub Repositories

| Repository | URL | Content |
|------------|-----|---------|
| LayerZero-v2 | https://github.com/LayerZero-Labs/LayerZero-v2 | Core protocol contracts |
| devtools | https://github.com/LayerZero-Labs/devtools | Developer tooling and OApp examples |
| awesome-layerzero | https://github.com/LayerZero-Labs/awesome-layerzero | Resource index |

#### Documentation

| Source | URL | Content |
|--------|-----|---------|
| LayerZero Docs | https://docs.layerzero.network/v2 | Protocol documentation |
| Contract Addresses | https://docs.layerzero.network/v2/deployments/deployed-contracts | All chain deployments |
| Metadata API | https://metadata.layerzero-api.com/v1/metadata/deployments | Programmatic contract list |
| Foundation Fee Switch | https://layerzero.foundation/fee-switch | Fee switch referendum info |

#### Block Explorers (for verification)

| Explorer | URL |
|----------|-----|
| Etherscan (ZRO) | https://etherscan.io/token/0x6985884c4392d348587b19cb9eaaf157f13271cd |
| Etherscan (EndpointV2) | https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c |
| Arbiscan (ZRO) | https://arbiscan.io/token/0x6985884c4392d348587b19cb9eaaf157f13271cd |
| Basescan (ZRO) | https://basescan.org/token/0x6985884c4392d348587b19cb9eaaf157f13271cd |
| OP Etherscan (ZRO) | https://optimistic.etherscan.io/token/0x6985884c4392d348587b19cb9eaaf157f13271cd |

#### Analytics and Token Data

| Source | URL | Content |
|--------|-----|---------|
| DefiLlama Unlocks | https://defillama.com/unlocks/layerzero | Vesting schedule |
| CryptoRank Vesting | https://cryptorank.io/price/layerzero/vesting | Token unlock details |
| Tokenomist | https://tokenomist.ai/layerzero | Supply and release schedule |
| LayerZero Scan | https://layerzeroscan.com | Protocol analytics |

### Sources Requiring Investigation

| Source | Purpose | Status |
|--------|---------|--------|
| Fee Switch Voting Contract | Verify immutability and binding nature | Need to locate contract address |
| Treasury Contract | Verify fee burning mechanism | Referenced but address TBD |
| Governance Multisig | 3/5 multisig controlling EndpointV2 | Need to verify signers |
| DVN Staking Contracts | Verify ZRO staking role | CryptoEconomic DVN framework referenced |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants ZRO holders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Locate the fee switch referendum voting contract
2. Analyze the contract: Is it truly immutable? Is the vote binding?
3. Verify the 40.59% quorum requirement (~230M ZRO)
4. Check historical referendum results (Dec 2024, Jun 2025, Dec 2025 - all "Off")
5. Determine: What else can ZRO holders vote on besides the fee switch?

**Sources:**
- Fee switch page: https://layerzero.foundation/fee-switch
- Voting contract code (TBD - needs discovery)
- Referendum history on-chain

**Evidence Required:**
- Contract address of voting mechanism
- Code showing vote is binding (not advisory)
- Proof that no admin can override the vote result
- Scope documentation: Is fee switch the ONLY governance action?

**Anticipated Difficulty:** HIGH
- The fee switch appears to be the only governance mechanism
- No evidence of broader protocol governance by ZRO holders
- EndpointV2 is controlled by a 3/5 multisig, not ZRO holders

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to ZRO holders?

**Investigation Approach:**
1. Map EndpointV2 owner (3/5 multisig) and its signers
2. Identify all `onlyOwner` functions in EndpointV2
3. Determine: Can ZRO holders replace the multisig?
4. Investigate the "Security Council" mentioned as 9-member multisig

**Sources:**
- EndpointV2 contract: https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/packages/layerzero-v2/evm/protocol/contracts/EndpointV2.sol
- Etherscan verification of owner address

**Evidence Required:**
- Complete role map: who controls what
- Proof of governance control (or lack thereof) over these roles
- Documentation of role appointment/removal process

**Anticipated Difficulty:** HIGH
- EndpointV2 owner is a multisig, not ZRO governance
- No apparent mechanism for ZRO holders to replace multisig signers

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and if so, by whom?

**Investigation Approach:**
1. Verify EndpointV2 is not a proxy contract
2. Check for any upgrade patterns in protocol contracts
3. Identify owner functions: `setLzToken()`, `recoverToken()`
4. Determine if MessageLib contracts are upgradeable

**Sources:**
- EndpointV2.sol source code
- Etherscan contract verification (proxy check)
- All protocol contracts in LayerZero-v2 repo

**Evidence Required:**
- Confirmation: no proxy pattern in EndpointV2
- List of owner-controlled functions and their impact
- Analysis of what "immutable" means for LayerZero

**Done Criteria:**
- Classify as: Immutable / Tokenholder-controlled / Discretionary
- Document any upgrade paths that exist

#### 1.4 Token Upgrade Authority

**Question:** Can ZRO token behavior be modified?

**Investigation Approach:**
1. Analyze ZRO token contract source code
2. Check if it's a proxy contract
3. Identify any admin/owner functions
4. Verify OFT (Omnichain Fungible Token) mechanics

**Sources:**
- ZRO contract on Etherscan
- OFT implementation in devtools repo

**Evidence Required:**
- Proxy/non-proxy status
- Owner address and its functions
- Cross-chain token architecture analysis

#### 1.5 Supply Control

**Question:** Is ZRO supply fixed or can it be changed?

**Investigation Approach:**
1. Verify 1B fixed max supply claim
2. Check for mint functions beyond OFT bridge minting
3. Analyze burn mechanics (fee switch burns)
4. Map who controls minting authority

**Sources:**
- ZRO contract code
- Initial minting transaction to `0x3437F6F7BD47D75780981d0B5A0Ce9a038f19ed3`

**Evidence Required:**
- Total supply cap verification
- Mint function analysis (bridge minting vs inflationary minting)
- Burn mechanism documentation

**Done Criteria:**
- Fixed supply confirmed with code evidence
- Any inflation/deflation paths documented

#### 1.6 Privileged Access Gating

**Question:** Can any actor block or restrict protocol usage?

**Investigation Approach:**
1. Check for pause functions in EndpointV2
2. Analyze DVN/Executor permissions
3. Review any allowlist/denylist mechanisms

**Sources:**
- EndpointV2 contract
- MessageLib contracts
- DVN framework documentation

**Evidence Required:**
- List of any pause/block capabilities
- Analysis of who controls these functions

#### 1.7 Token Censorship

**Question:** Can ZRO balances be frozen, blacklisted, or seized?

**Investigation Approach:**
1. Check ZRO token for freeze/blacklist functions
2. Analyze OFT bridge for censorship vectors
3. Compare to other OFT implementations

**Sources:**
- ZRO token contract bytecode and source

**Evidence Required:**
- Presence/absence of censorship functions
- Any controller address with special powers

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to ZRO holders currently active?

**Investigation Approach:**
1. Verify fee switch is currently OFF (3 referendums failed quorum)
2. Document current ZRO utility (gas abstraction, DVN staking potential)
3. Analyze the buyback program mentioned on Foundation site

**Sources:**
- Referendum results
- Foundation announcements
- On-chain fee collection (if any)

**Evidence Required:**
- Confirmation: NO active protocol fee accrual currently
- Documentation of potential future accrual (fee switch ON scenario)

**Anticipated Difficulty:** MEDIUM
- Fee switch has consistently failed to activate
- Current ZRO utility is limited

#### 2.2 Treasury Ownership

**Question:** Does ZRO governance control the protocol treasury?

**Investigation Approach:**
1. Identify all treasury addresses (Foundation wallet, token allocation wallets)
2. Determine governance control mechanisms
3. Analyze the Stargate takeover treasury implications

**Sources:**
- Foundation wallet: `0x2650e83effab4ca0fad4fbf91f70d17faeb24535`
- Stargate treasury documentation

**Evidence Required:**
- Treasury address(es) with balances
- Ownership chain showing who controls funds
- Governance ability (or lack thereof) to direct treasury

**Anticipated Difficulty:** HIGH
- Treasury appears controlled by Foundation, not ZRO governance
- No on-chain mechanism for ZRO holders to direct treasury

#### 2.3 Accrual Mechanism Control

**Question:** Can ZRO holders modify fee parameters?

**Investigation Approach:**
1. Document fee switch: on/off binary only, or can set fee amount?
2. Identify any other economic parameters ZRO controls
3. Analyze the "up to cost of verification and execution" language

**Sources:**
- Fee switch documentation
- Voting contract parameters

**Evidence Required:**
- Scope of fee switch control (binary vs parametric)
- Any other economic controls

#### 2.4 Offchain Value Accrual

**Question:** Are there offchain value flows benefiting ZRO holders?

**Investigation Approach:**
1. Analyze Foundation legal structure (not-for-profit entity)
2. Check for any token-holder dividend mechanisms
3. Review Zero blockchain announcement implications

**Sources:**
- Foundation legal documentation (if available)
- Zero announcement: https://www.businesswire.com/news/home/20260210491975

**Evidence Required:**
- Legal entity structure documentation
- Any binding offchain commitments to ZRO holders

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is ZRO source code verified and matches bytecode?

**Investigation Approach:**
1. Check Etherscan verification status
2. Compare to GitHub source (OFT implementation)
3. Verify across multiple chains

**Sources:**
- Etherscan verification pages for all chains
- GitHub OFT source code

**Evidence Required:**
- Verification status per chain
- GitHub-to-bytecode match confirmation

**Anticipated Difficulty:** LOW - Standard verification check

#### 3.2 Protocol Component Source Verification

**Question:** Are protocol contracts verified?

**Investigation Approach:**
1. Verify EndpointV2 and all MessageLib contracts
2. Check executor and DVN contracts
3. Map all economically material contracts

**Sources:**
- Etherscan/block explorer verification
- LayerZero-v2 repository

**Evidence Required:**
- Verification status for all core contracts
- Source availability confirmation

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor control majority voting power?

**Investigation Approach:**
1. Analyze top ZRO holders
2. Identify Foundation/Labs controlled addresses
3. Calculate effective voting concentration

**Sources:**
- Etherscan token holder list
- Vesting contract addresses
- Foundation wallet analysis

**Evidence Required:**
- Top 10 holder breakdown with labels
- Foundation/Labs controlled supply percentage
- Circulating vs locked analysis

**Anticipated Difficulty:** MEDIUM
- Need to identify which wallets are Foundation/Labs controlled
- Locked tokens may or may not have voting rights

#### 4.2 Future Token Unlocks

**Question:** Will upcoming unlocks change concentration?

**Investigation Approach:**
1. Document full vesting schedule through 2027
2. Identify who receives each unlock tranche
3. Analyze impact on voting power

**Sources:**
- DefiLlama unlocks: https://defillama.com/unlocks/layerzero
- CryptoRank vesting: https://cryptorank.io/price/layerzero/vesting

**Known Data:**
- Total supply: 1B ZRO
- Community: 250M (fully vested at TGE)
- Core Contributors: 255M (24-month linear)
- Strategic Partners: 322M (24-month linear)
- Repurchased: 40M

**Evidence Required:**
- Complete unlock calendar with amounts
- Recipient identification where possible

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question:** Who owns LayerZero/ZRO trademarks?

**Investigation Approach:**
1. Search USPTO, EUIPO for trademark filings
2. Identify registrant entity

**Sources:**
- USPTO trademark database
- EUIPO trademark database

**Evidence Required:**
- Trademark registration details
- Registrant entity identification
- Relationship to Foundation/ZRO governance

#### 5.2 Distribution (Domains/Interfaces)

**Question:** Who controls primary domains and interfaces?

**Investigation Approach:**
1. Check WHOIS for layerzero.network, layerzero.foundation
2. Identify who operates Stargate Finance frontend
3. Analyze terms of service

**Sources:**
- WHOIS lookups
- Terms of service pages

**Evidence Required:**
- Domain ownership
- Interface operator identification
- ToS contracting entity

#### 5.3 Licensing

**Question:** What licenses govern LayerZero code?

**Investigation Approach:**
1. Review LZBL-1.2 business license terms
2. Analyze MIT licensed components
3. Identify who grants/revokes licenses

**Sources:**
- LICENSE-LZBL-1.2 in LayerZero-v2 repo
- LICENSE-MIT in LayerZero-v2 repo

**Evidence Required:**
- License terms summary
- Implications for forks/competitors
- Licensor entity identification

---

## Gaps and Concerns

### Critical Gaps

1. **Fee Switch Voting Contract Address**
   - Not found in documentation
   - Essential for verifying immutability claims
   - Need to discover and analyze this contract

2. **Governance Scope Beyond Fee Switch**
   - No evidence of broader ZRO governance
   - EndpointV2 controlled by multisig, not ZRO holders
   - Need to document this limitation clearly

3. **Foundation vs Labs Boundary**
   - Legal separation unclear
   - On-chain control unclear
   - Who actually controls protocol parameters?

4. **Treasury Governance**
   - Foundation wallet identified but control mechanism unclear
   - No apparent ZRO holder control over treasury

### Areas of Difficulty

1. **Immutability Claims vs Reality**
   - EndpointV2 is "immutable" but has owner functions
   - Owner is a 3/5 multisig, not governance
   - Need to precisely define what's immutable vs controllable

2. **Multi-chain Complexity**
   - ZRO on 6+ chains
   - Different endpoint deployments per chain
   - Governance scope may vary by chain

3. **DVN/Executor Economics**
   - CryptoEconomic DVN framework announced but deployment status unclear
   - ZRO staking for DVN security: Is it live?
   - Need to distinguish announced vs deployed

4. **Zero Blockchain Implications**
   - Announced Feb 10, 2026 for fall 2026 launch
   - Significantly changes ZRO utility thesis IF it launches
   - Must be treated as forward-looking, not current state

### Anticipated Negative Findings

Based on preliminary research, expect to find:

1. **Accrual NOT Active**: Fee switch has failed 3 referendums; no current protocol fee
2. **Limited Governance Scope**: ZRO only controls fee switch, not protocol upgrades
3. **Discretionary Protocol Control**: EndpointV2 owner is multisig, not ZRO governance
4. **Treasury NOT Tokenholder-Controlled**: Foundation controls treasury

These findings should be verified and documented with evidence.

---

## Evidence Sufficiency Standards

For each criteria, sufficient evidence means:

| Classification | Evidence Required |
|----------------|-------------------|
| **Immutable** | Source code showing no upgrade path; bytecode verification; no admin functions |
| **Tokenholder-controlled** | Contract showing ZRO balance → execution path; timelock; quorum requirements |
| **Discretionary** | Admin/owner functions callable by EOA/multisig without governance |
| **Unknown** | Explicitly document what couldn't be verified and why |

### Source Priority

1. **Primary**: On-chain evidence (contract code, transaction history, state reads)
2. **Secondary**: GitHub source code matched to bytecode
3. **Tertiary**: Official documentation from Foundation/Labs
4. **Supplementary**: Third-party analysis (L2Beat, Messari, etc.)

---

## Research Execution Checklist

### Phase 1: Contract Discovery and Verification
- [ ] Locate fee switch voting contract address
- [ ] Verify all token contracts across chains
- [ ] Map EndpointV2 owner and its signers
- [ ] Identify treasury contract(s)

### Phase 2: Control Path Analysis
- [ ] Complete onlyOwner function analysis for EndpointV2
- [ ] Document governance execution paths (if any)
- [ ] Analyze fee switch mechanism bindings
- [ ] Map discretionary vs immutable functions

### Phase 3: Economic Analysis
- [ ] Verify fee switch OFF status
- [ ] Document treasury holdings and control
- [ ] Analyze DVN staking deployment status
- [ ] Review buyback program mechanics

### Phase 4: Distribution and Offchain
- [ ] Compile holder concentration data
- [ ] Map vesting schedule to recipients
- [ ] Research trademark ownership
- [ ] Document licensing terms and implications

### Phase 5: Synthesis
- [ ] Classify each criteria (immutable/tokenholder/discretionary/unknown)
- [ ] Write executive summary answering three core questions
- [ ] Flag critical concerns for ZRO as an ownership token

---

## Output Format

The research report (`zro-research.md`) will follow the same structure as existing framework entries:

1. **Per-metric sections** with summary and criteria breakdown
2. **Evidence groups** with:
   - Name/summary
   - URLs (with type: explorer/github/docs)
   - Direct quotes or code snippets where applicable
3. **Status classification** per criteria (positive/neutral/at-risk)
4. **Notes** explaining the assessment

The JSON entries (`zro-tokens.json`, `zro-metrics.json`) will match the exact schema of existing entries.
