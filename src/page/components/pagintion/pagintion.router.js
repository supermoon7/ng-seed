var templateUrl = require('./pagintion.html');

module.exports = {
  url:'^/pagintion',
  // abstract: true,
  templateUrl: templateUrl,
  controller: 'PagintionCtrl',
  controllerAs: 'vm',

  resolve: {
    /*@ngInject*/
    loadCtrl: function ($q) {
      var defer = $q.defer();
      require.ensure([], function (require) {
        defer.resolve(require('./pagintion.controller.js'));
      }, 'pagintion');
      return defer.promise;
    }
  }
};
