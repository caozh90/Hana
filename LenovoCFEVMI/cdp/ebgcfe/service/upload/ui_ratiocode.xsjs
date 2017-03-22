/***
 * 4.9 X86 RATIOCODE UI Design V1.1
 * **********change log*************************
 * zhaodan1 2016/6/30 change single to batch upload
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_ratio_code::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_RATIO_CODE';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE = "CURRENT";
var PRODUCT_GROUP = "";
var BRAND = "";
var FAMILY = "";
var MACHINETYPE = "";
var ITEM = "";
var RATIO_CODE = "";
var GEO = "";

var position =0;
var i;

//var conn = $.db.getConnection();
var hconn = $.hdb.getConnection();
var pcall;
var query;
var body = "Default Value";
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
if(lib.assertAppRole(role)==='OK')
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
		position = i+1;
		
		if ( data[i].CYCLE !== undefined )	
		{
			CYCLE = 'CURRENT';//lib.processData(data[i].CYCLE);
	    }
	    else 
		{ 
	    	CYCLE = 'CURRENT';
		}
			
		if ( data[i].PRODUCT_GROUP !== undefined )	
		{
			PRODUCT_GROUP = 'EBG';//lib.processData(data[i].PRODUCT_GROUP);
	    }
	    else 
		{ 
	    	PRODUCT_GROUP = 'EBG';
		}
		
		if ( data[i].BRAND !== undefined )	
		{
			BRAND = lib.processData(data[i].BRAND);
	    }
	    else 
		{ 
	    	BRAND = '';
		}
		
		if ( data[i].FAMILY !== undefined )	
		{
			FAMILY = lib.processData(data[i].FAMILY);
			
	    }
	    else 
		{ 
	    	FAMILY = '';
		}
		
		if ( data[i].MACHINETYPE !== undefined )	
		{
			MACHINETYPE = lib.processData(data[i].MACHINETYPE);
			if(MACHINETYPE.indexOf('="') > -1)
			{
				MACHINETYPE = MACHINETYPE.substring(2, MACHINETYPE.length-1);
			}
	    }
	    else 
		{ 
	    	MACHINETYPE = '';
		}
		
		if ( data[i].ITEM !== undefined )	
		{
			ITEM = lib.processData(data[i].ITEM).toUpperCase();
	    }
	    else 
		{ 
	    	ITEM = '';
		}
		
		if ( data[i].RATIO_CODE !== undefined )	
		{
			RATIO_CODE = lib.processData(data[i].RATIO_CODE).toUpperCase();
	    }
	    else 
		{ 
	    	RATIO_CODE = '';
		}
		
		if ( data[i].GEO !== undefined )	
		{
			GEO = lib.processData(data[i].GEO);
	    }
	    else 
		{ 
	    	GEO = '';
		}
		
		object.CYCLE = CYCLE;
		object.PRODUCT_GROUP = PRODUCT_GROUP;
		
		object.BRAND = BRAND;
		object.FAMILY = FAMILY;
		object.GEO = GEO;
		object.MACHINETYPE = MACHINETYPE;
		object.ITEM = ITEM;
		object.RATIO_CODE = RATIO_CODE;
		
		
		if(CYCLE.toLowerCase() !== 'current'){
			error_message='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
			exception_process();
			continue;
		}
		
		//非空检查
		if(GEO === '' || ((ITEM === '' || ITEM === 'ALL')&& (FAMILY === '' || FAMILY === 'N/A') && (MACHINETYPE === '' || MACHINETYPE === 'N/A')) || RATIO_CODE === '' )
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		//空值转换 -- as requirements 2015-09-22
		else
		{
			if(ITEM !== '' && ITEM !== 'ALL' )
			{
				MACHINETYPE = 'N/A';
				FAMILY = 'N/A';
			}
			else
			{
				if(MACHINETYPE !== '' && MACHINETYPE !== 'N/A')
				{
					ITEM = 'ALL';
					FAMILY = 'N/A';
				}
				else
				{
					MACHINETYPE = 'N/A';
					ITEM = 'ALL';
				}
			}
		}
		
		
		//字段长度检查
		if( PRODUCT_GROUP.length>10)
		{
				error_message='PRODUCT_GROUP::The length of "PRODUCT_GROUP" is too large(no more than 10)';
				exception_process();
				continue;
		}
		
		if( GEO.length>40)
		{
				error_message='BRAND::The length of "GEO" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if( FAMILY.length>40)
		{
			error_message='FAMILY::The length of "FAMILY" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if( MACHINETYPE.length>40)
		{
				error_message='MACHINETYPE::The length of "MACHINETYPE" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if( RATIO_CODE.length>100)
		{
			error_message='RATIO_CODE::The length of "RATIO_CODE" is too large(no more than 100)';
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
				var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_ratio_code_batch');
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
				var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_ratio_code_batch_err');
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