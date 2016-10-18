import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierEdit.html';

import { SupplierUtils } from '../supplier/supplierUtils.js';
import { name as linkText } from '../linkText/linkText';
import { name as linkModal } from '../linkText/linkModal';
import { name as inputText } from '../inputText/inputText';
import { name as inputChoice } from '../inputChoice/inputChoice';

class EditSupplierCtrl
{
  constructor($scope, $reactive, $stateParams) {
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
    this.supplier       = null;
    $reactive(this).attach($scope);
  }
  
  init() {
    this.call('getSupplier', this.supplierId, function(error, result) {
      if (!error) {
        this.supplier = result;
      }
    })
  }
  
  addExtraCertificate() {
    this.supplier.extraCerts.push({"cert" : this.extraCert, "info" : this.extraCertInfo});
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
  }
  
  
  openLinkModal(cb) {
    this.urlSetter = cb;
    angular.element('#link-modal').modal('show');
  }
  
  linkToUrl() {
    this.urlSetter(this.newLinkUrl);
    this.newLinkUrl = '';
  }
  
  addSite() {
    this.addingSite = true;
  }
  
  createSite() {
    let site = SupplierUtils.createSite(this.newSiteName);
    this.supplier.sites.push(site);
    this.newSiteName = '';
    this.addingSite  = false;
  }
  
  removeSite(idx) {
    this.supplier.sites.splice(idx, 1);
  }
  
  cancelCreateSite() {
    this.addingSite = false;
  }
  
  addExtraCertificate(site) {
    site.extraCerts.push({"cert" : this.extraCert, "info" : this.extraCertInfo});
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
  }
  
  removeExtraCertificate(site, idx) {
    site.extraCerts.splice(idx, 1);
  }
  
  addExtraData1(site) {
    let value = SupplierUtils.getExtraData1Criterion(parseInt(this.extraData1));
    site.extraData1.push({"criterion" : value, "info" : this.extraData1Info});
    this.extraData1     = "1";
    this.extraData1Info = "";
  }
  
  removeExtraData1(site, idx) {
    site.extraData1.splice(idx, 1);
  }
  
  addExtraData2(site) {
    let value = SupplierUtils.getExtraData2Criterion(parseInt(this.extraData2));
    site.extraData2.push({"criterion" : value, "info" : this.extraData2Info});
    this.extraData2     = "1";
    this.extraData2Info = "";
  }
  
  removeExtraData2(site, idx) {
    site.extraData2.splice(idx, 1);
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
  angularMeteor, linkText, linkModal, inputText, inputChoice
])
.component('supplierEdit',
{
  templateUrl,
  controller: EditSupplierCtrl,
});