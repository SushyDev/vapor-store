function selectDownload(elem) {
    var container = elem.closest('.downloader-list-item');

    try {
        document.querySelector('.active').classList.remove('active');
    } catch (e) {}

    container.classList.add('active');

    document.getElementById('game-info-content').style.display = 'initial';
}

function removeItem(gameTitle, type) {
    try {
        document.getElementById(`${gameTitle}-${type}-item`).remove();
    } catch (e) {}
}

fetchingDownload.forEach((game) => {
    console.log(game);
    createFetchingItem(game);
});
