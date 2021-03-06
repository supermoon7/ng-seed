var templateUrl = require('./rate.html');

module.exports = {
  url:'^/rate',
  // abstract: true,
  templateUrl: templateUrl,
  controller: 'RateCtrl',
  controllerAs: 'vm',
  resolve: {
    /*@ngInject*/
    loadCtrl: function ($q) {
      var defer = $q.defer();
      require.ensure([], function (require) {
        defer.resolve(require('./rate.controller.js'));
      }, 'rate');
      return defer.promise;
    }
  }
};
