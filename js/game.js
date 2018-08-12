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
    setInterval(function () {
        new_time = "";
        second = time_left % 60;
        min = parseInt(time_left / 60);
        if(min > 0){
            if(min >= 10){
                new_time = min.toString() + ":";
            }
            else{
                new_time = "0" + min.toString() + ":";
            }
        }
        else{
            new_time = min.toString() + "0:";
        }
        if(second >= 10){
            new_time += second.toString();
        }
        else{
            new_time += "0" + second.toString();
        }
        console.log(new_time);
        document.getElementById("timer").innerHTML = new_time;
        time_left--;
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
    }());