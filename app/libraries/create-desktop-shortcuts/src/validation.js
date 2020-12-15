const fs = require('fs');
const path = require('path');
const os = require('os');

const helpers = require('./helpers.js');

const validation = {
  // SHARED
  validateOptions: function (options) {
    options = options || {};
    if (typeof(options.verbose) !== 'boolean') {
      options.verbose = true;
    }
    if (typeof(options.onlyCurrentOS) !== 'boolean') {
      options.onlyCurrentOS = true;
    }
    if (!options.customLogger) {
      delete options.customLogger;
    } else if (typeof(options.customLogger) !== 'function') {
      delete options.customLogger;
      helpers.throwError(options, 'Optional customLogger must be a type of function.');
    }

    if (options.onlyCurrentOS) {
      if (process.platform !== 'win32' && options.windows) {
        delete options.windows;
      }
      if (process.platform !== 'linux' && options.linux) {
        delete options.linux;
      }
      if (process.platform !== 'darwin' && options.osx) {
        delete options.osx;
      }
    }

    options = this.validateLinuxOptions(options);
    options = this.validateWindowsOptions(options);
    options = this.validateOSXOptions(options);

    return options;
  },
  validateOutputPath: function (options, operatingSystem) {
    options = this.validateOptionalString(options, operatingSystem, 'name');

    if (!options[operatingSystem]) {
      return options;
    }

    if (options[operatingSystem].outputPath) {
      if (process.platform === 'win32') {
        options[operatingSystem].outputPath = helpers.resolveWindowsEnvironmentVariables(options[operatingSystem].outputPath);
      } else {
        options[operatingSystem].outputPath = helpers.resolveTilde(options[operatingSystem].outputPath);
      }

      if (
        !fs.existsSync(options[operatingSystem].outputPath) ||
        !fs.lstatSync(options[operatingSystem].outputPath).isDirectory()
      ) {
        helpers.throwError(options, 'Optional ' + operatingSystem.toUpperCase() + ' outputPath must exist and be a folder. Defaulting to desktop.');
        delete options[operatingSystem].outputPath;
      }
    }

    if (!options[operatingSystem].outputPath) {
      options[operatingSystem].outputPath = path.join(os.homedir(), 'Desktop');
    }

    // Used for cross-platform testing. 'C:\\file.ext' => 'C:/file.ext' allowing path.parse to work on Linux (CI) with Windows paths
    const correctedFilePath = path.join(...options[operatingSystem].filePath.split('\\'));

    const fileName = options[operatingSystem].name || path.parse(correctedFilePath).name || 'Root';
    const fileExtensions = {
      linux: '.desktop',
      win32: '.lnk',
      darwin: ''
    };
    const fileExtension = fileExtensions[process.platform];

    // 'C:\Users\Bob\Desktop\' + 'My App Name.lnk'
    // '~/Desktop/' + 'My App Name.desktop'
    options[operatingSystem].outputPath = path.join(options[operatingSystem].outputPath, fileName + fileExtension);

    return options;
  },
  validateOptionalString: function (options, operatingSystem, key) {
    if (
      typeof(options[operatingSystem]) === 'object' &&
      Object(options[operatingSystem]).hasOwnProperty(key) &&
      typeof(options[operatingSystem][key]) !== 'string'
    ) {
      helpers.throwError(options, 'Optional ' + operatingSystem.toUpperCase() + ' ' + key + ' must be a string');
      delete options[operatingSystem][key];
    }
    return options;
  },
  defaultBoolean: function (options, operatingSystem, key, defaultValue) {
    defaultValue = !!defaultValue;

    if (typeof(options[operatingSystem]) === 'object') {
      if (options[operatingSystem][key] === undefined) {
        options[operatingSystem][key] = defaultValue;
      }

      if (
        Object(options[operatingSystem]).hasOwnProperty(key) &&
        typeof(options[operatingSystem][key]) !== 'boolean'
      ) {
        helpers.throwError(options, 'Optional ' + operatingSystem.toUpperCase() + ' ' + key + ' must be a boolean. Defaulting to ' + defaultValue);
        options[operatingSystem][key] = defaultValue;
      }
    }

    return options;
  },

  // LINUX
  validateLinuxFilePath: function (options) {
    if (!options.linux) {
      return options;
    }

    if (options.linux.filePath) {
      options.linux.filePath = helpers.resolveTilde(options.linux.filePath);
    }

    options = this.validateLinuxType(options);
    const type = options.linux.type;
    if (
      (!type || type === 'Application') &&
      (
        !options.linux.filePath ||
        typeof(options.linux.filePath) !== 'string' ||
        !fs.existsSync(options.linux.filePath) ||
        fs.lstatSync(options.linux.filePath).isDirectory()
      )
    ) {
      helpers.throwError(options, 'LINUX filePath (with type of "Application") must exist and cannot be a folder: ' + options.linux.filePath);
      delete options.linux;
    } else if (
      type &&
      type === 'Directory' &&
      (
        !options.linux.filePath ||
        typeof(options.linux.filePath) !== 'string' ||
        !fs.existsSync(options.linux.filePath) ||
        !fs.lstatSync(options.linux.filePath).isDirectory()
      )
    ) {
      helpers.throwError(options, 'LINUX filePath (with type of "Directory") must exist and be a folder: ' + options.linux.filePath);
      delete options.linux;
    } else if (
      type &&
      type === 'Link' &&
      (
        !options.linux.filePath ||
        typeof(options.linux.filePath) !== 'string'
      )
    ) {
      helpers.throwError(options, 'LINUX filePath url must be a string: ' + options.linux.filePath);
      delete options.linux;
    }

    return options;
  },
  validateLinuxType: function (options) {
    options = this.validateOptionalString(options, 'linux', 'type');

    const validTypes = ['Application', 'Link', 'Directory'];

    if (options.linux) {
      if (
        !options.linux.type &&
        options.linux.filePath &&
        typeof(options.linux.filePath) === 'string'
      ) {
        if (
          options.linux.filePath.startsWith('http://') ||
          options.linux.filePath.startsWith('https://')
        ) {
          options.linux.type = 'Link';
        } else if (
          fs.existsSync(options.linux.filePath) &&
          fs.lstatSync(options.linux.filePath).isDirectory()
        ) {
          options.linux.type = 'Directory';
        }
      }

      if (options.linux.type && !validTypes.includes(options.linux.type)) {
        helpers.throwError(options, 'Optional LINUX type must be "Application", "Link", or "Directory". Defaulting to "Application".');
        delete options.linux.type;
      }

      options.linux.type = options.linux.type || 'Application';
    }

    return options;
  },
  validateLinuxIcon: function (options) {
    options = this.validateOutputPath(options, 'linux');
    options = this.validateOptionalString(options, 'linux', 'icon');

    if (options.linux && options.linux.icon) {
      let iconPath = helpers.resolveTilde(options.linux.icon);

      if (!path.isAbsolute(iconPath)) {
        const outputDirectory = path.parse(options.linux.outputPath).dir;
        iconPath = path.join(outputDirectory, iconPath);
      }

      if (!iconPath.endsWith('.png') && !iconPath.endsWith('.icns')) {
        helpers.throwError(options, 'Optional LINUX icon should probably be a PNG file.');
      }

      if (!fs.existsSync(iconPath)) {
        helpers.throwError(options, 'Optional LINUX icon could not be found.');
        delete options.linux.icon;
      } else {
        options.linux.icon = iconPath;
      }
    }
    if (options.linux && !options.linux.icon) {
      delete options.linux.icon;
    }

    return options;
  },
  validateLinuxOptions: function (options) {
    options = this.validateLinuxFilePath(options);

    if (!options.linux) {
      return options;
    }

    options = this.validateLinuxIcon(options);
    options = this.defaultBoolean(options, 'linux', 'terminal', false);
    options = this.defaultBoolean(options, 'linux', 'chmod', true);
    options = this.validateOptionalString(options, 'linux', 'comment');

    return options;
  },

  // WINDOWS
  validateWindowsFilePath: function (options) {
    if (!options.windows) {
      return options;
    }

    if (options.windows.filePath) {
      options.windows.filePath = helpers.resolveWindowsEnvironmentVariables(options.windows.filePath);
    }

    if (
      !options.windows.filePath ||
      typeof(options.windows.filePath) !== 'string' ||
      !fs.existsSync(options.windows.filePath)
    ) {
      helpers.throwError(options, 'WINDOWS filePath does not exist: ' + options.windows.filePath);
      delete options.windows;
    }

    return options;
  },
  validateWindowsWindowMode: function (options) {
    options = this.validateOptionalString(options, 'windows', 'windowMode');

    const validWindowModes = ['normal', 'maximized', 'minimized'];

    if (options.windows && options.windows.windowMode && !validWindowModes.includes(options.windows.windowMode)) {
      helpers.throwError(options, 'Optional WINDOWS windowMode must be "normal", "maximized", or "minimized". Defaulting to "normal".');
      delete options.windows.windowMode;
    }

    if (options.windows && !options.windows.windowMode) {
      options.windows.windowMode = 'normal';
    }

    return options;
  },
  validateWindowsIcon: function (options) {
    options = this.validateOutputPath(options, 'windows');
    options = this.validateOptionalString(options, 'windows', 'icon');

    if (options.windows && options.windows.icon) {
      let iconPath = helpers.resolveWindowsEnvironmentVariables(options.windows.icon);

      if (!path.win32.isAbsolute(iconPath)) {
        let outputPath = options.windows.outputPath;
        // path.sep is forced to '/' in tests so Linux CI can validate Windows tests.
        // Coverage ignored because we can't do ELSE on this IF.
        /* istanbul ignore next */
        if (path.sep !== '\\') {
          outputPath = outputPath.split('\\').join('/');
          iconPath = iconPath.split('\\').join('/');
        }
        const outputDirectory = path.parse(outputPath).dir;
        iconPath = path.join(outputDirectory, iconPath);
      }

      // anything, then either '.exe', '.ico', or '.dll', maybe ',12'.
      let iconPattern = /^.*(?:\.exe|\.ico|\.dll)(?:,\d*)?$/m;
      if (!RegExp(iconPattern).test(iconPath)) {
        iconPath = undefined;
        helpers.throwError(options, 'Optional WINDOWS icon must be a ICO, EXE, or DLL file. It may be followed by a comma and icon index value, like: "C:\\file.exe,0"');
      }

      /**
       * Removes the icon index from file paths.
       * Such as 'C:\\file.exe,2' => 'C:\\file.exe'
       *
       * @param  {string} icon  Icon filepath
       * @return {string}       Icon filepath without icon index
       */
      function removeIconIndex (icon) {
        // 'C:\\file.dll,0' => 'dll,0'
        const extension = path.parse(icon).ext;
        // 'dll,0' => ['dll', '0'] => 'dll'
        const cleaned = extension.split(',')[0];
        // 'C:\\file.dll,0' => 'C:\\file.dll'
        return icon.replace(extension, cleaned);
      }

      if (!iconPath) {
        delete options.windows.icon;
      } else if (!fs.existsSync(removeIconIndex(iconPath))) {
        helpers.throwError(options, 'Optional WINDOWS icon could not be found.');
        delete options.windows.icon;
      } else {
        options.windows.icon = iconPath;
      }
    }

    return options;
  },
  validateWindowsComment: function (options) {
    options = this.validateOptionalString(options, 'windows', 'comment');
    options = this.validateOptionalString(options, 'windows', 'description');

    // Accidentally showed 'description' in part of the docs that should have been comment.
    // Just in case someone copy/pasted that in the past we should make sure it works.
    if (options.windows && options.windows.description) {
      options.windows.comment = options.windows.comment || options.windows.description;
      delete options.windows.description;
    }

    return options;
  },
  validateWindowsWorkingDirectory: function (options) {
    options = this.validateOptionalString(options, 'windows', 'workingDirectory');
    if (!options.windows || !Object(options.windows).hasOwnProperty('workingDirectory')) {
      return options;
    }

    options.windows.workingDirectory = helpers.resolveWindowsEnvironmentVariables(options.windows.workingDirectory);

    if (!fs.existsSync(options.windows.workingDirectory)) {
      helpers.throwError(options, 'Optional WINDOWS workingDirectory path does not exist: ' + options.windows.workingDirectory);
      delete options.windows.workingDirectory;
      return options;
    }

    if (!fs.lstatSync(options.windows.workingDirectory).isDirectory()) {
      helpers.throwError(options, 'Optional WINDOWS workingDirectory path must be a directory: ' + options.windows.workingDirectory);
      delete options.windows.workingDirectory;
      return options;
    }

    return options;
  },
  validateWindowsOptions: function (options) {
    options = this.validateWindowsFilePath(options);

    if (!options.windows) {
      return options;
    }

    options = this.validateWindowsWindowMode(options);
    options = this.validateWindowsIcon(options);
    options = this.validateWindowsComment(options);
    options = this.validateWindowsWorkingDirectory(options);
    options = this.validateOptionalString(options, 'windows', 'arguments');
    options = this.validateOptionalString(options, 'windows', 'hotkey');

    return options;
  },

  // OSX
  validateOSXFilePath: function (options) {
    if (!options.osx) {
      return options;
    }

    if (options.osx.filePath) {
      options.osx.filePath = helpers.resolveTilde(options.osx.filePath);
    }

    if (
      !options.osx.filePath ||
      typeof(options.osx.filePath) !== 'string' ||
      !fs.existsSync(options.osx.filePath)
    ) {
      helpers.throwError(options, 'OSX filePath does not exist: ' + options.osx.filePath);
      delete options.osx;
    }

    return options;
  },
  validateOSXOptions: function (options) {
    options = this.validateOSXFilePath(options);

    if (!options.osx) {
      return options;
    }

    options = this.validateOutputPath(options, 'osx');
    options = this.defaultBoolean(options, 'osx', 'overwrite', false);

    return options;
  }
};

module.exports = validation;
