var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'mobomlocation::uploadable';

//var tableName = json.tablename;
var tableName = 'UI_MOBOM_LOCATION';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var LOGICAL_PLANT;
var ITEM;
var STORAGE_LOCATION;

var position =0;
var i;
var conn = $.db.getConnection();
var pcall;
var query;

var body;

var pcall_seq;
var seq;//upload seq

function processData(data){
	if(data !== undefined && data !== null)
	{
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}
	}else{
		data = "";
	}
	return data;
}
function exception_process()
{
	
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_mobom_location_err"(?,?,?,?,?,?,?,?)';

	try
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,ITEM);
		pcall2.setString(2,LOGICAL_PLANT);
		pcall2.setString(3,STORAGE_LOCATION);
		pcall2.setString(4,tableName);
		pcall2.setString(5,fileName);
		pcall2.setInteger(6,seq);
		pcall2.setInteger(7,position);
		pcall2.setString(8,error_message);

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
		query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::getBusinessCode"(?)';
		
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}
	
	for(i=0;i<data.length;i++)
	{
		LOGICAL_PLANT = processData(data[i].LOGICAL_PLANT);
		ITEM = processData(data[i].ITEM);
		STORAGE_LOCATION = processData(data[i].STORAGE_LOCATION);
		position = i+1;
		if(LOGICAL_PLANT === undefined)
		{
			error_message='"LOGICAL_PLANT" is necessary!';
			exception_process();
			continue;
		}
		else if(ITEM === undefined)
		{
			error_message='"ITEM" is necessary!';
			exception_process();
			continue;
		}
		else if(STORAGE_LOCATION === undefined)
		{
			error_message='"STORAGE_LOCATION" is necessary!';
			exception_process();
			continue;
		}	
		
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_mobom_location"(?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,ITEM);
			pcall.setString(2,LOGICAL_PLANT);
			pcall.setString(3,STORAGE_LOCATION);
			pcall.setString(4,tableName);
			pcall.setString(5,fileName);
			pcall.setInteger(6,seq);
			pcall.setInteger(7,position);
				
			pcall.execute();
			pcall.close();
			conn.commit(); 	
			body = 'Finished! You can check the result on HANA';
			$.response.status = $.net.http.OK;
		}
		catch(e)
		{	
			error_message = e.message;
			exception_process();
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}
	}

	conn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}