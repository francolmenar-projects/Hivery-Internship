const json_path = "../json/msg.json"; // Path to the JSON file

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
 * Sets the font size and the text
 */
$(document).ready(function () {
    setFont();
    setText();
});

/**
 * Set the font of the text dynamically
 */
function setFont() {
    let width = $(window).width();
    let aux_width = width / 480;
    let font_size = aux_width * 1.4;
    if (width < 1500) {
        font_size = aux_width * 1.5;
    }
    // Size of the text box
    $("#guide_box").css("font-size", font_size + "em");
    let butt_w = $("#guide_ready_button").css("width");
    let button_font = parseInt(butt_w) / 3.55;
    // Size of the button
    $("#ready_button").css("font-size", button_font + "px");
    // Resize
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
}

/**
 * Reads the text from the JSON file and loads it to the Screen
 */
function setText() {
    let element_arr;
    // Check if we have already read the JSON
    if (localStorage.getItem("json_msg") !== null) {
        element_arr = JSON.parse(localStorage.getItem("json_msg"));
        setTextAux(element_arr)
    }
    // Read from the file
    else {
        $.getJSON(json_path, function (json) {
            // Convert the JSON into an array
            element_arr = $.map(json, function (el) {
                return el
            });
            setTextAux(element_arr);
        });
    }
}

/**
 * Sets the msg from the JSON to the elements
 * @param element_arr
 */
function setTextAux(element_arr) {
    // Guide header
    document.getElementById("guide_header").innerHTML = element_arr[3];
    // Guide text 1
    document.getElementById("text1").innerHTML = element_arr[4];
    // Guide text 2
    document.getElementById("text2").innerHTML = element_arr[5];
    // Guide button
    document.getElementById("ready_button").innerHTML = element_arr[6];
}
