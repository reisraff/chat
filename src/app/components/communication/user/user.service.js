'use strict';

angular.module('app.communication').service(
  'CommunicationUserService',
  /* @ngInject */
  function ($q, $rootScope, LocalStorage, Restangular, MessagingService, CommunicationEvents, User) {
    var _self = this;
    _self.user = null;

    this.initialize = function () {
      _self.user = new User();

      MessagingService.subscribe(
        CommunicationEvents.user._AUTHENTICATE_,
        _self.authenticate
      );

      MessagingService.subscribe(
        CommunicationEvents.user._REGISTER_,
        _self.register
      );

      MessagingService.subscribe(
        CommunicationEvents.user._LOGOUT_,
        _self.logout
      );
    };

    this.authenticate = function (authData) {
      MessagingService.publish(CommunicationEvents.user._AUTHENTICATE_START_);
      Restangular.one('chat/user').post('login', authData).then(
        function (res) {
          _self.user.setData(res);
          MessagingService.publish(CommunicationEvents.user._SYNCED_);
          LocalStorage.set('chat.logged.user', _self.user.getJsonData());
          Restangular.setDefaultHeaders({
            'Authorization': _self.user.authorization
          });
          MessagingService.publish(
            CommunicationEvents.user._AUTHENTICATE_COMPLETE_,
            [_self.user.getJsonObj()]
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.user._AUTHENTICATE_FAIL_,
            [err]
          );
        }
      );
    };

    this.register = function (authData) {
      MessagingService.publish(CommunicationEvents.user._REGISTER_START_);
      Restangular.one('chat/user').post('register', authData).then(
        function (res) {
          MessagingService.publish(
            CommunicationEvents.user._REGISTER_COMPLETE_,
            [res]
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.user._REGISTER_FAIL_,
            [err]
          );
        }
      );
    };

    this.logout = function () {
      MessagingService.publish(CommunicationEvents.user._LOGOUT_START_);

      LocalStorage.remove('chat.logged.user');
      _self.user.clearData();
      MessagingService.publish(CommunicationEvents.user._SYNCED_);
      if (! _self.getUser().authorization) {
        MessagingService.publish(CommunicationEvents.user._LOGOUT_COMPLETE_);
      } else {
        MessagingService.publish(CommunicationEvents.user._LOGOUT_FAIL_, ['Error']);
      }
    };

    this.getUser = function () {
      if (!! _self.user.authorization) {
        return _self.user.getJsonObj();
      } else if (LocalStorage.get('chat.logged.user')) {
        return LocalStorage.getObject('chat.logged.user');
      } else {
        return _self.user.getJsonObj();
      }
    };
  }
)
.value(
  'User',
  function User () {
    this.authorization = null;
    this.name = null;
    this.email = null;

    this.setData = function (data) {
      this.authorization = data.data.authorization;
      this.name = data.data.name;
      this.email = data.data.email;
    };

    this.clearData = function () {
      this.setData(
        {
          data : {}
        }
      );
    };

    this.getJsonData = function () {
      return JSON.stringify({
        authorization: this.authorization,
        name: this.name,
        email: this.email
      });
    };

    this.getJsonObj = function () {
      return {
        authorization: this.authorization,
        name: this.name,
        email: this.email
      };
    };
  }
);
