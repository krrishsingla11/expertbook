import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ◈ Expert<span>Book</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Experts
        </NavLink>
        <NavLink to="/my-bookings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          My Bookings
        </NavLink>
      </div>
    </nav>
  );
}
