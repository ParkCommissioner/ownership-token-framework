# HYPE Token Research Plan

## Aragon Ownership Token Framework Analysis

**Token:** HYPE (Hyperliquid)
**Network:** Hyperliquid L1 (with bridges to Ethereum/Arbitrum)
**Date:** 2026-02-24
**Plan Version:** 2.0 (Revised per reviewer feedback)

---

## Executive Summary

This research plan maps each criterion in the Aragon Ownership Token Framework to specific Hyperliquid resources and investigation approaches. The HYPE token presents unique challenges compared to EVM-based protocols because:

1. **Hyperliquid is an L1 chain** — The HYPE token is native to Hyperliquid's own blockchain, not an ERC-20 on Ethereum
2. **Closed-source core** — The L1 node code is not open source; verification requires alternative approaches
3. **Novel architecture** — HyperCore (native trading) + HyperEVM (smart contracts) dual architecture
4. **Validator-based governance** — Governance operates through validator voting rather than token-weighted onchain voting

---

## Part 1: L1 Investigation Methods

### 1.1 Hyperliquid Info API

The primary method for querying Hyperliquid L1 state is the Info API endpoint.

**Base URLs:**
- Mainnet: `https://api.hyperliquid.xyz/info`
- Testnet: `https://api.hyperliquid-testnet.xyz/info`

**Request Format:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type": "<query_type>", ...params}' \
  https://api.hyperliquid.xyz/info
```

### 1.2 Validator and Staking Queries

| Query Type | Request | Returns |
|------------|---------|---------|
| `validatorSummaries` | `{"type": "validatorSummaries"}` | All validators with addresses, names, stakes, commission rates |
| `delegations` | `{"type": "delegations", "user": "0x..."}` | User's delegations: validator address, amount, lock expiration |
| `delegatorSummary` | `{"type": "delegatorSummary", "user": "0x..."}` | Delegated/undelegated amounts, pending withdrawals |
| `delegatorHistory` | `{"type": "delegatorHistory", "user": "0x..."}` | Staking transaction history with timestamps |
| `delegatorRewards` | `{"type": "delegatorRewards", "user": "0x..."}` | Reward distribution history |

**Example: Get all validators**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "validatorSummaries"}' \
  https://api.hyperliquid.xyz/info
```

### 1.3 Token and Spot Asset Queries

| Query Type | Request | Returns |
|------------|---------|---------|
| `spotMeta` | `{"type": "spotMeta"}` | All tokens: name, decimals, tokenId, canonical status |
| `spotMetaAndAssetCtxs` | `{"type": "spotMetaAndAssetCtxs"}` | Token metadata + prices + volume |
| `tokenDetails` | `{"type": "tokenDetails", "tokenId": "0x..."}` | Max/total/circulating supply, deployer, genesis |
| `spotClearinghouseState` | `{"type": "spotClearinghouseState", "user": "0x..."}` | User's token balances |

**Example: Get HYPE token details**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "tokenDetails", "tokenId": "HYPE_TOKEN_ID"}' \
  https://api.hyperliquid.xyz/info
```

### 1.4 User Account and Fee Queries

| Query Type | Request | Returns |
|------------|---------|---------|
| `userFees` | `{"type": "userFees", "user": "0x..."}` | Fee schedule, tier rates, discounts |
| `userRole` | `{"type": "userRole", "user": "0x..."}` | Account type (user/agent/vault/subAccount) |
| `vaultDetails` | `{"type": "vaultDetails", "vaultAddress": "0x..."}` | Vault metadata, performance, followers |

### 1.5 Explorer APIs

**HypurrScan API** (Community explorer)
- Endpoint: `https://hypurrscan.io/api/` (investigate for availability)
- Use for: Transaction history, address activity, governance events

**HyperScan (Blockscout)** for HyperEVM
- Endpoint: `https://www.hyperscan.com/api/`
- Standard Blockscout API for EVM contract queries

### 1.6 Python SDK Methods

```python
from hyperliquid.info import Info

info = Info(base_url="https://api.hyperliquid.xyz")

# Validator queries
validators = info.request({"type": "validatorSummaries"})

# Staking queries for a user
delegations = info.request({"type": "delegations", "user": "0x..."})
summary = info.request({"type": "delegatorSummary", "user": "0x..."})

# Token info
tokens = info.request({"type": "spotMeta"})
```

---

## Part 2: Resource Inventory

### 2.1 Official Documentation (Confirmed Accessible)

| Resource | URL | Content |
|----------|-----|---------|
| Main Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs | Primary technical docs |
| Staking Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking | Validator and staking mechanics |
| Fees Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees | Fee structure and distribution |
| L1 Overview | https://hyperliquid.gitbook.io/hyperliquid-docs/technical-overview/hyperliquid-l1 | Chain architecture |
| HyperEVM Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm | EVM execution layer |
| API Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api | Developer API |
| Info Endpoint | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint | Query reference |
| Spot API | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/spot | Spot token queries |
| Bridge2 Documentation | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2 | Bridge mechanics |
| Wrapped HYPE | https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/wrapped-hype | WHYPE contract |

### 2.2 GitHub Repositories (Confirmed Accessible)

| Repository | URL | License | Status |
|------------|-----|---------|--------|
| hyperliquid-dex (org) | https://github.com/hyperliquid-dex | Various | Main organization |
| hyperliquid-python-sdk | https://github.com/hyperliquid-dex/hyperliquid-python-sdk | MIT | Open source |
| hyperliquid-rust-sdk | https://github.com/hyperliquid-dex/hyperliquid-rust-sdk | MIT | Open source |
| node | https://github.com/hyperliquid-dex/node | Apache-2.0 | Node setup (not core code) |
| contracts | https://github.com/hyperliquid-dex/contracts | TBD | Smart contracts |

**Critical Gap:** The core L1 node code is NOT open source. The `node` repo contains setup instructions, not the actual consensus/execution code.

### 2.3 Block Explorers and Dashboards

| Resource | URL | Purpose |
|----------|-----|---------|
| Native Explorer | https://app.hyperliquid.xyz/explorer | Official Hyperliquid explorer |
| Staking Dashboard | https://app.hyperliquid.xyz/staking | Validator and staking stats |
| Validator Performance | https://app.hyperliquid.xyz/staking/validatorPerformance | Validator metrics |
| HypurrScan | https://hypurrscan.io/ | Community L1 explorer |
| Owlscan | https://owlscan.org | L1 explorer with staking data |
| HyperScan (Blockscout) | https://www.hyperscan.com/ | HyperEVM explorer |
| DefiLlama | https://defillama.com/protocol/hyperliquid | TVL and protocol stats |
| DefiLlama Unlocks | https://defillama.com/unlocks/hyperliquid | Token unlock schedule |

### 2.4 Privileged Addresses (Known)

| Role | Address | Network | Source |
|------|---------|---------|--------|
| HYPE Native Token | Native asset | Hyperliquid L1 | Protocol |
| WHYPE Contract | 0x5555555555555555555555555555555555555555 | HyperEVM | Docs |
| CoreWriter | 0x3333333333333333333333333333333333333333 | HyperEVM | Docs |
| Assistance Fund | 0xfefefefefefefefefefefefefefefefefefefefe | Hyperliquid L1 | Docs |
| Bridge2 (Arbitrum) | 0x2df1c51e09aecf9cacb7bc98cb1742757f163df7 | Arbitrum One | Docs |
| Broadcaster 1 | 0x1e9b90ab34427807dc25c7266beb188e86af7ed6 | L1 | RE Analysis |
| Broadcaster 2 | 0x2d9d6ae54b069fd372401b71dc4843d85babe3ea | L1 | RE Analysis |
| Broadcaster 3 | 0x67e451964e0421f6e7d07be784f35c530667c2b3 | L1 | RE Analysis |
| Broadcaster 4 | 0x76d335fbd515969ed5facf98611ca6e3ba87ff01 | L1 | RE Analysis |
| Broadcaster 5 | 0x90eaf322d6e39adbdca7b632ec2436719a99fcd0 | L1 | RE Analysis |
| Broadcaster 6 | 0x940e4f78cfb16e07e1e2ef0994e186bde7e6478c | L1 | RE Analysis |
| Broadcaster 7 | 0xf70a9d9a56fe5c75815a9eae6a8593bc59cb6a06 | L1 | RE Analysis |
| Broadcaster 8 | 0xffbb4dfc9455f0df2e973d7a371d8ad994264aa6 | L1 | RE Analysis |

### 2.5 Third-Party Analysis Sources (Verified Accessible)

| Resource | URL | Status |
|----------|-----|--------|
| Reverse Engineering Analysis | https://blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/ | Verified accessible |
| ASXN Buybacks | https://data.asxn.xyz/dashboard/hl-buybacks | Verify accessibility |
| Tokenomist | https://tokenomist.ai/hyperliquid | Verified accessible |

### 2.6 Legal and Corporate

| Resource | URL | Purpose |
|----------|-----|---------|
| Hyper Foundation | https://hyperfoundation.org/ | Foundation website |
| Terms of Service | https://app.hyperliquid.xyz/terms | Legal terms |
| USPTO Trademark | https://uspto.report/TM/99599981 | HYPERLIQUID trademark |

---

## Part 3: Specific Functions to Investigate

### 3.1 Governance Action Types (VoteGlobalAction Variants)

Per reverse engineering analysis, 89 governance action variants exist. Key ones to investigate:

| Action | Code | Description | Risk Level |
|--------|------|-------------|------------|
| `FreezeChain` | 0x20 | Halts chain permanently at specified height | Critical |
| `QuarantineUser` | 0x1A | Freezes user account permanently | Critical |
| `ModifyBroadcaster` | 0x26 | Changes broadcaster whitelist | Critical |
| `SetOracle` | variant 2 | Arbitrary price manipulation | Critical |
| `AllowedBridgeValidators` | TBD | Replace bridge validator set | Critical |
| `invalidateWithdrawals` | case 7 | Cancel pending withdrawals | Critical |
| `SetBole` | 0x50 | Configure lending protocol | High |
| `OverrideMaxSignedDistancesFromOracle` | TBD | Override oracle constraints | High |
| `TestnetSetYesterdayUserVlm` | 0x57 | Retroactive volume manipulation | Medium |

### 3.2 CoreWriter Capabilities (Alleged)

Per reverse engineering analysis, CoreWriter allegedly can:
- Mint tokens arbitrarily
- Transfer user funds without signatures
- Crash validators
- Execute arbitrary state modifications

**Investigation approach:**
1. Review official CoreWriter documentation
2. Compare claims against official docs
3. Check if CoreWriter is called by governance or operates independently
4. Document any safeguards or constraints

### 3.3 WHYPE Contract Functions

The WHYPE contract is documented as immutable with WETH-equivalent code:

| Function | Purpose | Admin? |
|----------|---------|--------|
| `deposit()` | Wrap native HYPE | No |
| `withdraw(uint)` | Unwrap WHYPE | No |
| `fallback()` | Auto-deposit | No |
| `transfer()` | ERC20 transfer | No |
| `approve()` | ERC20 approve | No |

**Expected result:** No admin functions (immutable contract)

### 3.4 Bridge Contract Functions

Bridge2 on Arbitrum (0x2df1c51e09aecf9cacb7bc98cb1742757f163df7):
- Investigate for upgrade functions
- Check owner/admin roles
- Document withdrawal mechanisms
- Check for pause/freeze functions

---

## Part 4: Ownership Chain Investigation

### 4.1 Ownership Chain Template

For each privileged function, document:
```
Function → Direct Controller → Controller's Controller → ... → Ultimate Authority
```

### 4.2 Key Ownership Chains to Trace

**Chain 1: Protocol Upgrades**
```
L1 Code → ? → ?
HyperEVM Contracts → ? → ?
```
Investigation: How are L1 upgrades deployed? Who authorizes them?

**Chain 2: Token Supply**
```
HYPE Minting → Staking Rewards → Emission Schedule (programmatic?)
HYPE Minting → ? → If any other minting path exists
```
Investigation: Is all minting programmatic or can governance mint?

**Chain 3: Emergency Powers**
```
FreezeChain → VoteGlobalAction → Validator Consensus (>2/3 stake)
QuarantineUser → VoteGlobalAction → Validator Consensus (>2/3 stake)
invalidateWithdrawals → VoteGlobalAction → Validator Consensus (>2/3 stake)
```
Investigation: Confirm this chain. Are there bypasses?

**Chain 4: Fee Parameters**
```
Trading Fees → ? → Fee Router → HLP / Assistance Fund
Fee Rates → ? → Governance?
```
Investigation: Who controls fee parameters?

**Chain 5: Broadcaster Control**
```
Transaction Submission → Broadcaster Whitelist → ModifyBroadcaster → Validator Consensus
```
Investigation: Can broadcasters censor transactions? What's the governance path?

**Chain 6: Bridge Control**
```
Bridge Withdrawals → Bridge Validators → AllowedBridgeValidators → Validator Consensus
```
Investigation: Can bridge validators block withdrawals? What constraints exist?

### 4.3 Ownership Chain Documentation Format

For each chain, document:
1. **Function:** What action is being controlled
2. **Direct controller:** The immediate entity that can execute
3. **Control path:** Full chain to ultimate authority
4. **Evidence:** API queries, documentation, or onchain data proving the chain
5. **Bypasses:** Any alternative paths that skip the chain
6. **Constraints:** Timelocks, quorums, or other limitations

---

## Part 5: Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants tokenholders ultimate authority over protocol decisions?

**Investigation Steps:**
1. Query `validatorSummaries` to enumerate all validators
2. Query validator governance documentation
3. Document the HyperBFT consensus mechanism
4. Identify all decisions subject to validator voting (HIPs, parameters, jailing)
5. Trace: HYPE stake → delegation → validator vote → execution

**API Queries:**
```bash
# Get all validators
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "validatorSummaries"}' \
  https://api.hyperliquid.xyz/info

# Check staking for Foundation/team addresses
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "delegations", "user": "<FOUNDATION_ADDRESS>"}' \
  https://api.hyperliquid.xyz/info
```

**Completeness Criteria:**
- [ ] All validators enumerated with stakes
- [ ] Governance mechanism documented (how votes work)
- [ ] At least 3 example governance decisions documented
- [ ] Relationship between stake and vote weight confirmed
- [ ] Any bypass paths identified

**Evidence Required:**
- Validator list with stake distribution
- Documentation of governance voting process
- Historical governance votes with execution evidence

---

#### 1.2 Role Accountability

**Question:** Are all privileged or value-impacting roles governed, revocable, and accountable to tokenholders?

**Investigation Steps:**
1. Enumerate all 8 broadcaster addresses (from 2.4)
2. Query for any additional privileged addresses
3. Document CoreWriter permissions
4. Document validator jailing mechanism
5. For each role: document appointment, revocation, and constraints

**Privileged Roles to Investigate:**

| Role | Known Addresses | Permissions | Revocable? |
|------|-----------------|-------------|------------|
| Broadcasters | 8 addresses (see 2.4) | Transaction submission | Via ModifyBroadcaster |
| CoreWriter | 0x333...333 | See 3.2 | Unknown |
| Oracle Updater | Unknown | Price feeds | Unknown |
| Liquidators | Unknown (whitelist) | Execute liquidations | Unknown |
| Bridge Validators | Unknown | Bridge operations | Via AllowedBridgeValidators |
| Emergency Admin | Unknown | FreezeChain, QuarantineUser | Unknown |

**Completeness Criteria:**
- [ ] All 8 broadcaster addresses verified
- [ ] CoreWriter permissions documented
- [ ] Oracle updater address identified
- [ ] Liquidator whitelist investigated
- [ ] Bridge validator set identified
- [ ] For each role: appointment mechanism documented
- [ ] For each role: revocation mechanism documented

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded and is it controlled by tokenholders?

**Investigation Steps:**
1. Document L1 upgrade mechanism (validator software updates)
2. Check HyperEVM contracts for proxy patterns
3. Query WHYPE contract to confirm immutability
4. Investigate bridge contract upgradeability

**Ownership Chain:**
```
L1 Code Upgrade → Validator software update → Voluntary validator adoption?
HyperEVM Contract Upgrade → Proxy pattern? → Admin? → ?
```

**Completeness Criteria:**
- [ ] L1 upgrade mechanism documented
- [ ] HyperEVM contract upgradeability checked
- [ ] WHYPE confirmed immutable
- [ ] Bridge contract upgradeability documented
- [ ] Full upgrade authority chain documented

---

#### 1.4 Token Upgrade Authority

**Question:** Can token behavior be modified and is it controlled by tokenholder governance?

**Investigation Steps:**
1. Confirm native HYPE is part of L1 protocol (not a contract)
2. Verify WHYPE is immutable
3. Check for any proxy patterns on token-related contracts

**Key Finding:**
- Native HYPE: Part of L1 protocol, changes require L1 upgrade
- WHYPE: Immutable (per official docs, same code as WETH)

**Completeness Criteria:**
- [ ] Native HYPE modification path documented
- [ ] WHYPE immutability verified via Blockscout
- [ ] Any other HYPE representations checked

---

#### 1.5 Supply Control

**Question:** Are token supply changes programmatic or subject to tokenholder governance?

**Investigation Steps:**
1. Document total supply cap (1 billion)
2. Query emission schedule from staking docs
3. Verify emission formula: `rate ∝ 1/√(total_staked)`
4. Document Assistance Fund burn mechanism
5. Check if governance can change emission parameters

**API Queries:**
```bash
# Get HYPE token details
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "tokenDetails", "tokenId": "HYPE"}' \
  https://api.hyperliquid.xyz/info

# Check Assistance Fund activity
# (investigate explorer for burn transactions)
```

**Completeness Criteria:**
- [ ] Total supply cap documented with evidence
- [ ] Current circulating supply documented
- [ ] Emission schedule formula documented
- [ ] All minting paths identified
- [ ] Burn mechanism verified
- [ ] Governance control over supply parameters documented

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or restrict economically meaningful protocol actions or exit paths?

**Investigation Steps:**
1. Document 7-day unstaking queue
2. Investigate FreezeChain function
3. Investigate QuarantineUser function
4. Document invalidateWithdrawals function
5. Review JellyJelly incident response
6. Document broadcaster transaction censorship potential

**Key Functions to Investigate:**

| Function | Can block exits? | Evidence |
|----------|------------------|----------|
| FreezeChain (0x20) | Yes (entire chain) | RE analysis |
| QuarantineUser (0x1A) | Yes (specific user) | RE analysis |
| invalidateWithdrawals (case 7) | Yes (pending withdrawals) | RE analysis |
| 7-day unstaking queue | Time delay, not block | Official docs |

**Completeness Criteria:**
- [ ] All exit paths enumerated (unstaking, bridge, trading)
- [ ] All blocking mechanisms identified
- [ ] Authorization for each blocking mechanism documented
- [ ] JellyJelly incident analyzed as precedent
- [ ] Unstaking queue confirmed as only standard delay

---

#### 1.7 Token Censorship

**Question:** Can any roles freeze, blacklist, seize, or censor token balances or transfers?

**Investigation Steps:**
1. Query WHYPE contract for blacklist/freeze functions
2. Investigate QuarantineUser effect on token balances
3. Review user reports of address flagging
4. Compare native HYPE vs WHYPE censorship capabilities

**Completeness Criteria:**
- [ ] WHYPE contract analyzed for censorship functions
- [ ] QuarantineUser effect on tokens documented
- [ ] Native HYPE transfer restrictions documented
- [ ] User flagging mechanism documented
- [ ] Distinction between exchange-level and token-level restrictions clarified

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to tokenholders currently active rather than theoretical?

**Investigation Steps:**
1. Query Assistance Fund balance and transaction history
2. Calculate historical buyback volumes
3. Document burn verification
4. Query current staking APY

**API Queries:**
```bash
# Get staking rewards for sample address
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "delegatorRewards", "user": "0x..."}' \
  https://api.hyperliquid.xyz/info
```

**Value Accrual Mechanisms:**

| Mechanism | Type | Status | Verification |
|-----------|------|--------|--------------|
| Assistance Fund buyback | Non-dilutive | Active | Check ASXN dashboard |
| HYPE burn | Non-dilutive | Active | Verify burn transactions |
| Staking rewards | Dilutive (emissions) | Active | Query API |

**Completeness Criteria:**
- [ ] Buyback activity verified with transaction data
- [ ] Burn mechanism verified with burn transactions
- [ ] Current staking APY documented
- [ ] Total value accrued historically calculated
- [ ] Dilutive vs non-dilutive clearly distinguished

---

#### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets programmatically controlled by tokenholder governance?

**Investigation Steps:**
1. Identify all treasury addresses
2. Document governance over each treasury
3. Query Assistance Fund mechanism (programmatic vs manual)

**Treasury Addresses to Investigate:**

| Treasury | Address | Control |
|----------|---------|---------|
| Assistance Fund | 0xfefe...fefe | Investigate |
| Foundation holdings | Unknown | Investigate |
| Team vesting | Unknown | Vesting contracts |

**Completeness Criteria:**
- [ ] All treasury addresses identified
- [ ] Assistance Fund control mechanism documented
- [ ] Foundation holdings documented
- [ ] For each treasury: governance control verified

---

#### 2.3 Accrual Mechanism Control

**Question:** Can tokenholders modify parameters governing value capture?

**Investigation Steps:**
1. Document fee split parameters (HLP vs Assistance Fund)
2. Check if fee parameters are governance-controlled
3. Document HIP-3 deployer fee controls

**Completeness Criteria:**
- [ ] Fee split percentages documented
- [ ] Governance control over fee parameters documented
- [ ] Deployer fee mechanism documented
- [ ] Any hardcoded vs configurable parameters distinguished

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value accrual flows that benefit tokenholders?

**Investigation Steps:**
1. Review Hyper Foundation structure
2. Check for any revenue sharing arrangements
3. Document IP ownership

**Completeness Criteria:**
- [ ] Foundation relationship to tokenholders documented
- [ ] Any offchain revenue streams identified
- [ ] IP ownership documented

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is the token contract source publicly available and verifiable?

**Investigation Steps:**
1. Check WHYPE on HyperScan (Blockscout)
2. Verify WHYPE matches WETH source
3. Document native HYPE verification limitations

**Verification Status:**

| Token | Network | Verified? | Source |
|-------|---------|-----------|--------|
| Native HYPE | L1 | Cannot verify (L1 closed) | - |
| WHYPE | HyperEVM | Check Blockscout | WETH clone |
| Bridged HYPE | Ethereum | Check Etherscan | Unknown |

**Completeness Criteria:**
- [ ] WHYPE verification status confirmed
- [ ] Bridged HYPE verification status confirmed
- [ ] Native HYPE verification limitations documented

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verifiable?

**Investigation Steps:**
1. Inventory all public repositories
2. Document what is open source vs closed source
3. Verify HyperEVM contracts where possible

**Open Source Status:**

| Component | Status | Repository |
|-----------|--------|------------|
| L1 node code | Closed source | - |
| Python SDK | Open source (MIT) | hyperliquid-dex/hyperliquid-python-sdk |
| Rust SDK | Open source (MIT) | hyperliquid-dex/hyperliquid-rust-sdk |
| Node setup | Open source (Apache-2.0) | hyperliquid-dex/node |
| WHYPE contract | Open source (WETH clone) | - |

**Completeness Criteria:**
- [ ] All repositories inventoried
- [ ] Each component's open source status documented
- [ ] HyperEVM contract verification checked
- [ ] L1 closed source limitation clearly documented

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does a single actor or coordinated group control a majority of voting supply?

**Investigation Steps:**
1. Query top HYPE holders via explorer
2. Calculate team + Foundation concentration
3. Query validator stake distribution
4. Identify any coordinated voting blocs

**API Queries:**
```bash
# Get validator summaries to see stake distribution
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "validatorSummaries"}' \
  https://api.hyperliquid.xyz/info
```

**Completeness Criteria:**
- [ ] Top 10 HYPE holders identified
- [ ] Team holdings calculated (~23.8% documented)
- [ ] Foundation holdings calculated
- [ ] Validator stake concentration calculated
- [ ] Any >10% holders flagged

---

#### 4.2 Future Token Unlocks

**Question:** Are there known future events that will materially affect concentration?

**Investigation Steps:**
1. Document full vesting schedule from DefiLlama/Tokenomist
2. Calculate monthly unlock amounts
3. Document burn rate vs emission rate

**Completeness Criteria:**
- [ ] Full vesting schedule documented
- [ ] Major unlock events identified
- [ ] Monthly unlock rate calculated
- [ ] Net inflation/deflation estimated

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question:** Are core trademarks owned by a tokenholder-controlled entity?

**Investigation Steps:**
1. Search USPTO for HYPERLIQUID trademark
2. Identify registrant entity
3. Document relationship to tokenholders

**Completeness Criteria:**
- [ ] All relevant trademarks identified
- [ ] Registrant entity documented
- [ ] Governance relationship to tokenholders assessed

---

#### 5.2 Distribution

**Question:** Are primary domains and distribution assets controlled by a tokenholder-controlled entity?

**Investigation Steps:**
1. Check domain registration for hyperliquid.xyz
2. Review Terms of Service contracting party
3. Document infrastructure control

**Completeness Criteria:**
- [ ] Domain ownership documented
- [ ] ToS contracting party documented
- [ ] Infrastructure control assessed

---

#### 5.3 Licensing

**Question:** Is core protocol software/IP controlled by a tokenholder-controlled entity?

**Investigation Steps:**
1. Document licenses of all public repos
2. Investigate IP ownership for closed-source components
3. Document Foundation's role in IP

**Completeness Criteria:**
- [ ] All repository licenses documented
- [ ] Closed-source IP ownership investigated
- [ ] Foundation IP control assessed

---

## Part 6: Evidence Standards

### 6.1 Evidence Categories

| Category | Purpose | Example |
|----------|---------|---------|
| Core | Proves the criterion assessment | Contract code showing no mint function |
| Context | Provides background but not proof | Current staking APY |
| Reference | Links to related information | Official documentation |

### 6.2 Evidence Format (per metrics.json)

```json
{
  "evidence": [
    {
      "name": "Evidence Item Name",
      "summary": "Brief explanation of what this proves",
      "urls": [
        {
          "name": "Link description",
          "url": "https://...",
          "type": "explorer|github|docs"
        }
      ]
    }
  ]
}
```

### 6.3 Evidence Sufficiency by Criterion

| Criterion | Sufficient Evidence | Insufficient Evidence |
|-----------|---------------------|----------------------|
| Governance Workflow | Onchain vote execution trace | Team announcement of governance |
| Role Accountability | Contract code showing role permissions | Documentation without addresses |
| Token Censorship | Contract verified with no freeze functions | Whitepaper claims |
| Accrual Active | Transaction history showing burns | Announcement of burn mechanism |
| Token Verification | Verified source on explorer | GitHub code without deployment link |

---

## Part 7: Key Risks and Gaps

### 7.1 Critical Investigation Areas

1. **CoreWriter Godmode Claims**
   - Claims: Mint tokens, move funds, crash validators
   - Hyperliquid response: "CoreWriter is documented, no such capabilities"
   - Action: Verify against official CoreWriter documentation

2. **Emergency Powers Scope**
   - FreezeChain has no unfreeze (per RE analysis)
   - QuarantineUser is permanent (per RE analysis)
   - Action: Document all 89 governance action variants

3. **Broadcaster Censorship**
   - Only 8 addresses can submit transactions
   - Action: Investigate if users can run their own broadcasters

4. **Governance Logging Gap**
   - VoteGlobalAction allegedly leaves no LedgerUpdate
   - Action: Verify if governance actions are auditable

### 7.2 Areas Where Evidence May Not Exist

1. **L1 Source Code** — Cannot verify without open sourcing
2. **Full Governance Action List** — May not be publicly documented
3. **Foundation Governance** — May lack formal tokenholder control
4. **Oracle Updater Identity** — May not be publicly disclosed

---

## Part 8: Research Execution Checklist

### Phase 1: Data Collection
- [ ] Execute all API queries in Part 1
- [ ] Archive all documentation URLs
- [ ] Capture current onchain state (balances, validators)
- [ ] Verify third-party source accessibility (RE analysis, ASXN)

### Phase 2: Address Enumeration
- [ ] Verify all 8 broadcaster addresses
- [ ] Identify Oracle updater address
- [ ] Identify liquidator whitelist members
- [ ] Identify bridge validator addresses
- [ ] Document all Foundation-controlled addresses

### Phase 3: Function Analysis
- [ ] Document all 89 governance action variants (if discoverable)
- [ ] Verify CoreWriter capabilities against official docs
- [ ] Verify WHYPE immutability
- [ ] Analyze bridge contract functions

### Phase 4: Ownership Chain Documentation
- [ ] Complete ownership chain for protocol upgrades
- [ ] Complete ownership chain for token supply
- [ ] Complete ownership chain for emergency powers
- [ ] Complete ownership chain for fee parameters
- [ ] Complete ownership chain for broadcaster control

### Phase 5: Synthesis
- [ ] Populate metrics.json entries
- [ ] Populate tokens.json entry
- [ ] Internal consistency review
- [ ] Gap documentation

---

## Appendix: Initial Risk Assessment

| Metric | Criteria | Assessment | Rationale |
|--------|----------|------------|-----------|
| **Onchain Control** | Governance Workflow | ⚠️ | Validator-based, not direct tokenholder |
| | Role Accountability | ⚠️ | CoreWriter/broadcaster concerns unresolved |
| | Protocol Upgrade | Unknown | Closed source L1 |
| | Token Upgrade | ✅ | WHYPE immutable, native is protocol-level |
| | Supply Control | ✅ | Programmatic schedule documented |
| | Access Gating | ❌ | FreezeChain, QuarantineUser exist |
| | Token Censorship | ⚠️ | Reports of flagging |
| **Value Accrual** | Accrual Active | ✅ | Buybacks verified |
| | Treasury Ownership | ⚠️ | Foundation relationship unclear |
| | Mechanism Control | Unknown | Fee governance unclear |
| | Offchain Accrual | TBD | No evidence yet |
| **Verifiability** | Token Source | ⚠️ | WHYPE verifiable, native is not |
| | Protocol Source | ❌ | Core L1 closed source |
| **Distribution** | Concentration | ⚠️ | Team ~24%, transparent |
| | Supply Schedule | ✅ | Well documented |
| **Offchain** | Trademark | ⚠️ | Foundation-held |
| | Distribution | ⚠️ | Foundation-controlled |
| | Licensing | ❌ | Core is proprietary |

---

*Plan Version: 2.0*
*Created: 2026-02-24*
*Revised: 2026-02-24 (per reviewer feedback)*
*Author: Planner Agent*
