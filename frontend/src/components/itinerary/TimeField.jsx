const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function splitTime(value) {
  if (!value) return { hour: '', minute: '' };
  const [hour = '', minute = ''] = String(value).slice(0, 5).split(':');
  return { hour, minute };
}

export function TimeField({
  id,
  label,
  value,
  onChange,
  disabled,
  optional = true,
}) {
  const { hour, minute } = splitTime(value);

  function updateHour(nextHour) {
    if (!nextHour) {
      onChange('');
      return;
    }
    onChange(`${nextHour}:${minute || '00'}`);
  }

  function updateMinute(nextMinute) {
    if (!hour) return;
    onChange(`${hour}:${nextMinute || '00'}`);
  }

  return (
    <div className="field time-field">
      {label ? <label htmlFor={id ? `${id}-hour` : undefined}>{label}</label> : null}
      <div className="time-field__row">
        <select
          id={id ? `${id}-hour` : undefined}
          className="time-field__select"
          value={hour}
          onChange={(e) => updateHour(e.target.value)}
          disabled={disabled}
          aria-label={label ? `${label} — hora` : 'Hora'}
        >
          {optional ? <option value="">--</option> : null}
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="time-field__sep" aria-hidden="true">
          :
        </span>
        <select
          id={id ? `${id}-minute` : undefined}
          className="time-field__select"
          value={minute}
          onChange={(e) => updateMinute(e.target.value)}
          disabled={disabled || !hour}
          aria-label={label ? `${label} — minuto` : 'Minuto'}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
