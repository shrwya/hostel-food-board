export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="wordmark">Hostel Food Board</span>
        <ul className="header-nav">
          <li><a href="#group">Group</a></li>
          <li><a href="#dishes">Dishes</a></li>
          <li><a href="#results">Results</a></li>
        </ul>
      </div>
    </header>
  );
}
