import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierFind.html';

function runAction(action) {
  angular.element('#progress-modal').modal('show');
  try {
    action();
  }
  catch (e) {
    angular.element('#progress-modal').modal('hide');
  }
}

let endSearch = (ctrl, error, result) => {
  try {
    if (result) {
      ctrl.suppliers = result;
    }
  }
  catch (e) {
  }
  angular.element('#progress-modal').modal('hide');
};
      

class SearchCtrl
{
  constructor($scope, $state, $reactive, $stateParams) {
    'ngInject';
    this.$scope     = $scope;
    this.$state     = $state;
    this.suppliers  = {};
    this.resultType = 'type1'; 
    this.criteria   = $stateParams;
    $reactive(this).attach($scope);
    
    if (this.criteria.run === true) {
      switch (this.criteria.searchBy) {
        case 'byCertificate' : {
          this.findByCert();
          break;
        }
        
        case "byAsc" : {
          this.findByAsc();
          break;
        }

        case "byCaptureMethod" : {
          this.findByCaptureMethod();
          break;
        }
      }
    }
  }

  hasType1Result() {
    return this.resultType === "type1" && this.suppliers.length > 0;
  }

  hasType2Result() {
    return this.resultType === "type2" && this.suppliers.length > 0;
  }

  resetValue() {
    switch (this.criteria.searchBy) {
      case 'byCertificate' : {
        this.criteria.value = 'IFFO';
        break;
      }
      
      case "byAsc" : {
        this.criteria.value = 'yes';
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
    let action = () => {
      this.resultType = "type1";
      this.call('findSuppliersByName', this.criteria.value, (error, result) => {
        endSearch(this, error, result);
      });
    };
    runAction(action);
  }

  findByScore() {
    let action = () => {
      this.resultType = "type2";
      this.call('findSuppliersByScore', this.criteria.cmp, this.criteria.value, (error, result) => {
        endSearch(this, error, result);
      });
    }
    runAction(action);
  }

  findByCert() {
    let action = () => {
      this.resultType = "type2";
      this.call('findSuppliersByCertificate', this.criteria.value, (error, result) => {
        endSearch(this, error, result);
      });
    }
    runAction(action);
  }
  
  findByAsc() {
    let action = () => {
      let value = (this.criteria.value === 'yes' ? true : false);
      this.resultType = "type2";
      this.call('findSuppliersByAsc', value, (error, result) => {
        endSearch(this, error, result);
      });
    }
    runAction(action);
  }
  
  findByCaptureMethod() {
    let action = () => {
      this.resultType = "type2";
      this.call('findSuppliersByCaptureMethod', this.criteria.value, (error, result) => {
        endSearch(this, error, result);
      });
    }
    runAction(action);
  }

  findByMaterial() {
    let action = () => {
      this.resultType = "type2";
      this.call('findSuppliersByMaterial', this.criteria.value, (error, result) => {
        endSearch(this, error, result);
      });
    }
    runAction(action);
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