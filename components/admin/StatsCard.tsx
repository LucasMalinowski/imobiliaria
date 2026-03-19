import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  change?: number
  changeLabel?: string
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'navy'
  className?: string
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    border: 'border-amber-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-100',
  },
  navy: {
    bg: 'bg-primary-50',
    icon: 'text-primary-500',
    border: 'border-primary-100',
  },
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  change,
  changeLabel,
  color = 'navy',
  className,
}: StatsCardProps) {
  const styles = colorStyles[color]

  const changeIcon =
    change === undefined || change === 0 ? (
      <Minus className="w-3.5 h-3.5" />
    ) : change > 0 ? (
      <TrendingUp className="w-3.5 h-3.5" />
    ) : (
      <TrendingDown className="w-3.5 h-3.5" />
    )

  const changeColor =
    change === undefined || change === 0
      ? 'text-gray-500'
      : change > 0
      ? 'text-green-600'
      : 'text-red-600'

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 border shadow-card',
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            styles.bg
          )}
        >
          <span className={styles.icon}>{icon}</span>
        </div>

        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              changeColor
            )}
          >
            {changeIcon}
            <span>
              {change > 0 ? '+' : ''}
              {change}%
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  )
}
