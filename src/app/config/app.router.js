'use strict';

angular.module('app').config(
  /* @ngInject */
  function($stateProvider, $urlRouterProvider) {
    var CheckIsLoggedIn = function (user, params, location) {
      if (user.authorization && (! location || location === '/root/' || location === '/root/home')) {
        return {to: 'root.home.chat', params: params};
      }
    };

    var CheckIsNotLoggedIn = function (user, params, location) {
      if (! user.authorization) {
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

    var rooms = {
      templateUrl: 'app/sections/chat/rooms/rooms.html',
      controller: 'RoomsController',
      controllerAs: 'rooms'
    };

    var conversation = {
      templateUrl: 'app/sections/chat/conversation/conversation.html',
      controller: 'ConversationController',
      controllerAs: 'conversation'
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
        abstract: true,
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
            rule: CheckIsLoggedIn
          }
        }
      },
      {
        stateName : 'root.home.chat',
        stateData : {
          resolve: {},
          url: '/chat',
          views : {
            'conversation' : conversation,
            'rooms' : rooms
          },
          'data': {
            rule: CheckIsNotLoggedIn
          }
        }
      },
      {
        stateName : 'root.home.room',
        stateData : {
          resolve: {},
          url: '/chat/:room',
          views : {
            'conversation' : conversation,
            'rooms' : rooms
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
