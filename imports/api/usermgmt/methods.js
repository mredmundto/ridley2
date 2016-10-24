import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

function addUser(username, password, role) {
  var existedUser = Accounts.findUserByUsername(username);
  if (existedUser != null) {
    throw new Meteor.Error(101, 'User Exists', 'Username is already used');
  }
  
  var userId = Accounts.createUser({'username' : username, 'email' : username});
  Accounts.setPassword(userId, password);
  Roles.addUsersToRoles(userId, [role]);
}

function resetPwd(username, password) {
  var existedUser = Accounts.findUserByUsername(username);
  if (existedUser == null) {
    throw new Meteor.Error(102, 'User Missing', 'User not found');
  }  
  Accounts.setPassword(existedUser._id, password);
}

function listUsers() {
  var allUsers = Accounts.users.find().fetch();
  var result   = [];
  for (var i=0; i < allUsers.length; i++) {
    var user  = allUsers[i];
    var email = '';
    if (user.emails != undefined && user.emails.length > 0) {
      email = user.emails[0].address;
    }
    
    result.push({
      'username' : user.username, 
      'email' : email,
      'role' : user.roles[0]
    });
  }
  return result;
}

Meteor.methods({
  listUsers, addUser, resetPwd
});

