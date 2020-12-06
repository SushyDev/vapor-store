//Jquery function for dynamically loading in content to the main-content div
$.get('https://sushydev.github.io/vapor-store-data/', function (result) {
    document.getElementById('cards').innerHTML = result;
    window.mdc.autoInit();
});
