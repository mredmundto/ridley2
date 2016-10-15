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
      case 'by Score' : {
        Meteor.call('scoreStats', (error, result) =>
        { 
          if (error == null)
          {
            this.chart = c3.generate({
              bindto : '#scoreChart',
              data: {
                columns: [
                    ['below', result.below],
                    ['above', result.above],
                ],
                type : 'pie',
                onclick: (d, i) => {
                  if (d.id === 'below') {
                    this.router.transitionTo(
                      'home.supplierSearch', {searchBy:'byScore', value:70, cmp:'lt', 'run':true}
                    );
                  }
                  else {
                    this.router.transitionTo(
                      'home.supplierSearch', {searchBy:'byScore', value:70, cmp:'gte', 'run':true}
                    );
                  }
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
    this.draw('by Score');
    this.draw('by Certificate');
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