exports.switchTheme = () => {
    const darkMode = localStorage.getItem('darkMode');

    darkMode == 'true' ? localStorage.setItem('darkMode', 'false') : localStorage.setItem('darkMode', 'true');

    vapor.settings.theme.checkTheme();
    if (sessionStorage.page == 'Settings') vapor.settings.updateThemeToggle();
};

//Checks the theme from localstorage and updates the theme switch button
exports.checkTheme = () => {
    const darkMode = localStorage.getItem('darkMode');

    darkMode == 'true' ? document.documentElement.setAttribute('data-theme', 'dark') : darkMode == 'false' ? document.documentElement.setAttribute('data-theme', 'light') : localStorage.setItem('darkMode', true);
};
