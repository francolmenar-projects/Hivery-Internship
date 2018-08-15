const countdown = 900;
var actual_profit_user = 0.000;

/**
 * Go to the Guide page when the button play is clicked
 */
function goToGameOver(){
    window.open("gameOver.html", "_self");
}

/**
 * Creates the timer of the game
 */
function createTimer(){
    // Set the default countdown time
    var time_left = countdown;
    var min, second, new_time;
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
    }, 1000)
}

/**
 * It sets the actual value of the actual profit to the screen
 */
function setActualProfit() {
    document.getElementById("actual_profit").innerHTML = actual_profit_user.toFixed(3).toString();
}

(function() {
    // Create the timer
    createTimer();
    // Set the profit
    setActualProfit();
    // Setting the listeners
    document.getElementById("moneyCounterDiv").addEventListener("click", goToGameOver); // ONLY FOR TESTING
    }());