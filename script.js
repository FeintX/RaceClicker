// JQuery 
$(document).ready(function(){

/*  Below is for when I corrupt the local storage.  I should write some kind
    of test to check if local storage is corrupted. */ 
//localStorage.clear();

/*  I can't remember why I had to do this, but I couldn't get the result box
    to be invisible when the game loads otherwise. */
$("#result-box").fadeOut(0);


var savedVariables = ["driverLevel", "driverUpgradeCost", "carLevel",
    "raceLevel", "raceUpgradeCost", "racePrize", "engineUpgradeCurrent",
    "suspUpgradeCurrent", "transUpgradeCurrent", "tireUpgradeCurrent",
    "cashFlow", "workClicks", "workValue"];

/*  Declaring variables for car upgrade names, costs, and values.  I could
    probably do these as objects and it would look more elegant. */
var engineUpgrades = ["Cold Air Intake", "Performance Exhaust System",
    "ECU Tune", "Stage 2 Camshaft", "Race Pistons and Crankshaft",
    "Full Race Exhaust", "Racing Camshaft"];
var engineUpgradeCost = [150, 250, 500, 750, 1500, 2000, 2500];
var engineUpgradeValue = [1, 1, 2, 2, 2, 2, 2];

var suspUpgrades = ["Performance Struts and Springs",
    "Coilover Suspension", "Full Race Suspension"];
var suspUpgradeCost = [500, 2000, 5000];
var suspUpgradeValue = [2, 2, 3];

var transUpgrades = ["5-Speed Manual Transmission", "Stage II Clutch",
    "Limited Slip Differential", "Carbon Fiber Driveshaft",
    "Racing Rear Axle", "Racing Clutch", "Racing Sequential Transmission"];
var transUpgradeCost = [750, 1000, 1500, 1750, 2000, 2500, 5000];

var tireUpgrades = ["Performance All Season Tires",
    "High Performance Summer Tires", "Extreme Performance Summer Tires",
    "Semi Slick Racing Tires", "Slick Racing Tires"];
var tireUpgradeCost = [1000, 2000, 3000, 5000, 10000];
var tireUpgradeValue = [2, 2, 3, 3, 4];

/*  Check if there is saved game data and loads it if it exists.
    Otherwise sets game to starting state. */
if (localStorage.getItem("cashFlow") != null) {
    loadGame();
} else {
    resetGame();
}

/*  Set game to starting state */
function resetGame() {
    localStorage.clear();
    driverLevel = 50;
    driverUpgradeCost = 100;
    carLevel = 25;
    raceLevel = 1;
    raceUpgradeCost = 100;
    racePrize = 50;
    engineUpgradeCurrent = 0;
    suspUpgradeCurrent = 0;
    transUpgradeCurrent = 0;
    tireUpgradeCurrent = 0;
    cashFlow = 0;
    workClicks = 0;
    workValue = 1;
    disableStart = false;
    updateStats();
}

function saveGame() {
    var i;
    for (i in savedVariables) {
        storeVariable(savedVariables[i]);
    }
}

function loadGame() {
    var i;
    for (i in savedVariables) {
        window[savedVariables[i]] = loadVariable(savedVariables[i]);
    }
    disableStart = false;
    updateStats();
}

function storeVariable(variableName) {
    var thisVar = window[variableName];
    localStorage.setItem(variableName, JSON.stringify(thisVar));
}

function loadVariable(variableName) {
    var temp = localStorage.getItem(variableName);
    return JSON.parse(temp);
}

$("#start-race").click(function() {
    if (disableStart == false) {
        toggleStartButton();
        runRace();
    }
})

function runRace() {
    var oppRace = 21000 - ((raceLevel - 1) * 1750) -
        Math.floor((Math.random() * 2501));
    var playRace = Math.floor(250000 / (carLevel * (driverLevel / 100)));
    var raceAnim = Math.floor(Math.random() * 4);
    var tempPrize = racePrize;
    switch (raceAnim) {
        case 0:
            $("#progress").animate({width: '100%'}, playRace, 'easeInQuad');
            $("#progressopp").animate({width: '100%'}, oppRace, 'easeInQuad');
            break;
        case 1:
            $("#progress").animate({width: '100%'}, playRace, 'easeInCubic');
            $("#progressopp").animate({width: '100%'}, oppRace, 'easeInQuad');
            break;
        case 2:
            $("#progress").animate({width: '100%'}, playRace, 'easeInQuad');
            $("#progressopp").animate({width: '100%'}, oppRace, 'easeInCubic');
            break;
        case 3:
            $("#progress").animate({width: '100%'}, playRace, 'easeInCubic');
            $("#progressopp").animate({width: '100%'}, oppRace, 'easeInCubic');
            break;
    }
    if (playRace <= oppRace) {
        setTimeout(function() {
            $("#result-box").text("+$" + (tempPrize)).
                fadeIn(100).delay(300).fadeOut(800);
            cashFlow += racePrize;
            updateStats();
            $("#progress").animate({width: '0%'}, 0);
            $("#progressopp").animate({width: '0%'}, 0);
            toggleStartButton();
        }, oppRace);
    } else {
        setTimeout(function() {
            $("#result-box").text("You Lose!").fadeIn(100).
                delay(300).fadeOut(800);
            $("#progress").animate({width: '0%'}, 0);
            $("#progressopp").animate({width: '0%'}, 0);
            toggleStartButton();
        }, playRace);
    }
}

$("#work").click(function() {
    cashFlow += workValue;
    workClicks ++;
    if (workClicks >= Math.pow(100, workValue)) {
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

// Updating Stats
function updateStats() {
    $("#money").text("Cash: $" + cashFlow);
    $("#driver-level").text("Driver Skill: " + driverLevel);
    $('#upgrade-driver').text("Train Driver ($" + driverUpgradeCost + ")")
    $("#car-level").text("Car Performance: " + carLevel);
    $("#race-level").text("Race Level: " + raceLevel);
    $('#upgrade-race').text("Next Race Level ($" + raceUpgradeCost + ")")
    $("#work").text("Work +$" + workValue);

    // Engine Components
    if (engineUpgradeCurrent == engineUpgrades.length) {
        $("#car-engine").addClass("disabled").
            text("Max Upgrades");
    } else {
        $("#car-engine").text(engineUpgrades[engineUpgradeCurrent] + " $" +
            engineUpgradeCost[engineUpgradeCurrent]);
    }
    if (engineUpgradeCost[engineUpgradeCurrent] > cashFlow) {
        $("#car-engine").addClass("disabled");
    } else if (engineUpgradeCost[engineUpgradeCurrent] <= cashFlow) {
        $("#car-engine").removeClass("disabled");
    }

    // Suspension Components
    if (suspUpgradeCurrent == suspUpgrades.length) {
        $("#car-suspension").addClass("disabled").
            text("Max Upgrades");
    } else {
        $("#car-suspension").text(suspUpgrades[suspUpgradeCurrent] + " $" +
            suspUpgradeCost[suspUpgradeCurrent]);
    }
    if (suspUpgradeCost[suspUpgradeCurrent] > cashFlow) {
        $("#car-suspension").addClass("disabled");
    } else if (suspUpgradeCost[suspUpgradeCurrent] <= cashFlow) {
        $("#car-suspension").removeClass("disabled");
    }

    // Transmission Components
    if (transUpgradeCurrent == transUpgrades.length) {
        $("#car-transmission").addClass("disabled").
            text("Max Upgrades");
    } else {
        $("#car-transmission").text(transUpgrades[transUpgradeCurrent] + " $" +
            transUpgradeCost[transUpgradeCurrent]);
    }
    if (transUpgradeCost[transUpgradeCurrent] > cashFlow) {
        $("#car-transmission").addClass("disabled");
    } else if (transUpgradeCost[transUpgradeCurrent] <= cashFlow) {
        $("#car-transmission").removeClass("disabled");
    }

    // Tire Components
    if (tireUpgradeCurrent == tireUpgrades.length) {
        $("#car-tires").addClass("disabled").
            text("Max Upgrades");
    } else {
        $("#car-tires").text(tireUpgrades[tireUpgradeCurrent] + " $" +
           tireUpgradeCost[tireUpgradeCurrent]);
    }
    if (tireUpgradeCost[tireUpgradeCurrent] > cashFlow) {
        $("#car-tires").addClass("disabled");
    } else if (tireUpgradeCost[tireUpgradeCurrent] <= cashFlow) {
        $("#car-tires").removeClass("disabled");
    }

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

//Toggle Start button
function toggleStartButton() {
    if (disableStart == true) {
        disableStart = false;
        $("#start-race").removeClass("disabled").text("Start Race!");

    } else {
        disableStart = true;
        $("#start-race").addClass("disabled").text("Racing");
    }
}

// Upgrading Driver skill
function upgradeDriver() {
    if (driverUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - driverUpgradeCost;
        driverLevel ++;
        driverUpgradeCost = Math.floor(driverUpgradeCost * 1.1);
        updateStats();
    }
}

// Upgrading race level
function upgradeRace() {
    if (raceUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - raceUpgradeCost;
        raceLevel ++;
        racePrize += raceLevel * 25;
        raceUpgradeCost = Math.floor(raceUpgradeCost * 2);
        updateStats();
    }
}


// Upgrade Engine Components
$("#car-engine").click(function() {
    var max = engineUpgrades.length;
    if (engineUpgradeCurrent < max) {
        if (engineUpgradeCost[engineUpgradeCurrent] <= cashFlow) {
            cashFlow -= engineUpgradeCost[engineUpgradeCurrent];
            carLevel += engineUpgradeValue[engineUpgradeCurrent];
            engineUpgradeCurrent ++;
            updateStats();
        }
    }
})

// Upgrade Suspension Components
$("#car-suspension").click(function() {
    var max = suspUpgrades.length;
    if (suspUpgradeCurrent < max) {
        if (suspUpgradeCost[suspUpgradeCurrent] <= cashFlow) {
            cashFlow -= suspUpgradeCost[suspUpgradeCurrent];
            carLevel += suspUpgradeValue[suspUpgradeCurrent];
            suspUpgradeCurrent ++;
            updateStats();
        }
    }
})

// Upgrade Transmission Components
$("#car-transmission").click(function() {
    var max = transUpgrades.length;
    if (transUpgradeCurrent < max) {
        if (transUpgradeCost[transUpgradeCurrent] <= cashFlow) {
            cashFlow -= transUpgradeCost[transUpgradeCurrent];
            carLevel += transUpgradeValue[transUpgradeCurrent];
            transUpgradeCurrent ++;
            updateStats();
        }
    }
})

// Upgrade Tire Components
$("#car-tires").click(function() {
    var max = tireUpgrades.length;
    if (tireUpgradeCurrent < max) {
        if (tireUpgradeCost[tireUpgradeCurrent] <= cashFlow) {
            cashFlow -= tireUpgradeCost[tireUpgradeCurrent];
            carLevel += tireUpgradeValue[tireUpgradeCurrent];
            tireUpgradeCurrent ++;
            updateStats();
        }
    }
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