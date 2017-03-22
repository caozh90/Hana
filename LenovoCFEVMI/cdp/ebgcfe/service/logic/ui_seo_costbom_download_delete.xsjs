/***
 * 9.2 PM Sales Report
 * Create by ChrisGao 2016-03-07
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_seo_cost_bom::deletable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_SEO_DOWNLOAD';
var data = json.data;
var result="";
var error_message;


var CYCLE = "";
var ITEM = "";
var PLANT = "";
var COUNTRY = "";

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
		
		if (data[i].CYCLE !== undefined)	
		{
			CYCLE = lib.processData(data[i].CYCLE);
	    }
		if (data[i].ITEM !== undefined)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		if (data[i].PLANT !== undefined)	
		{
			PLANT = lib.processData(data[i].PLANT);
	    }
		if (data[i].COUNTRY !== undefined)	
		{
			COUNTRY = lib.processData(data[i].COUNTRY);
	    }
		
		
		object.CYCLE = CYCLE;
		object.ITEM = ITEM;
		object.PLANT = PLANT;
		object.COUNTRY = COUNTRY;

		position = i+1;
		
		//非空检查
		if(CYCLE === '' || ITEM === '')
		{
			error_message='CYCLE and ITEM cannot be empty';
			continue;
		}

		success_result.push(object);

	}

	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.ui_seo_costbom::ui_seo_costbom_download_delete');
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