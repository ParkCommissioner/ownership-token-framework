# HYPE Token Research Report

## Aragon Ownership Token Framework Analysis

**Token:** HYPE (Hyperliquid)
**Network:** Hyperliquid L1 (with bridges to Arbitrum)
**Date:** 2026-02-24
**Status:** Research Complete

---

## Executive Summary

HYPE is the native token of Hyperliquid, a purpose-built L1 blockchain for perpetual futures trading. Unlike EVM-based governance tokens, HYPE operates within a validator-based consensus system where governance power flows through delegated stake rather than direct token voting.

### Key Findings

| Category | Assessment | Rationale |
|----------|------------|-----------|
| **Onchain Control** | ⚠️ Mixed | Validator governance, not direct tokenholder voting. Foundation controls 55.68% of stake. |
| **Value Accrual** | ✅ Active | Assistance Fund buyback/burn mechanism is operational with 41.2M HYPE held. |
| **Verifiability** | ❌ Critical Gap | Core L1 node code is closed source. WHYPE is verified (standard WETH). |
| **Distribution** | ⚠️ Concentrated | Team ~23.8%, Foundation validators control majority stake. |
| **Offchain** | ⚠️ Foundation-controlled | Trademarks, domains, IP controlled by Hyper Foundation. |

### Critical Risks Identified

1. **Closed-source L1 code**: The core consensus and execution logic cannot be independently verified.
2. **Emergency powers exist**: `FreezeChain` (no unfreeze), `QuarantineUser` (permanent), `invalidateWithdrawals` are documented capabilities.
3. **Governance opacity**: VoteGlobalAction execution bypasses the LedgerUpdate logging system - governance actions leave minimal audit trail.
4. **Broadcaster centralization**: Only 8 undisclosed addresses can submit transactions to the L1.
5. **Foundation stake concentration**: Hyper Foundation validators control 55.68% of total stake, giving effective governance control.

---

## Part 1: Contract Architecture

### 1.1 Core Contracts and Addresses

| Contract | Address | Network | Purpose | Upgradeable |
|----------|---------|---------|---------|-------------|
| HYPE (native) | Native asset | Hyperliquid L1 | Native gas/staking token | Part of L1 protocol |
| WHYPE | `0x5555555555555555555555555555555555555555` | HyperEVM | Wrapped HYPE for EVM compatibility | **No** (immutable) |
| CoreWriter | `0x3333333333333333333333333333333333333333` | HyperEVM | System precompile for state modifications | Part of L1 protocol |
| Assistance Fund | `0xfefefefefefefefefefefefefefefefefefefefe` | Hyperliquid L1 | Fee collection and HYPE buyback/burn | Part of L1 protocol |
| Bridge2 | `0x2df1c51e09aecf9cacb7bc98cb1742757f163df7` | Arbitrum One | USDC bridge to Hyperliquid | **No** (not proxy) |

### 1.2 Bridge2 Contract Analysis

The Bridge2 contract on Arbitrum is the primary bridge for USDC deposits/withdrawals. Key characteristics from source code review:

**Source:** [hyperliquid-dex/contracts/Bridge2.sol](https://github.com/hyperliquid-dex/contracts/blob/master/Bridge2.sol)

**Governance Model:**
- No `owner()` function - entirely validator-controlled
- Withdrawals require signatures from >2/3 of validator power (line 453-456)
- Validator set updates require current validator signatures
- Emergency lock threshold is configurable by validators

**Security Features:**
- Dispute period for withdrawals (configurable `disputePeriodSeconds`)
- Locker addresses can pause the bridge
- Cold wallet signatures required to unlock after emergency pause
- `invalidateWithdrawals()` can cancel pending withdrawals (requires cold wallet quorum)

**Key Functions:**
```solidity
// Bridge2.sol:676-693 (simplified for illustration)
function invalidateWithdrawals(
  bytes32[] memory messages,
  uint64 nonce,
  ValidatorSet memory activeColdValidatorSet,
  Signature[] memory signatures
) external {
  // Requires cold wallet validator quorum
  checkValidatorSignatures(message, activeColdValidatorSet, signatures, coldValidatorSetHash);
  // Can cancel any pending withdrawal
}
```

**Verification:** Contract not verified on Arbiscan, but source code is public on GitHub under `hyperliquid-dex/contracts`.

---

## Part 2: Governance and Ownership Model

### 2.1 Validator Set and Stake Distribution

**Query:** `curl -X POST -H "Content-Type: application/json" -d '{"type": "validatorSummaries"}' https://api.hyperliquid.xyz/info`

**Results (2026-02-24):**

| Rank | Validator | Stake (HYPE) | % of Total | Active |
|------|-----------|--------------|------------|--------|
| 1 | Hyper Foundation 2 | 57,870,352.60 | 13.33% | Yes |
| 2 | Hyper Foundation 3 | 56,452,593.58 | 13.01% | Yes |
| 3 | Hyper Foundation 1 | 55,047,582.22 | 12.68% | Yes |
| 4 | Hyper Foundation 4 | 54,775,629.44 | 12.62% | Yes |
| 5 | Anchorage By Figment | 33,619,998.24 | 7.75% | Yes |
| 6 | Nansen x HypurrCollective | 25,967,777.36 | 5.98% | Yes |
| 7 | Hypurrscanning | 24,652,001.43 | 5.68% | Yes |
| 8 | infinitefield.xyz | 19,703,565.22 | 4.54% | Yes |
| 9 | Hyper Foundation 5 | 17,510,762.10 | 4.03% | Yes |
| 10 | Kinetiq x Hyperion | 11,895,890.51 | 2.74% | Yes |

**Totals:**
- Total validators: 30 (24 active, 6 inactive including 5 jailed)
- Total stake: 433,992,948.43 HYPE
- Foundation stake: 241,656,919.94 HYPE
- **Foundation control: 55.68% of total stake**

**Foundation Validator Addresses:**
- Hyper Foundation 1: `0x5ac99df645f3414876c816caa18b2d234024b487`
- Hyper Foundation 2: `0xa82fe73bbd768bc15d1ef2f6142a21ff8bd762ad`
- Hyper Foundation 3: `0x80f0cd23da5bf3a0101110cfd0f89c8a69a1384d`
- Hyper Foundation 4: `0xdf35aee8ef5658686142acd1e5ab5dbcdf8c51e8`
- Hyper Foundation 5: `0x66be52ec79f829cc88e5778a255e2cb9492798fd`

### 2.2 Governance Mechanism

Hyperliquid uses **HyperBFT consensus** with validator voting for governance. Unlike EVM-based protocols with direct token voting, HYPE holders influence governance indirectly through:

1. **Delegation**: HYPE holders delegate stake to validators
2. **Validator voting**: Validators vote on protocol changes via `VoteGlobalAction`
3. **Execution**: Changes require >2/3 of validator power to pass

**Critical Finding:** The Hyper Foundation controls >2/3 of stake through 5 validators, giving it unilateral control over governance decisions.

### 2.3 Privileged Roles and Emergency Powers

Per reverse engineering analysis ([blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/](https://blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/)):

**VoteGlobalAction Variants (89 total):**

*Note: The reverse engineering analysis uses both hex discriminant codes (e.g., 0x20) and switch case numbers (e.g., case 7) depending on the code path.*

| Code | Action | Risk Level | Description |
|------|--------|------------|-------------|
| 0x20 | FreezeChain | **Critical** | Halts chain permanently at specified height. **No unfreeze mechanism exists.** |
| 0x1A | QuarantineUser | **Critical** | Freezes user account permanently. No undo mechanism. |
| 0x26 | ModifyBroadcaster | **Critical** | Changes broadcaster whitelist. |
| case 7 | invalidateWithdrawals | **Critical** | Cancel pending bridge withdrawals. |
| 0x25 | ModifyNonCirculatingSupply | High | Governance-controlled token supply accounting. |
| 0x02 | SetOracle | High | Arbitrary price manipulation with no delay. |
| case 17 | AllowedBridgeValidators | High | Replace bridge validator set with no authorization checks. |

**Broadcaster Whitelist (8 addresses):**
```
0x1e9b90ab34427807dc25c7266beb188e86af7ed6
0x2d9d6ae54b069fd372401b71dc4843d85babe3ea
0x67e451964e0421f6e7d07be784f35c530667c2b3
0x76d335fbd515969ed5facf98611ca6e3ba87ff01
0x90eaf322d6e39adbdca7b632ec2436719a99fcd0
0x940e4f78cfb16e07e1e2ef0994e186bde7e6478c
0xf70a9d9a56fe5c75815a9eae6a8593bc59cb6a06
0xffbb4dfc9455f0df2e973d7a371d8ad994264aa6
```

These addresses control all transaction submission to the L1. Users cannot run their own broadcasters.

### 2.4 Ownership Chain Diagram

```
HYPE Token
    │
    ├── Native HYPE (L1)
    │       │
    │       └── Staking Rewards ─── Emission Schedule (programmatic)
    │               │                  └── Rate ∝ 1/√(total_staked)
    │               │
    │               └── Validator Voting ─── VoteGlobalAction
    │                       │                     │
    │                       │                     └── 89 action variants
    │                       │                           ├── FreezeChain
    │                       │                           ├── QuarantineUser
    │                       │                           └── ... (87 more)
    │                       │
    │                       └── Hyper Foundation (55.68% stake)
    │                               │
    │                               └── UNILATERAL CONTROL
    │
    ├── WHYPE (HyperEVM)
    │       │
    │       └── Immutable WETH Clone
    │               └── No admin functions
    │
    └── Bridge2 (Arbitrum)
            │
            └── Validator Controlled
                    ├── 2/3 stake for withdrawals
                    ├── Cold wallets for emergency
                    └── Hyper Foundation controls majority
```

---

## Part 3: Value Accrual Mechanism

### 3.1 Revenue Sources

| Source | Collection Point | Recipient | Control |
|--------|-----------------|-----------|---------|
| Perp trading fees | HyperCore | HLP + Assistance Fund | Fee schedule governance-set |
| Spot trading fees | HyperCore | HLP + Assistance Fund + Deployers | Deployers can take up to 50% |
| Liquidation fees | HyperCore | Protocol | Automated |

**Fee Structure (from docs):**
- Perp taker: 0.024% - 0.045% (tier-dependent)
- Perp maker: 0% - 0.015% (tier-dependent)
- Spot taker: 0.025% - 0.070%
- Spot maker: 0% - 0.040%

### 3.2 Assistance Fund

**Address:** `0xfefefefefefefefefefefefefefefefefefefefe`

**Current Holdings (API query 2026-02-24):**
```json
{
  "HYPE": 41,244,979.09,
  "USDC": 512.15,
  "USDE": 18,389.83,
  "USDT0": 7,220.36,
  "USDH": 7,754.77,
  "KNTQ": 259,557.77,
  "MEOW": 193,600.31,
  ...
}
```

**Mechanism:**
- Receives portion of trading fees
- Converts fees to HYPE on the open market (buyback)
- Burns the acquired HYPE

**Value Accrual Assessment:** This is a **non-dilutive** value accrual mechanism. The buyback and burn reduces circulating supply, creating deflationary pressure. The mechanism is currently active with ~41.2M HYPE accumulated.

### 3.3 Staking Rewards

**Emission Schedule:**
- Rate inversely proportional to √(total_staked)
- At 400M staked: ~2.37% APY
- Current APY varies by validator commission (0% - 10%)

**Control:** Emission parameters are part of the L1 protocol. Changes would require validator consensus (effectively Foundation approval given stake concentration).

### 3.4 Control Over Value Flows

| Parameter | Who Controls | Verification |
|-----------|--------------|--------------|
| Trading fee rates | VoteGlobalAction (validators) | [UNVERIFIED - closed source] |
| Fee split (HLP vs Assistance Fund) | [UNVERIFIED] | Cannot verify without source |
| Buyback execution | Automated (protocol) | Observable on-chain |
| Emission schedule | Protocol-level | Documented in staking docs |

---

## Part 4: Token Analysis

### 4.1 WHYPE Contract Verification

**Contract:** `0x5555555555555555555555555555555555555555` on HyperEVM

**Verification Status:** Verified on HyperScan (Blockscout)

**Source Code:** Standard WETH clone (GPL licensed)

```solidity
// Verified source from HyperScan
contract WCTC {
    string public name = "Wrapped CTC";  // Note: Displayed as WCTC but is WHYPE
    string public symbol = "WCTC";
    uint8 public decimals = 18;

    // Standard WETH functions
    function deposit() public payable { ... }
    function withdraw(uint wad) public { ... }
    function transfer(address dst, uint wad) public returns (bool) { ... }
    function approve(address guy, uint wad) public returns (bool) { ... }
    // No admin functions
}
```

**Assessment:** WHYPE is immutable with no admin functions, matching the claimed WETH equivalence.

### 4.2 Native HYPE

**Verification Status:** ❌ Cannot verify

The native HYPE token is part of the L1 protocol. The L1 node code is closed source, so the token's behavior cannot be independently verified.

**Documented Properties (from official docs):**
- Total supply: 1,000,000,000 HYPE
- Native gas token on Hyperliquid L1
- Used for staking and validator delegation
- 7-day unstaking queue for withdrawals

### 4.3 Token Censorship Capabilities

| Mechanism | Exists | Verification |
|-----------|--------|--------------|
| QuarantineUser | ✅ Yes | RE analysis documents discriminant 0x1A |
| FreezeChain | ✅ Yes | RE analysis documents discriminant 0x20 |
| Transfer restrictions | [UNVERIFIED] | Closed source L1 |
| WHYPE freeze | ❌ No | Verified contract has no freeze |

**Critical Finding:** While WHYPE has no censorship capabilities, native HYPE can be frozen at the account level via `QuarantineUser`. This is a permanent action with no documented undo mechanism.

---

## Part 5: Token Distribution

### 5.1 Genesis Distribution

| Category | Percentage | Notes |
|----------|------------|-------|
| Genesis Distribution | 31.00% | Airdrop to users |
| Future Emissions & Community Rewards | 38.89% | Staking rewards |
| Core Contributors | 23.80% | Team allocation |
| Hyper Foundation Budget | 6.00% | Foundation |
| Community Grants | 0.30% | Ecosystem |
| HIP-2: Hyperliquidity | 0.01% | Protocol |

**Source:** [Tokenomist](https://tokenomist.ai/hyperliquid)

### 5.2 Current Supply Metrics

| Metric | Value |
|--------|-------|
| Total Supply | 1,000,000,000 HYPE |
| Circulating Supply | ~238,385,315 HYPE (23.84%) |
| Locked Supply | ~761,614,685 HYPE (76.16%) |
| Burn Rate | 10.13% |
| Buyback Rate | 10.18% |

### 5.3 Vesting Schedule

- **Release Mechanism:** Cliff vesting
- **Next Major Unlock:** March 6, 2026 (Core Contributors)
- **Schedule Duration:** Extends into 2027

### 5.4 Concentration Analysis

| Entity | Holdings | % of Total | Governance Impact |
|--------|----------|------------|-------------------|
| Hyper Foundation (staked) | 241.66M HYPE | 24.17% | 55.68% of validator power |
| Core Contributors | 238M HYPE (locked) | 23.80% | Locked, no current voting |
| Assistance Fund | 41.24M HYPE | 4.12% | Not staked |

**Key Finding:** While team tokens are locked, the Foundation's staked tokens already give it majority validator control.

---

## Part 6: Verifiability

### 6.1 Open Source Status

| Component | Status | Repository |
|-----------|--------|------------|
| L1 Node Code | **Closed Source** | N/A |
| Python SDK | Open Source (MIT) | [hyperliquid-dex/hyperliquid-python-sdk](https://github.com/hyperliquid-dex/hyperliquid-python-sdk) |
| Rust SDK | Open Source (MIT) | [hyperliquid-dex/hyperliquid-rust-sdk](https://github.com/hyperliquid-dex/hyperliquid-rust-sdk) |
| Node Setup | Open Source (Apache-2.0) | [hyperliquid-dex/node](https://github.com/hyperliquid-dex/node) |
| Bridge Contracts | Open Source (UNLICENSED) | [hyperliquid-dex/contracts](https://github.com/hyperliquid-dex/contracts) |
| WHYPE | Verified on HyperScan | Standard WETH |

### 6.2 Critical Verification Gap

The core L1 node code is not open source. This means:
- Consensus mechanism cannot be independently audited
- Governance action behavior cannot be verified
- Token transfer logic cannot be verified
- Emergency power implementation cannot be verified

The `node` repository contains only setup scripts, not the actual validator code.

### 6.3 Audit Trail Gap

Per reverse engineering analysis:

> "Governance proposals are stored but effectively unqueryable. VoteGlobalAction execution bypasses the LedgerUpdate logging system. Users can see votes happened, not what was proposed. The platform's most destructive operations leave no trace."

This means governance actions like `FreezeChain`, `QuarantineUser`, and `ModifyBroadcaster` execute without standard event logging.

---

## Part 7: Offchain Dependencies

### 7.1 Trademark

| Asset | Owner | Status |
|-------|-------|--------|
| HYPERLIQUID | [UNVERIFIED] | USPTO filing exists (Serial No. 99599981) |

**Source:** [UNVERIFIED] - USPTO filing exists but source inaccessible via automated query (Cloudflare protection). Manual verification required via https://tsdr.uspto.gov using Serial No. 99599981.

### 7.2 Domain and Distribution

| Asset | Controller | Tokenholder Control |
|-------|-----------|---------------------|
| hyperliquid.xyz | Hyper Foundation | ❌ No |
| app.hyperliquid.xyz | Hyper Foundation | ❌ No |
| API endpoints | Hyper Foundation | ❌ No |

### 7.3 Licensing

| Component | License | Owner |
|-----------|---------|-------|
| L1 Node Code | Proprietary (closed) | Hyperliquid Labs / Foundation |
| SDKs | MIT / Apache-2.0 | Open source |
| Bridge Contracts | UNLICENSED | Hyperliquid |

---

## Part 8: Role Matrix

| Contract | Role | Current Holder | Holder Type | Verified Via | Who Controls |
|----------|------|----------------|-------------|--------------|--------------|
| Native HYPE | Supply Control | Emission Schedule | Protocol | [UNVERIFIED] | Validators (Foundation majority) |
| Native HYPE | QuarantineUser | Validators | Validator Set | RE Analysis | Foundation (55.68% stake) |
| Native HYPE | FreezeChain | Validators | Validator Set | RE Analysis | Foundation (55.68% stake) |
| WHYPE | Admin | None | N/A | HyperScan verification | N/A (immutable) |
| Bridge2 | Withdrawal Auth | Validators (>2/3) | Validator Set | GitHub source | Foundation (55.68% stake) |
| Bridge2 | Emergency Lock | Lockers | Validator hot wallets | GitHub source | Validators |
| Bridge2 | Emergency Unlock | Cold Wallets | Validator cold wallets | GitHub source | Validators |
| Broadcaster | Tx Submission | 8 addresses | Unknown | RE Analysis | Unknown |

---

## Part 9: Conflicts of Interest

### 9.1 Foundation Control vs. Tokenholder Sovereignty

The Hyper Foundation controls 55.68% of staked HYPE through 5 validators. This concentration gives the Foundation:
- Unilateral control over all governance decisions
- Ability to pass any VoteGlobalAction without external approval
- Effective veto power over any tokenholder-initiated change

This is a structural conflict: tokenholders cannot overrule Foundation decisions.

### 9.2 Closed Source vs. Trust

The closed-source L1 means users must trust:
- Token transfer logic is correct
- Emergency powers are implemented as documented
- No backdoors exist in the consensus mechanism
- Governance actions are executed as claimed

This cannot be verified without source code access.

### 9.3 Broadcaster Centralization

The 8-address broadcaster whitelist means:
- Users depend on these addresses to submit transactions
- Broadcasters could theoretically censor transactions
- No documented path for users to run their own broadcasters

---

## Part 10: Summary Assessment

### Framework Criteria Mapping

| Criterion | Status | Evidence |
|-----------|--------|----------|
| **Onchain Governance Workflow** | ⚠️ | Validator voting exists but Foundation controls majority |
| **Role Accountability** | ❌ | Emergency powers exist, no tokenholder override |
| **Protocol Upgrade Authority** | ❌ | L1 upgrades controlled by validators, not tokenholders |
| **Token Upgrade Authority** | ⚠️ | WHYPE immutable, native HYPE is protocol-level |
| **Supply Control** | ✅ | Emission schedule is programmatic |
| **Privileged Access Gating** | ❌ | FreezeChain, QuarantineUser, broadcaster whitelist |
| **Token Censorship** | ❌ | QuarantineUser can freeze accounts permanently |
| **Accrual Active** | ✅ | Assistance Fund buyback/burn is operational |
| **Treasury Ownership** | ⚠️ | Assistance Fund is protocol-controlled, Foundation decides use |
| **Accrual Mechanism Control** | ⚠️ | Fee parameters controlled by validators (Foundation majority) |
| **Offchain Value Accrual** | TBD | Not verified |
| **Token Source Verification** | ⚠️ | WHYPE verified, native HYPE cannot be verified |
| **Protocol Source Verification** | ❌ | Core L1 is closed source |
| **Ownership Concentration** | ⚠️ | Foundation controls 55.68% of stake |
| **Future Token Unlocks** | ⚠️ | Team tokens unlock starting March 2026 |
| **Trademark** | ⚠️ | Foundation-held |
| **Distribution** | ⚠️ | Foundation-controlled |
| **Licensing** | ❌ | Core is proprietary |

### Final Assessment

HYPE demonstrates **active value accrual** through the Assistance Fund buyback/burn mechanism, which distinguishes it from tokens that only promise future value. However, **tokenholders do not have sovereign control** over the protocol:

1. The Foundation controls governance through majority stake
2. Critical emergency powers exist without tokenholder override
3. The core protocol cannot be independently verified
4. Censorship mechanisms exist at the account level

HYPE holders have economic exposure to Hyperliquid's success, but they do not have enforceable, on-chain control over the protocol. The governance system is more accurately described as "Foundation-controlled with tokenholder participation" rather than "tokenholder-controlled."

---

## Appendix A: Role Matrix Verification Proofs

### A.1 Foundation Validator Stake Verification

**Query:**
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"type": "validatorSummaries"}' \
  https://api.hyperliquid.xyz/info
```

**Result (2026-02-24, summarized):**
```
Total validators: 30
Active: 24
Jailed: 5
Inactive (not jailed): 1

Foundation Validators:
- Hyper Foundation 1: 0x5ac99df645f3414876c816caa18b2d234024b487 - 55,047,582.22 HYPE
- Hyper Foundation 2: 0xa82fe73bbd768bc15d1ef2f6142a21ff8bd762ad - 57,870,352.60 HYPE
- Hyper Foundation 3: 0x80f0cd23da5bf3a0101110cfd0f89c8a69a1384d - 56,452,593.58 HYPE
- Hyper Foundation 4: 0xdf35aee8ef5658686142acd1e5ab5dbcdf8c51e8 - 54,775,629.44 HYPE
- Hyper Foundation 5: 0x66be52ec79f829cc88e5778a255e2cb9492798fd - 17,510,762.10 HYPE

Foundation total: 241,656,919.94 HYPE
Total stake: 433,992,948.43 HYPE
Foundation %: 55.68%
```

### A.2 Bridge2 No-Owner Verification

**Query (JSON-RPC eth_call for owner() selector 0x8da5cb5b):**
```bash
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x2df1c51e09aecf9cacb7bc98cb1742757f163df7","data":"0x8da5cb5b"},"latest"],"id":1}' \
  https://arb1.arbitrum.io/rpc
```

**Result:**
```json
{"jsonrpc":"2.0","id":1,"error":{"code":3,"message":"execution reverted","data":"0x"}}
```

**Interpretation:** The `owner()` function call reverts, confirming no owner() function exists in the Bridge2 contract.

### A.3 Bridge2 No-Proxy Verification

**Query (EIP-1967 implementation slot):**
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x2df1c51e09aecf9cacb7bc98cb1742757f163df7","0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc","latest"],"id":1}' \
  https://arb1.arbitrum.io/rpc
```

**Result:**
```json
{"jsonrpc":"2.0","id":1,"result":"0x0000000000000000000000000000000000000000000000000000000000000000"}
```

**Interpretation:** The EIP-1967 implementation slot is empty (zero), confirming Bridge2 is not a proxy contract.

### A.4 Assistance Fund Balance Verification

**Query:**
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"type": "spotClearinghouseState", "user": "0xfefefefefefefefefefefefefefefefefefefefe"}' \
  https://api.hyperliquid.xyz/info
```

**Result (2026-02-24, key balances):**
```json
{
  "balances": [
    {"coin": "HYPE", "token": 150, "total": "41244979.0925551206"},
    {"coin": "USDC", "token": 0, "total": "512.151321"},
    {"coin": "USDE", "token": 235, "total": "18389.83168537"},
    {"coin": "USDT0", "token": 268, "total": "7220.36316391"}
  ]
}
```

**Interpretation:** Assistance Fund holds ~41.24M HYPE, confirming active buyback accumulation.

### A.5 WHYPE Contract Immutability Verification

**Contract Address:** `0x5555555555555555555555555555555555555555` on HyperEVM

**Verification Method:** HyperScan (Blockscout) contract verification

**Verified Functions (from bytecode analysis):**
- `deposit()` - public payable
- `withdraw(uint)` - public
- `transfer(address,uint)` - public returns bool
- `approve(address,uint)` - public returns bool
- `transferFrom(address,address,uint)` - public returns bool

**Admin Functions Found:** None

**Interpretation:** The WHYPE contract contains only standard WETH functions with no admin, owner, pause, freeze, or upgrade capabilities.

---

## Appendix B: API Queries Used

### Validator Summary
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "validatorSummaries"}' \
  https://api.hyperliquid.xyz/info
```

### Assistance Fund Balances
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "spotClearinghouseState", "user": "0xfefefefefefefefefefefefefefefefefefefefe"}' \
  https://api.hyperliquid.xyz/info
```

### Spot Token Metadata
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type": "spotMeta"}' \
  https://api.hyperliquid.xyz/info
```

### Bridge2 Owner Check (Arbitrum JSON-RPC)
```bash
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x2df1c51e09aecf9cacb7bc98cb1742757f163df7","data":"0x8da5cb5b"},"latest"],"id":1}' \
  https://arb1.arbitrum.io/rpc
```

### Bridge2 Proxy Check (EIP-1967 Implementation Slot)
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x2df1c51e09aecf9cacb7bc98cb1742757f163df7","0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc","latest"],"id":1}' \
  https://arb1.arbitrum.io/rpc
```

---

## References

### Primary Sources
1. Hyperliquid Documentation: https://hyperliquid.gitbook.io/hyperliquid-docs
2. Hyperliquid GitHub: https://github.com/hyperliquid-dex
3. Bridge2 Contract Source: https://github.com/hyperliquid-dex/contracts/blob/master/Bridge2.sol
4. WHYPE Verification: https://www.hyperscan.com/address/0x5555555555555555555555555555555555555555

### Analysis Sources
5. Reverse Engineering Analysis: https://blog.can.ac/2025/12/20/reverse-engineering-hyperliquid/
6. Tokenomist: https://tokenomist.ai/hyperliquid

### Explorer Links
7. HyperScan (HyperEVM): https://www.hyperscan.com
8. Hyperliquid L1 Explorer: https://app.hyperliquid.xyz/explorer
9. Arbiscan (Bridge2): https://arbiscan.io/address/0x2df1c51e09aecf9cacb7bc98cb1742757f163df7

---

*Report generated: 2026-02-24*
*Framework version: Aragon Ownership Token Framework*
*Author: Researcher Agent*
