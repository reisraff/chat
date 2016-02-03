'use strict';

angular.module('app').run(
  /* @ngInject */
  function (
    $rootScope,
    $state,
    $location,
    ngProgress,
    Restangular,
    CommunicationUserService,
    MessagingService,
    CommunicationEvents,
    CommunicationErrors,
    AlertingService
  ) {
    Restangular.addRequestInterceptor(function (element, m, url) {
      if (CommunicationUserService.getUser() && CommunicationUserService.getUser().authorization) {
        var authorization = CommunicationUserService.getUser().authorization;

        Restangular.setDefaultHeaders({
          'Authorization': authorization
        });
      }

      if (url !== 'chat/rooms' && m !== 'get') {
        ngProgress.start();
      }

      return element;
    });

    Restangular.addResponseInterceptor(function (data, m, url) {
      if (url !== 'chat/rooms' && m !== 'get') {
        ngProgress.complete();
      }

      return data;
    });

    Restangular.setErrorInterceptor(function (response) {
      ngProgress.complete();
      if (response.status === 401 && response.status === 403) {
        var events = {};

        events.complete = MessagingService.subscribe(CommunicationEvents.user._LOGOUT_COMPLETE_, function () {
          MessagingService.unsubscribe(events.fail);
          $state.go('root.login');
        }, true);

        events.fail = MessagingService.subscribe(CommunicationEvents.user._LOGOUT_FAIL_, function () {
          MessagingService.unsubscribe(events.complete);
        }, true);

        MessagingService.publish(CommunicationEvents.user._LOGOUT_);

        return false;
      }

      try {
        if (response.status === 400 || response.status === 404) {
          AlertingService.danger(CommunicationErrors[response.data.data.code]);
          console.warn('Oops, looks like something went wrong here.\nPlease try your request again later.\n\nError Code: ' + response.data.data.code + '/' + response.data.data.error);
        }
      } catch (error) {
        console.warn('Unknown error');
      }
    });

    function checkCurrentUser (event, toState, toParams) {
      if (! toState.data) {
        return true;
      }
      if (! angular.isFunction(toState.data.rule)) {
        return true;
      }
      var result = toState.data.rule(
        CommunicationUserService.getUser(),
        toParams,
        $location.path()
      );
      if (result && result.to) {
        event.preventDefault();
        $state.go(result.to, result.params, {notify: true});
      }

    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      ngProgress.start();
      checkCurrentUser(event, toState, toParams);
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      ngProgress.complete();
    });

    $rootScope.$on('$stateChangeError', function (event) {
      event.preventDefault();
      $state.go('root.home', null, {notify: true, reload: true});
    });
  }
);
