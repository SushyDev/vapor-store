$.get('https://sushydev.github.io/vapor-store-data/', function (data) {
    document.getElementById('cards').innerHTML = data;
    window.mdc.autoInit();
});
