import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/QuestionContext';

const links = [['/', 'Home'], ['/results', 'Results'], ['/mcq', 'MCQ'], ['/history', 'History'], ['/favorites', 'Favorites'], ['/about', 'About']];

export default function Navbar() {
  const { dark, setDark, favorites } = useApp();
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');
  const label = (l) => (l === 'Favorites' && favorites.length ? `${l} (${favorites.length})` : l);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-text">Prepora</span>
        </Link>
        <nav className="nav-links">
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} end={to === '/'} className={cls}>{label(l)}</NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? '☀️' : '🌙'}</button>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? '✕' : '☰'}</button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav">
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} end={to === '/'} className={cls} onClick={() => setOpen(false)}>{label(l)}</NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}