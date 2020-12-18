//Script for all material design components

import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';
import {mdcAutoInit} from '@material/auto-init';
import {MDCRipple} from '@material/ripple';
import {MDCDialog} from '@material/dialog';
import {MDCList} from '@material/list';
import {MDCLinearProgress} from '@material/linear-progress';
import {MDCMenuSurface} from '@material/menu-surface';

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});
