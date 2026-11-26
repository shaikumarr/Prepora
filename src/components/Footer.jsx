export default function Footer() {
  return (
    <footer className="footer">
      <div className="powered">
        <span className="powered-text">Powered by</span>
        <a className="powered-badge" href="https://projects360.in" target="_blank" rel="noopener noreferrer">
          <img className="powered-logo" src="/Logo.png" alt="Projects 360° logo" />
          
        </a>
      </div>
      <p>© {new Date().getFullYear()} AI Interview Generator. Answers are AI-generated, so verify before relying on them.</p>
    </footer>
  );
}