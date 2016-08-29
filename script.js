$(document).ready(function(){

$(".race-start").text("Race!");
$(".race-upgrade").text("Upgrade");

var raceModulesActive = 0;

function createRaceModule() {

	raceModulesActive ++;
}

// Toggles visual button state on mouseover
    $(".race-button").mouseenter(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).addClass("pressed").animate({top: '+1px'}, 50);
        }
    });

    $(".race-button").mouseleave(function(){
        if ($(this).hasClass("disabled") == false) {
            $(this).removeClass("pressed").animate({top: '-1px'}, 50);
        }
    });

})