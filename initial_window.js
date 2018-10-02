const json_path = "json/msg.json"; // Path to the JSON file
/******* Prefixes *******/
const img_prefix = "./img/"; // Path to the Image folder
const js_prefix = "./js/"; // Path to the JS folder
const html_prefix = "./pages/"; // Path to the HTML folder
const font_prefix = "./css/font/"; // Path to the Font folder
/******* Files *******/
const board = "welcomeBoard.png"; // Board of the Introduction Window
const background = "generic_background.png"; // Background of Introduction Window
const button = "gameButton.png"; // Button
const js_file = "introduction_page.js"; // Introduction JS
const html_file = "introduction.html"; // HTML of Introduction
const font1 = "Andale Mono.ttf"; // Fonts
const font2 = "ConcertOne-Regular.ttf";

/**
 * Go to introduction page when the screen is clicked
 */
function goToIntroduction() {
    let err = window.open("pages/introduction.html", "_self");
    if (err === null) {
        console.log("[Error]: window.open() in goToIntroduction()");
    }
    return err;
}

(function () {
    // Setting the listeners
    document.addEventListener("click", goToIntroduction);
}());

/**
 * Read the JSON and stores it
 */
$(document).ready(function () {
    $.getJSON(json_path, function (json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function (el) {
            return el;
        });
        // Save the JSON data for the messages
        localStorage.setItem("json_msg", JSON.stringify(element_arr));
    })
});

/**
 * Cache files
 */
$(window).on('load', function () {
    // Get images of guide
    $.ajax({
        type: "GET",
        url: img_prefix + board
    });
    $.ajax({
        type: "GET",
        url: img_prefix + background
    });
    $.ajax({
        type: "GET",
        url: img_prefix + button
    });
    // Get JS of Guide
    $.ajax({
        type: "GET",
        dataType: "text",
        url: js_prefix + js_file
    });
    // Get HTML of Guide
    $.ajax({
        type: "GET",
        dataType: "html",
        url: html_prefix + html_file
    });
    // Get the fonts
    $.ajax({
        type: "GET",
        dataType: "text",
        url: font_prefix + font1
    });
    $.ajax({
        type: "GET",
        dataType: "text",
        url: font_prefix + font2
    });
});

