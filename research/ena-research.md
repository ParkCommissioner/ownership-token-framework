# ENA Token Research Report
## Aragon Ownership Token Framework Analysis

**Date:** 2026-02-24
**Status:** Complete
**Token:** ENA (Ethena Governance Token)
**Network:** Ethereum Mainnet
**Contract:** `0x57e114B691Db790C35207b2e685D4A43181e6061`

---

## Executive Summary

The ENA token is the governance token of the Ethena protocol, a synthetic dollar (USDe) protocol. This analysis evaluates ENA against the Aragon Ownership Token Framework, examining whether ENA tokenholders have meaningful, enforceable control over the protocol and whether the token captures value.

### Key Findings

| Metric | Rating | Summary |
|--------|--------|---------|
| **Onchain Control** | ⚠️ | Governance is Snapshot signaling only; multisig executes all decisions |
| **Value Accrual** | ⚠️ | Fee switch approved but implementation status uncertain; no programmatic distribution |
| **Verifiability** | ✅ | All core contracts verified and open source |
| **Token Distribution** | ⚠️ | 70% insider allocation; significant concentration |
| **Offchain Dependencies** | ⚠️ | IP and trademarks owned by Ethena (BVI) Limited, not tokenholders |

### Critical Distinction

ENA governance is **advisory, not binding**. All protocol changes are executed by the Dev Multisig (5-of-11). ENA holders can signal preferences via Snapshot, but the multisig has discretionary power to execute or ignore those signals. This is fundamentally different from protocols where tokenholder votes trigger automatic onchain execution.

---

## Contract Architecture

### Core Contracts

| Contract | Address | Purpose | Upgradeable |
|----------|---------|---------|-------------|
| **ENA Token** | [`0x57e114B691Db790C35207b2e685D4A43181e6061`](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061) | Governance token | No |
| **sENA (Staked ENA)** | [`0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9`](https://etherscan.io/address/0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9) | Staked ENA for rewards | No |
| **USDe Token** | [`0x4c9edd5852cd905f086c759e8383e09bff1e68b3`](https://etherscan.io/address/0x4c9edd5852cd905f086c759e8383e09bff1e68b3) | Synthetic dollar stablecoin | No |
| **sUSDe Token** | [`0x9d39a5de30e57443bff2a8307a4256c8797a3497`](https://etherscan.io/address/0x9d39a5de30e57443bff2a8307a4256c8797a3497) | Staked USDe (yield-bearing) | No |
| **EthenaMinting V2** | [`0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3`](https://etherscan.io/address/0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3) | USDe mint/redeem | No |

### Multisig Wallets

| Wallet | Address | Threshold | Role |
|--------|---------|-----------|------|
| **Dev Multisig** | [`0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | 5-of-11 | Owner of all core contracts |
| **Hot Swap** | [`0x4423198f26764a8ce9ac8f1683c476854c885d9d`](https://etherscan.io/address/0x4423198f26764a8ce9ac8f1683c476854c885d9d) | 4-of-? | Revenue → USDe conversion |
| **sUSDe Payout** | [`0x71e4f98e8f20c88112489de3dded4489802a3a87`](https://etherscan.io/address/0x71e4f98e8f20c88112489de3dded4489802a3a87) | 3-of-? | Staker rewards distribution |
| **Reserve Fund** | [`0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5`](https://etherscan.io/address/0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5) | 4-of-10 | Emergency reserves |

---

## Governance and Ownership Model

### Ownership Topology

```
ENA Token
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► Can: mint() up to 10% per year, after 365-day wait
            ├─► Can: transferOwnership()
            └─► Cannot: renounceOwnership() (blocked in code)
                    │
                    └─► Multisig Signers: 11 EOAs
                            │
                            └─► NOT elected by ENA holders
                            └─► Controlled by Ethena Labs

sENA Token
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► DEFAULT_ADMIN_ROLE
            └─► Controls BLACKLIST_MANAGER_ROLE

USDe Token
    │
    ├─► Owner: Dev Multisig (5-of-11)
    └─► Minter: EthenaMinting V2 contract

sUSDe Token
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► DEFAULT_ADMIN_ROLE: Dev Multisig
            ├─► REWARDER_ROLE: StakingRewardsDistributor
            ├─► BLACKLIST_MANAGER_ROLE: [unknown holder]
            └─► Can: redistributeLockedAmount() (seize frozen assets)

EthenaMinting V2
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► DEFAULT_ADMIN_ROLE
            ├─► GATEKEEPER_ROLE: Can disable mint/redeem globally
            ├─► MINTER_ROLE: 20 EOAs (Ethena-controlled)
            └─► REDEEMER_ROLE: 20 EOAs (Ethena-controlled)
```

### Role Matrix

| Contract | Role | Current Holder | Holder Type | Verification |
|----------|------|----------------|-------------|--------------|
| ENA | owner() | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call owner()` → confirmed |
| sENA | owner() | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call owner()` → confirmed |
| sENA | DEFAULT_ADMIN_ROLE | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call hasRole(0x00,addr)` → true |
| USDe | owner() | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call owner()` → confirmed |
| USDe | minter() | 0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3 | EthenaMinting V2 | `eth_call minter()` → confirmed |
| sUSDe | owner() | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call owner()` → confirmed |
| sUSDe | DEFAULT_ADMIN_ROLE | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call hasRole(0x00,addr)` → true |
| EthenaMinting | owner() | 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 | Multisig (5/11) | `eth_call owner()` → confirmed |

### Dev Multisig Composition

**Threshold:** 5-of-11
**Verified:** `eth_call getThreshold()` → 5
**Owners:** `eth_call getOwners()` → 11 addresses

```
0x18d32b1ab042b5e9a3430e77fde8b4783a019234
0xb93c042c688f1cf038bab03c4f832f2630bb7d8f
0x66892c66711b2640360c3123e6c23c0cfa50550f
0xe3f95f2e1adec092337fb5d93c1fe87558658b1
0x99682f56f4cccf61bd7e449924f2f62d395e1e45
0x980742edea6b0df3566c19ff4945c57e95449a13
0x690d1e0fac0599874b849ee88aea27f7b348e1f2
0x54d0d64f7326b128959bf37ed7b5f2510656a471
0xfbe49a82cb2bff6fa4c2b1f0d165a5e1175aac83
0xe987e14b2e204fdf5827a3cfca7d476e8df6a99e
0xe5ca87da3a209ad85fdcbb515e1bd92644e9e1a6
```

**Key Finding:** ENA holders do NOT elect multisig signers. The multisig composition is controlled by Ethena Labs. Documentation claims 4/8, but onchain verification shows 5/11.

---

## Metric 1: Onchain Control

### 1.1 Onchain Governance Workflow

**Status:** ⚠️
**Finding:** Governance is offchain Snapshot signaling. No onchain execution.

ENA holders vote via Snapshot at [`ethenagovernance.eth`](https://snapshot.org/#/ethenagovernance.eth). These votes are:
- **Non-binding** - Snapshot votes do not trigger onchain transactions
- **Advisory only** - The Dev Multisig decides whether to execute
- **No timelock** - Multisig can act immediately or ignore votes entirely

**Evidence:**
- Snapshot space: [ethenagovernance.eth](https://snapshot.org/#/ethenagovernance.eth)
- Governance docs: "fully on-chain governance is not a practical or viable option at present"
- Recent votes: Risk Committee elections, fee switch parameters - all executed by multisig

**Recent Snapshot Votes (via GraphQL query):**
1. "Ethena Risk Committee Elections - Fourth Term" (65 votes)
2. "Proposal: Reduction of Risk Committee members from 5 to 3" (66 votes)
3. "Proposal: Ethena lending in Aave" (166 votes)

### 1.2 Role Accountability

**Status:** ⚠️
**Finding:** Risk Committee is elected by ENA holders, but election is non-binding.

- ENA holders vote bi-annually for Risk Committee members via Snapshot
- The Risk Committee advises on fee switch activation and risk parameters
- However, the Committee has no onchain authority - recommendations flow to the multisig
- **No mechanism exists for ENA holders to remove or replace multisig signers**

**Evidence:**
- Snapshot proposals show Risk Committee elections
- Governance docs confirm committee structure
- No onchain governance contract found for signer election

### 1.3 Protocol Upgrade Authority

**Status:** ⚠️
**Finding:** All contracts are non-upgradeable, but owner can modify critical parameters.

The ENA, USDe, sUSDe, and sENA contracts are NOT proxy contracts. They cannot be upgraded. However, the owner (Dev Multisig) can:
- Change minter addresses (USDe)
- Set cooldown durations (sUSDe)
- Grant/revoke roles (all contracts with AccessControl)
- Modify max mint/redeem limits (EthenaMinting)

**Verification:**
```
eth_call implementation() on all contracts → reverted (not proxies)
eth_call owner() on all contracts → 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862
```

### 1.4 Token Upgrade Authority

**Status:** ⚠️
**Finding:** ENA token is not upgradeable, but owner can mint.

The ENA token uses `Ownable2Step`, not a proxy pattern. The token behavior is immutable. However:

**Mint Function (ENA.sol lines 42-49):**
```solidity
function mint(address to, uint256 amount) external onlyOwner {
  if (block.timestamp - lastMintTimestamp < MINT_WAIT_PERIOD) revert MintWaitPeriodInProgress();
  uint256 _maxInflationAmount = totalSupply() * MAX_INFLATION / 100;
  if (amount > _maxInflationAmount) revert MaxInflationExceeded();
  lastMintTimestamp = uint40(block.timestamp);
  _mint(to, amount);
}
```

Constraints:
- Max 10% of total supply per mint
- Minimum 365 days between mints
- Owner (multisig) can invoke without tokenholder approval

**Source:** [ENA.sol on GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol#L42-L49)

### 1.5 Supply Control

**Status:** ⚠️
**Finding:** Rate-limited but discretionary minting.

- **Initial supply:** 15,000,000,000 ENA (verified onchain)
- **Mint constraints:** Max 10%/year, 365-day cooldown
- **Burn:** Anyone can burn their own tokens (ERC20Burnable)
- **Control:** Multisig decides when/if to mint, no tokenholder vote required

### 1.6 Privileged Access Gating

**Status:** ⚠️
**Finding:** Gatekeepers can disable USDe minting/redemption globally.

**GATEKEEPER_ROLE powers (EthenaMinting.sol lines 229-285):**
- `disableMintRedeem()` - Sets max mint/redeem to 0
- `removeMinterRole()` - Revokes minter authorization
- `removeRedeemerRole()` - Revokes redeemer authorization

Gatekeepers are at least 3 individuals/entities (per docs), but **only the Owner can re-enable** functionality. This creates an asymmetric power: gatekeepers can halt, but cannot restart.

**Source:** [EthenaMinting.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol#L229-L285)

### 1.7 Token Censorship

**Status:** ⚠️
**Finding:** ENA has no blacklist; sENA and sUSDe have blacklist capability.

**ENA Token:** No freeze/blacklist functions in contract. Standard ERC20.

**sENA/sUSDe Blacklist (StakedUSDe.sol lines 26-32, 106-127):**
```solidity
bytes32 private constant BLACKLIST_MANAGER_ROLE = keccak256("BLACKLIST_MANAGER_ROLE");
bytes32 private constant SOFT_RESTRICTED_STAKER_ROLE = keccak256("SOFT_RESTRICTED_STAKER_ROLE");
bytes32 private constant FULL_RESTRICTED_STAKER_ROLE = keccak256("FULL_RESTRICTED_STAKER_ROLE");
```

- **SOFT_RESTRICTED:** Cannot stake/unstake
- **FULL_RESTRICTED:** Cannot transfer at all (frozen)
- **redistributeLockedAmount():** Admin can seize and redistribute frozen assets

**Source:** [StakedUSDe.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDe.sol#L26-L32)

---

## Metric 2: Value Accrual

### 2.1 Accrual Active

**Status:** ⚠️
**Finding:** Fee switch approved in parameters; activation status uncertain.

**Current State:**
- Fee switch parameters were set by Risk Committee (November 2024)
- Required conditions met: USDe supply >$6B (currently ~$6.1B verified onchain)
- Implementation requires additional governance vote and Risk Committee sign-off

**sENA Current Benefits:**
1. Ecosystem airdrops (e.g., Ethereal 15% allocation to sENA holders)
2. Potential future protocol revenue share (fee switch)
3. **No programmatic revenue distribution currently active**

**Evidence:**
- USDe total supply: 6,098,394,991 (verified via `eth_call totalSupply()`)
- sENA total supply: 911,543,344 (verified via `eth_call totalSupply()`)
- Fee switch forum post: [ENA Fee Switch Parameters](https://gov.ethenafoundation.com/t/ena-fee-switch-parameters/396)

### 2.2 Treasury Ownership

**Status:** ⚠️
**Finding:** Treasury controlled by elected committee, not directly by tokenholders.

- **Reserve Fund:** Managed by Risk Committee subcommittee
- **Address:** `0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5`
- **Threshold:** 4-of-10 (verified onchain)
- **Control:** Risk Committee is elected by ENA holders, but spending decisions are discretionary

ENA holders cannot directly vote on treasury spending. They elect the committee; the committee decides spending.

### 2.3 Accrual Mechanism Control

**Status:** ⚠️
**Finding:** Fee parameters controlled by multisig, not tokenholders.

Parameters that affect value flow:
- **sUSDe reward rate:** Set by REWARDER_ROLE (StakingRewardsDistributor)
- **Max mint/redeem limits:** Set by DEFAULT_ADMIN_ROLE
- **Fee switch percentage:** TBD by Risk Committee + governance vote

ENA holders can signal preferences but cannot directly modify these parameters.

### 2.4 Offchain Value Accrual

**Status:** TBD
**Finding:** No verified offchain value accrual mechanisms.

Aragon has not been able to verify any offchain value accrual flows directly benefiting ENA tokenholders. The Ethena Foundation is not structured as a tokenholder-controlled entity.

---

## Metric 3: Verifiability

### 3.1 Token Contract Source Verification

**Status:** ✅
**Finding:** ENA token is verified on Etherscan and matches GitHub source.

**Verification:**
- Etherscan: Contract verified ✅
- GitHub: [ENA.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol)
- Solidity version: 0.8.20
- License: GPL-3.0

### 3.2 Protocol Component Source Verification

**Status:** ✅
**Finding:** All core protocol contracts are verified and open source.

| Contract | Verified | Source |
|----------|----------|--------|
| ENA | ✅ | [GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol) |
| USDe | ✅ | [GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/USDe.sol) |
| sUSDe | ✅ | [GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDeV2.sol) |
| EthenaMinting | ✅ | [GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol) |
| StakingRewardsDistributor | ✅ | [GitHub](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakingRewardsDistributor.sol) |

**Audits:**
- Quantstamp (October 2023): [Report](https://596495599-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsBsPyff5ft3inFy9jyjt%2Fuploads%2F17Ucep7IYMBZ6mAHGLyw%2FEthena%20Final%20Report%20(1).pdf)
- Code4rena (October 2023): [Audit Repo](https://github.com/code-423n4/2023-10-ethena)
- Code4rena (November 2024): [Audit Repo](https://github.com/code-423n4/2024-11-ethena-labs)

---

## Metric 4: Token Distribution

### 4.1 Ownership Concentration

**Status:** ⚠️
**Finding:** 70% insider allocation; significant whale concentration.

**Initial Allocation:**
| Category | Percentage | Amount |
|----------|------------|--------|
| Core Contributors | 30% | 4,500,000,000 ENA |
| Ecosystem Development | 28% | 4,200,000,000 ENA |
| Investors | 25% | 3,750,000,000 ENA |
| Foundation | 15% | 2,250,000,000 ENA |
| Binance Launchpool | 2% | 300,000,000 ENA |

**Insider Bloc:** Contributors (30%) + Investors (25%) + Foundation (15%) = **70%**

**Current State (as of 2026-02-24):**
- Total Supply: 15,000,000,000 ENA
- Circulating: ~8,225,000,000 ENA (54.83%)
- Locked: ~6,775,000,000 ENA (45.17%)

**Source:** [Tokenomist.ai](https://tokenomist.ai/ethena)

### 4.2 Future Token Unlocks

**Status:** ⚠️
**Finding:** Material unlocks ongoing through 2028.

**Vesting Schedule:**
- **Cliff:** 1 year with 25% unlock (March 2025 - passed)
- **Linear:** 3-year monthly vesting thereafter
- **Full unlock:** ~April 2028

**Next Unlock:**
- **Date:** March 2, 2026
- **Recipient:** Core Contributors
- **Amount:** 40,625,000 ENA

**Impact:** Ongoing unlocks will continue to increase circulating supply and potentially dilute voting power of existing holders.

---

## Metric 5: Offchain Dependencies

### 5.1 Trademark

**Status:** ⚠️
**Finding:** Trademarks owned by Ethena (BVI) Limited, not tokenholders.

Per Terms of Service: "The Company's name, trademarks and logos and all related names, logos, product and service names, designs and slogans are trademarks of the Company or its affiliates or licensors."

The Company is **Ethena (BVI) Limited** (Registration number 2127704), a British Virgin Islands entity. This entity is not controlled by ENA tokenholders.

### 5.2 Distribution

**Status:** ⚠️
**Finding:** Primary interfaces controlled by Ethena (BVI) Limited.

- **Domain:** ethena.fi (not tokenholder-controlled)
- **Terms of Service contracting party:** Ethena (BVI) Limited
- **Governing law:** British Virgin Islands

ENA holders have no legal claim or control over the primary interface.

### 5.3 Licensing

**Status:** ⚠️
**Finding:** Code is open source (GPL-3.0), but IP owned by company.

The smart contract code is licensed under GPL-3.0, making it open source. However:
- Copyright belongs to Ethena Labs
- "the Company and/or its licensors own all right, title and interest in and to the Services"

ENA holders do not control the IP or licensing.

---

## Conflicts of Interest & Threats to Token Value

### 1. Multisig Discretion Over Governance

The Dev Multisig (5/11) can execute any protocol change without tokenholder approval. While Snapshot votes occur, they are non-binding. This creates:
- **Risk:** Multisig could change fee parameters, mint tokens, or modify contracts against tokenholder preferences
- **Mitigation:** Public accountability, reputation risk

### 2. No Timelock on Admin Actions

Unlike protocols like Aave (which have Timelock execution), Ethena's multisig can act immediately. This creates:
- **Risk:** No time for tokenholders to react to adverse changes
- **Mitigation:** None onchain

### 3. Blacklist Capability in Staking Contracts

FULL_RESTRICTED_STAKER_ROLE can freeze user assets and admin can seize them:
- **Risk:** sENA/sUSDe holders can be censored
- **Mitigation:** ENA base token has no blacklist

### 4. Fee Switch Implementation Uncertainty

Despite meeting parameters, the fee switch requires:
- Risk Committee sign-off
- Governance vote
- Operational/legal review
- **Risk:** Delays or changes to revenue sharing

### 5. Heavy Insider Allocation

70% allocation to insiders (Contributors + Investors + Foundation) means:
- **Risk:** Coordinated insider bloc could dominate governance
- **Mitigation:** Vesting schedule spreads unlocks over 4 years

---

## Summary: What Do ENA Holders Actually Own?

### They DO Own:
1. ✅ A verified, open-source ERC20 token
2. ✅ The ability to stake as sENA for ecosystem airdrops
3. ✅ Advisory voting power via Snapshot
4. ✅ Potential future fee switch revenue (if activated)

### They DO NOT Own:
1. ❌ Binding onchain governance power
2. ❌ Authority over multisig composition
3. ❌ Direct control over fee parameters or treasury
4. ❌ Protection against inflation (multisig can mint 10%/year)
5. ❌ IP, trademarks, or legal entity control

### Conclusion

**ENA is a signaling token with economic upside potential, not an ownership token.**

The token provides:
- Voice (Snapshot voting)
- Potential value (fee switch pending)
- Participation (sENA staking)

But lacks:
- Control (multisig decides)
- Certainty (fee switch not guaranteed)
- Protection (no timelock, blacklist exists in staking)

---

## Appendix: Verification Commands

```bash
# ENA owner
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x57e114B691Db790C35207b2e685D4A43181e6061","data":"0x8da5cb5b"},"latest"],"id":1}'
# Result: 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862

# Dev Multisig threshold
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862","data":"0xe75235b8"},"latest"],"id":1}'
# Result: 5

# ENA total supply
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x57e114B691Db790C35207b2e685D4A43181e6061","data":"0x18160ddd"},"latest"],"id":1}'
# Result: 15,000,000,000 * 10^18

# USDe minter
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4c9edd5852cd905f086c759e8383e09bff1e68b3","data":"0x07546172"},"latest"],"id":1}'
# Result: 0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3 (EthenaMinting V2)
```

---

## Sources

- [ENA Token Etherscan](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061)
- [Ethena GitHub - bbp-public-assets](https://github.com/ethena-labs/bbp-public-assets)
- [Code4rena 2023 Audit](https://github.com/code-423n4/2023-10-ethena)
- [Code4rena 2024 Audit](https://github.com/code-423n4/2024-11-ethena-labs)
- [Ethena Governance Docs](https://docs.ethena.fi/solution-overview/governance)
- [Snapshot: ethenagovernance.eth](https://snapshot.org/#/ethenagovernance.eth)
- [Fee Switch Proposal](https://gov.ethenafoundation.com/t/ena-fee-switch-parameters/396)
- [Tokenomist.ai - ENA](https://tokenomist.ai/ethena)
- [Ethena Terms of Service](https://docs.ethena.fi/resources/terms-of-service)
