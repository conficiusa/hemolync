import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  change: number
  changeType: 'up' | 'down' | 'neutral' // 'increase' | 'decrease' | 'neutral'
  changeText: string
  changeColor?: 'success' | 'destructive' | 'primary'
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  changeText,
  changeColor = 'success',
}: StatCardProps) {
  const Icon = icon
  return (
    <div className="bg-white border rounded-lg p-6 flex justify-between items-start">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <p className="text-xl font-bold  mb-2">{value}</p>
        <div className="flex items-center gap-1">
          {changeType === 'up' ? (
            <TrendingUp
              size={16}
              className={cn(
                'text-success',
                changeColor === 'destructive' && 'text-destructive',
                changeColor === 'primary' && 'text-primary',
              )}
            />
          ) : changeType === 'down' ? (
            <TrendingDown size={16} className="text-destructive" />
          ) : (
            <ArrowRight size={16} className="text-amber-600" />
          )}
          <span
            className={cn(
              'text-sm font-medium text-success',
              changeColor === 'destructive' && 'text-destructive',
              changeColor === 'primary' && 'text-primary',
            )}
          >
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">{changeText}</span>
        </div>
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-[#f7e1e7] flex items-center justify-center">
          <Icon size={20} className="text-primary-accent-foreground" />
        </div>
      )}
    </div>
  )
}
