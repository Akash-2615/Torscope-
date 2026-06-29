import { useState } from 'react'
import { cn } from '@/lib/cn'
import { iconForDestination, type SiteDestination } from '@/lib/destinations'

interface BrandIconProps {
  destination: SiteDestination
  presetId?: string | null
  size?: number
  className?: string
}

/** Dedicated brand icon for a website destination. */
export function BrandIcon({
  destination,
  presetId = null,
  size = 20,
  className,
}: BrandIconProps) {
  const [failed, setFailed] = useState(false)
  const src = iconForDestination(destination, presetId ?? null)

  if (failed) {
    return (
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-md bg-accent-blue/20 font-bold text-accent-blue',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-hidden
      >
        {destination.brand.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 rounded-md object-contain', className)}
      onError={() => setFailed(true)}
    />
  )
}
