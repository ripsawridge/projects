// Copyright 2015, Michael Stanton.
var KYNumbers = (function() {
  var FEATURE = {
    SOUL:   { value: 0, name: "SOUL" },
    KARMA:  { value: 1, name: "KARMA" },
    GIFT:   { value: 2, name: "GIFT" },
    DESTINY:{ value: 3, name: "DESTINY" },
    PATH:   { value: 4, name: "PATH" }
  };

  var NUMBERS = [
    "The first Spiritual Body is the Soul: it is represented by Guru " +
    "Nanak and Guru Nanak represented Humility. " +
    "The negative aspect of the number 1 is non-creativity. A person " +
    "with a 1 in a negative position will have zero creativity. This " +
    "is the most negative aspect of the number 1. He will be " +
    "completely head-dominant.",

    "The key phrase for the number 2 is 'Longing to Belong.' In order " +
    "to make this number harmonize you have to connect with your " +
    "spiritual teacher. This body is represented by Guru Angad - " +
    "Obedience." +
    "The negative aspect of the number 2 is that this person will form " +
    "negative associations or he will be unable to calculate the " +
    "danger in any situation.",

    "The Third Spiritual Body is the Positive Mind. It is represented " +
    "by Guru Amar Das - Equality." +
    "A 3 is flexible and mischievous. He gets pulled down by negativity " +
    "and needs a positive sense of humor." +
    "The negative aspect of the number 3 is that this person will not " +
    "able to see the good in situations.",

    "The Fourth Body is the Neutral Mind. It is represented by Guru " +
    "Ram Das - Service.",

    
  ];
    
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

  function DescribeNumber(feature, number) {
    if (!feature.hasOwnProperty("name") ||
        !feature.hasOwnProperty("value")) {
      throw new TypeError("invalid feature parameter.");
    }

    if (isNaN(parseInt(feature.value)) ||
        feature.value < 1 || feature.value > 5) {
      throw new TypeError("feature.value is invalid.");
    }

    if (isNaN(parseInt(number)) || number < 0 || number >= 12) {
      throw new TypeError("Invalid number parameter.");
    }

  }

  var module = {
    GetNumbers: GetNumbers,
    DescribeNumber: DescribeNumber
  };

  return module;
}());

// Uncomment this if you are embedding in a web page.
exports = module.exports = KYNumbers;

