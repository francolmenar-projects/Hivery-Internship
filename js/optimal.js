/**************************** IMAGES ****************************/
var config_options; // The number of configuration options in the JSON
const img_prefix = "../img/products/"; // Offset to the image folder
const empty_path ="../img/products/coke-bottle.png"; // Global path to the empty drink
const empty_drink = "coke-bottle.png"; // Name of the empty drink
const drinks_name = ["markSoda.png", "markCola.png", "markTropics.png", "cherry_can.png", "cola_can.png"]; // Name of the images of the drinks
/**************************** VENDING MACHINE ****************************/
// const max_drinks = 4; // We start to count from 0
var max_drinks; // We start to count from 0
var actual_drink = 0; // Drink id of the selected one
const max_machine = 12; // Maximum capacity of the vending machine
var selected_drinks = 0; // Actual amount of drinks in the vending machine
/***+++++++++++++++++++++** STATS ***+++++++++++++++++++++**/
const period_of_time = 365; // Time frame that we consider
const cost_per_refill = 35; // The cost for refilling the machine
const penalty_for_day_refill = 2; // Penalty apply when the vending machine has to be refilled every day
const json_path = "../json/data.json"; // Path to the JSON file
const drink_order = ["SODA", "COLA", "TROPICS", "CHERRY", "COLA CAN"]; // Order of the drinks inside the data array
const drink_attr = ["PRICE","CAPACITY",  "UNITS PER DAY", "UNITS STOCKED", "DAYS TILL SOLDOUT"]; // Order of the attributes inside the data array
var drink_data = [[],[],[],[],[]]; // Data stored in a JSON
var valid = [];

/************************************** USER INTERFACE  **************************************/

/**
 * Calculates the next valid drink to display
 */
function nextValidDrink() {
    for(let i = 0; i <= max_drinks; i++){
        let next = actual_drink + i + 1;
        if(next > max_drinks){
            next = (next - 1) % max_drinks;
        }
        if(valid[next] === 0){
            actual_drink = next;
            return ;
        }
    }
    console.log("[Error] There is no valid drink");
}

/**
 * Change the drink displayed in the selector
 */
function changeDrink() {
    let selected_drink = document.getElementById("selected_drink");
    if(selected_drink){
        selected_drink.src = img_prefix + drinks_name[actual_drink];
    }
    else {
        console.log("[Error]: element 'selected_drink' does not exist in changeDrink()");
    }
}

/**
 * It sets the actual value of the Cost per Year
 */
function setOptCost() {
    let opt_cost = window.localStorage.getItem("opt_cost");
    let actual_cost = document.getElementById("cost_stats");
    if(actual_cost){
        actual_cost.innerHTML = "$" + opt_cost;
    }
    else{
        console.log("[Error]: element 'cost_stats' does not exist in setActualCost()");
    }
}

/**
 * It sets the actual value of the Revenue per Year
 */
function setOptRevenue() {
    let opt_revenue = window.localStorage.getItem("opt_revenue");
    let revenue = document.getElementById("revenue_stats");
    if(revenue){
        revenue.innerHTML = "$" + opt_revenue;
    }
    else{
        console.log("[Error]: element 'revenue_stats' does not exist in setActualProfit()");
    }
}

/**
 * It sets the next drink in the selector
 */
function nextDrink() {
    // Calculates the next position
    nextValidDrink();
    changeDrink();
    // Load the data of the new drink
    loadSelected();
}

(function() {
    setOptCost();
    setOptRevenue();
    }());

/************************************** STAT DATA  **************************************/

/**
 * Read the data from the JSON file and store it
 */
$(document).ready(function() {
    $.getJSON(json_path, function(json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function(el) { return el });

        config_options = Number(element_arr[0]);
        max_drinks = element_arr[1];
        // Copy all the data from the JSON to the global variable
        for(let i = config_options; i < element_arr.length; i++){
            if (areValid([element_arr[i].price, element_arr[i].capacity, element_arr[i].upd]) === -1){
                console.log(("[Error] input data for " + drink_order[i] + " is invalid"));
                let aux = i - config_options;
                valid[aux] = -1;
                drink_data[aux][0] = "-";
                drink_data[aux][1] = "-";
                drink_data[aux][2] = "-";
            }
            else{
                let aux = i - config_options;
                valid[aux] = 0;
                drink_data[aux][0] = element_arr[i].price;
                drink_data[aux][1] = element_arr[i].capacity;
                drink_data[aux][2] = element_arr[i].upd;
            }
        }
        loadStats();
        actual_drink =- 1;
        nextDrink();
    });
});

/**
 * Check if the given array of drink data is valid
 * @param arr: the data to be checked
 * @return {number}: -1 if the data is not valid and 0 otherwise
 */
function areValid(arr) {
    for(let i = 0; i < arr.length; i++){
        if(isNaN(arr[i])){
            return -1;
        }
        else if(Number(arr[i] <= 0)){
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
    for(let i = 0; i < drink_order.length; i++){
        if(valid[i] === 0){
            change_text_of_elem("name" + i, drink_order[i], "loadStats");
        }
    }
    // Load the categories' name
    for(let i = 0; i < drink_attr.length; i++){
        change_text_of_elem("category" + i, drink_attr[i], "loadStats");
    }
    // Load the stats of each drink
    for(let i = 0; i < drink_data.length; i++){
        if(valid[i] === 0){
            change_text_of_elem("price" + i, drink_data[i][0], "loadStats");
            change_text_of_elem("capacity" + i, drink_data[i][1], "loadStats");
            change_text_of_elem("upd" + i, drink_data[i][2], "loadStats");
            drink_data[i][3] = 0;
            change_text_of_elem("unit_stocked" + i, drink_data[i][3], "loadStats");
            drink_data[i][4] = "-";
            change_text_of_elem("days_souldout" + i, drink_data[i][4], "loadStats");
        }
    }
    nextValidDrink();
    // Load the default selected drink data
    loadSelected();
}

/**
 * It loads the data of the selected drink
 */
function loadSelected() {
    change_text_of_elem("price_selected", "$" + drink_data[actual_drink][0], "loadSelected");
    change_text_of_elem("units_selected", drink_data[actual_drink][2] + "u/d", "loadSelected");
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
    if(elem){
        elem.innerText = data;
        return 0;
    }
    else{
        console.log("[Error]: element '"+ name + "' does not exist in "+ f_name + "() ");
        return -1;
    }
}