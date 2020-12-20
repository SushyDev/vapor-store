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

    //Remove previous highlight
    try {
        document.querySelector('.mdc-list-item--activated').classList.remove('mdc-list-item--activated');
        document.querySelector('.list-item--activated').classList.remove('list-item--activated');
    } catch (e) {
        /*Can error*/
    }

    //Highlight active page
    var newSelect = $(`.mdc-list > a > span:contains("${page}")`)[0].parentElement;
    newSelect.classList.add('list-item--activated');
    newSelect.classList.add('mdc-list-item--activated');

    sessionStorage.setItem('page', page);

    //Hide progressbar
    try {
        hideProgressBar();
    } catch (e) {}
}
goto();

//Checks the theme from localstorage and updates the theme switch button
function checkTheme() {
    var darkMode = localStorage.getItem('darkMode');
    if (darkMode == 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
        try {
            document.getElementById('theme').childNodes[3].innerHTML = `brightness_high`;
            document.getElementById('theme').childNodes[5].innerHTML = `Light mode`;
        } catch (e) {}
    } else if (darkMode == 'false') {
        document.documentElement.setAttribute('data-theme', 'light');
        try {
            document.getElementById('theme').childNodes[3].innerHTML = `nights_stay`;
            document.getElementById('theme').childNodes[5].innerHTML = `Dark mode`;
        } catch (e) {}
    } else {
        //Fallback for when it doesn't work
        localStorage.setItem('darkMode', true);
    }
}
checkTheme();

//Special characters to ascii
function specialToASCII(str) {
   let res = '';
   for(let i = 0; i < str.length; i++){
      if(+str[i] || str[i].toLowerCase() !== str[i].toUpperCase() || str[i] === ' '){
         res += str[i];
         continue;
      };
      res += str[i].charCodeAt(0);
   };
   return res;
};

//Get chromium path for windows/linux (Development is done on OpenSUSE)
function getChromiumExecPath() {
    if (process.platform != 'linux') {
        return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
    }
    return puppeteer.executablePath();
}

function visit(url) {
    shell.openExternal(url);
}

var progressBar = document.getElementById('MDCTopAppBar-MDCLinearProgress');

function showProgressBar() {
    progressBar.style.display = 'block';
}

function hideProgressBar() {
    progressBar.style.display = 'none';
}
