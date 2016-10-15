import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './supplierAdd.html';
import { Suppliers } from '../../../api/suppliers';
import { name as uploadBegin } from '../uploadBegin/uploadBegin';
import { name as inputText } from '../inputText/inputText';
import { name as inputChoice } from '../inputChoice/inputChoice';


class ExcelParser
{
  constuctor() {}
  
  parse(file, fieldMap, cb)
  {
    if (file != null || file != undefined)
    {
      var reader = new FileReader();
      reader.onload = function(e)
      {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});

        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];
        var fieldCols = {};
        var entries   = [];
        for (z in worksheet)
        {
          /* all keys that do not begin with "!" correspond to cell addresses */
          if (z[0] === '!')
            continue;

          if (z.endsWith('1'))
          {
            var label = worksheet[z].v;
            var col   = z.substring(0, z.length - 1)
            fieldCols[col] = fieldMap[label];

          }
          else
          {
            var idx = z.substring(z.length - 1) - 2;
            if (entries[idx] == undefined) {
              entries[idx] = {};
            }

            var col   = z.substring(0, z.length - 1)
            var field = fieldCols[col];
            entries[idx][field] = worksheet[z].v;
          }
        }

        cb(entries[0]);
      };
      reader.readAsBinaryString(file);
    }
  }
}

class AddSupplierCtrl
{
  constructor($scope, ExcelParser) {
    'ngInject';
    this._scope        = $scope;
    this.level4Certs   = [];
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
    this.ExcelParser   = ExcelParser;
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
      
    $scope.fields =
    {
      mandatory : 
      [
        {label : 'Materials', name : 'Materials'},
        {label : 'Product Code', name : 'productCode'},
        {label : 'Country Of Origin', name : 'countryOfOrigin'},
        {label : 'SANIPES Website', name : 'sanipesWebsite'},
        {label : 'Company / Supplier', name : 'company'},
        {label : 'Company Website', name : 'companyWebsite'},
        {label : 'Company Certificates', name : 'companyCertificate'},
        {label : 'Fish Species', name : 'fishSpecies'},
        {label : 'IUCN status', name : 'iucnStatus'},
        {label : 'Species Certification', name : 'speciesCertification'},
        {label : 'Ridley Species Certificate Supplied', name : 'certificatSupplied'},
        {label : 'Ridley RS Audit Record Supplied', name : 'auditRecordSupplied'},
        {label : 'QMS', name : 'qms'},
        {label : 'Gov\'t Managed', name : 'govtManaged'},
        {label : 'IFFO / MSC / ASC / RTRS', name : 'certType', type : 'select', values : ['IFFO', 'MSC', 'ASC', 'RTRS']},
        {label : 'Supplier site', name : 'supplierSite'},
        {label : 'MSC/IFFO/ASC/RTRS Expiry Dates', name : 'expiryDates'},
        {label : 'Link (IFFO/MSC/ASC/RTRS websites)', name : 'link'},
        {label : 'FAO area / CCAMLR area', name : 'faoArea'},
        {label : 'FAO Description of Location', name : 'faoDesc'},
        {label : 'FAO Link', name : 'faoLink'},
        {label : 'Catching Method', name : 'catchMethod'}
      ],
      optional :
      [
        {label : 'BAP', name : 'BAP'},
        {label : 'BASC (Business Alliance for Secure Commerce)', name : 'BASC'},
        {label : 'BSE Free Certificate', name : 'BSE'},
        {label : 'CCAMLR Commission for the Conservation of Antarctic Marine Living Resources', name : 'CCAMlR'},
        {label : 'Chain of Custody documents', name : 'custodyDoc'},
        {label : 'CoA\'s', name : 'CoA'},
        {label : 'Debio (organic)', name : 'Debio'},
        {label : 'Dolphin Safe', name : 'Dolphin'},
        {label : 'FEMAS	Friends of the Sea', name : 'FEMAS'},
        {label : 'GMP', name : 'GMP'},
        {label : 'HACCP', name : 'HACCP'},
        {label : 'ISO 14000', name : 'ISO14000'},
        {label : 'ISO 9001:2008', name : 'ISO9001'},
        {label : 'ISO 22000:2005', name : 'ISO22000'},
        {label : 'IUCN', name : 'IUCN'},
        {label : 'IUU', name : 'IUU'},
        {label : 'Manufacturers Declaration', name : 'ManufacturersDecl'},
        {label : 'Naturland', name : 'Naturland'},
        {label : 'NOFIMA', name : 'NOFIMA'},
        {label : 'QMS', name : 'QMS'},
        {label : 'WWF', name : 'WWF'},
        {label : 'By product of processing', name : 'byProductProcess'},
        {label : 'Agree G GAP covered', name : 'AgreeGGAP'}
      ]
    };
  }
  
  addExtraCertificate() {
    this.level4Certs.push({"cert" : this.extraCert, "info" : this.extraCertInfo});
    this.extraCert     = "ISO 9001";
    this.extraCertInfo = "";
  }
  
  removeExtraCertificate(idx) {
    this.level4Certs.splice(idx, 1);
  }
  
  upload(file) {
    this.ExcelParser.parse(file, this.fieldMap, (value) => {
      this.supplier = value;
      this._scope.$digest();
    })
  }
  
  submit() {
    Meteor.call('addSupplier', this.supplier, (error, result) =>
    {
      if (error) {
        console.log(error);
      }
      else {
        this.reset();
      }
    })
  }
  
  reset() {
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
  }
}

export default angular.module('SupplierAdd', [
  angularMeteor, inputText, inputChoice, uploadBegin
])
.service('ExcelParser', ExcelParser)
.component('supplierAdd',
{
  templateUrl,
  controller: AddSupplierCtrl,
});