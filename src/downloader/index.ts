const downloads: object[] | any[] = [];
const ids: string[] = [];

export const getDownloads = (): object[] => downloads;

// # Gets called on 'Download' click in store
export async function download(game: object | any) {
    const {SnackBus} = await import('@/event-bus');

    SnackBus.$emit('new', {
        text: `Download for ${game.name} started`,
        duration: 4000,
    });

    // ? If game id in ids's list don't continue
    if (ids.includes(game.metadata.id)) {
        SnackBus.$emit('new', {
            text: `${game.name} already downloading`,
            duration: 4000,
        });
        return;
    }

    // ? Add game to downloads array
    addToDownloads(game);
    const index: number = await downloads.findIndex((download) => download.metadata.id === game.metadata.id);

    // ? Fetch download url
    const {fetchDownload} = await import('./fetch');

    const downloadURL = await fetchDownload(game.url).catch((err) => {
        console.error(`Error fetching ${game.url}`);
        console.error(err);
        return null;
    });

    // # If no download url
    if (!downloadURL) {
        removeFromDownloads(index);

        SnackBus.$emit('new', {
            text: `Error occured fetching URL for ${game.name}`,
            duration: 4000,
            actions: [
                {
                    text: 'Retry',
                    click: () => require('@/downloader').download(game),
                },
            ],
        });

        return;
    }

    // ? Start download
    downloadProcess(downloadURL, index).catch((err) => {
        console.error(`Something went wrong downloading ${game.name}`);
        console.error(err);
    });
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
    const {DownloaderHelper} = await import('node-downloader-helper');

    // @ts-ignore // ! FIX?
    const itemDownloadDir = get().downloadDir;

    const downloaderOptions = {
        override: true,
        progressThrottle: 100,
    };

    // ? Instanciate downloader
    const dl = new DownloaderHelper(url, itemDownloadDir, downloaderOptions);

    // ? Append downloader process to the game object
    downloads[index] = {...downloads[index], dl};

    // ? Download events
    dl.on('download', (downloadInfo: object | any) => onDownload(downloadInfo));
    dl.on('stateChanged', (state: object | any) => onChange(state));
    dl.on('progress.throttled', (stats: object | any) => onProgress(stats));
    dl.on('end', (downloadInfo: object | any) => onEnd(downloadInfo));

    function onDownload(downloadInfo: object | any) {}

    function onProgress(stats: object | any) {
        try {
            const mbs: number = stats.speed / (1024 * 1024);
            const progress: number[] = downloads[index].progress;
            const values: number[] = downloads[index].values;

            values.push(mbs);
            if (values.length >= 51) values.shift();

            // ! Strange hack to make progress reactive state
            progress.shift();
            progress.push(stats.progress);

            // ? Push changes
            downloads[index] = {...downloads[index], values, progress};
        } catch (err) {
            console.error(`Something went wrong updating download progress for ${downloads[index].name}`);
            console.error(err);
        }
    }

    function onEnd(downloadInfo: object | any) {
        console.log('Download Completed', downloadInfo);
    }

    function onChange(state: object | any) {
        console.warn(downloads[index].name, ' State: ', state);

        switch (state) {
            case 'STOPPED':
                onFinished();
        }
    }

    function onFinished() {
        downloads[index] = {...downloads[index], removed: true};
        removeFromDownloads(index);
    }

    // ? Start download
    dl.start().catch((err: any) => {
        console.error(`Something went wrong downloading ${downloads[index].name}`);
        console.error(err);
    });
}

// # Add game to download arrays
function addToDownloads(game: object | any) {
    ids.push(game.metadata.id);

    game = {...game, values: [0], progress: [0], removed: [false]};

    downloads.push(game);
}

// # Remove game from array's
function removeFromDownloads(index: number) {
    downloads.splice(index, 1);
    ids.splice(index, 1);
}

// # Cancel download
export function cancel(game: object | any) {
    const index: number = downloads.findIndex((download) => download.metadata.id === game.metadata.id);

    downloads[index].dl.stop();

    console.log('cancel', game);
}

// # Pause/Continue download
export function pause(game: object | any) {
    const index: number = downloads.findIndex((download) => download.metadata.id === game.metadata.id);

    downloads[index].dl.pause();

    setTimeout(() => downloads[index].dl.resume(), 1000);

    console.log('pause', game);
}
