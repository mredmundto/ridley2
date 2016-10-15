import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './inputSelect.html'

export default angular.module(
  'InputSelect', [angularMeteor]
)
.directive('inputSelect', function()
{
  return {
    restrict: 'E',
    templateUrl,
    scope : {
      name  : '@',
      label : '@',
      data  : '@',
      model : '='
    },
    link : function(scope, iElem, iAttrs)
    {
      $(iElem).find('.selectpicker').selectpicker();
      $(iElem).find('.bootstrap-select').addClass('form-control');
    }
  };
});
