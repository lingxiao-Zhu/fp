/**
 * 函子就是实现了map契约的对象
 * Maybe也是一个函子，所以也需要实现map方法，优点是让我们用更加FP的方式处理错误
 * @param {*} value
 */
function MayBe(value) {
  this.value = value;
}

MayBe.of = function (value) {
  return new MayBe(value);
};

MayBe.prototype.isNothing = function () {
  return this.value === null || this.value === undefined;
};

// map方法会在调用传入的函数前，使用isNothing检查容器中的值是否为空
// 这是一种对错误处理的强大抽象
MayBe.prototype.map = function (fn) {
  return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value));
};

// MayBe { value: STRING }
MayBe.of("string").map((x) => x.toUpperCase());

// MayBe { value: null }
MayBe.of(null).map((x) => x.toUpperCase());

/**
 * 此处不关心x是否为null或者undefined，它已经被MayBe函子抽象出来了。
 * 代码没有在null或者undefined的情况下崩溃，因为我们已经把值封装在一个安全的容器中。
 */

//  MayBe { value: undefined }
//  在整个链式调用中，也没有崩溃。
MayBe.of("Larry")
  .map(() => undefined)
  .map(() => undefined)
  .map((x) => "Mr, " + x);

module.exports = MayBe;
