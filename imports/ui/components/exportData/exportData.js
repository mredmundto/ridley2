import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './exportData.html';

import { SupplierUtils } from '../supplier/supplierUtils.js';

function datenum(v, date1904) {
	if (date1904)
    v+=1462;
	let epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function cmpRangeToValue(obj) {
  switch (obj.cmp) {
    case 'gt' : {
      return '>' + obj.score;
    }

    case 'lt' : {
      return '<' + obj.score;
    }

    case 'gte' : {
      return '≥' + obj.score;
    }

    case 'lte' : {
      return '≤' + obj.score;
    }

    default : {
      return obj.score;
    }
  }
}

function Workbook() {
	if(!(this instanceof Workbook)) {
    return new Workbook();
  }
  
  this.SheetNames = [];
	this.Sheets = {};
}

function sheet_from_array_of_arrays(data, opts) {
	let ws = {};
	let range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for (let R = 0; R != data.length; ++R) {
		for (let C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R;
			if (range.s.c > C) range.s.c = C;
			if (range.e.r < R) range.e.r = R;
			if (range.e.c < C) range.e.c = C;
      
      let value = data[R][C];
			let cell  = {v: ''};      
			if (typeof value === 'object')  {
        if (value.url !== undefined) {
          if (value.url.length > 0) {
            cell.v = '=HYPERLINK("' + value.url + '","' + value.text + '")';
          }
          else {
            cell.v = value.text;
          }
          cell.t = 's';
        }
        else if (value.cmp !== undefined) {
          cell.v = cmpRangeToValue(value);
          cell.t = 's';
        }
        else {
          cell.v = value;
          cell.t = 's';
        }
      }
			else if (typeof value === 'number')  {
        cell.v = value;
        cell.t = 'n';
      }
			else if(typeof value === 'boolean') {
        cell.v = value;
        cell.t = 'b';
      }
			else if (value instanceof Date) {
				cell.t = 'n'; 
        cell.z = XLSX.SSF._table[14];
				cell.v = datenum(value);
			}
			else {
        cell.v = value;
        cell.t = 's';
      }
      
      let cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			ws[cell_ref] = cell;
		}
	}
	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function sheetToArrayBuffer(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function supplierToExcelRow(array, obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      if (obj[key].url !== undefined) {
        array.push(obj[key]);
      }
      else if (obj[key].cmp !== undefined) {
        array.push(obj[key]);
      }
      else {
        supplierToExcelRow(array, obj[key]);
      }
    }
    else {
      array.push(obj[key]);
    }
  }
}


class ExportCtrl
{
  constuctor() {}
  
  exportData() {
    Meteor.call('exportData', (error, result) => {
      if (!error) {
        let data   = [];
        let labels = SupplierUtils.getAllLabels();

        data.push(labels);
        for (let i=0; i < result.length; i++) {
          let row = []
          delete result[i]._id;
          supplierToExcelRow(row, result[i]);
          console.log(JSON.stringify(row));
          data.push(row);
        }
        
        let book  = new Workbook()
        let sheet = sheet_from_array_of_arrays(data);

        book.SheetNames.push('Backup');
        book.Sheets['Backup'] = sheet;

        let wbout = XLSX.write(book, {bookType:'xlsx', bookSST:false, type: 'binary', cellDates : true});
        saveAs(
          new Blob([sheetToArrayBuffer(wbout)], {type : "application/octet-stream"}), 
          "data-export.xlsx"
        );
      }
    });
  }
}

export default angular.module('ExportData', [angularMeteor])
.component('exportData',
{
  templateUrl,
  controller: ExportCtrl
});