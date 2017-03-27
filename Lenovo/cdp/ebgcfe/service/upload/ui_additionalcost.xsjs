/***
 * 4.9 X86 ADDITIONAL_COST UI Design
 * updated by Chris Gao 2015-09-16
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_additional_cost::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_ADDITIONAL_COST';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE = "";
var PRODUCT_GROUP = "";
var RATIO_CODE = "";
var SUBGEO = "";
var COUNTRY = "";
var TBA_TYPE = "";
var ADDITIONAL_COST = "";
//Added by Chris Gao 2015-09-16
//var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/;///^\d{0,11}(\.\d{0,4})?$/; 
var validateDecimalType = /^[\+\-]?\d{0,11}(\.\d{0,})?$/;

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
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_additional_cost_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,"CURRENT");
		pcall2.setString(6,PRODUCT_GROUP);
		pcall2.setString(7,RATIO_CODE);
		pcall2.setString(8,SUBGEO);
		pcall2.setString(9,COUNTRY);
		pcall2.setString(10,TBA_TYPE);
		pcall2.setString(11,ADDITIONAL_COST);
		
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
		
		if ( data[i].CYCLE !== undefined )	
			{
				CYCLE = lib.processData(data[i].CYCLE);
		    }
		    else 
			{ 
		    	CYCLE = '';
			}
			
		if ( data[i].PRODUCT_GROUP !== undefined )	
			{
				PRODUCT_GROUP = lib.processData(data[i].PRODUCT_GROUP);
		    }
		    else 
			{ 
		    	PRODUCT_GROUP = '';
			}
		
		if ( data[i].RATIO_CODE !== undefined )	
		{
			RATIO_CODE = lib.processData(data[i].RATIO_CODE);
	    }
	    else 
		{ 
	    	RATIO_CODE = '';
		}
		
		if ( data[i].SUBGEO !== undefined )	
			{
				SUBGEO = lib.processData(data[i].SUBGEO);
		    }
		    else 
			{ 
		    	SUBGEO = '';
			}
		
		if ( data[i].COUNTRY !== undefined )	
			{
				COUNTRY = lib.processData(data[i].COUNTRY).toUpperCase();
		    }
		    else 
			{ 
		    	COUNTRY = '';
			}
		
		if ( data[i].TBA_TYPE !== undefined )	
		{
			TBA_TYPE = lib.processData(data[i].TBA_TYPE);
	    }
	    else 
		{ 
	    	TBA_TYPE = '';
		}
		
		if ( data[i].ADDITIONAL_COST !== undefined )	
		{
			ADDITIONAL_COST = lib.processData(data[i].ADDITIONAL_COST);
			/***********************************
			 * update by Chris Gao 2015-09-16
			 *********************************/
			//convert to Decimal Format for validation
			if (!ADDITIONAL_COST.match(validateDecimalType))
			{
				error_message='ADDITIONAL_COST must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				ADDITIONAL_COST = parseFloat(ADDITIONAL_COST).toFixed(4);
			}
		
			/***********************************
			 * end by Chris Gao
			 *********************************/
	    }
	    else 
		{ 
	    	ADDITIONAL_COST = 0;
		}
		
		
		
//		if(CYCLE.toLowerCase() !== 'current'){
//			error_message='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
//			//position = i+1;
//			exception_process();
//			continue;
//		}
		
		//非空检查
		if( RATIO_CODE === ''|| SUBGEO === ''|| TBA_TYPE === '')//|| ADDITIONAL_COST === 0) // comment by Chris Gao
		{
			error_message='not enough values';
			//position = i+1;
			exception_process();
			continue;
		}
		
		
		
		//字段长度检查
		if( PRODUCT_GROUP.length>10)
		{
				error_message='PRODUCT_GROUP::The length of "PRODUCT_GROUP" is too large(no more than 10)';
				//position = i+1;
				exception_process();
				continue;
		}
		
		if( RATIO_CODE.length>100)
		{
				error_message='RATIO_CODE::The length of "RATIO_CODE" is too large(no more than 100)';
				//position = i+1;
				exception_process();
				continue;
		}
		if( SUBGEO.length>20)
		{
			error_message='SUBGEO::The length of "SUBGEO" is too large(no more than 20)';
			//position = i+1;
			exception_process();
			continue;
		}
		if( COUNTRY.length>20)
		{
				error_message='COUNTRY::The length of "COUNTRY" is too large(no more than 20)';
				//position = i+1;
				exception_process();
				continue;
		}
		if( TBA_TYPE.length>40)
		{
			error_message='TBA_TYPE::The length of "TBA_TYPE" is too large(no more than 40)';
			//position = i+1;
			exception_process();
			continue;
		}

		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_additional_cost"(?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,"CURRENT");
			pcall.setString(5,PRODUCT_GROUP);
			pcall.setString(6,RATIO_CODE);
			pcall.setString(7,SUBGEO);
			pcall.setString(8,COUNTRY);
			pcall.setString(9,TBA_TYPE);
			pcall.setDecimal(10,ADDITIONAL_COST);
			
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