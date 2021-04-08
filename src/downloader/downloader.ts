import {get} from '@/modules/config';
import path from 'path';
import {DownloaderBus} from '@/downloader/event-bus';

const {download} = require('electron').remote.require('electron-dl');
const win = require('electron').remote.getCurrentWindow();
const config: object | any = get();
const itemDownloadDir = config.downloadDir.endsWith(path.sep) ? config.downloadDir.slice(0, -1) : config.downloadDir;

const started = []

export const downloadFromURL = (url: any, id: number) => {
    if (started.includes(id)) return;
    started.push(id)
    startDownload(win, url, id);
};

function startDownload(win, url, id) {
    download(win, url, {
        directory: itemDownloadDir,
        allowOverwrite: true,
        onStarted: (item: object | any) => {
            item.itemID = id;
            console.log(item.itemID + ' Download started');

            const itemFilename = item.getFilename();
            const itemSavePath = item.getSavePath();
            const itemFileType = itemFilename.substr(-3);
            const folderName = itemFilename.slice(0, -4);
            const startTime = Date.now();

            item.on('updated', () => {
                try {
                    const received_bytes = item.getReceivedBytes();
                    const total_bytes = item.getTotalBytes();

                    const downloadPercent = (received_bytes * 100) / total_bytes;
                    const scalePercent = downloadPercent / 100;

                    const seconds = (Date.now() - startTime) / 1000;
                    const MB = received_bytes / (1024 * 1024);
                    const GB = MB / 1024;
                    const MBps = MB / seconds;
                    const totalGB = total_bytes / (1024 * 1024 * 1024);

                    const whatINeed = {
                        percent: downloadPercent,
                        totalGB,
                        MBps,
                        id: item.itemID,
                    };

                    DownloaderBus.$emit(`progress-${item.itemID}`, whatINeed);

                    // # Update download page item
                } catch (e) {
                    console.log('Err', e);
                    console.log('Item mostlikely cancelled');
                    return;
                }
            });
        },
    });
}
