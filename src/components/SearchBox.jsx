export default function SearchBox({ value, onChange, disabled }) {
  return (
    <div className="search-box">
      <span className="search-box__icon" aria-hidden="true">⌕</span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder="Search compatible dishes"
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search compatible dishes by cafe, name, or ingredient"
      />
    </div>
  );
}
