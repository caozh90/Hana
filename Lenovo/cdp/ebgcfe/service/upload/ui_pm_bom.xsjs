/***
 * 9.3 Price Mask PM BOM  UI Design
 * created by bianzh1 2015-10-10
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_pm_bom::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_PM_BOM';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE = "";
var PRODUCT_GROUP = "";
var OEM_NAME = "";
var ITEM = "";
var BS_PART = "";
var PART_QTY;

//Added by Chris Gao 2015-09-16
var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/;///^\d{0,11}(\.\d{0,4})?$/; 

var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body = "Default Value";
var pcall_seq;
var seq;
 
var index;
var length;


function exception_process()
{
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_pm_bom_err"(?,?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,CYCLE);
		pcall2.setString(6,PRODUCT_GROUP);
		pcall2.setString(7,OEM_NAME);
		pcall2.setString(8,ITEM);
		pcall2.setString(9,BS_PART);
		pcall2.setString(10,PART_QTY);
		
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
		
		CYCLE = 'CURRENT';
			
		if ( data[i].PRODUCT_GROUP !== undefined )	
		{
			PRODUCT_GROUP = lib.processData(data[i].PRODUCT_GROUP);
	    }
	    else 
		{ 
	    	PRODUCT_GROUP = 'EBG';
		}

		if ( data[i].OEM_NAME !== undefined )	
		{
			OEM_NAME = lib.processData(data[i].OEM_NAME);
	    }
	    else 
		{ 
	    	OEM_NAME = '';
		}
			
		if ( data[i].ITEM !== undefined )	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
	    else 
		{ 
	    	ITEM = '';
		}
		
		if ( data[i].BS_PART !== undefined )	
		{
			BS_PART = lib.processData(data[i].BS_PART);
	    }
	    else 
		{ 
	    	BS_PART = '';
		}
	
		if ( data[i].PART_QTY !== undefined )	
		{
			PART_QTY = lib.processData(data[i].PART_QTY); //Updated by Chris Gao 2015-09-16
			
			/***********************************
			 * update by Chris Gao 2015-09-16
			 *********************************/
			//convert to Decimal Format for validation
			
			if (!PART_QTY.match(validateDecimalType))
			{
				error_message='Part Qty must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				PART_QTY = parseFloat(PART_QTY).toFixed(4);
			}
		
			/***********************************
			 * end by Chris Gao
			 *********************************/
	    }
	    else 
		{ 
	    	PART_QTY = '';
		}
		
		

		if(CYCLE.toLowerCase() !== 'current'){
			error_message='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
			exception_process();
			continue;
		}
		
		
		
		//非空检查
		if( OEM_NAME === ''|| ITEM === ''|| BS_PART === ''|| PART_QTY === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
	
		//字段长度检查
		if( OEM_NAME.length>40)
		{
				error_message='OEM_NAME::The length of "OEM_NAME" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if( ITEM.length>20)
		{
			error_message='ITEM::The length of "ITEM" is too large(no more than 20)';
			exception_process();
			continue;
		}
		if( BS_PART.length>20)
		{
				error_message='BS_PART::The length of "BS_PART" is too large(no more than 20)';
				exception_process();
				continue;
		}
		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_pm_bom"(?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,CYCLE);
			pcall.setString(5,PRODUCT_GROUP);
			pcall.setString(6,OEM_NAME);
			pcall.setString(7,ITEM);
			pcall.setString(8,BS_PART);
			pcall.setDecimal(9,PART_QTY);
			
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