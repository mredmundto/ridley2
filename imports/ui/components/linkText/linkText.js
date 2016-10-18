import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './linkText.html'

export default angular.module(
  'LinkText', [angularMeteor]
)
.directive('linkText', function()
{
  return {
    restrict: 'E',
    templateUrl,
    scope : {
      name  : '@',
      label : '@',
      txtModel : '=',
      urlModel : '=',
      field : '=',
      readonly : '=?',
      required : '@?',
      placeholder : '@',
      action : "&?"
    },
    controller : ($scope, $window) => {
      $scope.urlSetter = (url) => {
        $scope.urlModel = url;
      }
      
      $scope.gotoLink = () => {
        if ($scope.urlModel) {
          $window.open($scope.urlModel, '_blank');
        }
      }
    },
    link : function(scope, iElem, iAttrs) {
      if (iAttrs['required'] == null || iAttrs['required'] != 'true') {
        scope.required = false;
      }
      else {
        scope.required = true;
      }
      
      if (iAttrs['readonly'] == null) {
        scope.readonly = false;
      }
    }
  };
});
