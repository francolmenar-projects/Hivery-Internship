/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow() {
    let err = window.open("../pages/game.html", "_self");
    if (err === null) {
        console.log("[Error]: window.open() in goToGameWindow()")
    }
    return err;
}

(function () {
    // Setting the listeners
    let ready = document.getElementById("guide_ready_button");
    if (ready) {
        ready.addEventListener("click", goToGameWindow);
    }
    else {
        console.log("[Error]: 'guide_ready_button' does not exist");
    }
}());

/**
 * Sets the font size relative to the width of the screen
 */
$(document).ready(function () {
    let width = $(window).width();
    let aux_width = width / 480;
    let font_size = aux_width * 1.4;
    if (width < 1500) {
        font_size = aux_width * 1.5;
    }
    // Size od the text box
    $("#guide_box").css("font-size", font_size + "em");
    let butt_w = $("#guide_ready_button").css("width");
    let button_font = parseInt(butt_w) / 3.55;
    // Size of the button
    $("#ready_button").css("font-size", button_font + "px");


    $(window).resize(function () {
        let width = $(window).width();
        let aux_width = width / 480;
        let font_size = aux_width * 1.4;
        if (width < 1500) {
            font_size = aux_width * 1.5;
        }
        // Size of the text box
        $("#guide_box").css("font-size", font_size + "em");
        let button_size = width / 960;
        let ready_but = $("#guide_ready_button");
        // Resize the button
        ready_but.css("transform", "escale(" + button_size + ")");
        let butt_w = ready_but.css("width");
        let button_font = parseInt(butt_w) / 3.55;
        // Size of the button text
        $("#ready_button").css("font-size", button_font + "px");
    });
});