const {lockSize} = require('../js/screen-size');
lockSize('body');
window.addEventListener('resize', () => lockSize('body'));
