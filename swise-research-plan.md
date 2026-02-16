# SWISE Token Research Plan

**Date:** 2026-02-16
**Objective:** Analyze the SWISE token against the Aragon Ownership Token Framework
**Token:** StakeWise (SWISE)
**Network:** Ethereum Mainnet
**Contract:** `0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2`

---

## Executive Summary

This research plan outlines a systematic approach to evaluating the SWISE governance token of the StakeWise protocol against the Aragon Ownership Token Framework. The framework evaluates tokens across five metrics: Onchain Control, Value Accrual, Verifiability, Token Distribution, and Offchain Dependencies.

**Critical Distinction:** This analysis focuses on what the SWISE token gives its holder in terms of enforceable, onchain control and economic value—not whether StakeWise is a good protocol.

---

## Resource Inventory

### Primary Sources (Confirmed)

#### Smart Contracts - Ethereum Mainnet

| Contract | Address | Purpose |
|----------|---------|---------|
| SWISE Token (Proxy) | `0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2` | Governance token |
| SWISE Implementation | `0xa28c2d79f0c5b78cec699dab0303008179815396` | StakeWiseToken implementation |
| osETH Token | `0xf1c9acdc66974dfb6decb12aa385b9cd01190e38` | Liquid staking token (V3) |
| OsTokenVaultController | `0x2A261e60FB14586B474C208b1B7AC6D0f5000306` | Manages osETH minting/burning |
| sETH2 Token (V2) | `0xfe2e637202056d30016725477c5da089ab0a043a` | Legacy liquid staking token |
| StakeWise Multisig | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | DAO treasury/governance multisig |

#### GitHub Repositories

| Repository | URL | Purpose |
|------------|-----|---------|
| v3-core | https://github.com/stakewise/v3-core | StakeWise V3 protocol contracts |
| contracts | https://github.com/stakewise/contracts | Legacy StakeWise contracts |
| docs | https://github.com/stakewise/docs | Protocol documentation |

#### Documentation

| Resource | URL | Purpose |
|----------|-----|---------|
| StakeWise Docs | https://docs.stakewise.io | Official documentation |
| Network Contracts | https://docs.stakewise.io/contracts/networks/ | Contract addresses |
| osETH Overview | https://docs.stakewise.io/protocol-overview-in-depth/oseth | V3 token mechanics |
| DAO Treasury | https://docs.stakewise.io/governance/dao-treasury | Treasury governance |
| StakeWise DAO | https://docs.stakewise.io/governance/stakewise-dao | DAO structure |

#### Governance

| Resource | URL | Purpose |
|----------|-----|---------|
| Snapshot Space | https://snapshot.org/#/stakewise.eth | Off-chain voting |
| Voting Portal | https://vote.stakewise.io | DAO voting interface |
| Governance Forum | https://forum.stakewise.io | Proposal discussions |
| DAO Process | https://forum.stakewise.io/t/stakewise-dao-governance-process/49 | Governance procedures |

#### Security Audits

| Auditor | Location | Date |
|---------|----------|------|
| Sigma Prime | https://github.com/stakewise/v3-core/blob/main/audits/2024-09-Sigma-Prime.pdf | September 2024 |

#### Analytics & Block Explorers

| Resource | URL | Purpose |
|----------|-----|---------|
| SWISE on Etherscan | https://etherscan.io/token/0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2 | Token analytics |
| Multisig on Etherscan | https://etherscan.io/address/0x144a98cb1CdBb23610501fE6108858D9B7D24934 | Treasury transactions |

#### Team & Legal Entity

| Information | Details |
|-------------|---------|
| Legal Entity | StakeWise Labs OÜ (Estonia) |
| Headquarters | Tallinn, Estonia |
| Website | https://www.stakewiselabs.ee |
| Co-Founders | Kirill Kutakov, Dmitri Tsumak |
| Founded | 2018 |
| Funding | $2M Seed (March 2021) |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants SWISE tokenholders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Examine the Snapshot space (stakewise.eth) configuration and voting strategies
2. Analyze the SafeSnap module integration with the DAO multisig
3. Trace the execution path: Snapshot vote → SafeSnap → Multisig → Protocol contracts
4. Verify if the multisig can override token holder votes

**Sources:**
- Snapshot space: https://snapshot.org/#/stakewise.eth
- SafeSnap documentation
- Multisig contract: `0x144a98cb1CdBb23610501fE6108858D9B7D24934`
- Forum governance process: https://forum.stakewise.io/t/stakewise-dao-governance-process/49

**Evidence Required:**
- Screenshot/documentation of Snapshot space voting strategy
- SafeSnap module configuration
- Evidence of multisig's ability or inability to override votes
- Historical examples of governance execution

**Anticipated Status:** ⚠️ (Likely off-chain via Snapshot with multisig execution)

**Gaps/Concerns:**
- StakeWise uses Snapshot (off-chain) voting, not onchain governance
- The multisig has "capacity to override token holders' votes" per documentation
- Need to verify if SafeSnap execution is binding or advisory

---

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to SWISE tokenholders?

**Investigation Approach:**
1. Identify all admin/owner roles in V3 contracts (Keeper, VaultsRegistry, OsTokenVaultController)
2. Trace each role's ownership chain back to the DAO multisig
3. Verify if roles can be changed via governance
4. Check for EOA or non-governed role assignments

**Sources:**
- v3-core contracts: https://github.com/stakewise/v3-core
- Keeper contract analysis
- OsTokenVaultController owner
- VaultsRegistry admin

**Evidence Required:**
- List of all privileged roles with their current assignees
- Ownership chain for each critical role (role → owner → ... → DAO)
- Evidence of role revocability through governance

**Anticipated Status:** ✅ or ⚠️ (Depends on whether roles trace to DAO)

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and are upgrades controlled by SWISE tokenholders?

**Investigation Approach:**
1. Identify all upgradeable contracts in V3 (EIP-1967 proxies)
2. Trace proxy admin ownership
3. Verify timelock or delay mechanisms
4. Check for emergency upgrade paths that bypass governance

**Sources:**
- osETH proxy: `0xf1c9acdc66974dfb6decb12aa385b9cd01190e38`
- OsTokenVaultController: `0x2A261e60FB14586B474C208b1B7AC6D0f5000306`
- Proxy admin addresses (need to read from contracts)

**Evidence Required:**
- List of upgradeable contracts with their proxy patterns
- Proxy admin ownership chain
- Timelock parameters (if any)
- Evidence of governance control over upgrades

**Anticipated Status:** ⚠️ (V3 contracts may have multisig-controlled upgrades)

---

#### 1.4 Token Upgrade Authority

**Question:** Can SWISE token behavior be modified, and if so, is it controlled by tokenholder governance?

**Investigation Approach:**
1. Verify SWISE uses EIP-1967 Transparent Proxy pattern
2. Identify the proxy admin address
3. Trace admin ownership to governance
4. Analyze implementation contract for privileged functions

**Sources:**
- SWISE Proxy: `0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2`
- Implementation: `0xa28c2d79f0c5b78cec699dab0303008179815396`
- Etherscan verified source code

**Evidence Required:**
- Proxy pattern confirmation
- Proxy admin address and its owner
- Implementation contract privileged functions
- Evidence of governance control over token upgrades

**Anticipated Status:** ⚠️ (Upgradeable token, need to verify admin control)

---

#### 1.5 Supply Control

**Question:** Are SWISE supply changes programmatic or subject to tokenholder governance?

**Investigation Approach:**
1. Check for mint/burn functions in SWISE implementation
2. Verify total supply (1,000,000,000 SWISE)
3. Identify who can call mint functions (if any)
4. Review vesting/distribution contracts

**Sources:**
- SWISE implementation source code
- Token tracker on Etherscan
- Distribution contracts (if any)

**Evidence Required:**
- Presence/absence of mint function
- mint() caller restrictions
- Current vs. max supply
- Evidence of supply immutability or governance control

**Anticipated Status:** ✅ or TBD (Need to verify mint function existence)

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or restrict protocol access or exit paths?

**Investigation Approach:**
1. Identify pause/emergency functions in V3 contracts
2. Check osETH redemption restrictions
3. Verify Vault exit mechanisms
4. Analyze Keeper role powers

**Sources:**
- V3-core contracts (Keeper, VaultsRegistry)
- osETH redemption logic
- Emergency functions in protocol

**Evidence Required:**
- List of pause/emergency functions
- Who can call emergency functions
- Impact on user funds/exit paths
- Governance accountability of emergency roles

**Anticipated Status:** ⚠️ (Protocol likely has emergency mechanisms)

---

#### 1.7 Token Censorship

**Question:** Can any roles freeze, blacklist, or seize SWISE token balances?

**Investigation Approach:**
1. Analyze SWISE implementation for blacklist/freeze functions
2. Check for transfer restrictions
3. Verify if proxy upgrade could introduce censorship

**Sources:**
- SWISE implementation contract
- Transfer function analysis

**Evidence Required:**
- Presence/absence of blacklist, freeze, pause functions
- Transfer function restrictions
- Upgrade risk for introducing censorship

**Anticipated Status:** ✅ or ⚠️ (Need to verify implementation)

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to SWISE tokenholders currently active?

**Investigation Approach:**
1. Identify current fee structure (5% DAO fee on staking rewards)
2. Trace fee flow to treasury
3. Check for active revenue distribution to SWISE holders
4. Review tokenomics proposals (veSWISE, xSWISE, dLP)

**Sources:**
- Protocol fee parameters
- Treasury inflows: `0x144a98cb1CdBb23610501fE6108858D9B7D24934`
- Forum tokenomics discussions: https://forum.stakewise.io/t/stakewise-tokenomics-proposal-veswise/836

**Evidence Required:**
- Current fee rates and recipients
- Treasury balance history
- Evidence of active distribution to holders (or lack thereof)
- Status of tokenomics proposals

**Anticipated Status:** ⚠️ (Fees accrue to treasury but likely no direct distribution to SWISE holders)

**Gaps/Concerns:**
- Multiple tokenomics proposals discussed but unclear if implemented
- Need to verify if any buyback or revenue share is active

---

#### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets controlled by SWISE tokenholder governance?

**Investigation Approach:**
1. Verify treasury is the DAO multisig
2. Check SafeSnap integration for treasury control
3. Analyze treasury composition (ETH, osETH, SWISE, etc.)

**Sources:**
- Multisig: `0x144a98cb1CdBb23610501fE6108858D9B7D24934`
- SafeSnap module

**Evidence Required:**
- Treasury ownership structure
- Evidence of governance control over treasury
- Treasury asset breakdown

**Anticipated Status:** ✅ or ⚠️ (Treasury controlled via SafeSnap + multisig)

---

#### 2.3 Accrual Mechanism Control

**Question:** Can SWISE tokenholders modify parameters governing value capture?

**Investigation Approach:**
1. Identify fee parameter setters in V3 contracts
2. Trace parameter control to governance
3. Verify fee modification history

**Sources:**
- OsTokenConfig contract
- Vault fee parameters
- Protocol fee setters

**Evidence Required:**
- Fee parameter control functions
- Governance control over fee changes
- Historical fee change transactions

**Anticipated Status:** ⚠️ (Likely controlled via multisig)

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value accrual flows benefiting SWISE tokenholders?

**Investigation Approach:**
1. Research StakeWise Labs revenue model
2. Check for institutional product fees
3. Verify any offchain agreements benefiting token holders

**Sources:**
- StakeWise Labs OÜ business model
- Institutional staking offerings

**Evidence Required:**
- Evidence of offchain revenue sharing (or lack thereof)
- Legal agreements (if public)

**Anticipated Status:** TBD (Likely no verified offchain accrual)

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is the SWISE contract source publicly available and verified?

**Investigation Approach:**
1. Verify SWISE proxy and implementation on Etherscan
2. Match to GitHub source
3. Confirm bytecode verification

**Sources:**
- Etherscan: `0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2`
- Implementation: `0xa28c2d79f0c5b78cec699dab0303008179815396`

**Evidence Required:**
- Etherscan verification status
- Link to matching GitHub source
- Bytecode match confirmation

**Anticipated Status:** ✅ (Contract is verified on Etherscan)

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verified?

**Investigation Approach:**
1. Verify all V3 contracts on Etherscan
2. Match to v3-core GitHub repository
3. Review audit coverage

**Sources:**
- GitHub: https://github.com/stakewise/v3-core
- Sigma Prime audit: https://github.com/stakewise/v3-core/blob/main/audits/2024-09-Sigma-Prime.pdf

**Evidence Required:**
- Verification status of core contracts
- GitHub source availability
- Audit coverage

**Anticipated Status:** ✅ (V3 contracts are open source and audited)

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor or coordinated group control a majority of SWISE voting supply?

**Investigation Approach:**
1. Analyze top SWISE holders from Etherscan
2. Identify DAO treasury holdings
3. Check for team/investor lockups
4. Calculate voting power distribution

**Sources:**
- Etherscan token holders
- Treasury balance
- Vesting contracts (if any)

**Evidence Required:**
- Top holder breakdown
- Treasury percentage of supply
- Team/investor percentage
- Voting power concentration analysis

**Anticipated Status:** TBD (Need to analyze holder distribution)

---

#### 4.2 Future Token Unlocks

**Question:** Are there known future events that will materially affect token concentration?

**Investigation Approach:**
1. Research original token distribution (51% to community 2021-2025)
2. Identify vesting schedules
3. Check for upcoming unlocks

**Sources:**
- Token distribution documentation
- Vesting contracts
- Historical distribution data

**Evidence Required:**
- Original allocation breakdown
- Vesting schedule details
- Remaining unlocks

**Anticipated Status:** TBD (Need to verify distribution schedule)

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question:** Are core trademarks owned by a SWISE tokenholder-controlled legal entity?

**Investigation Approach:**
1. Search USPTO/EUIPO for StakeWise trademarks
2. Identify trademark owner
3. Verify relationship to DAO

**Sources:**
- USPTO trademark database
- EUIPO database
- Company registrations

**Evidence Required:**
- Trademark registration records
- Owner entity identification
- DAO control evidence (or lack thereof)

**Anticipated Status:** ⚠️ (Likely owned by StakeWise Labs OÜ, not DAO-controlled)

---

#### 5.2 Distribution

**Question:** Are primary domains and interfaces owned by a tokenholder-controlled entity?

**Investigation Approach:**
1. Identify stakewise.io domain owner
2. Review app.stakewise.io terms of service
3. Check hosting/infrastructure control

**Sources:**
- WHOIS records
- Terms of service
- Interface source repositories

**Evidence Required:**
- Domain ownership records
- Terms of service contracting party
- DAO control evidence (or lack thereof)

**Anticipated Status:** ⚠️ (Likely owned by StakeWise Labs OÜ)

---

#### 5.3 Licensing

**Question:** Is core protocol software owned by a tokenholder-controlled entity?

**Investigation Approach:**
1. Review v3-core repository license
2. Identify IP owner
3. Check licensing terms

**Sources:**
- GitHub license files
- Legal documentation

**Evidence Required:**
- License type (MIT, GPL, proprietary, etc.)
- IP ownership
- Licensing restrictions

**Anticipated Status:** ✅ or ⚠️ (V3-core is open source, need to verify license)

---

## Evidence Sufficiency Standards

For each criterion, evidence is considered sufficient when it includes:

1. **Onchain Evidence:**
   - Direct contract address links (Etherscan)
   - Function-level analysis with line numbers
   - Transaction history proving behavior
   - View function outputs confirming state

2. **Documentation Evidence:**
   - Official docs with permanent URLs
   - GitHub source with commit references
   - Audit reports

3. **Governance Evidence:**
   - Snapshot space configuration
   - Historical proposal outcomes
   - Multisig transaction history

---

## Gaps and Concerns

### High Priority Gaps

1. **Governance Execution Path:** Need to verify exact execution path from Snapshot vote to protocol changes. The statement that the multisig "has the capacity to override token holders' votes" is a significant concern for Metric 1.

2. **Value Accrual:** Multiple tokenomics proposals (veSWISE, xSWISE, dLP) have been discussed but status of implementation is unclear. Need to verify if any active distribution to SWISE holders exists.

3. **Contract Addresses:** Complete list of V3 contract addresses needs to be extracted from documentation or contract reads.

### Medium Priority Gaps

4. **Token Distribution:** Need detailed analysis of holder concentration and voting power distribution.

5. **Legal Entity Control:** Relationship between StakeWise Labs OÜ and the DAO needs clarification for offchain dependencies.

6. **Supply Control:** Need to verify if SWISE has any mint function or if supply is fixed.

### Areas of Anticipated Difficulty

1. **Offchain Assets:** Trademark and domain ownership likely controlled by Labs entity, not DAO. Evidence may be difficult to obtain.

2. **Value Accrual:** SWISE tokenomics have been a topic of ongoing community discussion without clear resolution. May need to conclude "no active accrual."

3. **Governance Binding:** Off-chain Snapshot voting with multisig execution creates ambiguity about whether governance is truly binding.

---

## Research Execution Order

1. **Phase 1 - Contract Analysis:**
   - Read SWISE token implementation
   - Map V3 contract ownership chains
   - Verify all Etherscan verifications

2. **Phase 2 - Governance Mapping:**
   - Analyze Snapshot space configuration
   - Review SafeSnap module setup
   - Trace governance execution history

3. **Phase 3 - Economic Analysis:**
   - Map fee flows
   - Verify treasury composition
   - Research tokenomics status

4. **Phase 4 - Distribution Analysis:**
   - Extract holder data
   - Calculate concentration metrics
   - Identify vesting schedules

5. **Phase 5 - Offchain Dependencies:**
   - Trademark searches
   - Domain ownership
   - License review

---

## Definition of Done

This research plan is complete and ready for execution when:

- [ ] All resource URLs have been verified as accessible
- [ ] Evidence requirements are specific enough to be actionable
- [ ] Anticipated statuses reflect preliminary understanding
- [ ] Gaps are explicitly identified with mitigation strategies
- [ ] Research can be executed without needing to ask clarifying questions

---

*Plan prepared by: Research Planner Agent*
*Framework version: Aragon Ownership Token Framework (development branch)*
