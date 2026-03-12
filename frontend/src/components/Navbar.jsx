const dashboardViewByRole = {
  USER: "user-dashboard",
  AUTHOR: "author-dashboard",
  ADMIN: "admin-dashboard",
};
function Navbar({
  activeView,
  currentUser,
  isAuthenticated,
  onLogout,
  onNavigate,
}) {
  const links = isAuthenticated
    ? [
        { label: "Home", value: "home" },
        {
          label: "Dashboard",
          value: dashboardViewByRole[currentUser?.role] ?? "home",
        },
      ]
    : [
        { label: "Home", value: "home" },
        { label: "Register", value: "register" },
        { label: "Login", value: "login" },
      ];

  return (
    <header className="nav-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="px-2 text-xl font-bold text-slate-800">Blog Platform</h1>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <button
              key={link.value}
              type="button"
              onClick={() => onNavigate(link.value)}
              className={`nav-button ${activeView === link.value ? "nav-button-active" : ""}`}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <>
              <span className="px-2 text-sm text-slate-600">
                {currentUser?.firstName || currentUser?.email}
              </span>
              <button type="button" onClick={onLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
