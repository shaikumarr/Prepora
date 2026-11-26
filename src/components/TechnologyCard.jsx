export default function TechnologyCard({ name, icon, selected, onSelect }) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={`glass tech-card${selected ? ' selected' : ''}`}>
      <span className="tech-icon">{icon}</span>
      <span className="tech-name">{name}</span>
    </button>
  );
}