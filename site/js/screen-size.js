exports.lockSize = (query) => {
    const elem = document.querySelector(query);
    const vh = window.innerHeight * 0.01;
    elem.style.setProperty('--vh', `${vh}px`);
};
