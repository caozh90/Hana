/***
 * 8.3.X86 Monthly Stdcost Publish
 * Update by Chris Gao 2015-09-17
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
// copy and change
var role = 'ui_stdcost_monthly::uploadable';


var json=JSON.parse($.request.body.asString());

//copy and change
var tableName = 'UI_STDCOST_MONTHLY';

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


//copy and change

var ITEM = "";
var PLANT = "";
var STDCOST = "";
//Added by Chris Gao 2015-09-16
var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/;// /^\d{0,11}(\.\d{0,4})?$/; 


var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body = "Defalt value";
var pcall_seq;
var seq;
 
var index;
var length;


function exception_process()
{
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_stdcost_monthly_err"(?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		
		pcall2.setString(1,ITEM);
		pcall2.setString(2,PLANT);
		pcall2.setString(3,STDCOST); //update by Chris Gao
		pcall2.setString(4,tableName);
		pcall2.setString(5,fileName);
		pcall2.setInteger(6,seq);
		pcall2.setInteger(7,position);
		pcall2.setString(8,error_message);
		
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
		
//		if(STDCOST !== 0)
//		{
//			STDCOST = parseFloat(STDCOST).toFixed(2);
//		}
//		if (isNaN(STDCOST) || STDCOST.toString().indexOf('.') === -1)
//		{
//			error_message='STDCOST must be float!';
//			STDCOST = 0;
//			exception_process();
//			continue;
//		}
		

		if ( data[i].ITEM !== undefined )	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
	    else 
		{ 
	    	ITEM = '';
		}
		
		if ( data[i].PLANT !== undefined )	
		{
			PLANT = lib.processData(data[i].PLANT);
	    }
	    else 
		{ 
	    	PLANT = '';
		}
		
		if ( data[i].STDCOST !== undefined )	
		{
			STDCOST = lib.processData(data[i].STDCOST);
			/***********************************
			 * update by Chris Gao 2015-09-16
			 *********************************/
			//convert to Decimal Format for validation
			if (!STDCOST.match(validateDecimalType))
			{
				error_message='STDCOST must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				STDCOST = parseFloat(STDCOST).toFixed(4);
			}
			/***********************************
			 * end by Chris Gao
			 *********************************/
	    }
	    else 
		{ 
	    	STDCOST = '';
		}
	
		
		//非空检查
		if(STDCOST === ''|| ITEM === ''|| PLANT === '' )
		{
			error_message='not enough values';
			//position = i+1;
			exception_process();
			continue;
		}
		
		
		
		//字段长度检查
		
		
		if( ITEM.length>120)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 120)';
				//position = i+1;
				exception_process();
				continue;
		}
		if( PLANT.length>20)
		{
			error_message='PLANT::The length of "PLANT" is too large(no more than 20)';
			//position = i+1;
			exception_process();
			continue;
		}
		

		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_stdcost_monthly"(?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,ITEM);
			pcall.setString(2,PLANT);
			pcall.setDecimal(3,STDCOST);
			pcall.setString(4,tableName);
			pcall.setString(5,fileName);
			pcall.setInteger(6,seq);
			pcall.setInteger(7,position);
			
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