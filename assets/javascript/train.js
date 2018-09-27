// Initialize Firebase
var config = {
    apiKey: "AIzaSyDb5qVgATv4MjXm6_y29ivqoaxiFzliDKA",
    authDomain: "trainschedule-ceabb.firebaseapp.com",
    databaseURL: "https://trainschedule-ceabb.firebaseio.com",
    projectId: "trainschedule-ceabb",
    storageBucket: "trainschedule-ceabb.appspot.com",
    messagingSenderId: "155998812218"
};
firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var firstTrain;
var frequency = 0;
$("#add-train").on("click", function (event) {
    console.log("pre-event prevent");
    event.preventDefault();

    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();
    
    //if name destination firstTrain or frequency is left blank don't accept the input.
    //if frequency is less than zero also don't accept the input
    if (name == "" || destination == "" || firstTrain == "" || frequency == "" || frequency < 0) {
        
    } else {
        console.log(name);
        console.log(firstTrain);
        console.log(destination);
        console.log(frequency);
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");
    }
});

database.ref().on("value", function (snapshot) {
    $("tbody").empty();
    console.log("value");
    var elements = Object.values(snapshot.val());
    var counter = 0;
    elements.forEach(element => {

        //calculate months worked using moment
        var firstTimeConverted = moment(element.firstTrain, "HH:mm").subtract(1, "years");



        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tFrequency = element.frequency;
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        //create divs, add data, and append to table
        var row = $("<tr>");
        var scope = $("<td>");
        scope.attr("scope", "row");
        scope.attr("class", "name");
        scope.text(element.name);
        var destinationDiv = $("<td>");
        var frequencyDiv = $("<td>");
        destinationDiv.text(element.destination);
        destinationDiv.attr("class", "destination");
        frequencyDiv.text(element.frequency);
        frequencyDiv.attr("class", "frequency");
        //append to row
        row.append(scope, destinationDiv, frequencyDiv);

        var nextArrival = $("<td>");
        var minutesAway = $("<td>");
        nextArrival.attr("class", "next-train");
        minutesAway.attr("class", "minutes-away");
        nextArrival.text(moment(nextTrain).format("hh:mm"));
        minutesAway.text(tMinutesTillTrain);
        row.append(nextArrival, minutesAway);
        $("tbody").append(row);
        counter++;
    });
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});




// Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
    $("tbody").empty();
    console.log("value");
    var elements = Object.values(snapshot.val());
    var counter = 0;
    elements.forEach(element => {

        //calculate months worked using moment
        var firstTimeConverted = moment(element.firstTrain, "HH:mm").subtract(1, "years");

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tFrequency = element.frequency;
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        //create divs, add data, and append to table
        var row = $("<tr>");
        var scope = $("<td>");
        scope.attr("scope", "row");
        scope.addClass("name");
        scope.text(element.name);
        var destinationDiv = $("<td>");
        var frequencyDiv = $("<td>");
        destinationDiv.text(element.destination);
        destinationDiv.addClass("destination");
        frequencyDiv.text(element.frequency);
        frequencyDiv.addClass("frequency");
        //append to row
        row.append(scope, destinationDiv, frequencyDiv);

        var nextArrival = $("<td>");
        var minutesAway = $("<td>");
        nextArrival.addClass("next-train");
        minutesAway.addClass("minutes-away");
        nextArrival.text(moment(nextTrain).format("hh:mm"));
        minutesAway.text(tMinutesTillTrain);
        row.append(nextArrival, minutesAway);
        $("tbody").append(row);
        counter++;
    });
    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function updateTable() {
    var minutesAwayCol = document.getElementsByClassName("minutes-away");
    var frequencies = document.getElementsByClassName("frequency");
    var nextTrains = document.getElementsByClassName("next-train");
    if (minutesAwayCol.length > 0) {

        for (i = 0; i < minutesAwayCol.length; i++) {
            console.log(minutesAwayCol[i].textContent);
            if (minutesAwayCol[i].textContent > 0) {

                $(minutesAwayCol[i]).text(minutesAwayCol[i].textContent - 1);
            } else {
                $(minutesAwayCol[i]).text(frequencies[i].textContent);
                $(nextTrains[i]).text(moment(nextTrains[i].textContent, 'HH:mm').add(frequencies[i].textContent, "m").format("HH:mm"))
            }
        };
    }
    console.log(moment(nextTrains[0].textContent, 'HH:mm').format("HH:mm"));
}

setInterval(updateTable, 60000);