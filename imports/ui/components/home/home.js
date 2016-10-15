import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './home.html';
import {name as navbar} from '../navbar/navbar';
//import {name as graph} from '../graph/graph';
 
class HomeCtrl
{
  constructor($scope) {
    this._scope = $scope;
  }
}

export default angular.module('Home', [
  angularMeteor, navbar//, graph
])
.component('home',
{
  templateUrl,
  controller: HomeCtrl
})
.config(function($stateProvider, $urlRouterProvider)
{
  'ngInject';
//  $urlRouterProvider.when('/home', '/home/graph');
//  $stateProvider
//  .state('home.graph', {
//    url : '/graph',
//    template : '<graph class="col-md-10"></graph>'
//  });
})

//    'supplierSearch' : {
//      url: '/supplier/find',
//      template : '<supplier-find class="col-md-10"></supplier-find>'
//    },
//    'supplierAdd' : {
//      url: '/supplier/add',
//      template : '<supplier-add class="col-md-10"></supplier-add>',
////      resolve : {
////        currentUser($q) {
////          if (Meteor.userId() === null) {
////            return $q.reject();
////          } else {
////            return $q.resolve();
////          }
////        }
////      }
//    }
//  });
//})