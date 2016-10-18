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
    this.readonly      = true;
    this.supplierId    = $stateParams.supplierId;    
    this.extraCert      = "ISO 9001";
    this.extraCertInfo  = "";
    this.extraData1     = "1";
    this.extraData1Info = "";
    this.extraData2     = "1";
    this.extraData2Info = "";
    this.supplier = {
      'company' : '',
      'materials' : '',
      'productCode' : '',
      'countryOfOrigin' : '',
      'govtManaged' : false,
      'certType' : 'None',
      
      // All optional after
      'site' : [],
      'sanipesWebsite' : '',
      'companyWebsite' : '',
      'companyCertificate' : '',
      'fishSpecies' : '',
      'speciesCertification' : '',
      'iucnStatus' : '',
      'certificatSupplied' : '',
      'auditRecordSupplied' : '',
      'qms' : '',
      'expiryDates' : '',
      'link' : '',
      'catchMethod' : '',
      'faoArea' : '',
      'faoDesc' : '',
      'faoLink' : '',
      extraCerts : [],
      extraData1 : [],
      extraData2 : []
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
    this.supplier.extraCerts.push({"cert" : this.extraCert, "info" : this.extraCertInfo});
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
  }
  
  removeExtraCertificate(idx) {
    this.supplier.extraCerts.splice(idx, 1);
  }
  
  addExtraData1() {
    this.supplier.extraData1.push({"value" : this.extraData1, "info" : this.extraData1Info});
    this.extraData1     = "1";
    this.extraData1Info = "";
  }
  
  removeExtraData1(idx) {
    this.supplier.extraData1.splice(idx, 1);
  }
  
  addExtraData2() {
    this.supplier.extraData2.push({"value" : this.extraData2, "info" : this.extraData2Info});
    this.extraData2     = "1";
    this.extraData2Info = "";
  }
  
  removeExtraDAta2(idx) {
    this.supplier.extraData2.splice(idx, 1);
  }
  
  upload(file) {
    this.ExcelParser.parse(file, this.fieldMap, (value) => {
      this.supplier = value;
      this._scope.$digest();
    })
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