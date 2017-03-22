/***
 * Cost bom batch upload for multi-download
 * Create by ChrisGao 2016-05-07
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_partial_cal::uploadable';

var json=JSON.parse($.request.body.asString());

var datasource = json.data;
var data = [];
var fileName = json.filename;
var result="";
var error_message;


var ITEM = "";

var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/; 

var position =0;
var i,j;

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

var distinct_obj = {};

//验证权限
if(role === 'ui_partial_cal::uploadable')// lib.assertAppRole(role) === 'OK'
{
	//array Item distinct
	for(j=0;j<datasource.length;j++)
	{
		if(distinct_obj[datasource[j].ITEM] === undefined)
		{
			distinct_obj[datasource[j].ITEM] = datasource[j].ITEM;
			data.push(datasource[j]);
		}
	}

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

		if (data[i].ITEM !== undefined && data[i].ITEM !== null)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		else
		{
			ITEM = "";
		}
		
		object.ITEM = ITEM;

		position = i+1;
		
		//非空检查
		if(ITEM === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}

		//字段长度检查
		if(ITEM.length > 40)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
				exception_process();
				continue;
		}
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);


	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_partial_cal');
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_partial_cal_err');
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