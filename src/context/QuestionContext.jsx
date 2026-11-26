import { createContext, useContext, useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storageHelper';

const Ctx = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(Ctx);

export function QuestionProvider({ children }) {
  const [selection, setSelection] = useState({ technology: '', experience: 'Fresher', difficulty: 'Medium', company: '' });
  const [session, setSession] = useState(() => getItem('session', null));
  const [history, setHistory] = useState(() => getItem('history', []));
  const [favorites, setFavorites] = useState(() => getItem('favorites', []));
  const [dark, setDark] = useState(() => getItem('dark', window.matchMedia('(prefers-color-scheme: dark)').matches));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    setItem('dark', dark);
  }, [dark]);
  useEffect(() => setItem('history', history), [history]);
  useEffect(() => setItem('favorites', favorites), [favorites]);
  useEffect(() => setItem('session', session), [session]);

  const updateSelection = (patch) => setSelection((s) => ({ ...s, ...patch }));

  const startSession = (type, items) => {
    const s = { id: Date.now().toString(36), type, date: new Date().toISOString(), ...selection, items };
    setSession(s);
    setHistory((h) => [s, ...h].slice(0, 50));
  };
  const deleteSession = (id) => setHistory((h) => h.filter((x) => x.id !== id));
  const toggleFavorite = (fav) =>
    setFavorites((list) => (list.some((x) => x.id === fav.id) ? list.filter((x) => x.id !== fav.id) : [fav, ...list]));
  const isFavorite = (id) => favorites.some((x) => x.id === id);

  return (
    <Ctx.Provider
      value={{ selection, updateSelection, session, setSession, history, startSession, deleteSession, favorites, toggleFavorite, isFavorite, dark, setDark }}
    >
      {children}
    </Ctx.Provider>
  );
}