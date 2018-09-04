/**
 * Go to introduction page when the screen is clicked
 */
function goToIntroduction() {
    let err = window.open("pages/introduction.html", "_self");
    if (err === null) {
        console.log("[Error]: window.open() in goToIntroduction()")
    }
    return err;
}

(function () {
    // Setting the listeners
    document.addEventListener("click", goToIntroduction);
}());
