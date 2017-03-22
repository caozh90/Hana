/***
 * 4.9 X86 UI_REL_CONFIG_CLASS UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_rel_config_class::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'RPT_RELCONFCLASS';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE_ID = "";
var MTM = "";
var MACH_T = "";
var BIZ_LINE = "";
var X_NAME = "";
var PROJECT = "";
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
	
//	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_rel_config_class_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
//	try 
//	{
//		var pcall2 = conn.prepareCall(info_sql);
//		pcall2.setString(1,error_message);
//		pcall2.setString(2,fileName);
//		pcall2.setInteger(3,seq);
//		pcall2.setInteger(4,position);
//		pcall2.setString(5,CYCLE_ID);
//		pcall2.setString(6,MTM);
//		pcall2.setString(7,MACH_T);
//		pcall2.setString(8,BIZ_LINE);
//		pcall2.setString(9,X_NAME);
//		pcall2.setString(10,PROJECT);
//		pcall2.setString(11,LOD);
//		pcall2.setString(12,ABCD);
//		pcall2.setString(13,ABCD_1);
//		pcall2.setString(14,ABCD_2);
//		pcall2.setString(15,ABCD_3);
//		pcall2.setString(16,ABCD_4);
//		pcall2.setString(17,ABCD_5);
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
			
		if ( data[i].MTM !== undefined )	
			{
				MTM = lib.processData(data[i].MTM);
		    }
		    else 
			{ 
		    	MTM = '';
			}
		
		if ( data[i].MACH_T !== undefined )	
			{
				MACH_T = lib.processData(data[i].MACH_T);
		    }
		    else 
			{ 
		    	MACH_T = '';
			}
		
		if ( data[i].BIZ_LINE !== undefined )	
			{
				BIZ_LINE = lib.processData(data[i].BIZ_LINE);
		    }
		    else 
			{ 
		    	BIZ_LINE = '';
			}
		
		if ( data[i].X_NAME !== undefined )	
			{
				X_NAME = lib.processData(data[i].X_NAME);
		    }
		    else 
			{ 
		    	X_NAME = '';
			}
		
		if ( data[i].PROJECT !== undefined )	
			{
				PROJECT = lib.processData(data[i].PROJECT);
		    }
		    else 
			{ 
		    	PROJECT = '';
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
		object.MTM = MTM;
		object.MACH_T = MACH_T;
		object.BIZ_LINE = BIZ_LINE;
		object.X_NAME = X_NAME;
		object.PROJECT = PROJECT;
		object.LOD = LOD;
		object.ABCD = ABCD;
		object.ABCD_1 = ABCD_1;
		object.ABCD_2 = ABCD_2;
		object.ABCD_3 = ABCD_3;
		object.ABCD_4 = ABCD_4;
		object.ABCD_5 = ABCD_5;
		
		position = i+1;

		//非空检查
		if(MTM === '')
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
		
		if( MTM.length>18)
		{
				error_message='MTM::The length of "MTM" is too large(no more than 18)';
				exception_process();
				continue;
		}
		if( MACH_T.length>4)
		{
				error_message='MACH_T::The length of "MACH_T" is too large(no more than 4)';
				exception_process();
				continue;
		}
		if( BIZ_LINE.length>15)
		{
				error_message='BIZ_LINE::The length of "BIZ_LINE" is too large(no more than 15)';
				exception_process();
				continue;
		}
		if( X_NAME.length>30)
		{
				error_message='X_NAME::The length of "X_NAME" is too large(no more than 30)';
				exception_process();
				continue;
		}
		if( PROJECT.length>50)
		{
				error_message='PROJECT::The length of "PROJECT" is too large(no more than 50)';
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
		
		object.LOD = LOD;
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);
	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_rel_config_class');
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
			var callProcedure = hconn.loadProcedure('EBGDF', 'cdp.ebgdf.procedures.pkg_ui.upload::ui_rel_config_class_err');
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