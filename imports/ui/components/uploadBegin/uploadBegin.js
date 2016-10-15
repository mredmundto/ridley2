import angular from 'angular';
import angularMeteor from 'angular-meteor';

export default angular.module(
  'UploadBegin', [angularMeteor]
)
.directive('uploadBegin', ['$parse', function($parse)
{
  return {
    restrict: 'A',
    scope: {
      handler: '&'
    },
    link: function(scope, iElem, iAttrs)
    {
      iElem.on('change', function(e)
      {
        var file = e.currentTarget.files[0];
        scope.handler({file : file});
      });
    }
  }
}]);
