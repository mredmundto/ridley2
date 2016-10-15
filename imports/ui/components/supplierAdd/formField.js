export const FormField =
{  
  mandatory :
  {
    create : function()
    {
      var obj = {};
      for (key in this.fields) {
        obj[key] = '';
      }
      return obj;
    },
    
    listFields : function()
    {
      var obj = [];
      for (key in this.fields) {
        obj.push(key);
      }
      return obj;
    },

    getLabel : function(name)
    {
      var field = fields[name];
      if (field != undefined) {
        return field.label;
      }
      return null;
    },

    fields :
    {
      ['materials'] : {
        label : 'Materials'
      },
      ['productCode'] : {
        label : 'Product Code'
      },
      ['countryOfOrigin'] : {
        label : 'Country Of Origin'
      },
      ['sanipesWebsite'] : {
        label : 'SANIPES Website'
      },
      ['company'] : {
        label : 'Company / Supplier'
      },
      ['companyWebsite'] : {
        label : 'Company Website'
      },
      ['companyCertificate'] : {
        label : 'Company Certificates'
      },
      ['fishSpecies'] : {
        label : 'Fish Species'
      },
      ['iucnStatus'] : {
        label : 'IUCN status'
      },
      ['speciesCertification'] : {
        label : 'Species Certification'
      },
      ['certificatSupplied'] : {
        label : 'Ridley Species Certificate Supplied'
      },
      ['auditRecordSupplied'] : {
        label : 'Ridley RS Audit Record Supplied'
      },
      ['qms'] : {
        label : 'QMS'
      },
      ['govtManaged'] : {
        label : 'Gov\'t Managed'
      },
      ['certType'] : {
        label : 'IFFO / MSC / ASC / RTRS', 
        type : 'select', 
        values : ['IFFO', 'MSC', 'ASC', 'RTRS']
      },
      ['supplierSite'] : {
        label : 'Supplier site'
      },
      ['expiryDates'] : {
        label : 'MSC/IFFO/ASC/RTRS Expiry Dates'
      },
      ['link'] : {
        label : 'Link (IFFO/MSC/ASC/RTRS websites)'
      },
      ['faoArea'] : {
        label : 'FAO area / CCAMLR area'
      },
      ['faoDesc'] : {
        label : 'FAO Description of Location'
      },
      ['faoLink'] : {
        label : 'FAO Link'
      },
      ['catchMethod'] : {
        label : 'Catching Method'
      }
    }
  }
}
  
  
//  mandatory :
//  {
//    fields :
//    {
//      'materials' : {
//        label : 'Materials'
//      },
//      {'productCode' : {
//        label : 'Product Code'
//      }},
//      {'countryOfOrigin' : {
//        label : 'Country Of Origin'
//      }},
//      {'sanipesWebsite' : {
//        label : 'SANIPES Website'
//      }},
//      {'company' : {
//        label : 'Company / Supplier'
//      }},
//      {'companyWebsite' : {
//        label : 'Company Website'
//      }},
//      {'companyCertificate' : {
//        label : 'Company Certificates'
//      }},
//      {'fishSpecies' : {
//        label : 'Fish Species'
//      }},
//      {'iucnStatus': {
//        label : 'IUCN status'
//      }},
//      {'speciesCertification': {
//        label : 'Species Certification'
//      }},
//      {'certificatSupplied': {
//        label : 'Ridley Species Certificate Supplied'
//      }},
//      {'auditRecordSupplied': {
//        label : 'Ridley RS Audit Record Supplied'
//      }},
//      {'qms': {
//        label : 'QMS'
//      }},
//      {'govtManaged' : {
//        label : 'Gov\'t Managed'
//      }},
//      {'certType' : {
//        label : 'IFFO / MSC / ASC / RTRS', 
//        type : 'select', 
//        values : ['IFFO', 'MSC', 'ASC', 'RTRS']
//      }},
//      {'supplierSite': {
//        label : 'Supplier site'
//      }},
//      {'expiryDates': {
//        label : 'MSC/IFFO/ASC/RTRS Expiry Dates'
//      }},
//      {'link': {
//        label : 'Link (IFFO/MSC/ASC/RTRS websites)'
//      }},
//      {'faoArea': {
//        label : 'FAO area / CCAMLR area'
//      }},
//      {'faoDesc': {
//        label : 'FAO Description of Location'
//      }},
//      {'faoLink': {
//        label : 'FAO Link'
//      }},
//      {'catchMethod' : {
//        label : 'Catching Method'
//      }}
//    },

//    this.optional =
//    [
//      {label : 'BAP', name : 'BAP'},
//      {label : 'BASC (Business Alliance for Secure Commerce)', name : 'BASC'},
//      {label : 'BSE Free Certificate', name : 'BSE'},
//      {label : 'CCAMLR Commission for the Conservation of Antarctic Marine Living Resources', name : 'CCAMlR'},
//      {label : 'Chain of Custody documents', name : 'custodyDoc'},
//      {label : 'CoA\'s', name : 'CoA'},
//      {label : 'Debio (organic)', name : 'Debio'},
//      {label : 'Dolphin Safe', name : 'Dolphin'},
//      {label : 'FEMAS	Friends of the Sea', name : 'FEMAS'},
//      {label : 'GMP', name : 'GMP'},
//      {label : 'HACCP', name : 'HACCP'},
//      {label : 'ISO 14000', name : 'ISO14000'},
//      {label : 'ISO 9001:2008', name : 'ISO9001'},
//      {label : 'ISO 22000:2005', name : 'ISO22000'},
//      {label : 'IUCN', name : 'IUCN'},
//      {label : 'IUU', name : 'IUU'},
//      {label : 'Manufacturers Declaration', name : 'ManufacturersDecl'},
//      {label : 'Naturland', name : 'Naturland'},
//      {label : 'NOFIMA', name : 'NOFIMA'},
//      {label : 'QMS', name : 'QMS'},
//      {label : 'WWF', name : 'WWF'},
//      {label : 'By product of processing', name : 'byProductProcess'},
//      {label : 'Agree G GAP covered', name : 'AgreeGGAP'}
//    ]
 
 
