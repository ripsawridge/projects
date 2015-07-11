// Copyright 2015, Michael Stanton
var KYNumbers = require("./kynumbers");

function print(str) {
  console.log(str);
}


function Main() {
  var arguments = process.argv.slice(2);
  if (arguments.length < 1) {
    print("Usage: " + process.argv[1] +
          "<date>");
    print("<date> is a birthdate");
    return 1;
  }

  var d = new Date(arguments[0]);
  print("date is " + d);
  var nums = KYNumbers.GetNumbers(d);
  for (var i = 0; i < nums.length; i++) {
    var pair = nums[i];
    print(pair.feature.name + " " + pair.number);
    var p = KYNumbers.DescribeFeatureNumber(pair.feature,
                                            pair.number);
    print(p);
  }
}

Main();
