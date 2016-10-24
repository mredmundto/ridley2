import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './navbar.html';

class NavCtrl {
  constructor($state, $userRole, $exportData) {
    this.router      = $state;
    this.$userRole   = $userRole;
    this.$exportData = $exportData;
  }
  
  exportData() {
    this.$exportData.run();
  }
  
  isAdmin() {
    return this.$userRole.isAdmin();
  }
  
  logout() {
    var ctrl = this;
    Meteor.logout(function(err) {
      ctrl.router.go('login');
    })
  }
}

export default angular.module('Navbar', [
  angularMeteor
])
.component('navbar', {
  templateUrl,
  controller : NavCtrl
});
