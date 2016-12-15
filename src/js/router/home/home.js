var templateUrl = require('page/home/home.html');

module.exports = {
    title: "首页",
    url: '/',
    templateUrl: templateUrl,
    controller: 'HomeCtrl',
    resolve: {
        /*@ngInject*/
        loadCtrl: function ($q) {
            var defer = $q.defer();
            require.ensure([], function (require) {
                defer.resolve(require('controller/homeCtrl.js'));
            }, 'home');
            return defer.promise;
        }
    }
};