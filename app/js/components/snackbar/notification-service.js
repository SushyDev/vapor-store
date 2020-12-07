function newNotif(snackbarData) {
    var main = snackbarData.main[0];
    var progress = snackbarData.progress[0];
    var label = snackbarData.label[0];
    var close = snackbarData.close[0];

    var name = main.name;
    //Create snackbar
    var snackbar = document.createElement('div');
    snackbar.id = `${name}-snackbar`;
    snackbar.className = 'mdc-snackbar mdc-snackbar--leading mdc-snackbar--open snackbar--invis';
    snackbar.innerHTML = `
                        <div class="mdc-snackbar__surface snack-flex">
                            <div class="progress-container" id="${name}-progress-container">
                            </div>

                            <div class="snack-content">
                                <div class="mdc-snackbar__label" role="status" aria-live="polite" id="${label.id}">${label.innerHTML}</div>
                                <div class="mdc-snackbar__actions" id="${name}-snack-actions"></div>
                            </div>
                        </div>
                        `;
    document.getElementById('snackbar-container').appendChild(snackbar);

    //Add progress
    if (progress.enabled) {
        var progressbar = document.createElement('div');
        progressbar.setAttribute('role', 'progressbar');
        progressbar.className = 'mdc-linear-progress';
        progressbar.innerHTML = `
                            <div class="mdc-linear-progress__buffering-dots"></div>
                            <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75)"></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" id="${progress.id}"><span class="mdc-linear-progress__bar-inner"></span></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
                            `;
        document.getElementById(`${name}-progress-container`).appendChild(progressbar);
    }

    //Make buttons in action menu
    snackbarData.actions.forEach((action) => {
        var actionButton = document.createElement('button');
        actionButton.className = 'mdc-button mdc-snackbar__action';
        actionButton.setAttribute('onclick', `${action.onclick}`);
        actionButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
        actionButton.innerHTML = `
                        <div class="mdc-button__ripple"></div>
                        <div class="mdc-button__label" id="${action.labelid}">${action.innerHTML}</div>
                        `;
        document.getElementById(`${name}-snack-actions`).appendChild(actionButton);
    });

    //Add close button
    if (close.enabled) {
        var closeButton = document.createElement('button');
        closeButton.id = close.id;
        closeButton.className = 'mdc-icon-button mdc-snackbar__dismiss material-icons';
        closeButton.setAttribute('title', close.title);
        closeButton.setAttribute('onclick', close.onclick);
        closeButton.setAttribute('confirm', close.confirm);
        closeButton.innerHTML = close.icon;
        document.getElementById(`${name}-snack-actions`).appendChild(closeButton);
    }

    //Show snackbar
    document.getElementById(`${name}-snackbar`).classList.remove('snackbar--invis');
}

//Close snackbar / cancel download
function closeSnackbar(name, message) {
    //Ask for confirm if confirm = true
    if (document.querySelector(`#${name}-close`).getAttribute('confirm') == 'true') if (!confirm(message)) return;
    //Remoive snackbar
    document.getElementById(`${name}-snackbar`).remove();
}
