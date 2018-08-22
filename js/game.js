/**************************** UPPER COUNTERS ****************************/
const countdown = 1140; // Time countdown in seconds
var actual_profit_user = 0.000; // Profit counter
var actual_cost_user = 0.000; // Profit counter
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
const period_of_time = 365; // Time frame that we consider
const cost_per_refill = 35; // The cost for refilling the machine
const penalty_for_day_refill = 2; // Penalty apply when the vending machine has to be refilled every day
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
    document.getElementById("revenue_stats").innerHTML = "$" + actual_profit_user.toFixed(3).toString();
}

/**
 * It sets the actual value of the Units Stocked on the screen
 */
function setActualCapacity() {
    for(let i = 0; i < drink_order.length; i++){
        document.getElementById("unit_stocked" + i).innerHTML = drink_data[i][3];
    }
}
/**
 * It sets the actual value of the Days Till SoldOut on the screen
 */
function setActualSold() {
    for(let i = 0; i < drink_order.length; i++){
        document.getElementById("days_souldout" + i).innerHTML = drink_data[i][4];
    }
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
    let replacement_case = -1; // Used when we want to calculate the new data
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
        replacement_case = 0;
        img_selected.src = img_prefix + img_path;
        // Replace an empty drink
        if(selected_img === empty_drink){
            replacement_case = 1;
            selected_drinks++;
        }
    }
    else{
        // Set the empty drink
        replacement_case = 2;
        img_selected.src = empty_path;
        selected_drinks--;
    }
    updateData(selected_img, img_path, replacement_case);
    checkSubmit();
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
        drink_data[i][3] = 0;
        document.getElementById("unit_stocked" + i).innerText = drink_data[i][3];
        drink_data[i][4] = "-";
        document.getElementById("days_souldout" + i).innerText = drink_data[i][4];
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

/************************************** DATA CALCULATIONS  **************************************/

/**
 * Update all the data associated to the drinks when the user makes an action
 *
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement:
 * If (replacement_case = 0) => Replace a drink for another drink
 * If (replacement_case = 1) => Put a drink in an empty position
 * If (replacement_case = 2) =>  Remove the actual drink
 * If (replacement_case = -1) => Error in  selectDrink()
 */
function updateData(clicked_img, actual_img, replacement_case) {
    updateStock(clicked_img, actual_img, replacement_case);
    updateSoldout(clicked_img, actual_img, replacement_case);
    updateRevenue(clicked_img, actual_img, replacement_case);
    updateCost(clicked_img, actual_img, replacement_case);
    updateCost();
}

/**
 * Updates the revenue value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateRevenue(clicked_img, actual_img, replacement_case){
    let money_to_sum = 0;
    let newDrink = drink_data[actual_drink];
    switch (replacement_case) {
        case 0: // Replaced by other drink
            let old_value = -1;
            // Money that we get placing the new drink
            money_to_sum = calculateMoneyToSum(newDrink);
            // Find the clicked drink
            for(let i = 0; i < drinks_name.length; i++){
                if(clicked_img === drinks_name[i]){
                    let oldDrink = drink_data[i];
                    // Money that we get loose removing the new drink
                    old_value = calculateMoneyToSubtract(oldDrink);
                }
            }
            // Check that we found a value for the clicked image
            if(old_value === -1){
                console.log("ERROR: No data found for the clicked image (updateMoney)");
                return;
            }
            // Calculate the global revenue
            money_to_sum -= old_value;
            break;
        case 1: // Empty Position
             // Money that we get placing the new drink
             money_to_sum = calculateMoneyToSum(newDrink);
             break;
        case 2: // Remove the actual drink
            // Money that we get loose removing the new drink
            money_to_sum = -Math.abs(calculateMoneyToSubtract(newDrink));
            break;
        default: // Error case
            console.log("ERROR: Wrong replacement_case (updateRevenue)");
            return;
    }
    actual_profit_user = Number(money_to_sum) + Number(actual_profit_user);
    setActualProfit();
}

/**
 * Calculates the money to sum to the revenue when a drink is place in the machine
 *
 * @param newDrink: drink to be placed in the machine
 * @return {number} money_to_sum: the money to sum
 */
function calculateMoneyToSum(newDrink) {
        let money_to_sum = 0;
        let newPrice = newDrink[0], newCapacity = newDrink[1], newUPD = newDrink[2], newStock = newDrink[3];
        // Capacity > UDP
        if( (newStock - newCapacity === 0) && (newStock >= newUPD) ) {
                money_to_sum = newPrice * newUPD * period_of_time;
        }
        // Capacity > UDP && Going from {0,1} to {x > 1}
        else if( (newStock >= newUPD) && ((newStock - newCapacity) < newUPD) ){
           let normal_amount = newPrice* newUPD * period_of_time;
           let money_to_discount = newPrice * (newStock - newCapacity)  * period_of_time;
           money_to_sum = normal_amount - money_to_discount;
        }
        // Capacity > UDP && Going from {0,1} to {0,1}
        else if(newStock < newUPD){
            money_to_sum = newPrice * (newUPD / newCapacity) * period_of_time;
        }
        return money_to_sum;
}

/**
 * Calculates the money to subtract to the revenue when a drink is deleted in the machine
 *
 * @param oldDrink: drink to be removed in the machine
 * @return {number} old_value: the money to subtract
 */
function calculateMoneyToSubtract(oldDrink) {
    let old_value = 0;
    let oldPrice = oldDrink[0], oldCapacity = oldDrink[1], oldUPD = oldDrink[2], oldStock = oldDrink[3];
    // Capacity > UDP
    if( (oldStock === 0) && (oldCapacity > oldUPD)){
        old_value = oldPrice * oldUPD * period_of_time;
    }
    // There is still drinks with capacity less than UDP but the stock is lower than UDP
    else if( (oldStock < oldUPD) && (oldCapacity < oldUPD) ){
        // It is the first time that we are down the UDP
        if( (Number(oldStock) + Number(oldCapacity)) >= Number(oldUPD)){
            old_value = oldPrice * (oldUPD % oldCapacity) * period_of_time;
        }
        else{
            old_value = oldPrice * (oldUPD / oldCapacity) * period_of_time;
        }
    }
    return old_value;
}


/**
 * Updates the Units Stocked value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateStock(clicked_img, actual_img, replacement_case) {
    let units_to_sum = 0;
    let units_to_remove = 0, remove_id = -1;
    switch (replacement_case) {
        case 0: // Replaced by other drink
            // NewDrinkUnits += NewDrink(Capacity)
            // OldDrinkUnits -= OldDrink(Capacity
            units_to_sum = drink_data[actual_drink][1];
            for(let i = 0; i < drinks_name.length; i++){
                // I search for the data of the replaced drink
                if(clicked_img === drinks_name[i]){
                    units_to_remove = drink_data[i][1];
                    remove_id = i;
                }
            }
            // Check that we found a value for the clicked image
            if(units_to_remove === 0){
                console.log("ERROR: No data found for the clicked image (updateStock)");
                return;
            }
            break;
        case 1: // Empty Position
            // NewDrinkUnits += NewDrink(Capacity)
            units_to_sum = drink_data[actual_drink][1];
            break;
        case 2: // Remove the actual drink
            // NewDrinkUnits -= NewDrink(Capacity)
            units_to_sum = drink_data[actual_drink][1];
            units_to_sum = -Math.abs(units_to_sum);
            break;
        default:
            console.log("ERROR: Wrong replacement_case (updateStock)");
            return;
    }
    drink_data[actual_drink][3] =  (Number)(drink_data[actual_drink][3]) + (Number)(units_to_sum);
    // There is a drink to be removed
    if(remove_id !== -1){
        drink_data[remove_id][3] = (Number)(drink_data[remove_id][3]) - (Number)(units_to_remove) ;
    }
    setActualCapacity();
}

/**
 * Updates the Days Till Soldout value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateSoldout(clicked_img, actual_img, replacement_case){
    // The same for NewDrink and OldDrink
    drink_data[actual_drink][4] = soldOutOp(actual_drink);
    if (replacement_case === 0) {// Replaced by other drink
         drink_data[actual_drink][4] = soldOutOp(actual_drink);
         for(let i = 0; i < drinks_name.length; i++){
                // I search for the data of the replaced drink
                if(clicked_img === drinks_name[i]){
                    drink_data[i][4] = soldOutOp(i);
                }
            }
    } else if (replacement_case !== 1 && replacement_case !== 2){
        console.log("ERROR: Wrong replacement_case (updateSoldout)");
        return;
    }
    setActualSold();
}

/**
 * Performs the calculation fo the days till soldout
 *
 * If (NewDrink(Stock) >  NewDrink(UPD)){
 * NewDrink(Soldout) = Floor( NewDrink(Stocked) / NewDrink(UPD))
 * else { NewDrink(Soldout) = 0; }
 *
 * @param drinkId
 * @return days_till_sold
 */
function soldOutOp(drinkId) {
    let days_till_sold = -1;
    if(drink_data[drinkId][3] > drink_data[drinkId][2]){
        days_till_sold = Math.floor(Number(drink_data[drinkId][3]) / Number(drink_data[drinkId][2]));
    }
    // Not enough drinks to be one day without refilling
    else if(drink_data[drinkId][3] > 0){
        days_till_sold = 0;
    }
    // There is no drink in the machine
    else{
        days_till_sold = "-";
    }
    return days_till_sold;
}

/**
 * Updates the cost value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateCost(clicked_img, actual_img, replacement_case) {
    let min_day = 0;
    for(let i = 0; i < drink_order.length; i++){
        min_day = Math.min(min_day)
    }
}