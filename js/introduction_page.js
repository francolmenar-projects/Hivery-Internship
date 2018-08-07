/**
 * Go to the Guide page when the button play is clicked
 */
function goToGuide(){
    window.open("../pages/guide.html", "_self");
}

(function() {
    // Setting the listeners
    document.getElementById("introduction_play_button").addEventListener("click", goToGuide);
    }())