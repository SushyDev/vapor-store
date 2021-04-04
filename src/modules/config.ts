const fs = require('fs');
const {app} = require('electron').remote;
const {ipcRenderer} = require('electron');
const path = require('path');

// function to check if json exists, if not create it

// ! Vapor Store files directory's
const vaporData = () => path.resolve(app.getPath('userData'));
const vaporFiles = () => path.join(vaporData(), 'Files');
const configFolder = () => path.join(vaporFiles(), 'json');

// ! Main paths
exports.vaporData = () => vaporData();
exports.vaporFiles = () => vaporFiles();
exports.vaporConfigs = () => configFolder();

// ! Sub paths
exports.vaporGames = () => path.join(vaporFiles(), 'games');
exports.vaporConfig = () => path.join(configFolder(), 'config.json');

// ! Files
const vaporConfig = () => path.join(configFolder(), 'config.json');

console.log(vaporConfig());

checkConfigFolder();

// ! If config dir doesn't exist
function checkConfigFolder() {
    if (!fs.existsSync(configFolder())) {
        // ! Create folder (and subfolders if necessary)
        console.warn('Config folder does not exist!, creating folder tree...');
        fs.mkdir(configFolder(), {recursive: true}, (err: Error) => {
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
}

function checkConfigFile() {
    if (!fs.existsSync(vaporConfig())) {
        console.warn('Config file does not exist!, creating config file...');
        fs.writeFile(vaporConfig(), '{}', (err: Error) => {
            if (err) {
                console.error('Something went wrong creating the config file');
                console.error(err);
            } else {
                finishUp();
            }
        });
    } else {
        finishUp();
    }
}

function finishUp() {
    console.log('finish');
    setTimeout(() => {
        ipcRenderer.send('loaded', true);
    }, 1000);
}

// // ! Default values
// const defaults = () => [{downloadDir: vapor.fn.vaporGames(), darkMode: true, optBeta: app.getVersion().includes('beta') ? true : false, autoExtract: true}][0];

// // ! Overwrite entire config with content
// function updateConfig(content) {
//     const FILE = vapor.fn.vaporConfig();

//     // ? Write contents to file
//     fs.writeFile(FILE, JSON.stringify(content), 'UTF-8', (err) => {
//         if (err) console.log(`Error updating config @ updateConfig(${content})`);
//     });
// }

// // ! Create the file with empty content
// // ? Create empty config file, on success proceed like normal
// const createConfig = (FILE) => fs.appendFile(FILE, '{}', 'UTF-8', (err) => (err ? console.log(`Error creating file @ createFile(${FILE})`) : validate(FILE)));

// // ! Reset to empty
// // ? Write file to empty, if success proceed like normal
// const resetConfig = (FILE) => fs.writeFile(FILE, '{}', 'UTF-8', (err, content) => (err ? console.log(`Error writting file @ resetConfig(${FILE})`) : validate(FILE)));

// // ! Check if file content is valid JSON
// // ? Return true if valid json else return false
// const validateJSON = (content) => {
//     try {
//         JSON.parse(content);
//         return true;
//     } catch (e) {
//         return false;
//     }
// };

// // # Step 1
// function validate(FILE) {
//     const content = fs.readFileSync(FILE, 'UTF-8');

//     // ? Check if FILE content is valid JSON else reset the config
//     validateJSON(content) ? setConfig(FILE, content) : resetConfig(FILE);
// }

// // # Step 2
// function setConfig(FILE, data) {
//     const content = JSON.parse(data);

//     // ? Set the defaults if no item found
//     for (const item in defaults()) if (content[item] == undefined) content[item] = defaults()[item];

//     // ? If download dir doesn't exist then create it
//     fs.exists(content.downloadDir, async (exists) => exists || fs.mkdirSync(content.downloadDir, {recursive: true}));

//     // ? Write file content
//     fs.writeFileSync(FILE, JSON.stringify(content), 'UTF-8');
// }

// // ! Add item to array
// exports.setItem = async (newItem) => {
//     const FILE = vapor.fn.vaporConfig();
//     const config = JSON.parse(fs.readFileSync(FILE, 'UTF-8'));
//     const newConfig = {...config, ...newItem};

//     updateConfig(newConfig);
//     return newConfig;
// };

// exports.Initialize = () => {
//     const FILE = vapor.fn.vaporConfig();

//     fs.readFile(FILE, (err, data) => {
//         if (err) err.toString().includes('no such file') ? createConfig(FILE) : console.log(err);
//         if (data) validate(FILE);
//     });
// };

// exports.get = () => JSON.parse(fs.readFileSync(vapor.fn.vaporConfig(), 'UTF-8'));
