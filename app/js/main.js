// ? Get App window
const browserWindows = BrowserWindow.getAllWindows();
const browserWindow = browserWindows.find((window) => !window.title.includes('loading'));

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
