import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { siteHref } from '@/lib/destinations'
import { BrandIcon } from './BrandIcon'
import type { SiteDestination } from '@/lib/destinations'

interface SiteLinkProps {
  destination: SiteDestination
  presetId?: string | null
  className?: string
  /** Show the brand favicon beside the URL. */
  showIcon?: boolean
  /** Stop click from bubbling (use inside buttons). */
  stopPropagation?: boolean
  /** Monospace URL only, no icon. */
  compact?: boolean
}

/** Clickable https link with brand icon for a destination website. */
export function SiteLink({
  destination,
  presetId = null,
  className,
  showIcon = true,
  stopPropagation = false,
  compact = false,
}: SiteLinkProps) {
  const href = siteHref(destination.domain)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className={cn(
        'group inline-flex max-w-full items-center gap-1.5 rounded-md text-accent-cyan transition-colors hover:text-accent-cyan/80',
        compact ? 'text-[10px]' : 'text-xs',
        className,
      )}
    >
      {showIcon && (
        <BrandIcon
          destination={destination}
          presetId={presetId}
          size={compact ? 14 : 16}
          className="ring-1 ring-white/10"
        />
      )}
      <span className="truncate font-mono underline decoration-accent-cyan/30 underline-offset-2 group-hover:decoration-accent-cyan/60">
        {href}
      </span>
      <ExternalLink
        className={cn('shrink-0 opacity-60 group-hover:opacity-100', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')}
        aria-hidden
      />
    </a>
  )
}
