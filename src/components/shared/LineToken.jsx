export default function LineToken({ line, size = 'normal' }) {
  const sizeClass = size === 'small' ? ' line-token-small' : ''
  return (
    <span
      className={`line-token${sizeClass}`}
      style={{ '--line-color': line.color }}
    >
      {line.name[0]}
    </span>
  )
}
