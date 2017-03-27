var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'controlcycle::uploadable';

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var ITEM;
var LOGICAL_PLANT;
var WAREHOUSE_NUMBER;
var PHYSICAL_PLANT;
var STORAGE_LOCATION;
var STORAGE_TYPE;
var STORAGE_BIN;

var position =0;
var i = 0;

var conn = $.db.getConnection();
var pcall;
var query;
var body;

var pcall_seq;
var seq;//upload seq
//function processData(data){
//	if(data !== undefined  && data !== null)
//	{
//		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
//			data = data.substring(1,data.length - 1);
//		}
//	}else{
//		data = "";
//	}
//	return data;
//}
function exception_process()
{
/*	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_control_cycle_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ ITEM+'\',\''
		+ LOGICAL_PLANT+'\',\''
		+ WAREHOUSE_NUMBER+'\',\''
		+ PHYSICAL_PLANT+'\',\''
		+ STORAGE_LOCATION+'\',\''
		+ STORAGE_TYPE+'\',\''
		+ STORAGE_BIN+'\','
		
		+seq+','
		+position
		+')';*/
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_control_cycle_err"(?,?,?,?,?,?,?,?,?,?,?)';
	
	var pcall2 = conn.prepareCall(info_sql);
	try
	{
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,ITEM);
		pcall2.setString(4,LOGICAL_PLANT);
		pcall2.setString(5,WAREHOUSE_NUMBER);
		pcall2.setString(6,PHYSICAL_PLANT);		
		pcall2.setString(7,STORAGE_LOCATION);
		pcall2.setString(8,STORAGE_TYPE);
		pcall2.setString(9,STORAGE_BIN);
		pcall2.setInteger(10,seq);
		pcall2.setInteger(11,position);		
		
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
		ITEM = lib.processData(data[i].ITEM);
		LOGICAL_PLANT = lib.processData(data[i].LOGICAL_PLANT);
		WAREHOUSE_NUMBER = lib.processData(data[i].WAREHOUSE_NUMBER);
		PHYSICAL_PLANT = lib.processData(data[i].PHYSICAL_PLANT);
		STORAGE_LOCATION = lib.processData(data[i].STORAGE_LOCATION);
		STORAGE_TYPE = lib.processData(data[i].STORAGE_TYPE);
		STORAGE_BIN = lib.processData(data[i].STORAGE_BIN);

		position = i+1;
		
		if(ITEM === undefined || LOGICAL_PLANT === undefined ||  WAREHOUSE_NUMBER=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(PHYSICAL_PLANT === undefined || STORAGE_LOCATION === undefined ||STORAGE_TYPE=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(STORAGE_BIN === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(ITEM.length>40)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
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
		if(WAREHOUSE_NUMBER.length>40)
		{
				error_message='WAREHOUSE_NUMBER::The length of "WAREHOUSE_NUMBER" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(PHYSICAL_PLANT.length>40)
		{
			error_message='PHYSICAL_PLANT::The length of "PHYSICAL_PLANT" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(STORAGE_LOCATION.length>40)
		{
				error_message='STORAGE_LOCATION::The length of "STORAGE_LOCATION" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(STORAGE_TYPE.length>40)
		{
			error_message='STORAGE_TYPE::The length of "STORAGE_TYPE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(STORAGE_BIN.length>40)
		{
			error_message='STORAGE_BIN::The length of "STORAGE_BIN" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		
//		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_control_cycle"'
//		    + '(\''
//		    
//		    + ITEM+'\',\''
//		    + LOGICAL_PLANT+'\',\''
//		    + WAREHOUSE_NUMBER+'\',\''
//		    + PHYSICAL_PLANT+'\',\''
//		    + STORAGE_LOCATION+'\',\''
//		    + STORAGE_TYPE+'\',\''
//		    + STORAGE_BIN+'\',\''
//		    
//		    + fileName+'\','
//		    + seq+','
//		    + position
//		    + ')';
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_control_cycle"(?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,ITEM);
			pcall.setString(2,LOGICAL_PLANT);
			pcall.setString(3,WAREHOUSE_NUMBER);
			pcall.setString(4,PHYSICAL_PLANT);		
			pcall.setString(5,STORAGE_LOCATION);
			pcall.setString(6,STORAGE_TYPE);
			pcall.setString(7,STORAGE_BIN);
			pcall.setString(8,fileName);
			pcall.setInteger(9,seq);
			pcall.setInteger(10,position);
			
			pcall.execute();
			pcall.close();
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

	conn.close();
	$.response.setBody(body);
	$.response.contentType = "application/json; charset=UTF-8";
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}

