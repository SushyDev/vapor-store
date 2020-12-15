const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const spawn = require('child_process').spawnSync;

const helpers = require('./helpers.js');

const library = {
    // LINUX
    generateLinuxFileData: function (options) {
        if (!options || !options.linux || !options.linux.filePath) {
            return '';
        }

        // Set defaults
        let type = 'Type=Application';
        let terminal = 'Terminal=false';
        let exec = 'Exec=' + options.linux.filePath;
        let name = 'Name=' + path.parse(options.linux.filePath).name;
        let comment = '';
        let icon = '';

        // Replace defaults if value passed in
        if (options.linux.type) {
            type = 'Type=' + options.linux.type;
        }
        if (options.linux.terminal) {
            terminal = 'Terminal=' + options.linux.terminal;
        }
        if (options.linux.name) {
            name = 'Name=' + options.linux.name;
        }
        if (options.linux.comment) {
            comment = 'comment=' + options.linux.comment;
        }
        if (options.linux.icon) {
            icon = 'Icon=' + options.linux.icon;
        }

        // File format details:
        // https://wiki.archlinux.org/index.php/Desktop_entries
        const fileContents = ['#!/user/bin/env xdg-open', '[Desktop Entry]', 'Version=1.0', type, terminal, exec, name, comment, icon].filter(Boolean).join('\n');

        return fileContents;
    },
    makeLinuxShortcut: function (options) {
        const fileContents = this.generateLinuxFileData(options);

        let success = true;

        try {
            fs.writeFileSync(options.linux.outputPath, fileContents);
        } catch (error) {
            success = false;
            helpers.throwError(options, 'ERROR: Could not create LINUX shortcut.\n' + 'PATH: ' + options.linux.outputPath + '\n' + 'DATA:\n' + fileContents, error);
        }

        if (success && options.linux.chmod) {
            try {
                fs.chmodSync(options.linux.outputPath, '755');
            } catch (error) {
                success = false;
                helpers.throwError(options, 'ERROR attempting to change permisions of ' + options.linux.outputPath, error);
            }
        }

        return success;
    },

    // WINDOWS
    produceWindowsVBSPath: function () {
        //adjusted for electron
        var filepath;
        if (isDev) {
            filepath = path.join(__dirname, 'windows.vbs');
        } else {
            filepath = path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/create-desktop-shortcuts/src/windows.vbs');
        }
        return filepath;
    },

    makeWindowsShortcut: function (options) {
        let success = true;

        const vbsScript = this.produceWindowsVBSPath();
        const filePathName = path.parse(options.windows.filePath).name;
        if (!fs.existsSync(vbsScript)) {
            helpers.throwError(options, 'Could not locate required "windows.vbs" file.');
            success = false;
            return success;
        }

        const windowModes = {
            normal: 1,
            maximized: 3,
            minimized: 7,
        };

        let outputPath = options.windows.outputPath;
        let filePath = options.windows.filePath;
        let args = options.windows.arguments || '';
        let comment = options.windows.comment || filePathName;
        let cwd = options.windows.workingDirectory || '';
        let icon = options.windows.icon;
        let windowMode = windowModes[options.windows.windowMode] || 1;
        let hotkey = options.windows.hotkey || '';

        if (!icon) {
            if (filePath.endsWith('.dll') || filePath.endsWith('.exe')) {
                icon = options.windows.filePath + ',0';
            } else {
                icon = options.windows.filePath;
            }
        }

        let wscriptArguments = [
            vbsScript,
            // '/NoLogo',  // Apparently this stops it from displaying a logo in the console, even though I haven't actually ever seen one
            // '/B',  // silent mode, but doesn't actually stop dialog alert windows from popping up on errors
            outputPath,
            filePath,
            args,
            comment,
            cwd,
            icon,
            windowMode,
            hotkey,
        ];

        try {
            spawn('wscript', wscriptArguments);
        } catch (error) {
            success = false;
            helpers.throwError(options, 'ERROR: Could not create WINDOWS shortcut.\n' + 'TARGET: ' + options.windows.filePath + '\n' + 'PATH: ' + options.windows.outputPath + '\n', error);
        }

        return success;
    },

    // OSX
    makeOSXShortcut: function (options) {
        let success = true;

        // Global OSX command to create symbolic links
        const link = 'ln';
        const symbolic = '-s';

        let overwrite = '';
        if (options.osx.overwrite) {
            overwrite = '-f';
        }

        if (overwrite || (!overwrite && !fs.existsSync(options.osx.outputPath))) {
            // https://ss64.com/osx/ln.html
            let command = [link, overwrite, symbolic, '"' + options.osx.filePath + '"', '"' + options.osx.outputPath + '"'].filter(Boolean).join(' ');

            try {
                // ln -s "/Applications/Sublime Text.app" "/Users/owner/Desktop/Sublime Text"
                exec(command);
            } catch (error) {
                success = false;
                helpers.throwError(options, 'ERROR: Could not create OSX shortcut.\n' + 'TARGET: ' + options.osx.filePath + '\n' + 'PATH: ' + options.osx.outputPath + '\n', error);
            }
        } else {
            helpers.throwError(options, 'Could not create OSX shortcut because matching outputPath already exists and overwrite is false.');
        }

        return success;
    },

    // RUN
    runCorrectOSs: function (options) {
        if (!options.windows && !options.linux && !options.osx) {
            helpers.throwError(options, 'No shortcuts were created due to lack of accurate details passed in to options object', options);
            return false;
        } else if (options.onlyCurrentOS) {
            if (process.platform === 'win32' && options.windows) {
                return this.makeWindowsShortcut(options);
            }
            if (process.platform === 'linux' && options.linux) {
                return this.makeLinuxShortcut(options);
            }
            if (process.platform === 'darwin' && options.osx) {
                return this.makeOSXShortcut(options);
            }
            helpers.throwError(options, 'Unsupported platform. This library only supports process.platform of "win32", "linux" and "darwin".', options);
            return false;
        } else {
            let windowsSuccess = true;
            let linuxSuccess = true;
            let osxSuccess = true;

            if (options.windows) {
                windowsSuccess = this.makeWindowsShortcut(options);
            }
            if (options.linux) {
                linuxSuccess = this.makeLinuxShortcut(options);
            }
            if (options.osx) {
                osxSuccess = this.makeOSXShortcut(options);
            }

            return windowsSuccess && linuxSuccess && osxSuccess;
        }
    },
};

module.exports = library;
