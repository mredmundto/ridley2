import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierEdit.html';
import { Suppliers } from '../../../api/suppliers';
import { name as uploadBegin } from '../uploadBegin/uploadBegin';
import { name as inputText } from '../inputText/inputText';
import { name as inputChoice } from '../inputChoice/inputChoice';

class EditSupplierCtrl
{
  constructor($scope, $stateParams) {
    'ngInject';
    this._scope        = $scope;
    this.level4Certs   = [];
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
    this.readonly      = true;
    this.supplierId    = $stateParams.supplierId;
    
    this.supplier = {
      'materials' : '',
      'company' : '',
      'productCode' : '',
      'countryOfOrigin' : '',
      'sanipesWebsite' : '',
      'companyWebsite' : '',
      'companyCertificate' : '',
      'fishSpecies' : '',
      'iucnStatus' : '',
      'speciesCertification' : '',
      'certificatSupplied' : '',
      'auditRecordSupplied' : '',
      'qms' : '',
      'govtManaged' : '',
      'certType' : '',
      'supplierSite' : '',
      'expiryDates' : '',
      'link' : '',
      'faoArea' : '',
      'faoDesc' : '',
      'faoLink' : '',
      'catchMethod' : ''
    }
    
    this.fieldMap = {
      'Materials' : 'materials',
      'Product Code' : 'productCode',
      'Country Of Origin' : 'countryOfOrigin',
      'SANIPES Website' : 'sanipesWebsite',
      'Company / Supplier' : 'company',
      'Company Website' : 'companyWebsite',
      'Company Certificates' : 'companyCertificate',
      'Fish Species' : 'fishSpecies',
      'IUCN status' : 'iucnStatus',
      'Species Certification' : 'speciesCertification',
      'Ridley Species Certificate Supplied' : 'certificatSupplied',
      'Ridley RS Audit Record Supplied' : 'auditRecordSupplied',
      'QMS' : 'qms',
      'Gov\'t Managed' : 'govtManaged',
      'IFFO / MSC / ASC / RTRS' : 'certType',
      'Supplier site' : 'supplierSite',
      'MSC/IFFO/ASC/RTRS Expiry Dates' : 'expiryDates',
      'Link (IFFO/MSC/ASC/RTRS websites)' : 'link',
      'FAO area / CCAMLR area' : 'faoArea',
      'FAO Description of Location' : 'faoDesc',
      'FAO Link' : 'faoLink',
      'Catching Method' : 'catchMethod'
    };
  }
  
  init() {
    var ctrl = this;
    Meteor.call('getSupplier', this.supplierId, function(error, result) {
      if (error == null)
      {
        for (var key in ctrl.supplier) {
          if (result[key] != undefined) {
            ctrl.supplier[key] = result[key];
          }
        }
        ctrl._scope.$digest();
      }
    })
  }
  
  addExtraCertificate() {
    this.level4Certs.push({"cert" : this.extraCert, "info" : this.extraCertInfo});
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
  }
  
  removeExtraCertificate(idx) {
    this.level4Certs.splice(idx, 1);
  }
  
  submit() {
//    Meteor.call('addSupplier', this.supplier, (error, result) =>
//    {
//      if (error) {
//        console.log(error);
//      }
//      else {
//        this.reset();
//      }
//    })
  }
}

export default angular.module('SupplierEdit', [
  angularMeteor, inputText, inputChoice, uploadBegin
])
.component('supplierEdit',
{
  templateUrl,
  controller: EditSupplierCtrl,
});