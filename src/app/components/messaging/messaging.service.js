'use strict';

angular.module('app.messaging').factory(
  'MessagingService',
  /* @ngInject */
  function() {
    var cache = {};

    var subscribe = function (topic, callback, autoDie) {
      if (! topic) {
        throw Error('Topic subscribe undefined');
      }
      if (! autoDie) {
        autoDie = false;
      }
      if (! cache[topic]) {
        cache[topic] = [];
      }
      cache[topic].push({method:callback, autoDie:autoDie});

      return [topic, {method:callback, autoDie:autoDie}];
    };

    var subscribeOnce = function (topic, callback, autoDie) {
      if (! topic) {
        throw Error('Topic subscribe undefined');
      }
      if (! autoDie) {
        autoDie = false;
      }

      if (! cache[topic]) {
        cache[topic] = [];
        cache[topic].push({method:callback, autoDie:autoDie});
      }

      return [topic, {method:callback, autoDie:autoDie}];
    };

    var publish = function (topic, args) {
      if (! topic) {
        throw Error('Topic publish undefined');
      }
      if (cache[topic]) {
        angular.forEach(cache[topic], function (callback) {
          callback.method.apply(null, args || []);
          if (callback.autoDie) {
            unsubscribe([topic, callback]);
          }
        });
      }
    };

    var unsubscribe = function (handle) {
      var t = handle[0];
      if (cache[t]) {
        for (var x = 0; x < cache[t].length; x++) {
          if (cache[t][x].method === handle[1].method) {
            cache[t].splice(x, 1);
          }
        }
      }
    };

    var unsubscribeEvents = function (events) {
      angular.forEach(events, function (event) {
        unsubscribe(event);
      });
    };

    // Define the functions and properties to reveal.
    var service = {
      publish: publish,
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      subscribeOnce: subscribeOnce,
      unsubscribeEvents:unsubscribeEvents
    };

    return service;
  }
);
