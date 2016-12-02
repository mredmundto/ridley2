import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './inputDate.html'

export default angular.module(
  'InputDate', [angularMeteor]
)
.directive('inputDate', function()
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
      required : '@?'
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
})
.directive('checkDate', () => {
  return {
    restrict: 'A',
    require: 'ngModel',
    link : function(scope, iElem, iAttrs, ngModel) {
      if (!ngModel) return;
      
      ngModel.$parsers.unshift((value) => {
        if (ngModel.$isEmpty(value)) 
          return value;
        
        console.log(value + " / " + ngModel.$valid + " / " + ngModel.$invalid);
        if (value.length !== 10) {
          if (ngModel.$valid) {
            return value;
          }
          return undefined;
        }
        else {
          let dateMS = Date.parse(value);
          if (isNaN(dateMS)) {
            return undefined;
          }
          else {
            return value;
          }
        }
      });
    }
  };
});
