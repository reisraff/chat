'use strict';

angular.module(
  'app',
  [
    'restangular',
    'ui.router',
    'ngProgress',
    'app.communication',
    'btford.socket-io'
  ]
)
.factory(
  'mySocket',
  function (socketFactory) {
    return socketFactory({
      ioSocket: io('http://localhost:3002')
    });
  }
);
