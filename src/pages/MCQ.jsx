import { useState } from 'react';
import { useApp } from '../context/QuestionContext';
import McqCard from '../components/McqCard';
import { EmptyState } from '../components/Loader';

function Quiz({ session }) {
  const [picked, setPicked] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const items = session.items;
  const correct = items.filter((m, i) => picked[i] === m.correctIndex).length;
  const answered = Object.keys(picked).length;
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">{session.technology} MCQ quiz</h1>
        <p className="muted">{session.experience} · {session.difficulty}</p>
      </div>

      {submitted && (
        <div className="glass score-grid">
          <div><p className="stat-num blue">{correct}/{items.length}</p><p className="muted">Score</p></div>
          <div><p className="stat-num green">{correct}</p><p className="muted">Correct</p></div>
          <div><p className="stat-num red">{items.length - correct}</p><p className="muted">Wrong</p></div>
        </div>
      )}

      <div className="cards">
        {items.map((m, i) => (
          <McqCard
            key={i}
            index={i + 1}
            mcq={m}
            picked={picked[i]}
            submitted={submitted}
            onPick={(opt) => setPicked((p) => ({ ...p, [i]: opt }))}
          />
        ))}
      </div>

      {submitted ? (
        <button className="btn btn-primary btn-block" onClick={() => { setPicked({}); setSubmitted(false); toTop(); }}>
          Retake quiz
        </button>
      ) : (
        <button className="btn btn-primary btn-block" disabled={!answered} onClick={() => { setSubmitted(true); toTop(); }}>
          Submit ({answered}/{items.length} answered)
        </button>
      )}
    </div>
  );
}

export default function MCQ() {
  const { session } = useApp();

  if (!session || session.type !== 'mcq') {
    return <EmptyState title="No quiz yet" text="Generate MCQs from the home page to start a quiz." />;
  }

  return <Quiz key={session.id} session={session} />;
}