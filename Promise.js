// 判断变量否为function
const isFunction = (variable) => typeof variable === "function";

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

// Promise是一种Monad实现
function MyPromise(handle) {
  if (!isFunction(handle)) {
    throw new Error("MyPromise must accept a function as a parameter");
  }
  // 添加状态
  this._status = PENDING;
  // 添加状态
  this._value = undefined;
  // 添加成功回调函数队列
  this._fulfilledQueues = [];
  // 添加失败回调函数队列
  this._rejectedQueues = [];

  try {
    handle(this._resolve.bind(this), this._reject.bind(this));
  } catch (e) {
    this._reject(e);
  }
}

MyPromise.prototype._resolve = function (val) {
  if (this._status !== PENDING) return;
  this._status = FULFILLED;
  this._value = val;
};

MyPromise.prototype._reject = function (err) {
  if (this._status !== PENDING) return;
  this._status = REJECTED;
  this._value = err;
};

/**
 * 接下来实现then
 * 1.接受两个参数 onFulfilled 和 onRejected 都是可选参数。
 * 2.当 promise 状态变为成功时必须被调用 onFulfilled，否则是 onRejected
 * 3.在 promise 状态改变前其不可被调用
 * 4.其调用次数不可超过一次
 * 5.then 方法可以被同一个 promise 对象调用多次
 */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const { _value, _status } = this;

  // 返回一个新的Promise，此Promise状态依赖于当前 then 方法回调函数执行的情况以及返回值
  return new MyPromise((onFulfilledNext, onRejectedNext) => {
    // 封装一个成功时执行的函数
    const fulfilled = (value) => {
      try {
        if (!isFunction(onFulfilled)) {
          onFulfilledNext(value);
        } else {
          let res = onFulfilled(value);
          if (res instanceof MyPromise) {
            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
            res.then(onFulfilledNext, onRejectedNext);
          } else {
            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
            onFulfilledNext(res);
          }
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        onRejectedNext(err);
      }
    };

    switch (_status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(onFulfilled);
        this._rejectedQueues.push(onRejected);
        break;
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        onFulfilled(_value);
        break;
      case REJECTED:
        onRejected(_value);
        break;
    }
  });
};
