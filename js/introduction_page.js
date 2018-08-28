/**
 * Go to the Guide page when the button play is clicked
 */
function goToGuide(){
    let err = window.open("../pages/guide.html", "_self");
    if(err === null){
        console.log("[Error]: window.open() in goToGuide()")
    }
    return err;
}
module.exports.goToGuide = goToGuide;

(function() {
    // Setting the listeners
    if(document.getElementById("introduction_play_button") !== null){
            document.getElementById("introduction_play_button").addEventListener("click", goToGuide);
    }
    else{
        console.log("[Error]: 'introduction_play_button' does not exist");
    }
    }());