'use strict';

const _topAppBar = require('@material/top-app-bar');

const _drawer = require('@material/drawer');

const _autoInit = require('@material/auto-init');

const _ripple = require('@material/ripple');

const _dialog = require('@material/dialog');

const _list = require('@material/list');

const _linearProgress = require('@material/linear-progress');

const _menuSurface = require('@material/menu-surface');

//Script for all material design components
// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new _topAppBar.MDCTopAppBar(topAppBarElement);

const drawer = _drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', function () {
    drawer.open = !drawer.open;
});
