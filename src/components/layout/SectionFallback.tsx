export function SectionFallback({ label = 'Loading visualization' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4 text-ink-faint">
        <span className="relative flex h-10 w-10">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-purple/40" />
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple shadow-glow" />
        </span>
        <p className="text-sm">{label}…</p>
      </div>
    </div>
  )
}
