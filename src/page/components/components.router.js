var templateUrl = require('./components.html');

module.exports = {
  title: "组件",
  url:"/components",
  data: {
    breadcrumbProxy: 'components.chart',
    displayName: '组件'
  },
  templateUrl: templateUrl,
  // controller: 'HomeCtrl',
  // controllerAs: 'vm',
  resolve: {
    /*@ngInject*/
    loadCtrl: function ($q) {
      // var defer = $q.defer();
      // require.ensure([], function (require) {
      //   defer.resolve(require('./../home/home.controller.js'));
      // }, 'home');
      // return defer.promise;
    }
  }
};
