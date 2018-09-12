/**
 * Go to introduction page when the screen is clicked
 */
function goToReplay() {
    window.open("replay.html", "_self");
}

(function () {
    // Setting the listeners
    document.addEventListener("click", goToReplay);
}());

/**
 * Set the font of the text
 * Read the data and messages from the JSON files and store it
 */
$(document).ready(function () {
    // Set the size of the elements according to the screen size
    setScale();
});


/**
 * Set the scale of the elements dynamically
 */
function setScale() {
    let width = $(window).width();
    if (width > 1440) {
        let aux = width - 1440;
        aux = 1 + (aux / 5000);
        $('html, body').css("zoom", aux);
    }
}