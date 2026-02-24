# HYPE Token Research Plan

## Aragon Ownership Token Framework Analysis

**Token:** HYPE (Hyperliquid)
**Network:** Hyperliquid L1 (with bridges to Ethereum/Arbitrum)
**Date:** 2026-02-24

---

## Executive Summary

This research plan maps each criterion in the Aragon Ownership Token Framework to specific Hyperliquid resources and investigation approaches. The HYPE token presents unique challenges compared to EVM-based protocols because:

1. **Hyperliquid is an L1 chain** — The HYPE token is native to Hyperliquid's own blockchain, not an ERC-20 on Ethereum
2. **Closed-source core** — The L1 node code is not open source; verification requires alternative approaches
3. **Novel architecture** — HyperCore (native trading) + HyperEVM (smart contracts) dual architecture
4. **Validator-based governance** — Governance operates through validator voting rather than token-weighted onchain voting

---

## Part 1: Resource Inventory

### 1.1 Official Documentation (Confirmed Accessible)

| Resource | URL | Content |
|----------|-----|---------|
| Main Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs | Primary technical docs |
| Staking Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking | Validator and staking mechanics |
| Fees Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees | Fee structure and distribution |
| L1 Overview | https://hyperliquid.gitbook.io/hyperliquid-docs/technical-overview/hyperliquid-l1 | Chain architecture |
| HyperEVM Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm | EVM execution layer |
| API Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api | Developer API |
| Bridge2 Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2 | Bridge mechanics |
| Brand Kit | https://hyperliquid.gitbook.io/hyperliquid-docs/brand-kit | Official brand assets |

### 1.2 GitHub Repositories (Confirmed Accessible)

| Repository | URL | License | Status |
|------------|-----|---------|--------|
| hyperliquid-dex (org) | https://github.com/hyperliquid-dex | Various | Main organization |
| hyperliquid-python-sdk | https://github.com/hyperliquid-dex/hyperliquid-python-sdk | MIT | Open source |
| hyperliquid-rust-sdk | https://github.com/hyperliquid-dex/hyperliquid-rust-sdk | MIT | Open source |
| node | https://github.com/hyperliquid-dex/node | Apache-2.0 | Node setup (not core code) |
| hyper-evm-lib | https://github.com/hyperliquid-dev/hyper-evm-lib | TBD | HyperEVM dev library |
| contracts | https://github.com/hyperliquid-dex/contracts | TBD | Smart contracts |

**Critical Gap:** The core L1 node code is NOT open source. The `node` repo contains setup instructions, not the actual consensus/execution code.

### 1.3 Block Explorers and Dashboards

| Resource | URL | Purpose |
|----------|-----|---------|
| Native Explorer | https://app.hyperliquid.xyz/explorer | Official Hyperliquid explorer |
| Staking Dashboard | https://app.hyperliquid.xyz/staking | Validator and staking stats |
| Validator Performance | https://app.hyperliquid.xyz/staking/validatorPerformance | Validator metrics |
| HypurrScan | https://hypurrscan.io/ | Community L1 explorer |
| Owlscan | https://owlscan.org | L1 explorer with staking data |
| HyperScan (Blockscout) | https://www.hyperscan.com/ | HyperEVM explorer |
| HyperEVMScan | https://hyperevmscan.io/ | Alternative EVM explorer |
| DefiLlama | https://defillama.com/protocol/hyperliquid | TVL and protocol stats |
| DefiLlama Unlocks | https://defillama.com/unlocks/hyperliquid | Token unlock schedule |

### 1.4 Token Contracts and Addresses

| Asset | Address | Network |
|-------|---------|---------|
| HYPE on HyperCore | Native token | Hyperliquid L1 |
| HYPE System Contract (HyperEVM) | 0x2222222222222222222222222222222222222222 | HyperEVM |
| HYPE on Ethereum | 0xA477BE503f3D608f8688f3Cd66b56Af0F2Cf0509 | Ethereum |
| Assistance Fund | 0xfefefefefefefefefefefefefefefefefefefefe | Hyperliquid L1 |
| CoreWriter | 0x3333333333333333333333333333333333333333 | HyperEVM |
| Bridge2 (Arbitrum) | 0x2df1c51e09aecf9cacb7bc98cb1742757f163df7 | Arbitrum One |

### 1.5 Legal and Corporate

| Resource | URL | Purpose |
|----------|-----|---------|
| Hyper Foundation | https://hyperfoundation.org/ | Foundation website |
| Terms of Service | https://app.hyperliquid.xyz/terms | Legal terms |
| USPTO Trademark | https://uspto.report/TM/99599981 | HYPERLIQUID trademark |

### 1.6 Analytics and Data Sources

| Resource | URL | Purpose |
|----------|-----|---------|
| Tokenomist | https://tokenomist.ai/hyperliquid | Tokenomics analysis |
| DropsTab Vesting | https://dropstab.com/coins/hyperliquid/vesting | Vesting visualization |
| ASXN Buybacks | https://data.asxn.xyz/dashboard/hl-buybacks | Buyback tracking |

---

## Part 2: Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants tokenholders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Document the governance mechanism — validator voting via HyperBFT consensus
2. Identify what decisions are subject to validator votes (HIPs, parameter changes, validator jailing)
3. Determine the relationship between HYPE staking and voting power
4. Compare to traditional tokenholder governance (direct voting vs. delegated stake)

**Sources:**
- Staking documentation: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking
- HIP-3 documentation: https://phantom.com/learn/crypto-101/hyperliquid-hip-3
- Validator performance dashboard: https://app.hyperliquid.xyz/staking/validatorPerformance
- Recent governance votes (USDH ticker vote, Assistance Fund burn vote)

**Evidence Required:**
- Documentation of the validator voting process
- Evidence of past governance votes and their execution
- Clear chain from HYPE stake → validator delegation → vote weight → execution

**Gaps/Risks:**
- **Critical:** Governance is validator-based, not direct tokenholder voting. Stakers delegate to validators who vote on their behalf, creating a layer of indirection.
- Need to determine if validators can vote against staker interests without recourse
- Unclear if any actions bypass validator voting entirely

**Sufficiency Standard:**
- ✅ if validators vote onchain and stakers can redelegate to change voting outcomes
- ⚠️ if validator voting exists but stakers have limited control over validator votes
- ❌ if protocol decisions are made by team/foundation without validator input

---

#### 1.2 Role Accountability

**Question:** Are all privileged or value-impacting roles governed, revocable, and accountable to tokenholders?

**Investigation Approach:**
1. Identify all privileged roles in the system (Foundation, team, validators, broadcasters)
2. Determine how each role is appointed and can be removed
3. Document the "8 broadcasters" claim and CoreWriter permissions
4. Investigate validator jailing mechanism and who controls it

**Sources:**
- Staking documentation (validator jailing): https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking
- CoreWriter documentation: HyperEVM docs
- Reverse engineering analysis: https://blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/

**Evidence Required:**
- List of all privileged addresses/roles with their permissions
- Documentation of how each role can be revoked
- Evidence that validators can jail peers through consensus

**Gaps/Risks:**
- **Critical:** The "CoreWriter godmode" claim needs investigation — can it mint tokens or move funds?
- "8 broadcaster addresses" claim — are all transactions routed through trusted parties?
- Foundation's role and whether it can act outside validator consensus

**Sufficiency Standard:**
- ✅ if all roles are validator-elected/revocable with documented permissions
- ⚠️ if some roles (Foundation, broadcasters) have non-revocable powers but are constrained
- ❌ if privileged parties can act unilaterally without validator approval

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded and is it controlled by tokenholders?

**Investigation Approach:**
1. Document how HyperCore (L1) is upgraded
2. Document how HyperEVM contracts are upgraded
3. Determine who controls upgrade keys and timelock (if any)
4. Compare to other L1s (Ethereum, Solana) for context

**Sources:**
- Node repository: https://github.com/hyperliquid-dex/node
- L1 documentation: https://hyperliquid.gitbook.io/hyperliquid-docs/technical-overview/hyperliquid-l1
- Validator documentation

**Evidence Required:**
- Documentation of the upgrade process for the L1
- Evidence of past upgrades and how they were approved
- Any timelock or delay mechanisms

**Gaps/Risks:**
- **Critical:** L1 node code is closed source — cannot verify upgrade mechanisms from code
- Unclear if L1 upgrades require validator consensus or are pushed by team
- HyperEVM upgrades may differ from HyperCore upgrades

**Sufficiency Standard:**
- ✅ if upgrades require validator supermajority and have documented process
- ⚠️ if upgrade process exists but is not fully transparent
- ❌ if team can push upgrades without validator approval

---

#### 1.4 Token Upgrade Authority

**Question:** Can token behavior be modified and is it controlled by tokenholder governance?

**Investigation Approach:**
1. Examine HYPE token implementation on HyperCore (native token)
2. Examine HYPE token contract on Ethereum (0xA477BE503f3D608f8688f3Cd66b56Af0F2Cf0509)
3. Determine if the native token has admin functions
4. Check for proxy patterns or upgrade paths

**Sources:**
- Ethereum HYPE contract: https://etherscan.io/address/0xa477be503f3d608f8688f3cd66b56af0f2cf0509
- System contract documentation: HyperEVM docs
- Bridge documentation

**Evidence Required:**
- HYPE token contract source code (Ethereum version)
- Documentation of native HYPE token behavior
- Evidence of any admin/upgrade functions

**Gaps/Risks:**
- **Critical:** Native HYPE on L1 cannot be verified from source code (closed source L1)
- Bridged HYPE on Ethereum may have different properties than native HYPE
- Need to verify the bridge's upgrade authority

**Sufficiency Standard:**
- ✅ if token is immutable or upgrades require validator consensus
- ⚠️ if token is upgradeable but controlled by governance
- ❌ if token can be upgraded by team/admin without governance

---

#### 1.5 Supply Control

**Question:** Are token supply changes programmatic or subject to tokenholder governance?

**Investigation Approach:**
1. Document the total supply and emission schedule
2. Identify all minting mechanisms (staking rewards, future emissions)
3. Determine who controls the emission parameters
4. Investigate the Assistance Fund burn mechanism

**Sources:**
- Tokenomist: https://tokenomist.ai/hyperliquid
- DefiLlama unlocks: https://defillama.com/unlocks/hyperliquid
- Staking documentation (rewards formula)
- Assistance Fund documentation

**Evidence Required:**
- Total supply cap documentation (1 billion HYPE)
- Emission schedule and formula
- Evidence of burn mechanism execution
- Documentation of who can change emission parameters

**Gaps/Risks:**
- Emission schedule is documented but need to verify it's enforced programmatically
- The Assistance Fund burn mechanism needs verification — is it automatic or manual?
- Team allocations and vesting need verification

**Sufficiency Standard:**
- ✅ if supply is capped and emissions are programmatic
- ⚠️ if governance can change supply parameters
- ❌ if team can mint tokens outside documented schedule

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or restrict economically meaningful protocol actions or exit paths?

**Investigation Approach:**
1. Document the 7-day unstaking queue — can it be extended or blocked?
2. Investigate the "scheduled freeze" mechanism
3. Determine if validators can halt trading or block withdrawals
4. Review the JellyJelly incident response

**Sources:**
- Staking documentation (unstaking queue)
- Reverse engineering analysis: https://blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/
- JellyJelly incident post-mortems
- Terms of service

**Evidence Required:**
- Documentation of all possible freeze/halt mechanisms
- Evidence of past uses of emergency powers
- Documentation of who controls emergency functions

**Gaps/Risks:**
- **Critical:** The JellyJelly incident showed validators can freeze withdrawals and force-settle positions
- "QuarantineUser" and "FreezeChain" functions allegedly leave no ledger entries
- Need to understand the full scope of emergency powers

**Sufficiency Standard:**
- ✅ if no privileged parties can block user exit
- ⚠️ if emergency powers exist but are constrained and transparent
- ❌ if arbitrary freeze/block powers exist without governance approval

---

#### 1.7 Token Censorship

**Question:** Can any roles freeze, blacklist, seize, or censor token balances or transfers?

**Investigation Approach:**
1. Check HYPE token contract for blacklist/freeze functions
2. Investigate reports of address flagging based on third-party tools
3. Review Terms of Service for censorship clauses
4. Compare native HYPE vs. bridged HYPE censorship capabilities

**Sources:**
- Ethereum HYPE contract source
- User reports of flagged addresses
- Terms of service: https://app.hyperliquid.xyz/terms

**Evidence Required:**
- HYPE token contract analysis (Ethereum)
- Documentation of any blacklist mechanisms on L1
- Evidence of addresses being blocked or assets frozen

**Gaps/Risks:**
- **Critical:** User reports indicate addresses can be flagged based on third-party risk tools
- Need to distinguish between exchange-level restrictions and token-level restrictions
- Cannot verify L1 token implementation without source code

**Sufficiency Standard:**
- ✅ if no freeze/blacklist functions exist in token contract
- ⚠️ if exchange can restrict accounts but token transfers are unrestricted
- ❌ if token-level censorship is possible

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to tokenholders currently active rather than theoretical?

**Investigation Approach:**
1. Document the Assistance Fund buyback mechanism
2. Verify buyback activity through onchain data
3. Document staking rewards and their current rates
4. Calculate total value accrued to HYPE holders over time

**Sources:**
- ASXN Buybacks dashboard: https://data.asxn.xyz/dashboard/hl-buybacks
- Assistance Fund address activity
- Staking APY data from explorers
- DefiLlama revenue data: https://defillama.com/protocol/hyperliquid

**Evidence Required:**
- Historical buyback volumes and burn amounts
- Current staking APY
- Revenue breakdown (trading fees, HIP-1 auctions, spot fees)

**Gaps/Risks:**
- Need to verify buybacks are actually burned vs. accumulated
- Staking rewards come from emissions, not protocol revenue (dilutive)
- Fee distribution percentages are not precisely documented

**Sufficiency Standard:**
- ✅ if measurable, ongoing value flows to HYPE holders exist
- ⚠️ if value accrual is active but primarily through dilutive emissions
- ❌ if value accrual is theoretical or not yet active

---

#### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets programmatically controlled by tokenholder governance?

**Investigation Approach:**
1. Identify all treasury addresses (Assistance Fund, Foundation, etc.)
2. Document governance over each treasury
3. Determine if treasuries can be accessed without governance approval

**Sources:**
- Assistance Fund address: 0xfefefefefefefefefefefefefefefefefefefefe
- Hyper Foundation communications
- Governance proposals related to treasury

**Evidence Required:**
- List of all treasury addresses with balances
- Documentation of governance control over each
- Evidence of past treasury actions and their governance process

**Gaps/Risks:**
- Hyper Foundation holds significant tokens — unclear governance relationship
- Assistance Fund may be automated (programmatic) rather than governance-controlled
- Team allocations are in vesting, not treasury per se

**Sufficiency Standard:**
- ✅ if all treasuries require validator governance approval
- ⚠️ if some treasuries are automated/programmatic
- ❌ if Foundation/team can access treasury without governance

---

#### 2.3 Accrual Mechanism Control

**Question:** Can tokenholders modify parameters governing value capture?

**Investigation Approach:**
1. Document all fee parameters and their governance
2. Determine if fee split (HLP vs. Assistance Fund) can be changed
3. Investigate HIP-3 deployer fee controls

**Sources:**
- Fees documentation: https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees
- HIP-3 documentation
- Governance proposals

**Evidence Required:**
- Documentation of which fee parameters are governance-controlled
- Evidence of past fee parameter changes
- Deployer fee configuration options

**Gaps/Risks:**
- Fee structure may be hardcoded rather than governance-controlled
- Unclear if validators can change the 97% AF / 3% HLP split
- Deployer fees are individually set, not governance-controlled

**Sufficiency Standard:**
- ✅ if fee parameters are validator-governance controlled
- ⚠️ if some parameters are hardcoded but key ones are changeable
- ❌ if fee structure cannot be changed by governance

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value accrual flows that benefit tokenholders?

**Investigation Approach:**
1. Investigate any legal entity ownership structures
2. Review Hyper Foundation's relationship to token holders
3. Document any IP or brand licensing arrangements

**Sources:**
- Hyper Foundation website
- Legal documentation
- Corporate filings

**Evidence Required:**
- Documentation of any offchain value flows
- Legal entity structure and token holder relationship

**Gaps/Risks:**
- Hyper Foundation appears independent from token holder governance
- No evidence of offchain revenue sharing arrangements

**Sufficiency Standard:**
- ✅ if documented offchain value flows exist with tokenholder control
- TBD if no offchain value accrual has been verified
- ❌ if offchain value is captured by entities outside tokenholder control

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is the token contract source publicly available and verifiable?

**Investigation Approach:**
1. Verify HYPE contract on Ethereum (Etherscan)
2. Document native HYPE on L1 — what can be verified?
3. Check HyperEVM system contract verification

**Sources:**
- Etherscan: https://etherscan.io/address/0xa477be503f3d608f8688f3cd66b56af0f2cf0509
- HyperScan (Blockscout): https://www.hyperscan.com/
- GitHub contracts repo

**Evidence Required:**
- Verified source code on Etherscan (Ethereum HYPE)
- Documentation of native HYPE implementation
- System contract verification on HyperEVM

**Gaps/Risks:**
- **Critical:** Native HYPE on L1 cannot be source-verified — L1 is closed source
- Bridged HYPE properties may differ from native HYPE
- System contracts on HyperEVM may or may not be verified

**Sufficiency Standard:**
- ✅ if all HYPE implementations are source-verified
- ⚠️ if Ethereum HYPE is verified but native HYPE cannot be verified
- ❌ if no HYPE implementation is verifiable

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verifiable?

**Investigation Approach:**
1. Inventory all Hyperliquid code repositories
2. Determine what is open source vs. closed source
3. Verify deployed contracts against source where possible

**Sources:**
- GitHub organization: https://github.com/hyperliquid-dex
- HyperEVM contract verification on HyperScan
- Node documentation

**Evidence Required:**
- List of all public repositories and their scope
- Evidence of which core components are open source
- Verification of deployed contracts against source

**Gaps/Risks:**
- **Critical:** Core L1 node code is NOT open source
- SDKs and periphery are open source but not the core
- "Will be open sourced when stable" — timeline unknown

**Sufficiency Standard:**
- ✅ if core protocol contracts are verified and open source
- ⚠️ if periphery is open source but core is closed
- ❌ if core protocol cannot be verified from source

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does a single actor or coordinated group control a majority of voting supply?

**Investigation Approach:**
1. Analyze top HYPE holders and their affiliations
2. Calculate Foundation + team + investor concentration
3. Analyze validator stake concentration
4. Determine effective voting power distribution

**Sources:**
- Block explorers (top holders)
- Tokenomist distribution data
- Validator staking dashboard
- Team/Foundation disclosures

**Evidence Required:**
- Top 10 HYPE holder addresses with identification where possible
- Team + Foundation total holdings
- Validator stake distribution (top validators' share)

**Gaps/Risks:**
- Team holds ~23.8% of total supply
- Foundation holdings are separate and significant
- Validator concentration may differ from token holder concentration
- Cannot verify if large holders are independent or coordinated

**Sufficiency Standard:**
- ✅ if no single entity controls >50% of voting power
- ⚠️ if concentration exists but is documented
- ❌ if team/Foundation can unilaterally control governance

---

#### 4.2 Future Token Unlocks

**Question:** Are there known future events that will materially affect concentration?

**Investigation Approach:**
1. Document the full vesting schedule
2. Identify major unlock events
3. Calculate impact on circulating supply

**Sources:**
- DefiLlama unlocks: https://defillama.com/unlocks/hyperliquid
- Tokenomist: https://tokenomist.ai/hyperliquid
- DropsTab: https://dropstab.com/coins/hyperliquid/vesting

**Evidence Required:**
- Full vesting schedule with dates and amounts
- Monthly unlock schedule (1.2M HYPE/month to team)
- Community emissions schedule

**Gaps/Risks:**
- Team unlocks are ongoing (~1.2M HYPE/month through 2028)
- Community emissions add to supply
- Burns from Assistance Fund partially offset inflation

**Sufficiency Standard:**
- ✅ if unlock schedule is transparent and documented
- ⚠️ if significant unlocks exist but are predictable
- ❌ if unlock schedule is unclear or hidden

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question:** Are core trademarks owned by a tokenholder-controlled entity?

**Investigation Approach:**
1. Search USPTO for HYPERLIQUID trademarks
2. Identify the registrant entity
3. Determine relationship to token holders

**Sources:**
- USPTO: https://uspto.report/TM/99599981
- Hyper Foundation corporate filings

**Evidence Required:**
- Trademark registration details
- Registrant entity information
- Governance relationship documentation

**Gaps/Risks:**
- Trademark is held by Hyper Foundation
- Foundation governance relationship to HYPE holders is unclear
- No evidence Foundation is tokenholder-controlled

**Sufficiency Standard:**
- ✅ if trademark is held by tokenholder-governed entity
- ⚠️ if trademark is held by Foundation without clear tokenholder control
- ❌ if trademark is held by unrelated party

---

#### 5.2 Distribution

**Question:** Are primary domains and distribution assets controlled by a tokenholder-controlled entity?

**Investigation Approach:**
1. Identify who controls hyperliquid.xyz domain
2. Review Terms of Service for contracting party
3. Identify hosting and infrastructure controllers

**Sources:**
- Terms of Service: https://app.hyperliquid.xyz/terms
- Domain WHOIS records
- Foundation documentation

**Evidence Required:**
- Domain registration details
- Terms of Service contracting party
- Infrastructure control documentation

**Gaps/Risks:**
- Terms likely identify Hyper Foundation or team as contracting party
- Domain control is typically with team/Foundation
- No evidence of tokenholder control over distribution

**Sufficiency Standard:**
- ✅ if domains/distribution controlled by tokenholder entity
- ⚠️ if controlled by Foundation without clear tokenholder governance
- ❌ if controlled by unrelated entity

---

#### 5.3 Licensing

**Question:** Is core protocol software/IP controlled by a tokenholder-controlled entity?

**Investigation Approach:**
1. Document licenses of all public repositories
2. Identify IP ownership for closed-source components
3. Determine Foundation's role in IP

**Sources:**
- GitHub repository licenses
- Foundation documentation
- Corporate filings

**Evidence Required:**
- License for each repository
- IP ownership documentation
- Foundation governance structure

**Gaps/Risks:**
- **Critical:** Core L1 is closed source — IP ownership unclear
- SDKs use MIT license (permissive)
- No evidence of tokenholder control over core IP

**Sufficiency Standard:**
- ✅ if IP is owned by tokenholder-governed entity or fully open source
- ⚠️ if some IP is open source but core is proprietary
- ❌ if core IP is proprietary with no tokenholder governance

---

## Part 3: Key Investigation Priorities

### Critical Issues Requiring Deep Investigation

1. **Validator Governance vs. Tokenholder Governance**
   - Is delegated stake sufficient for "tokenholder control"?
   - Can validators act against staker interests?
   - What decisions require validator votes vs. team discretion?

2. **Emergency Powers and Censorship**
   - Full scope of freeze/quarantine functions
   - Who authorizes emergency actions?
   - JellyJelly incident: precedent or exception?

3. **Closed Source L1**
   - What can be verified without source code?
   - Are there alternative verification methods?
   - Timeline for open sourcing

4. **Value Accrual Mechanics**
   - Exact fee distribution percentages
   - Buyback vs. burn mechanics verification
   - Staking rewards: emissions vs. revenue

5. **Foundation Governance**
   - Relationship between Hyper Foundation and HYPE holders
   - Foundation's control over key assets
   - Can token holders influence Foundation decisions?

### Areas Where Evidence May Not Exist

1. **L1 Source Code** — Cannot verify core protocol without open sourcing
2. **Foundation Governance** — May not have formal tokenholder control mechanisms
3. **Emergency Function Documentation** — May be intentionally undocumented
4. **Fee Split Parameters** — May not be publicly configurable

---

## Part 4: Evidence Standards

### What Constitutes Sufficient Evidence

For each criterion, evidence should be:

1. **Primary Source** — Documentation, code, or onchain data (not third-party analysis)
2. **Verifiable** — Can be independently confirmed
3. **Current** — Reflects current state (not historical or planned)
4. **Complete** — Covers all relevant aspects of the criterion

### Evidence Types by Category

| Category | Preferred Evidence | Acceptable Evidence | Insufficient Evidence |
|----------|-------------------|---------------------|----------------------|
| Governance | Onchain vote records, contract code | Official documentation | Third-party analysis, team statements |
| Supply | Contract code, explorer data | Official documentation | Tokenomics blog posts |
| Fees | Contract code, onchain flows | Official documentation | Marketing materials |
| Ownership | Contract verification, registry filings | Official statements | Speculation |
| Legal | Official filings, contracts | Foundation statements | Third-party analysis |

---

## Part 5: Research Execution Checklist

### Phase 1: Data Collection
- [ ] Verify all URLs in resource inventory are accessible
- [ ] Download/archive key documentation
- [ ] Capture current onchain state (balances, parameters)
- [ ] Collect validator set and stake distribution
- [ ] Analyze Ethereum HYPE contract source

### Phase 2: Onchain Analysis
- [ ] Map governance execution paths
- [ ] Identify all privileged addresses and their permissions
- [ ] Track Assistance Fund activity
- [ ] Verify buyback and burn transactions
- [ ] Analyze validator voting history

### Phase 3: Documentation Review
- [ ] Complete framework criteria mapping
- [ ] Identify gaps where evidence is missing
- [ ] Document confidence levels for each criterion
- [ ] Flag items requiring assumptions

### Phase 4: Synthesis
- [ ] Draft research report
- [ ] Populate metrics.json entries
- [ ] Populate tokens.json entry
- [ ] Internal consistency review

---

## Appendix: Framework Criteria Summary

| Metric | Criteria | Initial Assessment |
|--------|----------|-------------------|
| **Onchain Control** | Governance Workflow | ⚠️ Validator-based, not direct tokenholder |
| | Role Accountability | ⚠️ CoreWriter/broadcaster concerns |
| | Protocol Upgrade | Unknown — closed source |
| | Token Upgrade | Needs investigation |
| | Supply Control | ✅ Likely programmatic with known schedule |
| | Access Gating | ⚠️ Emergency powers exist |
| | Token Censorship | ⚠️ Reports of flagging |
| **Value Accrual** | Accrual Active | ✅ Buybacks are active |
| | Treasury Ownership | ⚠️ Foundation relationship unclear |
| | Mechanism Control | Unknown |
| | Offchain Accrual | TBD |
| **Verifiability** | Token Source | ⚠️ Ethereum verified, L1 not |
| | Protocol Source | ❌ Core L1 is closed source |
| **Distribution** | Concentration | ⚠️ Team holds ~24% |
| | Supply Schedule | ✅ Well documented |
| **Offchain** | Trademark | ⚠️ Foundation-held |
| | Distribution | ⚠️ Foundation-controlled |
| | Licensing | ⚠️ Core is proprietary |

---

*Plan Version: 1.0*
*Created: 2026-02-24*
*Author: Planner Agent*
