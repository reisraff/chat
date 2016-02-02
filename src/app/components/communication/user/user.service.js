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
          LocalStorage.set('nf.logged.user', _self.user.getJsonData());
          Restangular.setDefaultHeaders({
            'Authorization': _self.user.token
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
          console.log(res);
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

      LocalStorage.remove('nf.logged.user');
      _self.user.clearData();
      MessagingService.publish(CommunicationEvents.user._SYNCED_);
      if (! _self.getUser().token) {
        MessagingService.publish(CommunicationEvents.user._LOGOUT_COMPLETE_);
      } else {
        MessagingService.publish(CommunicationEvents.user._LOGOUT_FAIL_, ['Error']);
      }
    };

    this.getUser = function () {
      if (!! _self.user.token) {
        return _self.user.getJsonObj();
      } else if (LocalStorage.get('nf.logged.user')) {
        return LocalStorage.getObject('nf.logged.user');
      } else {
        return _self.user.getJsonObj();
      }
    };
  }
)
.value(
  'User',
  function User () {
    this.guid = null;
    this.token = null;
    this.name = null;
    this.user = null;
    this.groups = [];
    this.permissions = [];

    this.setData = function (data) {
      this.guid = data.data.guid;
      this.token = data.data.token;
      this.name = data.data.name;
      this.user = data.data.user;
      this.groups = data.data.groups;
      this.permissions = data.data.permissions;
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
        guid: this.guid,
        token: this.token,
        name: this.name,
        user: this.user,
        groups: this.groups,
        permissions: this.permissions
      });
    };

    this.getJsonObj = function () {
      return {
        guid: this.guid,
        token: this.token,
        name: this.name,
        user: this.user,
        groups: this.groups,
        permissions: this.permissions
      };
    };
  }
);
