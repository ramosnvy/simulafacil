import { useId } from 'react'

export default function NumberField({ label, value, onChange, hint, prefix, ...props }) {
  const id = useId()

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {prefix ? ` (${prefix})` : ''}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {hint && <small>{hint}</small>}
    </div>
  )
}
