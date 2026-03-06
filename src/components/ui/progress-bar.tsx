import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number // 0-100 percentage
  segments?: number // default 10
  className?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProgressBar({
  value,
  segments = 10,
  className,
  showPercentage = false,
  size = "md",
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const filledSegments = Math.round((clampedValue / 100) * segments)

  const sizeClasses = {
    sm: "h-1.5 gap-0.5",
    md: "h-2 gap-0.5",
    lg: "h-3 gap-1",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex flex-1", sizeClasses[size])}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-sm transition-colors",
              i < filledSegments
                ? "bg-chart-4"
                : "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>
      {showPercentage && (
        <span className="text-sm text-muted-foreground tabular-nums">
          {clampedValue}%
        </span>
      )}
    </div>
  )
}

// Compact continuous progress bar variant
interface ContinuousProgressBarProps {
  value: number
  className?: string
  showPercentage?: boolean
}

export function ContinuousProgressBar({
  value,
  className,
  showPercentage = false,
}: ContinuousProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 rounded-full bg-muted-foreground/20 overflow-hidden">
        <div
          className="h-full bg-chart-4 rounded-full transition-all duration-300"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm text-muted-foreground tabular-nums min-w-[3ch]">
          {clampedValue}%
        </span>
      )}
    </div>
  )
}
