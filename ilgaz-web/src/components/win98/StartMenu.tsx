interface StartMenuItem {
  label: string
  icon?: string
  onClick: () => void
  divider?: boolean
}

interface StartMenuProps {
  items: StartMenuItem[]
  onClose: () => void
}

export function StartMenu({ items, onClose }: StartMenuProps) {
  return (
    <>
      <div className="w98-start-overlay" onClick={onClose} />
      <div className="w98-start-menu">
        <div className="w98-start-sidebar">
          <span className="w98-start-sidebar-text">ilg.az</span>
        </div>
        <div className="w98-start-items">
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="w98-start-divider" />}
              <button
                className="w98-start-item"
                onClick={() => {
                  item.onClick()
                  onClose()
                }}
              >
                <span className="w98-start-item-icon">{item.icon || '📄'}</span>
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
