import { useState } from 'react';

export default function QuestionCard({ label, question, answer, favorite, onFavorite }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="glass card">
      <div className="card-head">
        <h3 className="card-title">
          <span className="q-label">{label}</span>
          {question}
        </h3>
        <button
          className={`fav-btn${favorite ? ' on' : ''}`}
          onClick={onFavorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
      <button className="link-btn" onClick={() => setOpen(!open)}>{open ? 'Hide answer' : 'Show answer'}</button>
      {open && <p className="answer">{answer}</p>}
    </article>
  );
}