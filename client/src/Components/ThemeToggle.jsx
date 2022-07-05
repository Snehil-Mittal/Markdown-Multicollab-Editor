import React, { useState, useEffect } from 'react';
import ThemeSelector from '../Components/ThemeSelector';
import themeData from '../Data/Theme.js';
import themeIcon from '../Icons/theme_icon.svg';

function ThemeToggle() {
	const [activeTheme, setActiveTheme] = useState(themeData[1], themeData[1]);
	const [dropDownVisible, setDropDownVisible] = useState(false);

	useEffect(() => {
		changeTheme(activeTheme);
	}, [activeTheme]);

	const handleToggleClick = () => {
		setDropDownVisible((currentState) => !currentState);
	};

	return (
		<div className="theme-toggle">
			<div className="theme-icon" onClick={handleToggleClick}>
				<img className="theme-icon-img" src={themeIcon} alt="Theme Icon" />
			</div>
			<ThemeSelector
				isVisible={dropDownVisible}
				setVisible={setDropDownVisible}
				activeTheme={activeTheme}
				setActiveTheme={setActiveTheme}
			/>
		</div>
	);
}

const changeTheme = (theme) => {
	document.body.style.setProperty('--primary-color', theme.primaryColor);
	document.body.style.setProperty('--accent-color', theme.accentColor);
	document.body.style.setProperty(
		'--link-color',
		theme.linkColor ? theme.linkColor : theme.primaryColor
	);
	theme.textColor &&
		document.body.style.setProperty(
			'--nav-section-text-color',
			theme.textColor
		);
};

export default ThemeToggle;
