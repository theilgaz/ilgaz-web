import { useState, useMemo } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

interface CleanStat {
  label: string
  count: number
}

function cleanText(input: string): { output: string; stats: CleanStat[] } {
  let text = input
  const stats: CleanStat[] = []

  const count = (pattern: RegExp) => (text.match(pattern) || []).length

  // Em dash → virgül
  const emDashCount = count(/\s*[—]\s*/g)
  if (emDashCount > 0) {
    text = text.replace(/\s*[—]\s*/g, ', ')
    stats.push({ label: 'em dash \u2192 virg\u00fcl', count: emDashCount })
  }

  // En dash → tire
  const enDashCount = count(/[–]/g)
  if (enDashCount > 0) {
    text = text.replace(/[–]/g, '-')
    stats.push({ label: 'en dash \u2192 tire', count: enDashCount })
  }

  // Akilli tirnaklar → duz
  const smartQuoteCount = count(/[\u201C\u201D\u201E]/g) + count(/[\u2018\u2019\u201A]/g)
  if (smartQuoteCount > 0) {
    text = text.replace(/[\u201C\u201D\u201E]/g, '"')
    text = text.replace(/[\u2018\u2019\u201A]/g, "'")
    stats.push({ label: 'ak\u0131ll\u0131 t\u0131rnak d\u00fczeltildi', count: smartQuoteCount })
  }

  // Ellipsis character → three dots
  const ellipsisCount = count(/[\u2026]/g)
  if (ellipsisCount > 0) {
    text = text.replace(/[\u2026]/g, '...')
    stats.push({ label: '\u2026 \u2192 ...', count: ellipsisCount })
  }

  // Non-breaking space → normal space
  const nbspCount = count(/[\u00A0]/g)
  if (nbspCount > 0) {
    text = text.replace(/[\u00A0]/g, ' ')
    stats.push({ label: 'non-breaking space', count: nbspCount })
  }

  // Noktalama oncesi bosluk
  const punctSpaceCount = count(/\s+([,.:;!?])/g)
  if (punctSpaceCount > 0) {
    text = text.replace(/\s+([,.:;!?])/g, '$1')
    stats.push({ label: 'noktalama \u00f6ncesi bo\u015fluk', count: punctSpaceCount })
  }

  // Cift/uclu bosluk → tek
  const multiSpaceCount = count(/[^\S\n]{2,}/g)
  if (multiSpaceCount > 0) {
    text = text.replace(/[^\S\n]{2,}/g, ' ')
    stats.push({ label: 'fazla bo\u015fluk silindi', count: multiSpaceCount })
  }

  // Satir basi/sonu bosluk
  const trimCount = count(/^[ \t]+|[ \t]+$/gm)
  if (trimCount > 0) {
    text = text.replace(/^[ \t]+|[ \t]+$/gm, '')
    stats.push({ label: 'sat\u0131r kenar\u0131 bo\u015fluk', count: trimCount })
  }

  // Ardisik bos satirlar → tek
  const blankLineCount = count(/\n{3,}/g)
  if (blankLineCount > 0) {
    text = text.replace(/\n{3,}/g, '\n\n')
    stats.push({ label: 'fazla bo\u015f sat\u0131r', count: blankLineCount })
  }

  // Double comma cleanup (from em dash near existing commas)
  const doubleCommaCount = count(/,\s*,/g)
  if (doubleCommaCount > 0) {
    text = text.replace(/,\s*,/g, ',')
    stats.push({ label: '\u00e7ift virg\u00fcl temizlendi', count: doubleCommaCount })
  }

  return { output: text.trim(), stats }
}

export function AntiVibePage() {
  useDocumentTitle('antivibe\u00fcr\u00fcs')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<CleanStat[]>([])
  const [copied, setCopied] = useState(false)
  const [cleaned, setCleaned] = useState(false)

  const totalFixes = useMemo(() => stats.reduce((sum, s) => sum + s.count, 0), [stats])

  const handleClean = () => {
    if (!input.trim()) return
    const result = cleanText(input)
    setOutput(result.output)
    setStats(result.stats)
    setCleaned(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      setCleaned(false)
    } catch {
      // Clipboard access denied
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setStats([])
    setCleaned(false)
  }

  return (
    <div className="antivibe-page">
      <h1>Antivibe&uuml;r&uuml;s</h1>
      <p className="lead">
        AI &ccedil;&#305;kt&#305;s&#305;ndaki em dash, ak&#305;ll&#305; t&#305;rnak ve fazla bo&#351;luk vir&uuml;slerini temizle.
      </p>

      <div className="antivibe-content">
        <div className="antivibe-panel">
          <div className="antivibe-panel-header">
            <span>Girdi</span>
            <span className="antivibe-panel-info">{input.length} karakter</span>
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setCleaned(false) }}
            placeholder={"Metni buraya yap\u0131\u015ft\u0131r \u2014 em dash'ler, ak\u0131ll\u0131 t\u0131rnaklar ve fazla bo\u015fluklar temizlenecek..."}
            spellCheck={false}
          />
        </div>

        <div className="antivibe-actions">
          <button onClick={handleClean} className="primary">Temizle</button>
          <button onClick={handlePaste}>Yap&#305;&#351;t&#305;r</button>
          <button onClick={handleClear}>S&#305;f&#305;rla</button>
        </div>

        {cleaned && stats.length > 0 && (
          <div className="antivibe-stats">
            <span className="antivibe-stats-total">{totalFixes} d&uuml;zeltme</span>
            <span className="antivibe-stats-sep">&middot;</span>
            {stats.map((s, i) => (
              <span key={i} className="antivibe-stat-item">
                {s.count} {s.label}
                {i < stats.length - 1 && <span className="antivibe-stats-sep">&middot;</span>}
              </span>
            ))}
          </div>
        )}

        {cleaned && stats.length === 0 && (
          <div className="antivibe-stats antivibe-stats-clean">
            Metin temiz, vir&uuml;s bulunamad&#305;.
          </div>
        )}

        <div className="antivibe-panel">
          <div className="antivibe-panel-header">
            <span>&Ccedil;&#305;kt&#305;</span>
            {output && (
              <button
                className={`formatter-page-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Kopyala"
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={"\u00c7\u0131kt\u0131 burada g\u00f6r\u00fcnecek..."}
            spellCheck={false}
          />
        </div>

        <div className="tool-hint">
          <span>Yap&#305;&#351;t&#305;r</span>
          <span className="separator">&rarr;</span>
          <kbd>Temizle</kbd>
          <span className="separator">&middot;</span>
          <span>em dash, ak&#305;ll&#305; t&#305;rnak, bo&#351;luk, noktalama</span>
        </div>
      </div>
    </div>
  )
}
