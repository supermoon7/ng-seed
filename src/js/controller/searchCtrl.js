var app = require('app');

// 调用Api 服务
app.registerController('SearchCtrl',
	/*@ngInject*/
	function ($scope, $http, $q, $location, $stateParams, $state, $timeout, dialogs) {
		// 初始化参数
		$scope.search = {
			categoryId: 10000,
			industryId: 0
		};

		// 基础数据
		$scope.base = {
			categorys: [],
			industrys: []
		};


		$scope.pop = function(){
			dialogs.modal({
				controller:'cccc',
				template:'<form>status: {{ status }}<button type="button" ng-click="ok()">Login</button></form>'
			}).then(function(obj){
				var {scope, data} = obj;
				scope.status = data.msg;

				setTimeout(function(){
					dialogs.close();
				},2000)
				
			}, function(obj){
				var {scope, err} = obj;
				scope.status = err.errMsg;
			});
		}


		angular.extend($scope, {
			changeType: function(list, type){
				$scope.search[type] = list[type];
				$scope.getList();
			},

			getList: function(){
				var search = angular.extend({
					categoryId: $scope.search.categoryId,
					industryId: $scope.search.industryId
				});
				
				// 分类列表
				$http.get('/dist/mock/search.json').then(function (result) {
					$scope.lists = result.data;
					$location.search(search);
				}, function(){
					alert('Error');
				});
			}
		})
		
		// 获取Category
		function getCategory(){
			return $http.get('/dist/mock/categorys.json');
		}

		// 获取Industry
		function getIndustry(){
			return $http.get('/dist/mock/industrys.json');
		}

		// 处理搜索参数
		function processBase(data){
			$scope.base.categorys = data[0].data;
			$scope.base.industrys = data[1].data;
			return $scope.base;
		}

		// 将地址栏上的数据覆盖到搜索条件
		function coverParams(data){
			angular.forEach($stateParams, function(value, key){
				if(value){
					$scope.search[key] = value;
				}
			});
			return $scope.search;
		}

			$q.all([getCategory(), getIndustry()])
				.then(processBase)
				.then(coverParams)
				.then($scope.getList)
		
		
	});
