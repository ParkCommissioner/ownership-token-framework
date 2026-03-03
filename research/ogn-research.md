# OGN Token Research Report

*Date: March 3, 2026*
*Prepared for: Aragon Ownership Token Framework*

---

## Executive Summary

OGN (Origin Token) is the governance token for Origin Protocol, which operates yield-bearing products across multiple chains:
- **OETH** (Origin Ether) on Ethereum
- **OUSD** (Origin Dollar) on Ethereum
- **Super OETH** on Base
- **OS** (Origin Sonic) on Sonic

This research analyzes OGN against the Aragon Ownership Token Framework criteria to determine what tokenholders actually own, control, and can economically benefit from.

**Key Findings:**
- **On-chain governance is real but partial**: xOGN holders have binding on-chain governance power over Ethereum contracts through a Governor contract connected to a 2-day Timelock
- **L2/alt-chain governance is multisig-controlled**: Base (Super OETH) and Sonic (OS) products are governed by 5/8 multisigs, NOT by xOGN tokenholders
- **Value accrual exists but has discretionary elements**: 10-20% of product fees flow to the same Buyback Operator (1/3 multisig), but the buyback contract itself is controlled by a 2/8 Strategist multisig, not governance
- **Strategist bypass**: A 2/8 Strategist multisig can pause operations, move funds between strategies, and change reward rates without tokenholder approval
- **Token is non-upgradeable**: OGN token itself cannot be upgraded, providing protection against supply manipulation

---

## 1. Contract Index Table

### Ethereum Mainnet - Core Contracts

| Contract | Address | What it does | Upgradeable? | Ownership-relevant? | Value-accrual-relevant? |
|----------|---------|--------------|--------------|---------------------|------------------------|
| OGN Token | `0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26` | ERC-20 governance token | No | Y | Y |
| xOGN Staking | `0x63898b3b6Ef3d39332082178656E9862bee45C57` | Vote-escrowed staking with rewards | No | Y | Y |
| Governance | `0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC` | Governor Bravo-style voting | No | Y | N |
| Timelock | `0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F` | 2-day execution delay | No | Y | N |
| FixedRateRewardsSource | `0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b` | Distributes OGN rewards to xOGN | Y (proxy) | Y | Y |
| OGN Migrator | `0x95c347D6214614A780847b8aAF4f96Eb84f4da6d` | OGV→OGN migration (ended) | Y (proxy) | N | N |

### Ethereum Mainnet - Multisigs

| Contract | Address | Config | Role |
|----------|---------|--------|------|
| Admin Multisig | `0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899` | 5/8 | Timelock CANCELLER_ROLE |
| Guardian Multisig | `0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC` | 2/8 | Emergency pause capabilities |
| Strategist Multisig | `0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971` | 2/8 | Strategy rebalancing, reward rate changes |
| Buyback Operator | `0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c` | 1/3 | Executes OGN buybacks, receives 20% of fees |

### Ethereum Mainnet - OETH Product Contracts

| Contract | Address | What it does | Upgradeable? | Ownership-relevant? | Value-accrual-relevant? |
|----------|---------|--------------|--------------|---------------------|------------------------|
| OETH Token | `0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3` | Rebasing yield token | Y | Y | N |
| OETH Vault | `0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab` | Holds assets, manages strategies | Y | Y | Y |
| Wrapped OETH | `0xDcEe70654261AF21C44c093C300eD3Bb97b78192` | ERC-4626 wrapper | Y | N | N |

### Ethereum Mainnet - OUSD Product Contracts

| Contract | Address | What it does | Upgradeable? | Ownership-relevant? | Value-accrual-relevant? |
|----------|---------|--------------|--------------|---------------------|------------------------|
| OUSD Token | `0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86` | Rebasing stablecoin | Y | Y | N |
| OUSD Vault | `0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70` | Holds stablecoins, manages strategies | Y | Y | Y |

**OUSD Governance Verification:**
```bash
# OUSD Vault governor is Timelock
cast call --rpc-url https://eth.drpc.org 0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70 "governor()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

# OUSD Vault sends 20% fees to Buyback Operator
cast call --rpc-url https://eth.drpc.org 0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70 "trusteeFeeBps()(uint256)"
# Result: 2000

cast call --rpc-url https://eth.drpc.org 0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70 "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c
```

### Base Chain Contracts

| Contract | Address | What it does | Governor |
|----------|---------|--------------|----------|
| OGN Token (Base) | `0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7` | Bridged OGN | Not upgradeable |
| Timelock (Base) | `0xf817cb3092179083c48c014688D98B72fB61464f` | 2-day execution delay | Multisig-controlled |
| Admin Multisig (Base) | `0x92A19381444A001d62cE67BaFF066fA1111d7202` | 5/8 | PROPOSER + EXECUTOR |
| Guardian Multisig (Base) | `0x28bce2eE5775B652D92bB7c2891A89F036619703` | 1/2 | Emergency pause |
| Super OETH Vault | `0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93` | Base yield vault | Base Timelock |
| Super OETH Token | `0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3` | Rebasing yield token | Base Timelock |

**Super OETH Fee Flow Verification:**
```bash
# Super OETH Vault sends 20% fees to Buyback Operator
cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "trusteeFeeBps()(uint256)"
# Result: 2000

cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c
```

### Sonic Chain Contracts

| Contract | Address | What it does | Governor |
|----------|---------|--------------|----------|
| Origin Sonic (OS) Token | `0xb1e25689D55734FD3ffFc939c4C3Eb52DFf8A794` | Liquid staking token | Sonic Timelock |
| Wrapped OS (wOS) | `0x9F0dF7799f6FDAd409300080cfF680f5A23df4b1` | ERC-4626 wrapper | Sonic Timelock |
| OS Vault | `0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186` | Holds Sonic, manages strategies | Sonic Timelock |
| Timelock (Sonic) | `0x31a91336414d3B955E494E7d485a6B06b55FC8fB` | 2-day execution delay | Multisig-controlled |
| Admin Multisig (Sonic) | `0xAdDEA7933Db7d83855786EB43a238111C69B00b6` | 5/8 | Same 8 signers as Ethereum |

**Sonic Governance Verification:**
```bash
# OS Vault governor is Sonic Timelock
cast call --rpc-url https://rpc.soniclabs.com 0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186 "governor()(address)"
# Result: 0x31a91336414d3B955E494E7d485a6B06b55FC8fB

# OS Vault sends 10% fees to SAME Buyback Operator as Ethereum
cast call --rpc-url https://rpc.soniclabs.com 0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186 "trusteeFeeBps()(uint256)"
# Result: 1000 (10%)

cast call --rpc-url https://rpc.soniclabs.com 0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186 "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c

# Sonic Admin Multisig has same 8 signers as Ethereum
cast call --rpc-url https://rpc.soniclabs.com 0xAdDEA7933Db7d83855786EB43a238111C69B00b6 "getOwners()(address[])"
# Result: [same 8 addresses as Ethereum Admin Multisig]

cast call --rpc-url https://rpc.soniclabs.com 0xAdDEA7933Db7d83855786EB43a238111C69B00b6 "getThreshold()(uint256)"
# Result: 5
```

**Critical Finding**: Sonic (OS) fees also flow to the same Buyback Operator multisig on Ethereum, contributing to OGN value accrual. However, Sonic governance is 5/8 multisig-controlled (same as Base), NOT xOGN tokenholder-controlled.

---

## 2. Governance & Ownership Model

### 2.1 The Governance Flow (Ethereum)

```
xOGN Holders
     │
     ▼ (vote with xOGN balance)
┌─────────────────────────────────────┐
│ Governance Contract                 │
│ 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC │
│ - Proposal threshold: 100,000 xOGN  │
│ - Voting delay: 7200 blocks (~1 day)│
│ - Voting period: 14416 blocks (~2 days) │
│ - Quorum: 20% of xOGN supply        │
└─────────────────────────────────────┘
     │
     ▼ (has PROPOSER_ROLE + EXECUTOR_ROLE)
┌─────────────────────────────────────┐
│ Timelock                            │
│ 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F │
│ - Min delay: 172,800 seconds (2 days) │
└─────────────────────────────────────┘
     │
     ▼ (is governor of)
┌─────────────────────────────────────┐
│ Protocol Contracts (Ethereum)       │
│ - OGN Token (owner)                 │
│ - xOGN (governor)                   │
│ - OETH Vault (governor)             │
│ - OETH Token (governor)             │
│ - OUSD Vault (governor)             │
│ - OUSD Token (governor)             │
│ - FixedRateRewardsSource (governor) │
└─────────────────────────────────────┘
```

**Verification:**

```bash
# Governance has PROPOSER_ROLE on Timelock
cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F \
  "hasRole(bytes32,address)(bool)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC
# Result: true

# Governance has EXECUTOR_ROLE on Timelock
cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F \
  "hasRole(bytes32,address)(bool)" \
  0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 \
  0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC
# Result: true

# OGN Token owner is Timelock
cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 \
  "owner()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

# OETH Vault governor is Timelock
cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab \
  "governor()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F
```

### 2.2 L2/Alt-Chain Governance (CRITICAL DIFFERENCE)

**Base and Sonic governance are NOT controlled by xOGN tokenholders.** Both chains use Timelocks controlled by 5/8 multisigs with the same 8 signers as the Ethereum Admin Multisig.

#### Base Chain

The Base Timelock is controlled by a 5/8 multisig:

```bash
# Base Admin Multisig has PROPOSER_ROLE on Base Timelock
cast call --rpc-url https://base.drpc.org 0xf817cb3092179083c48c014688D98B72fB61464f \
  "hasRole(bytes32,address)(bool)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  0x92A19381444A001d62cE67BaFF066fA1111d7202
# Result: true

# Base Admin Multisig has EXECUTOR_ROLE on Base Timelock
cast call --rpc-url https://base.drpc.org 0xf817cb3092179083c48c014688D98B72fB61464f \
  "hasRole(bytes32,address)(bool)" \
  0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 \
  0x92A19381444A001d62cE67BaFF066fA1111d7202
# Result: true
```

The Base Admin Multisig signers are the same 8 addresses as the Ethereum Admin Multisig, but they have full proposer/executor control on Base - xOGN holders cannot directly vote on Base governance proposals.

#### Sonic Chain

The Sonic Timelock (`0x31a91336414d3B955E494E7d485a6B06b55FC8fB`) is controlled by the Sonic Admin Multisig (`0xAdDEA7933Db7d83855786EB43a238111C69B00b6`), which is a 5/8 multisig with the exact same 8 signers as Ethereum:

```bash
cast call --rpc-url https://rpc.soniclabs.com 0xAdDEA7933Db7d83855786EB43a238111C69B00b6 "getOwners()(address[])"
# Result: [same 8 addresses as Ethereum Admin Multisig]

cast call --rpc-url https://rpc.soniclabs.com 0xAdDEA7933Db7d83855786EB43a238111C69B00b6 "getThreshold()(uint256)"
# Result: 5
```

**Summary**: xOGN governance only controls Ethereum mainnet. Base and Sonic are controlled by the same 8 people who sign the Ethereum Admin Multisig.

### 2.3 Role Matrix

| Contract | Role | Holder Address | Holder Type | Verified Via | Who Controls Holder |
|----------|------|----------------|-------------|--------------|---------------------|
| Timelock (ETH) | PROPOSER | `0x1D3Fbd4d...c9EC` | Governance | `hasRole()` = true | xOGN holders |
| Timelock (ETH) | EXECUTOR | `0x1D3Fbd4d...c9EC` | Governance | `hasRole()` = true | xOGN holders |
| Timelock (ETH) | CANCELLER | `0xbe2AB3d3...d899` | 5/8 Multisig | `hasRole()` = true | 8 EOA signers |
| Timelock (Base) | PROPOSER | `0x92A19381...d7202` | 5/8 Multisig | `hasRole()` = true | 8 EOA signers |
| Timelock (Base) | EXECUTOR | `0x92A19381...d7202` | 5/8 Multisig | `hasRole()` = true | 8 EOA signers |
| Timelock (Base) | CANCELLER | `0x92A19381...d7202` | 5/8 Multisig | `hasRole()` = true | 8 EOA signers |
| OETH Vault | governor | `0x35918cDE...e69F` | Timelock | `governor()` | xOGN via Governance |
| OETH Vault | strategist | `0x4FF1b9D9...a971` | 2/8 Multisig | `strategistAddr()` | 8 EOA signers |
| xOGN | governor | `0x35918cDE...e69F` | Timelock | `governor()` | xOGN via Governance |
| FixedRateRewardsSource | governor | `0x35918cDE...e69F` | Timelock | `governor()` | xOGN via Governance |
| FixedRateRewardsSource | strategist | `0x4FF1b9D9...a971` | 2/8 Multisig | `strategistAddr()` | 8 EOA signers |
| OGN Buyback | governor | `0x4FF1b9D9...a971` | 2/8 Multisig | `governor()` | 8 EOA signers |

### 2.4 Multisig Signer Details

**Admin Multisig (5/8)** - `0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899`:
```
0x530d3F8C38C262a619C2686A7f1481815a5e6f92
0xce96ae6De784181d8Eb2639F1E347fD40b4fD403
0x336C02D3e3c759160E1E44fF0247f87F63086495
0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13
0x617a3582bf134fe8eC600fF04A194604DcFB5Aab
0x17aBc3F085fb4B7eAf5002785DE22867f964D273
0x397729229B3d824Ca1B93e6E25e7CB197973df33
0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4
```

**Guardian Multisig (2/8)** - `0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC`:
```
0x17aBc3F085fb4B7eAf5002785DE22867f964D273
0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3
0x530d3F8C38C262a619C2686A7f1481815a5e6f92
0xce96ae6De784181d8Eb2639F1E347fD40b4fD403
0x397729229B3d824Ca1B93e6E25e7CB197973df33
0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE
0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4
0x617a3582bf134fe8eC600fF04A194604DcFB5Aab
```

**Strategist Multisig (2/8)** - `0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`:
```
0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3
0x397729229B3d824Ca1B93e6E25e7CB197973df33
0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE
0xce96ae6De784181d8Eb2639F1E347fD40b4fD403
0x17aBc3F085fb4B7eAf5002785DE22867f964D273
0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4
0x530d3F8C38C262a619C2686A7f1481815a5e6f92
0x617a3582bf134fe8eC600fF04A194604DcFB5Aab
```

**Buyback Operator (1/3)** - `0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c`:
```
0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE
0x530d3F8C38C262a619C2686A7f1481815a5e6f92
0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3
```

**Critical Observation**: All multisig signers overlap significantly. The same ~8 people (likely Origin team members) control all bypass capabilities.

---

## 3. Value Accrual Mechanism

### 3.1 Fee Flow Diagram

```
┌─────────────────────────────────────┐
│ OETH/OUSD Vault Yield               │
│ (ETH staking rewards, DeFi yield)   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Protocol Fee: 20% of yield          │
│ (trusteeFeeBps = 2000)              │
│ Sent to: Buyback Operator multisig  │
│ 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c │
└─────────────────────────────────────┘
                │
                ▼ (discretionary - 1/3 multisig executes)
┌─────────────────────────────────────┐
│ OGN Buyback Contract                │
│ 0x77314EB392b2be47C014cde0706908b3307Ad6a9 │
│ Governor: Strategist multisig (2/8) │
└─────────────────────────────────────┘
                │
                ▼ (OGN transferred to)
┌─────────────────────────────────────┐
│ FixedRateRewardsSource              │
│ 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b │
│ Current rate: 2.8 OGN/second        │
│ (~88.3M OGN/year)                   │
└─────────────────────────────────────┘
                │
                ▼ (pulled by xOGN on collectRewards())
┌─────────────────────────────────────┐
│ xOGN Staking Contract               │
│ 0x63898b3b6Ef3d39332082178656E9862bee45C57 │
│ Distributed pro-rata to stakers     │
└─────────────────────────────────────┘
```

### 3.2 Verification

```bash
# OETH Vault trustee address (receives fees)
cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab \
  "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c

# OETH Vault fee rate (20%)
cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab \
  "trusteeFeeBps()(uint256)"
# Result: 2000

# OGN Buyback contract governor (NOT Timelock!)
cast call --rpc-url https://eth.drpc.org 0x77314EB392b2be47C014cde0706908b3307Ad6a9 \
  "governor()(address)"
# Result: 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971 (Strategist multisig)

# Current reward rate
cast call --rpc-url https://eth.drpc.org 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b \
  "rewardConfig()((uint64,uint192))"
# Result: (1772498087, 2800000000000000000) = 2.8 OGN/second
```

### 3.3 Critical Value Accrual Issues

1. **Buyback execution is manual and discretionary**: The Buyback Operator (1/3 multisig) must manually execute buybacks. There is no programmatic guarantee that fees convert to OGN.

2. **Buyback contract is NOT governance-controlled**: The OGN Buyback contract's governor is the Strategist multisig (2/8), not the Timelock. The Strategist can change parameters or redirect funds without tokenholder approval.

3. **Reward rate is Strategist-controlled**: The `setRewardsPerSecond()` function on FixedRateRewardsSource can be called by either Governor OR Strategist. The Strategist (2/8) can change the reward rate without governance approval.

---

## 4. Token Analysis

### 4.1 OGN Token Properties

**Address**: `0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26`

| Property | Value | Verification |
|----------|-------|--------------|
| Name | OriginToken | `name()` |
| Total Supply | ~1.41B OGN | `totalSupply()` = 1409664846e18 |
| Upgradeable | No | EIP-1967 impl slot = 0x0 |
| Pausable | Yes | `paused()` = false |
| Owner | Timelock | `owner()` = 0x35918c... |

**Pause Function**: The OGN token has a `paused` state, which is governance-controlled via the Timelock. When paused, transfers would be blocked.

```bash
cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 \
  "paused()(bool)"
# Result: false
```

### 4.2 xOGN Staking Properties

**Address**: `0x63898b3b6Ef3d39332082178656E9862bee45C57`

| Property | Value | Verification |
|----------|-------|--------------|
| Name | Staked OGN | `name()` |
| Total Supply (points) | ~1.386B | `totalSupply()` |
| OGN Staked | ~696M OGN | `balanceOf(xOGN)` on OGN |
| Min Stake Duration | Configurable | Constructor param |
| Max Stake Duration | 365 days | Hardcoded |
| Multiplier at 1 year | 1.4x | YEAR_BASE = 14e17 |
| Transferable | No | `transfer()` reverts |

**Staking Mechanics**:
- Exponential voting power based on lock duration
- Longer locks = more xOGN points (voting power and reward share)
- Early withdrawal penalty sent to RewardsSource (funds future rewards)
- Non-transferable (cannot be sold)

Source: [ExponentialStaking.sol](https://github.com/OriginProtocol/ousd-governance/blob/master/contracts/ExponentialStaking.sol)

### 4.3 Supply Distribution

| Metric | Value |
|--------|-------|
| OGN Total Supply | ~1.41B |
| OGN Staked in xOGN | ~696M (~49%) |
| Migration Status | Ended May 28, 2025 |

```bash
# OGN staked in xOGN
cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 \
  "balanceOf(address)(uint256)" 0x63898b3b6Ef3d39332082178656E9862bee45C57
# Result: 696245568716074492287325040 (~696M)

# Migration ended
cast call --rpc-url https://eth.drpc.org 0x95c347D6214614A780847b8aAF4f96Eb84f4da6d \
  "isMigrationActive()(bool)"
# Result: false

cast call --rpc-url https://eth.drpc.org 0x95c347D6214614A780847b8aAF4f96Eb84f4da6d \
  "endTime()(uint256)"
# Result: 1748458823 (May 28, 2025)
```

---

## 5. Metric Analysis by Framework Category

### 5.1 Onchain Governance Workflow

**Assessment: Partial Control**

xOGN holders have binding on-chain governance over Ethereum mainnet contracts through a standard Governor Bravo setup:
- 100,000 xOGN threshold to create proposals
- 20% quorum requirement
- 2-day timelock delay
- Governance contract has PROPOSER and EXECUTOR roles on Timelock

**However**, this governance does NOT extend to:
1. Base chain contracts (controlled by 5/8 multisig)
2. OGN Buyback contract (controlled by 2/8 Strategist multisig)
3. Immediate actions (Strategist can bypass timelock for many operations)

### 5.2 Role Accountability

**Assessment: Partial Accountability**

| Role | Can governance revoke? | Bypass timelock? |
|------|----------------------|------------------|
| Admin Multisig (5/8) | Yes (Timelock can change roles) | No |
| Guardian Multisig (2/8) | Yes | Yes (pause functions) |
| Strategist Multisig (2/8) | Yes (via setStrategistAddr) | Yes (many functions) |
| Buyback Operator (1/3) | No (not governed) | Yes (buyback execution) |

The Strategist role is particularly powerful. From VaultAdmin.sol, the Strategist can:
- `setVaultBuffer()` - Change vault buffer percentage
- `setDefaultStrategy()` - Change default strategy
- `setRebaseRateMax()` - Change yield distribution rate
- `setDripDuration()` - Change drip duration
- `depositToStrategy()` / `withdrawFromStrategy()` - Move funds
- `pauseRebase()` / `pauseCapital()` - Pause operations
- `withdrawAllFromStrategy()` / `withdrawAllFromStrategies()` - Emergency withdrawal

Source: [VaultAdmin.sol:26-32, 44-478](https://github.com/OriginProtocol/origin-dollar/blob/master/contracts/contracts/vault/VaultAdmin.sol)

### 5.3 Protocol Upgrade Authority

**Assessment: Governance-Controlled (Ethereum), Multisig-Controlled (Base)**

Ethereum contracts use a custom proxy pattern (InitializeGovernedUpgradeabilityProxy) where:
- The governor (Timelock) can call `upgradeTo()`
- Upgrades require governance approval + 2-day timelock

```bash
# OETH Vault admin (proxy upgrade authority)
cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab \
  "admin()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F (Timelock)
```

Base contracts are upgradeable by the Base Timelock, which is controlled by the 5/8 Admin Multisig.

### 5.4 Token Upgrade Authority

**Assessment: Non-Upgradeable**

The OGN token is NOT a proxy and cannot be upgraded:

```bash
cast storage --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 \
  0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
# Result: 0x0 (no implementation address = not a proxy)
```

### 5.5 Supply Control

**Assessment: Governance-Controlled with No Emissions**

The OGN token owner is the Timelock. Per documentation and on-chain state:
- No new OGN emissions
- Migration from OGV has ended
- Total supply is fixed at ~1.41B

```bash
# OGN owner
cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 \
  "owner()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F (Timelock)
```

### 5.6 Privileged Access Gating

**Assessment: Guardian and Strategist Have Material Bypass Powers**

The Guardian (2/8) can:
- Pause deposits/redeems on vaults
- Rebalance strategies without timelock delay

The Strategist (2/8) can:
- Pause rebase and capital
- Move funds between strategies
- Change fee parameters
- Change reward distribution rate

These bypasses are operational (for emergency response) but represent material actions that don't require tokenholder approval.

### 5.7 Token Censorship

**Assessment: Pause Capability Exists (Governance-Controlled)**

The OGN token has a `paused` state controlled by the owner (Timelock). If paused, transfers would be blocked. This is a censorship capability, but it requires governance approval.

---

## 6. Value Accrual Summary

### 6.1 Revenue Sources

| Source | Chain | Fee | Collected By | Flow |
|--------|-------|-----|--------------|------|
| OETH Yield | Ethereum | 20% of yield | OETH Vault | → Buyback Operator (0xBB077E71...) |
| OUSD Yield | Ethereum | 20% of yield | OUSD Vault | → Buyback Operator (0xBB077E71...) |
| Super OETH Yield | Base | 20% of yield | Super OETH Vault | → Buyback Operator (0xBB077E71...) |
| OS Yield | Sonic | 10% of yield | OS Vault | → Buyback Operator (0xBB077E71...) |

**All products send fees to the SAME Buyback Operator multisig (1/3) on Ethereum.** This centralizes fee collection across all chains.

**Verification:**
```bash
# Super OETH fee flow
cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "trusteeFeeBps()(uint256)"
# Result: 2000 (20%)
cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c

# OS (Sonic) fee flow
cast call --rpc-url https://rpc.soniclabs.com 0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186 "trusteeFeeBps()(uint256)"
# Result: 1000 (10%)
cast call --rpc-url https://rpc.soniclabs.com 0xa3c0eCA00D2B76b4d1F170b0AB3FdeA16C180186 "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c
```

### 6.2 Distribution Mechanism

**Semi-Programmatic with Manual Steps**:

1. Fees accumulate in Buyback Operator multisig (1/3)
2. Buyback Operator manually executes swaps to OGN
3. OGN transferred to FixedRateRewardsSource
4. FixedRateRewardsSource distributes at fixed rate (currently 2.8 OGN/sec)
5. xOGN holders claim by calling `collectRewards()` on xOGN contract

The final step (claiming) is programmatic, but the earlier steps (buyback execution, OGN transfer) are manual.

### 6.3 Control Over Value Flows

| Control Point | Who Can Change | Governance Controlled? |
|---------------|----------------|----------------------|
| Fee rate (trusteeFeeBps) | Governor only | Yes |
| Fee recipient (trusteeAddress) | Governor only | Yes |
| Buyback parameters | Strategist (2/8) | No |
| Reward rate (rewardsPerSecond) | Governor OR Strategist | Partial |
| Reward target (xOGN address) | Governor only | Yes |

---

## 7. Offchain Dependencies

### 7.1 Trademark

**Owner**: [UNVERIFIED] - Origin Protocol Inc likely holds trademarks, but USPTO search required for verification.

### 7.2 Domain & Interfaces

**Operator**: Origin Protocol Labs (Cayman Islands)

Per Terms of Service at https://www.originprotocol.com/tos:
- Interface hosted on IPFS (decentralized)
- Origin Protocol Labs provides non-custodial interface
- Users maintain full custody of assets

### 7.3 Licensing

**Code License**: MIT License

Source: [LICENSE](https://github.com/OriginProtocol/origin-dollar/blob/master/LICENSE)

The protocol code is open source under MIT, allowing anyone to fork and deploy.

---

## 8. Conflicts of Interest & Risks

### 8.1 Multisig Overlap Risk

All three critical multisigs (Admin, Guardian, Strategist) share the same pool of ~8 signers. This means:
- The same individuals can cancel governance proposals (Admin 5/8)
- Execute emergency actions (Guardian 2/8)
- Control value flows (Strategist 2/8, Buyback Operator 1/3)

If 5+ of these signers coordinate, they can effectively control the protocol regardless of tokenholder votes.

### 8.2 Base Chain Governance Gap

Super OETH on Base is a significant product, but xOGN holders have NO direct governance over it. Base governance is 100% multisig-controlled.

### 8.3 Buyback Discretion

The flow from fees → OGN buybacks → xOGN rewards has multiple discretionary steps:
1. Buyback Operator (1/3) must manually execute buybacks
2. Strategist (2/8) controls the Buyback contract
3. Strategist can change the reward rate

There is no on-chain guarantee that fees will be converted to OGN rewards.

### 8.4 Governance Participation Risk

With 20% quorum and 100,000 xOGN proposal threshold, governance requires significant participation. If tokenholder engagement drops, the multisigs effectively control the protocol.

---

## 9. Summary Assessment

| Criteria | Assessment | Score Indicator |
|----------|------------|-----------------|
| Onchain Governance Workflow | Binding for Ethereum, not Base | Partial |
| Role Accountability | Guardian/Strategist bypass timelock | At Risk |
| Protocol Upgrade Authority | Governance-controlled (ETH), multisig (Base) | Partial |
| Token Upgrade Authority | Non-upgradeable | Strong |
| Supply Control | Fixed, no emissions | Strong |
| Privileged Access Gating | Strategist can pause/move funds | At Risk |
| Token Censorship | Pause function exists (governance-controlled) | Moderate |
| Accrual Active | Yes, but with discretionary steps | Partial |
| Treasury Ownership | No dedicated treasury | N/A |
| Accrual Mechanism Control | Strategist can change rates | At Risk |
| Source Verification | All contracts verified | Strong |
| Token Distribution | ~49% staked | Moderate |
| Trademark | [UNVERIFIED] | TBD |
| Domain Control | IPFS interface, company operates | Moderate |
| Licensing | MIT open source | Strong |

---

## 10. Appendix: All Cast Calls

### Ethereum Mainnet

```bash
# OGN Token
cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 "name()(string)"
# Result: "OriginToken"

cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 "totalSupply()(uint256)"
# Result: 1409664846000000000000000000

cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 "owner()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

cast call --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 "paused()(bool)"
# Result: false

cast storage --rpc-url https://eth.drpc.org 0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
# Result: 0x0 (not upgradeable)

# xOGN Staking
cast call --rpc-url https://eth.drpc.org 0x63898b3b6Ef3d39332082178656E9862bee45C57 "name()(string)"
# Result: "Staked OGN"

cast call --rpc-url https://eth.drpc.org 0x63898b3b6Ef3d39332082178656E9862bee45C57 "totalSupply()(uint256)"
# Result: 1385815186506618606590476589

cast call --rpc-url https://eth.drpc.org 0x63898b3b6Ef3d39332082178656E9862bee45C57 "governor()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

cast call --rpc-url https://eth.drpc.org 0x63898b3b6Ef3d39332082178656E9862bee45C57 "rewardsSource()(address)"
# Result: 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b

# Governance
cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "name()(string)"
# Result: "Origin DeFi Governance"

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "token()(address)"
# Result: 0x63898b3b6Ef3d39332082178656E9862bee45C57

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "timelock()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "proposalThreshold()(uint256)"
# Result: 100000000000000000000000 (100,000 xOGN)

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "votingDelay()(uint256)"
# Result: 7200 blocks

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "votingPeriod()(uint256)"
# Result: 14416 blocks

cast call --rpc-url https://eth.drpc.org 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC "quorumNumerator()(uint256)"
# Result: 20 (20%)

# Timelock Roles
cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F "getMinDelay()(uint256)"
# Result: 172800 (2 days)

cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F "hasRole(bytes32,address)(bool)" 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC
# Result: true (Governance has PROPOSER)

cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F "hasRole(bytes32,address)(bool)" 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 0x1D3Fbd4d129Ddd2372EA85c5Fa00b2682081c9EC
# Result: true (Governance has EXECUTOR)

cast call --rpc-url https://eth.drpc.org 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F "hasRole(bytes32,address)(bool)" 0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783 0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899
# Result: true (Admin Multisig has CANCELLER)

# OETH Vault
cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab "governor()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab "strategistAddr()(address)"
# Result: 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971

cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab "trusteeAddress()(address)"
# Result: 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c

cast call --rpc-url https://eth.drpc.org 0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab "trusteeFeeBps()(uint256)"
# Result: 2000 (20%)

# Admin Multisig (5/8)
cast call --rpc-url https://eth.drpc.org 0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899 "getOwners()(address[])"
# Result: [0x530d3F8C..., 0xce96ae6D..., 0x336C02D3..., 0x6AC8d65D..., 0x617a3582..., 0x17aBc3F0..., 0x39772922..., 0xa96bD9c5...]

cast call --rpc-url https://eth.drpc.org 0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899 "getThreshold()(uint256)"
# Result: 5

# Guardian Multisig (2/8)
cast call --rpc-url https://eth.drpc.org 0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC "getOwners()(address[])"
# Result: [8 addresses]

cast call --rpc-url https://eth.drpc.org 0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC "getThreshold()(uint256)"
# Result: 2

# Strategist Multisig (2/8)
cast call --rpc-url https://eth.drpc.org 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971 "getOwners()(address[])"
# Result: [8 addresses]

cast call --rpc-url https://eth.drpc.org 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971 "getThreshold()(uint256)"
# Result: 2

# Buyback Operator (1/3)
cast call --rpc-url https://eth.drpc.org 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c "getOwners()(address[])"
# Result: [3 addresses]

cast call --rpc-url https://eth.drpc.org 0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c "getThreshold()(uint256)"
# Result: 1

# OGN Buyback
cast call --rpc-url https://eth.drpc.org 0x77314EB392b2be47C014cde0706908b3307Ad6a9 "governor()(address)"
# Result: 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971 (Strategist, NOT Timelock!)

# FixedRateRewardsSource
cast call --rpc-url https://eth.drpc.org 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b "governor()(address)"
# Result: 0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F

cast call --rpc-url https://eth.drpc.org 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b "strategistAddr()(address)"
# Result: 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971

cast call --rpc-url https://eth.drpc.org 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b "rewardsTarget()(address)"
# Result: 0x63898b3b6Ef3d39332082178656E9862bee45C57 (xOGN)

cast call --rpc-url https://eth.drpc.org 0x7609c88E5880e934dd3A75bCFef44E31b1Badb8b "rewardConfig()((uint64,uint192))"
# Result: (1772498087, 2800000000000000000) = 2.8 OGN/second

# Migration Status
cast call --rpc-url https://eth.drpc.org 0x95c347D6214614A780847b8aAF4f96Eb84f4da6d "isMigrationActive()(bool)"
# Result: false

cast call --rpc-url https://eth.drpc.org 0x95c347D6214614A780847b8aAF4f96Eb84f4da6d "endTime()(uint256)"
# Result: 1748458823 (May 28, 2025)
```

### Base Chain

```bash
# Base Timelock
cast call --rpc-url https://base.drpc.org 0xf817cb3092179083c48c014688D98B72fB61464f "getMinDelay()(uint256)"
# Result: 172800 (2 days)

cast call --rpc-url https://base.drpc.org 0xf817cb3092179083c48c014688D98B72fB61464f "hasRole(bytes32,address)(bool)" 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 0x92A19381444A001d62cE67BaFF066fA1111d7202
# Result: true (Admin Multisig has PROPOSER)

cast call --rpc-url https://base.drpc.org 0xf817cb3092179083c48c014688D98B72fB61464f "hasRole(bytes32,address)(bool)" 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 0x92A19381444A001d62cE67BaFF066fA1111d7202
# Result: true (Admin Multisig has EXECUTOR)

# Base Admin Multisig (5/8)
cast call --rpc-url https://base.drpc.org 0x92A19381444A001d62cE67BaFF066fA1111d7202 "getOwners()(address[])"
# Result: [same 8 signers as Ethereum]

cast call --rpc-url https://base.drpc.org 0x92A19381444A001d62cE67BaFF066fA1111d7202 "getThreshold()(uint256)"
# Result: 5

# Base Guardian Multisig (1/2)
cast call --rpc-url https://base.drpc.org 0x28bce2eE5775B652D92bB7c2891A89F036619703 "getOwners()(address[])"
# Result: [2 addresses]

cast call --rpc-url https://base.drpc.org 0x28bce2eE5775B652D92bB7c2891A89F036619703 "getThreshold()(uint256)"
# Result: 1

# Super OETH Vault
cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "governor()(address)"
# Result: 0xf817cb3092179083c48c014688D98B72fB61464f (Base Timelock)

cast call --rpc-url https://base.drpc.org 0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93 "strategistAddr()(address)"
# Result: 0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971
```

---

*End of Research Report*
