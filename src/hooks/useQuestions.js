import { useState } from 'react';
import { useApp } from '../context/QuestionContext';
import { generateQuestions, generateMcqs } from '../services/geminiService';

export default function useQuestions() {
  const { selection, startSession } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // type: 'questions' | 'mcq'. Resolves true when a session was created.
  const run = async (type) => {
    if (!selection.technology) {
      setError('Pick a technology first.');
      return false;
    }
    setLoading(true);
    setError('');
    try {
      const items = type === 'mcq' ? await generateMcqs(selection) : await generateQuestions(selection);
      startSession(type, items);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
}