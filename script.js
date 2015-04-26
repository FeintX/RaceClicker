// JQuery 
$(document).ready(function(){

// Setting initial variables
var driverLevel = 1;
var driverUpgradeCost = 100;
var carLevel = 1;
var carUpgradeCost = 100;
var raceLevel = 1;
var raceUpgradeCost = 100;
var cashFlow = 0;
var disableStart = false;
updateStats();

$("#start-race").click(function() {
    if (disableStart == false) {
        toggleStartButton();
        $("#progress").animate({width: '100%'}, 5000, 'linear').animate({width: '0%'}, 0);
        setTimeout(runRace, 5000);     
    }
})

$("#upgrade-driver").click(function() {
    upgradeDriver();
})

$("#upgrade-car").click(function() {
    upgradeCar();
})

$("#upgrade-race").click(function() {
    upgradeRace();
})

// Updating Stats
function updateStats() {
    $("#money").text("Money: $" + cashFlow);
    $("#driver-level").text("Driver Level: " + driverLevel);
    $('#upgrade-driver').text("Train Driver ($" + driverUpgradeCost + ")")
    $("#car-level").text("Car Level: " + carLevel);
    $('#upgrade-car').text("Upgrade Car ($" + carUpgradeCost + ")")
    $("#race-level").text("Race Level: " + raceLevel);
    $('#upgrade-race').text("Next Race Level ($" + raceUpgradeCost + ")")

    if (carUpgradeCost > cashFlow) {
        $("#upgrade-car").addClass("disabled");
    } else if (carUpgradeCost <= cashFlow) {
        $("#upgrade-car").removeClass("disabled");
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
        $("#start-race").addClass("disabled").text("--Racing--");
    }
}

// Race calculations
function runRace() {
    var raceRandom = Math.floor((Math.random() * 50 * raceLevel) + 1);
    var raceSkill = (carLevel * 20) + driverLevel;
    if (raceSkill > raceRandom) {
        cashFlow = cashFlow + (raceLevel * 50);
        updateStats();
        toggleStartButton();
        
    } else {
        toggleStartButton();
        
    }
}

// Upgrading Driver skill
function upgradeDriver() {
    if (driverUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - driverUpgradeCost;
        driverLevel ++;
        driverUpgradeCost = Math.floor(driverUpgradeCost * 1.05);
        updateStats();
    }
}

// Upgrading Car level
function upgradeCar() {
    if (carUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - carUpgradeCost;
        carLevel ++;
        carUpgradeCost = Math.floor(carUpgradeCost * 1.75);
        updateStats();
    }
}

// Upgrading race level
function upgradeRace() {
    if (raceUpgradeCost <= cashFlow) {
        cashFlow = cashFlow - raceUpgradeCost;
        raceLevel ++;
        raceUpgradeCost = Math.floor(raceUpgradeCost * 2);
        updateStats();
    }
}

// Toggles visual button state on mouseover
    $(".button").mouseenter(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).addClass("pressed").animate({top: '+=1px'}, 100);
        }
    });

    $(".button").mouseleave(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).removeClass("pressed").animate({top: '-=1px'}, 100);
        }
    });

})