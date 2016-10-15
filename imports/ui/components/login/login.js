import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './login.html';
 
class LoginCtrl
{
  constructor($state, $location) {
    this.router      = $state;
    this.hrefRouter  = $location;
    this.failure     = false;
    this.fail_reason = '';
    this.user_info = {
      'username' : '',
      'password' : ''
    };
  }
  
  login() {
    var ctrl = this;
    Meteor.loginWithPassword(this.user_info.username, this.user_info.password, function(err) {
      if (err == undefined) {
        ctrl.router.go('home.graph');
      }
      else {
        ctrl.fail_reason = 'Incorrect username or password';
        ctrl.failure     = true;
      }
    })
  }
}

export default angular.module('Login', [
  angularMeteor
])
.component('login',
{
  templateUrl,
  controller: LoginCtrl
});