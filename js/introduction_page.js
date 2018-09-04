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

(function() {
    // $("#initial_text_box").css("font-size", "9em");
    // Setting the listeners
    if(document.getElementById("introduction_play_button") !== null){
            document.getElementById("introduction_play_button").addEventListener("click", goToGuide);
    }
    else{
        console.log("[Error]: 'introduction_play_button' does not exist");
    }

    }());

/**
 * Sets the font size relative to the width of the screen
 */
$(document).ready(function() {
    let width = $(window).width();
    width = width / 480;
    let font_size = width * 1.5;
    $("#initial_text_box").css("font-size", font_size + "em");

    $(window).resize(function() {
        let width = $(window).width();
        let aux_width = width / 480;
        let font_size = aux_width * 1.5;
        $("#initial_text_box").css("font-size", font_size + "em");
        let button_size = width / 960;
        $("#introduction_play_button").css("transform", "escale(" + button_size +  ")");

	});
});