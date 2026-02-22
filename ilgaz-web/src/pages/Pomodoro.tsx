import { Pomodoro as PomodoroTimer, PomodoroHeatmap } from '../components/Pomodoro'

export function Pomodoro() {
  return (
    <div className="pomodoro-page">
      <h1>Pomodoro</h1>
      <p className="lead">
        25 dakika odaklan, 5 dakika nefes al. Basit ama etkili.
      </p>

      <div className="pomodoro-page-content">
        <PomodoroTimer />
        <PomodoroHeatmap />
      </div>
    </div>
  )
}
