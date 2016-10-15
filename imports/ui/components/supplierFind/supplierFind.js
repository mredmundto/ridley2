import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierFind.html';
//import { Suppliers } from '../../../api/suppliers';

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
    this.criteria.value = '';
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
    controllerAs : '$ctrl',
    compile : function(element) {
      $(element).find('.selectpicker').selectpicker();
    }
  }
});