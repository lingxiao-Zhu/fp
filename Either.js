/**
 * MayBe存在一个问题，那就是不知道实在具体哪一步造成的null或者undefined
 * 这时候需要Either，能够解决分支拓展问题
 */

function Nothing(value) {
  this.value = value;
}
Nothing.of = function (value) {
  return new Nothing(value);
};

Nothing.prototype.map = function () {
  return this;
};

function Some(value) {
  this.value = value;
}
Some.of = function (value) {
  return new Some(value);
};
Some.prototype.map = function (fn) {
  return Some.of(fn(this.value));
};

/**
 * 可以看到，Either包含两个方法，
 * Nothing的map方法返回本身，不执行传入的方法参数
 */

// 默认fetch是同步请求
const getAll = () => fetch("xxx").then((res) => res.data);

// 声明这样一个函数，筛选出来自中国的女性
const getFemaleFormChina = () => {
  const people = getAll();
  return MayBe.of(people)
    .map((x) => x.sex === "female")
    .map((x) => x.country === "china");
};
/**
 * 假如某个环节出错，我们会得到
 * MayBe { value: null }
 * 但是我们不知道具体报错信息，现在引入Either
 */

const getAllEither = async () => {
  let response;

  try {
    response = Some.of(fetch("xxx").then((res) => res.data));
  } catch (e) {
    response = Nothing.of({ errMsg: "getAll报错" });
  }
};

const getFemaleFormChinaEither = () => {
  const people = getAllEither();
  return people
    .map((x) => x.sex === "female")
    .map((x) => x.country === "china");
};

// 此时我们可以拿到 Nothing { errMsg: "getAll报错" }
