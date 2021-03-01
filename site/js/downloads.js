import 'regenerator-runtime/runtime';
const httpGet = async (link) => {
    const res = await fetch(link);
    return res.ok ? await res.json() : undefined;
};

httpGet('https://api.github.com/repos/SushyDev/vapor-store/releases').then((data) => {
    if (!data) return;
    data.forEach((release) => {
        buildDownload(release).then((item) => document.getElementById('download-list').appendChild(item));
    });
});

const buildDownload = async (data) => {
    const item = document.createElement('li');
    item.className = 'download-item';

    const icon = document.createElement('img');
    icon.src = 'https://raw.githubusercontent.com/SushyDev/vapor-store/master/assets/icons/png/icon.png';
    icon.className = 'icon';

    const info = document.createElement('div');
    info.className = 'info';

    const title = document.createElement('h2');
    title.textContent = 'Vapor Store';

    const version = document.createElement('p');
    version.textContent = data ? data.tag_name : 'unknown';

    const download = document.createElement('button');
    download.textContent = 'Download';
    download.setAttribute('onclick', `window.open('${data ? data.download : 'example.com'}')`);

    info.appendChild(title);
    info.appendChild(version);

    item.appendChild(icon);
    item.append(info);
    item.appendChild(download);

    return item;
};
