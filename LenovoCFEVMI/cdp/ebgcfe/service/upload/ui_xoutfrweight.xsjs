/***
 * Cost bom batch upload for multi-download
 * Create by ChrisGao 2016-05-07
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_xoutfr_weight::uploadable';

var json=JSON.parse($.request.body.asString());

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var CYCLE = "";
var PRODUCT_GROUP = "";
var BRAND = "";
var FAMILY = "";
var MT = "";
var ITEM = "";
var WEIGHT = 0;

var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/; 

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
if(lib.assertAppRole(role) === 'OK')//lib.assertAppRole(role) === 'OK'
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
		
		CYCLE = 'CURRENT';
		PRODUCT_GROUP = 'EBG';
		if (data[i].BRAND !== undefined && data[i].BRAND !== null)	
		{
			BRAND = lib.processData(data[i].BRAND);
	    }
		else
		{
			BRAND = "";
		}
		if (data[i].FAMILY !== undefined && data[i].FAMILY !== null)	
		{
			FAMILY = lib.processData(data[i].FAMILY);
	    }
		else
		{
			FAMILY = "";
		}
		if (data[i].MT !== undefined && data[i].MT !== null)	
		{
			MT = lib.processData(data[i].MT);
	    }
		else
		{
			MT = "";
		}
		if (data[i].ITEM !== undefined && data[i].ITEM !== null)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		else
		{
			ITEM = "";
		}
		if (data[i].WEIGHT !== undefined && data[i].WEIGHT !== null)	
		{
			WEIGHT = lib.processData(data[i].WEIGHT);
	    }
		else
		{
			WEIGHT = 0;
		}
		
		
		object.CYCLE = CYCLE;
		object.PRODUCT_GROUP = PRODUCT_GROUP;
		object.BRAND = BRAND;
		object.FAMILY = FAMILY;
		object.MT = MT;
		object.ITEM = ITEM;
		object.WEIGHT = WEIGHT;

		position = i+1;
		
		//非空检查
		if((BRAND === '' || FAMILY === '' || BRAND === 'N/A' || FAMILY === 'N/A') && (MT === '' || MT === 'N/A') && (ITEM === '' || ITEM === 'N/A'))
		{
			error_message='not enough values';
			exception_process();
			continue;
		}

		//字段长度检查
		if(BRAND.length > 40)
		{
				error_message='BRAND::The length of "BRAND" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(FAMILY.length > 100)
		{
				error_message='FAMILY::The length of "FAMILY" is too large(no more than 100)';
				exception_process();
				continue;
		}
		if(MT.length > 100)
		{
				error_message='MT::The length of "MT" is too large(no more than 100)';
				exception_process();
				continue;
		}
		if(ITEM.length > 40)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
				exception_process();
				continue;
		}
		
		//decimal validation
		if (!WEIGHT.match(validateDecimalType))
		{
			error_message='WEIGHT must be float (11,n)!';
			exception_process();
			continue;
		}
		else
		{
			WEIGHT = parseFloat(WEIGHT).toFixed(2);
		}
		//convert "" to N/A
		if(BRAND === '')
		{
			BRAND = 'N/A';
			object.BRAND = 'N/A';
		}
		if(FAMILY === '')
		{
			FAMILY = 'N/A';
			object.FAMILY = 'N/A';
		}
		if(MT === '')
		{
			MT = 'N/A';
			object.MT = 'N/A';
		}
		if(ITEM === '')
		{
			ITEM = 'N/A';
			object.ITEM = 'N/A';
		}
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);


	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_xoutfr_weight');
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_xoutfr_weight_err');
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