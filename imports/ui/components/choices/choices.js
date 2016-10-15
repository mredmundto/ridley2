import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './inputChoice.html'

class ChoiceCtrl
{
  constructor($scope, $reactive) {
    this.scope = $scope;
    $reactive(this).attach($scope);
  }
  
  select(item) {
    this.scope.model = item;
  }
}

export default angular.module(
  'InputChoice', [angularMeteor]
)
.directive('inputChoice', function($compile)
{
  return {
    restrict: 'E',
    templateUrl,
    scope : {
      label : '@',
      data  : '&',
      model : '=',
      readonly : '=?'
    },
    controller : ChoiceCtrl,
    controllerAs : '$ctrl',
    link : function(scope, iElem, iAttrs) {
      scope.data  = eval(iAttrs.data);
      if (scope.data.indexOf(scope.model) < 0) {
        scope.model = scope.data[0];
      }
      
      if (iAttrs.readonly == null) {
        scope.readonly = false;
      }
    }
  };
});
