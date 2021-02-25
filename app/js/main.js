//Main is for essential components that make stuff work
//Main window
const mainWindow = BrowserWindow.getAllWindows()[0];

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
window.addEventListener('resize', () => setPageHeight());

//Special characters to ascii
function specialToASCII(str) {
    try {
        let res = '';
        for (let i = 0; i < str.length; i++) {
            if (+str[i] || str[i].toLowerCase() !== str[i].toUpperCase() || str[i] === ' ') {
                res += str[i];
                continue;
            }
            res += str[i].charCodeAt(0);
        }
        return res;
    } catch (e) {
        return str;
    }
}
