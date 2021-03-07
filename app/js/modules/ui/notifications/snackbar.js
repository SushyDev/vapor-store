exports.create = (snackbarData) => {
    const main = snackbarData.main[0];
    const hasprogress = snackbarData.progress ? true : false;
    const time = main.time ? main.time * 1000 : 4000;

    // ? Create snackbar
    const snackbar = document.createElement('div');
    snackbar.id = `${main.id}-snackbar`;
    snackbar.className = 'mdc-snackbar mdc-snackbar--leading mdc-snackbar--open snackbar--invis';
    snackbar.innerHTML = `
                        <div class="mdc-snackbar__surface snack-flex" id="${main.id}-surface" progress="${hasprogress}">
                            <div class="snack-content">
                                <div class="mdc-snackbar__label" role="status" aria-live="polite" id="${main.id}-snackbar-title">${main.name}</div>
                                <div class="mdc-snackbar__actions" id="${main.id}-snack-actions"></div>
                            </div>
                        </div>
                        `;
    document.getElementById('snackbar-container').appendChild(snackbar);

    //Add progress
    if (hasprogress) {
        const progress = snackbarData.progress[0];
        const progressbar = document.createElement('div');
        progressbar.setAttribute('role', 'progressbar');
        progressbar.className = 'mdc-linear-progress';
        progressbar.innerHTML = `
                            <div class="mdc-linear-progress__buffering-dots"></div>
                            <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75)"></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" id="${progress.id}"><span class="mdc-linear-progress__bar-inner"></span></div>
                            <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
                            `;
        document.getElementById(`${main.id}-surface`).prepend(progressbar);
    }

    //Make buttons in action menu
    if (!!snackbarData.actions) {
        snackbarData.actions.forEach((action) => {
            const actionButton = document.createElement('button');
            actionButton.className = 'mdc-button mdc-snackbar__action';
            actionButton.setAttribute('onclick', `${action.action}`);
            actionButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
            actionButton.innerHTML = `
                        <div class="mdc-button__ripple"></div>
                        <div class="mdc-button__label" id="${action.id}">${action.name}</div>
                        `;
            document.getElementById(`${main.id}-snack-actions`).appendChild(actionButton);
        });
    }

    window.mdc.autoInit();

    // ? Show snackbar
    document.getElementById(`${main.id}-snackbar`).classList.remove('snackbar--invis');

    // ? Hide it after x seconds
    setTimeout(() => vapor.ui.snackbar.close(main.id), time);
};

//Close snackbar / cancel download
exports.close = (name, alert = false, message) => {
    //Ask for confirm if confirm = true
    if (alert) if (!confirm(message)) return confirmed;
    //Remove snackbar
    if (document.getElementById(`${name}-snackbar`)) {
        document.getElementById(`${name}-snackbar`).remove();
    } else {
        console.log(`Snackbar: ${name}-snackbar doesn't exist`);
    }

    return true;
};
