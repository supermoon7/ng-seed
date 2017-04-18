/*global require, angular, console*/
(function () {
  "use strict";
  require("./index.scss");
  angular.module("jmui.rate", [])
    .directive('jmRate', function ($timeout) {
      return {
        restrict: 'AE',
        template: '<div><ul class="jm-rate"><li ng-class="{}" ng-disabled="disabled" ng-mouseenter="hover($index)" ng-mouseleave="out($index)" class="jm-rate-star" ng-click="choose($event, $index)" ng-repeat="item in max track by $index"><i class="jm-icon {{ jmIconStarOff }}"></i></li></ul> <span class="jm-rate__text" ng-show="showText">{{ text }}</span>  </div>',
        scope: {
          texts: '@',
          onChange: '&',
          model: '='
        },
        controller: jmRateCtrl,
        link: jmRateLinkFn
      };

      function jmRateCtrl($scope, $element, $attrs) {
        var disabeld = $attrs.disabled;
        if (angular.isString(disabeld) && !disabeld) {
          $scope.disabled = true;
        } else {
          $scope.disabled = Boolean($scope.$eval(disabeld));
        }

        $scope.showText = true;
        if (angular.isDefined($attrs.showText)) {
          $scope.showText = $scope.$eval($attrs.showText);
        }

        $scope.$texts = $scope.$eval($scope.texts);
        $scope.max = new Array(parseInt($attrs.max, 10) || 5);
        console.log($scope.texts);
      }

      function jmRateLinkFn(scope, element, attrs, ctrl) {
        var aLi = [];
        var icons = [];
        var timer = null;
        var isChoose = false;

        // 低分和中等分数的界限值，值本身被划分在低分中
        var lowThreshold = attrs.lowThreshold;

        // 高分和中等分数的界限值，值本身被划分在高分中
        var highThreshold = attrs.highThreshold;

        // 等级颜色
        var colors = scope.$eval(attrs.colors) || ['#F7BA2A', '#F7BA2A', '#F7BA2A'];

        // 未选中Icon的颜色
        var voidColor = attrs.voidColor || "#C6D1DE";

        var changeFn = scope.onChange || angular.noop;

        element.find('.jm-rate__text').css({
          color: attrs.textColor
        });

        scope.hover = hover;
        scope.out = out;
        scope.choose = choose;

        scope.jmIconStarOff = attrs.jmIconStarOff;
        scope.jmIconStarOn = attrs.jmIconStarOn;

        $timeout(function () {
          aLi = element.find('.jm-rate-star')
            .css({
              color: voidColor
            });
          icons = element.find('.jm-rate-star i');
          change('model');
          if (angular.isDefined(scope.model)) {
            isChoose = true;
          }
        }, 0);


        // 监听model
        scope.$watch('model', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            change('model');
            isChoose = true;
          }
        });



        function choose($event, $index) {
          if (scope.disabled) {
            return;
          }
          isChoose = true;
          scope.model = $index;
          changeFn({
            event: $event,
            model: scope.model
          });
        }

        function hover($index) {
          if (scope.disabled) {
            return;
          }

          scope.val = $index;
          change('val');
          angular.element(aLi[scope.val]).addClass('hover');
        }

        function change(type) {
          $timeout.cancel(timer);
          aLi.removeClass('hover');
          angular.forEach(aLi, function (li, index) {
            var $li = angular.element(li);
            var $el = $li.find('i');
            if (scope[type] >= index) {
              $li.addClass('on');
              $el.addClass(scope.jmIconStarOn);
              $el.removeClass(scope.jmIconStarOff);

              // 判断当前选择的值在哪一个区域
              if (scope[type] < lowThreshold) {
                $li.css({
                  color: colors[0]
                });
              } else if (scope[type] < highThreshold) {
                $li.css({
                  color: colors[1]
                });
              } else {
                $li.css({
                  color: colors[2]
                });
              }

            } else {
              $li.removeClass('on').css({
                color: voidColor
              });
              $el.removeClass(scope.jmIconStarOn);
              $el.addClass(scope.jmIconStarOff);
            }
          });

          scope.text = scope.$texts[scope[type]];
        }


        function out(item, $index) {
          if (scope.disabled) {
            return;
          }

          aLi.removeClass('hover');
          if (isChoose) {
            change("model");
            return;
          }
          timer = $timeout(function () {
            scope.val = -1;
            console.log('out');
            aLi.removeClass('on').css({
              color: voidColor
            });
            icons.removeClass(scope.jmIconStarOn).addClass(scope.jmIconStarOff);
          }, 30);
        }
      }
    });
}());
