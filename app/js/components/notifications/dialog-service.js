//Open dialog by id name
/*
function openDialog(id) {
    var dialog = document.getElementById(id);
    dialog.classList.add('');
}

//Close dialog by (this) value from button
function closeDialog(button) {
    var dialog = button.closest('.mdc-dialog--open');
    dialog.classList.remove('mdc-dialog--open');
}

*/

function createDialog(dialogData, autoshow) {
    var main = dialogData.main;
    var title = dialogData.title;

    var name = main.name;

    var dialog = document.createElement('div');
    dialog.className = `mdc-dialog ${name}-dialog`;
    dialog.id = `${name}-dialog`;
    dialog.innerHTML = `
    <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-content">
            <h2 class="mdc-dialog__title" id="${title.id}">${title.innerHTML}</h2>
            <div class="mdc-dialog__content" id="${name}-dialog-content">
            </div>
            <div class="mdc-dialog__actions" id="${name}-dialog__actions">
            </div>
        </div>
    </div>
    <div class="mdc-dialog__scrim"></div>`;

    //Add dialog to overlay div
    document.getElementById('overlays').prepend(dialog);

    //Make buttons in action menu
    if (!!dialogData.actions) {
        dialogData.actions.forEach((action) => {
            var actionButton = document.createElement(action.type);
            actionButton.className = 'mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded';
            actionButton.id = `${action.id}`;
            actionButton.setAttribute('onclick', `${action.onclick}`);
            actionButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
            actionButton.setAttribute('data-mdc-ripple-is-unbounded', true);
            actionButton.innerHTML = `${action.icon}`;
            document.getElementById(`${name}-dialog__actions`).appendChild(actionButton);
        });
    } else {
        //if doesnt have actions remove action bar
        document.getElementById(`${name}-dialog__actions`).remove();
    }

    //Make dialog content
    if (!!dialogData.contents) {
        dialogData.contents.forEach((content) => {
            var contentItem = document.createElement(content.type);
            contentItem.id = `${content.id}`;
            contentItem.className = `${content.class}`;
            contentItem.innerHTML = `${content.innerHTML}`;
            document.getElementById(`${name}-dialog-content`).appendChild(contentItem);
        });
    }

    if (autoshow) openDialog(`${name}`);

    window.mdc.autoInit();
}

//alert(name, message, autoshow)
function MDCAlert(title, message, autoshow) {
    var name = title.replace(/ /g, '-').toLowerCase() + '-alert';

    var dialog = document.createElement('div');
    dialog.className = `mdc-dialog ${name}-dialog alert-dialog`;
    dialog.id = `${name}-dialog`;
    dialog.innerHTML = `
<div class="mdc-dialog__container">
    <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-content">
        <h2 class="mdc-dialog__title" id="${name}-dialog">${title}</h2>
        <div class="mdc-dialog__content" id="${name}-dialog-content">${message}</div>
        <div class="mdc-dialog__actions" id="${name}-dialog__actions">
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="closeDialog('${name}')">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Ok</span>
            </button>
        </div>
    </div>
</div>
<div class="mdc-dialog__scrim"></div>
`;

    //Add dialog to overlay div
    document.getElementById('overlays').prepend(dialog);

    if (autoshow) openDialog(`${name}`);

    window.mdc.autoInit();
}

function closeDialog(name) {
    document.getElementById(`${name}-dialog`).remove();
}

function openDialog(name) {
    document.getElementById(`${name}-dialog`).classList.add('mdc-dialog--open');
}
