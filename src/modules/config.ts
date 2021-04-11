const fs = require('fs');
const {app} = require('electron').remote;
const {ipcRenderer} = require('electron');
const path = require('path');

// ? Vapor Store files directory's
export const vaporData = (): string => path.resolve(app.getPath('userData'));
export const vaporFiles = (): string => path.join(vaporData(), 'Files');
export const vaporGames = (): string => path.join(vaporData(), 'Games');
export const configFolder = (): string => path.join(vaporFiles(), 'json');

// ? Files
export const vaporConfig = (): string => path.join(configFolder(), 'config.json');

// # Startup checks
export const initialize = function(): void {
    const defaults: object = {downloadDir: '/home/sushy/' as string, darkMode: true as boolean, optBeta: false as boolean, autoExtract: true as boolean};

    // # Check if config folder exists
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

    // # Overwrite config file with defaults
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

    // # Check if config file exists
    function checkConfigFile() {
        if (!fs.existsSync(vaporConfig())) {
            console.warn('Config file does not exist!, creating config file...');
            writeConfigFile();
        } else {
            validateConfigFile();
        }
    }

    // # Check if config file is valid json
    async function validateConfigFile() {
        const data = await fs.readFileSync(vaporConfig(), 'UTF-8');

        try {
            JSON.parse(data);
        } catch (err) {
            console.warn('Error reading config file, resetting...');
            writeConfigFile();
            return;
        }

        setTimeout(() => ipcRenderer.send('loaded'), 50);
    }
};

// # Get current config contents
export const get = (): object => JSON.parse(fs.readFileSync(vaporConfig(), 'UTF-8'));

// # Add item to config
export const setItem = (newItem: object): object => {
    const config: object = JSON.parse(fs.readFileSync(vaporConfig(), 'UTF-8'));
    const newConfig: object = {...config, ...newItem};

    updateConfig(newConfig);
    return newConfig;
};

// # Overwrite entire config with content
function updateConfig(content: object) {
    fs.writeFile(vaporConfig(), JSON.stringify(content), 'UTF-8', (err: Error) => {
        if (err) {
            console.error('Something went wrong updating the config');
            console.error(err);
        }
    });
}
