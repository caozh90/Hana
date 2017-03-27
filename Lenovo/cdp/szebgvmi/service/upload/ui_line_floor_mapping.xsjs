var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'destinationmapping::uploadable';

var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var DS_LINE;
var PHYSICAL_PLANT;
var FLOOR;

var position =0;
var i = 0;

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
	
/*	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_line_floor_mapping_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''

		+ DS_LINE+'\',\''
		+ PHYSICAL_PLANT+'\',\''
		+ FLOOR+'\','

		+seq+','
		+position
		+')';*/
	
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_line_floor_mapping_err"(?,?,?,?,?,?,?)';
	
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,DS_LINE);
		pcall2.setString(4,PHYSICAL_PLANT);
		pcall2.setString(5,FLOOR);
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
		
		DS_LINE = processData(data[i].DS_LINE);
		PHYSICAL_PLANT = processData(data[i].PHYSICAL_PLANT);
		FLOOR = processData(data[i].FLOOR);

		position = i+1;
		
		if(DS_LINE === undefined ||PHYSICAL_PLANT === undefined ||FLOOR === undefined)
		{
				error_message='not enough values';
				exception_process();
				continue;
		}
		
		if(DS_LINE.length>200)
		{
				error_message='DS_LINE::The length of "DS_LINE" is too large(no more than 200)';
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
		if(FLOOR.length>20)
		{
				error_message='FLOOR::The length of "FLOOR" is too large(no more than 20)';
				position = i+1;
				exception_process();
				continue;
		}

		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_line_floor_mapping"'
		    + '(\''
		    
		    + DS_LINE+'\',\''
		    + PHYSICAL_PLANT+'\',\''
		    + FLOOR+'\',\''
		    
//		    + tableName+'\',\''
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';
		
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_line_floor_mapping"(?,?,?,?,?,?)';
		
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,DS_LINE);
			pcall.setString(2,PHYSICAL_PLANT);
			pcall.setString(3,FLOOR);
			pcall.setString(4,fileName);
			pcall.setInteger(5,seq);
			pcall.setInteger(6,position);
			
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
