

var uiaa_pattern = /^([3-9])([\+\-])?(?:(?:(\/)[3-9](?:[\+\-])?)?)?$/;

// Grades
// 3+
// 5+/6-
function GetSportGradeFromUIAA(rating) {
  return 3.0 * rating - 7.0;
}


function GetUIAAFromSportGrade(grade) {
  return (grade + 7.0) / 3.0;
}


function ParseSportGradeFromUIAA(uiaa) {
  m = uiaa_pattern.exec(uiaa);
  sport_grade = -1;
  if (m !== null) {
    grade = m[1];
    sport_grade = GetSportGradeFromUIAA(grade);
    if (m[2] != undefined) {
      if (m[2] === '+') {
        sport_grade = sport_grade + 1;
      } else {
        sport_grade = sport_grade - 1;
      }
    }

    if (m[3] != undefined) {
      sport_grade = sport_grade + 0.5;
    }
  }

  return sport_grade;
}


function UIAAFromSportGrade(grade) {
  rating = GetUIAAFromSportGrade(Math.round(grade));
  rating_decimal = Math.floor(Math.round(rating,1));
  slash_symbol = "";
  if (((rating_decimal + 1) - rating) <= 0.5) {
    slash_symbol = "/";
  }
  follow_symbol = "";
  delta_from_previous = GetSportGradeFromUIAA(rating_decimal - 1);
  if (delta_from_previous === 2) {
    follow_symbol = "-";
  } else if (delta_from_previous === 4) {
    follow_symbol = "+";
  }
  // recurse if needed
  follow_on = "";
  if (slash_symbol === "/") {
    follow_on = UIAAFromSportGrade(Math.ceil(Math.round(grade)) + 1);
  }

  str_rating = rating_decimal.toString() + follow_symbol + slash_symbol + follow_on;
  return str_rating;
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

  average = accum / climb_count;
  str_average_rating = UIAAFromSportGrade(average);
  print("UIAA average rating -> " + str_average_rating);
  print("Average sport grade -> " + average);
  print("Total effort        -> " + accum);
}

Main();
