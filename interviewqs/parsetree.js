// parsetree.js
// represent expressions like "3 + 6 * 8" and evaluate them.
// Also operate on the expression tree to derive new expressions.

function print(str) {
  console.log(str);
}

var TOKEN = {
  INVALID:   { value: 0, name: "INVALID" },
  OPERATOR:  { value: 1, name: "operator" },
  NUMBER:    { value: 2, name: "number" },
  SYMBOL:    { value: 3, name: "symbol" }
};

var OPERATOR = {
  PLUS:       { value: 0, name: "+", binding: 0 },
  MINUS:      { value: 1, name: "-", binding: 0 },
  TIMES:      { value: 2, name: "*", binding: 1 },
  DIVIDE:     { value: 3, name: "/", binding: 1 },
  POWER:      { value: 4, name: "^", binding: 1 }
};

function Expr(token, data, left, right) {
  this.left = left;
  this.right = right;
  this.token = token;
  this.data = data;
}


function number(data) {
  return new Expr(TOKEN.NUMBER, data);
}

function operator(op, left, right) {
  return new Expr(TOKEN.OPERATOR, op, left, right);
}

// printer should have a method append(str).
Expr.prototype.print = function(printer) {
  var expr = this;

  if (expr.token == TOKEN.OPERATOR) {
    expr.left.print(printer);
    printer.append(" ");
    printer.append(expr.data.name);
    printer.append(" ");
    // Should there be paranthesis around the right expression?
    var use_paren = false;
    if (expr.right.token == TOKEN.OPERATOR) {
      if (expr.right.data.binding < expr.data.binding) {
        use_paren = true;
      }
    }
    if (use_paren) printer.append("(");
    expr.right.print(printer);
    if (use_paren) printer.append(")");
  } else if (expr.token == TOKEN.NUMBER) {
    printer.append(expr.data.toString());
  } else if (expr.token == TOKEN.SYMBOL) {
    printer.append(expr.data);
  }

  return printer;
}


function example_one() {
  var expr = operator(OPERATOR.PLUS,
                      number(3),
                      operator(OPERATOR.TIMES,
                               number(6),
                               number(8)));
  return expr;
}

function example_two() {
  return operator(OPERATOR.TIMES,
                  number(6),
                  operator(OPERATOR.PLUS,
                           number(3),
                           operator(OPERATOR.PLUS,
                                    number(16),
                                    number(8))));
}

function Printer() {
  this.buffer = "";
}

Printer.prototype.append = function(str) {
  this.buffer += str;
}

Printer.prototype.flush = function() {
  print(this.buffer);
  this.buffer = "";
}

function main() {
  var printer = new Printer();
  number(5).print(printer).flush();
  operator(OPERATOR.PLUS, number(5), number(5)).print(printer).flush();
  var expr = example_one();
  expr.print(printer).flush();

  expr = example_two();
  expr.print(printer).flush();
}

main();
