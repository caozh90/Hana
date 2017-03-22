/****
 * 9.3 X86 MTM GR UI 
 * **/
/* Declare ******Common Part**********************/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_xoutfr_rate::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_XOUTFR_RATE';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var position =0;
var i;


var hconn = $.hdb.getConnection();
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

var BRAND ="";
var FAMILY ="";
var MACHINETYPE ="";
var PLANT ="";
var GEO_TYPE ="";
var GEO ="";
var FREIGHT_TYPE ="";
var GL_PERCENTAGE = null;
var UNIT_COST = null; 
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
if (lib.assertAppRole(role) === 'OK')//(role === 'ui_xoutfr_rate::uploadable')// 
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
		object = {};
		//object =  data[i];
		position = i+2; //exist title line so +2
		
		
		if ( data[i].BRAND !== undefined &&  data[i].BRAND !== null)	
		{			
			BRAND = lib.processData(data[i].BRAND);
			if (BRAND === ''){
				BRAND = 'N/A';
			}
	
	    }else{
	    	BRAND = 'N/A';
	    }
	    
		
		if ( data[i].FAMILY  !== undefined && data[i].FAMILY  !== null)	
		{			
			FAMILY  = lib.processData(data[i].FAMILY );
			if (FAMILY === ''){
				FAMILY = 'N/A';
			}
			
	    }else{
	    	FAMILY = 'N/A';
	    }
		
		if ( data[i].MACHINETYPE  !== undefined && data[i].MACHINETYPE !== null )	
		{			
			MACHINETYPE  = lib.processData(data[i].MACHINETYPE );
			if (MACHINETYPE === ''){
				MACHINETYPE = 'N/A';
			}
			
	    }else{
	    	MACHINETYPE = 'N/A';
	    }
	   
		
		if ( data[i].PLANT  !== undefined && data[i].PLANT  !== null)	
		{			
			PLANT = lib.processData(data[i].PLANT );			
		
	    }
	   
		
		if ( data[i].GEO_TYPE  !== undefined && data[i].GEO_TYPE  !== null)	
		{			
			GEO_TYPE  = lib.processData(data[i].GEO_TYPE );			
	    }
	   		
		
		if ( data[i].GEO  !== undefined && data[i].GEO  !== null)	
		{
			GEO  = lib.processData(data[i].GEO );	
	    }
		
		if ( data[i].FREIGHT_TYPE  !== undefined && data[i].FREIGHT_TYPE  !== null)	
		{
			FREIGHT_TYPE  = lib.processData(data[i].FREIGHT_TYPE );	
	    }
		
		if ( data[i].GL_PERCENTAGE   !== undefined && data[i].GL_PERCENTAGE   !== null)	
		{
			GL_PERCENTAGE   = lib.processData(data[i].GL_PERCENTAGE  );	
			
	    }
		
		if ( data[i].UNIT_COST   !== undefined && data[i].UNIT_COST   !== null )	
		{
			UNIT_COST   = lib.processData(data[i].UNIT_COST  );	
	    }		
			
		
		object.CYCLE = 'CURRENT';		
		object.BRAND  = BRAND ;
		object.PRODUCT_GROUP = 'EBG';
		object.PLANT   = PLANT  ;
		object.GEO_TYPE   = GEO_TYPE  ;
		object.GEO  = GEO ;		
		object.FAMILY  = FAMILY ;
		object.MACHINETYPE  = MACHINETYPE ;
		object.GL_PERCENTAGE   = GL_PERCENTAGE  ;
		object.FREIGHT_TYPE  = FREIGHT_TYPE ;
		object.UNIT_COST  =  UNIT_COST ;
		
		//非空检查
		if((BRAND === 'N/A' && FAMILY === 'N/A'  && MACHINETYPE === 'N/A')|| PLANT === ''
			||GEO_TYPE === '' || GEO === '' || FREIGHT_TYPE === '' 
			|| GL_PERCENTAGE === null || UNIT_COST === null)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if( BRAND.toUpperCase() === 'N/A' &&
			FAMILY.toUpperCase() === 'N/A' &&
			MACHINETYPE.toUpperCase() === 'N/A' ){
			error_message="Brand,Product family and Machine Type can't be N/A together";
			exception_process();
			continue;
		}
		
		if(GL_PERCENTAGE>=0 && GL_PERCENTAGE<=100){
			GL_PERCENTAGE = parseInt(GL_PERCENTAGE,0);
		}else{
			error_message='GL Percentage should be 0~100!';
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_xoutfr_rate');
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_xoutfr_rate_err');
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
