import { useMemo, useState } from 'react';
import { useApp } from '../context/QuestionContext';
import QuestionCard from '../components/QuestionCard';
import SearchBar from '../components/SearchBar';
import { EmptyState } from '../components/Loader';
import { downloadPdf } from '../utils/pdfGenerator';

export default function Results() {
  const { session, isFavorite, toggleFavorite } = useApp();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    if (!session || session.type !== 'questions') return [];
    const q = query.trim().toLowerCase();
    return session.items
      .map((it, i) => ({ ...it, i }))
      .filter((it) => !q || it.question.toLowerCase().includes(q) || it.answer.toLowerCase().includes(q));
  }, [session, query]);

  if (!session || session.type !== 'questions') {
    return <EmptyState title="No questions yet" text="Generate a set of questions to see them here." />;
  }

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">{session.technology} questions</h1>
          <p className="muted">
            {session.experience} · {session.difficulty}{session.company ? ` · ${session.company}` : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => downloadPdf(session)}>Download PDF</button>
      </div>

      <SearchBar value={query} onChange={setQuery} />
      <p className="muted">Showing {visible.length} of {session.items.length}</p>

      <div className="cards">
        {visible.map((it) => {
          const id = `${session.id}-${it.i}`;
          return (
            <QuestionCard
              key={id}
              label={`Q${it.i + 1}.`}
              question={it.question}
              answer={it.answer}
              favorite={isFavorite(id)}
              onFavorite={() => toggleFavorite({ id, technology: session.technology, question: it.question, answer: it.answer })}
            />
          );
        })}
        {!visible.length && <p className="no-match">No questions match “{query}”.</p>}
      </div>
    </div>
  );
}