const json_path = "../json/msg.json"; // Path to the JSON file
const js_prefix = "../js/"; // Path to the JS folder
const js_file = "optimal.js"; // replay JS

let lost_h; // Lost header
let lost = []; // Lost messages
let win_h; // Winning header
let win; // Winning messages

/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow() {
    window.open("../pages/game.html", "_self");
}

/**
 * Sets the profit made by the user
 */
function setActualProfit() {
    let revenue = window.localStorage.getItem("revenue");
    let opt_revenue = window.localStorage.getItem("opt_revenue");
    let opt_cost = window.localStorage.getItem("opt_cost");

    let difference = Number(opt_revenue) - Number(opt_cost);
    let difference_aux = difference - revenue;
    let revenue_aux = parseInt(revenue).toFixed(0);
    // You loose
    if (difference_aux !== 0) {
        document.getElementById("replay_h").innerHTML = lost_h;
        document.getElementById("replay_text").innerHTML = lost[0] + revenue_aux + lost[1] + "<br/>" +
            lost[2] + parseInt(difference).toFixed(0) + lost[3] + "<br/>" +
            lost[4] + parseInt(difference_aux).toFixed(0) + lost[5] + "<br/><br/>" +
            lost[6];
    }
    // You win
    else {
        document.getElementById("replay_h").innerHTML = win_h;
        document.getElementById("replay_text").innerHTML = win;
        $("#best_machine").css("display", "none");
    }
}

/**
 * Go to the Optimal page
 */
function goToOptimal() {
    window.open("../pages/optimal.html", "_self");
}

(function () {
    // Setting the listeners
    document.getElementById("replay_button").addEventListener("click", goToGameWindow);
    document.getElementById("best_machine").addEventListener("click", goToOptimal);
}());

$(document).ready(function () {
    // Set the size of the elements according to the screen size
    setScale();
    // Get the messages
    setText();
});

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
    // Header of the replay message
    lost_h = element_arr[17];
    // Replay button
    document.getElementById("replay_but").innerHTML = element_arr[18];
    // Link to optimal
    document.getElementById("best_machine").innerHTML = element_arr[19];
    // Lost messages
    lost = $.map(element_arr[20], function (el) {
        return el
    });
    // Winning messages
    win = element_arr[21];
    // Winning header
    win_h = element_arr[22];
    // Set the profit
    setActualProfit();
}

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
 * Cache files
 */
$(window).on('load', function () {
    // Get JS of Optimal
    $.ajax({
        cache:true,
        type: "GET",
        dataType: "text",
        url: js_prefix + js_file,
        async: true,
    });
});
