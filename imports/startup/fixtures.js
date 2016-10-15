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
    {'company':'Supplier A', score:75, 'certType':'IFFO'},
    {'company':'Supplier B', score:65, 'certType':'IFFO'},
    {'company':'Supplier C', score:60, 'certType':'MSC'},
    {'company':'Supplier D', score:80, 'certType':'MSC'},
    {'company':'Supplier E', score:70, 'certType':'ASC'}
  ]

  suppliers.forEach((supplier) =>
  {
    if (Suppliers.findOne({'company':supplier.company}) == undefined) {
      Suppliers.insert(supplier);
    }
  })
});
