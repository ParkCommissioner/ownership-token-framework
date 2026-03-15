"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { AVAILABLE_PROTOCOLS } from "@/components/protocol-analysis"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { PageWrapper } from "@/components/page-wrapper"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Status = "Active" | "Deprecated" | "Proposed"

interface Protocol {
  id: string
  name: string
  ticker: string
  mechanism: string
  status: Status
  logo?: string
  color: string
}

const PROTOCOLS: Record<string, Protocol> = {
  AAVE: {
    id: "AAVE",
    name: "Aave",
    ticker: "AAVE",
    mechanism: "Protocol fees fund stkAAVE Safety Module staking yield, transitioning to Umbrella",
    status: "Active",
    logo: "https://assets.coingecko.com/coins/images/12645/standard/aave-token-round.png",
    color: "bg-[#B6509E]",
  },
  SKY: {
    id: "SKY",
    name: "Sky",
    ticker: "SKY",
    mechanism: "Smart Burn Engine buys SKY from market, distributes via staking/farming",
    status: "Active",
    logo: "https://coin-images.coingecko.com/coins/images/39925/large/sky.jpg",
    color: "bg-[#6D41D4]",
  },
  CRV: {
    id: "CRV",
    name: "Curve",
    ticker: "CRV",
    mechanism: "veCRV holders lock 1\u20134 yrs, receive 50% of all trading fees as crvUSD",
    status: "Active",
    logo: "https://assets.coingecko.com/coins/images/12124/standard/Curve.png",
    color: "bg-[#FF6B6B]",
  },
  PENDLE: {
    id: "PENDLE",
    name: "Pendle",
    ticker: "PENDLE",
    mechanism: "vePENDLE (up to 2 yr lock, 80% revenue) replaced with sPENDLE liquid staking",
    status: "Deprecated",
    logo: "https://assets.coingecko.com/coins/images/15069/standard/Pendle_Logo_Normal-03.png",
    color: "bg-[#1C7ED6]",
  },
  AERO: {
    id: "AERO",
    name: "Aerodrome",
    ticker: "AERO",
    mechanism:
      "veAERO holders receive 100% of voted pool trading fees, Solidly-fork model",
    status: "Active",
    logo: "https://coin-images.coingecko.com/coins/images/31745/large/token.png",
    color: "bg-[#0052FF]",
  },
  GMX: {
    id: "GMX",
    name: "GMX",
    ticker: "GMX",
    mechanism:
      "esGMX stakers earn ETH/AVAX revenue share with 1 yr vesting schedule",
    status: "Active",
    logo: "https://assets.coingecko.com/coins/images/18323/standard/arbit.png",
    color: "bg-[#2D42FC]",
  },
  ETHFI: {
    id: "ETHFI",
    name: "Ether.fi",
    ticker: "ETHFI",
    mechanism:
      "sETHFI staking with revenue-backed yield and lock multipliers",
    status: "Active",
    logo: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg",
    color: "bg-[#7C3AED]",
  },
  "1INCH": {
    id: "1INCH",
    name: "1inch",
    ticker: "1INCH",
    mechanism:
      "st1INCH staking grants Unicorn Power for governance and resolver incentives",
    status: "Active",
    logo: "https://coin-images.coingecko.com/coins/images/13469/large/1inch-logo.jpeg",
    color: "bg-[#1B314F]",
  },
  UNI: {
    id: "UNI",
    name: "Uniswap",
    ticker: "UNI",
    mechanism:
      "V2/V3 fees flow to TokenJar; burn 4,000 UNI via FirePit to claim. V4 fee switch pending",
    status: "Proposed",
    logo: "https://assets.coingecko.com/coins/images/12504/standard/uniswap-logo.png",
    color: "bg-[#FF007A]",
  },
  HYPE: {
    id: "HYPE",
    name: "Hyperliquid",
    ticker: "HYPE",
    mechanism:
      "Buybacks fund assistance fund and burns; no staking required to benefit",
    status: "Active",
    logo: "https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg",
    color: "bg-[#40E8A3]",
  },
  COW: {
    id: "COW",
    name: "CoW Protocol",
    ticker: "COW",
    mechanism:
      "CIP-38 buyback-and-burn, net \u22123.36M COW emissions, accrues to DAO treasury",
    status: "Active",
    logo: "https://coin-images.coingecko.com/coins/images/24384/large/CoW-token_logo.png",
    color: "bg-[#012F6A]",
  },
}

const ALL_PROTOCOL_IDS = Object.keys(PROTOCOLS)

// ---------------------------------------------------------------------------
// Tree structure
// ---------------------------------------------------------------------------

interface TreeNode {
  id: string
  question: string
  options: BranchOption[]
}

interface BranchOption {
  label: string
  protocols: string[]
  next: string | null
}

const TREE: Record<string, TreeNode> = {
  level1: {
    id: "level1",
    question: "Does the protocol share value with token holders?",
    options: [
      { label: "Yes", protocols: ALL_PROTOCOL_IDS, next: "level2" },
      { label: "No", protocols: [], next: null },
    ],
  },
  level2: {
    id: "level2",
    question: "Is it directed via buybacks or distributed directly?",
    options: [
      {
        label: "Buyback",
        protocols: ["COW", "UNI", "SKY", "AAVE", "GMX", "HYPE"],
        next: "level3a",
      },
      {
        label: "Direct",
        protocols: ["CRV", "AERO", "PENDLE", "ETHFI", "1INCH"],
        next: "level3b",
      },
    ],
  },
  level3a: {
    id: "level3a",
    question: "What happens after buyback?",
    options: [
      { label: "Burn", protocols: ["COW", "UNI"], next: null },
      {
        label: "Distribute",
        protocols: ["SKY", "AAVE", "GMX", "HYPE"],
        next: "level4",
      },
    ],
  },
  level3b: {
    id: "level3b",
    question: "Is there a staking/lock requirement?",
    options: [
      {
        label: "Yes, with lock (ve model)",
        protocols: ["CRV", "AERO", "PENDLE"],
        next: null,
      },
      {
        label: "Yes, simple staking",
        protocols: ["ETHFI", "1INCH"],
        next: null,
      },
    ],
  },
  level4: {
    id: "level4",
    question: "Is there a staking requirement?",
    options: [
      { label: "Yes", protocols: ["SKY", "AAVE", "GMX"], next: null },
      { label: "No", protocols: ["HYPE"], next: null },
    ],
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CLASSES: Record<Status, string> = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Deprecated: "bg-red-100 text-red-800 border-red-200",
  Proposed: "bg-amber-100 text-amber-800 border-amber-200",
}

function ProtocolLogo({
  id,
  dimmed = false,
  size = "default",
  style,
  className,
}: {
  id: string
  dimmed?: boolean
  size?: "default" | "sm" | "xs"
  style?: React.CSSProperties
  className?: string
}) {
  const p = PROTOCOLS[id]
  if (!p) return null

  const sizeMap = { xs: "size-6", sm: "size-7", default: "size-9" }
  const textMap = { xs: "text-[8px]", sm: "text-[10px]", default: "text-xs" }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-500",
        dimmed ? "opacity-20 scale-75" : "opacity-100 scale-100",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-border",
          sizeMap[size]
        )}
        title={p.name}
      >
        {p.logo ? (
          <img
            alt={p.ticker}
            className="size-full object-cover"
            loading="lazy"
            src={p.logo}
          />
        ) : (
          <div
            className={cn(
              "size-full flex items-center justify-center text-white font-semibold",
              textMap[size],
              p.color
            )}
          >
            {p.ticker.slice(0, 2)}
          </div>
        )}
      </div>
      {size === "default" && (
        <span className="text-[10px] text-muted-foreground font-medium leading-none">
          {p.ticker}
        </span>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none",
        STATUS_CLASSES[status]
      )}
    >
      {status}
    </span>
  )
}

function ConnectorLine({ visible }: { visible: boolean }) {
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          "w-px bg-border transition-all duration-700 ease-out",
          visible ? "h-12 opacity-100" : "h-0 opacity-0"
        )}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Animated protocol row — tokens enter with stagger
// ---------------------------------------------------------------------------

function ProtocolRow({
  ids,
  size = "sm",
}: {
  ids: string[]
  size?: "default" | "sm" | "xs"
}) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {ids.map((id, i) => (
        <div
          className="animate-in fade-in zoom-in-75 fill-mode-both"
          key={id}
          style={{ animationDelay: `${i * 60}ms`, animationDuration: "400ms" }}
        >
          <ProtocolLogo id={id} size={size} />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Terminal detail panel
// ---------------------------------------------------------------------------

// Map protocol IDs to route slugs for analysis pages
const PROTOCOL_SLUGS: Record<string, string> = {
  AAVE: "aave",
  AERO: "aerodrome",
  CRV: "crv",
  PENDLE: "pendle",
  GMX: "gmx",
  ETHFI: "ethfi",
  "1INCH": "1inch",
  SKY: "sky",
  UNI: "uni",
  HYPE: "hype",
  COW: "cow",
}

function TerminalPanel({ protocolIds }: { protocolIds: string[] }) {
  const protocols = protocolIds.map((id) => PROTOCOLS[id]).filter(Boolean)

  return (
    <div className="grid gap-3">
      {protocols.map((p, i) => {
        const slug = PROTOCOL_SLUGS[p.id]
        const hasAnalysis = slug && AVAILABLE_PROTOCOLS.has(slug)

        const cardContent = (
          <div className="flex items-start gap-3">
            <div className="relative">
              <ProtocolLogo id={p.id} size="sm" />
              {hasAnalysis && (
                <div className="absolute -inset-0.5 rounded-full ring-2 ring-amber-400/60" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{p.name}</span>
                <span className="text-muted-foreground text-xs">
                  {p.ticker}
                </span>
                <StatusPill status={p.status} />
                {hasAnalysis && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                    Analysis
                    <ArrowRightIcon className="size-2.5" />
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                {p.mechanism}
              </p>
              {slug && !hasAnalysis && (
                <p className="text-muted-foreground/50 text-[10px] mt-1 italic">
                  No data yet \u2014 try{" "}
                  <Link
                    className="text-primary/60 hover:underline"
                    params={{ protocolId: "aave" }}
                    to="/value-accrual/$protocolId"
                  >
                    AAVE
                  </Link>
                  {" / "}
                  <Link
                    className="text-primary/60 hover:underline"
                    params={{ protocolId: "aerodrome" }}
                    to="/value-accrual/$protocolId"
                  >
                    Aerodrome
                  </Link>
                </p>
              )}
            </div>
          </div>
        )

        if (hasAnalysis && slug) {
          return (
            <Link
              className="block rounded-lg border bg-card p-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:bg-muted/30 transition-colors"
              key={p.id}
              params={{ protocolId: slug }}
              style={{
                animationDelay: `${i * 80}ms`,
                animationDuration: "400ms",
              }}
              to="/value-accrual/$protocolId"
            >
              {cardContent}
            </Link>
          )
        }

        return (
          <div
            className="rounded-lg border bg-card p-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
            key={p.id}
            style={{
              animationDelay: `${i * 80}ms`,
              animationDuration: "400ms",
            }}
          >
            {cardContent}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Full overview (pannable + zoomable)
// ---------------------------------------------------------------------------

function OverviewNode({
  nodeId,
  depth = 0,
}: {
  nodeId: string
  depth?: number
}) {
  const node = TREE[nodeId]
  if (!node) return null

  const optionCount = node.options.length

  return (
    <div className="flex flex-col items-center">
      {depth > 0 && <div className="w-px h-6 bg-border shrink-0" />}
      <div className="rounded-lg border bg-card px-5 py-3 text-center w-[260px] shrink-0">
        <p className="text-xs font-medium text-foreground leading-snug">
          {node.question}
        </p>
      </div>

      {/* Vertical stem down from question */}
      <div className="w-px h-5 bg-border shrink-0" />

      {/* Horizontal bar spanning all branches */}
      {optionCount > 1 && (
        <div className="relative shrink-0" style={{ width: `${optionCount * 200 + (optionCount - 1) * 24}px` }}>
          <div className="absolute top-0 left-[calc(50%/(var(--count)))] right-[calc(50%/(var(--count)))] h-px bg-border"
            style={{
              left: `${100 / (2 * optionCount)}%`,
              right: `${100 / (2 * optionCount)}%`,
            }}
          />
        </div>
      )}

      {/* Branch children */}
      <div className="flex shrink-0" style={{ gap: "24px" }}>
        {node.options.map((option, idx) => (
          <div className="flex flex-col items-center w-[200px]" key={idx}>
            {/* Vertical drop from horizontal bar to option */}
            <div className="w-px h-5 bg-border shrink-0" />
            <div className="rounded-md border border-dashed bg-muted/50 px-4 py-2 text-center w-full shrink-0">
              <p className="text-[11px] font-medium text-foreground">
                {option.label}
              </p>
              {option.protocols.length > 0 && (
                <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                  {option.protocols.map((id) => (
                    <ProtocolLogo id={id} key={id} size="xs" />
                  ))}
                </div>
              )}
              {option.protocols.length === 0 && (
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  No protocols
                </p>
              )}
            </div>
            {option.next && (
              <OverviewNode depth={depth + 1} nodeId={option.next} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PannableOverview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.85)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(null)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        setZoom((z) => Math.min(2, Math.max(0.3, z + delta)))
      } else {
        setPan((p) => ({
          x: p.x - e.deltaX,
          y: p.y - e.deltaY,
        }))
      }
    },
    []
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      }
    },
    [pan]
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    setPan({
      x: dragRef.current.startPanX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.startPanY + (e.clientY - dragRef.current.startY),
    })
  }, [])

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const resetView = useCallback(() => {
    setZoom(0.85)
    setPan({ x: 0, y: 0 })
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-end">
        <Button
          onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
          size="icon-xs"
          variant="outline"
        >
          +
        </Button>
        <Button
          onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}
          size="icon-xs"
          variant="outline"
        >
          −
        </Button>
        <Button onClick={resetView} size="xs" variant="outline">
          Reset
        </Button>
        <span className="text-xs text-muted-foreground ml-1">
          {Math.round(zoom * 100)}%
        </span>
      </div>
      <div
        className="relative w-full h-[70vh] rounded-xl border bg-muted/30 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        ref={containerRef}
      >
        <div
          className="absolute inset-0 flex items-start justify-center pt-8"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top center",
            willChange: "transform",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              {ALL_PROTOCOL_IDS.map((id) => (
                <ProtocolLogo id={id} key={id} size="sm" />
              ))}
            </div>
            <OverviewNode nodeId="level1" />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Drag to pan. Scroll to pan vertically. Ctrl+scroll or pinch to zoom.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface PathStep {
  nodeId: string
  chosenIndex: number
}

export function ValueAccrualFlowchart() {
  const [path, setPath] = useState<PathStep[]>([])
  const [showOverview, setShowOverview] = useState(false)
  const levelRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const activeProtocols = (() => {
    if (path.length === 0) return ALL_PROTOCOL_IDS
    const last = path[path.length - 1]
    const node = TREE[last.nodeId]
    return node?.options[last.chosenIndex]?.protocols ?? []
  })()

  const visibleNodeIds = (() => {
    const ids: string[] = ["level1"]
    for (const step of path) {
      const node = TREE[step.nodeId]
      const option = node?.options[step.chosenIndex]
      if (option?.next) ids.push(option.next)
    }
    return ids
  })()

  const isTerminal = (() => {
    if (path.length === 0) return false
    const last = path[path.length - 1]
    const node = TREE[last.nodeId]
    return node?.options[last.chosenIndex]?.next === null
  })()

  const scrollToNode = useCallback((nodeId: string) => {
    // Double-rAF to ensure the DOM has rendered new content
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = levelRefs.current.get(nodeId)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      })
    })
  }, [])

  const handleBranch = useCallback(
    (nodeId: string, optionIndex: number) => {
      const node = TREE[nodeId]
      const option = node?.options[optionIndex]
      if (!node || !option) return

      const existingIdx = path.findIndex((s) => s.nodeId === nodeId)
      const newPath =
        existingIdx >= 0
          ? [
              ...path.slice(0, existingIdx),
              { nodeId, chosenIndex: optionIndex },
            ]
          : [...path, { nodeId, chosenIndex: optionIndex }]

      setPath(newPath)

      // Scroll to the next card, or to this card if terminal
      const scrollTarget = option.next ?? nodeId
      scrollToNode(scrollTarget)
    },
    [path, scrollToNode]
  )

  const handleStartOver = useCallback(() => {
    setPath([])
    scrollToNode("level1")
  }, [scrollToNode])

  const handleBreadcrumbClick = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0) {
        handleStartOver()
      } else {
        const truncated = path.slice(0, stepIndex + 1)
        setPath(truncated)
        const last = truncated[truncated.length - 1]
        const option = TREE[last.nodeId]?.options[last.chosenIndex]
        if (option?.next) scrollToNode(option.next)
      }
    },
    [path, handleStartOver, scrollToNode]
  )

  const getProtocolsEnteringNode = useCallback(
    (nodeId: string): string[] => {
      if (nodeId === "level1") return ALL_PROTOCOL_IDS
      const step = path.find((s) => {
        const n = TREE[s.nodeId]
        return n?.options[s.chosenIndex]?.next === nodeId
      })
      if (step) {
        return TREE[step.nodeId]?.options[step.chosenIndex]?.protocols ?? []
      }
      return ALL_PROTOCOL_IDS
    },
    [path]
  )

  const breadcrumbs = path.map((step) => {
    const node = TREE[step.nodeId]
    const option = node?.options[step.chosenIndex]
    return { chosenLabel: option?.label ?? "" }
  })

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-background">
        <Container className="py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold leading-10 tracking-tight text-accent-foreground md:text-4xl">
              Value Accrual Mechanisms
            </h1>
            <div className="max-w-[800px] text-lg leading-7 text-accent-foreground">
              <p>
                Compare how DeFi protocols distribute value to token holders.
                Navigate the decision tree to explore buybacks, burns, staking
                models, and ve-locks across the comparative set.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive flowchart */}
      <section className="bg-background pb-16">
        <Container>
          {/* Breadcrumb + controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              {path.length > 0 ? (
                <>
                  <button
                    className="text-primary hover:underline font-medium cursor-pointer"
                    onClick={() => handleBreadcrumbClick(-1)}
                    type="button"
                  >
                    Start
                  </button>
                  {breadcrumbs.map((bc, i) => (
                    <span className="flex items-center gap-1.5" key={i}>
                      <span className="text-muted-foreground">/</span>
                      <button
                        className={cn(
                          "font-medium cursor-pointer",
                          i < breadcrumbs.length - 1
                            ? "text-primary hover:underline"
                            : "text-foreground"
                        )}
                        onClick={() => handleBreadcrumbClick(i)}
                        type="button"
                      >
                        {bc.chosenLabel}
                      </button>
                    </span>
                  ))}
                  <span className="ml-2">
                    <Button onClick={handleStartOver} size="xs" variant="ghost">
                      Start over
                    </Button>
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Select a branch to begin
                </span>
              )}
            </div>
            <Button
              onClick={() => setShowOverview((v) => !v)}
              size="sm"
              variant="outline"
            >
              {showOverview ? "Interactive view" : "Full overview"}
            </Button>
          </div>

          {showOverview ? (
            /* ---- Full pannable/zoomable overview ---- */
            <div className="animate-in fade-in duration-300">
              <PannableOverview />
            </div>
          ) : (
            /* ---- Interactive step-by-step ---- */
            <>
              {/* Top protocol badge bar */}
              <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
                {ALL_PROTOCOL_IDS.map((id) => (
                  <ProtocolLogo
                    dimmed={path.length > 0 && !activeProtocols.includes(id)}
                    id={id}
                    key={id}
                  />
                ))}
              </div>

              {/* Flowchart cards */}
              <div className="flex flex-col items-center max-w-2xl mx-auto">
                {visibleNodeIds.map((nodeId, idx) => {
                  const node = TREE[nodeId]
                  if (!node) return null

                  const stepForThis = path.find((s) => s.nodeId === nodeId)
                  const isChosen = stepForThis !== undefined
                  const activeHere = getProtocolsEnteringNode(nodeId)

                  return (
                    <div
                      className={cn(
                        "w-full",
                        idx > 0 &&
                          "animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both"
                      )}
                      key={nodeId}
                    >
                      {/* Connector */}
                      {idx > 0 && <ConnectorLine visible />}

                      {/* Protocol badges arriving at this level */}
                      {idx > 0 && activeHere.length > 0 && (
                        <div className="mb-3 mt-2">
                          <ProtocolRow ids={activeHere} />
                        </div>
                      )}

                      {/* Decision card */}
                      <div
                        ref={(el) => {
                          if (el) levelRefs.current.set(nodeId, el)
                        }}
                      >
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle className="text-center text-base md:text-lg">
                              {node.question}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap justify-center gap-2">
                              {node.options.map((option, optIdx) => {
                                const isSelected =
                                  isChosen &&
                                  stepForThis.chosenIndex === optIdx
                                const isOther = isChosen && !isSelected

                                return (
                                  <Button
                                    className={cn(
                                      "min-w-[120px] transition-all duration-300",
                                      isSelected &&
                                        "ring-2 ring-primary ring-offset-2",
                                      isOther && "opacity-40"
                                    )}
                                    key={optIdx}
                                    onClick={() =>
                                      handleBranch(nodeId, optIdx)
                                    }
                                    size="lg"
                                    variant={
                                      isSelected ? "default" : "outline"
                                    }
                                  >
                                    {option.label}
                                    {option.protocols.length > 0 && (
                                      <span className="ml-1.5 text-xs opacity-70">
                                        ({option.protocols.length})
                                      </span>
                                    )}
                                  </Button>
                                )
                              })}
                            </div>

                            {/* Terminal detail */}
                            {isChosen &&
                              isTerminal &&
                              stepForThis.nodeId === nodeId &&
                              (() => {
                                const option =
                                  node.options[stepForThis.chosenIndex]
                                if (option?.next !== null) return null
                                return (
                                  <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <TerminalPanel
                                      protocolIds={option.protocols}
                                    />
                                  </div>
                                )
                              })()}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Container>
      </section>
    </PageWrapper>
  )
}
