/***
 * OPTION_ATTRIBUTES UI Design
 * **/
$.import('cdp.ebgdf.service.upload', 'uploadLib');
var lib = $.cdp.ebgdf.service.upload.uploadLib;
var role = 'ui_attributes::uploadable';


var json=JSON.parse($.request.body.asString());


var tableName = 'UI_MT_ATTRIBUTES';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var MT = "";
var BIZ_LINE = "";
var X_NAME = "";
var PROJECT = "";

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

	var info_sql = 'call "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_attributes_err"(?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		pcall2.setString(5,MT);
		pcall2.setString(6,BIZ_LINE);
		pcall2.setString(7,X_NAME);
		pcall2.setString(8,PROJECT);

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
		if ( data[i].MT !== undefined )	
			{
				MT = lib.processData(data[i].MT);
		    }
		    else 
			{ 
		    	MT = '';
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
		
		position = i+1;

		//非空检查
		if(MT === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		
		//字段长度检查
		if( MT.length>4)
		{
				error_message='MT::The length of "MT" is too large(no more than 4)';
				exception_process();
				continue;
		}
		
		if( BIZ_LINE.length>100)
		{
				error_message='BIZ_LINE::The length of "BIZ_LINE" is too large(no more than 100)';
				exception_process();
				continue;
		}
		
		if( X_NAME.length>100)
		{
				error_message='X_NAME::The length of "X_NAME" is too large(no more than 100)';
				exception_process();
				continue;
		}
		
		if( PROJECT.length>100)
		{
				error_message='PROJECT::The length of "PROJECT" is too large(no more than 100)';
				exception_process();
				continue;
		}
	
		query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.upload::ui_attributes"(?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,fileName);
			pcall.setInteger(2,seq);
			pcall.setInteger(3,position);
			pcall.setString(4,MT);
			pcall.setString(5,BIZ_LINE);
			pcall.setString(6,X_NAME);
			pcall.setString(7,PROJECT);
			
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