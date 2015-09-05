// Copyright 2015, Michael Stanton.
var KYNumbers = (function() {
  var xmldoc = require('./xmldoc');
  var fs = require("fs");
  var contents = fs.readFileSync("./kynumbers.xml");
  var data_doc = new xmldoc.XmlDocument(contents);

  var FEATURE = {
    SOUL:   { value: 0, name: "soul" },
    KARMA:  { value: 1, name: "karma" },
    GIFT:   { value: 2, name: "gift" },
    DESTINY:{ value: 3, name: "destiny" },
    PATH:   { value: 4, name: "path" }
  };
    
  function reduceNumber(num) {
    var threshold = 12;
    if (num < threshold) {
      return num;
    }
    // divide into digits.
    var str = num.toString();
    var accum = 0;
    for (var i = 0; i < str.length; i++) {
      accum += parseInt(str[i]);
    }
    // the process is recursive.
    if (accum >= threshold) {
      return reduceNumber(accum);
    }
    return accum;
  }

  function Pair(key, value) {
    this.feature = key;
    this.number = value;
  }

  function GetNumbers(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var shortYear = date.getYear();
    var fullYear = date.getFullYear();

    var result = [];
    // Compute soul number.
    var soulNumber = reduceNumber(day);
    result.push(new Pair(FEATURE.SOUL, soulNumber));
    
    // Compute karma number.
    var karmaNumber = reduceNumber(month);
    result.push(new Pair(FEATURE.KARMA, karmaNumber));

    // Compute gift number.
    var giftNumber = reduceNumber(shortYear);
    result.push(new Pair(FEATURE.GIFT, giftNumber));

    // Compute Destiny number.
    var destinyNumber = reduceNumber(fullYear);
    result.push(new Pair(FEATURE.DESTINY, destinyNumber));

    // Copute path number.
    var bigstring = day.toString() + month.toString() +
        fullYear.toString();
    var bignum = parseInt(bigstring);
    var pathNumber = reduceNumber(bignum);
    result.push(new Pair(FEATURE.PATH, pathNumber));
  
    return result;
  }

  function DescribeFeature(feature) {
  }

  function DescribeNumber(number) {
  }

  function DescribeFeatureNumber(feature, number) {
    if (!feature.hasOwnProperty("name") ||
        !feature.hasOwnProperty("value")) {
      throw new TypeError("invalid feature parameter.");
    }

    if (isNaN(parseInt(feature.value)) ||
        feature.value < 0 || feature.value > 4) {
      throw new TypeError("feature.value is invalid.");
    }

    if (isNaN(parseInt(number)) || number < 0 || number >= 12) {
      throw new TypeError("Invalid number parameter.");
    }

    var numbers = data_doc.childNamed("numbers");
    for (var i = 0; i < numbers.children.length; i++) {
      var number_object = numbers.children[i];
      if (parseInt(number_object.attr.value) === number) {
        var feature_data = number_object.childNamed(feature.name);
        var text = feature_data.val;
        return text;
      }
    }
    return "";
  }

  var module = {
    GetNumbers: GetNumbers,
    DescribeFeature: DescribeFeature,
    DescribeNumber: DescribeNumber,
    DescribeFeatureNumber: DescribeFeatureNumber
  };

  return module;
}());

// Uncomment this if you are embedding in a web page.
exports = module.exports = KYNumbers;

