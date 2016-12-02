import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './graph.html';
 
class GraphCtrl
{
  constructor($scope, $state, $reactive) {
    this.router        = $state;
    this.expiringCerts = [];
    $reactive(this).attach($scope);
  }
  
  draw(type) {
    switch (type) {
      case 'by ASC' : {
        Meteor.call('ascStats', (error, result) =>
        { 
          if (error == null)
          {
            let columns = [];
            for (var type in result) {
              columns.push([type, result[type]]);
            }
            
            this.chart = c3.generate({
              bindto : '#ascChart',
              data: {
                columns: columns,
                type : 'pie',
                onclick: (d, i) => {
                  let value = (d.id === 'ASC' ? 'yes' : 'no');
                  this.router.transitionTo(
                    'home.supplierSearch', {searchBy:'byAsc', value:value, 'run':true}
                  );
                }
              }
            });
          }
        });
        break;
      }
      
      case 'by Method' : {
        Meteor.call('catchMethodStats', (error, result) =>
        { 
          if (error == null)
          {
            let columns = [];
            for (var type in result) {
              columns.push([type, result[type]]);
            }
            
            this.chart = c3.generate({
              bindto : '#catchMethodChart',
              data: {
                columns: columns,
                type : 'pie',
                onclick: (d, i) => {
                  let value = d.id;
                  if (d.id.startsWith('Farmed')) {
                    value = 'Farmed';
                  }
                  else if (d.id.startsWith('Byproduct')) {
                    value = 'Byproduct';
                  }
                  
                  this.router.transitionTo(
                    'home.supplierSearch', {searchBy:'byCaptureMethod', value:value, 'run':true}
                  );
                }
              }
            });
          }
        });
        break;
      }
      
      case 'by Certificate' : {
        this.showing = type;
        Meteor.call('certStats', (error, result) =>
        { 
          if (error == null)
          {
            let columns = [];
            for (var type in result) {
              columns.push([type, result[type]]);
            }
            
            this.chart = c3.generate({
              bindto : '#certChart',
              data: {
                columns: columns,
                type : 'pie',
                onclick: (d, i) => {
                  let value = d.id;
                  if ("Government" === value) {
                    value = 'GOVT';
                  }
                  this.router.transitionTo(
                    'home.supplierSearch', {searchBy:'byCertificate', value:value, 'run':true}
                  );
                }
              }
            });
          }
        });
        break;
      }
    }
  }
  
  init() {
    this.draw('by ASC');
    this.draw('by Certificate');
    this.draw('by Method');
    this.call('willExpireCerts', (error, result) =>
    {
      if (result) {
        this.expiringCerts = result;
      }
    });
  }
}

export default angular.module('Graph', [
  angularMeteor
])
.component('graph',
{
  templateUrl,
  controller: GraphCtrl
});