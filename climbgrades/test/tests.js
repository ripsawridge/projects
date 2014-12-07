var grades = require("../climbgrades");

exports["basic"] = function(test) {
  test.equal(8, grades.ToIndex("4+", grades.GRADE.UIAA));
  test.equal(7, grades.ToIndex("4a", grades.GRADE.FRENCH));
  test.equal(15, grades.ToIndex("5.8", grades.GRADE.YDS));
  test.equal("5.8", grades.FromIndex(15, grades.GRADE.YDS));
  test.equal("5a", grades.FromIndex(15, grades.GRADE.FRENCH));
  test.equal("5+/6-", grades.FromIndex(15, grades.GRADE.UIAA));
  test.done();
}


exports["trimming"] = function(test) {
  test.equal(8, grades.ToIndex("  4+", grades.GRADE.UIAA));
  test.equal(7, grades.ToIndex("4a  ", grades.GRADE.FRENCH));
  test.equal(15, grades.ToIndex("  5.8 ", grades.GRADE.YDS));
  test.done();
}


exports["bad_arguments"] = function(test) {
  test.throws(function() { grades.ToIndex(undefined, grades.GRADE.UIAA); });
  test.throws(function() { grades.ToIndex(34, grades.GRADE.UIAA); });
  test.throws(function() { grades.ToIndex([,], grades.GRADE.UIAA); });

  test.throws(function() { grades.ToIndex("4", grades.GRADE.blah); });
  test.throws(function() { grades.ToIndex("4", undefined); });

  // No spaces allowed around slashes.
  test.throws(function() { grades.ToIndex("4 / 4+", grades.GRADE.UIAA); });

  // No slash grades allowed for non-UIAA ratings.
  test.throws(function() { grades.ToIndex("5.7/5.8", grades.GRADE.YDS); });
  test.throws(function() { grades.ToIndex("5a/5b", grades.GRADE.FRENCH); });
  
  test.throws(function() { grades.ToIndex("5.+7", grades.GRADE.YDS); });
  test.throws(function() { grades.ToIndex("+5.7", grades.GRADE.YDS); });
  test.throws(function() { grades.ToIndex("5.7-+", grades.GRADE.YDS); });

  test.equal(-1, grades.ToIndex("invalid_thing", grades.GRADE.FRENCH));

  test.throws(function() { grades.FromIndex(-1, grades.GRADE.UIAA); });
  test.throws(function() { grades.FromIndex(1000, grades.GRADE.UIAA); });
  test.throws(function() { grades.FromIndex("3.5", grades.GRADE.UIAA); });
  test.throws(function() { grades.FromIndex(null, grades.GRADE.UIAA); });

  test.throws(function() { grades.FromIndex(10, grades.GRADE.blah); });
  test.throws(function() { grades.FromIndex(15, undefined); });

  test.done();
}

exports["YDS_accomodation"] = function(test) {
  test.equal(13, grades.ToIndex("5.7", grades.GRADE.YDS));
  test.equal(13, grades.ToIndex("5.7-", grades.GRADE.YDS));
  test.equal(14, grades.ToIndex("5.7+", grades.GRADE.YDS));
  test.equal(9, grades.ToIndex("5.5+", grades.GRADE.YDS));
  test.done();
}


exports["FRENCH_accomodation"] = function(test) {
  test.equal(22, grades.ToIndex("6a+", grades.GRADE.FRENCH));
  test.equal(19, grades.ToIndex("5c", grades.GRADE.FRENCH));
  test.equal(19, grades.ToIndex("5c-", grades.GRADE.FRENCH));
  test.equal(20, grades.ToIndex("5c+", grades.GRADE.FRENCH));
  test.done();
}
