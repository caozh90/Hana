/***
 * 4.4 X86 COSTFLAG UI Design
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_costflag::uploadable';

var json=JSON.parse($.request.body.asString());

//var tableName = json.tablename;
var tableName = 'UI_COSTFLAG';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var SBB_TYPE = "";
var VK = "";
var COST_FLAG;
var position =0;
var i;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle;

var body;

var pcall_seq;
var seq;//upload seq
 
var index;
var length;


function exception_process()
{
	
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_costflag_err"(?,?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,SBB_TYPE);
		pcall2.setString(4,VK);
		pcall2.setString(5,COST_FLAG);
		pcall2.setInteger(6,seq);
		pcall2.setInteger(7,position);
		
		pcall2.execute();
		pcall2.close();
		conn2.commit();
		conn2.close();
		body = 'Finished! You can check the result on HANA';
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	body = 'Finished! You can check the result on HANA::'+info_sql;
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
	{  position = i+1;
			if ( data[i].SBB_TYPE !== undefined && data[i].SBB_TYPE !== null )	
			{
				SBB_TYPE = lib.processData(data[i].SBB_TYPE);
		    }
		    else 
			{ 
		    	SBB_TYPE = '';
			}
			
			if ( data[i].VK !== undefined && data[i].VK !== null )	
			{
				VK = lib.processData(data[i].VK);
				if(VK.indexOf('="') > -1)
				{
					VK = VK.substring(2, VK.length-1);
				}
		    }
		    else 
			{ 
		    	VK = '';
			}
			
		COST_FLAG = lib.processData(data[i].COST_FLAG);
	
		
		if( !SBB_TYPE && SBB_TYPE.length>30)
		{
				error_message='SBB_TYPE::The length of "SBB_TYPE" is too large(no more than 30)';
				exception_process();
				continue;
		}
		
		if( !VK && VK.length>30)
		{
				error_message='VK::The length of "VK" is too large(no more than 30)';
				exception_process();
				continue;
		}
		if( !COST_FLAG && COST_FLAG.length>10)
		{
			error_message='COST_FLAG::The length of "COST_FLAG" is too large(no more than 10)';
			exception_process();
			continue;
		}

		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_costflag"(?,?,?,?,?,?)';
		try
		{  
			pcall = conn.prepareCall(query);
			pcall.setString(1,SBB_TYPE);
			pcall.setString(2,VK);
			pcall.setString(3,COST_FLAG);
			pcall.setString(4,fileName);
			pcall.setInteger(5,seq);
			pcall.setInteger(6,position);
			
			pcall.execute();
			pcall.close();
			//conn.commit();
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