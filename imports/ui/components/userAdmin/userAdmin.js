import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './userAdmin.html';

class UserAdminCtrl
{
  constructor($scope, $state, $reactive, $userRole)
  {
    'ngInject';
    this.$scope     = $scope;
    this.$userRole  = $userRole;
    this.allUsers   = [];
    this.failReason = null;
    this.failDetail = null;
    this.newUser  = {
      'username' : '',
      'password' : '',
      'role' : 'user',
    };
    this.pwdInfo  = {
      'username' : '',
      'oldPwd' : '',
      'newPwd' : ''
    };
    $reactive(this).attach($scope);
  }
    
  isAdmin() {
    return this.$userRole.isAdmin();
  }
    
  isMyself() {
    let me = Meteor.user();
    return (me.username == this.pwdInfo.username);
  }
    
  addUser() {
    this.call('addUser', this.newUser.username, this.newUser.password, this.newUser.role, (error) => {
      if (error == undefined) {
        this.allUsers.push({
          'username' : this.newUser.username, 
          'email' : '', 
          'role' : this.newUser.role
        });
        this.newUser  = {
          'username' : '',
          'password' : '',
          'role' : 'user',
        };
      }
      else {
        this.newUser  = {
          'username' : '',
          'password' : '',
          'role' : 'user',
        };
        this.failReason = error.reason;
        this.failDetail = error.details;
        angular.element('#opStatusModal').modal('show');
      }
    });
  }
    
  changePwd(username) {
    this.pwdInfo.username = username;
  }
    
  resetPwd() {
    if (this.isMyself())
    {
      Accounts.changePassword(this.pwdInfo.oldPwd, this.pwdInfo.newPwd, (err) => {
        this.pwdInfo  = {
          'username' : '',
          'oldPwd' : '',
          'newPwd' : ''
        };
        
        if (err) {
          this.failReason = "Change Password";
          this.failDetail = "Failed to change password";
          angular.element('#opStatusModal').modal('show');
        }
      });
    }
    else
    {
      this.call('resetPwd', this.newUser.username, this.newUser.password, (error) => {
        this.newUser  = {
          'username' : '',
          'password' : '',
          'role' : 'user',
        };

        if (error != undefined) {
          this.failReason = error.reason;
          this.failDetail = error.details;
          angular.element('#opStatusModal').modal('show');
        }
      });
    }
  }
  
  init()
  {
    if (this.isAdmin())
    {
      this.call('listUsers', (error, result) => {
        if (error) {
          console.log(error);
        }
        else {
          this.allUsers = result;
        }
      });
    }
    else {
      let user = Meteor.user();
      let email = '';
      if (user.emails != undefined && user.emails.length > 0) {
        email = user.emails[0].address;
      }

      this.allUsers = [{
        'username' : user.username, 
        'email' : email,
        'role' : user.roles[0]
      }];
    }
  }
}

export default angular
.module('UserAdmin', [angularMeteor])
.component('userAdmin',
{
  templateUrl,
  controller : UserAdminCtrl
});