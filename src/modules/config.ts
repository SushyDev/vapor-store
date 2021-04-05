const fs = require('fs');
const {app} = require('electron').remote;
const {ipcRenderer} = require('electron');
const path = require('path');

// function to check if json exists, if not create it

// ! Vapor Store files directory's
const vaporData = (): string => path.resolve(app.getPath('userData'));
const vaporFiles = (): string => path.join(vaporData(), 'Files');
const vaporGames = (): string => path.join(vaporData(), 'Games');
const configFolder = (): string => path.join(vaporFiles(), 'json');

// ! Files
const vaporConfig = (): string => path.join(configFolder(), 'config.json');

// ! Main paths
exports.vaporData = (): string => vaporData();
exports.vaporFiles = (): string => vaporFiles();
exports.vaporConfigs = (): string => configFolder();

// ! Sub paths
exports.vaporGames = (): string => path.join(vaporFiles(), 'games');
exports.vaporConfig = (): string => vaporConfig();

// ! If config dir doesn't exist
exports.initialize = function(): void {
    const defaults: object = {downloadDir: {name: '' as string, path: '' as string} as object, darkMode: true as boolean, optBeta: false as boolean, autoExtract: true as boolean};

    if (!fs.existsSync(configFolder())) {
        // !  Create folder (and subfolders if necessary)
        console.warn('Config folder does not exist!, creating folder tree...');
        fs.mkdir(configFolder(), {recursive: true as boolean}, (err: Error) => {
            if (err) {
                console.error('Something went wrong creating folder tree');
                console.error(err);
            } else {
                checkConfigFile();
            }
        });
    } else {
        checkConfigFile();
    }

    async function writeConfigFile() {
        try {
            fs.writeFileSync(vaporConfig(), JSON.stringify(defaults));
        } catch (err) {
            console.error('Something went wrong creating the config file');
            console.error(err);
            return;
        }
        console.warn('Successfully written config file');
        validateConfigFile();
    }

    function checkConfigFile() {
        if (!fs.existsSync(vaporConfig())) {
            console.warn('Config file does not exist!, creating config file...');
            writeConfigFile();
        } else {
            validateConfigFile();
        }
    }

    async function validateConfigFile() {
        const data = await fs.readFileSync(vaporConfig(), 'UTF-8');

        try {
            JSON.parse(data);
        } catch (err) {
            console.warn('Error reading config file, resetting...');
            writeConfigFile();
            return;
        }

        setTimeout(() => ipcRenderer.send('loaded', true), 350);
    }
};

exports.get = (): object => JSON.parse(fs.readFileSync(vaporConfig(), 'UTF-8'));

// ! Add item to array
exports.setItem = (newItem: object): object => {
    const config: object = JSON.parse(fs.readFileSync(vaporConfig(), 'UTF-8'));
    const newConfig: object = {...config, ...newItem};

    updateConfig(newConfig);
    return newConfig;
};

// ! Overwrite entire config with content
function updateConfig(content: object) {
    fs.writeFile(vaporConfig(), JSON.stringify(content), 'UTF-8', (err: Error) => {
        if (err) {
            console.error('Something went wrong updating the config');
            console.error(err);
        }
    });
}
