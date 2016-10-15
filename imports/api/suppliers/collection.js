import { Mongo } from 'meteor/mongo';

export const Suppliers = new Mongo.Collection('suppliers');

//Suppliers.allow
//({
//  insert(userId, party) {
//    return userId && party.owner === userId;
//  },
//  update(userId, party, fields, modifier) {
//    return userId && party.owner === userId;
//  },
//  remove(userId, party) {
//    return userId && party.owner === userId;
//  }
//});

