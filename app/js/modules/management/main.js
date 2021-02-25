//Open more options popup
exports.openMore = (name, name2, gameDir, folderName) => {
    const anchorpoint = document.querySelector(`div[anchorfor="${name}"]`);

    anchorpoint.innerHTML != ''
        ? (anchorpoint.innerHTML = '')
        : (anchorpoint.innerHTML = `
        <div id="toolbar" class="toolbar mdc-menu-surface--anchor">
        <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
        <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="selectDefault('${name2}', '${gameDir}', '${folderName}')">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Select default exe</span>
        </li>
        <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameListExec('${name}', '${gameDir}', '${folderName}', false)">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">List executables</span>
        </li>
        <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameShortcut('${name}', '${gameDir}', '${folderName}')">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Add to desktop</span>
        </li>
        <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="openFolder('${gameDir}', '${folderName}')">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Open folder</span>
        </li>
        <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameDelete('${name2}', '${gameDir}', '${folderName}')">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Delete</span>
        </li>
        </ul>
        </div>
        </div>
        
        `);
};
