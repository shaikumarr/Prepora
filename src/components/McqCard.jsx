export default function McqCard({ index, mcq, picked, onPick, submitted }) {
  return (
    <article className="glass card">
      <h3 className="card-title">
        <span className="q-label">Q{index}.</span>
        {mcq.question}
      </h3>
      <div className="options-list">
        {mcq.options.map((opt, i) => {
          let state = '';
          if (submitted) {
            if (i === mcq.correctIndex) state = ' correct';
            else if (i === picked) state = ' wrong';
            else state = ' dim';
          } else if (i === picked) state = ' picked';
          return (
            <button key={i} type="button" disabled={submitted} onClick={() => onPick(i)} className={`option${state}`}>
              <b>{'ABCD'[i]}.</b>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <p className="explain">
          <b>Answer: {'ABCD'[mcq.correctIndex]}.</b> {mcq.explanation}
        </p>
      )}
    </article>
  );
}