const json_path = "../json/msg.json"; // Path to the JSON file
/******* Prefixes *******/
const img_prefix = "../img/"; // Path to the Image folder
const js_prefix = "../js/"; // Path to the JS folder
/******* Files *******/
const sprite_file = "guide_sprite.png"; // Sprite with the images of Guide
const js_file = "guide.js"; // Guide JS

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
        return null;
    }
}());

/**
 * Sets the font size and the text
 */
$(document).ready(function () {
    setScale();
    setText();
});

/**
 * Set the scale of the elements dynamically
 */
function setScale() {
    let width = $(window).width();
    if (width > 1440) {
        let aux = width - 1440;
        aux = 1 + (aux / 5000);
        $('html, body').css("zoom", aux);
    }
    else if (width < 1440) {
        let aux = 1440 - width;
        aux = 1 - (aux / 5000);
        $('html, body').css("zoom", aux);
    }
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

/**
 * Cache files
 */
$(window).on('load', function () {
    // Get images of guide
    $.ajax({
        cache:true,
        type: "GET",
        url: img_prefix + sprite_file,
        async: true,
    });
    // Get JS of Guide
    $.ajax({
        cache:true,
        type: "GET",
        dataType: "text",
        url: js_prefix + js_file,
        async: true,
    });
});

try {
    module.exports.goToGuide =  goToGuide;
    module.exports.setText =  setText;
    module.exports.setTextAux =  setTextAux;
} catch (e) {
    if (e instanceof ReferenceError) {
    }
}