import Vue from 'vue';

export const DownloaderBus = new Vue();

const named: string[] = [];
const downloads: object[] = [];

export const getDownloads = (): object[] => downloads;

DownloaderBus.$on('download', addToDownloads);

import {fetchDownload} from './fetch';
import {downloadFromURL} from './downloader';

function addToDownloads(game: object | any) {
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
    const downloadURL = await fetchDownload(game.url);
    downloadFromURL(downloadURL, game.metadata.id);
}
