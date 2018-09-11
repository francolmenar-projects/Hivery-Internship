const json_path = "../json/msg.json"; // Path to the JSON file

/**
 * Go to the Guide page when the button play is clicked
 */
function goToGuide() {
    let err = window.open("../pages/guide.html", "_self");
    if (err === null) {
        console.log("[Error]: window.open() in goToGuide()")
    }
    return err;
}

(function () {
    // Setting the listeners
    let intro_but = document.getElementById("introduction_play_button");
    if (intro_but !== null) {
        intro_but.addEventListener("click", goToGuide);
    }
    else {
        console.log("[Error]: 'introduction_play_button' does not exist");
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
    // Introduction Text
    let width = $(window).width();
    width = width / 480;
    let font_size = width * 1.5;
    $("#initial_text_box").css("font-size", font_size + "em");
    // Resizing the window
    $(window).resize(function () {
        // Introduction Text
        let width = $(window).width();
        let aux_width = width / 480;
        let font_size = aux_width * 1.5;
        $("#initial_text_box").css("font-size", font_size + "em");
        // Introduction Button
        let button_size = width / 960;
        $("#introduction_play_button").css("transform", "escale(" + button_size + ")");
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
    // Introduction header
    document.getElementById("header").innerHTML = element_arr[0];
    // Introduction text
    document.getElementById("intro_text").innerHTML = element_arr[1];
    // Introduction button
    document.getElementById("play_text").innerHTML = element_arr[2];
}