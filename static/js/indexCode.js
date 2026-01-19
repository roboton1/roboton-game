e = campaignTrail_temp

const yearField = document.getElementById("year")
yearField.innerHTML = new Date().getFullYear()

let neo = false;

$(document).ready(function() {
    // NEO mode

    neo = localStorage.getItem("bigshot_NEO") == "true";

    if (neo) {
        campaignTrail_temp.bigshot_mode = true;
    }
    
    loadEntries();

});

// mobile bigshot

let mobile_bigshot_data = {
    clicks: 0,
    state: localStorage.getItem("cheated") == "true" ? 1 : 0
};

$("#bigshotOn").click((e) => {
    e.preventDefault();
    alert(`ARE YOU GETTING ALL THIS [Mike]!? I'M FINALLY\nI'M FINALLY GONNA BE A BIG SHOT!!!`);
    localStorage.setItem("cheated", true);
    campaignTrail_temp.bigshot_mode = true;
    $("#bigshotOn")[0].style.display="none"
})

// INITIAL BIGSHOT

const keyCodes = [66, 73, 71, 83, 72, 79, 84, 13];
const altCodes = [66, 83, 13]; // shortcut
const neoCodes = [78, 69, 79, 13]; // perma-bigshot
let counter = 0;
let alt_counter = 0;
let neo_counter = 0;
let initial = false;

var bigshot_key_handler = function(event) {
    nct_stuff.bigshot_activation = false;

    if (event.keyCode === neoCodes[neo_counter]) {
        nct_stuff.bigshot_activation = true;
        neo_counter += 1;

        if (neo_counter === neoCodes.length) {
            if (neo) {
                alert(`NOT COOL [Valued Player]! I'LL BE IN MY [Trailer]!`);
                localStorage.setItem("bigshot_NEO", false);
                window.location.reload();
            } else {
                alert(`HOLY [[Cungadero]] DO I FEEL GOOD ...`);
                campaignTrail_temp.bigshot_mode = true;
                localStorage.setItem("bigshot_NEO", true);
                neo = true;
                document.removeEventListener("keydown", bigshot_key_handler);
            }
        }
    } else {
        neo_counter = 0;
    }

    if (campaignTrail_temp.bigshot_mode) {
        return;
    }

    if (event.keyCode === keyCodes[counter]) {
        nct_stuff.bigshot_activation = true;
        counter += 1;

        if (counter === keyCodes.length) {
            if (localStorage.getItem("cheated") !== "true") {
                const a = "LOOKING FOR [Irresistible Cheat Codes] THAT WILL [Blow Your Mind!?]\nWELL [Shut Your Mouth] BECAUSE YOU ARE [A Redditor!]\nTRY A LITTLE [Friday Night Work Out]...\nTHEN I'LL SHOW YOU MY\nTHEN I'LL SHOW YOU MY\n1 LEFT.";
                counter = 0;
                localStorage.setItem("cheated", true);
                alert(a);
                initial = true;
                return;
            } else {
                a = initial ? `DON'T WORRY! FOR OUR [No Time Back Guaranttee]\nTHIS IS [One Cheat Code] YOU WILL [Regret] FOR THE REST OF YOUR REDDIT POST!` : `[Heaven], are you WATCHING?`;
                campaignTrail_temp.bigshot_mode = true;
                document.removeEventListener("keydown", bigshot_key_handler);
                alert(a);
                return;
            }
        }
    } else {
        counter = 0;
    }
    if (event.keyCode == altCodes[alt_counter] && localStorage.getItem("cheated") == "true") {
        nct_stuff.bigshot_activation = true;
        alt_counter += 1;
        if (alt_counter === altCodes.length) {
            a = `ARE YOU GETTING ALL THIS [Mike]!? I'M FINALLY\nI'M FINALLY GONNA BE A BIG SHOT!!!`;
            campaignTrail_temp.bigshot_mode = true;
            alert(a);
            document.removeEventListener("keydown", bigshot_key_handler);
        }
        return;
    } else {
        alt_counter = 0;
    }
}

document.addEventListener('keydown', bigshot_key_handler);

document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

changeFavicon("/static/34starcircle-2.png")


function loadEntries() {
    $.ajax({
        type: "GET",
        url: "../static/mods/MODLOADERFILE.html",
        dataType: "text",
        success: function(response) {
            $("#mod_sel_wrapper").html(response);

            // hot load
            let hotload = window.localStorage.getItem("hotload");
            if (hotload) {
                try {
                    $("#modSelect")[0].value = hotload;
                    campaignTrail_temp.hotload = hotload;
                    $("#submitMod").click();
                } catch {

                }
                window.localStorage.removeItem("hotload") // this should be done whether or not there is an error.
            }

            //hotload 2!
            let link_split=window.location.href.split("?");
            if (link_split.length>1) {
                ((link_split)=>{
                    modName = link_split[1].split("modName=");
                    if (modName.length == 1) return;
                    e.hotload = decodeURIComponent(modName[1]);
                    $("#modSelect")[0].value = e.hotload;
                    $("#submitMod").click();
                })(link_split)
            }

            //clone so we don't reduce the list of mods every time a tag is selected
            originalOptions = $("#modSelect option").clone();
            filterEntries();
        },
        error: function() {
            console.log("Error loading mod loader - couldn't reach server.");
        }
    });
}

function filterEntries() {
    var selectedTags = [];

    // Get all selected tags
    $('.tagCheckbox:checked').each(function() {
        selectedTags.push($(this).val());
    });

    var filteredOptions = originalOptions.filter((f) => {
        var entryTags = $(originalOptions[f]).data('tags');

        const selected = originalOptions[f].innerText.toLowerCase().includes(nct_stuff.name_filter) || originalOptions[f].value.toLowerCase().includes(nct_stuff.name_filter);

        if (selectedTags.length === 0) {
            // Show all if no tags are selected
            return true && selected;
        }

        //return mods that are tagged and have all checked tags
        let det = entryTags && (containsAllTags(entryTags, selectedTags) && selected);
        return det;
    });

    let arrFiltVal = Array.from(filteredOptions).map(f=>f.value);

    var $modSelect = $('#modSelect');
    $modSelect.empty().append(filteredOptions);

    $modSelect.val($modSelect.find('option:first').val());

    Array.from(document.getElementsByClassName("widget")).forEach(f => {
        let value = f.getAttribute("mod-value");
        let option = originalOptions.filter(id_clean(`#${value}_select_option`))[0];
        let tags = option.getAttribute("data-tags");

        tags = tags.split(" ");
        
        if (!arrFiltVal.includes(value)) {
            f.style.display = "none";
            return;
        }

        f.style.display = "";
    })
}

function containsAllTags(entryTags, selectedTags) {
    var entryTagArray = entryTags.split(' ');

    for (var i = 0; i < selectedTags.length; i++) {
        if (!entryTagArray.includes(selectedTags[i])) {
            return false;
        }
    }

    return true;
}


function uwuifier(a) {
    b = a.split(" I ")
    if (b.length > 0) {
        for (i in b) {
            if (i < b.length - 1) {
                b[i] += " I-I "
            }
        }
    }
    a = b.join("")
    b = a.split("l")
    if (b.length > 0) {
        for (i in b) {
            if (i < b.length - 1) {
                b[i] += "w"
            }
        }
    }
    a = b.join("")
    b = a.split("r")
    if (b.length > 0) {
        for (i in b) {
            if (i < b.length - 1) {
                b[i] += "w"
            }
        }
    }
    a = b.join("")
    b = a.split(" t")
    if (b.length > 0) {
        for (i in b) {
            if (i < b.length - 1) {
                if (b[Number(i) + 1][0] != '-')
                    b[i] += " t-t"
                else
                    b[i] += " t"
            }
        }
    }
    a = b.join("")
    b = a.split("ow")
    if (b.length > 0) {
        for (i in b) {
            if (i < b.length - 1) {
                b[i] += "uw"
            }
        }
    }
    a = b.join("")
    return a
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

num = Math.floor((Math.random() * 50) + 1)
bgnum = Math.floor((Math.random() * 4) + 1)
modernnum = Math.floor((Math.random() * 1) + 1)
bernienum = Math.floor((Math.random() * 3) + 1)
reagannum = Math.floor((Math.random() * 4) + 1)
astronum = Math.floor((Math.random() * 6) + 1)
breakingbadnum = Math.floor((Math.random() * 2) + 1)
omorichoices = ["https://cdn.discordapp.com/attachments/818130397706846242/979975422706057216/omoribanner1.png", "https://cdn.discordapp.com/attachments/818130397706846242/979980497902010398/omor2.png"]
omorichoice = choose(omorichoices)
auschoices = ["https://cdn.discordapp.com/attachments/818130397706846242/979995935402754138/aus_ban_1.png", "https://cdn.discordapp.com/attachments/818130397706846242/979997719441571850/aus_ban_2.png"]
auschoice = choose(auschoices)

utnum = Math.floor((Math.random() * 2) + 1)
nct_stuff = {}
nct_stuff.dynamicOverride = false;
nct_stuff.themes = {
    "ザ・ロボトン": {
        name: "ザ・ロボトン",
        background: "",
        background_cover: true,
        banner: "../static/images/banner_roboton.png",
        coloring_window: "#2b0b75",
        coloring_container: "#060114",
        coloring_title: "#210505",
        text_col: "#fff"
    }, 
    "custom": {
        name: "Custom",
        background: "",
        banner: "",
        coloring_window: "",
        coloring_container: "",
        coloring_title: ""
    }
}

window.localStorage.setItem("christmas", 0)

if (!window.localStorage.getItem("christmas")) {
    window.localStorage.setItem("christmas", 1)
    nct_stuff.christmas = true
} else {
    if (window.localStorage.getItem("christmas") == "1") {
        nct_stuff.christmas = true
    } else {
        nct_stuff.christmas = false
    }
}

nct_stuff.selectedTheme = "ザ・ロボトン"
theme = window.localStorage.getItem("theme")
console.log(theme)

if (theme == null) {
    nct_stuff.selectedTheme = "ザ・ロボトン"
} else {
    nct_stuff.selectedTheme = theme
}

var selectedTheme = nct_stuff.themes[nct_stuff.selectedTheme];

// christmas :nerd:

//christmasSetup();

if (nct_stuff.christmas != true) {
    document.getElementById("theme_picker").innerHTML = "<select id='themePicker' onchange='themePicked()'></select>"
    document.getElementById("themePicker").innerHTML += "<option value='" + nct_stuff.selectedTheme + "'>" + nct_stuff.themes[nct_stuff.selectedTheme].name + "</option>"
    for (i in nct_stuff.themes) {
        if (i != nct_stuff.selectedTheme)
            document.getElementById("themePicker").innerHTML += "<option value='" + i + "'>" + nct_stuff.themes[i].name + "</option>"
    }

} else {
    document.getElementById("theme_picker").style.display = 'none'
}

function themePicked() {
    sel = document.getElementById("themePicker").value
    window.localStorage.setItem("theme", sel)
    location.reload()
}
susnum = Math.floor((Math.random() * 8) + 1)
stassennum = Math.floor((Math.random() * 8) + 1)
stassenyear = ["1944", "1948", "1952", "1964", "1968", "1980", "1984", "1988", "1992"]
nct_stuff.quotes = [`ロボトン最高`,`面白い`,`すごい面白い`,`いいゲームですね`,`大好き`,`とても楽しい`,`最高`,`このゲームは素晴らしい`,`私はこのゲームが大好きです`,`素晴らしいゲームです`,`最高のゲームです`,`このゲームはとても面白いです`,`私はこのゲームを楽しんでいます`,`ロボトンは最高のゲームです`,`このゲームはとても楽しいです`,`私はこのゲームを愛しています`,`素晴らしい体験です`,`最高の体験です`,`このゲームは素晴らしい体験を提供します`,`私はこのゲームを強くお勧めします`,`ロボトンとゲームが大好き`]
//nct_stuff.quotes = ["Remember, if your campaign manager isn't yelling at you, you're playing this game wrong.","Ralph Nader won in 2000","The American people are tired of women - Bernie Sanders","So I can just write anything here and it appears on the website?","Vote for President Johnson on November 3rd. The stakes are too high for you to stay home.","Dewey Defeats Truman!","You are not immune to 306-232","Read my lips. No new taxes","I did not have sexual relations with that woman","You know that your future still lies ahead of you.","Obligatory Wallave mention","if you don’t vote for me, ‘you ain’t black!","Fool me once, shame on...shame on you. Fool me—you can't get fooled again","We won this election by a lot!","Created by Al Gore under the pseudonym Dan Bryan","Senator, you’re no Dan Bryan","Yes, I would support the death penalty in that instance, Mr.Shaw","Making a mod; need a moder and a coder","We stan Dan Bryan in this household!","Most Americans wonder if you hit your head the wrong way getting out of bed this morning.","When he’s a tariff man through and through😩😩😩","Are you an Egghead or Lemonhead?","DO NOT LOOK UP WHERE HUBERT HUMPHREY WAS BORN","50 unban, 60% rual", "Look being a moderator, is all about learning from mistakes...", "Now with 30% less damn commies <font size='1'>McCarthy Approved</font>","I’ve never seen a skinny person drink Diet Coke","Alright. Way to get that crowd fired up.","<font size='1'>This is a good, liberal answer that will motivate your base. As always, make sure you strike the right balance between appealing to moderates and getting your troops out.</font>","Harold Stassen for president "+stassenyear[stassennum]+"!","Minecraft is better", "Statement by Donald J. Trump, 45th President of the United States of America","Now with an updated mod loader! (yes, seriously)", "Feels like a good time for a fireside chat", "[Insert Undertale Reference]", "2012 is the best scenario!", "Shopping for a New Deal", "Now with 10% more sarcastic comments", "<button onclick='alert(\"bepis\")'>Click for bepis</button>", "Don't stop me now! <font size='1'>no seriously please don't</font>", "she/they #BLM #ACAB", "The Industrial Revolution and its consequences have been a disaster for the human race", "Patriot | 80 years old | Unvaxxed | In ICU with COVID 😔", "<b>NEWER CAMPAIGN TRAIL</b> when?", "I'm all alone... more or less", "Let me fly far away from here", "<audio src='https://ia601807.us.archive.org/32/items/lp_fly-me-to-the-moon_earl-grant/disc1/01.02.%20Fly%20Me%20To%20The%20Moon%20%28In%20Other%20Words%29.mp3' autoplay='true'></audio>", "I like Ike!", "Giraffes are heartless creatures", "\"People who are hungry and out of a job are the stuff of which dictatorships are made.\" - Franklin D. Roosevelt", "\"The only thing we have to fear is fear itself.\" - Franklin D. Roosevelt", "\"You are fake news.\" - Donald J. Trump", "\"What counts is not necessarily the size of the dog in the fight - it's the size of the fight in the dog.\" - Dwight D. Eisenhower", "If you don't stand for something, you will fall for anything.", "Tiocfaidh ár lá", "https://www.twitch.tv/itsastronomics", "Wow, a cow made of butter. My girls would love it. In fact, the first sentence Caroline ever said was \"I like Butter.\" - Ted Cruz", "The plan is to fan this spark into a flame but damn, it's getting dark"]
    //nct_stuff.quotes = [`It's cold outside, no kind of atmosphere!`, `I'll be honest, I reused the Christmas code from last year.`, `Turles planted the Christmas Tree of Might!`, `"I am Champion Christmas" - Son Goku`, `Let me <em>flyyyy</em> far away from here`, `2019NK is just the start`, `Waiting for Sumner 68`, `"Cold of the winter, snow settles on my face" - Christmas Khamsin`, `Do you believe in gravity?`, `Who was the person who decided to makes quotes that overflow over the text width limit, y'know I specifically tried to avoid this when making the NCT quote section >:(`, `Denying Reagan his Christmas present since 1984`, `[insert unfunny community injoke here]`, `<button onclick='alert("Made mod.")'>Click here to make mod</button>`, `Merry Holidays.`, `Happy Christmas.`, `SONS OF LIBERTY - COMING OUT 2050`, `Florida has a date with the bottom of the ocean`, `Patch 1.02 - Removed Ohio`, `Enjoying our Charlie Cristmas`, `Ron Desanta - that's it, that's the quote.`]
quotnum = Math.floor((Math.random() * nct_stuff.quotes.length))
quote = nct_stuff.quotes[quotnum]

// Caching frequently accessed elements and values
let correctbannerpar = document.getElementsByClassName("game_header")[0]
correctbannerpar.innerHTML += "<font id='wittyquote' size='4' color='white'><em>" + quote + "</em></font>"
corrr = correctbannerpar.innerHTML
var corrr = correctbannerpar.innerHTML
var header = $('#header')[0];
var gameHeader = document.getElementsByClassName("game_header")[0];
var gameWindow = $("#game_window")[0];
var container = $(".container")[0];
var campaignTrailMusic = document.getElementById('campaigntrailmusic');
// Create a style element
var dynamicStyle = document.createElement('style');
document.head.appendChild(dynamicStyle);

// Update banner and styling
function updateBannerAndStyling() {
    header.src = selectedTheme.banner;
    header.width = 1000;
    document.body.background = selectedTheme.background;
    gameWindow.style.backgroundColor = selectedTheme.coloring_window;
    container.style.backgroundColor = selectedTheme.coloring_container;
    gameHeader.style.backgroundColor = selectedTheme.coloring_title;

    if (selectedTheme.text_col != null) {
        container.style.color = selectedTheme.text_col;
        gameWindow.style.color = "black";
    }
}

// Update inner windows styling
function updateInnerWindowsStyling() {
    var innerWindow2 = document.getElementById("inner_window_2");
    var innerWindow3 = document.getElementById("inner_window_3");
    var innerWindow4 = document.getElementById("inner_window_4");
    var innerWindow5 = document.getElementById("inner_window_5");

    if (innerWindow2 != null) {
        innerWindow2.style.backgroundColor = selectedTheme.coloring_window;
    } else if (innerWindow3 != null) {
        innerWindow3.style.backgroundColor = selectedTheme.coloring_window;
    }

    if (innerWindow4 != null) {
        innerWindow4.style.backgroundColor = selectedTheme.coloring_window;
    }

    if (innerWindow5 != null) {
        innerWindow5.style.backgroundColor = selectedTheme.coloring_window;
    }
}

// Update game header content and styling
function updateGameHeaderContentAndStyling() {
    let gameHeader = $(".game_header")[0];
    if (gameHeader.innerHTML != corrr) {
        gameHeader.innerHTML = corrr;
    }
    gameHeader.style.backgroundColor = selectedTheme.coloring_title;
    updateInnerWindowsStyling();
}

// Update CSS rules in the style element
function updateDynamicStyle() {
    if (nct_stuff.dynamicOverride) {
        return;
    }
    let background_size_css = "";
    if (selectedTheme.background_cover) {
        background_size_css = "background-size: cover"
    }
    let dynaStyle = `
    #header {
        src: ${selectedTheme.banner};
        width: 1000px;
    }
    body {
        background: ${selectedTheme.background};
        ${background_size_css};
    }
    #game_window {
        background-color: ${selectedTheme.coloring_window};
        color: black;
        background-image: ${selectedTheme.window_url ? "url(" + selectedTheme.window_url + ")" : $("#game_window")[0].style.backgroundImage};
    }
    .container {
        background-color: ${selectedTheme.coloring_container};
        color: ${selectedTheme.text_col || "inherit"};
    }
    .game_header {
        background-color: ${selectedTheme.coloring_title};
    }
    #inner_window_2 {
        background-color: ${selectedTheme.coloring_window};
    }
    #inner_window_3 {
        background-color: ${selectedTheme.coloring_window};
    }
    #inner_window_4 {
        background-color: ${selectedTheme.coloring_window};
    }
    #inner_window_5 {
        background-color: ${selectedTheme.coloring_window};
    }  
    #main_content_area {
        color: ${selectedTheme.text_col || "inherit"};
        
    }
    #main_content_area_reading {
        color: ${selectedTheme.text_col || "inherit"};
    }
    #main_content_area table {
        color: black;
    }
    #menu_container {
        color: black;
    }
    `;
    if (e.ending_shadow) {
        dynaStyle += `
        #final_results_description, #difficulty_mult, #overall_details_container h3, #overall_details_container h4 {
            text-shadow: 0px 0px 7px black;
        }
        #results_container h3, #results_container h4, .results_tab_header {
            text-shadow: 0px 0px 7px black;
        }
        `
    }
    if (selectedTheme.map_url) {
        dynaStyle += `
        #map_container {
            background-image: ${selectedTheme.map_url ? "url(" + selectedTheme.map_url + ")" : `url("")`};
            background-size: cover;
        }
        `
    }
    if (dynamicStyle.innerHTML != dynaStyle) {
        dynamicStyle.innerHTML = dynaStyle;
    }
}

// Update banner, styling, and game header on interval
setInterval(function() {
    if (JSON.stringify(nct_stuff.custom_override) != JSON.stringify(selectedTheme) && !nct_stuff.dynamicOverride && nct_stuff.custom_override) {
        nct_stuff.themes[nct_stuff.selectedTheme] = strCopy(nct_stuff.custom_override);
        selectedTheme = nct_stuff.themes[nct_stuff.selectedTheme];
        $("#game_window")[0].style.backgroundImage = "";
        updateBannerAndStyling()
    } else if (!nct_stuff.custom_override && nct_stuff.selectedTheme == "custom" && modded && selectedTheme.window_url) {
        selectedTheme.window_url = null;
    }
    let gameHeader = $(".game_header")[0];
    if (gameHeader.innerHTML != corrr) {
        gameHeader.innerHTML = corrr;
    }
    gameHeader.style.backgroundColor = selectedTheme.coloring_title;
    updateDynamicStyle();
    corrr=gameHeader.innerHTML;
    //updateGameHeaderContentAndStyling();
}, 100);


if (nct_stuff.christmas != true) {
    // Update banner and styling
    updateBannerAndStyling();

    // Play music if available
    if (selectedTheme.music != null) {
        document.getElementById("music_player").style.display = "";
        campaignTrailMusic.src = selectedTheme.music;
        campaignTrailMusic.autoplay = true;
    }
} else {
    nct_stuff.themes = {
        "christmas": {
            name: "jesus christ",
            background: "../static/images/background_christmas.jpg",
            banner: "../static/images/banner_christmas_" + susnum + ".png",
            coloring_window: "#8D3A3D",
            coloring_container: "#871d0d",
            coloring_title: "#194260",
            music: "../static/audio/christmas.mp3"
        }
    };
    nct_stuff.selectedTheme = "christmas"
    selectedTheme = nct_stuff.themes.christmas;

    // Update banner and styling
    //updateBannerAndStyling();

    // Update game header content and styling
    //updateGameHeaderContentAndStyling();

    updateDynamicStyle();

    // Play music if available
    if (selectedTheme.music != null) {
        document.getElementById("music_player").style.display = "";
        campaignTrailMusic.src = selectedTheme.music;
        campaignTrailMusic.autoplay = true;
    }
}

// CUSTOM THEME MANAGER

open_first_gate = (e) => { // gate of opening
    e.preventDefault();
    let menu_area = $("#bonus_menu_area")[0];
    menu_area.style.display = "block";

    /*
        name: "Custom",
        background: "",
        banner: "",
        coloring_window: "",
        coloring_container: "",
        coloring_title: ""
    */

    let th = window.localStorage.getItem("custom_theme");

    menu_area.innerHTML = `
    <div class='prometh'>
    <h3>Custom Theme Menu</h3>
    <p>Background Image URL: <input id='background_url' placeholder='Link directly to the image.' /></p>
    <p>Background Image Covers?: <input id='background_cover' type='checkbox' /></p>
    <p>Banner Image URL (suggested dimensions: 1000x303): <input id='banner_url' placeholder='Link directly to the image.' /></p>
    <p>Window Image URL (<b>OPTIONAL</b>, WILL LOOK BAD IF YOU DON'T KNOW WHAT YOU'RE DOING): <input id='window_url' placeholder='Link directly to the image.' /></p>
    <p>Window Colouring: <input id='window_colour' type='color' /></p>
    <p>Container Colouring: <input id='cont_colour' type='color' /></p>
    <p>Title Colouring: <input id='title_colour' type='color' /></p>
    <p>Text Colouring: <input id='text_colour' type='color' /></p>
    <p>Override Mod Themes? (experimental): <input id='mod_override' type='checkbox' /></p>

    <button id='prometh_save'>Save</button>
    </div>
    `

    if (th) {
        let theme = JSON.parse(th);
        $("#background_url").val(theme.background);
        $("#background_cover")[0].checked = theme.background_cover;
        $("#banner_url").val(theme.banner);
        $("#window_url").val(theme.window_url)
        $("#window_colour").val(theme.coloring_window);
        $("#cont_colour").val(theme.coloring_container);
        $("#title_colour").val(theme.coloring_title);
        $("#text_colour").val(theme.text_col);
        $("#mod_override")[0].checked = theme.mod_override;
    }

    $("#prometheus_button").off("click").click(open_fifth_gate);

    $("#prometh_save").click(() => {
        let theme = {
            name: "Custom",
            background: $("#background_url").val(),
            background_cover: $("#background_cover")[0].checked,
            banner: $("#banner_url").val(),
            coloring_window: $("#window_colour").val(),
            coloring_container: $("#cont_colour").val(),
            coloring_title: $("#title_colour").val(),
            text_col: $("#text_colour").val(),
            mod_override: $("#mod_override")[0].checked,
            window_url: $("#window_url").val()
        }
        nct_stuff.themes[nct_stuff.selectedTheme] = theme;
        selectedTheme = theme;
        updateBannerAndStyling();
        if (theme.mod_override) {
            updateDynamicStyle();
            nct_stuff.custom_override = JSON.parse(JSON.stringify(theme));
        } else {
            nct_stuff.custom_override = null;
        }

        window.localStorage.setItem("custom_theme", JSON.stringify(theme));
    })
}

open_fifth_gate = (e) => { // gate of closing
    e.preventDefault();
    let menu_area = $("#bonus_menu_area")[0];
    menu_area.style.display = "none";

    // close menu
    let m_children = Array.from(menu_area.children);
    m_children.forEach(f => f.remove());

    $("#prometheus_button").off("click").click(open_first_gate);
}


if (nct_stuff.selectedTheme == "custom") {
    let themePicker = $("#theme_picker")[0];

    let theme_man_button = document.createElement("p");
    theme_man_button.innerHTML = "<button id='prometheus_button'><b>Prometheus' Menu</b></button>";

    themePicker.appendChild(theme_man_button);

    var prometheusStyle = document.createElement('style');
    prometheusStyle.innerHTML = `
    #bonus_menu_area {
        position: relative;
        width: 500px;
        height: 200px;
        display: none;
        text-align: right;
        left: 45%;
    }
    
    .prometh {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #595959;
        border: 3px solid black;
        color: white;
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
    }
    `
    document.head.appendChild(prometheusStyle);

    $("#prometheus_button").click(open_first_gate);

    let th = window.localStorage.getItem("custom_theme");
    if (th) {
        let theme = JSON.parse(th);
        nct_stuff.themes[nct_stuff.selectedTheme] = theme;
        selectedTheme = theme;
        updateBannerAndStyling();
        if (theme.mod_override) {
            updateDynamicStyle();
            nct_stuff.custom_override = JSON.parse(JSON.stringify(theme));
        }
    }
}


function loadJSON(path, varr, callback = () => {}) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                eval(varr + "=JSON.parse(" + JSON.stringify(xhr.responseText.trim()) + ")");
                callback()
            } else {
                return xhr;
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

strCopy = (toCopy) => {
    let copy = JSON.parse(JSON.stringify(toCopy));
    return copy;
}

var campaignTrail_temp = {};
ree = {}

campaignTrail_temp.election_json = {}
campaignTrail_temp.candidate_json = {}
loadJSON("../static/json/election.json", "campaignTrail_temp.election_json", () => {
    ree.election_json = strCopy(campaignTrail_temp.election_json);
})
loadJSON("../static/json/candidate.json", "campaignTrail_temp.candidate_json", () => {
    ree.candidate_json = strCopy(campaignTrail_temp.candidate_json);
})
loadJSON("../static/json/running_mate.json", "campaignTrail_temp.running_mate_json", () => {
    ree.running_mate_json = strCopy(campaignTrail_temp.running_mate_json);
})
loadJSON("../static/json/opponents.json", "campaignTrail_temp.opponents_default_json", () => {
    ree.opponents_default_json = strCopy(campaignTrail_temp.opponents_default_json);
})
loadJSON("../static/json/opponents.json", "campaignTrail_temp.opponents_weighted_json", () => {
    ree.opponents_weighted_json = strCopy(campaignTrail_temp.opponents_weighted_json);
})
loadJSON("../static/json/election_list.json", "campaignTrail_temp.temp_election_list", () => {
    ree.temp_election_list = strCopy(campaignTrail_temp.temp_election_list);
})

campaignTrail_temp.difficulty_level_json = JSON.parse("[{\"model\": \"campaign_trail.difficulty_level\", \"pk\": 1, \"fields\": {\"name\": \"Cakewalk\", \"multiplier\": 1.33}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 2, \"fields\": {\"name\": \"Very Easy\", \"multiplier\": 1.2}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 3, \"fields\": {\"name\": \"Easy\", \"multiplier\": 1.1}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 4, \"fields\": {\"name\": \"Normal\", \"multiplier\": 0.97}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 5, \"fields\": {\"name\": \"Hard\", \"multiplier\": 0.95}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 6, \"fields\": {\"name\": \"Impossible\", \"multiplier\": 0.9}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 7, \"fields\": {\"name\": \"Unthinkable\", \"multiplier\": 0.83}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 8, \"fields\": {\"name\": \"Blowout\", \"multiplier\": 0.75}}, {\"model\": \"campaign_trail.difficulty_level\", \"pk\": 9, \"fields\": {\"name\": \"Disaster\", \"multiplier\": 0.68}}]");
campaignTrail_temp.global_parameter_json = JSON.parse("[{\"model\": \"campaign_trail.global_parameter\", \"pk\": 1, \"fields\": {\"vote_variable\": 1.125, \"max_swing\": 0.12, \"start_point\": 0.94, \"candidate_issue_weight\": 10.0, \"running_mate_issue_weight\": 3.0, \"issue_stance_1_max\": -0.71, \"issue_stance_2_max\": -0.3, \"issue_stance_3_max\": -0.125, \"issue_stance_4_max\": 0.125, \"issue_stance_5_max\": 0.3, \"issue_stance_6_max\": 0.71, \"global_variance\": 0.01, \"state_variance\": 0.005, \"question_count\": 25, \"default_map_color_hex\": \"#C9C9C9\", \"no_state_map_color_hex\": \"#999999\"}}]");
campaignTrail_temp.candidate_dropout_json = JSON.parse("[{\"model\": \"campaign_trail.candidate_dropout\", \"pk\": 1, \"fields\": {\"candidate\": 36, \"affected_candidate\": 18, \"probability\": 1.0}}]");
campaignTrail_temp.show_premium = true;
campaignTrail_temp.premier_ab_test_version = -1;
campaignTrail_temp.credits = "ロボトン"
