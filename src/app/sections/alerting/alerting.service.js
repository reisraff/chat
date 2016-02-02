'use strict';

angular.module('app').service(
  'AlertingService',
  function ($interval, MessagingService, AlertingEvents) {
    var _self = this;
    _self.alerts = {};
    _self.secounds = 5;

    _self.destroyAlert = function (obj) {
      var _obj = obj;
      $interval(
        function () {
          _self.alerts[_obj.type].shift(_obj);
        },
        (_self.secounds * 1000),
        1
      );
    };

    _self.pushAlert = function (type, message) {
      var _return = false;
      angular.forEach(_self.alerts[type], function (al) {
        if (al.message === message) {
          _return = true;
        }
      });

      if (_return) {
        return;
      }

      var obj = {
        type: type,
        message: message
      };

      _self.alerts[type].push(obj);
      _self.destroyAlert(obj);
    };

    this.listenAlerts = function (alerts) {
      _self.alerts = alerts;

      MessagingService.subscribe(
        AlertingEvents._SUCCESS_,
        function (message) {
          _self.pushAlert('success', message);
        }
      );
      MessagingService.subscribe(
        AlertingEvents._INFO_,
        function (message) {
          _self.pushAlert('info', message);
        }
      );
      MessagingService.subscribe(
        AlertingEvents._WARNING_,
        function (message) {
          _self.pushAlert('warning', message);
        }
      );
      MessagingService.subscribe(
        AlertingEvents._DANGER_,
        function (message) {
          _self.pushAlert('danger', message);
        }
      );
    };

    this.initialize = function (alerts) {
      this.listenAlerts(alerts);
    };

    this.success = function (message) {
      MessagingService.publish(AlertingEvents._SUCCESS_, [message]);
    };

    this.ifno = function (message) {
      MessagingService.publish(AlertingEvents._INFO_, [message]);
    };

    this.warning = function (message) {
      MessagingService.publish(AlertingEvents._WARNING_, [message]);
    };

    this.danger = function (message) {
      MessagingService.publish(AlertingEvents._DANGER_, [message]);
    };
  }
);
