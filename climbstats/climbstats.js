// Copyright 2014, Michael Stanton.
var Tabletop = require("./modules/tabletop");
var ClimbGrades = require("../climbgrades/climbgrades");
var fs = require("fs");

var public_url = 
  "https://docs.google.com/spreadsheet/pub?key=0Aik9iNgOEySpdGxObG8ySmNCalJaS2R3YTZpSXFmWlE&single=true&gid=0&output=html";

var data = null;
var data_file = "climbstats.json";

function getData(data_in, tabletop) {
  // Write data to a file.
  fs.writeFile(data_file, JSON.stringify(data_in, null, 4),
               function(err) {
                 if (err) {
                   console.log(err);
                 } else {
                   ProcessData(data);
                 }
               });
}

function ProcessData(data) {
  // First, turn the climbing grades into a proper ordering.
  data = data.map(function(entry) {
    var result = entry;
    result.index = ClimbGrades.ToIndex(result.grade, ClimbGrades.GRADE.UIAA);
    return result;
  });
  // I want to create a record for each day with:
  // hardest route climbed.
  // hardest route attempted.
  // mean grade (climbed or attempted).
  // median grade (climbed or attempted).

  // Order by date.
  data.sort(function(a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
  });

  
  // Print out simple data.
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    if (entry.notes.trim() === "") {
      console.log(entry.date + " " + entry.index);
    }
  }

}


function Main() {
  var arguments = process.argv.slice(2);
  if (arguments.length != 0 && arguments.length != 1) {
    print("Usage: " + process.argv[1] +
          "[<saved json data>]");
    print("where saved json data is a local file with the spreadsheet data.");
    print("if no file is specified climbstats.json will be (over)written.");
    return 1;
  }

  if (arguments.length == 0) {
    // Use tabletop to get the spreadsheet.
    Tabletop.init({ 
      key: public_url,
      callback: getData,
      simpleSheet: true
    });
    return 0;
  }

  // Read the data from a file.
  fs.readFile(data_file, null, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    data = JSON.parse(data);
    ProcessData(data);
  });

  return 0;
}

Main();
