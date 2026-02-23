export function FailureLessonPreview() {
  return (
    <div className="failure-preview">
      <div className="failure-preview-visual">
        <div className="failure-preview-tombstones">
          <div className="tombstone" style={{ height: '36px', opacity: 0.3 }}>﷽</div>
          <div className="tombstone" style={{ height: '44px', opacity: 0.5 }}>﷽</div>
          <div className="tombstone tombstone-front" style={{ height: '56px', opacity: 0.7 }}>﷽</div>
          <div className="tombstone" style={{ height: '44px', opacity: 0.5 }}>﷽</div>
          <div className="tombstone" style={{ height: '36px', opacity: 0.3 }}>﷽</div>
        </div>
        <div className="failure-preview-stat">
          <span className="failure-preview-amount">$20B+</span>
          <span className="failure-preview-label">yatırım battı</span>
        </div>
      </div>
      <div className="failure-preview-overlay">
        <span className="failure-preview-icon">💸</span>
        <span className="failure-preview-text">100+ Başarısızlık Dersi</span>
      </div>
    </div>
  )
}
