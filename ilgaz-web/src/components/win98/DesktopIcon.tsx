interface DesktopIconProps {
  label: string
  icon: string
  onDoubleClick: () => void
}

export function DesktopIcon({ label, icon, onDoubleClick }: DesktopIconProps) {
  return (
    <button
      className="w98-desktop-icon"
      onDoubleClick={onDoubleClick}
    >
      <div className="w98-desktop-icon-img">{icon}</div>
      <span className="w98-desktop-icon-label">{label}</span>
    </button>
  )
}
