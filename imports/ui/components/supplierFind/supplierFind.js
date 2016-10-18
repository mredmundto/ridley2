import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierFind.html';

class SearchCtrl
{
  constructor($scope, $state, $reactive, $stateParams) {
    'ngInject';
    this.$scope   = $scope;
    this.$state   = $state;
    this.suppliers = {};
    this.criteria  = $stateParams;
    $reactive(this).attach($scope);
    
    if (this.criteria.run === true) {
      switch (this.criteria.searchBy) {
        case 'byScore' : {
          this.findByScore();
          break;
        }
        
        case 'byCertificate' : {
          this.findByCert();
          break;
        }
      }
    }
  }

  resetValue() {
    switch (this.criteria.searchBy) {
      case 'byCertificate' : {
        this.criteria.value = 'IFFO';
        break;
      }
      
      case "byAsc" : {
        this.criteria.value = 'ASC';
        break;
      }
      
      case "byCaptureMethod" : {
        this.criteria.value = 'Wild Caught';
        break;
      }
      
      case "byMaterial" : {
        this.criteria.value = 'Fish Meal';
        break;
      }
      
      default : {
        this.criteria.value = '';
        this.criteria.cmp   = 'gt';
        break;
      }
    }
  }

  findByName() {
    this.call('findSuppliersByName', this.criteria.value, (error, result) =>
    {
      if (result) {
        this.suppliers = result;
      }
    })
  }

  findByScore() {
    this.call('findSuppliersByScore', this.criteria.cmp, this.criteria.value, (error, result) =>
    {
      if (result) {
        this.suppliers = result;
      }
    })
  }

  findByCert() {
    this.call('findSuppliersByCertificate', this.criteria.value, (error, result) =>
    {
      if (result) {
        this.suppliers = result;
      }
    })
  }
}

export default angular
.module('SupplierFind', [
  angularMeteor
])
.directive('supplierFind', function()
{
  return {
    restrict: 'E',
    templateUrl,
    controller : SearchCtrl,
    controllerAs : '$ctrl'
  }
});