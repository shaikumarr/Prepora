import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/QuestionContext';
import { EmptyState } from '../components/Loader';

export default function History() {
  const { history, setSession, deleteSession } = useApp();
  const navigate = useNavigate();

  if (!history.length) return <EmptyState title="No history yet" text="Your generated sessions will appear here." />;

  const open = (h) => {
    setSession(h);
    navigate(h.type === 'mcq' ? '/mcq' : '/results');
  };

  return (
    <div className="stack">
      <h1 className="page-title">History</h1>
      {history.map((h) => (
        <article key={h.id} className="glass history-item">
          <div>
            <h2 className="history-title">
              {h.technology} <span className="muted">({h.type === 'mcq' ? 'MCQ quiz' : 'Questions'})</span>
            </h2>
            <p className="muted">
              {new Date(h.date).toLocaleString()} · {h.items.length} {h.type === 'mcq' ? 'MCQs' : 'questions'} · {h.experience} · {h.difficulty}
              {h.company ? ` · ${h.company}` : ''}
            </p>
          </div>
          <div className="row-actions">
            <button className="btn btn-primary btn-sm" onClick={() => open(h)}>Open</button>
            <button className="btn btn-ghost btn-sm" onClick={() => deleteSession(h.id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}