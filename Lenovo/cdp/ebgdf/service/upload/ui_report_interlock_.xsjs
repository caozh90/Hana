/***
 * 4.9 X86 UI_REPORT_INTERLOCK UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_report_interlock::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'RPT_INTERLOCK';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var ABCD_T = "";
var SBB_OPT = "";
var SBB_DES = "";
var MFI_FFI_FC_IND = "";
var GAD;
var LOD;
var PPN = "";
var PP_DES = "";
var SUPPLIER = "";
var LENOVO_PPN_OHQ =0;
var PPN_HIQ =0;
var SBB_3M_FORECAST =0;
var SBB_3M_SHIPMENT =0;
var PPN_3M_SHIPMENT =0;
var PRIOR_ABCD = "";
var REC_ABCD = "";

var position =0;
var i;

//var conn = $.db.getConnection();
var hconn = $.hdb.getConnection();
var pcall;
var query;
var body;
var pcall_seq;
var seq;
 
var index;
var length; 
var object;
var error_result = [];
var success_result = [];

var dateFormatValidation = /(\d{2})\/(\d{2})\/(\d{4})/;// (\d{2}):(\d{2}):(\d{2})
var dateArray;
var dateObject;

function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	error_result.push(object);

}
//验证权限
if(lib.assertAppRole(role)==='OK')//lib.assertAppRole(role)==='OK'
{
	if(data.length < 1)
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Empty file!';
		
		
	}
	else 
	{
		//在XSJS中统一为该次上传操作生成统一的sequence
		query = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::getBusinessCode');
		pcall_seq = query();
		seq = pcall_seq.businessCode;
	}

	for(i=0;i<data.length;i++)
	{  
		//Restructuring object
		object =  {};
		
		if ( data[i].ABCD_T !== undefined )	
			{
				ABCD_T = lib.processData(data[i].ABCD_T);
		    }
		    else 
			{ 
		    	ABCD_T = '';
			}
			
		if ( data[i].SBB_OPT !== undefined )	
			{
				SBB_OPT = lib.processData(data[i].SBB_OPT);
		    }
		    else 
			{ 
		    	SBB_OPT = '';
			}
		
		if ( data[i].SBB_DES !== undefined )	
			{
				SBB_DES = lib.processData(data[i].SBB_DES);
		    }
		    else 
			{ 
		    	SBB_DES = '';
			}
		
		if ( data[i].MFI_FFI_FC_IND !== undefined )	
			{
				MFI_FFI_FC_IND = lib.processData(data[i].MFI_FFI_FC_IND);
		    }
		    else 
			{ 
		    	MFI_FFI_FC_IND = '';
			}
		
		
		if ( data[i].GAD !== undefined )	
			{
				GAD = lib.processData(data[i].GAD);
		    }
		    else 
			{ 
		    	GAD = '01-01-1900';
			}
		
		if ( data[i].LOD !== undefined )	
			{
				LOD = lib.processData(data[i].LOD);
		    }
		    else 
			{ 
		    	LOD = '01-01-1900';
			}
		
		if ( data[i].PPN !== undefined )	
			{
				PPN = lib.processData(data[i].PPN);
		    }
		    else 
			{ 
		    	PPN = '';
			}
		
		if ( data[i].PP_DES !== undefined )	
			{
				PP_DES = lib.processData(data[i].PP_DES);
		    }
		    else 
			{ 
		    	PP_DES = '';
			}
		
		if ( data[i].SUPPLIER !== undefined )	
			{
				SUPPLIER = lib.processData(data[i].SUPPLIER);
		    }
		    else 
			{ 
		    	SUPPLIER = '';
			}
		// modified by chenwh3 20150925 start
		if( data[i].LENOVO_PPN_OHQ !== undefined)
			{
				LENOVO_PPN_OHQ = data[i].LENOVO_PPN_OHQ;
			}
			else
			{
				LENOVO_PPN_OHQ = '0';
			}
		
		if( data[i].PPN_HIQ !== undefined)
			{
				PPN_HIQ = data[i].PPN_HIQ;
			}
			else
			{
				PPN_HIQ = '0';
			}
		if(data[i].SBB_3M_FORECAST !== undefined)
			{
				SBB_3M_FORECAST = data[i].SBB_3M_FORECAST;
			}
			else
			{
				SBB_3M_FORECAST = '0';
			}
		if(data[i].SBB_3M_SHIPMENT !== undefined)
			{
				SBB_3M_SHIPMENT = data[i].SBB_3M_SHIPMENT;
			}
			else
			{
				SBB_3M_SHIPMENT = '0';
			}
		if(data[i].PPN_3M_SHIPMENT !== undefined)
			{
				PPN_3M_SHIPMENT = data[i].PPN_3M_SHIPMENT;
			}
			else
			{
				PPN_3M_SHIPMENT = '0';
			}
// modified by chenwh3 20150925 end
		if ( data[i].PRIOR_ABCD !== undefined )	
			{
				PRIOR_ABCD = lib.processData(data[i].PRIOR_ABCD);
		    }
		    else 
			{ 
		    	PRIOR_ABCD = '';
			}
		
		if ( data[i].REC_ABCD !== undefined )	
			{
				REC_ABCD = lib.processData(data[i].REC_ABCD);
		    }
		    else 
			{ 
		    	REC_ABCD = '';
			}

		object.ABCD_T = ABCD_T;
		object.SBB_OPT = SBB_OPT;
		object.SBB_DES = SBB_DES;
		object.MFI_FFI_FC_IND = MFI_FFI_FC_IND;
		object.GAD = GAD;
		object.LOD = LOD;
		object.PPN = PPN;
		object.PP_DES = PP_DES;
		object.SUPPLIER = SUPPLIER;
		object.LENOVO_PPN_OHQ = LENOVO_PPN_OHQ;
		object.PPN_HIQ = PPN_HIQ;
		object.SBB_3M_FORECAST = SBB_3M_FORECAST;
		object.SBB_3M_SHIPMENT = SBB_3M_SHIPMENT;
		object.PPN_3M_SHIPMENT = PPN_3M_SHIPMENT;
		object.PRIOR_ABCD = PRIOR_ABCD;
		object.REC_ABCD = REC_ABCD;
		
		position = i+1;
		
		//非空检查
		if(SBB_OPT === ''|| PPN === ''|| REC_ABCD === ''|| SUPPLIER === '' || MFI_FFI_FC_IND === '')
			{
				error_message='not enough values';
				exception_process();
				continue;
			}
		
//		if ( MFI_FFI_FC_IND !== 'OPT' && MFI_FFI_FC_IND !== 'SBB' )
//			{
//				error_message='MFI_FFI_FC_IND value should be OPT or SBB';
//				exception_process();
//				continue;
//			}
		
		
		//字段长度检查
		if( ABCD_T.length>15)
			{
					error_message='ABCD_T::The length of "ABCD_T" is too large(no more than 15)';
					exception_process();
					continue;
			}
			
		if( SBB_OPT.length>12)
			{
					error_message='SBB_OPT::The length of "SBB_OPT" is too large(no more than 12)';
					exception_process();
					continue;
			}
		if( MFI_FFI_FC_IND.length>3)
			{
					error_message='MFI_FFI_FC_IND::The length of "MFI_FFI_FC_IND" is too large(no more than 3)';
					exception_process();
					continue;
			}
		if( PPN.length>12)
			{
					error_message='PPN::The length of "PPN" is too large(no more than 12)';
					exception_process();
					continue;
			}
		if( PRIOR_ABCD.length>1)
			{
					error_message='PRIOR_ABCD::The length of "PRIOR_ABCD" is too large(no more than 1)';
					exception_process();
					continue;
			}
		if( REC_ABCD.length>12)
			{
					error_message='REC_ABCD::The length of "REC_ABCD" is too large(no more than 1)';
					exception_process();
					continue;
			}
		
		if (!GAD.match(dateFormatValidation))
			{
				error_message='GAD Format should be MM/DD/YYYY!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				dateArray = dateFormatValidation.exec(GAD);
				dateObject = new Date(
					    (+dateArray[3]),
					    (+dateArray[1])-1,// Careful, month starts at 0! 
					    (+dateArray[2])/*,
					    (+dateArray[4]),
					    (+dateArray[5]),
					    (+dateArray[6])*/
					);
				GAD = dateObject;
			}
		
		if (!LOD.match(dateFormatValidation))
			{
				error_message='LOD Format should be MM/DD/YYYY!';
				//position = i+1;
				exception_process();
				continue;
			}
			else
			{
				dateArray = dateFormatValidation.exec(LOD);
				dateObject = new Date(
					    (+dateArray[3]),
					    (+dateArray[1])-1,// Careful, month starts at 0! 
					    (+dateArray[2])/*,
					    (+dateArray[4]),
					    (+dateArray[5]),
					    (+dateArray[6])*/
					);
				LOD = dateObject;
			}
		object.GAD = GAD;
		object.LOD = LOD;
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);

	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_report_interlock');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_report_interlock_err');
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