import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './graph.html';
 
class GraphCtrl
{
  constructor($scope, $state, $reactive) {
    this.router = $state;
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
                  this.router.transitionTo(
                    'home.supplierSearch', {searchBy:'byCaptureMethod', value:d.id, 'run':true}
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
                  this.router.transitionTo(
                    'home.supplierSearch', {searchBy:'byCertificate', value:d.id, 'run':true}
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