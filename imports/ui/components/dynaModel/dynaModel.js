import angular from 'angular';
import angularMeteor from 'angular-meteor';

export default angular.module(
  'DynaModel', [angularMeteor]
)
.directive('dynaModel', ['$compile', '$parse', function($compile, $parse)
{
  return {
    restrict: 'A',
    link: function(scope, elem)
    {
      var name = $parse(elem.attr('dyna-model'))(scope);
      elem.removeAttr('dyna-model');
      elem.attr('ng-model', name);
      $compile(elem)(scope);
    }
  };
}]);
