import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierEdit.html';

import { SupplierUtils } from '../supplier/supplierUtils.js';
import { name as linkText } from '../linkText/linkText';
import { name as linkModal } from '../linkText/linkModal';
import { name as inputDate } from '../inputDate/inputDate';
import { name as inputText } from '../inputText/inputText';
import { name as inputChoice } from '../inputChoice/inputChoice';

let success_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-ok-sign green"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Updated Successfully.</h5>';
  
let failure_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-remove-sign red"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Updated Failed.</h5>';


class EditSupplierCtrl
{
  constructor($scope, $reactive, $timeout, $stateParams, $userRole) {
    'ngInject';
    this.$userRole      = $userRole;
    this.timer          = $timeout;
    this.linkUrl        = '';
    this.readonly       = true;
    this.message        = success_popup;
    this.supplierId     = $stateParams.supplierId;    
    this.extraCert      = "ISO 9001";
    this.extraCertInfo  = "";
    this.extraData1     = "1";
    this.extraData1Info = "";
    this.extraData2     = "1";
    this.extraData2Info = "";
    this.supplier       = null;
    this.origSupplier   = null;
    $reactive(this).attach($scope);
  }
  
  init() {
    this.call('getSupplier', this.supplierId, function(error, result) {
      if (!error) {
        this.supplier = result;
      }
    })
  }

  isEditable() {
    if (this.supplier === null)
      return this.readonly;
    else {
      if (!this.supplier.active) {
        return false;
      }
      else {
        return this.readonly;
      }
    }
  }

  isAdmin() {
    return this.$userRole.isAdmin();
  }

  toggleActive() {
    let flag = !this.supplier.active
    this.call('setSupplierActive', this.supplier._id, flag, (error, result) =>
    {
      if (error) {
        this.readonly = false;
        this.message  = failure_popup;        
        this.timer(() => {
          angular.element('#toggleActiveBtn').popover('show');
          this.timer(() => {
            angular.element('#toggleActiveBtn').popover('destroy');
          }, 1500);
        }, 0);
      }
      else {
        this.supplier.active = flag;        
      }
    })
  }

  beginEdit() {
    this.origSupplier = angular.copy(this.supplier);
    this.readonly     = false;
  }

  cancelEdit() {
    this.readonly     = true;
    this.supplier     = this.origSupplier;
    this.origSupplier = null;
  }
  
  openLinkModal(url, cb) {
    this.linkUrl   = url;
    this.urlSetter = cb;
    angular.element('#link-modal').modal('show');
  }
  
  linkToUrl() {
    this.urlSetter(this.linkUrl);
    this.linkUrl = '';
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
    let value = SupplierUtils.getExtraCert(parseInt(this.extraCert));
    site.extraCerts.push({"cert" : value, "info" : this.extraCertInfo});
    this.extraCert     = "0";
    this.extraCertInfo = "";
  }
  
  removeExtraCertificate(site, idx) {
    site.extraCerts.splice(idx, 1);
  }
  
  addExtraData1(site) {
    let value = SupplierUtils.getExtraData1Criterion(parseInt(this.extraData1));
    site.extraData1.push({"criterion" : value, "info" : this.extraData1Info});
    this.extraData1     = "0";
    this.extraData1Info = "";
  }
  
  removeExtraData1(site, idx) {
    site.extraData1.splice(idx, 1);
  }
  
  addExtraData2(site) {
    let value = SupplierUtils.getExtraData2Criterion(parseInt(this.extraData2));
    site.extraData2.push({"criterion" : value, "info" : this.extraData2Info});
    this.extraData2     = "0";
    this.extraData2Info = "";
  }
  
  removeExtraData2(site, idx) {
    site.extraData2.splice(idx, 1);
  }
  
  submit() {
    this.readonly = true;
    this.call('updateSupplier', this.supplier, (error, result) =>
    {
      if (error) {
        this.readonly = false;
        this.message  = failure_popup;
        this.timer(() => {
          angular.element('#editBtn').popover('show');
          this.timer(() => {
            angular.element('#editBtn').popover('destroy');
          }, 1500);
        }, 0);
      }
      else {
        this.origSupplier = null;
        this.message      = success_popup;
        angular.element('#editBtn').popover('show');
        this.timer(() => {
          this.timer(() => {
            angular.element('#editBtn').popover('destroy');
          }, 1500);
        }, 0);
      }
    })
  }
}

export default angular.module('SupplierEdit', [
  angularMeteor, linkText, linkModal, inputDate, inputText, inputChoice
])
.component('supplierEdit',
{
  templateUrl,
  controller: EditSupplierCtrl,
});