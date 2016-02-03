'use strict';

angular.module('app.communication')
.value(
  'Collection',
  function Collection() {
    var list = []
    var length = 0;

    this.add = function (item) {
      list.push(item);
      length++;
    };

    this.clear = function () {
      list = [];
      length = 0;
    };

    this.getList = function () {
      return list;
    };
  }
);
