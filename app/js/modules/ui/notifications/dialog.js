exports.create = (dialogData, autoshow = true) => {
    const main = dialogData.main[0];
    const content = dialogData.content;
    const name = main.name;

    const dialog = document.createElement('div');
    dialog.className = `mdc-dialog ${main.id}-dialog`;
    dialog.id = `${main.id}-dialog`;
    dialog.innerHTML = `
    <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-content">
            <h2 class="mdc-dialog__title" id="${main.id}">${name}</h2>
            <div class="mdc-dialog__content" id="${name}-dialog-content">
            ${content}
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
            const actionButton = document.createElement('button');
            actionButton.className = 'mdc-button mdc-dialog__button';
            actionButton.setAttribute('onclick', `${action.action}`);
            actionButton.setAttribute('data-mdc-auto-init', 'MDCRipple');

            const ripple = document.createElement('div');
            ripple.className = 'mdc-button__ripple';

            const label = document.createElement('span');
            label.className = 'mdc-button__label';
            label.textContent = action.name;
            label.setAttribute('onclick', action.action);

            actionButton.appendChild(ripple);
            actionButton.appendChild(label);

            document.getElementById(`${name}-dialog__actions`).appendChild(actionButton);
        });
    } else {
        //if doesnt have actions remove action bar
        document.getElementById(`${name}-dialog__actions`).remove();
    }

    //Make dialog content
    if (!!dialogData.contents) {
        dialogData.contents.forEach((content) => {
            const contentItem = document.createElement(content.type);
            contentItem.id = `${content.id}`;
            contentItem.className = `${content.class}`;
            contentItem.innerHTML = `${content.innerHTML}`;
            document.getElementById(`${name}-dialog-content`).appendChild(contentItem);
        });
    }

    if (autoshow) vapor.ui.dialog.open(`${main.id}`);

    window.mdc.autoInit();
};

//alert(name, message, autoshow)
exports.MDCAlert = (title = 'Alert', message = '', autoshow = true) => {
    const name = title.replace(/ /g, '-').toLowerCase() + '-alert';

    const dialog = document.createElement('div');
    dialog.className = `mdc-dialog ${name}-dialog alert-dialog`;
    dialog.id = `${name}-dialog`;
    dialog.innerHTML = `
<div class="mdc-dialog__container">
    <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-content">
        <h2 class="mdc-dialog__title" id="${name}-dialog">${title}</h2>
        <div class="mdc-dialog__content" id="${name}-dialog-content">${message}</div>
        <div class="mdc-dialog__actions" id="${name}-dialog__actions">
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="vapor.ui.dialog.close('${name}')">
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

    if (autoshow) vapor.ui.dialog.open(`${name}`);

    window.mdc.autoInit();
};

exports.close = (name) => document.getElementById(`${name}-dialog`).remove();

exports.open = (name) => document.getElementById(`${name}-dialog`).classList.add('mdc-dialog--open');
