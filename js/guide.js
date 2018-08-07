/**
 * Go to the Guide page when the button play is clicked
 */
function goToGameWindow(){
    window.open("../pages/game.html", "_self");
}

(function() {
    // Setting the listeners
    document.getElementById("guide_ready_button").addEventListener("click", goToGameWindow);
    }())