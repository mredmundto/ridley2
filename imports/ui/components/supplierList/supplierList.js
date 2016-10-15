import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierList.html';
import { Suppliers } from '../../../api/suppliers';

class ListSupplier
{
  constructor($scope, $reactive)
  {
    'ngInject';
    $reactive(this).attach($scope);
    $scope.helpers(
    {
      suppliers() {
        return Suppliers.find({});
      }
    });
  }
}

export default angular.module('SupplierList', [
  angularMeteor
])
.component('supplierList',
{
  templateUrl,
  controller: ListSupplier
});