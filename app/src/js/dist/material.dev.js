"use strict";

var _topAppBar = require("@material/top-app-bar");

var _drawer = require("@material/drawer");

var _autoInit = require("@material/auto-init");

var _ripple = require("@material/ripple");

var _dialog = require("@material/dialog");

var _list = require("@material/list");

var _linearProgress = require("@material/linear-progress");

//Script for all material design components
// Instantiation
var topAppBarElement = document.querySelector('.mdc-top-app-bar');
var topAppBar = new _topAppBar.MDCTopAppBar(topAppBarElement);

var drawer = _drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

document.body.addEventListener('MDCDrawer:closed', function () {});
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', function () {
  drawer.open = !drawer.open;
});