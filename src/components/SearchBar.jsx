export default function SearchBar({ value, onChange, placeholder = 'Search questions, e.g. JVM, Hooks, Joins' }) {
  return (
    <input
      className="field"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search questions"
    />
  );
}