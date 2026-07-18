import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../hooks/useTheme.js';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'active' : '')}>
          Transactions
        </NavLink>
        <NavLink to="/budgets" className={({ isActive }) => (isActive ? 'active' : '')}>
          Budgets
        </NavLink>
        <NavLink to="/import" className={({ isActive }) => (isActive ? 'active' : '')}>
          Import CSV
        </NavLink>
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <button onClick={toggleTheme}>{theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}</button>
          <p className="muted" style={{ padding: '0 8px' }}>
            {user?.email}
          </p>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
