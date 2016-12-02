let keyFields = [
  'Company / Supplier'
];

let commonFields = [
  'Materials',
  'Product Code',
  'Country Of Origin',
  'SANIPES Website',
  'Company Website',
  'Company Certificates'
]

let fieldMap = {
  'Company / Supplier' : 'company',
  'Materials' : 'materials',
  'Product Code' : 'productCode',
  'Country Of Origin' : 'countryOfOrigin',
  'SANIPES Website' : 'sanipesWebsite',
  'Company Website' : 'companyWebsite',
  'Company Certificates' : 'companyCertificate',
  
  // Site specific
  'Supplier site' : 'siteName',
  'Gov\'t Managed' : 'govtManaged',
  'IFFO / MSC / ASC / RTRS' : 'certType',
  'MSC/IFFO/ASC/RTRS Expiry Dates' : 'certExpiry',
  'Link (IFFO/MSC/ASC/RTRS websites)' : 'certLink',  
  'Fish Species' : 'fishSpecies',
  'Species Certification' : 'speciesCertification',
  'IUCN status' : 'iucnStatus',
  'Ridley Species Certificate Supplied' : 'certificatSupplied',
  'Ridley RS Audit Record Supplied' : 'auditRecordSupplied',
  'QMS' : 'qms',
  'FAO area / CCAMLR area' : 'faoArea',
  'FAO Description of Location' : 'faoDesc',
  'FAO Link' : 'faoLink',
  'Catching Method' : 'catchMethod',
  
  // Fish score
  'Is the management strategy precautionary?' : 'fishScore1',
  'Do managers follow scientific advice?'     : 'fishScore2',
  'Do fishers comply?'                        : 'fishScore3',
  'Is the fish stock healthy?'                : 'fishScore4',
  'Will the fish stock be healthy in future?' : 'fishScore5',
  'FishSource Score Link'                     : 'fishScoreLink',
  'Fishbase data'                             : 'fishbaseData'
};

let linkFields = [
  'sanipesWebsite',
  'companyWebsite',
  'certLink',
  'faoLink',
  'fishScoreLink',
  'fishbaseData',
];

let fishScoreFields = [
  'fishScore1',
  'fishScore2',
  'fishScore3',
  'fishScore4',
  'fishScore5'
];

let labels = [
  'Company / Supplier',
  'Materials',
  'Product Code',
  'Country Of Origin',
  'SANIPES Website',
  'Company Website',
  'Company Certificates',
  
  // Site specific
  'Supplier site',
  'Gov\'t Managed',
  'IFFO / MSC / ASC / RTRS',
  'MSC/IFFO/ASC/RTRS Expiry Dates',
  'Link (IFFO/MSC/ASC/RTRS websites)',
  'Fish Species',
  'Species Certification',
  'IUCN status',
  'Ridley Species Certificate Supplied',
  'Ridley RS Audit Record Supplied',
  'QMS',
  'FAO area / CCAMLR area',
  'FAO Description of Location',
  'FAO Link',
  'Catching Method',
  
  // Fish score
  'Is the management strategy precautionary?',
  'Do managers follow scientific advice?',
  'Do fishers comply?',
  'Is the fish stock healthy?',
  'Will the fish stock be healthy in future?',
  'FishSource Score Link',
  'Fishbase data'
];

let extraCerts = [
  'IFFO RS (CoC) / ProTerra CoC',
  'FAO Code of Conduct for Responsible Fisheries',
  'BAP',
  'BASC (Business Alliance for Secure Commerce)',
  'CCAMLR Commission for the Conservation of Antarctic Marine Living Resources',
  'MSC Chain of Custody documents',
  'Debio (organic)',
  'Dolphin Safe',
  'FEMAS',
  'Friends of the Sea',
  'Global Gap',
  'GMP',
  'BSE Free',
  'HACCP',
  'ISO 14001',
  'ISO 9001:2008',
  'ISO 18001:2007',
  'ISO 22000:2005',
  'Naturland',
  'NOFIMA',
  'WWF'
];

let extraInfo1 = [
  "Species are advised on shipping paperwork",
  "CoA's provided with each shipment",
  "CoA's are from 3rd party testing",
  "Antioxidant added",
  "IUCN declaration",
  "IUU declaration",
  "Declaration stating exclusion of slave/child labour/contravene of human rights",
  "Does the supplier have 3rd party verification of compliance to human rights declaration",
  "Manufacturers Declaration statements required for export to NZ in shipping docs",
  "Import statements are in shipping docs",
  "Ruminant statement requirements are in shipping docs",
  "Byproduct/Trimmings of processing",
  "Percentage of Byproduct/Trimmings",
  "Farmed material",
  "Salmonella Testing stated",
  "Shigella testing stated",
  "BSE Free Certificate",
  "If materials are treated with chemicals or pesticides this is noted in paperwork"
];

let extraInfo2 = [
  "Evidence of traceability back to fishery/vessels",
  "Product Specifications supplied",
  "Pre-shipment samples sent to Ridley",
  "Batch samples arrive with goods",
  "<1 NCR in 12 months related to products",
  "<1 NCR in 12 months related to delivery",
  "<1 DAWR Issue in previous 12 months customs/import"
];
  
let dateFields = [
  'certExpiry'
];
  
export const SupplierUtils =
{
  getAllLabels : () => {
    let labelList = [];
    labelList = labelList.concat(labels);
    labelList = labelList.concat(extraCerts);
    labelList = labelList.concat(extraInfo1);
    labelList = labelList.concat(extraInfo2);
    return labelList;
  },
  
  createSupplier : () => {
    return {
      'active'             : true,
      'company'            : '',
      'materials'          : '',
      'productCode'        : '',
      'countryOfOrigin'    : '',
      'sanipesWebsite'     : {text : '', url : ''},
      'companyWebsite'     : {text : '', url : ''},
      'companyCertificate' : '',
      'sites' : []
    };
  },
  
  createSite : (name) => {
    return {
      'siteName'             : name,
      'govtManaged'          : false,
      'certType'             : 'None',
      'certExpiry'           : '',
      'certLink'             : {text : '', url : ''},
      'fishSpecies'          : '',
      'speciesCertification' : '',
      'iucnStatus'           : '',
      'certificatSupplied'   : '',
      'auditRecordSupplied'  : '',
      'qms'                  : '',
      'faoArea'              : '',
      'faoDesc'              : '',
      'faoLink'              : {text : '', url : ''},
      'catchMethod'          : '',
      'fishScore1'           : {'cmp' : 'eq', 'score' : ''},
      'fishScore2'           : {'cmp' : 'eq', 'score' : ''},
      'fishScore3'           : {'cmp' : 'eq', 'score' : ''},
      'fishScore4'           : {'cmp' : 'eq', 'score' : ''},
      'fishScore5'           : {'cmp' : 'eq', 'score' : ''},
      'fishScoreLink'        : {text : '', url : ''},
      'fishbaseData'         : {text : '', url : ''},
      'extraCerts'           : [],
      'extraData1'           : [],
      'extraData2'           : []
    };
  },
  
  reset : (supplier) => {
    supplier.company             = '';
    supplier.materials           = '';
    supplier.productCode         = '';
    supplier.countryOfOrigin     = '';
    supplier.sanipesWebsite.text = '';
    supplier.sanipesWebsite.url  = '';
    supplier.companyWebsite.text = '';
    supplier.companyWebsite.url  = '';
    supplier.companyCertificate  = '';
    supplier.sites               = [];
  },
  
  isKeyField : (field) => {
    return (keyFields.indexOf(field) > -1);
  },
  
  isCommonField : (field) => {
    return (commonFields.indexOf(field) > -1);
  },
  
  isLinkField : (field) => {
    return (linkFields.indexOf(field) > -1);
  },
  
  isFishScoreField : (field) => {
    return (fishScoreFields.indexOf(field) > -1);
  },
  
  isDateField : (field) => {
    return (dateFields.indexOf(field) > -1);
  },
  
  extraCertIdx : (cert) => {
    return extraCerts.indexOf(cert);
  },
  
  extraData1Idx : (data) => {
    return extraInfo1.indexOf(data);
  },
  
  extraData2Idx : (data) => {
    return extraInfo2.indexOf(data);
  },
  
  getExtraCert : (idx) => {
    return extraCerts[idx];
  },
  
  getExtraData1Criterion : (idx) => {
    return extraInfo1[idx];
  },
  
  getExtraData2Criterion : (idx) => {
    return extraInfo2[idx];
  },
  
  listExtraCert : () => {
    return extraCerts;
  },
  
  listExtraData1Criterion : () => {
    return extraInfo1;
  },
  
  listExtraData2Criterion : () => {
    return extraInfo2;
  },
    
  labelToField : (label) => {
    return fieldMap[label];
  },
  
  parseFishScore : (text) => {
    if (typeof text === 'string')
    {
      let value = text.match(/\d+(\.\d+)?/g);
      if (value === null) {
        throw "Invalid score format : " + text;
      }
      else if (value.length === 0) {
        return null;
      }
      else {
        let score = value[0]
        if (score.length !== text.length) {
          let cmp = text.substring(0, text.length - score.length).trim();
          switch (cmp) {
            case '>' : {
              cmp = 'gt';
              break;
            }
            
            case '<' : {
              cmp = 'lt';
              break;
            }
            
            case '≥' : {
              cmp = 'gte';
              break;
            }
            
            case '≤' : {
              cmp = 'lte';
              break;
            }
            
            default : {
              if (value.length > 1) {
                throw "Invalid score format : " + text;
              }
              cmp = 'eq';
              break;
            }
          }
          
          return {
            'cmp' : cmp, 'score' : parseInt(score)
          };
        }
        else {
          return {'cmp' : 'eq', 'score' : parseInt(score)};
        }
      }
    }
    else {
      return {'cmp' : 'eq', 'score' : text};
    }
  },
  
  parseLink : (field, text) => {
    var values = text.split("\r\n");
    if (values.length === 1) {
      return {
        'text' : values[0], 'url' : ''
      };
    }
    else {
      return {
        'text' : values[0], 'url' : values[1]
      };
    }
  }
}
