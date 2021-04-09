import {get} from '@/modules/config';

const named: string[] = [];
const downloads: object[] | any[] = [];

export const getDownloads = (): object[] => downloads;

import {fetchDownload} from './fetch';

export function addToDownloads(game: object | any) {
    if (named.includes(game.metadata.id)) {
        console.log('Already downloading');
        return;
    }

    console.log(game.metadata.id);

    named.push(game.metadata.id);
    downloads.push(game);

    downloadGame(game);
}

async function downloadGame(game: object | any) {
    const index: number = await downloads.findIndex((download) => download.metadata.id === game.metadata.id);

    const downloadURL = await fetchDownload(game.url);

    // ? If no download url
    if (!downloadURL) {
        console.log('Error occured fetching URL');
        downloads.splice(index, 1);
        named.splice(index, 1);
        return;
    }

    download(downloadURL, index);
}

function download(url: string, index: number) {
    // @ts-ignore
    const itemDownloadDir = get().downloadDir;

    const {DownloaderHelper} = require('node-downloader-helper');

    // these are the default options
    const options = {
        method: 'GET',
        override: true,
    };

    const dl = new DownloaderHelper(url, itemDownloadDir, options);

    dl.on('download', (downloadInfo: any) => {
        downloads[index]['values'] = [];
        console.log('Download Begins: ', {
            name: downloadInfo.fileName,
            total: downloadInfo.totalSize,
        });
    });

    dl.on('stateChanged', (state: any) => console.log('State: ', state));

    dl.on('progress.throttled', (stats: object | any) => {
        /*
        downloaded: 10124990
        name: "hack.G.U.Last.Recode.v1.01.zip"
        progress: 0.027259025934633772
        speed: 6143678
        total: 37143623636
        */

        const mbs: number = stats.speed / (1024 * 1024);

        const values: number[] = downloads[index]['values'];
        values.push(mbs);
        if (values.length >= 11) values.shift();
        downloads[index]['values'] = values;

        downloads[index] = {...downloads[index], values, progress: stats.progress};
    });

    dl.start().catch((err: any) => {
        console.log(err);
        /* already listening on 'error' event but catch can be used too */
    });
}
