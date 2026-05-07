---
title: "二分搜索"
date: "2026-04-15"
tags: "interview"
---

## 基础

基本概念：在一个有序数组中找到目标值

核心思想：二分区间，缩小搜索范围

```javascript
const arr = [1, 3, 4, 5, 7, 7, 8, 9];
const target = 7;

const bs = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};
console.log(bs(arr, target)); // 5

// leetcode 374. 猜数字大小
```

上面的写法在遇到多个 target 的时候不一定返回的是第几个，所以二分搜索会有2个变种，"返回第一个大于等于目标值" 和 "返回最后一个小于等于目标值"(多数情况下"返回第一个大于等于目标值"用的较多)

```javascript
// 返回第一个大于等于目标值
const arr = [1, 3, 4, 5, 7, 7, 8, 9];
const target = 7;

const bs = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  let ans = -1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    if (arr[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return ans;
};
console.log(bs(arr, target)); // 4

// leetcode 2300. 咒语和药水的成功对数
```

```javascript
// 返回最后一个小于等于目标值
const arr = [1, 3, 4, 5, 7, 7, 8, 9];
const target = 7;

const bs = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  let ans = -1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    if (arr[mid] <= target) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
};
console.log(bs(arr, target)); // 5
```

## 进阶

##### 162. 寻找峰值

二分搜索的精髓是二分区间，缩小搜索范围，数组是否有序非必要条件。

例如 162. 寻找峰值 只需要找到一个条件能缩小范围即可

在 162 题中，通过比较 nums[mid] 与 nums[mid+1] 的大小，判断当前处于‘上坡’还是‘下坡’，从而决定舍弃哪一半区间。

_只要能通过某个性质判断目标在左右哪个区间，无序数组也可以二分_

**时间复杂度为 O(log n)**第一时间就一个想到二分搜索

##### 875. 爱吃香蕉的珂珂

正确的二分思路，或者称之为 "二分答案法"

1. 确定边界，即 left 和 right
2. 范围二分

**当你需要在一个范围内寻找一个“最小”或“最大”且满足某种条件的数值时，优先考虑二分**
