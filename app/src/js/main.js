//Main is for essential components that make stuff work

//Adjust page height for mobile devices running a chromium webbrowser
function setPageHeight() {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.body.style.setProperty('--vh', `${vh}px`);

    var topAppBarHeight = document.getElementById('app-bar').offsetHeight;
    var mainContent = document.getElementById('main-content');
    mainContent.style.height = 'calc(' + document.body.offsetHeight + 'px - ' + topAppBarHeight + 'px)';
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setPageHeight();

//Updates pageheight if user scrolls page
window.addEventListener('resize', () => {
    setPageHeight();
});

//Jquery function for dynamically loading in content to the main-content div
function goto(page = 'Home') {
    document.getElementById('top-app-bar-title').innerHTML = page;

    $('#main-content').load('../html/' + page.toLowerCase().replace(/ /g, '_') + '.html');

    if (drawer.open == true) {
        drawer.open = !drawer.open;
    }
}
goto();

//Checks the theme from localstorage and updates the theme switch button
function checkTheme() {
    if (localStorage.getItem('darkmode') == 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
        try {
            document.getElementById('theme').childNodes[3].innerHTML = `brightness_high`;
            document.getElementById('theme').childNodes[5].innerHTML = `Light mode`;
        } catch (error) {}
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('darkmode', false);
        try {
            document.getElementById('theme').childNodes[3].innerHTML = `nights_stay`;
            document.getElementById('theme').childNodes[5].innerHTML = `Dark mode`;
        } catch (error) {}
    }
}
checkTheme();

function closeDialog(button) {
    var dialog = button.closest('.mdc-dialog--open');
    dialog.classList.remove('mdc-dialog--open');
}

function openDialog(id) {
    var dialog = document.getElementById(id);
    dialog.classList.add('mdc-dialog--open');
}