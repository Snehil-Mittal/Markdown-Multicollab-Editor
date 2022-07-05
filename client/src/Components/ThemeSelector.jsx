import React, { useEffect, useRef } from 'react';
import themeData from '../Data/Theme.js';
import tickIcon from '../Icons/tick.svg';

function ThemeSelector({ isVisible, setVisible, activeTheme, setActiveTheme }) {
	const themeSelectorRef = useRef(null);

	const handleThemeButtonClick = (theme) => {
		setActiveTheme(theme);
	};

	useEffect(() => {
		const hideDropDown = (e) => {
			if (
				themeSelectorRef.current &&
				!themeSelectorRef.current.parentElement.contains(e.target) &&
				!themeSelectorRef.current.contains(e.target)
			) {
				setVisible(false);
			}
		};
		document.addEventListener('click', hideDropDown);
		return () => {
			document.removeEventListener('click', hideDropDown);
		};
	}, [isVisible, setVisible]);

	const themeButtons = themeData.map((theme) => {
		return (
			<div
				onClick={() => handleThemeButtonClick(theme)}
				className="toggle-btn"
				style={getBackgroundStyle(theme.primaryColor)}
				key={theme.name}
			>
				{theme.name === activeTheme.name && (
					<img
						className="theme-toggle-img"
						src={tickIcon}
						alt={`theme-${theme.name.toLowerCase}`}
					/>
				)}
			</div>
		);
	});

	return (
		<div
			className="all-theme-wrapper"
			ref={themeSelectorRef}
			style={{ display: isVisible ? 'block' : 'none' }}
		>
			<h3>Change Theme</h3>
			<div className="theme-btn">{themeButtons}</div>
		</div>
	);
}

const getBackgroundStyle = (backgroundColor) => ({
	backgroundColor: backgroundColor,
});

export default ThemeSelector;
