import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './dummy.html';

class Dummy
{
  constructor($scope)
  {
    'ngInject';
    $scope.title = 'Mr. Dummy';
  }
}
 
export default angular.module('Dummy', [
  angularMeteor
])
.component('dummy', 
{
  templateUrl,
  controller: Dummy
});

//angular.module('score-card', [
//  angularMeteor
//])
//.component('dummy', 
//{
//  templateUrl : './dummy.html',
//  controller($scope) {
//    $scope.title = 'Dummy';
//  }
//});