// Copyright 2014, Michael Stanton.
var ClimbGrades = require("./climbgrades");

function ParseSportGradeFromUIAA(uiaa) {
  var trimmed_uiaa = uiaa.trim();
  var index = ClimbGrades.ToIndex(trimmed_uiaa, ClimbGrades.GRADE.UIAA);
  return index;
}


function UIAAFromSportGrade(grade) {
  var uiaa_string = ClimbGrades.FromIndex(grade, ClimbGrades.GRADE.UIAA);
  return uiaa_string;
}

function print(str) {
  console.log(str);
}


function GetGrade(str) {
  str = str.trim().toLowerCase();
  if (str === "uiaa") return ClimbGrades.GRADE.UIAA;
  else if (str === "yds") return ClimbGrades.GRADE.YDS;
  else if (str === "french") return ClimbGrades.GRADE.FRENCH;
  throw new TypeError(str + " is not a valid grade.");
}


function Main() {
  var arguments = process.argv.slice(2);
  if (arguments.length < 3) {
    print("Usage: " + process.argv[1] +
          "<from> <to> <space separated graded climbs>");
    print("<from> and <to> are UIAA, YDS or French");
    return 1;
  }

  accum = 0.0;
  climb_count = 0;
  var from = GetGrade(arguments[0]);
  var to = GetGrade(arguments[1]);
  var output = [];
  for (var i = 2; i < arguments.length; i++) {
    var arg = arguments[i].trim();
    try {
      var index = ClimbGrades.ToIndex(arg, from);
      if (index < 0) {
        print("skipping " + arg + ". Couldn't be parsed.");
      } else {
        var result = ClimbGrades.FromIndex(index, to);
        output.push(result);
        climb_count = climb_count + 1;
        accum = accum + index;
      }
    } catch(e) {
      print("error occurred: " + e.message);
    }
  }

  // print the results
  var outputStr = "";
  for (var i = 0; i < output.length; i++) {
    outputStr += output[i].toString();
    outputStr += " ";
  }
  print(outputStr);

  if (output.length > 1) {
    average = Math.round(accum / climb_count);
    average_from = ClimbGrades.FromIndex(average, from);
    average_to = ClimbGrades.FromIndex(average, to);
    print("average rating: " + average_from + " (" + from.name + ") " +
          average_to + " (" + to.name + ")");
  }
}

Main();
