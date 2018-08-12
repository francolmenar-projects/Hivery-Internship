/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow(){
    window.open("../pages/game.html", "_self");
}

(function() {
    // Setting the listeners
    document.getElementById("replay_button").addEventListener("click", goToGameWindow);
    }())