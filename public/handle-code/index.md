---
title: "手写系列"
date: "2026-04-12"
tags: "interview"
---

# new

```js
// 1.创建新对象
// 2.新对象的 **proto** 指向构造函数的 prototype
// 3. 构造函数的 this 指向 新对象
// 4.根据返回值判断返回的是新对象还是构造函数返回的对象

const _new = (fn, ...rest) => {
  const newObj = Object.create(fn.prototype);
  const result = fn.apply(newObj, rest);
  return result instanceof Object ? result : newObj;
};
```

# Promise

```js
// 值透传
class MyPromise {
  constructor(fn) {
    this.value = undefined;
    const resolve = (val) => {
      this.value = val;
    };
    fn(resolve);
  }
  then(fn) {
    fn(this.value);
  }
}

const p = new MyPromise((resolve) => {
  resolve(1);
});

p.then((res) => {
  console.log(res);
});

// 状态机

class MyPromise2 {
  constructor(fn) {
    this.value = undefined;
    this.state = "pending";
    const resolve = (val) => {
      if (this.state === "pending") {
        this.value = val;
        this.state = "fulfilled";
      }
    };
    fn(resolve);
  }
  then(fn) {
    if (this.state === "fulfilled") {
      fn(this.value);
    }
  }
}

const p2 = new MyPromise2((resolve) => {
  resolve(1);
  resolve(2);
  resolve(3);
});

p2.then((res) => {
  console.log(res);
});

// 回调队列
class MyPromise3 {
  constructor(fn) {
    this.value = undefined;
    this.state = "pending";
    this.waiters = [];

    const resolve = (val) => {
      if (this.state === "pending") {
        this.value = val;
        this.state = "fulfilled";
        this.waiters.forEach((fn) => fn(this.value));
      }
    };
    fn(resolve);
  }
  then(fn) {
    if (this.state === "fulfilled") {
      fn(this.value);
    } else {
      this.waiters.push(fn);
    }
  }
}

const p3 = new MyPromise3((resolve) => setTimeout(() => resolve(1), 1000));

p3.then((res) => {
  console.log(res);
});

// 链式调用
class MyPromise4 {
  constructor(fn) {
    this.value = undefined;
    this.state = "pending";
    this.waiters = [];

    const resolve = (val) => {
      if (this.state === "pending") {
        this.value = val;
        this.state = "fulfilled";
        this.waiters.forEach((fn) => fn(this.value));
      }
    };
    fn(resolve);
  }
  then(fn) {
    return new MyPromise4((resolve) => {
      const handleFn = (val) => {
        fn = typeof fn === "function" ? fn : (v) => v;
        const res = fn(val);
        if (res instanceof MyPromise4) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      };

      if (this.state === "fulfilled") {
        handleFn(this.value);
      } else {
        this.waiters.push(handleFn);
      }
    });
  }
}

const p4 = new MyPromise4((resolve) => resolve(1))
  .then((res) => res + 1)
  .then((res) => {
    console.log(res);
    return res;
  })
  .then(null);

p4.then((res) => console.log(res));

// 微任务
class MyPromise5 {
  constructor(fn) {
    this.value = undefined;
    this.state = "pending";
    this.waiters = [];

    const resolve = (val) => {
      if (this.state === "pending") {
        this.value = val;
        this.state = "fulfilled";
        this.waiters.forEach((fn) => queueMicrotask(() => fn(this.value)));
      }
    };
    fn(resolve);
  }
  then(fn) {
    return new MyPromise5((resolve) => {
      const handleFn = (val) => {
        fn = typeof fn === "function" ? fn : (v) => v;
        const res = fn(val);
        if (res instanceof MyPromise5) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      };

      if (this.state === "fulfilled") {
        queueMicrotask(() => handleFn(this.value));
      } else {
        this.waiters.push(handleFn);
      }
    });
  }
}

const p5 = new MyPromise5((resolve) => resolve(1))
  .then((res) => res + 1)
  .then((res) => {
    console.log(res);
    return res;
  })
  .then(null);

p5.then((res) => console.log(res));
```
