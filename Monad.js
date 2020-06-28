const MayBe = require("./MayBe");

MayBe.prototype.join = function () {
  return this.isNothing() ? MayBe.of(null) : this.value;
};

MayBe.prototype.chain = function (fn) {
  // return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value)).join();
  return this.map(fn).join();
};

// Maybe { value : 1 }
var am = MayBe.of(1);
// Maybe { value : Maybe {value: 6} }
var bm = am.chain((a) => MayBe.of(a + 5));
var cm = bm.map((b) => console.log(b));

var fn1 = (x) => x + 1;
var fn2 = (x) => undefined;
