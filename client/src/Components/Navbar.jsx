import React from 'react';
import ThemeToggle from './ThemeToggle';

function NavBar() {
	return (
		<nav className="navbar">
			<h3 className="title">&nbsp;GEPmarkDown</h3>
			<div className="nav-right">
				<ThemeToggle />
			</div>
		</nav>
	);
}
export default NavBar;
