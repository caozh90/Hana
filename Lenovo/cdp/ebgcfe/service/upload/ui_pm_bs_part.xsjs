/***
 * 9.2 B/S Part List
 * Create by Justin 2015-10-10
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_pm_bs_part::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_PM_BS_PART';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var PRODUCT_GROUP = "";
var OEM_NAME = "";
var BS_PART = "";
var COMMODITY = "";
var PART_DESC = "";

var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/; 


var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body;
var pcall_seq;
var seq;
 
var index;
var length;


function exception_process()
{
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_pmbspart_err"(?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,PRODUCT_GROUP);
		pcall2.setString(6,OEM_NAME);
		pcall2.setString(7,BS_PART);
		pcall2.setString(8,COMMODITY);
		pcall2.setString(9,PART_DESC);
		
		
		pcall2.execute();
		pcall2.close();
		conn.commit();
		body = 'Finished! You can check the result on HANA';
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}

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
		query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	
	for(i=0;i<data.length;i++)
	{  
		position = i+1;
		//body = i + ':' +data[i].BASE_WARR;
		
		if ( data[i].PRODUCT_GROUP !== undefined )	
		{
			PRODUCT_GROUP = lib.processData(data[i].PRODUCT_GROUP);
	    }
	    else 
		{ 
	    	PRODUCT_GROUP = '';
		}
			
		if ( data[i].OEM_NAME !== undefined )	
		{
			OEM_NAME = lib.processData(data[i].OEM_NAME);
	    }
	    else 
		{ 
	    	OEM_NAME = '';
		}
		
		if ( data[i].BS_PART !== undefined )	
		{
			BS_PART = lib.processData(data[i].BS_PART);
	    }
	    else 
		{ 
	    	BS_PART = '';
		}
		
		if ( data[i].COMMODITY !== undefined )	
		{
			COMMODITY = lib.processData(data[i].COMMODITY).toUpperCase();
	    }
	    else 
		{ 
	    	COMMODITY = '';
		}
		
		if ( data[i].PART_DESC !== undefined )	
		{
			PART_DESC = lib.processData(data[i].PART_DESC);
	    }
	    else 
		{ 
	    	PART_DESC = '';
		}
		
		

		
		//非空检查
		if(OEM_NAME === '' || BS_PART === ''|| COMMODITY === '')
		{
			error_message='not enough values';
			//position = i+1;
			exception_process();
			continue;
		}
		
		//字段长度检查
		if( OEM_NAME.length>40)
		{
			error_message='OEM_NAME::The length of "OEM_NAME" is too large(no more than 40)';
			//position = i+1;
			exception_process();
			continue;
		}
		
		if( BS_PART.length>40)
		{
				error_message='BS_PART::The length of "BS_PART" is too large(no more than 40)';
				//position = i+1;
				exception_process();
				continue;
		}
		
		if( COMMODITY.length>20)
		{
				error_message='COMMODITY::The length of "COMMODITY" is too large(no more than 20)';
				//position = i+1;
				exception_process();
				continue;
		}
		
		
		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_pmbspart"(?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,PRODUCT_GROUP);
			pcall.setString(5,OEM_NAME);
			pcall.setString(6,BS_PART);
			pcall.setString(7,COMMODITY);
			pcall.setString(8,PART_DESC);
			
			pcall.execute();
			pcall.close();
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
	
	conn.commit();
	conn.close();
	$.response.setBody(body);
	$.response.contentType = "application/json; charset=UTF-8";
	//$.response.setBody(data.length);
	
}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}