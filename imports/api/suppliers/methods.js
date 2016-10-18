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
    switch (op) {
      case 'gt' : {
        return Suppliers.find({'sites.score' : {$gt : parseInt(value)}}).fetch();
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
    return Suppliers.find({'certType' : type}).fetch();
  }
}

function findSuppliersByAsc(hasAsc) {
  if (hasAsc == null || hasAsc.length == 0) {
    return Suppliers.find({}).fetch();
  }
  else {
    if (hasAsc) {
      return Suppliers.find({'certType' : ASC}).fetch();
    }
    else {
      return Suppliers.find({'certType' : {$ne : ASC}}).fetch();
    }
  }
}

function findSuppliersByCaptureMethod(cMethod) {
  if (cMethod == null || cMethod.length == 0) {
    return null;
  }
  else {
    return Suppliers.find({'catchMethod' : cMethod}).fetch();
  }
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
//  let query = [
//    {$group   : {_id : '$certType', count : {$sum : 1}}}
//  ]
  let query = [
    {$project : {
//      type : {$cond : {if : {$eq:["$govtManaged", true]}, then:"Government", else:"$certType"}}
      type : {$cond : {
        if : {$eq:["$govtManaged", true]}, then:"Government", 
        else: {
          if : {$or : [{$eq:["certType", "MSC"]}, {$eq:["certType", "IFFO"]}, {$eq:["certType", "RTSC"]}]},
          then : "$certType", else : {$literal : "Uncertified"}
        }
      }}
    }},
    {$group : {_id : '$type', count : {$sum : 1}}}
  ]
  
  let aggregate = (collection, query, cb) => {
    collection.aggregate(query, cb);
  };
  let getStats = Meteor.wrapAsync(aggregate);
  let stats    = getStats(Suppliers.rawCollection(), query);
  
  console.log(JSON.stringify(stats));
  
  let result = {};
  for (var i=0; i < stats.length; i++) {
    console.log(stats[i]._id + " = " + stats[i].count);
    result[stats[i]._id] = stats[i].count;
  }
  return result;
}

function ascStats() {
  let query = [
    {$project : {
      type : {$cond : {if : {$eq:["$certType","ASC"]}, then:"ASC", else:"Non ASC"}} 
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
  let query = [
    {$group   : {_id : '$catchMethod', count : {$sum : 1}}}
  ]
  
  let aggregate = (collection, query, cb) => {
    collection.aggregate(query, cb);
  };
  let getStats = Meteor.wrapAsync(aggregate);
  let stats    = getStats(Suppliers.rawCollection(), query);
  
  let result = {};
  for (var i=0; i < stats.length; i++) {
    if (stats[i]._id == null || stats[i]._id.length === 0) {
      result["Unkown"] = stats[i].count;
    }
    else {
      result[stats[i]._id] = stats[i].count;
    }
  }
  return result;
}

if (Meteor.isServer) {
  Meteor.methods({
    scoreStats, certStats, ascStats, catchMethodStats, 
    addSupplier, uploadSuppliers
  });
}

Meteor.methods({
  getSupplier, findSuppliersByName, findSuppliersByScore,
  findSuppliersByCertificate, findSuppliersByAsc,
  findSuppliersByCaptureMethod, findSuppliersByMaterial
});

