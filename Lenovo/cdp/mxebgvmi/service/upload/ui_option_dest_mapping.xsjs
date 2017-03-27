var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.mxebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.mxebgvmi.service.upload.uploadLib;
var role = 'optiondestinationmapping::uploadable';

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var LOGICAL_PLANT;
var WAREHOUSE_OWNER;
var SOURCE_LOCATION;
var SOURCE_TYPE;
var SOURCE_BIN;
var DESTINATION_LOCATION;
var DESTINATION_TYPE;
var DESTINATION_BIN;

var position =0;
var i = 0;

var conn = $.db.getConnection();
var pcall;
var query;
var body;

var pcall_seq;
var seq;//upload seq
//function processData(data){
//	if(data !== undefined)
//	{
//		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
//			data = data.substring(1,data.length - 1);
//		}
//	}
//	return data;
//}
function exception_process()
{
	
/*	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_option_dest_mapping_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ LOGICAL_PLANT+'\',\''
		+ WAREHOUSE_OWNER+'\',\''
		+ SOURCE_LOCATION+'\',\''
		+ SOURCE_TYPE+'\',\''
		+ SOURCE_BIN+'\',\''
		+ DESTINATION_LOCATION+'\',\''
		+ DESTINATION_TYPE+'\',\''
		+ DESTINATION_BIN+'\','
		
		+seq+','
		+position
		+')';
		*/
	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_option_dest_mapping_err"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,LOGICAL_PLANT);
		pcall2.setString(4,WAREHOUSE_OWNER);
		pcall2.setString(5,SOURCE_LOCATION);
		pcall2.setString(6,SOURCE_TYPE);	
		pcall2.setString(7,SOURCE_BIN);
		pcall2.setString(8,DESTINATION_LOCATION);
		pcall2.setString(9,DESTINATION_TYPE);
		pcall2.setString(10,DESTINATION_BIN);	
		pcall2.setInteger(11,seq);
		pcall2.setInteger(12,position);
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
		query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	for(i=0;i<data.length;i++)
	{
		LOGICAL_PLANT = lib.processData(data[i].LOGICAL_PLANT);
		WAREHOUSE_OWNER = lib.processData(data[i].WAREHOUSE_OWNER);
		SOURCE_LOCATION = lib.processData(data[i].SOURCE_LOCATION);
		SOURCE_TYPE = lib.processData(data[i].SOURCE_TYPE);
		SOURCE_BIN = lib.processData(data[i].SOURCE_BIN);
		DESTINATION_LOCATION = lib.processData(data[i].DESTINATION_LOCATION);
		DESTINATION_TYPE = lib.processData(data[i].DESTINATION_TYPE);
		DESTINATION_BIN = lib.processData(data[i].DESTINATION_BIN);

		position = i+1;
		
		if(LOGICAL_PLANT === undefined ||WAREHOUSE_OWNER === undefined ||SOURCE_LOCATION === undefined )
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(SOURCE_TYPE === undefined ||SOURCE_BIN === undefined ||DESTINATION_LOCATION === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(DESTINATION_TYPE === undefined ||DESTINATION_BIN === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(SOURCE_LOCATION.length>40)
		{
				error_message='SOURCE_LOCATION::The length of "SOURCE_LOCATION" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(LOGICAL_PLANT.length>40)
		{
			error_message='LOGICAL_PLANT::The length of "LOGICAL_PLANT" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(WAREHOUSE_OWNER.length>40)
		{
				error_message='WAREHOUSE_OWNER::The length of "WAREHOUSE_NUMBER" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(SOURCE_TYPE.length>40)
		{
			error_message='SOURCE_TYPE::The length of "SOURCE_TYPE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(SOURCE_BIN.length>40)
		{
				error_message='SOURCE_BIN::The length of "SOURCE_BIN" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(DESTINATION_LOCATION.length>40)
		{
			error_message='DESTINATION_LOCATION::The length of "DESTINATION_LOCATION" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(DESTINATION_TYPE.length>40)
		{
			error_message='DESTINATION_TYPE::The length of "DESTINATION_TYPE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(DESTINATION_BIN.length>40)
		{
			error_message='DESTINATION_BIN::The length of "DESTINATION_BIN" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		
	/*	query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_option_dest_mapping"'
		    + '(\''
		    
		    + LOGICAL_PLANT+'\',\''
		    + WAREHOUSE_OWNER+'\',\''
		    + SOURCE_LOCATION+'\',\''
		    + SOURCE_TYPE+'\',\''
		    + SOURCE_BIN+'\',\''
		    + DESTINATION_LOCATION+'\',\''
		    + DESTINATION_TYPE+'\',\''
		    + DESTINATION_BIN+'\',\''
		    
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';*/
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_option_dest_mapping"(?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,LOGICAL_PLANT);
			pcall.setString(2,WAREHOUSE_OWNER);
			pcall.setString(3,SOURCE_LOCATION);
			pcall.setString(4,SOURCE_TYPE);
			pcall.setString(5,SOURCE_BIN);
			pcall.setString(6,DESTINATION_LOCATION);
			pcall.setString(7,DESTINATION_TYPE);
			pcall.setString(8,DESTINATION_BIN);
			pcall.setString(9,fileName);
			pcall.setInteger(10,seq);
			pcall.setInteger(11,position);
			
			pcall.execute();
			pcall.close();
			conn.commit();
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
	conn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);

}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}