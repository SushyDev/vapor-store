exports.updateGridLayout = () => {
    //Updates masonry layout
    function setLayout() {
        //Don't format home page
        if (sessionStorage.getItem('page') == 'Home') return;
        try {
            let grid = new Minigrid({
                container: '.cards',
                item: '.mdc-card',
                gutter: 24,
            });
            grid.mount();
        } catch (e) {
            return;
        }
    }

    //On resize update masonry layout
    const resizeObserver = new ResizeObserver(() => setLayout());
    resizeObserver.observe($('.cards')[0]);
};

const progressBar = () => document.getElementById('MDCTopAppBar-MDCLinearProgress');
exports.showProgressBar = () => (progressBar().style.display = 'block');

exports.hideProgressBar = () => (progressBar().style.display = 'none');

exports.snackbar = require('./notifications/snackbar');
exports.dialog = require('./notifications/dialog');
