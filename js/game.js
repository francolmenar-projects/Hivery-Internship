/**************************** UPPER COUNTERS ****************************/
const countdown = 1140; // Time countdown in seconds
var actual_profit_user = 0.000; // Profit counter
/**************************** MESSAGES ****************************/
const hurryUp ="Hurry up!! You only have 30 seconds left.";
const oneMin ="One minute left. Do you really think that you can bet me?.";
const initialMsg = "I'm Haoui. Are you trying to bet me? Good luck!!";
/**************************** IMAGES ****************************/
const img_prefix = "../img/"; // Offset to the image folder
const empty_path ="../img/coke-bottle.png"; // Global path to the empty drink
const empty_drink = "coke-bottle.png"; // Name of the empty drink
const drinks_name = ["markSoda.png", "markCola.png", "markTropics.png"]; // Name of the images of the drinks
/**************************** VENDING MACHINE ****************************/
const max_drinks = 2; // We start to count from 0
var actual_drink = 0; // Drink id of the selected one
const max_machine = 12; // Maximum capacity of the vending machine
var selected_drinks = 0; // Actual amount of drinks in the vending machine
/***+++++++++++++++++++++** STATS ***+++++++++++++++++++++**/
const json_path = "../json/data.json"; // Path to the JSON file
const drink_order = ["SODA", "COLA", "TROPICS", "ENERGETIC", "JUICE"]; // Order of the drinks inside the data array
const drink_attr = ["PRICE","CAPACITY",  "UNITS PER DAY", "UNITS STOCKED", "DAYS TILL SOLDOUT"]; // Order of the attributes inside the data array
var drink_data = [[],[],[],[],[]]; // Data stored in a JSON

/************************************** USER INTERFACE  **************************************/

/**
 * Go to the Guide page when the button play is clicked
 */
function goToGameOver(){
    window.open("gameOver.html", "_self");
}

/**
 * Go to the Replay page when the button SUBMIT is clicked
 */
function goToReplay(){
    window.open("replay.html", "_self");
}

/**
 * Check the number of drinks in the vending machine
 * If it is full it shows the submit button
 * If it was full, it hides the show button
 */
function checkSubmit() {
    let down_button = document.getElementById("down_button");
    if((selected_drinks === max_machine) && ($(down_button).css('display') === 'none')){
        $(down_button).fadeIn("slow");
    }
    else if((selected_drinks === (max_machine - 1)) && ($(down_button).css('display') !== 'none')){
        $(down_button).fadeOut("slow");
    }
}

/**
 * Creates the timer of the game
 */
function createTimer(){
    // Set the default countdown time
    let time_left = countdown;
    let min, second, new_time;
    // This code is executed each second
    setInterval(function () {
        new_time = "";
        second = time_left % 60;
        min = parseInt(time_left / 60);
        // Check if there is any digit in the minutes
        if(min > 0){
            // Check how many digits the minutes has
            if(min >= 10){
                new_time = min.toString() + ":";
            }
            // If the minutes has only one digit we add a "0" to the left side of it
            else{
                new_time = "0" + min.toString() + ":";
            }
        }
        // There are no minutes left, so we add another "0" to the minutes
        else{
            new_time = min.toString() + "0:";
        }
        // Check if there are two digits in the seconds
        if(second >= 10){
            new_time += second.toString();
        }
        // There is only one digit in the second side, so we add a "0" to the left side
        else{
            new_time += "0" + second.toString();
        }
        // Get the HTML of the time and assign to it the new value of the timer
        document.getElementById("timer").innerHTML = new_time;
        // Update the timer value for the next iteration
        time_left--;
        // If there is no time left the time is over
        if(time_left < 0){
            goToGameOver();
        }
        else if(time_left === 60){
            showAdvice(oneMin);
        }
        else if(time_left === 53){
            hideAdvice();
        }
        else if(time_left === 30){
            showAdvice(hurryUp);
        }
        else if(time_left === 23){
            hideAdvice();
        }
    }, 1000)
}

/**
 * It sets the actual value of the actual profit to the screen
 */
function setActualProfit() {
    document.getElementById("actual_profit").innerHTML = actual_profit_user.toFixed(3).toString();
}

/**
 * Change the drink displayed in the selector
 */
function changeDrink() {
    document.getElementById("selected_drink").src = img_prefix + drinks_name[actual_drink];
}

/**
 * Change the selected drink in the vending machine
 */
function selectDrink() {
    let img_path,img_selected,selected_img_arr,selected_img;
    // New image to set
    img_path = drinks_name[actual_drink];
    // Image clicked
    img_selected = document.getElementById(this.id);
    // Array with the src of the clicked img
    selected_img_arr = img_selected.src.split("/");
    // The name of the drink selected
    selected_img = selected_img_arr[selected_img_arr.length - 1];
    // Check if we have to set to empty the clicked position
    if(selected_img !== img_path){
        // Set the new drink
        img_selected.src = img_prefix + img_path;
        // Replace an empty drink
        if(selected_img === empty_drink){
            selected_drinks++;
        }
    }
    else{
        // Set the empty drink
        img_selected.src = empty_path;
        selected_drinks--;
    }
    updateMoney(selected_img, img_path);
    checkSubmit();
}

/**
 * Update the data associated to the revenue and the cost
 */
function updateMoney(clicked_img, actual_img) {
    // Check if we have to set to empty the clicked position
    if(clicked_img !== actual_img){
        // Replace an empty drink
        if(clicked_img === empty_drink){

        }
        // Replace another drink
        else{

        }
    }
    // Set the empty drink so we have to subtract the actual one
    else{

    }
}

/**
 * It sets the previous drink in the selector
 */
function previousDrink() {
    // Calculates the previous position
    let prev = (actual_drink - 1);
    // Check that it is not out of bounds
    if(prev < 0){
        prev = max_drinks;
    }
    // Assign the new value to the global variable
    actual_drink = prev;
    changeDrink();
    // Load the data of the new drink
    loadSelected();
}

/**
 * It sets the next drink in the selector
 */
function nextDrink() {
    // Calculates the next position
    let next = (actual_drink + 1);
    // Check that it is not out of bounds
    if(next > max_drinks){
        next = 0;
    }
    // Assign the new value to the global variable
    actual_drink = next;
    changeDrink();
    // Load the data of the new drink
    loadSelected();
}

/**
 * Shows the advice
 */
function showAdvice(str) {
    let advice = document.getElementById("adviceDiv");
    // Check if we have a text as an input
    if(str !== ""){
        document.getElementById("adviceText").innerText = str;
    }
    $(advice).fadeIn("slow");
}

/**
 * Hide the advice
 */
function hideAdvice() {
    let advice = document.getElementById("adviceDiv");
    $(advice).fadeOut("slow");
}

(function() {
    // Create the timer
    createTimer();
    // Set the profit
    setActualProfit();
    // Setting the listeners
    document.getElementById("moneyCounterDiv").addEventListener("click", goToGameOver); // ONLY FOR TESTING
    document.getElementById("timer_counter").addEventListener("click", showAdvice); // ONLY FOR TESTING

    document.getElementById("down_button").addEventListener("click", goToReplay);
    document.getElementById("arrow_left").addEventListener("click", previousDrink);
    document.getElementById("arrow_right").addEventListener("click", nextDrink);

    // Get all the images of the vending machine
    let allImages = document.getElementById("drinks_machine").getElementsByTagName('img');
    for(let i = 0; i < allImages.length ; i++) {
        allImages[i].addEventListener("click", selectDrink);
    }
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
        // Copy all the data from the JSON to the global variable
        for(let i = 0; i < element_arr.length; i++){
            drink_data[i][0] = element_arr[i].price;
            drink_data[i][1] = element_arr[i].capacity;
            drink_data[i][2] = element_arr[i].upd;
        }
        loadStats();
    });
});

/**
 * Load the stats to the HTML
 */
function loadStats() {
    // Load the drinks' name
    for(let i = 0; i < drink_order.length; i++){
        document.getElementById("name" + i).innerText = drink_order[i];
    }
    // Load the categories' name
    for(let i = 0; i < drink_attr.length; i++){
        document.getElementById("category" + i).innerText = drink_attr[i];
    }
    // Load the stats of each drink
    for(let i = 0; i < drink_data.length; i++){
        document.getElementById("price" + i).innerText = "$" + drink_data[i][0];
        document.getElementById("capacity" + i).innerText = drink_data[i][1];
        document.getElementById("upd" + i).innerText = drink_data[i][2];
    }
    // Load the default selected drink data
    loadSelected();
}

/**
 * It loads the data of the selected drink
 */
function loadSelected() {
    document.getElementById("price_selected").innerText = "$" + drink_data[actual_drink][0];
    document.getElementById("units_selected").innerText = drink_data[actual_drink][2] + "u/d";
}