/**
 * Go to introduction page when the screen is clicked
 */
function goToReplay(){
    window.open("replay.html", "_self");
}

(function() {
    // Setting the listeners
    document.addEventListener("click", goToReplay);
    var name = window.localStorage.getItem("revenue");
    console.log(name)
    }());