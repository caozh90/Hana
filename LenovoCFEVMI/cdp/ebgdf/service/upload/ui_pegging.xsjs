/***
 * 4.9 X86 UI_PEGGING UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_pegging::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'RPT_LEADTIME';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var ABCD_T = "";
var MTM = "";
var MTM_ABCD = "";
var SBB = "";
var SBB_DES = "";
var SBB_ABCD = "";
var SBB_ABCD_1 = "";
var SBB_ABCD_2 = "";
var SBB_ABCD_3 = "";
var SBB_ABCD_4 = "";
var SBB_ABCD_5 = "";

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
//	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_pegging_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
//	try 
//	{
//		var pcall2 = conn.prepareCall(info_sql);
//		pcall2.setString(1,error_message);
//		pcall2.setString(2,fileName);
//		pcall2.setInteger(3,seq);
//		pcall2.setInteger(4,position);
//		pcall2.setString(5,ABCD_T);
//		pcall2.setString(6,MTM);
//		pcall2.setString(7,MTM_ABCD);
//		pcall2.setString(8,SBB);
//		pcall2.setString(9,SBB_DES);
//		pcall2.setString(10,SBB_ABCD);
//		pcall2.setString(11,SBB_ABCD_1);
//		pcall2.setString(12,SBB_ABCD_2);
//		pcall2.setString(13,SBB_ABCD_3);
//		pcall2.setString(14,SBB_ABCD_4);
//		pcall2.setString(15,SBB_ABCD_5);
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
		
		if ( data[i].ABCD_T !== undefined )	
			{
				ABCD_T = lib.processData(data[i].ABCD_T);
		    }
		    else 
			{ 
		    	ABCD_T = '';
			}
			
		if ( data[i].MTM !== undefined )	
			{
				MTM = lib.processData(data[i].MTM);
		    }
		    else 
			{ 
		    	MTM = '';
			}
		
		if ( data[i].MTM_ABCD !== undefined )	
			{
				MTM_ABCD = lib.processData(data[i].MTM_ABCD);
		    }
		    else 
			{ 
		    	MTM_ABCD = '';
			}
		
		if ( data[i].SBB !== undefined )	
			{
				SBB = lib.processData(data[i].SBB);
		    }
		    else 
			{ 
		    	SBB = '';
			}
		
		if ( data[i].SBB_DES !== undefined )	
			{
				SBB_DES = lib.processData(data[i].SBB_DES);
		    }
		    else 
			{ 
		    	SBB_DES = '';
			}
		
		if ( data[i].SBB_ABCD !== undefined )	
			{
				SBB_ABCD = lib.processData(data[i].SBB_ABCD);
		    }
		    else 
			{ 
		    	SBB_ABCD = '';
			}
		
		if ( data[i].SBB_ABCD_1 !== undefined )	
			{
				SBB_ABCD_1 = lib.processData(data[i].SBB_ABCD_1);
		    }
		    else 
			{ 
		    	SBB_ABCD_1 = '';
			}
		
		if ( data[i].SBB_ABCD_2 !== undefined )	
			{
				SBB_ABCD_2 = lib.processData(data[i].SBB_ABCD_2);
		    }
		    else 
			{ 
		    	SBB_ABCD_2 = '';
			}

		if ( data[i].SBB_ABCD_3 !== undefined )	
			{
				SBB_ABCD_3 = lib.processData(data[i].SBB_ABCD_3);
		    }
		    else 
			{ 
		    	SBB_ABCD_3 = '';
			}
		
		if ( data[i].SBB_ABCD_4 !== undefined )	
			{
				SBB_ABCD_4 = lib.processData(data[i].SBB_ABCD_4);
		    }
		    else 
			{ 
		    	SBB_ABCD_4 = '';
			}
		if ( data[i].SBB_ABCD_5 !== undefined )	
			{
				SBB_ABCD_5 = lib.processData(data[i].SBB_ABCD_5);
		    }
		    else 
			{ 
		    	SBB_ABCD_5 = '';
			}

		object.ABCD_T = ABCD_T;
		object.MTM = MTM;
		object.MTM_ABCD = MTM_ABCD;
		object.SBB = SBB;
		object.SBB_DES = SBB_DES;
		object.SBB_ABCD = SBB_ABCD;
		object.SBB_ABCD_1 = SBB_ABCD_1;
		object.SBB_ABCD_2 = SBB_ABCD_2;
		object.SBB_ABCD_3 = SBB_ABCD_3;
		object.SBB_ABCD_4 = SBB_ABCD_4;
		object.SBB_ABCD_5 = SBB_ABCD_5;
		
		position = i+1;

		//非空检查
		if(MTM === '' || SBB === '')
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
		
		if( MTM.length>18)
		{
				error_message='MTM::The length of "MTM" is too large(no more than 18)';
				exception_process();
				continue;
		}
		if( MTM_ABCD.length>1)
		{
				error_message='MTM_ABCD::The length of "MTM_ABCD" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB.length>12)
		{
				error_message='SBB::The length of "SBB" is too large(no more than 12)';
				exception_process();
				continue;
		}
		if( SBB_DES.length>50)
		{
				error_message='SBB_DES::The length of "SBB_DES" is too large(no more than 50)';
				exception_process();
				continue;
		}
		if( SBB_ABCD.length>1)
		{
				error_message='SBB_ABCD::The length of "SBB_ABCD" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB_ABCD_1.length>1)
		{
				error_message='SBB_ABCD_1::The length of "SBB_ABCD_1" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB_ABCD_2.length>1)
		{
				error_message='SBB_ABCD_2::The length of "SBB_ABCD_2" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB_ABCD_3.length>1)
		{
				error_message='ABCD_3::The length of "SBB_ABCD_3" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB_ABCD_4.length>1)
		{
				error_message='SBB_ABCD_4::The length of "SBB_ABCD_4" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( SBB_ABCD_5.length>1)
		{
				error_message='SBB_ABCD_5::The length of "SBB_ABCD_5" is too large(no more than 1)';
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_pegging');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_pegging_err');
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