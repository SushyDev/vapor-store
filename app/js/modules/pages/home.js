exports.Initialize = () => {
    fs.readFile(vapor.fn.installedGames(), 'utf-8', (err, data) => {
        if (err) return;
        if (data) document.querySelector('#installed-games h2').textContent = JSON.parse(data).list.length;
    });

    fs.readFile(vapor.config.get().listFile, 'utf-8', (err, data) => {
        if (err) return;
        if (data) document.querySelector('#loaded-games h2').textContent = JSON.parse(data).list.length;
    });

    $(document).ready(() => {
        ipcRenderer.send('loaded', true);
    });
};

exports.showCL = () => {
    $.get('https://raw.githubusercontent.com/SushyDev/vapor-store/data/home.html', (data) => {
        const changelog = data;
    });
};
