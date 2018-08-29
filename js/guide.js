/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow(){
    let err = window.open("../pages/game.html", "_self");
    if(err === null){
        console.log("[Error]: window.open() in goToGameWindow()")
    }
    return err;
}

(function() {
    // Setting the listeners
    let ready = document.getElementById("guide_ready_button");
    if(ready){
        ready.addEventListener("click", goToGameWindow);
    }
    else{
        console.log("[Error]: 'guide_ready_button' does not exist");
    }
    }());