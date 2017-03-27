/***
 * 3.6 Cost Tape - CTO-CV VK Cost  UI Design
 * Updated by Chris Gao 2015-09-16
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_cto_cv_vk_cost::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_CTO_CV_VK_COST';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE = "";
var PRODUCT_GROUP = "";
var CHARACTERISTIC = "";
var VARIANT = "";
var SALES_ORG = "";
var PH_1 = "";
var PH_2 = "";
var PH_3 = "";
var PH_4 = "";
var M1 = "";

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
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cto_cv_vk_cost_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,CYCLE);
		pcall2.setString(6,PRODUCT_GROUP);
		pcall2.setString(7,CHARACTERISTIC);
		pcall2.setString(8,VARIANT);
		pcall2.setString(9,SALES_ORG);
		pcall2.setString(10,PH_1);
		pcall2.setString(11,PH_2);
		pcall2.setString(12,PH_3);
		pcall2.setString(13,PH_4);
		pcall2.setString(14,M1);//Updated by Chris Gao 2015-09-16
		
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
		
//		if ( data[i].CYCLE !== undefined )	
//		{
//			CYCLE = lib.processData(data[i].CYCLE);
//	    }
//	    else 
//		{ 
//	    	CYCLE = 'CURRENT';
//		}
			
		if ( data[i].PRODUCT_GROUP !== undefined )	
		{
			PRODUCT_GROUP = lib.processData(data[i].PRODUCT_GROUP);
	    }
	    else 
		{ 
	    	PRODUCT_GROUP = 'EBG';
		}

		if ( data[i].CHARACTERISTIC !== undefined )	
		{
			CHARACTERISTIC = lib.processData(data[i].CHARACTERISTIC);
	    }
	    else 
		{ 
	    	CHARACTERISTIC = '';
		}
			
		if ( data[i].VARIANT !== undefined )	
		{
			VARIANT = lib.processData(data[i].VARIANT);
	    }
	    else 
		{ 
	    	VARIANT = '';
		}
		
		if ( data[i].SALES_ORG !== undefined )	
		{
			SALES_ORG = lib.processData(data[i].SALES_ORG);
	    }
	    else 
		{ 
	    	SALES_ORG = '';
		}
		
		if ( data[i].PH_1 !== undefined )	
		{
			PH_1 = lib.processData(data[i].PH_1);
	    }
	    else 
		{ 
	    	PH_1 = '';
		}
		
		if ( data[i].PH_2 !== undefined )	
		{
			PH_2 = lib.processData(data[i].PH_2);
	    }
	    else 
		{ 
	    	PH_2 = '';
		}
	
		if ( data[i].PH_3 !== undefined )	
		{
			PH_3 = lib.processData(data[i].PH_3);
	    }
	    else 
		{ 
	    	PH_3 = '';
		}
		
		if ( data[i].PH_4 !== undefined )	
		{
			PH_4 = lib.processData(data[i].PH_4);
	    }
	    else 
		{ 
	    	PH_4 = '';
		}
	
		if ( data[i].M1 !== undefined )	
		{
			M1 = lib.processData(data[i].M1); //Updated by Chris Gao 2015-09-16
			
			/***********************************
			 * update by Chris Gao 2015-09-16
			 *********************************/
			//convert to Decimal Format for validation
			
			if (!M1.match(validateDecimalType))
			{
				error_message='Cost Value must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				M1 = parseFloat(M1).toFixed(4);
			}
		
			/***********************************
			 * end by Chris Gao
			 *********************************/
	    }
	    else 
		{ 
	    	M1 = '';
		}
		
		

		if(CYCLE.toLowerCase() !== 'current'){
			error_message='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
			exception_process();
			continue;
		}
		
		//非空检查
		if( CHARACTERISTIC === ''|| VARIANT === ''|| SALES_ORG === ''|| PH_1 === ''|| PH_2 === ''|| 
				PH_3 === ''|| PH_4 === ''|| M1 === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
	
		//字段长度检查
		if( CHARACTERISTIC.length>30)
		{
				error_message='CHARACTERISTIC::The length of "CHARACTERISTIC" is too large(no more than 30)';
				exception_process();
				continue;
		}
		if( VARIANT.length>30)
		{
			error_message='VARIANT::The length of "VARIANT" is too large(no more than 30)';
			exception_process();
			continue;
		}
		if( SALES_ORG.length>20)
		{
				error_message='SALES_ORG::The length of "SALES_ORG" is too large(no more than 20)';
				exception_process();
				continue;
		}
		if( PH_1.length !== 1)
		{
			error_message='PH_1::The length of "PH_1" must be 1';
			exception_process();
			continue;
		}
		if( PH_2.length !== 3)
		{
			error_message='PH_2::The length of "PH_2" must be 3';
			exception_process();
			continue;
		}
		if( PH_3.length !== 3)
		{
			error_message='PH_3::The length of "PH_3" must be 3';
			exception_process();
			continue;
		}
		if( PH_4.length !== 4)
		{
			error_message='PH_4::The length of "PH_4" must be 4';
			exception_process();
			continue;
		}

		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cto_cv_vk_cost"(?,?,?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,CYCLE);
			pcall.setString(5,PRODUCT_GROUP);
			pcall.setString(6,CHARACTERISTIC);
			pcall.setString(7,VARIANT);
			pcall.setString(8,SALES_ORG);
			pcall.setString(9,PH_1);
			pcall.setString(10,PH_2);
			pcall.setString(11,PH_3);
			pcall.setString(12,PH_4);
			pcall.setDecimal(13,M1);
			
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