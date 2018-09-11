const json_path = "json/msg.json"; // Path to the JSON file

/**
 * Go to introduction page when the screen is clicked
 */
function goToIntroduction() {
    let err = window.open("pages/introduction.html", "_self");
    if (err === null) {
        console.log("[Error]: window.open() in goToIntroduction()");
    }
    return err;
}

(function () {
    // Setting the listeners
    document.addEventListener("click", goToIntroduction);
}());

/**
 * Read the JSON and stores it
 */
$(document).ready(function () {
    $.getJSON(json_path, function (json) {
        let element_arr;
        // Convert the JSON into an array
        element_arr = $.map(json, function (el) {
            return el;
        });
        // Save the JSON data for the messages
        localStorage.setItem("json_msg", JSON.stringify(element_arr));
    })
});

