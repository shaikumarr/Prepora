import { Link } from 'react-router-dom';

export default function Loader({ text = 'Generating with Gemini…' }) {
  return (
    <div className="loader-overlay" role="status">
      <div className="glass loader-box">
        <div className="spinner" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, text, cta = 'Go to Home', to = '/' }) {
  return (
    <div className="glass empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={to} className="btn btn-primary">{cta}</Link>
    </div>
  );
}