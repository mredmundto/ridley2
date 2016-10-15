import { Meteor } from 'meteor/meteor';
import { Suppliers } from './collection';


function calculateScore(supplier) {
  var score = 0;
  switch (supplier['certType'])
  {
    case 'IFFO' : case 'MSC'  :
    {
      score = 70;
      break;
    }
  }
  return score;
}


function addSupplier(supplier) {
  supplier["score"] = calculateScore(supplier);
  return Suppliers.insert(supplier);
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
        return Suppliers.find({'score' : {$gt : parseInt(value)}}).fetch();
      }
      
      case 'lt' : {
        return Suppliers.find({'score' : {$lt : parseInt(value)}}).fetch();
      }
      
      case 'eq' : {
        return Suppliers.find({'score' : {$eq : parseInt(value)}}).fetch();
      }
      
      case 'gte' : {
        return Suppliers.find({'score' : {$gte : parseInt(value)}}).fetch();
      }
      
      case 'lte' : {
        return Suppliers.find({'score' : {$lte : parseInt(value)}}).fetch();
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
  let query = [
    {$group   : {_id : '$certType', count : {$sum : 1}}}
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

if (Meteor.isServer) {
  Meteor.methods({
    scoreStats, certStats
  });
}

Meteor.methods({
  addSupplier, getSupplier,
  findSuppliersByName, findSuppliersByScore,
  findSuppliersByCertificate, findSuppliersByAsc,
  findSuppliersByCaptureMethod, findSuppliersByMaterial
});

