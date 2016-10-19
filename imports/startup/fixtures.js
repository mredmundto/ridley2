import { Meteor } from 'meteor/meteor';
import { Suppliers } from '../api/suppliers'

Meteor.startup(() =>
{
  var existedUser = Accounts.findUserByUsername('admin');
  if (existedUser == null) {
    var userId = Accounts.createUser({'username' : 'admin'});
    Accounts.setPassword(userId, 'password');
    Roles.addUsersToRoles(userId, ['admin']);
  }  
  
  const suppliers = [
    {'company':'Supplier A', companyWebsite : {text : 'Yahoo', url : 'http://us.yahoo.com'}, 
      sites : [{score:75, 'certType':'IFFO', govtManaged : false, catchMethod : 'Wild Caught', extraCerts : []}]
    },
    {'company':'Supplier B', sites : [{score:65, 'certType':'IFFO', govtManaged : false, catchMethod : 'Farmed', extraCerts : []}]},
    {'company':'Supplier C', sites : [{score:60, 'certType':'MSC', govtManaged : false, catchMethod : 'By Product / Trimming', extraCerts : []}]},
    {'company':'Supplier D', sites : [{score:80, 'certType':'MSC', govtManaged : false, catchMethod : 'Wild Caught', extraCerts : []}]},
    {'company':'Supplier E', sites : [{score:70, 'certType':'ASC', govtManaged : false, catchMethod : 'Farmed', extraCerts : []}]},
    {'company':'Supplier F', sites : [{score:70, 'certType':'None', govtManaged : false, catchMethod : 'By Product / Trimming', extraCerts : []}]},
    {'company':'Supplier G', sites : [{score:70, 'certType':'None', govtManaged : true, catchMethod : 'Wild Caught', extraCerts : []}]}
  ]

  suppliers.forEach((supplier) =>
  {
    if (Suppliers.findOne({'company':supplier.company}) == undefined) {
      Suppliers.insert(supplier);
    }
  })
});
