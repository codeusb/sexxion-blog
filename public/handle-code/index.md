---
title: "手写系列"
date: "2026-04-12"
tags: "interview"
---

## 前言

面试中大概率会出现手写代码的情况，但是对我来说，面试的情况下完成一个完善的手写是比较困难的，所以本篇文章每个手写都会有面试版和完善版两个版本，面试版一般是争取用最少代码完成主要功能以及主要知识点的覆盖，完善版就是扣一些细节(细节可能也有很多)多一些一些特殊情况和边界条件的考虑

## 手写 new 操作符

**面试版**

```javascript
const _new = (fn, ...args) => {
  const newObj = Object.create(fn.prototype);
  fn.call(newObj, ...args);
  return newObj;
};
```

**完善版**

```javascript
const _new = (fn, ...args) => {
  const newObj = Object.create(fn.prototype);
  const returnVal = fn.call(newObj, ...args);
  return returnVal instanceof Object ? returnVal : newObj;
};
```

测试

```javascript
function Foo(x, y) {
  this.name = x;
  this.age = y;
}

const obj1 = _new(Foo, "小明", 18);
const obj2 = new Foo("小明", 18);
console.log(obj1, obj2);
```

## 手写 call 方法

**面试版**

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
  thisArg = thisArg ?? window;
  thisArg.fn = this; // this === Function.prototype
  const result = thisArg.fn(...args);
  delete thisArg.fn;
  return result;
};
```

**完善版**

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
  thisArg = thisArg ?? window;
  thisArg = Object(thisArg);
  const fn = Symbol();
  thisArg[fn] = this;
  const result = thisArg[fn](...args);
  delete thisArg[fn];
  return result;
};
```

测试

```javascript
const obj = {
  a: 2,
  fun: function (x) {
    console.log(x);
    return this.a;
  },
};

const cObj = {
  a: 200,
};

console.log(obj.fun(1));
console.log(obj.fun.call(cObj, 100));
console.log(obj.fun.myCall(cObj, 100));
```

## 手写 bind 方法

**面试版**

```javascript
Function.prototype.myBind = function (thisArg, ...arg) {
  const fn = this;
  function Fn() {
    return fn.call(thisArg, ...arg);
  }
  return Fn;
};
```

**完善版**

```javascript
Function.prototype.myBind = function (thisArg, ...arg1) {
  thisArg = thisArg ?? window;
  thisArg = Object(thisArg);
  const originFn = this;
  function Fn(...arg2) {
    const objThis = this instanceof Fn ? this : Object(thisArg);
    return originFn.call(objThis, ...arg1, ...arg2);
  }
  if (originFn.prototype) {
    Fn.prototype = originFn.prototype;
  }
  return Fn;
};
```

测试

```javascript
const obj = {
  x: 42,
  getX: function () {
    return this.x;
  },
};

const unboundGetX = obj.getX;
console.log(unboundGetX());
const boundGetX = unboundGetX.bind(obj);
console.log(boundGetX());
const boundGetY = unboundGetX.myBind(obj);
console.log(boundGetY());
```

## 手写 apply 方法

**面试版**

```javascript
Function.prototype.myApply1 = function (thisArg, args) {
  thisArg = thisArg ?? window;
  thisArg.fn = this; // this === Function.prototype
  args = Array.from(args);
  const result = thisArg.fn(...args);
  delete thisArg.fn;
  return result;
};
```

**完善版**

_提示: 从数组和类数组对象做判断_

## 手写 深拷贝

**面试版**

```javascript
const deepCopy1 = (obj) => {
  if (typeof obj !== "object") return obj;

  let newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        newObj[key] = deepCopy1(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};
```

**完善版**

```javascript
const deepCopy = (obj, cache = new WeakMap()) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (cache.has(obj)) {
    // 循环引用
    return cache.get(obj);
  }

  let newObj = Array.isArray(obj) ? [] : {};

  cache.set(obj, newObj);

  Reflect.ownKeys(obj).forEach((key) => {
    if (obj[key] === null || typeof obj[key] !== "object") {
      newObj[key] = obj[key];
    } else {
      newObj[key] = deepCopy(obj[key], cache);
    }
  });

  return newObj;
};
```

测试

```javascript
const obj = {
  a: "123",
  c: {
    a: "1",
  },
};

const cObj = deepCopy(obj);
console.log(cObj);
```

## 手写 promise 方法

**面试版**

```javascript
function Promise(fn) {
  this.cbs = [];

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  };

  fn(resolve);
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  });
};
```

_核心：then 方法链式调用_

**完善版**

```
// TODO
```

## 防抖

**面试版**

```javascript
const debounce = (fn, delay) => {
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};
```

## 节流

**面试版**

```javascript
const throttle = (fn, delay) => {
  let timer = null;

  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};
```
