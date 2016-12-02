import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './inputText.html'

export default angular.module(
  'InputText', [angularMeteor]
)
.directive('inputText', function()
{
  return {
    restrict: 'E',
    templateUrl,
    scope : {
      name  : '@',
      label : '@',
      model : '=',
      field : '=',
      readonly : '=?',
      required : '@?',
      placeholder : '@'
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

