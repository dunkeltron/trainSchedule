

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
});

database.ref().on("value", function (snapshot) {
    $("tbody").empty();
    console.log("value");
    var elements = Object.values(snapshot.val());

    elements.forEach(element => {
        
        //calculate months worked using moment
        var firstTimeConverted = moment(element.firstTrain, "HH:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

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
        scope.text(element.name);
        var destinationDiv = $("<td>");
        var frequencyDiv = $("<td>");
        destinationDiv.text(element.destination);
        frequencyDiv.text(element.frequency);
        //append to row
        row.append(scope, destinationDiv, frequencyDiv);

        var nextArrival = $("<td>");
        var minutesAway = $("<td>");
        nextArrival.text(moment(nextTrain).format("hh:mm"));
        minutesAway.text(tMinutesTillTrain);   
        row.append(nextArrival, minutesAway);
        $("tbody").append(row);
    });

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
 });




// Firebase watcher .on("child_added"
 database.ref().on("child_added", function (snapshot) {
    $("tbody").empty();
    console.log("value");
    var elements = Object.values(snapshot.val());

    elements.forEach(element => {
        
        //calculate months worked using moment
        var firstTimeConverted = moment(element.firstTrain, "HH:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

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
        scope.text(element.name);
        var destinationDiv = $("<td>");
        var frequencyDiv = $("<td>");
        destinationDiv.text(element.destination);
        frequencyDiv.text(element.frequency);
        //append to row
        row.append(scope, destinationDiv, frequencyDiv);

        var nextArrival = $("<td>");
        var minutesAway = $("<td>");
        nextArrival.text(moment(nextTrain).format("hh:mm"));
        minutesAway.text(tMinutesTillTrain);   
        row.append(nextArrival, minutesAway);
        $("tbody").append(row);
    });
     // Handle the errors
 }, function (errorObject) {
     console.log("Errors handled: " + errorObject.code);
 });