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
});
