'use strict';

(function (module) {
  /* @ngInject */
  module.config(function(ngProgressProvider) {
    ngProgressProvider.setColor('#337ab7');
    ngProgressProvider.setHeight('15px');
  });

  /* @ngInject */
  module.config(function(RestangularProvider) {
    var config = {
      apiBaseUrl: 'http://localhost:3002/api'
    };

    RestangularProvider.setBaseUrl(config.apiBaseUrl);
    RestangularProvider.setDefaultHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    RestangularProvider.setDefaultHttpFields({
      timeout: 15000,
      useXDomain : true
    });
  });
})(angular.module('app'));
