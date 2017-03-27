var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.mxebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.mxebgvmi.service.upload.uploadLib;
var role = 'sourcingpriority::uploadable';
//var tableName = json.tablename;
var tableName = 'UI_SOURCING_PRIORITY';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var logical_plant;
var mo_type;
var warehouse_number;
var storage_location;
var storage_type;
var priority;
var owner;
var inventory_type;

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
	
//	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_sourcing_priority_err"(\''
//		+error_message+'\',\''
//		+fileName+'\',\''
//
//		+logical_plant+'\',\''
//		+mo_type+'\',\''
//		+warehouse_number+'\',\''
//		+storage_location+'\',\''
//		+storage_type+'\',\''
//		+priority+'\',\''
//		+owner+'\',\''
//		+inventory_type+'\','
//
//		+seq+','
//		+position
//		+')';
	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_sourcing_priority_err"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,logical_plant);
		pcall2.setString(4,mo_type);
		pcall2.setString(5,warehouse_number);
		pcall2.setString(6,storage_location);
		pcall2.setString(7,storage_type);
		pcall2.setString(8,priority);
		pcall2.setString(9,owner);
		pcall2.setString(10,inventory_type);
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
		
		logical_plant = lib.processData(data[i].LOGICAL_PLANT);
		mo_type = lib.processData(data[i].MO_TYPE);
		warehouse_number = lib.processData(data[i].WAREHOUSE_NUMBER);
		storage_location = lib.processData(data[i].STORAGE_LOCATION);
		storage_type = lib.processData(data[i].STORAGE_TYPE);
		priority = lib.processData(data[i].PRIORITY);
		owner = lib.processData(data[i].OWNER);
		inventory_type = lib.processData(data[i].INVENTORY_TYPE);

		position = i+1;
		
		if(logical_plant === undefined || mo_type === undefined ||  warehouse_number=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(storage_location === undefined || storage_type === undefined ||priority=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(owner === undefined || inventory_type === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(logical_plant.length>40)
		{
				error_message='LOGICAL_PLANT::The length of "LOGICAL_PLANT" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(mo_type.length>40)
		{
			error_message='MO_TYPE::The length of "MO_TYPE" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(warehouse_number.length>40)
		{
			error_message='WAREHOUSE_NUMBER::The length of "WAREHOUSE_NUMBER" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(storage_location.length>40)
		{
			error_message='STORAGE_LOCATION::The length of "STORAGE_LOCATION" is too large(no more than 200)';
			exception_process();
			continue;
		}
		if(storage_type.length>40)
		{
			error_message='STORAGE_TYPE::The length of "STORAGE_TYPE" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(owner.length>40)
		{
			error_message='OWNER::The length of "OWNER" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(inventory_type.length>40)
		{
			error_message='INVENTORY_TYPE::The length of "INVENTORY_TYPE" is too large(no more than 40)';
			exception_process();
			continue;
		}
		
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_sourcing_priority"'
		    + '(\''

			+logical_plant+'\',\''
			+mo_type+'\',\''
			+warehouse_number+'\',\''
			+storage_location+'\',\''
			+storage_type+'\',\''
			+priority+'\',\''
			+owner+'\',\''
			+inventory_type+'\',\''
			
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_sourcing_priority"(?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,logical_plant);
			pcall.setString(2,mo_type);
			pcall.setString(3,warehouse_number);
			pcall.setString(4,storage_location);
			pcall.setString(5,storage_type);
			pcall.setString(6,priority);
			pcall.setString(7,owner);
			pcall.setString(8,inventory_type);
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