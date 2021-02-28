const {lockSize} = require('../js/screen-size');
lockSize('#loading');
window.addEventListener('resize', () => lockSize('#loading'));
