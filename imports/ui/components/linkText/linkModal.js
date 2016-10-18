import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './linkModal.html'

export default angular.module(
  'LinkModal', [angularMeteor]
)
.directive('linkModal', function()
{
  return {
    restrict: 'E',
    templateUrl,
    scope : {
      model : '=',
      action : "&"
    }
  };
});
