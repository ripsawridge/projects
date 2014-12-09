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
                   ProcessData(data_in);
                 }
               });
}


function CreateStats(array) {
  var res = {
    mean: 0.0,
    max: 0.0
  };
  var accum = 0.0;

  // Compute the mean
  for (var i = 0; i < array.length; i++) {
    accum += array[i];
  }
  res.mean = accum / array.length;

  // max
  array.sort();
  if (array.length > 0) {
    res.max = array[array.length - 1];
  }

  return res;
}


function DateSort(a, b) {
  a = new Date(a.date);
  b = new Date(b.date);
  if (a < b) return -1;
  else if (a > b) return 1;
  return 0;
}

// Creates an array of objects with { date, values[] }, sorted by date.
function AggregateIndexesByDate(data, filter_function) {
  var aggregates = [];
  // Aggregate data
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var choose = true;
    if (filter_function !== undefined) {
      choose = filter_function(entry);
    }

    if (choose === true) {
      if (aggregates[entry.date] === undefined) {
        aggregates[entry.date] = [];
      }

      aggregates[entry.date].push(entry.index);
    }
  }

  // Interpolate holes.
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    if (aggregates[entry.date] === undefined) {
      // If you didn't climb anything clean on this day, you get credit for
      // having climbed one grade 4 UIAA climb.
      var index = ClimbGrades.ToIndex("4", ClimbGrades.GRADE.UIAA);
      aggregates[entry.date] = [index];
    }
  }

  var result = [];
  for (i in aggregates) {
    var obj = {};
    obj.date = i;
    obj.values = aggregates[i].slice(0);
    result.push(obj);
  }

  result.sort(DateSort);
  return result;
}


function AggregateData(data, filter_function) {
  // aggregates will be an array, sorted by date with objects
  // { date, values } where values are all that passed the filter
  // function.
  var aggregates = AggregateIndexesByDate(data, filter_function);
  var stats = aggregates.map(function(entry) {
    var obj = CreateStats(entry.values);
    obj.date = entry.date;
    return obj;
  });
  return stats;
}


function FromIndex(index) {
  index = Math.round(index);
  return ClimbGrades.FromIndex(index, ClimbGrades.GRADE.UIAA);
}

// stats is a sorted array of objects like { date, max, mean, done_max, done_mean }
function PrintStats(stats) {
  for (var i = 0; i < stats.length; i++) {
    var entry = stats[i];
    var max = FromIndex(entry.max);
    var done_max = FromIndex(entry.done_max);
    console.log(entry.date + " " + FromIndex(entry.mean) + " " + 
                max + " " + FromIndex(entry.done_mean) + " " + 
                done_max);
  }
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

  var stats_full = AggregateData(data);

  var stats_done = AggregateData(data, function(entry) {
    var choose = entry.notes.trim() === "";
    return choose;
  });

  // merge done data with all attempt data.
  for (var i = 0; i < stats_full.length; i++) {
    var entry = stats_full[i];
    var done_entry = stats_done[i];
    entry.done_mean = done_entry.mean;
    entry.done_max = done_entry.max;
  }

  // We only want to print data from the last 6 months.
  var filterDate = new Date();
  filterDate.setMonth(filterDate.getMonth() - 6);
  stats_done = stats_full.filter(function(entry) {
    var d = new Date(entry.date);
    return d > filterDate;
  });
  PrintStats(stats_full);
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
