import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './userAdmin.html';

class UserAdminCtrl
{
  constructor($scope, $state, $reactive, $userRole)
  {
    'ngInject';
    $scope.pwdMinLength = 6;
    $scope.pwdMaxLength = 12;

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
    
  canChangePwd(form) {
    if (this.isAdmin()) {
      if (this.isMyself()) {
        return form.oldPwd.$invalid || form.newPwd.$invalid;
      }
      else {
        return form.userNewPwd.$invalid;
      }
    }
    else {
      return form.oldPwd.$invalid || form.newPwd.$invalid;
    }
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
    this.pwdInfo.oldPwd   = '';
    this.pwdInfo.newPwd   = '';
    this.failReason       = null;
  }
    
  resetPwd() {
    if (this.isMyself())
    {
      var ctrl = this;
      Accounts.changePassword(this.pwdInfo.oldPwd, this.pwdInfo.newPwd, (err) => {
        if (err) {
          if (err.reason !== undefined && err.reason.length > 0) {
            ctrl.failReason = err.reason;
          }
          else {
            ctrl.failReason = "Failed to change password";
          }
          ctrl.$scope.$digest();
        }
        else {
          angular.element('#changePwdModal').modal('hide');
        }
      });
    }
    else
    {
      this.call('resetPwd', this.pwdInfo.username, this.pwdInfo.newPwd, (error) => {
        if (error) {
          if (error.reason !== undefined && error.reason.length > 0) {
            this.failReason = error.reason;
          }
          else {
            this.failReason = "Failed to change password";
          }
        }
        else {
          angular.element('#changePwdModal').modal('hide');
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