/***
 * 7.2 BaseWarrPcaUplift UI Design V1.1
 * Update by Chris Gao 2015-09-17
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_warr_pca_uplift::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_WARR_PCA_UPLIFT';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var PRODUCT_GROUP = "";
var RATIO_CODE = "";
var SUBGEO = "";
var COUNTRY = "";
var TBA_TYPE = "";
var BASE_WARR = "";
var PCA = "";
var UPLIFT = "";
//Added by Chris Gao 2015-09-16
///^\d{0,11}(\.\d{0,})?$/
//var validateDecimalType = /^\d{0,11}(\.\d{0,4})?$/; 
//var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/; 
var validateDecimalType = /^[\+\-]?\d{0,11}(\.\d{0,})?$/;


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
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_warrpcauplift_err"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,PRODUCT_GROUP);
		pcall2.setString(6,RATIO_CODE);
		pcall2.setString(7,SUBGEO);
		pcall2.setString(8,COUNTRY);
		pcall2.setString(9,TBA_TYPE);
		pcall2.setString(10,BASE_WARR);//pcall2.setDecimal(10,BASE_WARR); Chris Gao 2015-09-16
		pcall2.setString(11,PCA);//pcall2.setDecimal(11,PCA); Chris Gao 2015-09-16
		pcall2.setString(12,UPLIFT);//pcall2.setDecimal(12,UPLIFT); Chris Gao 2015-09-16
		
		
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
		
		if ( data[i].BASE_WARR !== undefined )	
		{
			BASE_WARR = lib.processData(data[i].BASE_WARR);
			
	    }
		else
		{
			BASE_WARR = 0;
		}
		
		if ( data[i].PCA !== undefined )	
		{
			PCA = lib.processData(data[i].PCA);
	    }
		else
		{
			PCA = 0;
		}
		
		
		if ( data[i].UPLIFT !== undefined )	
		{
			UPLIFT = lib.processData(data[i].UPLIFT);
	    }
		else
		{
			UPLIFT = 0;
		}

		
		//非空检查
		if(SUBGEO === '' || TBA_TYPE === ''|| RATIO_CODE === '')
		{
			error_message='not enough values';
			//position = i+1;
			exception_process();
			continue;
		}
		
		//小数检查
		/***********************************
		 * update by Chris Gao 2015-09-16
		 *********************************/
		//convert to Decimal Format for validation
		if(BASE_WARR !== 0)
		{
			if (!BASE_WARR.match(validateDecimalType))
			{
				error_message='BASE_WARR must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				BASE_WARR = parseFloat(BASE_WARR).toFixed(4);
			}
		}
		
		if(PCA !== 0)
		{
			//convert to Decimal Format for validation
			if (!PCA.match(validateDecimalType))
			{
				error_message='PCA must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				PCA = parseFloat(PCA).toFixed(4);
			}
		}
		
		if(UPLIFT !== 0)
		{
			//convert to Decimal Format for validation
			if (!UPLIFT.match(validateDecimalType))
			{
				error_message='UPLIFT must be float (11,n)!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				UPLIFT = parseFloat(UPLIFT).toFixed(4);
			}
		}
		
	
		
		/***********************************
		 * end by Chris Gao
		 *********************************/
		
		//字段长度检查
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
		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_warrpcauplift"(?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,PRODUCT_GROUP);
			pcall.setString(5,RATIO_CODE);
			pcall.setString(6,SUBGEO);
			pcall.setString(7,COUNTRY);
			pcall.setString(8,TBA_TYPE);
			pcall.setDecimal(9,BASE_WARR);
			pcall.setDecimal(10,PCA);
			pcall.setDecimal(11,UPLIFT);
			
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