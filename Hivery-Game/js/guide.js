const json_path = "../json/msg.json"; // Path to the JSON file
/******* Prefixes *******/
const img_prefix = "../img/"; // Path to the Image folder
const js_prefix = "../js/"; // Path to the JS folder
const css_prefix = "../css/"; // Path to the JS folder
/******* Files *******/
const sprite_file = "game_sprite.png"; // Sprite with the images of Game
const default_drink = "products/markSoda.png";
const empty_drink = "products/coke-bottle.png"; // Name of the empty drink
const js_file = "game.js"; // Game JS
const css_file1 = "materialize.css"; // Materialize CSS
const css_file2 = "style.css"; // Style CSS

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
 * Sets the size and the text
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
    // Guide header
    document.getElementById("guide_header").innerHTML = element_arr[3];
    // Guide text 1
    document.getElementById("text1").innerHTML = element_arr[4];
    // Guide text 2
    document.getElementById("text2").innerHTML = element_arr[5];
    // Guide button
    document.getElementById("ready_button").innerHTML = element_arr[6];
}

/**
 * Cache files
 */
$(window).on('load', function () {
    // Get Images of Game
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        url: img_prefix + sprite_file,
    });
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        url: img_prefix + empty_drink,
    });
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        url: img_prefix + default_drink,
    });
    // Get JS of Game
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        dataType: "text",
        url: js_prefix + js_file
    });
    // Get CSS of Game
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        dataType: "text",
        url: css_prefix + css_file1
    });
    $.ajax({
        cache:true,
        async: true,
        type: "GET",
        dataType: "text",
        url: css_prefix + css_file2
    });
});
