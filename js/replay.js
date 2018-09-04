let lost = ["You made $", " which is just $", " less than me. But I’m still the best!!!"];
let win = "That's amazing!!! Yoy made the same money as me, you have been lucky.";

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
    // You loose
    if (difference !== 0) {
        document.getElementById("replay_text").innerHTML = lost[0] + revenue + lost[1] + difference + lost[2];
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
    // Set the profit
    setActualProfit();
}());

$(document).ready(function () {
    setFont();
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
