import { Meteor } from 'meteor/meteor';
import { Suppliers } from './collection';

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
        }
        break;
      }
    }
  
    let extraCertScore = site.extraCerts.length;
    extraCertScore = (extraCertScore < 6) ? extraCertScore : 5;
    score += extraCertScore;
    site['score'] = score;
  }
}

function addSupplier(supplier) {
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
    addSupplier(records[i]);
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
  else {
    return Suppliers.find({'sites.certType' : type}).fetch();
  }
}

function findSuppliersByAsc(hasAsc) {
  if (hasAsc == null || hasAsc.length == 0) {
    return Suppliers.find({}).fetch();
  }
  else {
    if (hasAsc) {
      return Suppliers.find({'sites.certType' : 'ASC'}).fetch();
    }
    else {
      return Suppliers.find({'sites.certType' : {$ne : 'ASC'}}).fetch();
    }
  }
}

function findSuppliersByCaptureMethod(cMethod) {
  let records = Suppliers.find().fetch();
  let result  = []
  
  if (cMethod === 'Wild Caught')
  {
    for (let i=0; i < records.length; i++) {
      let r = records[i];
      for (var j=0; j < r.sites.length; j++) {
        let s   = records[i].sites[j];
        let add = true; 

        for (var k=0; k < s.extraData1.length; k++) {
          let d = s.extraData1[k];
//          if (Object.keys(d)[0] === 'Byproduct / Trimmings of processing' ||
//              Object.keys(d)[0] === 'Farmed material') {
          if (d.criterion !== undefined &&
              (d.criterion === 'Byproduct / Trimmings of processing' ||
               d.criterion === 'Farmed material')) {
            add = false;
            break;
          }
        }

        if (add) 
          result.push(r);
      }
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
            result.push(r);
            break;
          }
        }
      }
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
          result.push(r);
      }
    }
  }

  return result;
}

function findSuppliersByMaterial(material) {
  if (material == null || material.length == 0) {
    return null;
  }
  else {
    return Suppliers.find({'materials' : material}).fetch();
  }
}

function getSupplier(id) {
  if (id == null || id.length == 0) {
    throw new Meteor.Error(500, 'Error 500: Not found', 'the document is not found');
  }
  
  var result = Suppliers.findOne({"_id" : id});
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
  let query = [
    {$unwind : "$sites"},
    {$project : {
      type : {$cond : [{$eq:["$sites.certType","ASC"]}, "ASC", "Non ASC"]} 
    }},
    {$group   : {_id : '$type', count : {$sum : 1}}}
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

function catchMethodStats() {
  let records = Suppliers.find().fetch();
  
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

if (Meteor.isServer) {
  Meteor.methods({
    scoreStats, certStats, ascStats, catchMethodStats, 
    addSupplier, updateSupplier, uploadSuppliers,
    getSupplier, findSuppliersByName, findSuppliersByScore,
    findSuppliersByCertificate, findSuppliersByAsc,
    findSuppliersByCaptureMethod, findSuppliersByMaterial
  });
}