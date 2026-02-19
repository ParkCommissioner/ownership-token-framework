# ETHFI Token Research Plan

## Aragon Ownership Token Framework Analysis

**Target:** ETHFI (Ether.fi Governance Token)
**Token Address:** `0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb` (Ethereum Mainnet)
**Date:** 2026-02-13

---

## Executive Summary

This research plan maps the Aragon Ownership Token Framework criteria to specific Ether.fi resources and outlines the investigation approach for each metric. The plan addresses three core questions:

1. **What do I own?** — What does the ETHFI tokenholder have unilateral, unalienable control over?
2. **Why should it have value?** — What gives ETHFI economic value?
3. **What threatens that value?** — What conflicts or risks might undermine token value?

---

## Resource Inventory

### Confirmed Sources (URLs Verified)

#### Smart Contracts (Ethereum Mainnet)

| Contract | Address | Type |
|----------|---------|------|
| ETHFI Token | `0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB` | ERC-20 (Governance) |
| Liquidity Pool | `0x308861A430be4cce5502d0A12724771Fc6DaF216` | Proxy |
| eETH | `0x35fA164735182de50811E8e2E824cFb9B6118ac2` | Rebasing Token |
| weETH | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` | Wrapped Token |
| EtherFiTimelock | `0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761` | Timelock |
| EtherFiAdmin | `0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705` | Admin |
| Treasury | `0x6329004E903B7F420245E7aF3f355186f2432466` | Treasury |
| RoleRegistry | `0x1d3Af47C1607A2EF33033693A9989D1d1013BB50` | Access Control |
| ETHFI Staking | `0x86B5780b606940Eb59A062aA85a07959518c0161` | Staking |
| EtherFiOracle | `0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41` | Oracle |
| Membership Manager | `0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000` | Membership |
| WithdrawRequestNFT | `0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c` | Withdrawals |
| EtherFiRedemptionManager | `0xdadef1ffbfeaab4f68a9fd181395f68b4e4e7ae0` | Redemptions |
| Staking Manager | `0x25e821b7197B146F7713C3b89B6A4D83516B912d` | Staking Mgmt |
| Node Operator Manager | `0xd5edf7730ABAd812247F6F54D7bd31a52554e35E` | Node Ops |
| Foundation Wallet | `0x2f5301a3D59388c509C65f8698f521377D41Fd0F` | Foundation |

#### GitHub Repositories

| Repository | URL | Purpose |
|------------|-----|---------|
| smart-contracts | https://github.com/etherfi-protocol/smart-contracts | Core protocol contracts |
| smart-contracts/audits | https://github.com/etherfi-protocol/smart-contracts/tree/master/audits | Audit reports |
| Certora fork | https://github.com/Certora/etherfi-smart-contracts-fork | Formal verification |

#### Documentation

| Source | URL | Content |
|--------|-----|---------|
| GitBook Docs | https://etherfi.gitbook.io/etherfi | Protocol documentation |
| Governance GitBook | https://etherfi.gitbook.io/gov | Governance documentation |
| ETHFI Allocations | https://etherfi.gitbook.io/gov/ethfi-allocations | Token distribution |
| Buyback Program | https://etherfi.gitbook.io/gov/ethfi-buyback-program | Value accrual mechanism |
| Governance Roadmap | https://etherfi.gitbook.io/gov/governance-roadmap | Decentralization plan |
| Foundation | https://etherfi.gitbook.io/gov/ether.fi-foundation | Legal structure |
| Deployed Contracts | https://etherfi.gitbook.io/etherfi/contracts-and-integrations/deployed-contracts | Contract addresses |
| Technical Documentation | https://etherfi.gitbook.io/etherfi/ether.fi-whitepaper/technical-documentation | Architecture |
| Terms of Use | https://etherfi.gitbook.io/etherfi/ether.fi-legal/terms-of-use | Legal terms |

#### Governance Platforms

| Platform | URL | Purpose |
|----------|-----|---------|
| Agora Voting | https://vote.ether.fi | On-chain governance (in progress) |
| Governance Forum | https://governance.ether.fi | Discussion forum |

#### External Analysis

| Source | URL | Content |
|--------|-----|---------|
| Prisma Risk weETH | https://hackmd.io/@PrismaRisk/weETH | Collateral risk assessment |
| CertiK Skynet | https://skynet.certik.com/projects/etherfi | Security scores |
| DeFiLlama Unlocks | https://defillama.com/unlocks/ether.fi | Vesting schedules |

#### Block Explorers

| Network | Base URL |
|---------|----------|
| Ethereum | https://etherscan.io |
| Arbitrum | https://arbiscan.io |
| Base | https://basescan.org |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants ETHFI holders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Verify the current governance state via vote.ether.fi (Agora)
2. Check if onchain Governor contract is deployed and active
3. Examine voting parameters: quorum (reported as 1M ETHFI), voting period (4 days)
4. Determine if Snapshot (offchain) or onchain voting is binding
5. Trace execution path: Vote → Timelock → Execution

**Sources:**
- Agora voting platform: https://vote.ether.fi/info
- EtherFiTimelock: `0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761`
- Governance roadmap: https://etherfi.gitbook.io/gov/governance-roadmap

**Evidence Sufficiency:**
- ✅ If onchain Governor exists with binding execution through Timelock
- ⚠️ If governance is offchain-only (Snapshot) with multisig execution
- ❌ If no binding mechanism connects token votes to protocol changes

**Anticipated Gaps:**
- Governance appears to be in "Phase 1" transition; full onchain governance may not be deployed
- Need to verify if current governance is Snapshot-based (offchain) or truly onchain

---

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to ETHFI holders?

**Investigation Approach:**
1. Map RoleRegistry (`0x1d3Af47C1607A2EF33033693A9989D1d1013BB50`) roles
2. Identify all admin/owner addresses across core contracts
3. Check if roles are assigned to Timelock (tokenholder-controlled) or multisig (discretionary)
4. Document the Multi-Sig Committee composition (reported as 2/6 multisig)
5. Verify if multisig signers are elected by tokenholders

**Sources:**
- RoleRegistry contract on Etherscan
- EtherFiAdmin: `0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705`
- Protocol admin multisig: `0xF155a2632Ef263a6A382028B3B33feb29175b8A5` (per Prisma)
- Foundation governance docs

**Evidence Sufficiency:**
- ✅ If roles are controlled by Timelock with tokenholder appointment
- ⚠️ If multisig controls critical roles but is theoretically revocable by tokenholders
- ❌ If team/foundation multisig has unilateral control without tokenholder override

**Anticipated Gaps:**
- Prisma Risk identified 2/6 multisig threshold as a centralization concern
- Need to verify current multisig composition and whether timelock has been implemented

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and are upgrades controlled by ETHFI holders?

**Investigation Approach:**
1. Check upgradeability of core contracts (LiquidityPool, eETH, weETH, Staking contracts)
2. Identify proxy pattern used (UUPS vs Transparent Proxy)
3. Trace upgrade admin: Proxy → Admin → Timelock/Multisig
4. Verify timelock delay parameters
5. Check for emergency bypass mechanisms

**Sources:**
- LiquidityPool proxy: `0x308861A430be4cce5502d0A12724771Fc6DaF216`
- GitHub: https://github.com/etherfi-protocol/smart-contracts
- Etherscan proxy verification

**Evidence Sufficiency:**
- ✅ If upgrades require Timelock with tokenholder-controlled proposer
- ⚠️ If upgrades use Timelock but proposer is multisig (not tokenholders)
- ❌ If upgrades can bypass Timelock or are controlled by EOA/unaccountable multisig

**Anticipated Gaps:**
- Prisma noted absence of timelock for immediate upgrades (as of early 2024)
- Need to verify if timelock protection has since been implemented

---

#### 1.4 Token Upgrade Authority

**Question:** Can ETHFI token behavior be modified, and are changes controlled by tokenholders?

**Investigation Approach:**
1. Verify if ETHFI token is upgradeable (check for proxy pattern)
2. On mainnet: appears to be standard ERC-20 without proxy
3. On L2s (Arbitrum/Base): check for EIP-1967 proxy pattern
4. Identify token admin/owner and trace to governance

**Sources:**
- ETHFI Token: `0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB`
- Arbitrum ETHFI: `0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27`
- Base ETHFI: `0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2`

**Evidence Sufficiency:**
- ✅ If token is non-upgradeable OR upgrades require tokenholder governance
- ⚠️ If L2 tokens are upgradeable but controlled through timelock
- ❌ If token can be upgraded by team without tokenholder approval

---

#### 1.5 Supply Control

**Question:** Are ETHFI supply changes programmatic or subject to tokenholder approval?

**Investigation Approach:**
1. Check ETHFI contract for mint() function and access control
2. Verify total supply (reported as fixed 1B, fully minted)
3. Examine token contract bytecode for inflation pathways
4. Check if any address has minter role

**Sources:**
- ETHFI contract source on Etherscan
- Token allocation docs: https://etherfi.gitbook.io/gov/ethfi-allocations

**Evidence Sufficiency:**
- ✅ If no mint() function exists or minting is impossible
- ⚠️ If mint() exists but is controlled by tokenholder governance
- ❌ If arbitrary minting is possible by privileged address

**Expected Finding:** Fixed 1B supply with no mint function (based on documentation)

---

#### 1.6 Privileged Access Gating

**Question:** Can any actor block or restrict protocol actions or exit paths?

**Investigation Approach:**
1. Check for pause() functions in core contracts
2. Identify who can pause LiquidityPool, eETH, weETH, withdrawals
3. Verify withdrawal mechanism for eETH → ETH
4. Check for any whitelisting or access restrictions

**Sources:**
- LiquidityPool contract functions
- WithdrawRequestNFT: `0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c`
- EtherFiRedemptionManager: `0xdadef1ffbfeaab4f68a9fd181395f68b4e4e7ae0`

**Evidence Sufficiency:**
- ✅ If protocol is permissionless with no gating OR gating is tokenholder-controlled
- ⚠️ If pause exists but limited to genuine emergencies with clear accountability
- ❌ If arbitrary access restrictions can be applied by privileged actors

---

#### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, seize, or censor ETHFI balances or transfers?

**Investigation Approach:**
1. Review ETHFI contract for blacklist/freeze functions
2. Check for transfer hooks that could restrict transfers
3. Examine if any admin can block specific addresses

**Sources:**
- ETHFI contract source code
- OpenZeppelin extensions used (ERC20Burnable, ERC20Permit, ERC20Votes)

**Evidence Sufficiency:**
- ✅ If no censorship functions exist in token contract
- ❌ If blacklist/freeze/seize functions exist

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to ETHFI holders currently active?

**Investigation Approach:**
1. Verify ETHFI buyback program is operational
2. Check sETHFI staking contract for active distributions
3. Examine buyback transaction history from Foundation wallet
4. Verify withdrawal fee → buyback flow is functioning

**Sources:**
- Foundation wallet: `0x2f5301a3D59388c509C65f8698f521377D41Fd0F`
- ETHFI Staking: `0x86B5780b606940Eb59A062aA85a07959518c0161`
- Buyback program docs: https://etherfi.gitbook.io/gov/ethfi-buyback-program

**Evidence Sufficiency:**
- ✅ If buybacks are verifiable onchain and distributed to sETHFI holders
- ⚠️ If buybacks occur but distribution is manual/discretionary
- ❌ If no active value flows to tokenholders

**Key Details to Verify:**
- 100% of withdrawal fees → weekly buybacks
- Portion of protocol revenue → monthly buybacks
- Distribution to sETHFI stakers

---

#### 2.2 Treasury Ownership

**Question:** Is the protocol treasury programmatically controlled by ETHFI governance?

**Investigation Approach:**
1. Verify Treasury contract (`0x6329004E903B7F420245E7aF3f355186f2432466`) ownership
2. Trace ownership: Treasury → Timelock/Multisig → Governance?
3. Check if treasury withdrawals require tokenholder approval
4. Document treasury composition and AUM

**Sources:**
- Treasury contract on Etherscan
- Governance proposals for treasury usage
- Foundation wallet for buyback funds

**Evidence Sufficiency:**
- ✅ If treasury is controlled by tokenholder-approved governance
- ⚠️ If treasury is controlled by timelock with multisig proposer
- ❌ If treasury is controlled by team without tokenholder mechanism

---

#### 2.3 Accrual Mechanism Control

**Question:** Can only ETHFI holders modify value capture parameters?

**Investigation Approach:**
1. Identify who controls protocol fee parameters (90/5/5 split)
2. Check if fee changes require governance approval
3. Verify buyback percentage parameters are tokenholder-controlled
4. Examine setters for fee-related variables in core contracts

**Sources:**
- LiquidityPool fee configuration
- Buyback program governance
- Technical documentation

**Evidence Sufficiency:**
- ✅ If fee parameters are tokenholder-controlled via governance
- ⚠️ If parameters are controlled by timelock-protected admin
- ❌ If team can unilaterally change fee structure

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value flows benefiting ETHFI holders?

**Investigation Approach:**
1. Check for any legally binding revenue sharing agreements
2. Examine Foundation structure for tokenholder benefit
3. Review any IP or licensing revenue arrangements

**Sources:**
- Foundation legal documentation
- Terms of Use

**Evidence Sufficiency:**
- TBD unless documented legally binding arrangements exist

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is ETHFI source code publicly available and verified?

**Investigation Approach:**
1. Confirm Etherscan verification status for ETHFI contract
2. Match deployed bytecode to GitHub source
3. Verify OpenZeppelin base contracts used

**Sources:**
- ETHFI on Etherscan: https://etherscan.io/address/0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb
- GitHub repository

**Evidence Sufficiency:**
- ✅ If contract is verified and matches public source

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly verifiable?

**Investigation Approach:**
1. Check verification status of all deployed contracts
2. Cross-reference with GitHub repository
3. Review audit reports for code coverage

**Sources:**
- All contract addresses from deployed contracts list
- GitHub audits folder
- Certora formal verification reports

**Evidence Sufficiency:**
- ✅ If all economically material contracts are verified
- ⚠️ If some contracts are unverified

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor control majority voting power?

**Investigation Approach:**
1. Analyze top ETHFI holders on Etherscan
2. Identify Foundation/Treasury/Team wallets
3. Check delegation patterns for voting power concentration
4. Review vesting contract holders

**Sources:**
- Etherscan token holders page
- DeFiLlama unlocks: https://defillama.com/unlocks/ether.fi
- Tokenomics documentation

**Evidence Sufficiency:**
- ✅ If no single party controls >50% of voting power
- ⚠️ If concentration exists but with vesting/lockup constraints
- ❌ If team/foundation controls majority voting power

**Key Data Points:**
- Investors: 33.74%
- Treasury: 21.62%
- Core Contributors: 21.47%
- User Airdrops: 19.27%
- Partnerships: 3.9%

---

#### 4.2 Future Token Unlocks

**Question:** Will future vesting materially affect concentration?

**Investigation Approach:**
1. Document vesting schedules for all allocations
2. Identify upcoming cliff dates
3. Calculate concentration changes at cliff events

**Sources:**
- ETHFI Allocations: https://etherfi.gitbook.io/gov/ethfi-allocations
- DeFiLlama unlocks data

**Evidence Sufficiency:**
- Document vesting schedules and assess concentration risk

**Key Data Points:**
- Investors: 2-year vest, 1-year cliff
- Core Contributors: 3-year vest, 1-year cliff
- Initial circulating: ~11.52% (115.2M)
- Full distribution: by end of 2030

---

### Offchain Dependencies

#### 5.1 Trademark

**Question:** Are trademarks owned by tokenholder-controlled entity?

**Investigation Approach:**
1. Search USPTO/trademark databases for "ether.fi" and "ETHFI"
2. Identify trademark owner entity
3. Determine relationship to Foundation/DAO

**Sources:**
- USPTO trademark search
- Foundation documentation

**Evidence Sufficiency:**
- ✅ If trademarks owned by tokenholder-controlled legal entity
- ⚠️ If owned by separate entity with documented DAO relationship
- ❌ If owned by unaccountable third party

---

#### 5.2 Distribution

**Question:** Are primary domains and distribution assets tokenholder-controlled?

**Investigation Approach:**
1. Check domain ownership for ether.fi
2. Review Terms of Use contracting party (appears to be Ether.Fi SEZC, Cayman)
3. Assess relationship between operating company and Foundation

**Sources:**
- Terms of Use: https://etherfi.gitbook.io/etherfi/ether.fi-legal/terms-of-use
- WHOIS data
- Foundation documentation

**Evidence Sufficiency:**
- Document operating entity and governance relationship

---

#### 5.3 Licensing

**Question:** Is core protocol IP tokenholder-controlled?

**Investigation Approach:**
1. Review GitHub repository license (MIT)
2. Identify any proprietary components
3. Check for licensing agreements

**Sources:**
- GitHub license file
- Legal documentation

**Evidence Sufficiency:**
- ✅ If MIT/open source with no restrictive licensing
- ⚠️ If mixed licensing model

---

## Investigation Priorities

### High Priority (Critical for Framework)

1. **Governance State**: Confirm if onchain governance is active or still Snapshot-based
2. **Upgrade Authority**: Verify timelock implementation and delay parameters
3. **Multisig Composition**: Document current signers and threshold
4. **Buyback Verification**: Confirm onchain buyback transactions
5. **Supply Immutability**: Verify no mint function in ETHFI contract

### Medium Priority

6. **Role Mapping**: Complete RoleRegistry role documentation
7. **Treasury Control**: Trace treasury ownership chain
8. **Pause Functions**: Document emergency powers
9. **Token Distribution**: Current holder analysis
10. **Vesting Verification**: Confirm unlock schedules

### Lower Priority

11. **Trademark Research**: USPTO search
12. **Domain Ownership**: WHOIS verification
13. **License Review**: Confirm MIT terms

---

## Anticipated Gaps and Concerns

### Known Issues from Prisma Risk Assessment (Feb 2024)

1. **Low Multisig Threshold**: 2/6 signers required (centralization risk)
2. **No Timelock**: Immediate execution capability (may have been addressed)
3. **Oracle Centralization**: Single committee member controls TVL oracle
4. **Client Diversity**: Geth concentration among node operators

### Governance Maturity

- Governance appears to be in Phase 1 (transitional)
- Full onchain governance (Agora) deployment status unclear
- Current binding mechanism may be offchain (Snapshot) + multisig execution

### Value Accrual Verification

- Buyback program announced but onchain execution needs verification
- Distribution to sETHFI stakers needs transaction evidence

### Legal Structure

- Cayman SEZC structure documented
- Relationship between operating company and Foundation/DAO needs clarification
- Trademark ownership unverified

---

## Research Execution Checklist

### Contract Analysis
- [ ] Read ETHFI token contract source
- [ ] Verify all proxy admin addresses
- [ ] Map RoleRegistry roles to addresses
- [ ] Check Timelock delay parameter
- [ ] Verify Treasury ownership chain
- [ ] Document pause/emergency functions

### Governance Verification
- [ ] Confirm Agora Governor deployment status
- [ ] Check recent governance proposals
- [ ] Verify voting parameters (quorum, period)
- [ ] Identify current multisig signers

### Value Accrual
- [ ] Trace buyback transactions from Foundation wallet
- [ ] Verify sETHFI distribution mechanism
- [ ] Confirm withdrawal fee routing

### Distribution Analysis
- [ ] Export top holder data
- [ ] Identify team/foundation wallets
- [ ] Calculate concentration metrics

### Offchain Research
- [ ] USPTO trademark search
- [ ] WHOIS domain lookup
- [ ] Review legal entity structure

---

## Output Format

The final research report will follow the evidence standard established in existing framework entries (AAVE, LDO, CRV, UNI, AERO):

1. **Per-criteria findings** with status (✅/⚠️/❌/TBD)
2. **Evidence bundles** with verified URLs (Etherscan, GitHub, docs)
3. **Ownership chain documentation** (Contract → Admin → Controller)
4. **Clear distinction** between confirmed evidence and speculation

JSON outputs will match exact schema of `tokens.json` and `metrics.json` with traceable evidence links.
