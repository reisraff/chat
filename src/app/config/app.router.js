'use strict';

angular.module('app').config(
  /* @ngInject */
  function($stateProvider, $urlRouterProvider) {
    var CheckIsLoggedIn = function (administrator, params, location) {
      if (administrator.token && (! location || location === '/root/')) {
        return {to: 'root.home', params: params};
      }
    };

    var CheckIsNotLoggedIn = function (administrator, params, location) {
      if (! administrator.token) {
        return {to: 'root.login', params: {redirect: location}};
      }
    };

    var navbar = {
      templateUrl: 'app/sections/navbar/navbar.html',
      controller: 'NavbarController',
      controllerAs: 'nav'
    };

    var alerting = {
      templateUrl: 'app/sections/alerting/alerting.html',
      controller: 'AlertingController',
      controllerAs: 'alert'
    };

    var footer = {
      templateUrl: 'app/sections/footer/footer.html'
    };

    var states = [
      {
        stateName : 'root',
        stateData : {
          url: '/root',
          views : {
            'navbar': navbar,
            'alerting': alerting,
            'footer': footer
          }
        }
      },
      {
        stateName : 'root.login',
        stateData : {
          resolve: {},
          url: '/',
          views : {
            '@' : {
              templateUrl: 'app/sections/login/login.html',
              controller: 'LoginController',
              controllerAs: 'login'
            }
          },
          'data': {
            rule: CheckIsLoggedIn
          }
        }
      },
      {
        stateName : 'root.join',
        stateData : {
          resolve: {},
          url: '/join',
          views : {
            '@' : {
              templateUrl: 'app/sections/join/join.html',
              controller: 'JoinController',
              controllerAs: 'join'
            }
          },
          'data': {
            rule: CheckIsLoggedIn
          }
        }
      },
      {
        stateName : 'root.home',
        stateData : {
          resolve: {},
          url: '/home',
          views : {
            '@' : {
              templateUrl: 'app/sections/home/home.html',
              controller: 'HomeController',
              controllerAs: 'home'
            }
          },
          'data': {
            rule: CheckIsNotLoggedIn
          }
        }
      }
    ];

    angular.forEach (states, function (state) {
      $stateProvider.state(state.stateName, state.stateData);
    });

    $urlRouterProvider.otherwise('/root/');
  }
);
