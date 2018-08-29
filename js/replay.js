var msg0 = "You made $";
var msg1 = " which is just $";
var msg2 = " less than me. But I’m still the best!!!";

const max_machine = 12; // Maximum capacity of the vending machine
const json_path = "../json/data.json"; // Path to the JSON file
const empty_drink = "coke-bottle.png"; // Name of the empty drink
const drinks_name = ["markSoda.png", "markCola.png", "markTropics.png", "cherry_can.png", "cola_can.png"]; // Name of the images of the drinks

const drink_order = ["SODA", "COLA", "TROPICS", "CHERRY", "COLA CAN"]; // Order of the drinks inside the data array
const drink_attr = ["PRICE","CAPACITY",  "UNITS PER DAY", "UNITS STOCKED", "DAYS TILL SOLDOUT"]; // Order of the attributes inside the data array

var drink_data = [[],[],[],[],[]]; // Data stored in a JSON

/**
 * Go to the Game page when the button play is clicked
 */
function goToGameWindow(){
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
    document.getElementById("replay_text").innerHTML = msg0 + revenue + msg1 + difference + msg2;
}

/**
 * Go to the Optimal page
 */
function goToOptimal() {
    window.open("../pages/optimal.html", "_self");
}

(function() {
    // Setting the listeners
    document.getElementById("replay_button").addEventListener("click", goToGameWindow);

    document.getElementById("best_machine").addEventListener("click", goToOptimal);

    // Set the profit
    setActualProfit();




}());

/**
 * Read the data from the JSON file and store it
 *
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
        // Fill the data for the knapsack
        for(let i = 0; i < drink_order.length; i++) {
            for(let j = 0; j < max_machine; j++){

            }
        }
            console.log(drink_data);
    });
});

/* 0-1 knapsack problem
Function name: knapsack
Param:
  items: an array of {w: v:} (where 'w' stands for weight, and 'v' stands for value)
  capacity: a positive integer number
Will return max sum value that can reach, and the chosen subset to add up to the value.
*

function knapsack(items, capacity){
  // This implementation uses dynamic programming.
  // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
  // which will be later used as the code execution goes on.
  // This is called memoization in programming.
  // The cell will store best solution objects for different capacities and selectable items.
  var memo = [];

  // Filling the sub-problem solutions grid.
  for (var i = 0; i < items.length; i++) {
    // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
    var row = [];
    for (var cap = 1; cap <= capacity; cap++) {
      row.push(getSolution(i,cap));
    }
    memo.push(row);
  }

  // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
  return(getLast());

  function getLast(){
    var lastRow = memo[memo.length - 1];
    return lastRow[lastRow.length - 1];
  }

  function getSolution(row,cap){
    const NO_SOLUTION = {maxValue:0, subset:[]};
    // the column number starts from zero.
    var col = cap - 1;
    var lastItem = items[row];
    // The remaining capacity for the sub-problem to solve.
    var remaining = cap - lastItem.w;

    // Refer to the last solution for this capacity,
    // which is in the cell of the previous row with the same column
    var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
    // Refer to the last solution for the remaining capacity,
    // which is in the cell of the previous row with the corresponding column
    var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;

    // If any one of the items weights greater than the 'cap', return the last solution
    if(remaining < 0){
      return lastSolution;
    }

    // Compare the current best solution for the sub-problem with a specific capacity
    // to a new solution trial with the lastItem(new item) added
    var lastValue = lastSolution.maxValue;
    var lastSubValue = lastSubSolution.maxValue;

    var newValue = lastSubValue + lastItem.v;
    if(newValue >= lastValue){
      // copy the subset of the last sub-problem solution
      var _lastSubSet = lastSubSolution.subset.slice();
      _lastSubSet.push(lastItem);
      return {maxValue: newValue, subset:_lastSubSet};
    }else{
      return lastSolution;
    }
  }
}

// test
var items = [
  {w:70,v:135},
  {w:73,v:139},
  {w:77,v:149},
  {w:80,v:150},
  {w:82,v:156},
  {w:87,v:163},
  {w:90,v:173},
  {w:94,v:184},
  {w:98,v:192},
  {w:106,v:201},
  {w:110,v:210},
  {w:113,v:214},
  {w:115,v:221},
  {w:118,v:229},
  {w:120,v:240},
];

var capacity = 750;
console.log(knapsack(items, capacity));

/* result
{ maxValue: 1458,
  subset:
   [ { w: 70, v: 135 },
     { w: 77, v: 149 },
     { w: 82, v: 156 },
     { w: 90, v: 173 },
     { w: 94, v: 184 },
     { w: 98, v: 192 },
     { w: 118, v: 229 },
     { w: 120, v: 240 } ] }
*/