/**************************** MESSAGES ****************************/
var replay_msg;
/**************************** IMAGES ****************************/
let config_options; // The number of configuration options in the JSON
const img_prefix = "../img/products/"; // Offset to the image folder
const empty_drink = "coke-bottle.png"; // Name of the empty drink
const drinks_name = ["markSoda.png", "markCola.png", "markTropics.png", "cherry_can.png", "cola_can.png"]; // Name of the images of the drinks
/**************************** VENDING MACHINE ****************************/
// const max_drinks = 4; // We start to count from 0
let max_drinks; // We start to count from 0
let actual_drink = 0; // Drink id of the selected one
/***+++++++++++++++++++++** STATS ***+++++++++++++++++++++**/
const json_path = "../json/data.json"; // Path to the JSON file
const msg_path = "../json/msg.json"; // Path to the JSON file with msg
const drink_order = ["SODA", "COLA", "TROPICS", "CHERRY", "COLA CAN"]; // Order of the drinks inside the data array
const drink_attr = ["PRICE", "CAPACITY", "UNITS PER DAY", "UNITS STOCKED", "DAYS TILL SOLDOUT"]; // Order of the attributes inside the data array
let drink_data = [[], [], [], [], []]; // Data stored in a JSON
let valid = [];

/************************************** USER INTERFACE  **************************************/

/**
 * It sets the actual value of the Cost per Year
 */
function setOptCost() {
    let opt_cost = window.localStorage.getItem("opt_cost");
    let actual_cost = document.getElementById("cost_stats");
    if (actual_cost) {
        actual_cost.innerHTML = "$" + opt_cost;
    }
    else {
        console.log("[Error]: element 'cost_stats' does not exist in setActualCost()");
    }
}

/**
 * It sets the actual value of the Revenue per Year
 */
function setOptRevenue() {
    let opt_revenue = window.localStorage.getItem("opt_revenue");
    let revenue = document.getElementById("revenue_stats");
    if (revenue) {
        revenue.innerHTML = "$" + opt_revenue;
    }
    else {
        console.log("[Error]: element 'revenue_stats' does not exist in setActualProfit()");
    }
}

/**
 * Display the optimum arrange of the drinks
 * @param opt: Array with the positions of the drinks
 */
function displayOptimum(opt) {
    // Get the array of the elements
    opt = opt.split(',').map(Number);
    let pos = 0;
    // Set all the drinks in the correct position
    for (let i = 0; i <= max_drinks; i++) {
        for (let j = 0; j < opt[i]; j++) {
            let x = pos % 4;
            let y = Math.floor(pos / 4);
            let drink_name = "drink_" + x + "_" + y;
            let drink = document.getElementById(drink_name);
            drink.src = img_prefix + drinks_name[i];
            pos++;
        }
    }
}

/**
 * Creates the timer of the game
 */
function createInternalTimer() {
    // Set the default countdown time
    let time = 20;
    // This code is executed each second
    setInterval(function () {
        // If there is no time left the time is over
        if (time === 18) {
            showAdvice(replay_msg);
        }
        else if (time === 6) {
            hideAdvice();
        }
        time--;
    }, 1000)
}

/**
 * Shows the advice
 */
function showAdvice(str) {
    let advice = document.getElementById("adviceDiv");
    if (advice) {
        // Check if we have a text as an input
        if (str !== "") {
            let adviceText = document.getElementById("adviceText");
            if (adviceText) {
                adviceText.innerText = str;
            }
            else {
                console.log("[Error]: element 'adviceText' does not exist in showAdvice()");
            }
        }
        $(advice).fadeIn("slow");
    }
    else {
        console.log("[Error]: element 'adviceDiv' does not exist in showAdvice()");
    }
}

/**
 * Hide the advice
 */
function hideAdvice() {
    let advice = document.getElementById("adviceDiv");
    if (advice) {
        $(advice).fadeOut("slow");
    }
    else {
        console.log("[Error]: element 'adviceDiv' does not exist in hideAdvice()");
    }
}

/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow() {
    window.open("../pages/game.html", "_self");
}

(function () {
    setOptCost();
    setOptRevenue();
    /**
     * Go to the Game page when the button play is clicked
     */
    document.getElementById("replay_button").addEventListener("click", goToGameWindow);
    createInternalTimer();
}());

/************************************** STAT DATA  **************************************/

/**
 * Read the data from the JSON file and store it
 */
$(document).ready(function () {
    // Set the size of the elements according to the screen size
    setScale();
    // Get the data.JSON
    setData();
    // Get the messages
    setText();
});

/**
 * Set the Data from the JSON
 */
function setData() {
    $.getJSON(json_path, function (json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function (el) {
            return el
        });

        config_options = Number(element_arr[0]);
        max_drinks = element_arr[1];
        // Copy all the data from the JSON to the global variable
        for (let i = config_options; i < element_arr.length; i++) {
            if (areValid([element_arr[i].price, element_arr[i].capacity, element_arr[i].upd]) === -1) {
                console.log(("[Error] input data for " + drink_order[i] + " is invalid"));
                let aux = i - config_options;
                valid[aux] = -1;
                drink_data[aux][0] = "-";
                drink_data[aux][1] = "-";
                drink_data[aux][2] = "-";
            }
            else {
                let aux = i - config_options;
                valid[aux] = 0;
                drink_data[aux][0] = element_arr[i].price;
                drink_data[aux][1] = element_arr[i].capacity;
                drink_data[aux][2] = element_arr[i].upd;
            }
        }
        loadStats();
        actual_drink = -1;
        loadEmpty();
        displayOptimum(element_arr[2]);
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
        $.getJSON(msg_path, function (json) {
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
    // Header of the selected drink
    document.getElementById("selected_h").innerHTML = element_arr[10];
    // Replay button
    document.getElementById("replay_but").innerHTML = element_arr[18];
    // Stats header
    document.getElementById("stats_h").innerHTML = element_arr[12];
    // Revenue header
    document.getElementById("revenue_h").innerHTML = element_arr[13];
    // Revenue initial value
    document.getElementById("revenue_stats").innerHTML = element_arr[14];
    // Cost header
    document.getElementById("cost_h").innerHTML = element_arr[15];
    // Cost initial value
    document.getElementById("cost_stats").innerHTML = element_arr[16];
    // Pop up message
    replay_msg = element_arr[23];
    // Replay button
    document.getElementById("replay_but").innerHTML = element_arr[18];
    // Lost messages
    lost = $.map(element_arr[20], function (el) {
        return el
    });
    // Winning messages
    win = element_arr[21];
    // Winning header
    win_h = element_arr[22];
}

/**
 * Check if the given array of drink data is valid
 * @param arr: the data to be checked
 * @return {number}: -1 if the data is not valid and 0 otherwise
 */
function areValid(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
            return -1;
        }
        else if (Number(arr[i] <= 0)) {
            return -1;
        }
    }
    return 0;
}

/**
 * Load the stats to the HTML
 */
function loadStats() {
    // Load the drinks' name
    for (let i = 0; i < drink_order.length; i++) {
        if (valid[i] === 0) {
            change_text_of_elem("name" + i, drink_order[i], "loadStats");
        }
    }
    // Load the categories' name
    for (let i = 0; i < drink_attr.length; i++) {
        change_text_of_elem("category" + i, drink_attr[i], "loadStats");
    }
    // Load the stats of each drink
    for (let i = 0; i < drink_data.length; i++) {
        if (valid[i] === 0) {
            change_text_of_elem("price" + i, drink_data[i][0], "loadStats");
            change_text_of_elem("capacity" + i, drink_data[i][1], "loadStats");
            change_text_of_elem("upd" + i, drink_data[i][2], "loadStats");
            drink_data[i][3] = 0;
            change_text_of_elem("unit_stocked" + i, drink_data[i][3], "loadStats");
            drink_data[i][4] = "-";
            change_text_of_elem("days_souldout" + i, drink_data[i][4], "loadStats");
        }
    }
}

/**
 * It loads the empty drink
 */
function loadEmpty() {
    let selected_drink = document.getElementById("selected_drink");
    if (selected_drink) {
        selected_drink.src = img_prefix + empty_drink;
    }
    else {
        console.log("[Error]: element 'selected_drink' does not exist in changeDrink()");
    }
}

/**
 * Changes the inner text of an element checking for errors
 *
 * @param name: name of the element to be changed
 * @param data: data to be set to the element
 * @param f_name: name of the caller function
 * @return {number}: -1 in case of an error and 0 otherwise
 */
function change_text_of_elem(name, data, f_name) {
    let elem = document.getElementById(name);
    if (elem) {
        elem.innerText = data;
        return 0;
    }
    else {
        console.log("[Error]: element '" + name + "' does not exist in " + f_name + "() ");
        return -1;
    }
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