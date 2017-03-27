/***
 * UI_CLASS_PERCENT UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');

var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_class_percent::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_CLASS_PERCENT';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var ABCD_T = "";
var A;
var B;
var C;

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

	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_class_percent_err"(?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,ABCD_T);
		pcall2.setString(6,A);
		pcall2.setString(7,B);
		pcall2.setString(8,C);

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
		query = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	for(i=0;i<data.length;i++)
	{  
		if ( data[i].ABCD_T !== undefined )	
			{
				ABCD_T = lib.processData(data[i].ABCD_T);
		    }
		    else 
			{ 
		    	ABCD_T = '';
			}
			
		if ( data[i].A !== undefined )	
			{
				A = lib.processData(data[i].A);
		    }
		    else
			{ 
		    	A = 0;
			}
		
		if ( data[i].B !== undefined )	
			{
				B = lib.processData(data[i].B);
		    }
		    else 
			{ 
		    	B = 0;
			}
		
		if ( data[i].C !== undefined )	
			{
				C = lib.processData(data[i].C);
		    }
		    else 
			{ 
		    	C = 0;
			}
		
		position = i+1;

		//非空检查
		if(ABCD_T === ''||A === ''||B === ''||C === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		//字段长度检查
		if( ABCD_T.length>30)
		{
				error_message='ABCD_T::The length of "ABCD_T" is too large(no more than 30)';
				exception_process();
				continue;
		}
		
		if( (parseFloat( A ) + parseFloat( B ) + parseFloat( C )).toFixed(2) !== '1.00' )
		{
				error_message='the sum total A, B, C values must equal to 1 and for each A, B, C value need to be in the format like 0.1 (means 10%)';
				exception_process();
				continue;
		}
		
		query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_class_percent"(?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,ABCD_T);
			pcall.setDecimal(5,A);
			pcall.setDecimal(6,B);
			pcall.setDecimal(7,C);
			
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

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}