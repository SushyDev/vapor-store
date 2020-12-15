'use strict';

const validation = require('./src/validation.js');
const library = require('./src/library.js');

/**
 * Creates OS based shortcuts for files, folders, and applications.
 *
 * @param  {object}  options Options object for each OS
 * @return {boolean}         true = success, false = failed to create the icon or set its permissions (Linux)
 */
function createDesktopShortcut (options) {
  options = validation.validateOptions(options);
  let success = library.runCorrectOSs(options);
  return success;
}

module.exports = createDesktopShortcut;
