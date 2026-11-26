import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/QuestionContext';
import useQuestions from '../hooks/useQuestions';
import TechnologyCard from '../components/TechnologyCard';
import Loader from '../components/Loader';

const TECHS = [
  { name: 'Java', icon: '☕' }, { name: 'Spring Boot', icon: '🍃' }, { name: 'React', icon: '⚛️' },
  { name: 'SQL', icon: '🗄️' }, { name: 'Power BI', icon: '📊' }, { name: 'Python', icon: '🐍' }, { name: 'Azure', icon: '☁️' },
];
const EXPERIENCE = ['Fresher', '1 Year', '2 Years', '3 Years', '5 Years', '8+ Years'];
const DIFFICULTY = ['Easy', 'Medium', 'Hard'];
const COMPANIES = ['TCS', 'Infosys', 'Cognizant', 'Accenture', 'Wipro', 'Capgemini', 'Amazon', 'Microsoft', 'Google'];

export default function Home() {
  const { selection, updateSelection } = useApp();
  const { loading, error, run } = useQuestions();
  const navigate = useNavigate();

  const go = async (type) => {
    if (await run(type)) navigate(type === 'mcq' ? '/mcq' : '/results');
  };

  return (
    <div className="stack-lg">
      {loading && <Loader text={`Generating ${selection.technology} questions…`} />}

      <section className="hero">
        <h1>Practice the interview before it happens</h1>
        <p>Pick a technology, set your experience and difficulty, and get fresh interview questions with answers, or take a 10-question MCQ quiz.</p>
      </section>

      <section>
        <h2 className="section-title">1. Choose a technology</h2>
        <div className="tech-grid">
          {TECHS.map((t) => (
            <TechnologyCard key={t.name} {...t} selected={selection.technology === t.name} onSelect={() => updateSelection({ technology: t.name })} />
          ))}
        </div>
      </section>

      <section className="glass options">
        <label className="label">
          Experience
          <select className="field" value={selection.experience} onChange={(e) => updateSelection({ experience: e.target.value })}>
            {EXPERIENCE.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="label">
          Difficulty
          <select className="field" value={selection.difficulty} onChange={(e) => updateSelection({ difficulty: e.target.value })}>
            {DIFFICULTY.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="label">
          Company (optional)
          <select className="field" value={selection.company} onChange={(e) => updateSelection({ company: e.target.value })}>
            <option value="">Any company</option>
            {COMPANIES.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </section>

      {error && <p role="alert" className="error">{error}</p>}

      <div className="actions">
        <button className="btn btn-primary" disabled={loading} onClick={() => go('questions')}>Generate Questions</button>
        <button className="btn btn-accent" disabled={loading} onClick={() => go('mcq')}>Generate MCQs</button>
      </div>
    </div>
  );
}