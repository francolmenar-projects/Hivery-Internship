window.jQuery = window.$ = require('jquery');
const initial = require('../js/introduction_page.js');

test('clicks the Play button and goes to Guide Page', () => {
    expect(initial.goToGuide()).not.toBe(null);
});

test('Load the text for the panel', () => {
    // Set up our document body
    document.body.innerHTML ="\n" +
        "<body class=\"background_default noSelect\">\n" +
        "<!-- Introduction Image with the text -->\n" +
        "<div id=\"initial_text_box\" class=\"center_div generic_text initial_text_box\">\n" +
        "    <img class=\"board\" src=\"../img/welcomeBoard.png\" alt=\"Welcome board\">\n" +
        "    <p id=\"header\" class=\"panel_header\"></p>\n" +
        "    <p id=\"intro_text\" class=\"describe_text\"></p>\n" +
        "    <div id=\"introduction_play_button\" class=\"button_game button_text button_play_intro\">\n" +
        "        <img class=\"play_but\" src=\"../img/gameButton.png\" alt=\"Play button\">\n" +
        "        <p id=\"play_text\"></p>\n" +
        "    </div>\n" +
        "</div>";

    initial.setText();

    const setTextAux = initial.setTextAux();

    expect(setTextAux).toBeCalled();
    //expect(document.getElementById("header").innerHTML).toBe("Welcome!");
});
