import { useState, useCallback, useEffect } from 'react'

const failedStartups = [
  { name: "Vine", raised: "$25M", reason: "Twitter satın aldı ama monetize edemedi" },
  { name: "Quibi", raised: "$1.75B", reason: "TikTok ve YouTube zaten vardı" },
  { name: "Theranos", raised: "$700M", reason: "Teknoloji hiç çalışmadı" },
  { name: "Juicero", raised: "$120M", reason: "Poşetler elle sıkılabiliyordu" },
  { name: "MoviePass", raised: "$68M", reason: "Her bilet için para kaybediyorlardı" },
]

export function FailureLessonPreview() {
  const [startup, setStartup] = useState(failedStartups[0])

  const generate = useCallback(() => {
    const random = failedStartups[Math.floor(Math.random() * failedStartups.length)]
    setStartup(random)
  }, [])

  useEffect(() => { generate() }, [generate])

  return (
    <div className="failure-lesson">
      <div className="failure-header">
        <span className="failure-name">{startup.name}</span>
        <span className="failure-raised">{startup.raised}</span>
      </div>
      <div className="failure-reason">
        <span className="failure-label">Neden battı?</span>
        <p>{startup.reason}</p>
      </div>
      <button onClick={generate}>→</button>
    </div>
  )
}
