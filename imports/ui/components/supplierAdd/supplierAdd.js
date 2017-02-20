import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierAdd.html';

import { SupplierUtils } from '../supplier/supplierUtils.js';
import { name as uploadBegin } from '../uploadBegin/uploadBegin';
import { name as linkText } from '../linkText/linkText';
import { name as linkModal } from '../linkText/linkModal';
import { name as inputDate } from '../inputDate/inputDate';
import { name as inputText } from '../inputText/inputText';
import { name as inputChoice } from '../inputChoice/inputChoice';


function getCellValue(cell) {
  if (cell.t === 'n') {
    return cell.w.trim();
  } 
  else if (cell.t === 'b') {
    return cell.v;
  } 
  else {
    if (cell.v === undefined || cell.v === null) {
      return '';
    }
    else {
      return cell.v.trim();
    }
  }
}

function getValueAsLink(cell) {
  let value = {'text' : cell.v, 'url' : ''};
  if (cell.l !== undefined && cell.l.Target !== undefined) {
    value.url = cell.l.Target;
  }
  else {
    let funcName = cell.v.substr(0, 10);
    if ('=HYPERLINK' == funcName.toUpperCase()) {
      let linkInfo = cell.v.substring(10, cell.v.length-1);
      let parts = linkInfo.split(',');
      value = {'text' : parts[1], 'url' : parts[0]};
    }
  }
  return value;
}

function getCellDateValue(cell) {
  let value = cell.v;
  if (value === undefined || value === null) {
    return '';
  }
  
  if (cell.t === 'n') {
    return new Date((value - (25567 + 2))*86400*1000);
  }
  else if (cell.t === 's') {
    let parts = cell.v.split('/');
    if (parts.length !== 3) {
      throw 'Invalid date format : ' + cell.v.trim();
    }
    let month = parts[1] - 1;
    return new Date(parts[2], month, parts[0]);
  }
  else {
    throw 'Invalid date format : ' + cell.w.trim();
  }
	
}

class ExcelParser
{
  constuctor() {}
  
  parse(file, fieldMap, cb)
  {
    if (file != null || file != undefined) {
      var reader = new FileReader();
      reader.onload = function(e)
      {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type:'binary', cellDates:true, cellDates:true});

        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];

        let colFields     = {};
        let colLabels     = [];
        let keyColumns    = [];
        let commonColumns = [];
        let supplier      = SupplierUtils.createSupplier();
        let site          = SupplierUtils.createSite();
        let records       = [];

        let currentRow = '2';
        for (z in worksheet)
        {
          /* all keys that do not begin with "!" correspond to cell addresses */
          if (z[0] === '!')
            continue;

          let row = z.match(/\d+/g)[0];
          let col = z.match(/\D+/g)[0];
          if (row === '1') {
            let label = worksheet[z].v.trim();
            colLabels[col] = label;

            let field = SupplierUtils.labelToField(label);
            if (field === undefined) {
              if (SupplierUtils.extraCertIdx(label) < 0 &&
                  SupplierUtils.extraData1Idx(label) < 0 &&
                  SupplierUtils.extraData2Idx(label) < 0) {
                cb({msg : "Unknown column " + label}, undefined);
                return;
              }
            }
            colFields[col] = field;

            if (SupplierUtils.isKeyField(label)) {
              keyColumns.push(col);
            }
            else if (SupplierUtils.isCommonField(label)) {
              commonColumns.push(col);
            }
          }
          else {
            // Process data rows
            if (currentRow != row) {
              supplier.sites.push(site);                            
              supplier = SupplierUtils.createSupplier();
              site     = SupplierUtils.createSite();
              currentRow = row;
            }

            let label = colLabels[col];
            let field = colFields[col];

            if (SupplierUtils.isKeyField(label)) {
              let value = getCellValue(worksheet[z]);
              supplier[field] = value;
              if (!records[value]) {
                records[value] = supplier;
              } else {
                supplier = records[value];
              }
            }
            else if (SupplierUtils.isCommonField(label)) {
              if (SupplierUtils.isLinkField(field)) {
                supplier[field] = getValueAsLink(worksheet[z]);
              } else {
                supplier[field] = getCellValue(worksheet[z]);
              }
            }
            else if (SupplierUtils.isFishScoreField(field)) {
              try {
                site[field] = SupplierUtils.parseFishScore(worksheet[z].v);
              }
              catch (e) {
                cb({msg : e});
                return;
              }
            }
            else if (SupplierUtils.extraCertIdx(label) > -1) {
              let value = getCellValue(worksheet[z]);
              if (value) {
                let cert = {};
                if (typeof value === 'string') {
                  if (value.length > 0) {              
                    cert = {cert : label, info : value}
                    site.extraCerts.push(cert);
                  }
                } 
                else {
                  cert = {cert : label, info : value}
                  site.extraCerts.push(cert);
                }
              }
            }
            else if (SupplierUtils.extraData1Idx(label) > -1) {
              let value = getCellValue(worksheet[z]);
              if (value) {
                let xData = {};
                if (typeof value === 'string') {
                  if (value.length > 0) {
                    xData = {criterion : label, info : value}
                    site.extraData1.push(xData);
                  }
                } 
                else {
                  xData = {criterion : label, info : value}
                  site.extraData1.push(xData);
                }

              }
            }
            else if (SupplierUtils.extraData2Idx(label) > -1) {
              let value = getCellValue(worksheet[z]);
              if (value) {
                let xData = {};
                if (typeof value === 'string') {
                  if (value.length > 0) {
                    xData = {criterion : label, info : value}
                    site.extraData2.push(xData);
                  }
                }
                else {
                  xData = {criterion : label, info : value}
                  site.extraData2.push(xData);
                }   
              }
            }
            else {
              let value = getCellValue(worksheet[z]);
              if (SupplierUtils.isDateField(field)) {
                try {
                  value = getCellDateValue(worksheet[z]);
                }
                catch (e) {
                  cb({msg : e});
                  return;
                }
              }
              
              if (value) {
                if (typeof value === 'string' && value.length > 0) {
                  if (SupplierUtils.isLinkField(field)) {
                    site[field] = getValueAsLink(worksheet[z]);
                  }
                  else {
                    site[field] = value;
                  }
                }
                else {
                  site[field] = value;
                }
              }
            }
          }
        }

        if (supplier.sites == undefined) {
          supplier.sites = [];
        }
        supplier.sites.push(site);

        let result = []
        Object.keys(records).forEach((key, idx) => {
          result.push(records[key]);
        });
        cb(undefined, result);
      };
      reader.readAsBinaryString(file);
    }
  }
}


let success_add_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-ok-sign green"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Added Successfully.</h5>';
  
let failure_add_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-remove-sign red"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Added Failed.</h5>';

let success_upload_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-ok-sign green"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Uploaded Successfully.</h5>';
  
let failure_upload_popup =
  '<h4 class="no-margin no-padding" style="display:inline-block">' +
  '<span class="glyphicon glyphicon-remove-sign red"></span></h4>' +
  '<h5 class="no-margin no-padding" style="display:inline-block">&nbsp;&nbsp;Uploaded Failed.</h5>';

class AddSupplierCtrl
{
  constructor($scope, $reactive, $timeout, ExcelParser) {
    'ngInject';
    $scope.score_pattern = '\\d+(\\.\\d+)?'
    
    this.timer       = $timeout;
    this.fieldMapper = SupplierUtils;
    this.ExcelParser = ExcelParser;
    this.addingSite  = false;
    this.newSiteName = '';
    this.urlSetter   = null;
    this.newLinkUrl  = '';
    this.message     = success_add_popup;

    this.extraCert      = "ISO 9001";
    this.extraCertInfo  = "";
    this.extraData1     = "1";
    this.extraData1Info = "";
    this.extraData2     = "1";
    this.extraData2Info = "";
    this.supplier = SupplierUtils.createSupplier();
    
    this.failOp     = null;
    this.failReason = null;
    
    $reactive(this).attach($scope);
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
  
  upload(file) {
    this.ExcelParser.parse(file, this.fieldMap, (error, records) => {
      if (error !== undefined) {
        this.failOp     = "Upload File";
        this.failReason = error.msg;
        this.timer(() => {
          angular.element('#opStatusModal').modal('show');
        }, 0);
      }
      else {      
        angular.element('#progress-modal').modal('show');
        Meteor.call('uploadSuppliers', records, (error, result) =>
        {
          angular.element('#progress-modal').modal('hide');
          if (error) {
            if (error.reason !== undefined) {
              this.failReason = error.reason;
            }
            else if (error.msg !== undefined) {
              this.failReason = error.msg;
            }
            else {
              this.failReason = "Unknown error";
            }

            this.timer(() => {
              angular.element('#opStatusModal').modal('show');
            }, 0);
          }
          else {
            this.message = success_upload_popup;
            angular.element('#uploadBtn').popover('show');
            this.timer(() => {
              angular.element('#uploadBtn').popover('destroy');
            }, 1500);
          }
        })
      }
    });
  }
  
  submit() {
    Meteor.call('addSupplier', this.supplier, (error, result) =>
    {
      if (error) {
        if (error.reason !== undefined) {
          this.failReason = error.reason;
        }
        else if (error.msg !== undefined) {
          this.failReason = error.msg;
        }
        else {
          this.failReason = "Unknown error";
        }

        this.timer(() => {
          angular.element('#opStatusModal').modal('show');
        }, 0);
      }
      else {
        this.reset();
        this.message = success_add_popup;
        angular.element('#submitBtn').popover('show');
        this.timer(() => {
          angular.element('#submitBtn').popover('destroy');
        }, 1500);
      }
    })
  }
  
  reset() {
    this.extraCert      = "ISO 9001";
    this.extraCertInfo  = "";
    this.extraData1     = "1";
    this.extraData1Info = "";
    this.extraData2     = "1";
    this.extraData2Info = "";
    SupplierUtils.reset(this.supplier);
  }
}

export default angular.module('SupplierAdd', [
  angularMeteor, linkText, linkModal, inputDate, inputText, inputChoice, uploadBegin
])
.service('ExcelParser', ExcelParser)
.component('supplierAdd',
{
  templateUrl,
  controller: AddSupplierCtrl,
});