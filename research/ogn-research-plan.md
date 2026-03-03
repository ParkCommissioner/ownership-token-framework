# OGN Token Analysis: Research Plan

## Overview

This plan provides a structured approach to analyzing the OGN token under the Aragon Ownership Token Framework. The framework evaluates tokens across four metrics and offchain dependencies:

1. **Metric 1: Onchain Control** - Who controls economically material outcomes?
2. **Metric 2: Value Accrual** - Does the token have enforceable value flows?
3. **Metric 3: Verifiability** - Is the code independently verifiable?
4. **Metric 4: Token Distribution** - Is voting power meaningfully distributed?
5. **Offchain Dependencies** - What external assets affect token value?

---

## Resource Inventory

### Confirmed Sources

#### Core Contracts (Ethereum)

| Contract | Address | Status |
|----------|---------|--------|
| OGN Token | `0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26` | Verified |
| xOGN Staking | `0x63898b3b6Ef3d39332082178656E9862bee45C57` | Verified |
| OGN Rewards Source | `0x7609c88e5880e934dd3a75bcfef44e31b1badb8b` | Verified |
| OGN Migrator (OGV→OGN) | `0x95c347D6214614A780847b8aAF4f96Eb84f4da6d` | Verified |
| Timelock | `0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F` | Verified |
| Admin Multisig (5/8) | `0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899` | Verified |
| Guardian Multisig (2/9) | `0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC` | Verified |

#### OETH Contracts (Ethereum)

| Contract | Address | Status |
|----------|---------|--------|
| OETH Token | `0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3` | Verified |
| Wrapped OETH | `0xDcEe70654261AF21C44c093C300eD3Bb97b78192` | Verified |
| OETH Vault | `0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab` | Verified |
| Fixed Rate Dripper | `0xe3b3b4fc77505ecfaacf6dd21619a8cc12fcc501` | Verified |
| Curve AMO Strategy | `0xba0e352AB5c13861C26e4E773e7a833C3A223FE6` | Verified |

#### Multi-chain Presence

| Chain | Contract | Address |
|-------|----------|---------|
| Base | OGN Token | `0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7` |
| Base | Timelock | `0xf817cb3092179083c48c014688D98B72fB61464f` |
| Base | Admin Multisig (5/8) | `0x92A19381444A001d62cE67BaFF066fA1111d7202` |
| Base | Guardian Multisig (2/9) | `0x28bce2eE5775B652D92bB7c2891A89F036619703` |

#### Deprecated Contracts

| Contract | Address | Notes |
|----------|---------|-------|
| OGV Token | `0x9c354503c38481a7a7a51629142963f98ecc12d0` | Merged into OGN |
| veOGV Staking | `0x0C4576Ca1c365868E162554AF8e385dc3e7C66D9` | Replaced by xOGN |

#### Documentation

| Resource | URL | Status |
|----------|-----|--------|
| Origin Docs | https://docs.originprotocol.com | Confirmed |
| Governance Docs | https://docs.originprotocol.com/ogn/governance | Confirmed |
| Staking Docs | https://docs.originprotocol.com/ogn/staking-xogn | Confirmed |
| Contract Registry | https://docs.originprotocol.com/registry/contracts | Confirmed |
| OETH Registry | https://docs.originprotocol.com/registry/contracts/oeth-registry | Confirmed |
| Governance Forum | https://governance.originprotocol.com | Confirmed |
| Snapshot | https://snapshot.org/#/origingov.eth | To verify |

#### Code Repositories

| Repository | URL | Status |
|------------|-----|--------|
| origin-dollar (OETH/OUSD) | https://github.com/OriginProtocol/origin-dollar | Confirmed |
| OriginProtocol org | https://github.com/originprotocol | Confirmed |

#### Block Explorers

| Chain | URL |
|-------|-----|
| Ethereum | https://etherscan.io/token/0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 |
| Base | https://basescan.org/token/0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7 |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question**: Does an onchain process grant xOGN holders ultimate authority over protocol decisions?

**Investigation Approach**:
1. Read xOGN staking contract (`0x63898b3b6Ef3d39332082178656E9862bee45C57`) to understand voting power mechanics
2. Trace the proposal → vote → execution path from Snapshot to Timelock
3. Verify Timelock (`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`) is the executor for protocol changes
4. Confirm governance parameters: quorum (20% xOGN), voting period (48h), timelock delay (2 days)

**Sources**:
- xOGN contract on Etherscan
- Timelock contract on Etherscan
- https://docs.originprotocol.com/ogn/governance
- Snapshot proposal history

**Evidence Required**:
- Contract code showing xOGN balance → voting weight relationship
- Timelock admin is controlled by governance
- Recent executed proposals demonstrating the flow

**Done When**: Can trace a complete path from xOGN balance to protocol execution authority.

---

#### 1.2 Role Accountability

**Question**: Are all privileged roles governed, revocable, and accountable to xOGN holders?

**Investigation Approach**:
1. Identify all privileged roles: Admin (5/8), Guardian (2/9), Strategist
2. For each role, determine: what powers they have, who can revoke them, whether they can bypass governance
3. Read OETH Vault contract for strategist permissions (`onlyGovernorOrStrategist`, `onlyVaultOrGovernorOrStrategist` modifiers)
4. Analyze Guardian powers: can pause deposits/redeems, rebalance strategies without timelock

**Sources**:
- VaultAdmin.sol in origin-dollar repo
- Guardian multisig transactions on Etherscan
- https://docs.originprotocol.com/ogn/governance

**Evidence Required**:
- Complete list of privileged roles with their powers
- Evidence that Timelock/Governance can revoke each role
- Scope of Guardian bypass capabilities

**Gaps/Concerns**:
- Guardian (2/9) can act without timelock — need to assess what this means for tokenholder control
- Strategist role powers and who controls appointment

**Done When**: Have a complete role matrix showing all privileged actors, their powers, and revocation paths.

---

#### 1.3 Protocol Upgrade Authority

**Question**: Can core protocol logic be upgraded, and if so, is it controlled by tokenholders?

**Investigation Approach**:
1. Check if OGN token is upgradeable (proxy pattern?)
2. Check if OETH/OUSD vaults are upgradeable
3. Trace upgrade admin for each upgradeable contract back to Timelock
4. Verify Timelock is controlled by governance

**Sources**:
- OGN token contract (`0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26`) — check for proxy patterns
- OETH Vault proxy admin
- origin-dollar GitHub repo for upgrade mechanisms

**Evidence Required**:
- List of upgradeable contracts with their proxy admin
- Chain of control: Contract → Proxy Admin → Timelock → Governance
- Any contracts that are immutable

**Done When**: Can definitively state upgrade authority for all economically material contracts.

---

#### 1.4 Token Upgrade Authority

**Question**: Can OGN token behavior be modified?

**Investigation Approach**:
1. Read OGN token contract for proxy patterns
2. If upgradeable, trace admin to governance
3. Check for any admin functions (pause, blacklist, etc.)

**Sources**:
- OGN contract on Etherscan
- https://etherscan.io/token/0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26#code

**Evidence Required**:
- Whether OGN is upgradeable
- If upgradeable, who controls upgrades
- If immutable, confirmation of no upgrade path

**Done When**: Can definitively classify OGN token upgrade authority.

---

#### 1.5 Supply Control

**Question**: Are token supply changes programmatic or governance-controlled?

**Investigation Approach**:
1. Check OGN token contract for mint functions
2. Who has mint authority? Is it capped?
3. Verify no new OGN emissions (per search results: "no new emissions")
4. Review OGV→OGN migration mechanics and whether migration is still active

**Sources**:
- OGN token contract
- OGN Migrator contract (`0x95c347D6214614A780847b8aAF4f96Eb84f4da6d`)
- CoinGecko/CoinMarketCap for supply data

**Evidence Required**:
- Mint function analysis (who can call, any caps)
- Current total supply vs max supply
- Migration contract status (active/closed)

**Done When**: Can classify supply control as immutable, programmatic, or governance-controlled.

---

#### 1.6 Privileged Access Gating

**Question**: Can any actor block or restrict economically meaningful protocol actions?

**Investigation Approach**:
1. Analyze Guardian powers in OETH/OUSD vaults
2. What can Guardian pause? (deposits, redeems, strategies)
3. Can users always exit? (withdraw from vault even if paused?)
4. Any other access restrictions?

**Sources**:
- VaultAdmin.sol — pause functions
- Guardian transaction history
- OETH/OUSD docs on emergency procedures

**Evidence Required**:
- Complete list of pausable functions
- Exit paths during pause states
- Historical use of pause functions (if any)

**Gaps/Concerns**:
- Guardian can pause without governance approval — is this a threat to user funds?

**Done When**: Can assess whether Guardian powers constitute meaningful access gating.

---

#### 1.7 Token Censorship

**Question**: Can any role freeze, blacklist, or seize OGN tokens?

**Investigation Approach**:
1. Read OGN token contract for blacklist/freeze/pause functions
2. Check transfer function for any restrictions
3. Compare to standard ERC20

**Sources**:
- OGN token contract code

**Evidence Required**:
- Presence/absence of blacklist, freeze, pause functions
- Transfer function analysis

**Done When**: Can definitively state whether OGN has censorship capabilities.

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question**: Are value flows to xOGN holders currently active?

**Investigation Approach**:
1. Verify the "100% of protocol fees → OGN buybacks → xOGN distribution" mechanism
2. Find the buyback contract and verify recent activity
3. Trace fee flows from OETH/OUSD vaults to buyback mechanism
4. Check xOGN rewards distribution contract for recent activity

**Sources**:
- OGN Rewards Source contract (`0x7609c88e5880e934dd3a75bcfef44e31b1badb8b`)
- Buyback Operator multisig (`0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c`)
- OETH Dripper contract
- Transaction history on Etherscan

**Evidence Required**:
- Recent buyback transactions
- Recent reward distribution transactions to xOGN
- Fee collection evidence from OETH/OUSD

**Done When**: Can verify active, observable value flows from protocol operation to xOGN holders.

---

#### 2.2 Treasury Ownership

**Question**: Are protocol treasury assets controlled by xOGN governance?

**Investigation Approach**:
1. Identify all treasury addresses
2. Verify admin/owner is Timelock or governance-controlled
3. Check if Admin multisig has direct treasury access

**Sources**:
- Treasury contract(s) — need to identify
- Timelock permissions

**Evidence Required**:
- Treasury addresses and balances
- Owner/admin of each treasury
- Whether governance can direct treasury usage

**Gaps/Concerns**:
- Need to identify specific treasury contracts

**Done When**: Can state whether treasury is governance-controlled.

---

#### 2.3 Accrual Mechanism Control

**Question**: Can xOGN holders modify fee parameters and revenue routing?

**Investigation Approach**:
1. Identify fee parameters in OETH/OUSD vaults
2. Who can change fees? (should be Timelock/governance)
3. Can the buyback mechanism be changed or redirected?
4. Revenue split parameters

**Sources**:
- OETH Vault contract — fee functions
- Governance proposals related to fee changes
- https://docs.originprotocol.com/yield-bearing-tokens/ousd (fee info)

**Evidence Required**:
- Fee parameter locations in contracts
- Admin/setter functions for fees
- Recent fee-related governance proposals

**Done When**: Can classify accrual mechanism control (tokenholder-controlled vs discretionary).

---

#### 2.4 Offchain Value Accrual

**Question**: Are there offchain value flows benefiting xOGN holders?

**Investigation Approach**:
1. Research Origin Protocol Labs legal structure
2. Any revenue sharing agreements documented?
3. Check Terms of Service for relevant disclosures

**Sources**:
- https://www.originprotocol.com/tos
- Any legal entity filings (speculative)

**Evidence Required**:
- Documentation of offchain value flows (if any)
- Legal entity structure

**Done When**: Can assess whether offchain accrual exists and is enforceable.

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question**: Is OGN token source publicly available and verified on Etherscan?

**Investigation Approach**:
1. Check Etherscan verification status
2. Match to GitHub source

**Sources**:
- https://etherscan.io/token/0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26#code

**Evidence Required**:
- Etherscan verification badge
- GitHub source link

**Done When**: Verified or not verified.

---

#### 3.2 Protocol Component Source Verification

**Question**: Are OETH/OUSD and governance contracts publicly accessible and verified?

**Investigation Approach**:
1. Check all key contracts on Etherscan for verification
2. Match to GitHub origin-dollar repo
3. Verify xOGN staking contract

**Sources**:
- Etherscan for each contract
- https://github.com/OriginProtocol/origin-dollar

**Evidence Required**:
- Verification status for: OETH Vault, OUSD Vault, xOGN, Timelock, strategies
- GitHub repo availability

**Done When**: Complete verification status for all economically material contracts.

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question**: Does any single actor or coordinated group control majority voting power?

**Investigation Approach**:
1. Analyze xOGN holder distribution
2. Identify largest holders and their relationship (team, investors, DAOs)
3. Check for common control indicators

**Sources**:
- xOGN holders on Etherscan
- Token holder analytics (Dune, Arkham)
- Team/investor disclosures

**Evidence Required**:
- Top 10-20 xOGN holders
- Assessment of common control
- Team/investor holdings if disclosed

**Gaps/Concerns**:
- Difficult to determine common control without insider information

**Done When**: Can assess concentration risk with available evidence.

---

#### 4.2 Future Token Unlocks

**Question**: Are there vesting cliffs or unlocks that will materially change distribution?

**Investigation Approach**:
1. Research OGN vesting schedule
2. Check for any remaining locked allocations
3. OGV migration impact on supply

**Sources**:
- https://cryptorank.io/price/origin-protocol/vesting
- Team announcements about unlock schedules
- OGV migration contract — remaining claimable

**Evidence Required**:
- Vesting schedule documentation
- Upcoming unlock events

**Done When**: Can state whether material unlocks are expected.

---

### Offchain Dependencies

#### 5.1 Trademark

**Question**: Are Origin trademarks owned by a tokenholder-controlled entity?

**Investigation Approach**:
1. Search USPTO for "Origin Protocol" trademarks
2. Identify registrant/owner
3. Assess relationship to governance

**Sources**:
- USPTO trademark database
- https://www.originprotocol.com/tos (legal entity)

**Evidence Required**:
- Trademark filings and owners
- Relationship between trademark owner and DAO

**Done When**: Can identify trademark holder and assess governance alignment.

---

#### 5.2 Distribution (Domains/Interfaces)

**Question**: Are primary domains controlled by tokenholders?

**Investigation Approach**:
1. Check Terms of Service for operating entity
2. Identify who controls originprotocol.com, app interfaces
3. ENS: ogn.eth ownership

**Sources**:
- https://www.originprotocol.com/tos
- WHOIS for domains (if public)
- ENS for ogn.eth

**Evidence Required**:
- Operating entity for interfaces
- Domain registrant (if determinable)

**Done When**: Can assess interface control alignment.

---

#### 5.3 Licensing

**Question**: Is protocol IP controlled by tokenholder governance?

**Investigation Approach**:
1. Check GitHub license for origin-dollar repo
2. Identify any commercial IP restrictions
3. Assess if governance controls licensing

**Sources**:
- GitHub repo LICENSE file
- Any IP-related governance proposals

**Evidence Required**:
- License type (MIT, GPL, proprietary, etc.)
- IP ownership documentation

**Done When**: Can classify licensing situation.

---

## Special Investigation Areas (from task.md)

### Multi-Product Governance Scope

**Question**: Which products does OGN governance actually control?

**Investigation**:
1. For each product (OETH, OUSD, Super OETH), trace admin/owner to governance
2. Document any products with team-controlled admin
3. Map governance scope explicitly

**Products to analyze**:
- OETH (Ethereum)
- OUSD (Ethereum)
- Super OETH (Base)
- ARM (if applicable)

---

### xOGN Deep Dive

**Question**: What does xOGN actually give holders?

**Investigation**:
1. Voting power mechanics (exponential decay)
2. Revenue sharing mechanics (buyback distribution)
3. Lock period effects (1 month to 1 year, 1.4x multiplier for 1-year)
4. Enforceability of rewards (is it programmatic or discretionary?)

---

### Legacy OGV Authority

**Question**: Do deprecated OGV contracts still hold any authority?

**Investigation**:
1. Check if veOGV can still vote
2. Check if OGV staking contract has any residual permissions
3. Migration contract — can it still mint OGN?

---

### Multi-Chain Governance

**Question**: Is governance consistent across Ethereum and Base?

**Investigation**:
1. Compare Ethereum vs Base admin/guardian structures
2. Are Base contracts controlled by Ethereum governance?
3. Cross-chain execution mechanisms

---

## Anticipated Gaps and Risks

### High Concern Areas

1. **Guardian Bypass Powers**: The 2/9 Guardian multisig can execute without timelock. Need to carefully document scope and assess if this constitutes discretionary control.

2. **Strategist Role**: Strategist can rebalance, pause, and withdraw from strategies. Need to determine if this presents economic risk and whether governance controls strategist appointment.

3. **Multi-Chain Fragmentation**: Base governance structure may differ from Ethereum. Need to verify consistency.

4. **Offchain Entity Control**: Origin Protocol Labs (Cayman) controls trademarks and interfaces. Need to assess if this undermines tokenholder control.

### Moderate Concern Areas

1. **Token Distribution Data**: May be difficult to get comprehensive xOGN holder data to assess concentration.

2. **Legacy OGV**: Residual permissions from OGV system may exist.

3. **Revenue Flow Verification**: Need to trace actual fee flows onchain to verify the "100% to stakers" claim.

### Low Concern Areas

1. **Source Verification**: All contracts appear to be verified on Etherscan.
2. **Governance Workflow**: Standard Snapshot → Timelock flow is well-documented.

---

## Evidence Sufficiency Standards

For each criteria, evidence must meet these standards:

### ✅ Positive (Tokenholder-Controlled)
- Direct link from xOGN balance to execution authority
- No bypass paths that don't route through governance
- Immutable or governance-controlled

### ⚠️ At Risk (Discretionary Elements)
- Bypass paths exist (multisig, guardian, etc.)
- Tokenholder consent not required for some material actions
- Authority unclear or contingent

### TBD (Insufficient Evidence)
- Cannot verify from primary sources
- Requires insider information to assess
- Evidence contradictory or incomplete

---

## Output Artifacts

This research plan will produce:

1. **ogn-research.md**: Exhaustive research report with all evidence
2. **ogn-tokens.json**: Token entry matching existing schema
3. **ogn-metrics.json**: Complete metrics data with evidence groups

All artifacts will be written to `../output/` and committed to the `ogn` branch.

---

## Next Steps

1. Execute contract analysis for each criteria
2. Collect evidence links and code references
3. Assess each criteria against evidence sufficiency standards
4. Produce research report
5. Generate JSON entries
6. Commit to GitHub and deploy
