/***
 * 4.9 X86 UI_MFI_PPN UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_mfi_ppn::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_MFI_PPN';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var ABCD_T = "";
var SBB = "";
var PPN = "";

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

function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	error_result.push(object);
}
//验证权限
if(lib.assertAppRole(role) === 'OK')//lib.assertAppRole(role) === 'OK'
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
//		query = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::getBusinessCode"(?)';
//		pcall_seq = conn.prepareCall(query);
		//pcall_seq.execute();
		//seq = pcall_seq.getInteger(1);
		seq = pcall_seq.businessCode;
		//hconn.close();
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
			
		if ( data[i].SBB !== undefined )	
		{
			SBB = lib.processData(data[i].SBB);
	    }
	    else 
		{ 
	    	SBB = '';
		}
		
		if ( data[i].PPN !== undefined )	
		{
			PPN = lib.processData(data[i].PPN);
	    }
	    else 
		{ 
	    	PPN = '';
		}
		
		object.ABCD_T = ABCD_T;
		object.SBB = SBB;
		object.PPN = PPN;

		position = i+1;
		
		//非空检查
		if(ABCD_T === '' || SBB === ''|| PPN === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		
		
		//字段长度检查
		if( ABCD_T.length>15)
		{
				error_message='ABCD_T::The length of "ABCD_T" is too large(no more than 15)';
				exception_process();
				continue;
		}
		
		if( SBB.length>12)
		{
				error_message='SBB::The length of "SBB" is too large(no more than 12)';
				exception_process();
				continue;
		}
		if( PPN.length>12)
		{
				error_message='PPN::The length of "PPN" is too large(no more than 12)';
				exception_process();
				continue;
		}
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);
		
//		query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_mfi_ppn"(?,?,?,?,?,?)';
//		try
//		{
//			pcall = conn.prepareCall(query);
//			pcall.setString(1,fileName);
//			pcall.setInteger(2,seq);
//			pcall.setInteger(3,position);
//			pcall.setString(4,ABCD_T);
//			pcall.setString(5,SBB);
//			pcall.setString(6,PPN);
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_mfi_ppn');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_mfi_ppn_err');
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