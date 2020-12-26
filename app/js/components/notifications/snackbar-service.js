function createSnack(snackbarData) {
    var main = snackbarData.main[0];
    var label = snackbarData.label[0];
    var close;
    var progress;
    var hasprogress = false;
    var name = main.name;

    try {
        progress = snackbarData.progress[0];
        hasprogress = true;
    } catch (e) {}

    //Create snackbar
    var snackbar = document.createElement('div');
    snackbar.id = `${name}-snackbar`;
    snackbar.className = 'mdc-snackbar mdc-snackbar--leading mdc-snackbar--open snackbar--invis';
    snackbar.innerHTML = `
                        <div class="mdc-snackbar__surface snack-flex" id="${name}-surface" progress="${hasprogress}">
                            <div class="snack-content">
                                <div class="mdc-snackbar__label" role="status" aria-live="polite" id="${label.id}">${label.innerHTML}</div>
                                <div class="mdc-snackbar__actions" id="${name}-snack-actions"></div>
                            </div>
                        </div>
                        `;
    document.getElementById('snackbar-container').appendChild(snackbar);

    //Add progress
    if (!!snackbarData.progress) {
        let progress = snackbarData.progress[0];
        let progressbar = document.createElement('div');
        progressbar.setAttribute('role', 'progressbar');
        progressbar.className = 'mdc-linear-progress';
        progressbar.innerHTML = `
                            <div class="mdc-linear-progress__buffering-dots"></div>
                            <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75)"></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" id="${progress.id}"><span class="mdc-linear-progress__bar-inner"></span></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
                            `;
        document.getElementById(`${name}-surface`).prepend(progressbar);
    }

    //Make buttons in action menu
    if (!!snackbarData.actions) {
        snackbarData.actions.forEach((action) => {
            let actionButton = document.createElement(action.type);
            actionButton.className = 'mdc-button mdc-snackbar__action';
            actionButton.setAttribute('onclick', `${action.onclick}`);
            actionButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
            actionButton.innerHTML = `
                        <div class="mdc-button__ripple"></div>
                        <div class="mdc-button__label" id="${action.labelid}">${action.innerHTML}</div>
                        `;
            document.getElementById(`${name}-snack-actions`).appendChild(actionButton);
        });
    }

    //Add close button
    if (!!snackbarData.close) {
        let close = snackbarData.close[0];
        let closeButton = document.createElement('button');
        closeButton.id = close.id;
        closeButton.className = 'mdc-icon-button mdc-snackbar__dismiss material-icons';
        closeButton.setAttribute('title', close.title);
        closeButton.setAttribute('onclick', close.onclick);
        closeButton.innerHTML = close.icon;
        document.getElementById(`${name}-snack-actions`).appendChild(closeButton);
    }

    window.mdc.autoInit();

    //Show snackbar
    document.getElementById(`${name}-snackbar`).classList.remove('snackbar--invis');
}

//Close snackbar / cancel download
function closeSnackbar(name, alert = false, message) {
    //Ask for confirm if confirm = true
    if (alert) {
        let confirmed = confirm(message);
        if (!confirmed) return confirmed;
    }
    //Remove snackbar
    document.getElementById(`${name}-snackbar`).remove();

    return true;
}

function hideSnackbar(name) {
    //Ask for confirm if confirm = true
    //Remove snackbar
    document.getElementById(`${name}-snackbar`).style.display = 'none';
}

function showSnackbar(name) {
    //Ask for confirm if confirm = true
    //Remove snackbar
    document.getElementById(`${name}-snackbar`).style.display = 'block';
}
