import { useApp } from '../context/QuestionContext';
import QuestionCard from '../components/QuestionCard';
import { EmptyState } from '../components/Loader';

export default function Favorites() {
  const { favorites, toggleFavorite } = useApp();

  if (!favorites.length) {
    return <EmptyState title="No favorites yet" text="Tap the heart on any question to save it here." cta="Browse questions" to="/results" />;
  }

  return (
    <div className="stack">
      <h1 className="page-title">Favorites ({favorites.length})</h1>
      <div className="cards">
        {favorites.map((f) => (
          <QuestionCard key={f.id} label={`${f.technology}:`} question={f.question} answer={f.answer} favorite onFavorite={() => toggleFavorite(f)} />
        ))}
      </div>
    </div>
  );
}