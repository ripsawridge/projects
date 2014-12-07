
var ClimbGrades = (function() {

  // index UIAA           YDS             French
  var chart = [
    [0,  "3",            "5.2",          "1"],
    [1,  "3/3+",         "5.2",          "1"],
    [2,  "3+",           "5.3",          "2"],
    [3,  "3+/4-",        "5.3",          "2"],
    [4,  "4-",           "5.4",          "3"],
    [5,  "4-/4",         "5.4",          "3"],
    [6,  "4",            "5.4",          "3"],
    [7,  "4/4+",         "5.5",          "4a"],
    [8,  "4+",           "5.5",          "4a"],
    [9,  "4+/5-",        "5.5",          "4a"],
    [10, "5-",           "5.6",          "4b"],
    [11, "5-/5",         "5.6",          "4b"],
    [12, "5",            "5.6",          "4b"],
    [13, "5/5+",         "5.7",          "4c"],
    [14, "5+",           "5.7",          "4c"],
    [15, "5+/6-",        "5.8",          "5a"],
    [16, "6-",           "5.8",          "5a"],
    [17, "6-/6",         "5.9",          "5b"],
    [18, "6",            "5.9",          "5b"],
    [19, "6/6+",         "5.10a",        "5c"],
    [20, "6+",           "5.10a",        "5c"],
    [21, "6+/7-",        "5.10b",        "6a"],
    [22, "7-",           "5.10c",        "6a+"],
    [23, "7-/7",         "5.10c",        "6a+"],
    [24, "7",            "5.10d",        "6b"],
    [25, "7/7+",         "5.10d",        "6b"],
    [26, "7+",           "5.11a",        "6b+"],
    [27, "7+/8-",        "5.11b",        "6c"],
    [28, "8-",           "5.11c",        "6c+"],
    [29, "8-/8",         "5.11c",        "6c+"],
    [30, "8",            "5.11d",        "7a"],
    [31, "8/8+",         "5.12a",        "7a+"],
    [32, "8+",           "5.12a",        "7a+"],
    [33, "8+/9-",        "5.12b",        "7b"],
    [34, "9-",           "5.12c",        "7b+"],
    [35, "9-/9",         "5.12c",        "7b+"],
    [36, "9",            "5.12d",        "7c"],
    [37, "9/9+",         "5.13a",        "7c+"],
    [38, "9+",           "5.13a",        "7c+"],
    [39, "9+/10-",       "5.13b",        "8a"],
    [40, "10-",          "5.13c",        "8a+"],
    [41, "10-/10",       "5.13c",        "8a+"],
    [42, "10",           "5.13d",        "8b"],
    [43, "10/10+",       "5.14a",        "8b+"]
  ];


  var GRADE = {
    UIAA:   { value: 1, name: "UIAA" },
    YDS:    { value: 2, name: "YDS" },
    FRENCH: { value: 3, name: "French" }
  };


  // Use like FromIndex(3, GRADE.UIAA);
  // returns string "3+/4-"
  function FromIndex(index, grade) {
    if (isNaN(parseInt(index)) || index < 0 || index >= chart.length) {
      throw new TypeError("Invalid index parameter.");
    }

    if (!grade.hasOwnProperty("name") ||
        !grade.hasOwnProperty("value")) {
      throw new TypeError("invalid grade parameter.");
    }

    if (isNaN(parseInt(grade.value)) || grade.value < 1 || grade.value > 3) {
      throw new TypeError("grade.value is invalid.");
    }

    return chart[index][grade.value];
  }


  function ToIndex(string_value, grade) {
    if (!grade.hasOwnProperty("value")) {
      throw new TypeError("invalid grade parameter.");
    }

    if (isNaN(parseInt(grade.value)) || grade.value < 1 || grade.value > 3) {
      throw new TypeError("grade.value is invalid.");
    }

    var column = grade.value;
    for (var i = 0; i < chart.length; i++) {
      if (chart[i][column] === string_value) {
        return i;
      }
    }
    return -1;
  }

  var module = {
    GRADE: GRADE,
    FromIndex: FromIndex,
    ToIndex: ToIndex
  };

  return module;
}());

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


function Main() {
  var arguments = process.argv.slice(2);
  if (arguments.length == 0) {
    console.log("Usage: " + process.argv[1] + 
                " <space separated UIAA graded climbs>");
    return 1;
  }

  accum = 0.0;
  climb_count = 0;
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    sport_grade = ParseSportGradeFromUIAA(arg);
    if (sport_grade < 0) {
      print("Expression " + arg + " could not be parsed");
    } else {
      print(arg + " -> " + sport_grade);
      climb_count = climb_count + 1;
      accum = accum + sport_grade;
    }
  }

  average = Math.round(accum / climb_count);
  str_average_rating = UIAAFromSportGrade(average);
  print("UIAA average rating -> " + str_average_rating);
  print("Average sport grade -> " + average);
  print("Total effort        -> " + accum);
}

Main();
