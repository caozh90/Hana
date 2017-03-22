/***
 * 9.2 PM Sales Report
 * Create by ChrisGao 2016-03-07
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_pm_sales_report::uploadable';


var json=JSON.parse($.request.body.asString());


//var tableName = 'UI_PM_BS_PART';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var OEM_NAME = "";
var TIME_FENCE = "";
var FUNCTION_TYPE = "";
var PROFIT_CENTER = "";
var PART_NO = "";
var PART_DESC = "";
var SALES_DATE = "";
var SALES_QTY = "";
var SALES_TOTAL_INCOMING = "";
var SALES_TOTAL_COST = "";
var SALES_TOTAL_MASK = "";

var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/; 
var validateZHDateType = /^[0-9]{4}[\/][0-1]?[0-9]{1}[\/][0-3]?[0-9]{1}$/;  // 2000/01/01
var validateDateType = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/; //2000-01-01
var validateLongDateType = /^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])( (?:[01]\d|2[0-3])\:[0-5]\d\:[0-5]\d(\.\d{0,7}))?$/;


var position =0;
var i;

//var conn = $.db.getConnection();
var hconn = $.hdb.getConnection();
var pcall;
var query;
var body;
var pcall_seq;
var seq;
 
var index;
var length;
//new structure definition
var object;
var error_result = [];
var success_result = [];


function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	error_result.push(object);
}
//验证权限
if(lib.assertAppRole(role) === 'OK')// //role === 'ui_pm_sales_report::uploadable'
{
	
	if(data.length < 1)
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Empty file!';
	}
	else 
	{
		//在XSJS中统一为该次上传操作生成统一的sequence
		query = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode');
		pcall_seq = query();
		seq = pcall_seq.businessCode;
	}
	


	for(i=0;i<data.length;i++)
	{  
		//Restructuring object
		object =  {};
		
		if (data[i].OEM_NAME !== undefined)	
		{
			OEM_NAME = lib.processData(data[i].OEM_NAME);
	    }
		if (data[i].TIME_FENCE !== undefined)	
		{
			TIME_FENCE = lib.processData(data[i].TIME_FENCE);
	    }
		if (data[i].FUNCTION_TYPE !== undefined)	
		{
			FUNCTION_TYPE = lib.processData(data[i].FUNCTION_TYPE);
	    }
		if (data[i].PROFIT_CENTER !== undefined)	
		{
			PROFIT_CENTER = lib.processData(data[i].PROFIT_CENTER);
	    }
		if (data[i].PART_NO !== undefined)	
		{
			PART_NO = lib.processData(data[i].PART_NO);
	    }
		if (data[i].PART_DESC !== undefined)	
		{
			PART_DESC = lib.processData(data[i].PART_DESC);
	    }
		if (data[i].SALES_DATE !== undefined)	
		{
			SALES_DATE = lib.processData(data[i].SALES_DATE);
	    }
		else
		{
			SALES_DATE = '1900-01-01';
		}
		
		if (data[i].SALES_QTY !== undefined && data[i].SALES_QTY !== null )	
		{
			SALES_QTY = lib.processData(data[i].SALES_QTY);
	    }
		else
		{
			SALES_QTY = 0;
		}
		
		if (data[i].SALES_TOTAL_INCOMING !== undefined && data[i].SALES_TOTAL_INCOMING !== null)	
		{
			SALES_TOTAL_INCOMING = lib.processData(data[i].SALES_TOTAL_INCOMING);
	    }
		else
		{
			SALES_TOTAL_INCOMING = 0;
		}
		
		if (data[i].SALES_TOTAL_COST !== undefined && data[i].SALES_TOTAL_COST !== null)	
		{
			SALES_TOTAL_COST = lib.processData(data[i].SALES_TOTAL_COST);
	    }
		else
		{
			SALES_TOTAL_COST = 0;
		}
		
		if (data[i].SALES_TOTAL_MASK !== undefined && data[i].SALES_TOTAL_MASK !== null)	
		{
			SALES_TOTAL_MASK = lib.processData(data[i].SALES_TOTAL_MASK);
	    }
		else
		{
			SALES_TOTAL_MASK = 0;
		}
		
		object.OEM_NAME = OEM_NAME;
		object.TIME_FENCE = TIME_FENCE;
		object.FUNCTION_TYPE = FUNCTION_TYPE;
		object.PROFIT_CENTER = PROFIT_CENTER;
		object.PART_NO = PART_NO;
		object.PART_DESC = PART_DESC;
		object.SALES_DATE = SALES_DATE;
		object.SALES_QTY = SALES_QTY;
		object.SALES_TOTAL_INCOMING = SALES_TOTAL_INCOMING;
		object.SALES_TOTAL_COST = SALES_TOTAL_COST;
		object.SALES_TOTAL_MASK = SALES_TOTAL_MASK;

		position = i+1;
		
		//非空检查  remove || PART_DESC === '' 20160830 zhaodan1
		if(OEM_NAME === '' || TIME_FENCE === ''|| FUNCTION_TYPE === ''|| PROFIT_CENTER === ''
			||PART_NO === ''  || SALES_DATE === '' || SALES_QTY === ''
			||SALES_TOTAL_INCOMING === '' || SALES_TOTAL_COST === '' || SALES_TOTAL_MASK === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}

		//字段长度检查
		if(OEM_NAME.length > 40)
		{
				error_message='OEM_NAME::The length of "OEM_NAME" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(TIME_FENCE.length > 100)
		{
				error_message='TIME_FENCE::The length of "TIME_FENCE" is too large(no more than 100)';
				exception_process();
				continue;
		}
		if(FUNCTION_TYPE.length > 40)
		{
				error_message='FUNCTION_TYPE::The length of "FUNCTION_TYPE" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(PROFIT_CENTER.length > 100)
		{
				error_message='PROFIT_CENTER::The length of "PROFIT_CENTER" is too large(no more than 100)';
				exception_process();
				continue;
		}
		if(PART_NO.length > 100)
		{
				error_message='PART_NO::The length of "PART_NO" is too large(no more than 100)';
				exception_process();
				continue;
		}
		/*if(PART_DESC.length > 400)   20160830 remove by zhaodan1
		{
				error_message='PART_DESC::The length of "PART_DESC" is too large(no more than 400)';
				exception_process();
				continue;
		}*/
		//date
		if (!SALES_DATE.match(validateDateType) && !SALES_DATE.match(validateZHDateType) && !SALES_DATE.match(validateLongDateType))
		{
			error_message='SALES_DATE must be date format (yyyy-mm-dd)!';
			exception_process();
			continue;
		}
		//decimal
		if (!SALES_TOTAL_INCOMING.match(validateDecimalType))
		{
			error_message='SALES_TOTAL_INCOMING must be float (11,n)!';
			exception_process();
			continue;
		}
		else
		{
			SALES_TOTAL_INCOMING = parseFloat(SALES_TOTAL_INCOMING).toFixed(2);
		}
		if (!SALES_TOTAL_COST.match(validateDecimalType))
		{
			error_message='SALES_TOTAL_COST must be float (11,n)!';
			exception_process();
			continue;
		}
		else
		{
			SALES_TOTAL_COST = parseFloat(SALES_TOTAL_COST).toFixed(2);
		}
		if (!SALES_TOTAL_MASK.match(validateDecimalType))
		{
			error_message='SALES_TOTAL_MASK must be float (11,n)!';
			exception_process();
			continue;
		}
		else
		{
			SALES_TOTAL_MASK = parseFloat(SALES_TOTAL_MASK).toFixed(2);
		}
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);

	}

	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_pm_sales_report');
			var result = callProcedure(success_result);
			
			body = 'Finished! You can check the result on HANA';
			$.response.status = $.net.http.OK;
		}
		catch(e)
		{	
			error_message = e.message;
			//替换单引号'
			while(error_message.indexOf("'") >0 ) {
				error_message = error_message.replace('\'','"'); 
			}
			exception_process();
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}
	}
	
	if(error_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_pm_sales_report_err');
			var result = callProcedure(error_result);
			
			body = 'Finished! You can check the result on HANA';
			$.response.status = $.net.http.OK;
		}
		catch(e)
		{	
			error_message = e.message;
			//替换单引号'
			while(error_message.indexOf("'") >0 ) {
				error_message = error_message.replace('\'','"'); 
			}
			exception_process();
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}
	}
	

	hconn.commit();
	hconn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
	}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}