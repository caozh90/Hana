/***
 * mtm reports upload for multi-execute
 * Create by ChrisGao
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'rpt_material_margin::exportable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_RPT_MODELLIST';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var CYCLE = "";
var ITEM = "";
var MT = "";
var FAMILY = "";

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

//验证权限
//if(lib.assertAppRole(role) === 'OK')//lib.assertAppRole(role) === 'OK'
//{
	
	if(data.length < 1)
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Empty file!';
	}

	for(i=0;i<data.length;i++)
	{  
		//Restructuring object
		object =  {};

		if (data[i].ITEM !== undefined && data[i].ITEM.length > 0)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		else
		{
			ITEM = "N/A";
		}
		if (data[i].MT !== undefined && data[i].MT.length > 0)	
		{
			MT = lib.processData(data[i].MT);
	    }
		else
		{
			MT = "N/A";
		}
		if (data[i].FAMILY !== undefined && data[i].FAMILY.length > 0)	
		{
			FAMILY = lib.processData(data[i].FAMILY);
	    }
		else
		{
			FAMILY = "N/A";
		}
		
		object.ITEM = ITEM;
		object.MT = MT;
		object.FAMILY = FAMILY;

		position = i+1;
		
		//非空检查
		if(ITEM === 'N/A' && MT === 'N/A' && FAMILY === 'N/A')
		{
			error_message='ITEM,MT,FAMILY cannot be all empty';
			continue;
		}

		//字段长度检查
		if(ITEM.length > 40)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
				continue;
		}
		if(MT.length > 10)
		{
				error_message='MT::The length of "MT" is too large(no more than 10)';
				continue;
		}
		if(FAMILY.length > 100)
		{
				error_message='FAMILY::The length of "FAMILY" is too large(no more than 100)';
				continue;
		}
		
		//process data into different arrays
		success_result.push(object);

	}

	
	try
	{
		
		if(success_result.length > 0)
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::rpt_material_margin_batch_upload');
			var result = callProcedure(success_result);
		}
		
		
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
		$.response.status = $.net.http.BAD_REQUEST;
		body = e.message;
	}
	
	if(error_message !== undefined){
		try
		{
			body = error_message;
			$.response.status = $.net.http.OK;
		}
		catch(e)
		{	
			error_message = e.message;
			//替换单引号'
			while(error_message.indexOf("'") >0 ) {
				error_message = error_message.replace('\'','"'); 
			}
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}
	}
	

	hconn.commit();
	hconn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
//}
//else
//{
//	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
//	$.response.setBody('Not Authorized, no upload privilege');
//}