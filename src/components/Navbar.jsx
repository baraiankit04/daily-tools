import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="dt-navbar">
      <div className="container">

        {/* TOP LOGO */}

        <div className="dt-navbar-top">

          <Link
            to="/"
            className="dt-logo"
          >
            <div className="dt-logo-icon">
              <i className="bi bi-grid-fill"></i>
            </div>

            <span>
              Daily<span>Tools</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}

          <div className="dt-desktop-menu">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/tools"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              All Tools
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              Contact
            </NavLink>

          </div>

          <Link
            to="/tools"
            className="dt-explore-btn"
          >
            <i className="bi bi-grid"></i>
            Explore Tools
          </Link>

        </div>

        {/* MOBILE DIRECT MENU */}

        <div className="dt-mobile-direct-menu">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <i className="bi bi-house"></i>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/tools"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <i className="bi bi-grid"></i>
            <span>Tools</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <i className="bi bi-info-circle"></i>
            <span>About</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <i className="bi bi-envelope"></i>
            <span>Contact</span>
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;