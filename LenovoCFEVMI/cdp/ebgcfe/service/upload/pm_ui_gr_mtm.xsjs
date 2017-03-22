/****
 * 9.3 X86 MTM GR UI 
 * **/
/* Declare ******Common Part**********************/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_pm_gr_mtm::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'PM_UI_GR_MTM';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body="";
var pcall_seq;
var seq;
 
var index;
var length;
var object;
var error_result = [];
var success_result = [];
/* Declare ******Special Part**********************/

var validateZHDateType = /^[0-9]{4}[\/][0-1]?[0-9]{1}[\/][0-3]?[0-9]{1}$/;  // 2000/01/01
var validateDateType = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/; //2000-01-01

/*var  validateDec = /^\d{0,11}(\.\d{0,0})?$/;/
 * Marked by gordon for PB OF X86 PRICE MASK CUIHX4
 */
var  validateDec = /^-?\d{0,11}(\.\d{0,0})?$/;

var OEM_NAME="";
var TIME_FENCE="";
var FUNCTION_TYPE="";
var PROFIT_CENTER="";
var MTM_NO="";
var GR_DATE="";
var GR_QTY="";
//var MTM_DESC="";




function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	object.SOURCE = 'xsjs';
	error_result.push(object);
}

//验证权限
if (lib.assertAppRole(role) === 'OK') //(role === 'ui_pm_gr_mtm::uploadable')//
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
		conn.close();
		
	}

	for(i=0;i<data.length;i++)
	{  
		object = {};
		//object =  data[i];
		position = i+1;
		
		if ( data[i].OEM_NAME !== undefined )	
		{			
			OEM_NAME = lib.processData(data[i].OEM_NAME);
	
	    }
	    
		
		if ( data[i].TIME_FENCE !== undefined )	
		{			
			TIME_FENCE = lib.processData(data[i].TIME_FENCE);
			
	    }
		
		if ( data[i].FUNCTION_TYPE !== undefined )	
		{			
			FUNCTION_TYPE = lib.processData(data[i].FUNCTION_TYPE);
			
	    }
	   
		
		if ( data[i].PROFIT_CENTER !== undefined )	
		{			
			PROFIT_CENTER = lib.processData(data[i].PROFIT_CENTER);			
		
	    }
	   
		
		if ( data[i].MTM_NO !== undefined )	
		{			
			MTM_NO = lib.processData(data[i].MTM_NO);			
	    }
	   
		
/*		if ( data[i].MTM_DESC !== undefined )	
		{
			MTM_DESC = lib.processData(data[i].MTM_DESC);	
	    }*/
		
		if ( data[i].GR_QTY !== undefined )	
		{
			GR_QTY = lib.processData(data[i].GR_QTY);	
	    }
		
		if ( data[i].GR_DATE !== undefined )	
		{
			GR_DATE = lib.processData(data[i].GR_DATE);	
	    }
		
		
		object.PRODUCT_GROUP = 'EBG';
		object.OEM_NAME = OEM_NAME;
		object.TIME_FENCE = TIME_FENCE;
		object.FUNCTION_TYPE = FUNCTION_TYPE;
		object.PROFIT_CENTER = PROFIT_CENTER;
		object.MTM_NO = MTM_NO;
//		object.MTM_DESC = MTM_DESC;
		object.GR_DATE = GR_DATE;
		object.GR_QTY =  GR_QTY;
		
		//object.USER_ACTION = '';
		//object.STATUS = '';
		
		//非空检查
		if(OEM_NAME === '' || TIME_FENCE === ''|| FUNCTION_TYPE === ''|| PROFIT_CENTER === ''
			||MTM_NO === '' || GR_DATE === '' || GR_QTY === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if (!GR_QTY.match(validateDec)){
			error_message='GR_QTY must be decimal (11,0)!';
			exception_process();
			continue;
		}
		
		if (!GR_DATE.match(validateDateType) && !GR_DATE.match(validateZHDateType))
		{
		
			error_message='GR_DATE must be date format (yyyy-mm-dd)!';
			exception_process();
			continue;
		}		
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);


	}
	
	
	var hconn = $.hdb.getConnection();
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::pm_ui_gr_mtm');
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::pm_ui_gr_mtm_err');
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
