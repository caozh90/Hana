/***
 * 6.4 Material Margin Report - batch execute deletion
 * Create by ChrisGao
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_materialmargin_delete::executeable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_RPT_MODELLIST';
var data = json.data;
var result="";
var error_message;

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
		
		if (data[i].ITEM !== undefined)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		if (data[i].MT !== undefined)	
		{
			MT = lib.processData(data[i].MT);
	    }
		if (data[i].FAMILY !== undefined)	
		{
			FAMILY = lib.processData(data[i].FAMILY);
	    }
		
		object.ITEM = ITEM;
		object.MT = MT;
		object.FAMILY = FAMILY;

		position = i+1;
		
		//非空检查
		if(ITEM === '' && MT === '' && FAMILY === '')
		{
			error_message='ITEM,MT,FAMILY cannot be empty at the same time';
			continue;
		}

		success_result.push(object);

	}

	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.rpt_material_margin::rpt_material_margin_upload_delete');
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
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}
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