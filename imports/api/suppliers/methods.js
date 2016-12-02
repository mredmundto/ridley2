import { Meteor } from 'meteor/meteor';
import { Suppliers } from './collection';

function evalFishScore(score, op, criterion) {
  switch (op) {
    case 'eq' : {
      return score;
    }
    
    case 'gt' : {
      let expr = score + ' > ' + criterion;
      if (eval(expr)) {
        return score;
      }
      else {
        return (score - 1);
      }
    }
    
    case 'lt' : {
      let expr = score + ' < ' + criterion;
      if (eval(expr)) {
        return (score - 1);
      }
      else {
        return score;
      }
    }
    
    case 'gte' : {
      let expr = score + ' >= ' + criterion;
      if (eval(expr)) {
        return score;
      }
      else {
        return score;
      }
    }
    
    case 'lte' : {
      let expr = score + ' <= ' + criterion;
      return eval(expr);
    }
  }
  return false;
}

function isAscCertified(supplier) {
  for (let i=0; i < supplier.sites.length; i++)
  {
    let score = 0;
    let site  = supplier.sites[i];
    
    if (site.certType !== 'IFFO' && site.certType !== 'MSC' &&
        site.certType !== 'ASC' && site.certType !== 'RTRS') {
      continue;
    }
    
    for (let j=1; j < 6; j++) {
      let field = 'fishScore' + j;
      switch (j) {
        case 5 : {
          if (score >= 24) {
            let fishScore = parseInt(site[field].score)
            if (fishScore >= 8) {
              return true;
            }
          }
          break;
        }

        default : {
          score += parseInt(site[field].score);
          break;
        }
      }
    }
  }
  return false;
}

function calculateFishScoreContribution(site) {
  let score = 0;
  for (let j=1; j < 6; j++) {
    let field = 'fishScore' + j;
    switch (j) {
      case 5 : {
        if (score >= 24) {
          let fishScore = parseInt(site[field].score)
          if (fishScore >= 8) {
            return 5;
          }
        }
        break;
      }

      default : {
        score += parseInt(site[field].score);
        break;
      }
    }
  }
  return 0;
}

function isCOAComplied(site) {
  let count = 0;
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Salmonella Testing stated") {
      count++;
    }
    else if (site.extraData1[i].criterion === "Shigella testing stated") {
      count++;
    }
  }
  return (count == 2);
}

function isPreShip(site) {
  for (let i=0; i < site.extraData2.length; i++) {
    if (site.extraData2[i].criterion === 'Pre-shipment samples sent to Ridley') {
      return true;
    }
  }
  return false;
}

function is3rdPartyTested(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "CoA's are from 3rd party testing") {
      return true;
    }
  }
  return false;
}

function isAntioxidantAdded(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Antioxidant added") {
      return true;
    }
  }
  return false;
}

function isTraceable(site) {
  for (let i=0; i < site.extraData2.length; i++) {
    if (site.extraData2[i].criterion === "Evidence of traceability back to fishery/vessels") {
      return true;
    }
  }
  return false;
}

function is3rdVerified(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Does the supplier have 3rd party verification of compliance to human rights declaration") {
      return true;
    }
  }
  return false;
}

function isBatchSamples(site) {
  for (let i=0; i < site.extraData2.length; i++) {
    if (site.extraData2[i].criterion === "Batch samples arrive with goods") {
      return true;
    }
  }
  return false;
}

function isNotedInPaperwork(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "If materials are treated with chemicals or pesticides this is noted in paperwork") {
      return true;
    }
  }
  return false;
}

function hasShippingDocs(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Ruminant statement requirements are in shipping docs") {
      return true;
    }
  }
  return false;
}

function getNCRRelatedProductScore(site) {
  let score = 0;
  for (let i=0; i < site.extraData2.length; i++) {
    if (site.extraData2[i].criterion === "<1 NCR in 12 months related to products") {
      score++;
    }
    else if (site.extraData2[i].criterion === "<1 NCR in 12 months related to delivery") {
      score++;
    }
    else if (site.extraData2[i].criterion === "<1 DAWR Issue in previous 12 months customs/import") {
      score++;
    }
  }
  return score;
}

function getCaptureMethodScore(site) {
  let score = 0;
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Byproduct/Trimmings of processing") {
      score++;
    }
    else if (site.extraData1[i].criterion === "Farmed material") {
      score++;
    }
  }
  return score;
}

function isIUCNlassified(site) {
  var iucnStatus = site['iucnStatus'];
  if (iucnStatus !== undefined) {
    iucnStatus = iucnStatus.toLowerCase();
    if (iucnStatus === 'least concern' ||
        iucnStatus === 'near threatened' || 
        'vulnerable')
    {
      return true;
    }
  }
  return false;
}

function getPercentOfByProduct(site) {
  for (let i=0; i < site.extraData1.length; i++) {
    if (site.extraData1[i].criterion === "Percentage of Byproduct/Trimmings") {
      if (site.extraData1[i].info !== undefined) {
        let str = site.extraData[1].info;
        if (str.endsWith('%')) {
          str = str.substring(0, str.length() - 1);
        }
        return parseFloat(str);
      }
    }
  }
  return 0;
}

function hasCatchMethod(site) {
  if (site['catchMethod'] !== null &&
      site['catchMethod'] !== undefined &&
      site['catchMethod'] !== '') {
    return true;
  }
  return false;
}

function calculateScore(supplier) {
  var score = 0;
  for (let i=0; i < supplier.sites.length; i++)
  {
    let site = supplier.sites[i];
    switch (site.certType)
    {
      case 'IFFO' : case 'MSC' :
      case 'ASC' : case 'RTRS' :
      {
        score = 70;
        break;
      }
      
      default : {
        if (site.govtManaged) {
          score = 60;
          if (site['qms'] !== '') {
            score += 10;
          }
        }
        else if (site['qms'] !== '') {
          score = 60;
        }
        break;
      }
    }
  
    score += calculateFishScoreContribution(site);
  
    let extraCertScore = site.extraCerts.length;
    extraCertScore = (extraCertScore < 6) ? extraCertScore : 5;
    score += extraCertScore;
    
    if (isCOAComplied(site)) {
      score += 2;
    }
    
    if (site['certificatSupplied'] !== '') {
      score += 2;
    }
    
    if (site['auditRecordSupplied'] !== '') {
      score += 1;
    }
    
    if (isPreShip(site)) {
      score += 1;
    }
    
    if (is3rdPartyTested(site)) {
      score += 1;
    }
    
    if (isAntioxidantAdded(site)) {
      score += 1;
    }
    
    if (isTraceable(site)) {
      score += 1;
    }
    
    if (is3rdVerified(site)) {
      score += 1;
    }
    
    score += getNCRRelatedProductScore(site);
        
    if (isBatchSamples(site)) {
      score += 1;
    }
        
    if (isNotedInPaperwork(site)) {
      score += 1;
    }
        
    if (hasShippingDocs(site)) {
      score += 1;
    }

    if (isIUCNlassified(site)) {
      score += 1;
    }

    let percentOfByProduct = getPercentOfByProduct(site);
    if (!isNaN(percentOfByProduct) && percentOfByProduct > 0) {
      score +=1 ;
    }

    score += getCaptureMethodScore(site);
    
    if (hasCatchMethod(site)) {
      score += 1;
    }

    if (score > 100) {
      score = 100;
    }
    site['score'] = score;
  }
}

function setSupplierActive(id, active) {
  if (id == null || id.length == 0) {
    throw new Meteor.Error(500, 'Error 500: Not found', 'the document is not found');
  }
      
  let query     = {'_id' : id};
  let setter    = {$set : {'active' : active}};
  let updateDoc = (collection, query, setter, cb) => {
    collection.update(query, setter, cb);
  };
  let update = Meteor.wrapAsync(updateDoc);
  let count  = update(Suppliers, query, setter);
  return count;
}

function addSupplier(supplier) {
  let query = {};
  query["company"] = supplier.company;

  let count = Suppliers.find(query).count();
  if (count > 0) {
    let errorMsg = 
      "Supplier " + supplier.company + " already exists";
    throw new Meteor.Error('Duplicate Record', errorMsg);
  }
    
  for (let j=0; j < supplier.sites.length; j++) {
    query["sites"] = {
      "$elemMatch" : {
        "siteName" : supplier.sites[j].siteName
      }
    };

    let count = Suppliers.find(query).count();
    if (count > 0) {
      let errorMsg = 
        "Site " + supplier.sites[j].siteName +
        " already exists";
      throw new Meteor.Error('Duplicate Record', errorMsg);
    }
  }
  
  calculateScore(supplier);
  return Suppliers.insert(supplier);
}

function updateSupplier(supplier) {
  calculateScore(supplier);
  let query     = {'company' : supplier.company};
  let updateDoc = (collection, query, doc, cb) => {
    collection.update(query, doc, cb);
  };
  let update = Meteor.wrapAsync(updateDoc);
  let count  = update(Suppliers, query, supplier);
  return count;
}

function uploadSuppliers(records) {
  for (let i=0; i < records.length; i++) {
    for (let j=0; j < records[i].sites.length; j++) {
      let query    = {};
      query["company"] = records[i].company;
      query["sites"]   = {
        "$elemMatch" : {
          "siteName" : records[i].sites[j].siteName
        }
      };

      let count = Suppliers.find(query).count();
      if (count > 0) {
        let errorMsg = 
          "Supplier " + records[i].company + " / Site " + records[i].sites[j].siteName +
          " already exists";      
        throw new Meteor.Error('Duplicate Record', errorMsg);
      }
    }
  }
  
  for (let i=0; i < records.length; i++) {
    let supplier = records[i];
    let count    = Suppliers.find({"company" : supplier.company}).count();
    if (count === 0) {
      addSupplier(supplier);
    }
    else {
      calculateScore(supplier);
      let query     = {'company' : supplier.company};
      let cmd       = {'$push' : {
        'sites' : {'$each' : supplier.sites}
      }};
      let updateDoc = (collection, query, cmd, cb) => {
        collection.update(query, cmd, cb);
      };
      let update = Meteor.wrapAsync(updateDoc);
      update(Suppliers, query, cmd);
    }
  }
}

function findSuppliersByName(name) {
  if (name == null || name.length == 0) {
    return Suppliers.find({}).fetch();
  }
  else {
    name = '.*' + name + '.*';
    return Suppliers.find({'company' : {$regex : new RegExp(name, "i")}}).fetch();
  }
}

function findSuppliersByScore(op, value) {
  if (op == null || value == null) {
    return null;
  }
  else {
    let scoreVal = parseInt(value);
    switch (op) {
      case 'gt' : {
        return Suppliers.find({'sites.score' : {$gt : scoreVal}}).fetch();
      }
      
      case 'lt' : {
        return Suppliers.find({'sites.score' : {$lt : parseInt(value)}}).fetch();
      }
      
      case 'eq' : {
        return Suppliers.find({'sites.score' : {$eq : parseInt(value)}}).fetch();
      }
      
      case 'gte' : {
        return Suppliers.find({'sites.score' : {$gte : parseInt(value)}}).fetch();
      }
      
      case 'lte' : {
        return Suppliers.find({'sites.score' : {$lte : parseInt(value)}}).fetch();
      }
    }
  }
}

function findSuppliersByCertificate(type) {
  if (type == null || type.length == 0) {
    return Suppliers.find({}).fetch();
  }
  else if ("GOVT" === type) {
    return Suppliers.find({'sites.certType' : 'None', 'sites.govtManaged' : true}).fetch();
  }
  else if ("None" === type) {
    return Suppliers.find({'sites.certType' : 'None', 'sites.govtManaged' : false}).fetch();
  }
  else {
    return Suppliers.find({'sites.certType' : type}).fetch();
  }
}

function findSuppliersByAsc(hasAsc) {
  let result    = [];
  let suppliers = Suppliers.find({}).fetch();
  for (let i=0; i < suppliers.length; i++) {
    let certified = isAscCertified(suppliers[i]);
    if (hasAsc && certified) {
      result.push(suppliers[i]);
    }
    else if (!hasAsc && !certified) {
      result.push(suppliers[i]);
    }
  }
  return result;
}

function findSuppliersByCaptureMethod(cMethod) {
  let records    = Suppliers.find().fetch();
  let tempResult = []
  let result     = []
  
  if (cMethod === 'Wild Caught')
  {
    for (let i=0; i < records.length; i++) {
      let r = records[i];
      for (var j=0; j < r.sites.length; j++) {
        let s   = records[i].sites[j];
        let add = true; 

        for (var k=0; k < s.extraData1.length; k++) {
          let d = s.extraData1[k];
          if (d.criterion !== undefined &&
              (d.criterion === 'Byproduct / Trimmings of processing' ||
               d.criterion === 'Farmed material')) {
            add = false;
            break;
          }
        }

        if (add && tempResult[r.company] === undefined) 
          tempResult[r.company] = r;
      }
    }
    
    for (let key in tempResult) {
      result.push(tempResult[key]);
    }
  }
  else if (cMethod === 'Byproduct')
  {
    for (let i=0; i < records.length; i++) {
      let r = records[i];
      for (var j=0; j < r.sites.length; j++) {
        let s = records[i].sites[j];
        for (var k=0; k < s.extraData1.length; k++) {
          let d = s.extraData1[k];
          if (d.criterion !== undefined && d.criterion.startsWith(cMethod)) {
            tempResult[r.company] = r;
            break;
          }
        }
      }
    }
    
    for (let key in tempResult) {
      result.push(tempResult[key]);
    }
  }
  else if (cMethod === 'Farmed')
  {
    for (let i=0; i < records.length; i++) {
      let r = records[i];
      for (var j=0; j < r.sites.length; j++) {
        let s     = records[i].sites[j];
        let valid = false; 
        for (var k=0; k < s.extraData1.length; k++) {
          let d = s.extraData1[k];
          if (d.criterion.startsWith('Farmed')) {
            valid = true;
          }
          else if (d.criterion !== undefined && d.criterion.startsWith('Byproduct')) {
            valid = false;
            break;
          }
        }
        
        if (valid)
          tempResult[r.company] = r;
      }
    }
    
    for (let key in tempResult) {
      result.push(tempResult[key]);
    }
  }

  return result;
}

function findSuppliersByMaterial(material) {
  if (material == null || material.length == 0) {
    return null;
  }
  else {
    material = material + '.*';
    return Suppliers.find({'materials' : {$regex : new RegExp(material, "i")}}).fetch();
  }
}

function getSupplier(id) {
  if (id == null || id.length == 0) {
    throw new Meteor.Error(500, 'Error 500: Not found', 'the document is not found');
  }
  
  var result = Suppliers.findOne({"_id" : id});
  return result;
}

function exportData() {  
  let query = [
    {$unwind : "$sites"}
  ];

  let aggregate = (collection, query, cb) => {
    collection.aggregate(query, cb);
  };
  let exportData = Meteor.wrapAsync(aggregate);
  let result     = exportData(Suppliers.rawCollection(), query);
  return result;
}

function scoreStats() {  
  let query = [
    {$unwind : "$sites"},
    {$project : {
      _id : {$cond : {if : {$gte : ['$score',70]}, then : 'above', else:'below'}}
    }},
    {$group : {_id : '$_id', count : {$sum:1}}}
  ];

  let aggregate = (collection, query, cb) => {
    collection.aggregate(query, cb);
  };
  let getStats = Meteor.wrapAsync(aggregate);
  let stats    = getStats(Suppliers.rawCollection(), query);
  
  let result = {};
  for (var i=0; i < stats.length; i++) {
    result[stats[i]._id] = stats[i].count;
  }
  return result;
}

function certStats() {
  let query = [
    {$match : {active : true}},
    {$unwind : "$sites"},
    {$project : {
      type : {$cond : [
        {$and : [ {$eq:["$sites.certType", "None"]}, {$eq:["$sites.govtManaged", true]} ] },
        {$literal : "Government"}, "$sites.certType"
      ]}
    }},
    {$group : {_id : '$type', count : {$sum : 1}}}
  ]
  
  let aggregate = (collection, query, cb) => {
    collection.aggregate(query, cb);
  };
  let getStats = Meteor.wrapAsync(aggregate);
  let stats    = getStats(Suppliers.rawCollection(), query);
  
  let result = {};
  for (var i=0; i < stats.length; i++) {
    result[stats[i]._id] = stats[i].count;
  }
  return result;
}

function ascStats() {
  let result    = {"ASC" : 0, "Non ASC" : 0} ;
  let suppliers = Suppliers.find({}).fetch();
  for (let i=0; i < suppliers.length; i++) {
    if (isAscCertified(suppliers[i])) {
      result["ASC"]++;
    }
    else {
      result["Non ASC"]++;
    }
  }
  return result;
}

function catchMethodStats() {
  let records = Suppliers.find({active : true}).fetch();
  
  let typeA = 0, typeB = 0, typeC = 0;
  for (let i=0; i < records.length; i++) {
    let r = records[i];
    for (var j=0; j < r.sites.length; j++) {
      let s    = records[i].sites[j];
      let type = ''; 
      for (var k=0; k < s.extraData1.length; k++) {
        let d = s.extraData1[k];
        if (d.criterion !== undefined && d.criterion.startsWith('Byproduct')) {
          type = 'A';
          break;
        }
        else if (d.criterion !== undefined && d.criterion.startsWith('Farmed')) {
          type = 'B';
        }
      }

      switch (type) {
        case 'A' : {
          typeA++;
          break;
        }

        case 'B' : {
          typeB++;
          break;
        }

        default : {
          typeC++;
          break;
        }
      }
    }
  }
  
  let result = {
    'Byproduct / Trimmings of processing' : typeA,
    'Farmed material' : typeB,
    'Wild Caught' : typeC
  };
  return result;
}

function willExpireCerts() {
  let date = new Date();
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCDate(date.getUTCDate() + 90);
  
  let query = {sites : {
    $elemMatch : {certExpiry : {$lte : date}}
  }};
  return Suppliers.find(query).fetch();
}

if (Meteor.isServer) {
  Meteor.methods({
    scoreStats, certStats, ascStats, catchMethodStats, 
    addSupplier, updateSupplier, uploadSuppliers,
    getSupplier, findSuppliersByName, findSuppliersByScore,
    findSuppliersByCertificate, findSuppliersByAsc,
    findSuppliersByCaptureMethod, findSuppliersByMaterial,
    exportData, setSupplierActive, willExpireCerts
  });
}