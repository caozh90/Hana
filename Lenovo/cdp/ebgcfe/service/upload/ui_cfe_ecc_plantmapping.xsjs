/***
 * 8.2.X86 Daily Stdcost Publish
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
// copy and change
var role = 'ui_cfe_ecc_plantmapping::uploadable';


var json=JSON.parse($.request.body.asString());

//copy and change
var tableName = 'UI_CFE_ECC_PLANTMAPPING';

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


//copy and change

var CFE_PLANT = "";
var ECC_PLANT = "";
var ITEM_TYPE = "";
var SUBGEO = "";
var CURRENCY = "";


var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body = "Default value";
var pcall_seq;
var seq;
 
var index;
var length;


function exception_process()
{
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cfe_ecc_plantmapping_err"(?,?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		
		pcall2.setString(1,CFE_PLANT);
		pcall2.setString(2,ECC_PLANT);
		pcall2.setString(3,ITEM_TYPE);
		pcall2.setString(4,SUBGEO);
		pcall2.setString(5,CURRENCY);
		pcall2.setString(6,tableName);
		pcall2.setString(7,fileName);
		pcall2.setInteger(8,seq);
		pcall2.setInteger(9,position);
		pcall2.setString(10,error_message);
		
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
		
		if ( data[i].CFE_PLANT !== undefined )	
			{
		     	CFE_PLANT = lib.processData(data[i].CFE_PLANT);
		    }
		    else 
			{ 
		    	CFE_PLANT = '';
			}
		
		if ( data[i].ECC_PLANT !== undefined )	
		{
			ECC_PLANT = lib.processData(data[i].ECC_PLANT);
	    }
	    else 
		{ 
	    	ECC_PLANT = '';
		}
		
		if ( data[i].ITEM_TYPE !== undefined )	
		{
		    ITEM_TYPE = lib.processData(data[i].ITEM_TYPE);
	    }
	    else 
		{ 
	    	ITEM_TYPE = '';
		}
		if ( data[i].SUBGEO !== undefined )	
		{
			SUBGEO = lib.processData(data[i].SUBGEO);
	    }
	    else 
		{ 
	    	SUBGEO = '';
		}
		if ( data[i].CURRENCY !== undefined )	
		{
			CURRENCY = lib.processData(data[i].CURRENCY);
	    }
	    else 
		{ 
	    	CURRENCY = '';
		}
		
		position = i+1;
		
	
		
		//非空检查
		if(CFE_PLANT === ''|| ECC_PLANT === ''|| ITEM_TYPE === '' || SUBGEO === '' || CURRENCY === '' )
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		
		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cfe_ecc_plantmapping"(?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,CFE_PLANT);
			pcall.setString(2,ECC_PLANT);
			pcall.setString(3,ITEM_TYPE);
			pcall.setString(4,SUBGEO);
			pcall.setString(5,CURRENCY);
			pcall.setString(6,tableName);
			pcall.setString(7,fileName);
			pcall.setInteger(8,seq);
			pcall.setInteger(9,position);
			
			pcall.execute();
			pcall.close();
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

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}