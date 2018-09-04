const json_path = "../json/data.json"; // Path to the JSON file

/**************************** UPPER COUNTERS ****************************/
let countdown; // Time countdown in seconds
let actual_profit_user = 0.000; // Profit counter
let actual_cost_user = 0.000; // Profit counter
/**************************** MESSAGES ****************************/
const hurryUp = "Hurry up!! You only have 30 seconds left.";
const oneMin = "One minute left. Do you really think that you can bet me?.";
const initialMsg = "I'm Haoui. Are you trying to bet me? Good luck!!";
/**************************** IMAGES ****************************/
let config_options; // The number of configuration options in the JSON
const img_prefix = "../img/products/"; // Offset to the image folder
const empty_path = "../img/products/coke-bottle.png"; // Global path to the empty drink
const empty_drink = "coke-bottle.png"; // Name of the empty drink
let drinks_name; // Name of the images of the drinks
/**************************** VENDING MACHINE ****************************/
// const max_drinks = 4; // We start to count from 0
let max_drinks; // We start to count from 0
let actual_drink = 0; // Drink id of the selected one
const max_machine = 12; // Maximum capacity of the vending machine
let selected_drinks = 0; // Actual amount of drinks in the vending machine
/***+++++++++++++++++++++** STATS ***+++++++++++++++++++++**/
let period_of_time; // Time frame that we consider
let cost_per_refill; // The cost for refilling the machine
let penalty_for_day_refill; // Penalty apply when the vending machine has to be refilled every day
let drink_order; // Order of the drinks inside the data array
const drink_attr = ["PRICE", "CAPACITY", "UNITS PER DAY", "UNITS STOCKED", "DAYS TILL SOLDOUT"]; // Order of the attributes inside the data array
let drink_data = [[], [], [], [], []]; // Data stored in a JSON
let valid = [];

/************************************** USER INTERFACE  **************************************/

/**
 * Opens a new window and checks for errors
 *
 * @param target: HTML page to open
 * @param origin: caller function
 * @return {Window}: null if there is an error.
 */
function open_window(target, origin) {
    let err = window.open(target, "_self");
    if (err === null) {
        console.log("[Error]: window.open() in " + origin);
    }
    return err;
}

/**
 * Go to the Guide page when the button play is clicked
 */
function goToGameOver() {
    let revenue = Number(actual_profit_user) - Number(actual_cost_user);
    window.localStorage.setItem("revenue", revenue);
    return open_window("gameOver.html", "goToGameOver()");
}

/**
 * Go to the Replay page when the button SUBMIT is clicked
 */
function goToReplay() {
    let revenue = Number(actual_profit_user) - Number(actual_cost_user);
    window.localStorage.setItem("revenue", revenue);
    return open_window("replay.html", "goToReplay()");
}

/**
 * Check the number of drinks in the vending machine
 * If it is full it shows the submit button
 * If it was full, it hides the show button
 */
function checkSubmit() {
    let down_button = document.getElementById("down_button");
    if ((selected_drinks === max_machine) && ($(down_button).css('display') === 'none')) {
        $(down_button).fadeIn("slow");
    }
    else if ((selected_drinks === (max_machine - 1)) && ($(down_button).css('display') !== 'none')) {
        $(down_button).fadeOut("slow");
    }
}

/**
 * Creates the timer of the game
 */
function createTimer() {
    // Set the default countdown time
    let time_left = countdown;
    let min, second, new_time;
    // This code is executed each second
    setInterval(function () {
        new_time = "";
        second = time_left % 60;
        min = parseInt(time_left / 60);
        // Check if there is any digit in the minutes
        if (min > 0) {
            // Check how many digits the minutes has
            if (min >= 10) {
                new_time = min.toString() + ":";
            }
            // If the minutes has only one digit we add a "0" to the left side of it
            else {
                new_time = "0" + min.toString() + ":";
            }
        }
        // There are no minutes left, so we add another "0" to the minutes
        else {
            new_time = min.toString() + "0:";
        }
        // Check if there are two digits in the seconds
        if (second >= 10) {
            new_time += second.toString();
        }
        // There is only one digit in the second side, so we add a "0" to the left side
        else {
            new_time += "0" + second.toString();
        }
        // Get the HTML of the time and assign to it the new value of the timer
        document.getElementById("timer").innerHTML = new_time;
        // Update the timer value for the next iteration
        time_left--;
        // If there is no time left the time is over
        if (time_left < 0) {
            goToGameOver();
        }
        else if (time_left === 85) {
            showAdvice(initialMsg);
        }
        else if (time_left === 78) {
            hideAdvice();
        }
        else if (time_left === 60) {
            showAdvice(oneMin);
        }
        else if (time_left === 53) {
            hideAdvice();
        }
        else if (time_left === 30) {
            showAdvice(hurryUp);
        }
        else if (time_left === 23) {
            hideAdvice();
        }
    }, 1000)
}

/**
 * It sets the actual value of the actual profit to the screen
 */
function setActualProfit() {
    let profit = document.getElementById("actual_profit");
    let revenue = document.getElementById("revenue_stats");
    if (profit) {
        profit.innerHTML = actual_profit_user.toFixed(3).toString();
    }
    else {
        console.log("[Error]: element 'actual_profit' does not exist in setActualProfit()");
    }
    if (revenue) {
        revenue.innerHTML = "$" + actual_profit_user.toFixed(3).toString();
    }
    else {
        console.log("[Error]: element 'revenue_stats' does not exist in setActualProfit()");
    }
}

/**
 * It sets the actual value of the Units Stocked on the screen
 */
function setActualCapacity() {
    for (let i = 0; i < drink_order.length; i++) {
        let capacity = document.getElementById("unit_stocked" + i);
        if (capacity) {
            capacity.innerHTML = drink_data[i][3];
        }
        else {
            console.log("[Error]: element 'unit_stocked" + i + "' does not exist in setActualCapacity()");
        }
    }
}

/**
 * It sets the actual value of the Days Till SoldOut on the screen
 */
function setActualSold() {
    for (let i = 0; i < drink_order.length; i++) {
        let soldout = document.getElementById("days_souldout" + i);
        if (soldout) {
            soldout.innerHTML = drink_data[i][4];
        }
        else {
            console.log("[Error]: element 'days_souldout" + i + "' does not exist in setActualSold()");
        }
    }
}

/**
 * It sets the actual value of the Cost per Year
 */
function setActualCost() {
    let actual_cost = document.getElementById("cost_stats");
    if (actual_cost) {
        actual_cost.innerHTML = actual_cost_user.toFixed(3).toString();
    }
    else {
        console.log("[Error]: element 'cost_stats' does not exist in setActualCost()");
    }
}

/**
 * It calculates the optimum distribution of the machine
 */
function setOptimum(input) {
    // Get the values of the optimal distribution
    let arr = input.split(',').map(Number);
    let opt_revenue = 0, opt_cost = 0, opt_soldout = 999;
    // Check the correct number of values
    if (arr.length !== drink_order.length) {
        console.log("[Error] Input of the optimum machine has incorrect format");
        return;
    }
    // Calculate the revenue
    for (let i = 0; i < arr.length; i++) {
        let opt_price = drink_data[i][0], opt_capacity = drink_data[i][1], opt_UPD = drink_data[i][2];
        let opt_stock = arr[i] * drink_data[i][1];
        // Capacity > UDP
        if (opt_stock >= opt_UPD) {
            opt_revenue += opt_price * opt_UPD * period_of_time;
        }
        // Capacity > UDP && Going from {0,1} to {0,1}
        else if (opt_stock < opt_UPD) {
            opt_revenue += opt_price * (opt_UPD / opt_capacity) * period_of_time;
        }
    }
    // Calculate the soldout
    for (let i = 0; i < arr.length; i++) {
        let opt_UPD = drink_data[i][2];
        let opt_stock = arr[i] * drink_data[i][1];
        if (arr[i] > 0) {
            if (opt_stock > opt_UPD) {
                let aux = Math.ceil(Number(opt_stock) / Number(opt_UPD));
                if (aux < opt_soldout) {
                    opt_soldout = aux
                }
            }
            else {
                opt_soldout = 0;
            }
        }
    }
    // Calculate the cost
    if (opt_soldout > 0) {
        opt_cost = cost_per_refill * Math.ceil(period_of_time / opt_soldout);
    }
    else {
        opt_cost = penalty_for_day_refill * cost_per_refill * Number(period_of_time);
    }
    // Save the values
    window.localStorage.setItem("opt_revenue", opt_revenue);
    window.localStorage.setItem("opt_cost", opt_cost);
    window.localStorage.setItem("opt_dist", arr);
}

/**
 * Change the drink displayed in the selector
 */
function changeDrink() {
    let selected_drink = document.getElementById("selected_drink");
    if (selected_drink) {
        selected_drink.src = img_prefix + drinks_name[actual_drink];
    }
    else {
        console.log("[Error]: element 'selected_drink' does not exist in changeDrink()");
    }
}

/**
 * Change the selected drink in the vending machine
 */
function selectDrink() {
    let img_path, img_selected, selected_img_arr, selected_img;
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
    if (selected_img !== img_path) {
        // Set the new drink
        replacement_case = 0;
        img_selected.src = img_prefix + img_path;
        // Replace an empty drink
        if (selected_img === empty_drink) {
            replacement_case = 1;
            selected_drinks++;
        }
    }
    else {
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
    preValidDrink();
    changeDrink();
    // Load the data of the new drink
    loadSelected();
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

/**
 * Calculates the previous valid drink to display
 */
function preValidDrink() {
    for (let i = 0; i <= max_drinks; i++) {
        let prev = actual_drink - i - 1;
        if (prev < 0) {
            prev = max_drinks - Math.abs((prev) % max_drinks) + 1;
        }
        if (valid[prev] === 0) {
            actual_drink = prev;
            return;
        }
    }
    console.log("[Error] There is no valid drink");
}

/**
 * Calculates the next valid drink to display
 */
function nextValidDrink() {
    for (let i = 0; i <= max_drinks; i++) {
        let next = actual_drink + i + 1;
        if (next > max_drinks) {
            next = (next - 1) % max_drinks;
        }
        if (valid[next] === 0) {
            actual_drink = next;
            return;
        }
    }
    console.log("[Error] There is no valid drink");
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
 * Add an event listener to the given button
 *
 * @param id: id of the button we want to add the listener
 * @param action: the action to be performed over the button
 * @param f_name: name of the function to be executed
 * @param origin: The calling function
 * @return {number}: return -1 if there is any error and 0 otherwise
 */
function addListener(id, action, f_name, origin) {
    let moneyCounterDiv = document.getElementById(id);
    if (moneyCounterDiv) {
        moneyCounterDiv.addEventListener(action, f_name);
        return 0;
    }
    else {
        if (id && origin) {
            console.log("[Error]: element '" + id + "' does not exist in " + origin + "()");
            return -1;
        }
    }
}

(function () {
    // Set the profit
    setActualProfit();
    // Setting the listeners
    addListener("down_button", "click", goToReplay, "function");
    addListener("arrow_left", "click", previousDrink, "function");
    addListener("arrow_right", "click", nextDrink, "function");

    // Get all the images of the vending machine
    let allImages = document.getElementById("drinks_machine").getElementsByTagName('img');
    if (allImages) {
        for (let i = 0; i < allImages.length; i++) {
            if (allImages[i]) {
                allImages[i].addEventListener("click", selectDrink);
            }
            else {
                console.log("[Error]: element 'drinks_machine[" + i + " ' does not exist in function()");
            }
        }
    }
    else {
        console.log("[Error]: element 'drinks_machine' does not exist in function()");
    }
}());

/************************************** STAT DATA  **************************************/

/**
 * Read the data from the JSON file and store it
 */
$(document).ready(function () {
    // Set the font according to the screen
    setFont();
    $.getJSON(json_path, function (json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function (el) {
            return el
        });
        //Number of options in the configuration file
        config_options = Number(element_arr[0]);
        // Amount of drinks
        max_drinks = element_arr[1];
        // Number of seconds of the countdown
        countdown = parseInt(element_arr[3]);
        // Period of time in days that the game used to play
        period_of_time = parseInt(element_arr[4]);
        // Cost per refilling the vending machine
        cost_per_refill = parseInt(element_arr[5]);
        // Extra penalty if you have to refill each day
        penalty_for_day_refill = parseInt(element_arr[6]);
        // The name and order of the drinks
        drink_order = $.map(element_arr[7], function(el) { return el });
        // The name of the images of the drinks
        drinks_name = $.map(element_arr[8], function(el) { return el });
        // Create the timer
        createTimer();
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
        nextDrink();
        setOptimum(element_arr[2]);
    });
});

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
    updateCost();
}

/**
 * Updates the revenue value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateRevenue(clicked_img, actual_img, replacement_case) {
    let money_to_sum = 0;
    let newDrink = drink_data[actual_drink];
    switch (replacement_case) {
        case 0: // Replaced by other drink
            let old_value = -1;
            // Money that we get placing the new drink
            money_to_sum = calculateMoneyToSum(newDrink);
            // Find the clicked drink
            for (let i = 0; i < drinks_name.length; i++) {
                if (clicked_img === drinks_name[i]) {
                    let oldDrink = drink_data[i];
                    // Money that we get loose removing the new drink
                    old_value = calculateMoneyToSubtract(oldDrink);
                }
            }
            // Check that we found a value for the clicked image
            if (old_value === -1) {
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
    if ((newStock - newCapacity === 0) && (newStock >= newUPD)) {
        money_to_sum = newPrice * newUPD * period_of_time;
    }
    // Capacity > UDP && Going from {0,1} to {x > 1}
    else if ((newStock >= newUPD) && ((newStock - newCapacity) < newUPD)) {
        let normal_amount = newPrice * newUPD * period_of_time;
        let money_to_discount = newPrice * (newStock - newCapacity) * period_of_time;
        money_to_sum = normal_amount - money_to_discount;
    }
    // Capacity > UDP && Going from {0,1} to {0,1}
    else if (newStock < newUPD) {
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
    if ((oldStock === 0) && (oldCapacity > oldUPD)) {
        old_value = oldPrice * oldUPD * period_of_time;
    }
    // There is still drinks with capacity less than UDP but the stock is lower than UDP
    else if ((oldStock < oldUPD) && (oldCapacity < oldUPD)) {
        // It is the first time that we are down the UDP
        if ((Number(oldStock) + Number(oldCapacity)) >= Number(oldUPD)) {
            old_value = oldPrice * (oldUPD % oldCapacity) * period_of_time;
        }
        else {
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
            for (let i = 0; i < drinks_name.length; i++) {
                // I search for the data of the replaced drink
                if (clicked_img === drinks_name[i]) {
                    units_to_remove = drink_data[i][1];
                    remove_id = i;
                }
            }
            // Check that we found a value for the clicked image
            if (units_to_remove === 0) {
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
    drink_data[actual_drink][3] = (Number)(drink_data[actual_drink][3]) + (Number)(units_to_sum);
    // There is a drink to be removed
    if (remove_id !== -1) {
        drink_data[remove_id][3] = (Number)(drink_data[remove_id][3]) - (Number)(units_to_remove);
    }
    setActualCapacity();
}

/**
 * Updates the Days Till Soldout value
 * @param clicked_img: drink to be replaced
 * @param actual_img: drink to be stored in the machine
 * @param replacement_case: which is the situation of the replacement
 */
function updateSoldout(clicked_img, actual_img, replacement_case) {
    // The same for NewDrink and OldDrink
    drink_data[actual_drink][4] = soldOutOp(actual_drink);
    if (replacement_case === 0) {// Replaced by other drink
        drink_data[actual_drink][4] = soldOutOp(actual_drink);
        for (let i = 0; i < drinks_name.length; i++) {
            // I search for the data of the replaced drink
            if (clicked_img === drinks_name[i]) {
                drink_data[i][4] = soldOutOp(i);
            }
        }
    } else if (replacement_case !== 1 && replacement_case !== 2) {
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
    if (drink_data[drinkId][3] > drink_data[drinkId][2]) {
        days_till_sold = Math.ceil(Number(drink_data[drinkId][3]) / Number(drink_data[drinkId][2]));
    }
    // Not enough drinks to be one day without refilling
    else if (drink_data[drinkId][3] > 0) {
        days_till_sold = 0;
    }
    // There is no drink in the machine
    else {
        days_till_sold = "-";
    }
    return days_till_sold;
}

/**
 * Updates the cost value
 */
function updateCost() {
    let min_day = 999;
    // Get the minimum soldout value
    for (let i = 0; i < drink_order.length; i++) {
        let drink = drink_data[i];
        let soldOut = drink[4];
        // Avoid "-" values
        if (Number(soldOut) === 0) {
            // Check the worst case which is 0 days with stock
            if (Number(drink[3]) !== 0) {
                min_day = -1;
                break;
            }
        }
        // The soldout is larger than 0
        else {
            // Searching for the next minimum value
            if (Number(soldOut) < min_day) {
                min_day = Number(soldOut);
            }
        }
    }
    // Calculate the new cost value
    // There are no drinks
    if (min_day === 999) {
        actual_cost_user = 0.000;
    }
    // Have to refill every day
    else if (min_day === -1) {
        actual_cost_user = penalty_for_day_refill
            * cost_per_refill * Number(period_of_time);
    }
    // Normal Case
    else {
        // Cost = (365 / min(Soldout)) * Cost_Refill
        actual_cost_user = cost_per_refill * Math.ceil(period_of_time / min_day);
    }
    setActualCost();
}

/**
 * Set the font size of the text
 */
function setFont() {
    let width = $(window).width();
    // Size of the counters
    let counter_font = width / 800;
    if (width < 1500) {
        counter_font = width / 720;
    }
    $("#moneyCounterDiv").css("font-size", counter_font + "em");
    $("#timer_counter").css("font-size", counter_font + "em");
    // Size of the advice
    let font_size = width / 87.27;
    $("#advice_banner").css("font-size", font_size + "px");
    // Size of selected drink
    let drink_font = width / 423.529;
    $("#actual_drink_inside").css("font-size", drink_font + "em");
    // Size of submit button
    let submit_font = width / 1800;
    if (width < 1500) {
        submit_font = width / 1309;
    }
    $("#submit_but").css("font-size", submit_font + "em");
    // Size of Stats div
    let stats_font = width / 450;
    $("#drinks_stats_inside").css("font-size", stats_font + "em");
    let stats_lin = 28;
    if (width < 1500) {
        stats_lin = 20;
    }
    $(".drinks_stats_inside").css("line-height", stats_lin + "%");
    // Size of the values of Total div
    let total_font = stats_font / 2.7;
    $(".total_values").css("font-size", total_font + "em");
    // Size of the headers of Total div
    let totalH_font = stats_font / 5;
    $(".total_header").css("font-size", totalH_font + "em");
}