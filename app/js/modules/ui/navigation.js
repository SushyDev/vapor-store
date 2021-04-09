exports.visit = (url) => shell.openExternal(url);

//Jquery function for dynamically loading in content to the main-content div
exports.goto = (page = 'Home') => {
    document.getElementById('top-app-bar-title').innerHTML = page;

    $('#main-content').load('../html/' + page.toLowerCase().replace(/ /g, '_') + '.html');

    if (drawer.open == true) drawer.open = !drawer.open;

    //Remove previous highlight
    try {
        document.querySelector('.mdc-list-item--activated').classList.remove('mdc-list-item--activated');
        document.querySelector('.list-item--activated').classList.remove('list-item--activated');
    } catch (e) {
        /*Can error*/
    }

    //Highlight active page
    const newSelect = $(`.mdc-list > a > span:contains("${page}")`)[0].parentElement;
    newSelect.classList.add('list-item--activated');
    newSelect.classList.add('mdc-list-item--activated');

    sessionStorage.setItem('page', page);

    //Hide progressbar
    vapor.ui.hideProgressBar();
};
