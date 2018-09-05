const json_path = "../json/msg.json"; // Path to the JSON file

let lost = []; // Lost messages
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
    difference = difference - revenue;
    let revenue_aux = parseInt(revenue).toFixed(3);
    // You loose
    if (difference !== 0) {
        document.getElementById("replay_text").innerHTML = lost[0] + revenue_aux + lost[1] + parseInt(difference).toFixed(3) + lost[2];
    }
    // You win
    else {
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
    setFont();
    $.getJSON(json_path, function (json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function (el) {
            return el
        });
        // Lost messages
        lost = $.map(element_arr[0], function (el) {
            return el
        });
        // Winning messages
        max_drinks = element_arr[1];
        // Set the profit
        setActualProfit();
    });

});

// Set the font size of the texts
function setFont() {
    let width = $(window).width();
    // Size of the Replay text
    let replay_font = width / 320;
    if (width < 1500) {
        replay_font = width / 320;
    }
    $(".replay_text_box").css("font-size", replay_font + "em");
}
