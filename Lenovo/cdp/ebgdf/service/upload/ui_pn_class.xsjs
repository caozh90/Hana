/***
 * 4.9 X86 UI_PN_CLASS UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_pn_class::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'RPT_PN_CLASS';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE_ID = "";
var MFI_FFI_FC_IND = "";
var MFI_FFI_FC = "";
var PPN = "";
var ABCD_T = "";
var LOD;
var ABCD = "";
var ABCD_1 = "";
var ABCD_2 = "";
var ABCD_3 = "";
var ABCD_4 = "";
var ABCD_5 = "";

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
//	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_pn_class_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
//		pcall2.setString(10,LOD);
//		pcall2.setString(11,ABCD);
//		pcall2.setString(12,ABCD_1);
//		pcall2.setString(13,ABCD_2);
//		pcall2.setString(14,ABCD_3);
//		pcall2.setString(15,ABCD_4);
//		pcall2.setString(16,ABCD_5);
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
		
		if ( data[i].LOD !== undefined )	
		{
			LOD = lib.processData(data[i].LOD);
	    }
	    else 
		{ 
	    	LOD = '01/01/1900';
		}
		
		if ( data[i].ABCD !== undefined )	
			{
				ABCD = lib.processData(data[i].ABCD);
		    }
		    else 
			{ 
		    	ABCD = '';
			}
		
		if ( data[i].ABCD_1 !== undefined )	
			{
				ABCD_1 = lib.processData(data[i].ABCD_1);
		    }
		    else 
			{ 
		    	ABCD_1 = '';
			}

		if ( data[i].ABCD_2 !== undefined )	
			{
				ABCD_2 = lib.processData(data[i].ABCD_2);
		    }
		    else 
			{ 
		    	ABCD_2 = '';
			}
		
		if ( data[i].ABCD_3 !== undefined )	
			{
				ABCD_3 = lib.processData(data[i].ABCD_3);
		    }
		    else 
			{ 
		    	ABCD_3 = '';
			}
		if ( data[i].ABCD_4 !== undefined )	
			{
				ABCD_4 = lib.processData(data[i].ABCD_4);
		    }
		    else 
			{ 
		    	ABCD_4 = '';
			}
		if ( data[i].ABCD_5 !== undefined )	
			{
				ABCD_5 = lib.processData(data[i].ABCD_5);
		    }
		    else 
			{ 
		    	ABCD_5 = '';
			}

		object.CYCLE_ID = CYCLE_ID;
		object.MFI_FFI_FC_IND = MFI_FFI_FC_IND;
		object.MFI_FFI_FC = MFI_FFI_FC;
		object.PPN = PPN;
		object.ABCD_T = ABCD_T;
		object.LOD = LOD;
		object.ABCD = ABCD;
		object.ABCD_1 = ABCD_1;
		object.ABCD_2 = ABCD_2;
		object.ABCD_3 = ABCD_3;
		object.ABCD_4 = ABCD_4;
		object.ABCD_5 = ABCD_5;
		
		position = i+1;

		//非空检查
		if( MFI_FFI_FC_IND === ''|| MFI_FFI_FC === ''|| PPN === ''||LOD=== '')
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
		if( ABCD_1.length>1)
		{
				error_message='ABCD_1::The length of "ABCD_1" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( ABCD_2.length>1)
		{
				error_message='ABCD_2::The length of "ABCD_2" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( ABCD_3.length>1)
		{
				error_message='ABCD_3::The length of "ABCD_3" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( ABCD_4.length>1)
		{
				error_message='ABCD_4::The length of "ABCD_4" is too large(no more than 1)';
				exception_process();
				continue;
		}
		if( ABCD_5.length>1)
		{
				error_message='ABCD_5::The length of "ABCD_5" is too large(no more than 1)';
				exception_process();
				continue;
		}
		
		/**************************
		 * Modified by Chris Gao
		 * 2015-10-19
		 * date format validation
		 *************************/
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
		/**************************
		 * End by Chris Gao
		 **************************/
		object.LOD = LOD;
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);

	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_pn_class');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_pn_class_err');
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