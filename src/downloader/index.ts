// ! Remove ANY
const downloads: object[] | any[] = [];
const ids: string[] = [];

export const getDownloads = (): object[] => downloads;

// # Gets called on 'Download' click in store
export async function download(game: object | any) {
    // ? If game id in ids's list don't continue
    if (ids.includes(game.metadata.id)) {
        console.log('Already downloading');
        return;
    }

    // ? Add game to downloads array
    addToDownloads(game);

    const index: number = await downloads.findIndex((download) => download.metadata.id === game.metadata.id);

    // ! Remove ANY
    const {fetchDownload} = await import('./fetch');

    // ? Fetch download url
    const downloadURL = await fetchDownload(game.url);

    // ? If no download url
    if (!downloadURL) {
        console.log('Error occured fetching URL');
        removeFromDownloads(index);
        return;
    }

    // ? Start download
    downloadProcess(downloadURL, index);
}

/*
!
! Implement Pause/Cancel feature
! Later maybe implement resume after restart?
!
! See:
! https://github.com/hgouveia/node-downloader-helper
!
*/

// # Downloader process
async function downloadProcess(url: string, index: number) {
    const {get} = await import('@/modules/config');

    // @ts-ignore // ! FIX?
    const itemDownloadDir = get().downloadDir;

    const {DownloaderHelper} = require('node-downloader-helper');

    const downloaderOptions = {
        method: 'GET',
        override: true,
        progressThrottle: 250, // interval time of the 'progress.throttled' event will be emitted
    };

    // ? Instanciate downloader
    const dl = new DownloaderHelper(url, itemDownloadDir, downloaderOptions);

    // ? On download, create values array
    // ! Remove ANY
    dl.on('download', (downloadInfo: any) => {
        console.log(downloadInfo);
        downloads[index]['values'] = [];
    });
    dl.on('stateChanged', (state: any) => console.warn('State: ', state));
    dl.on('progress.throttled', (stats: object | any) => {
        const mbs: number = stats.speed / (1024 * 1024);
        const values: number[] = downloads[index]['values'];

        values.push(mbs);
        if (values.length >= 11) values.shift();
        downloads[index]['values'] = values;

        downloads[index] = {...downloads[index], values, progress: stats.progress};
    });

    // ? Start download
    dl.start().catch((err: any) => console.error(err));
}

// # Add game to download arrays
function addToDownloads(game: object | any) {
    ids.push(game.metadata.id);
    downloads.push(game);
}

// # Remove game from array's
function removeFromDownloads(index: number) {
    downloads.splice(index, 1);
    ids.splice(index, 1);
}

// # Cancel download
export function cancel(game: object | any) {
    console.log('cancel', game);
}

// # Pause/Continue download
export function pause(game: object | any) {
    console.log('pause', game);
}
