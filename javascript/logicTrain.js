// ------------------------- GLOBAL VARIABLES -------------------------

var trainName;
var Destination;
var firstTraintime;
var minFrequency;
var arrivalNext;
var minutesAway;

  // ------------------------ FIREBASE -------------------------
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyAE9UOdNwmYHULDav5sDL_tfXkItUxObII",
    authDomain: "train-schedule-65d83.firebaseapp.com",
    databaseURL: "https://train-schedule-65d83.firebaseio.com",
    projectId: "train-schedule-65d83",
    storageBucket: "train-schedule-65d83.appspot.com",
    messagingSenderId: "949684136577"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// ------------------------- FUNCTIONS -------------------------

$("#add-train").on("click", function(event) {
    event.preventDefault();
    console.log("This worked");
    trainName = $("#train-name").val().trim();
    console.log (trainName); 
    Destination = $("#destination").val().trim();
    console.log (Destination); 
    firstTraintime = $("#first-train").val().trim();
    console.log (firstTraintime);
    minFrequency = $("#min-freq").val().trim();
    console.log (minFrequency); 



    database.ref().push({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        name: trainName,
        Destination: Destination,
        firstTraintime: firstTraintime,
        minFrequency: minFrequency,

    }); 
});


database.ref().on("child_added", function(snapshot) {
    var snapshotVal = snapshot.val();
    console.log(snapshotVal.name);
    console.log(snapshotVal.Destination);
    console.log(snapshotVal.firstTraintime);
    console.log(snapshotVal.minFrequency);

    firstTraintime = snapshotVal.firstTraintime;
    minFrequency = snapshotVal.minFrequency;

    var tRow = $("<tr>");
    var tdName = $("<td>");
    var tdDestination = $("<td>");
    var tdfirstTraintime = $("<td>");
    var tdFrequencyMin = $("<td>");
    var tdNextArrival = $("<td>");
    var tdMinutesAway = $("<td>");
    var arrivals = runtraincal()

    tdName.text(snapshotVal.name);
    tdDestination.text(snapshotVal.Destination);
    tdfirstTraintime.text(snapshotVal.firstTraintime);
    tdFrequencyMin.text(snapshotVal.minFrequency);
    tdNextArrival.text(arrivals.arrivalNext);
    tdMinutesAway.text(arrivals.minutesAway);

    tRow.append(tdName, tdDestination, tdFrequencyMin, tdNextArrival, tdMinutesAway)
    $(".table").append(tRow);

});


    // firstTraintime = snapshotVal.firstTraintime;

    function runtraincal (){
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTraintime, "HH:mm").subtract(1, "years");
        console.log("First Train: " + firstTraintime);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTraintime, "minutes"));
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // // Time apart (remainder)
        var tRemainder = diffTime % minFrequency;
        console.log('remainder', tRemainder);

        // Minute Until Train
        var minutesAway = minFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);

        // Next Train
        var arrivalNext = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(arrivalNext).format("hh:mm"));

        return {
            minutesAway,
            arrivalNext
        }
    }

