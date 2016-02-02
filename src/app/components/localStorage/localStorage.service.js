'use strict';

angular.module('app').factory(
  'LocalStorage',
  /* @ngInject */
  function LocalStorageService ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      clear: function () {
        $window.localStorage.clear();
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    };
  }
);
