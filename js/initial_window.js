/**
 * Go to introduction page when the screen is clicked
 */
function goToIntroduction(){
    window.open("pages/introduction.html", "_self");
}

(function() {
    // Setting the listeners
    document.addEventListener("click", goToIntroduction);
    }())
