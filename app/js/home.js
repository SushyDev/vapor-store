$.get('https://raw.githubusercontent.com/SushyDev/vapor-store/data/home.html', function (data) {
    document.getElementById('cards').innerHTML = data;
    document.getElementById('version').innerHTML = `Ver: ${app.getVersion()}`;
    window.mdc.autoInit();
});

console.log(humid.find('/path/to/steam/library'));
