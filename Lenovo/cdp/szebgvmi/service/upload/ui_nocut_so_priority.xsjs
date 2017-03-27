
var json=JSON.parse($.request.body.asString());

//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'nocutsopriority::uploadable';

//var tableName = json.tablename;
//var tableName = 'ui_manual_pull';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var LOGICAL_PLANT;
var DELIVERY_PRIORITY;

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
	
/*	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_nocut_so_priority_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ LOGICAL_PLANT+'\','
		+ DELIVERY_PRIORITY+','
		
		+seq+','
		+position
		+')'; */
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_nocut_so_priority_err"(?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,LOGICAL_PLANT);
		pcall2.setString(4,DELIVERY_PRIORITY);
		pcall2.setInteger(5,seq);
		pcall2.setInteger(6,position);
		
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
		LOGICAL_PLANT = processData(data[i].LOGICAL_PLANT);
		DELIVERY_PRIORITY = processData(data[i].DELIVERY_PRIORITY);

		position = i+1;
		
		if(LOGICAL_PLANT === undefined ||DELIVERY_PRIORITY === undefined)
		{
			error_message='not enough values';
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
		
//		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_nocut_so_priority"'
//		    + '(\''
//		    
//			+ LOGICAL_PLANT+'\','
//			+ DELIVERY_PRIORITY+',\''
//		    
//		    + fileName+'\','
//		    + seq+','
//		    + position
//		    + ')';
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_nocut_so_priority"(?,?,?,?,?)';
		
		//query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::test"(?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,LOGICAL_PLANT);
			pcall.setString(2,DELIVERY_PRIORITY);
			pcall.setString(3,fileName);
			pcall.setInteger(4,seq);
			pcall.setInteger(5,position);
						
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