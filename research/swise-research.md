# SWISE Token Research Report

**Date:** 2026-03-03
**Token:** StakeWise (SWISE)
**Network:** Ethereum Mainnet (primary), Gnosis Chain (secondary)
**Contract:** `0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2`
**Framework:** Aragon Ownership Token Framework

---

## Executive Summary

SWISE is the governance token of the StakeWise protocol, a liquid staking platform. This analysis reveals that **SWISE tokenholders do not have binding, on-chain governance authority**. The protocol uses off-chain Snapshot voting with execution through a 4-of-7 multisig that has the capacity to override tokenholder votes. There is **no active value accrual mechanism** directing protocol revenue to SWISE holders. Key protocol assets (brand, domains, IP) are controlled by StakeWise Labs OÜ, not a DAO-controlled entity.

**Key Findings:**
- **Governance:** Off-chain (Snapshot) with multisig execution - not binding on-chain
- **Value Accrual:** No direct distribution to SWISE holders; fees accrue to DAO treasury controlled by multisig
- **Token Control:** Upgradeable proxy with pause capability; controlled by multisig
- **Supply:** Fixed 1B SWISE, no mint function in current implementation
- **Offchain Assets:** Brand and IP controlled by StakeWise Labs OÜ (Estonia)

---

## Contract Index Table

| Contract | Address | What it does | Upgradeable? | Ownership-relevant? | Value-accrual-relevant? |
|----------|---------|--------------|--------------|---------------------|------------------------|
| **SWISE Token (Proxy)** | `0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2` | Governance token | Yes (EIP-1967) | Y | N |
| **SWISE Implementation** | `0xa28c2d79f0c5b78cec699dab0303008179815396` | Token logic | N/A | Y | N |
| **SWISE Proxy Admin** | `0x3eb0175dcd67d3ab139aa03165e24aa2188a4c22` | Controls token upgrades | No | Y | N |
| **DAO Multisig** | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | 4-of-7 Safe, governance executor | No | Y | Y |
| **SafeSnap Module** | `0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0` | Reality.eth oracle module | No | Y | N |
| **osETH Token** | `0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38` | Liquid staking token (V3) | No | N | Y |
| **OsTokenVaultController** | `0x2A261e60FB14586B474C208b1B7AC6D0f5000306` | Controls osETH minting/burning, fees | No | Y | Y |
| **OsTokenConfig** | `0x287d1e2A8dE183A8bf8f2b09Fa1340fBd766eb59` | osETH parameters | No | Y | N |
| **VaultsRegistry** | `0x3a0008a588772446f6e656133C2D5029CC4FC20E` | Tracks vaults and factories | No | Y | N |
| **Keeper** | `0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5` | Oracle management, rewards | No | Y | Y |
| **GenesisVault** | `0xAC0F906E433d58FA868F936E8A43230473652885` | V2 migration vault | No | N | N |
| **VaultFactory** | `0x7A8cbBf690084E43De778173cfAcf7313c9122DD` | Creates public vaults | No | N | N |
| **PrivVaultFactory** | `0x4C958642F1CD735F13aed02A4FB015153edDf8Fd` | Creates private vaults | No | N | N |
| **Erc20VaultFactory** | `0x97795DA27138BD8d79204D37F3A2e80fA4d30488` | Creates ERC20 vaults | No | N | N |
| **BlocklistVaultFactory** | `0x608d8Ca6916b96edf63Dd429e62Fe1366ae6f3B5` | Creates blocklist vaults | No | N | N |
| **SharedMevEscrow** | `0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86` | MEV escrow | No | N | Y |
| **CuratorsRegistry** | `0xa23F7c8d25f4503cA4cEd84d9CC2428e8745933C` | Vault curator registry | No | Y | N |
| **DepositDataRegistry** | `0x75AB6DdCe07556639333d3Df1eaa684F5735223e` | Validator deposit data | No | N | N |
| **PriceFeed** | `0x8023518b2192FB5384DAdc596765B3dD1cdFe471` | osETH/ETH price oracle | No | N | Y |
| **OsTokenRedeemer** | `0xdF3123dD182b8d3e0266a2dC37eEb8366d149B5A` | osETH redemption | No | N | N |

### Etherscan Links for Key Contracts

| Contract | Etherscan | Proxy Pattern |
|----------|-----------|---------------|
| SWISE Token | [Etherscan](https://etherscan.io/address/0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2) | EIP-1967 Transparent Proxy |
| SWISE Implementation | [Etherscan](https://etherscan.io/address/0xa28c2d79f0c5b78cec699dab0303008179815396) | N/A |
| DAO Multisig | [Etherscan](https://etherscan.io/address/0x144a98cb1CdBb23610501fE6108858D9B7D24934) | Gnosis Safe |
| OsTokenVaultController | [Etherscan](https://etherscan.io/address/0x2A261e60FB14586B474C208b1B7AC6D0f5000306) | Non-upgradeable |

---

## Governance and Ownership Model

### Ownership Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SWISE TOKENHOLDER                                   │
│                        (Off-chain voting only)                               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Snapshot vote
                                 │ (Non-binding)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SafeSnap Module (Reality.eth)                            │
│                    0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0               │
│    Bond: 200,000 tokens | Timeout: 24h | Cooldown: 24h | Expiry: 7d        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Can execute (if not overridden)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DAO Multisig (4-of-7 Safe)                             │
│                    0x144a98cb1CdBb23610501fE6108858D9B7D24934               │
│                                                                             │
│  Signers:                                                                   │
│  1. 0xC46e791d4fB1207fAB8Cb0e44889127138539c69                             │
│  2. 0x9cC9c3de8e710781983a65b90B7efEaaD2D3D7D8                             │
│  3. 0x9Aa6Db877742aD8D8c7fE209F561fbd2bE19D5F4                             │
│  4. 0x7E36F1fF26cffD6906c11Cd7Eca5f6E993Ba6CE3                             │
│  5. 0x1C86117156Ba31b5d62f02eB56bE9aC5a06610d3                             │
│  6. 0xc0c9707B552C6970f66Ab91D563Bf9b6048E9da6                             │
│  7. 0x61B01a33Aea3e827B3941Ab097778bd3FA48a332                             │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │ owns
                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Protocol Contracts                                   │
│                                                                             │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │
│  │  Proxy Admin        │ │ OsTokenVault        │ │ VaultsRegistry      │   │
│  │  (Token upgrades)   │ │ Controller          │ │ (Vault management)  │   │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │
│                                                                             │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │
│  │  Keeper             │ │ OsTokenConfig       │ │ CuratorsRegistry    │   │
│  │  (Oracle mgmt)      │ │ (Parameters)        │ │ (Curator mgmt)      │   │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Critical Finding: Multisig Override Capability

The SafeSnap module allows Snapshot votes to propose transactions, but the **4-of-7 multisig can execute transactions independently** without going through SafeSnap. The multisig signers can:
1. Execute any transaction with 4 signatures
2. Disable or modify the SafeSnap module
3. Change multisig owners/threshold

**This means SWISE tokenholders do not have binding on-chain authority.** Their votes are advisory; execution depends on multisig cooperation.

---

## Role Matrix

| Contract | Role | Current Holder | Holder Type | Verified Via | Who Controls the Holder |
|----------|------|----------------|-------------|--------------|------------------------|
| SWISE Proxy Admin | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x3eb0175dcd67d3ab139aa03165e24aa2188a4c22 "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| SWISE Token | `DEFAULT_ADMIN_ROLE` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2 "getRoleMember(bytes32,uint256)(address)" 0x0 0` → `0x144a98...` | 7 signers (4 required) |
| SWISE Token | `PAUSER_ROLE` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call ... "hasRole(bytes32,address)(bool)" 0x65d7a28... 0x144a98...` → `true` | 7 signers (4 required) |
| OsTokenVaultController | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x2A261e60FB14586B474C208b1B7AC6D0f5000306 "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| VaultsRegistry | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x3a0008a588772446f6e656133C2D5029CC4FC20E "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| Keeper | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5 "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| OsTokenConfig | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0x287d1e2A8dE183A8bf8f2b09Fa1340fBd766eb59 "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| CuratorsRegistry | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0xa23F7c8d25f4503cA4cEd84d9CC2428e8745933C "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |
| osETH Token | `owner()` | `0x0000000000000000000000000000000000000000` | Renounced | `cast call 0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38 "owner()(address)"` → `0x0` | N/A (renounced) |
| SafeSnap Module | `owner()` | `0x144a98cb1CdBb23610501fE6108858D9B7D24934` | Multisig | `cast call 0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0 "owner()(address)"` → `0x144a98...` | 7 signers (4 required) |

### Privileged Functions by Contract

#### SWISE Token
- **`pause()`** - Halts all transfers. Requires `PAUSER_ROLE` (held by multisig).
- **`unpause()`** - Resumes transfers. Requires `PAUSER_ROLE`.
- **`grantRole()`** - Grants any role. Requires `DEFAULT_ADMIN_ROLE`.
- **`revokeRole()`** - Revokes any role. Requires `DEFAULT_ADMIN_ROLE`.
- **Upgrade** - Via proxy admin. Requires proxy admin owner (multisig).

Source: [stakewise/contracts/contracts/tokens/StakeWiseToken.sol](https://github.com/stakewise/contracts/blob/main/contracts/tokens/StakeWiseToken.sol)

#### OsTokenVaultController
- **`setFeePercent(uint16)`** - Changes protocol fee (currently 5%). `onlyOwner`.
- **`setTreasury(address)`** - Changes fee recipient. `onlyOwner`.
- **`setCapacity(uint256)`** - Changes osETH minting capacity. `onlyOwner`.
- **`setKeeper(address)`** - Changes Keeper address. `onlyOwner`.

Source: [v3-core/contracts/tokens/OsTokenVaultController.sol:156-197](https://github.com/stakewise/v3-core/blob/main/contracts/tokens/OsTokenVaultController.sol#L156-L197)

#### Keeper
- **`addOracle(address)`** - Adds oracle signer. `onlyOwner`.
- **`removeOracle(address)`** - Removes oracle signer. `onlyOwner`.
- **`updateConfig(string)`** - Updates oracle config IPFS hash. `onlyOwner`.

Source: [v3-core/contracts/keeper/KeeperOracles.sol:32-70](https://github.com/stakewise/v3-core/blob/main/contracts/keeper/KeeperOracles.sol#L32-L70)

#### VaultsRegistry
- **`addFactory(address)`** - Registers new vault factory. `onlyOwner`.
- **`removeFactory(address)`** - Removes vault factory. `onlyOwner`.
- **`addVaultImpl(address)`** - Whitelists vault implementation. `onlyOwner`.
- **`removeVaultImpl(address)`** - Removes vault implementation. `onlyOwner`.

Source: [v3-core/contracts/vaults/VaultsRegistry.sol:40-65](https://github.com/stakewise/v3-core/blob/main/contracts/vaults/VaultsRegistry.sol#L40-L65)

---

## Multichain Deployments

### Gnosis Chain

| Contract | Address | Owner |
|----------|---------|-------|
| OsTokenVaultController | `0x60B2053d7f2a0bBa70fe6CDd88FB47b579B9179a` | `0x8737f638E9af54e89ed9E1234dbC68B115CD169e` |
| VaultsRegistry | `0x7d014B3C6ee446563d4e0cB6fBD8C3D0419867cB` | `0x8737f638E9af54e89ed9E1234dbC68B115CD169e` |
| Keeper | `0xcAC0e3E35d3BA271cd2aaBE688ac9DB1898C26aa` | `0x8737f638E9af54e89ed9E1234dbC68B115CD169e` |
| OsToken | `0xF490c80aAE5f2616d3e3BDa2483E30C4CB21d1A0` | `0x0` (renounced) |

**Gnosis Chain Multisig:** `0x8737f638E9af54e89ed9E1234dbC68B115CD169e`
- **Threshold:** 4-of-7
- **Signers:** Same 7 signers as Ethereum mainnet
- **Module:** `0x479D00fF7Ed26803528dC3e3839ed8928f047321` (SafeSnap equivalent)

Verification:
```
cast call 0x8737f638E9af54e89ed9E1234dbC68B115CD169e "getThreshold()(uint256)" --rpc-url https://rpc.gnosischain.com
→ 4

cast call 0x8737f638E9af54e89ed9E1234dbC68B115CD169e "getOwners()(address[])" --rpc-url https://rpc.gnosischain.com
→ [0xc0c9707B552C6970f66Ab91D563Bf9b6048E9da6, 0x1C86117156Ba31b5d62f02eB56bE9aC5a06610d3,
   0x7E36F1fF26cffD6906c11Cd7Eca5f6E993Ba6CE3, 0x9Aa6Db877742aD8D8c7fE209F561fbd2bE19D5F4,
   0x9cC9c3de8e710781983a65b90B7efEaaD2D3D7D8, 0xC46e791d4fB1207fAB8Cb0e44889127138539c69,
   0x61B01a33Aea3e827B3941Ab097778bd3FA48a332]
```

**Key Finding:** Gnosis Chain contracts have the same ownership structure as Ethereum mainnet - controlled by a 4-of-7 multisig with identical signers.

---

## Value Accrual Mechanism

### Revenue Sources

1. **Protocol Fee on osETH Rewards**
   - **Rate:** 5% (500 basis points)
   - **Contract:** OsTokenVaultController
   - **Function:** Applied via `updateState()` when rewards accrue
   - **Recipient:** DAO Treasury (`0x144a98cb1CdBb23610501fE6108858D9B7D24934`)

Verification:
```
cast call 0x2A261e60FB14586B474C208b1B7AC6D0f5000306 "feePercent()(uint16)" --rpc-url https://ethereum.publicnode.com
→ 500

cast call 0x2A261e60FB14586B474C208b1B7AC6D0f5000306 "treasury()(address)" --rpc-url https://ethereum.publicnode.com
→ 0x144a98cb1CdBb23610501fE6108858D9B7D24934
```

2. **Individual Vault Fees**
   - Vault operators set their own fee rates
   - Fees go to vault operators, not protocol treasury
   - No SWISE tokenholder benefit

### Distribution Mechanism

**There is NO automated distribution of revenue to SWISE tokenholders.**

- Protocol fees accrue to the DAO Treasury (multisig)
- Distribution requires a governance vote + multisig execution
- No programmatic fee distributor or staking contract for SWISE exists

### Control Over Value Flows

| Parameter | Controller | Can SWISE holders change? |
|-----------|------------|--------------------------|
| Fee percent | OsTokenVaultController owner (multisig) | No (requires multisig) |
| Fee recipient | OsTokenVaultController owner (multisig) | No (requires multisig) |
| osETH capacity | OsTokenVaultController owner (multisig) | No (requires multisig) |
| Treasury spending | Multisig (4-of-7) | No (advisory vote only) |

### Proposed Tokenomics (Not Implemented)

Multiple tokenomics proposals have been discussed but NOT implemented:
- **veSWISE:** Vote-escrowed SWISE with revenue sharing - [Forum](https://forum.stakewise.io/t/stakewise-tokenomics-proposal-veswise/836)
- **dLP (Dynamic Liquidity Provision):** - [Forum](https://forum.stakewise.io/t/updated-swise-tokenomics-via-dynamic-liquidity-provision-dlp-staking/1154)

**Status:** As of this research date, no value accrual mechanism for SWISE tokenholders is active on-chain.

---

## Framework Criteria Analysis

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow — ⚠️ AT RISK

**Status:** Off-chain Snapshot voting with multisig execution

**Evidence:**
- Snapshot space: `stakewise.eth` at [snapshot.org](https://snapshot.org/#/stakewise.eth)
- Voting strategy: SWISE balance + vested SWISE + delegated power
- Quorum: 3,000,000 SWISE
- Execution: Via SafeSnap module → Reality.eth → Multisig

**Critical Issue:** The multisig can execute transactions independently of SafeSnap. SWISE tokenholder votes are **advisory, not binding**.

SafeSnap Module Configuration:
```
cast call 0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0 "minimumBond()(uint256)" --rpc-url https://ethereum.publicnode.com
→ 200000000000000000000000 (200,000 tokens)

cast call 0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0 "questionTimeout()(uint32)" --rpc-url https://ethereum.publicnode.com
→ 86400 (24 hours)

cast call 0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0 "answerExpiration()(uint32)" --rpc-url https://ethereum.publicnode.com
→ 604800 (7 days)
```

#### 1.2 Role Accountability — ⚠️ AT RISK

**Status:** All privileged roles trace to the 4-of-7 multisig

All V3 protocol contracts use `Ownable2Step` pattern with ownership held by the DAO multisig. While this provides a two-step ownership transfer safeguard, accountability to tokenholders is indirect (via non-binding votes).

#### 1.3 Protocol Upgrade Authority — ⚠️ AT RISK

**Status:** Multisig controls all upgrades

- osETH token: Owner is renounced (non-upgradeable)
- V3 core contracts: Non-upgradeable (no proxy pattern)
- SWISE token: Upgradeable via proxy admin owned by multisig

SWISE token upgrade authority:
```
Proxy: 0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2
Implementation: 0xa28c2d79f0c5b78cec699dab0303008179815396
Proxy Admin: 0x3eb0175dcd67d3ab139aa03165e24aa2188a4c22
Proxy Admin Owner: 0x144a98cb1CdBb23610501fE6108858D9B7D24934 (multisig)
```

#### 1.4 Token Upgrade Authority — ⚠️ AT RISK

**Status:** SWISE is upgradeable; controlled by multisig

The SWISE token uses EIP-1967 Transparent Proxy pattern. The proxy admin owner (multisig) can:
- Upgrade the implementation to any arbitrary code
- Change token behavior, add/remove functions
- Potentially introduce mint functions, blacklists, etc.

#### 1.5 Supply Control — ✅ POSITIVE (with caveat)

**Status:** Fixed 1B supply; no mint function in current implementation

Current implementation:
- Total supply: 1,000,000,000 SWISE (minted at initialization)
- No `mint()` function exists
- No `burn()` function exists

**Caveat:** Because the token is upgradeable, the multisig could deploy a new implementation with minting capability.

Verification:
```
cast call 0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2 "totalSupply()(uint256)" --rpc-url https://ethereum.publicnode.com
→ 1000000000000000000000000000 (1 billion with 18 decimals)
```

#### 1.6 Privileged Access Gating — ⚠️ AT RISK

**Status:** Pause capability exists; controlled by multisig

The SWISE token has a `pause()` function that halts all transfers:
- `PAUSER_ROLE` holder: `0x144a98cb1CdBb23610501fE6108858D9B7D24934` (multisig)
- Current paused status: `false`

```
cast call 0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2 "paused()(bool)" --rpc-url https://ethereum.publicnode.com
→ false
```

For V3 protocol:
- No global pause on osETH transfers
- Individual vaults can have restrictions (blocklist vaults)
- Keeper can have oracle thresholds that affect operation

#### 1.7 Token Censorship — ⚠️ AT RISK

**Status:** No current blacklist; but pause and upgrade capability exists

The current SWISE implementation does not have:
- Blacklist/blocklist functionality
- Freeze functions
- Force transfer functions

**Risk:** The proxy upgrade capability means these could be added by the multisig.

### Metric 2: Value Accrual

#### 2.1 Accrual Active — ⚠️ AT RISK

**Status:** No active value accrual to SWISE tokenholders

- Protocol fees (5% on osETH rewards) go to treasury
- No buyback mechanism
- No fee distribution to SWISE holders
- No staking rewards for SWISE

#### 2.2 Treasury Ownership — ⚠️ AT RISK

**Status:** Treasury controlled by multisig with SafeSnap

Treasury address: `0x144a98cb1CdBb23610501fE6108858D9B7D24934` (same as multisig)
- Contains: ~18.4M SWISE, ETH, osETH, other tokens
- Control: 4-of-7 multisig with SafeSnap module
- Tokenholder authority: Advisory only

#### 2.3 Accrual Mechanism Control — ⚠️ AT RISK

**Status:** Fee parameters controlled by multisig

Controllable parameters:
- `feePercent`: Currently 500 (5%), max 10000 (100%)
- `treasury`: Currently multisig address
- `capacity`: Currently 20,000,000 ETH

All controlled via `onlyOwner` functions on OsTokenVaultController.

#### 2.4 Offchain Value Accrual — ⚠️ AT RISK

**Status:** No evidence of revenue sharing with SWISE holders

StakeWise Labs OÜ operates as a commercial entity. No public agreements exist sharing offchain revenue with the DAO or SWISE tokenholders.

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification — ✅ POSITIVE

**Status:** Both proxy and implementation verified on Etherscan

- Proxy: [Verified](https://etherscan.io/address/0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2#code)
- Implementation: [Verified](https://etherscan.io/address/0xa28c2d79f0c5b78cec699dab0303008179815396#code)
- Source: [stakewise/contracts](https://github.com/stakewise/contracts)

#### 3.2 Protocol Component Source Verification — ✅ POSITIVE

**Status:** All V3 contracts verified and open source

- Repository: [stakewise/v3-core](https://github.com/stakewise/v3-core)
- Audit: [Sigma Prime (September 2024)](https://github.com/stakewise/v3-core/blob/main/audits/2024-09-Sigma-Prime.pdf)
- All mainnet contracts verified on Etherscan

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration — ⚠️ AT RISK (TBD)

**Status:** Significant concentration in vesting contracts and top holders

Top 10 Holders Analysis:
| Rank | Address | Balance | % Supply | Type |
|------|---------|---------|----------|------|
| 1 | 0xF0d99D5d...E1d1bE | 227.2M | 22.72% | VestingEscrow |
| 2 | 0xe2008b01...1F5E | 85.4M | 8.54% | EOA |
| 3 | 0xAF3013A0...1F5E | 48.5M | 4.85% | EOA |
| 4 | powerstake.eth | 40.0M | 4.00% | EOA |
| 5 | 0xb123a6f3...2A5E6 | 40.0M | 4.00% | EOA |
| 6 | 0x652210...E875 | 40.0M | 4.00% | VestingEscrow |
| 7-10 | Various | 138.1M | 13.81% | Mixed |

**Key Metrics:**
- Total holders: ~2,921
- Top 20 holders control: ~81.54% of supply
- VestingEscrow contracts (top 20): ~38.23% of supply

#### 4.2 Future Token Unlocks — NEUTRAL

**Status:** 4-year vesting schedule from April 2021 is near complete

Vesting contracts:
- Factory: `0x7B910cc3D4B42FEFF056218bD56d7700E4ea7dD5`
- Escrow: `0xaE678D2A911400a55e06f4A1F0C0B363F3eE2e42`

Original distribution (per documentation):
- 51% to community (2021-2025)
- Remaining: team, investors, treasury

Most vesting should be complete or near-complete by 2025.

### Metric 5: Offchain Dependencies

#### 5.1 Trademark — ⚠️ AT RISK

**Status:** Presumed controlled by StakeWise Labs OÜ

No public trademark registration found in USPTO/EUIPO for "StakeWise." Brand is controlled by StakeWise Labs OÜ, not a DAO-controlled entity.

#### 5.2 Distribution — ⚠️ AT RISK

**Status:** Domains controlled by StakeWise Labs OÜ

Primary domains:
- stakewise.io — Labs controlled
- app.stakewise.io — Labs controlled
- docs.stakewise.io — Labs controlled
- vote.stakewise.io — Snapshot (DAO)

Company Registration:
- **Entity:** STAKEWISE LABS OÜ
- **Registration:** 16108892 (Estonia)
- **Associated Persons:** Dmitri Tšumak, Kirill Kutakov
- [InfoRegister](https://www.inforegister.ee/en/16108892-STAKEWISE-LABS-OU/)

#### 5.3 Licensing — ⚠️ AT RISK

**Status:** V3-core under BUSL-1.1; IP owned by StakeWise Labs

**v3-core License:**
- Type: Business Source License 1.1 (BUSL-1.1)
- Licensor: StakeWise Labs
- Change Date: January 1, 2026 (or earlier via ENS)
- Change License: MIT

ENS Override Check:
```
v3-license-date.stakewise.eth — No record set
```

The ENS subdomain has no resolver configured, meaning the default date (January 1, 2026) applies.

**Implications:**
- Until Change Date: Commercial use requires Labs permission
- Core IP owned by StakeWise Labs OÜ, not DAO-controlled
- Labs retains licensing control

---

## Summary of Tokenholder Control

### What SWISE Tokenholders Control

| Action | Control Level | Mechanism |
|--------|--------------|-----------|
| Propose governance actions | ✅ Direct | Snapshot voting |
| Vote on proposals | ✅ Direct | Snapshot voting |
| Execute governance actions | ❌ None | Requires multisig |
| Change protocol parameters | ❌ None | Requires multisig |
| Upgrade SWISE token | ❌ None | Requires multisig |
| Control treasury spending | ❌ None | Requires multisig |
| Receive protocol revenue | ❌ None | No mechanism exists |
| Replace multisig signers | ❌ None | Requires multisig |

### What the Multisig Controls

| Action | Binding Constraint |
|--------|-------------------|
| Upgrade SWISE token implementation | None |
| Pause SWISE transfers | None |
| Change protocol fees (0-100%) | None |
| Redirect protocol fees | None |
| Add/remove oracles | None |
| Add/remove vault implementations | None |
| Spend treasury funds | None |
| Change SafeSnap parameters | None |
| Replace multisig signers | 4-of-7 threshold |

---

## Conflicts of Interest

1. **Labs vs. Token Holders:** StakeWise Labs OÜ controls brand, domains, and IP while SWISE tokenholders have only advisory governance. Labs' commercial interests may not align with tokenholder value.

2. **Multisig Independence:** The 7 multisig signers are not identified publicly. Their relationship to Labs, potential conflicts, and replacement process are unclear.

3. **Value Capture:** Protocol fees accrue to treasury but no mechanism exists to distribute them to tokenholders. The multisig decides all spending.

4. **Upgrade Risk:** The SWISE token upgrade capability creates asymmetric risk - tokenholders cannot prevent malicious upgrades.

---

## Open Questions / Unverified Claims

1. **Multisig Signer Identity:** Who are the 7 multisig signers? What is their relationship to StakeWise Labs?

2. **SafeSnap Dispute Resolution:** Has any Reality.eth dispute ever occurred? Can the multisig override during the cooldown period?

3. **Future Tokenomics:** Will veSWISE or dLP ever be implemented? What is the timeline?

4. **Gnosis Chain SafeSnap:** Is the module at `0x479D00fF7Ed26803528dC3e3839ed8928f047321` configured identically to mainnet?

---

## Sources

### Primary Sources

1. **GitHub Repositories:**
   - [stakewise/v3-core](https://github.com/stakewise/v3-core) — V3 protocol contracts
   - [stakewise/contracts](https://github.com/stakewise/contracts) — Legacy contracts including SWISE token

2. **Etherscan Verified Contracts:**
   - [SWISE Token](https://etherscan.io/address/0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2)
   - [OsTokenVaultController](https://etherscan.io/address/0x2A261e60FB14586B474C208b1B7AC6D0f5000306)
   - [DAO Multisig](https://etherscan.io/address/0x144a98cb1CdBb23610501fE6108858D9B7D24934)

3. **Documentation:**
   - [StakeWise Docs](https://docs.stakewise.io)
   - [Governance Process](https://forum.stakewise.io/t/stakewise-dao-governance-process/49)

4. **Governance:**
   - [Snapshot Space](https://snapshot.org/#/stakewise.eth)
   - [Governance Forum](https://forum.stakewise.io)

5. **Audits:**
   - [Sigma Prime Audit (September 2024)](https://github.com/stakewise/v3-core/blob/main/audits/2024-09-Sigma-Prime.pdf)

### On-Chain Verification

All `cast call` commands used RPC endpoints:
- Ethereum: `https://ethereum.publicnode.com` or `https://eth.llamarpc.com`
- Gnosis: `https://rpc.gnosischain.com`

---

*Research conducted by: Researcher Agent*
*Framework version: Aragon Ownership Token Framework*
*Report date: 2026-03-03*
