// JQuery 
$(document).ready(function(){

/*  Below is for when I corrupt the local storage.  I should write some kind
    of test to check if local storage is corrupted. */ 
//localStorage.clear();

/*  I can't remember why I had to do this, but I couldn't get the result box
    to be invisible when the game loads otherwise. */
$("#result-box").fadeOut(0);


var savedVariables = ["driverLevel", "driverUpgradeCost", "carLevel",
    "raceLevel", "raceUpgradeCost", "racePrize", "engineCurrent",
    "suspensionCurrent", "transmissionCurrent", "tiresCurrent",
    "cashFlow", "workClicks", "workValue"];

/*  Declaring variables for car upgrade names, costs, and values. */
var engine = {
    type: "engine",
    name: ["Cold Air Intake", "Performance Exhaust System",
        "ECU Tune", "Stage 2 Camshaft", "Race Pistons and Crankshaft",
        "Full Race Exhaust", "Racing Camshaft"],
    cost: [150, 250, 500, 750, 1500, 2000, 2500],
    value: [1, 1, 2, 2, 2, 2, 2]
}

var suspension = {
    type: "suspension",
    name: ["Performance Struts and Springs",
        "Coilover Suspension", "Full Race Suspension"],
    cost: [500, 2000, 5000],
    value: [2, 2, 3]
}

var transmission = {
    type: "transmission",
    name: ["5-Speed Manual Transmission", "Stage II Clutch",
        "Limited Slip Differential", "Carbon Fiber Driveshaft",
        "Racing Rear Axle", "Racing Clutch", "Racing Sequential Transmission"],
    cost: [750, 1000, 1500, 1750, 2000, 2500, 5000],
    value: [2, 2, 2, 2, 2, 2, 3]
}

var tires = {
    type: "tires",
    name: ["Performance All Season Tires",
        "High Performance Summer Tires", "Extreme Performance Summer Tires",
        "Semi Slick Racing Tires", "Slick Racing Tires"],
    cost: [1000, 2000, 3000, 5000, 10000],
    value: [2, 2, 3, 3, 4]
}

var tickSpeed = 25;


/*  Check if there is saved game data and loads it if it exists.
    Otherwise sets game to starting state. */
if (localStorage.getItem("cashFlow") != null) {
    loadGame();
} else {
    resetGame();
}

function resetGame() {
    localStorage.clear();
    driverLevel = 50;
    driverUpgradeCost = 100;
    carLevel = 25;
    raceLevel = 1;
    raceUpgradeCost = 100;
    racePrize = 100;
    engineCurrent = 0;
    suspensionCurrent = 0;
    transmissionCurrent = 0;
    tiresCurrent = 0;
    cashFlow = 0;
    workClicks = 0;
    workValue = 1;
    disableStart = false;
    updateStats();
}

function saveGame() {
    for (let i in savedVariables) {
        storeVariable(savedVariables[i]);
    }
}

function loadGame() {
    for (let i in savedVariables) {
        window[savedVariables[i]] = loadVariable(savedVariables[i]);
    }
    disableStart = false;
    updateStats();
}

function storeVariable(variableName) {
    let thisVar = window[variableName];
    localStorage.setItem(variableName, JSON.stringify(thisVar));
}

function loadVariable(variableName) {
    let temp = localStorage.getItem(variableName);
    return JSON.parse(temp);
}

function runRace() {
    let tempPrize = racePrize;
    let playSpeed = 0;
    let playProgress = 0;

    let oppSpeed = 0;
    let oppProgress = 0;
    let oppSkill = (raceLevel * 5) + 20;
    let oppCar = (raceLevel * 7) + 20;

    animateRace();

    function animateRace() {
        setTimeout(function() {
            calcPlayerSpeed(playSpeed);
            calcOppSpeed(oppSpeed);
            playProgress += playSpeed;
            oppProgress += oppSpeed;
            let playProgAnim = Math.round(playProgress) + "px";
            let oppProgAnim = Math.round(oppProgress) + "px";
            $("#progress").animate({width: playProgAnim}, 0);
            $("#progressopp").animate({width: oppProgAnim}, 0);
            if (playProgress < 608 && oppProgress < 608) {
                animateRace();
            } else {
                if (playProgress >= oppProgress) {
                    $("#result-box").text("+$" + (tempPrize)).
                    fadeIn(100).delay(300).fadeOut(800);
                    cashFlow += racePrize;
                    updateStats();
                    $("#progress").animate({width: '0%'}, 0);
                    $("#progressopp").animate({width: '0%'}, 0);
                    toggleStartButton();
                } else {
                     $("#result-box").text("You Lose!").fadeIn(100).
                    delay(300).fadeOut(800);
                    $("#progress").animate({width: '0%'}, 0);
                    $("#progressopp").animate({width: '0%'}, 0);
                    toggleStartButton();
                }
            }
        }, tickSpeed);

    };

    function calcPlayerSpeed(currentSpeed) {
        if (currentSpeed == 0) {
            let reactionTime = Math.floor(Math.random() * 100);
            if (driverLevel > reactionTime) {
                playSpeed = (driverLevel / reactionTime) * carLevel / (tickSpeed * 200);
            }
        } else if (currentSpeed < 1) {
            playSpeed += carLevel / (tickSpeed * (200 - driverLevel));
        } else {
            playSpeed += carLevel / (tickSpeed * 100);
        }
    }

    function calcOppSpeed(currentSpeed) {
        if (currentSpeed == 0) {
            let reactionTime = Math.floor(Math.random() * 100);
            if (oppSkill > reactionTime) {
                oppSpeed = (oppSkill / reactionTime) * oppCar / (tickSpeed * 200);
            }
        } else if (currentSpeed < 1) {
            oppSpeed += oppCar / (tickSpeed * (200 - oppSkill));
        } else {
            oppSpeed += oppCar / (tickSpeed * 100);
        }
    }   
}

function updateStats() {
    $("#money").text("Cash: $" + cashFlow);
    $("#driver-level").text("Driver Skill: " + driverLevel);
    $('#upgrade-driver').text("Train Driver ($" + driverUpgradeCost + ")")
    $("#car-level").text("Car Performance: " + carLevel);
    $("#race-level").text("Race Level: " + raceLevel);
    $('#upgrade-race').text("Next Race Level ($" + raceUpgradeCost + ")")
    $("#work").text("Work +$" + workValue);

    checkComponent(engine);
    checkComponent(suspension);
    checkComponent(transmission);
    checkComponent(tires);

    if (driverUpgradeCost > cashFlow) {
        $("#upgrade-driver").addClass("disabled");
    } else if (driverUpgradeCost <= cashFlow) {
        $("#upgrade-driver").removeClass("disabled");
    }

    if (raceUpgradeCost > cashFlow) {
        $("#upgrade-race").addClass("disabled");
    } else if (raceUpgradeCost <= cashFlow) {
        $("#upgrade-race").removeClass("disabled");
    }
}

function checkComponent(component) {
    let current = window[component.type + "Current"];
    let selector = "#car-" + component.type;
    if (current == component.name.length) {
        $(selector).addClass("disabled").
            text("Max Upgrades");
    } else {
        $(selector).text(component.name[current] + " $" +
            component.cost[current]);
    }
    if (component.cost[current] > cashFlow) {
        $(selector).addClass("disabled");
    } else if (component.cost[current] <= cashFlow) {
        $(selector).removeClass("disabled");
    }
}

function toggleStartButton() {
    if (disableStart == true) {
        disableStart = false;
        $("#start-race").removeClass("disabled").text("Start Race!");

    } else {
        disableStart = true;
        $("#start-race").addClass("disabled").text("Racing");
    }
}

function upgradeDriver() {
    if (driverUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - driverUpgradeCost;
        driverLevel ++;
        driverUpgradeCost = Math.floor(driverUpgradeCost * 1.1);
        updateStats();
    }
}

function upgradeRace() {
    if (raceUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - raceUpgradeCost;
        raceLevel ++;
        racePrize += raceLevel * 50;
        raceUpgradeCost = Math.floor(raceUpgradeCost * 2);
        updateStats();
    }
}

function upgradeComponent(component) {
    if (window[component.type + "Current"] < component.name.length) {
        if (component.cost[window[component.type + "Current"]] <= cashFlow) {
            cashFlow -= component.cost[window[component.type + "Current"]];
            carLevel += component.value[window[component.type + "Current"]];
            window[component.type + "Current"] ++;
            updateStats();
        }
    }
}

$("#start-race").click(function() {
    if (disableStart == false) {
        toggleStartButton();
        runRace();
    }
})

$("#work").click(function() {
    cashFlow += workValue;
    workClicks ++;
    if (workClicks >= (Math.pow(workValue, workValue) * 10)) {
        workValue ++;
    }
    updateStats();
})

$("#upgrade-driver").click(function() {
    upgradeDriver();
})

$("#upgrade-race").click(function() {
    upgradeRace();
})

$("#reset").click(function() {
    resetGame();
})

$("#save").click(function() {
    saveGame();
})

$("#car-engine").click(function() {
    upgradeComponent(engine);
})

$("#car-suspension").click(function() {
    upgradeComponent(suspension);
})

$("#car-transmission").click(function() {
    upgradeComponent(transmission);
})

$("#car-tires").click(function() {
    upgradeComponent(tires);
})

// Toggles visual button state on mouseover
    $(".button").mouseenter(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).addClass("pressed").animate({top: '+1px'}, 50);
        }
    });

    $(".button").mouseleave(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).removeClass("pressed").animate({top: '-1px'}, 50);
        }
    });

})