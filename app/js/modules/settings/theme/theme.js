exports.switchTheme = () => {
    const darkMode = vapor.config.get().darkMode;
    if (darkMode) {
        vapor.config.setItem({darkMode: false}).then((config) => {
            console.log('switched to light');
            vapor.settings.theme.checkTheme(config.darkMode);
            if (sessionStorage.page == 'Settings') vapor.settings.updateThemeToggle(config.darkMode);
        });
    }
    if (!darkMode) {
        vapor.config.setItem({darkMode: true}).then((config) => {
            console.log('switched to dark');
            vapor.settings.theme.checkTheme(config.darkMode);
            if (sessionStorage.page == 'Settings') vapor.settings.updateThemeToggle(config.darkMode);
        });
    }
};

//Checks the theme from localstorage and updates the theme switch button
exports.checkTheme = (darkMode) => {
    if (darkMode == undefined) darkMode = vapor.config.get().darkMode;
    if (darkMode) document.documentElement.setAttribute('data-theme', 'dark');
    if (!darkMode) document.documentElement.setAttribute('data-theme', 'light');
};
