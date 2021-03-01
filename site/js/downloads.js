import 'regenerator-runtime/runtime';
const httpGet = async (link) => {
    const res = await fetch(link);
    return res.ok ? await res.json() : undefined;
};

httpGet('https://api.github.com/repos/SushyDev/vapor-store/releases').then((data) => {
    if (!data) return;
    console.log(data);
    data.forEach((release) => {
        buildDownload(release).then((item) => document.getElementById('download-list').appendChild(item));
    });
});

const getDownload = (release) => release.assets.find((asset) => asset.browser_download_url.includes('exe')).browser_download_url;
const buildDownload = async (release) => {
    const isAlpha = release?.tag_name.includes('alpha') ? true : false;

    const item = document.createElement('li');
    item.classList = `download-item ${isAlpha && 'alpha'}`;

    const icon = document.createElement('img');
    icon.src = 'https://raw.githubusercontent.com/SushyDev/vapor-store/master/assets/icons/png/icon.png';
    icon.className = 'icon';

    const info = document.createElement('div');
    info.className = 'info';

    const title = document.createElement('h2');
    title.textContent = 'Vapor Store';

    const version = document.createElement('p');
    version.textContent = release ? release.tag_name : 'unknown';

    const download = document.createElement('button');
    download.textContent = 'Download';
    download.setAttribute('onclick', `window.open('${release ? getDownload(release) : 'example.com'}')`);

    const split = document.createElement('div');
    split.className = 'split';

    info.appendChild(title);
    info.appendChild(version);

    split.appendChild(icon);
    split.appendChild(info);

    item.append(split);
    item.appendChild(download);

    return item;
};
