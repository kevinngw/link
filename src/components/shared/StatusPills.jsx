export default function StatusPills({ pills }) {
  if (!pills || !pills.length) return null
  return (
    <>
      {pills.map((pill, i) => (
        <span key={i} className={`status-chip ${pill.toneClass ?? ''}`}>
          {pill.text}
        </span>
      ))}
    </>
  )
}
