//If darkmode was on last time keep it on
function switchTheme() {
    if (localStorage.getItem("darkmode") == "false") {
        localStorage.setItem("darkmode", true)
    } else {
        localStorage.setItem("darkmode", false)
    }
    checkTheme()

}
checkTheme()