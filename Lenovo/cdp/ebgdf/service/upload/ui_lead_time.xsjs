/***
 * 4.9 X86 UI_LEAD_TIME UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_lead_time::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'RPT_LEADTIME';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE_ID = "";
var MFI_FFI_FC_IND = "";
var MFI_FFI_FC = "";
var PPN = "";
var ABCD_T = "";
var ABCD = "";
var LEADTIME = "";

var position =0;
var i;

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

function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	error_result.push(object);
	
//	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_lead_time_err"(?,?,?,?,?,?,?,?,?,?,?)';
//	try 
//	{
//		var pcall2 = conn.prepareCall(info_sql);
//		pcall2.setString(1,error_message);
//		pcall2.setString(2,fileName);
//		pcall2.setInteger(3,seq);
//		pcall2.setInteger(4,position);
//		pcall2.setString(5,CYCLE_ID);
//		pcall2.setString(6,MFI_FFI_FC_IND);
//		pcall2.setString(7,MFI_FFI_FC);
//		pcall2.setString(8,PPN);
//		pcall2.setString(9,ABCD_T);
//		pcall2.setString(10,ABCD);
//		pcall2.setString(11,LEADTIME);
//		
//		pcall2.execute();
//		pcall2.close();
//		conn.commit();
//		body = 'Finished! You can check the result on HANA';
//		$.response.status = $.net.http.OK;
//	}
//	catch(e)
//	{
//		body = e.message;
//		$.response.status = $.net.http.BAD_REQUEST;
//	}

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
		query = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::getBusinessCode');
		pcall_seq = query();
		seq = pcall_seq.businessCode;
	}

	for(i=0;i<data.length;i++)
	{  
		//Restructuring object
		object =  {};
		
		if ( data[i].CYCLE_ID !== undefined )	
			{
				CYCLE_ID = lib.processData(data[i].CYCLE_ID);
		    }
		    else 
			{ 
		    	CYCLE_ID = '';
			}
			
		if ( data[i].MFI_FFI_FC_IND !== undefined )	
			{
				MFI_FFI_FC_IND = lib.processData(data[i].MFI_FFI_FC_IND);
		    }
		    else 
			{ 
		    	MFI_FFI_FC_IND = '';
			}
		
		if ( data[i].MFI_FFI_FC !== undefined )	
			{
				MFI_FFI_FC = lib.processData(data[i].MFI_FFI_FC);
		    }
		    else 
			{ 
		    	MFI_FFI_FC = '';
			}
		
		if ( data[i].PPN !== undefined )	
			{
				PPN = lib.processData(data[i].PPN);
		    }
		    else 
			{ 
		    	PPN = '';
			}
		
		if ( data[i].ABCD_T !== undefined )	
			{
				ABCD_T = lib.processData(data[i].ABCD_T);
		    }
		    else 
			{ 
		    	ABCD_T = '';
			}
		
		if ( data[i].ABCD !== undefined )	
			{
				ABCD = lib.processData(data[i].ABCD);
		    }
		    else 
			{ 
		    	ABCD = '';
			}
		
		if ( data[i].LEADTIME !== undefined )	
			{
				LEADTIME = lib.processData(data[i].LEADTIME);
		    }
		    else 
			{ 
		    	LEADTIME = '';
			}
		
		object.CYCLE_ID = CYCLE_ID;
		object.MFI_FFI_FC_IND = MFI_FFI_FC_IND;
		object.MFI_FFI_FC = MFI_FFI_FC;
		object.PPN = PPN;
		object.ABCD_T = ABCD_T;
		object.ABCD = ABCD;
		object.LEADTIME = LEADTIME;
		
		position = i+1;

		
		
		//非空检查
		if(MFI_FFI_FC_IND === ''||MFI_FFI_FC === ''||PPN === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}

		//字段长度检查
		if( CYCLE_ID.length>9)
		{
				error_message='CYCLE_ID::The length of "CYCLE_ID" is too large(no more than 9)';
				exception_process();
				continue;
		}
		
		if( MFI_FFI_FC_IND.length>3)
		{
				error_message='MFI_FFI_FC_IND::The length of "MFI_FFI_FC_IND" is too large(no more than 3)';
				exception_process();
				continue;
		}
		if( MFI_FFI_FC.length>20)
		{
				error_message='MFI_FFI_FC::The length of "MFI_FFI_FC" is too large(no more than 20)';
				exception_process();
				continue;
		}
		if( PPN.length>12)
		{
				error_message='PPN::The length of "PPN" is too large(no more than 12)';
				exception_process();
				continue;
		}
		if( ABCD_T.length>15)
		{
				error_message='ABCD_T::The length of "ABCD_T" is too large(no more than 15)';
				exception_process();
				continue;
		}
		if( ABCD.length>1)
		{
				error_message='ABCD::The length of "ABCD" is too large(no more than 1)';
				exception_process();
				continue;
		}
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);
//		
//		query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_lead_time"(?,?,?,?,?,?,?,?,?,?)';
//		try
//		{
//			pcall = conn.prepareCall(query);
//			pcall.setString(1,fileName);
//			pcall.setInteger(2,seq);
//			pcall.setInteger(3,position);
//			pcall.setString(4,CYCLE_ID);
//			pcall.setString(5,MFI_FFI_FC_IND);
//			pcall.setString(6,MFI_FFI_FC);
//			pcall.setString(7,PPN);
//			pcall.setString(8,ABCD_T);
//			pcall.setString(9,ABCD);
//			pcall.setString(10,LEADTIME);
//			
//			pcall.execute();
//			pcall.close();
//			body = 'Finished! You can check the result on HANA';
//			$.response.status = $.net.http.OK;
//		}
//		catch(e)
//		{	
//			error_message = e.message;
//			//替换单引号'
//			while(error_message.indexOf("'") >0 ) {
//				error_message = error_message.replace('\'','"'); 
//			}
//			exception_process();
//			$.response.status = $.net.http.BAD_REQUEST;
//			body = e.message;
//		}

	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_lead_time');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_lead_time_err');
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