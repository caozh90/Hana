var json=JSON.parse($.request.body.asString());

//import 验证逻辑
$.import('cdp.mxebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.mxebgvmi.service.upload.uploadLib;
var role = 'fullboxsize::uploadable';

var tableName = 'UI_ITEM_FULL_BOX';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var conn = $.db.getConnection();
var pcall;
var query;

var i;

var position =0;
var item;
var vendorid ;
var box_size ;
var body;

var pcall_seq;
var seq;//upload seq

function processData(data){
	if(data !== undefined)
	{
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}
	}
	return data;
}
function exception_process()
{
	
/*	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_item_full_box_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		+item+'\',\''
		+vendorid+'\',\''
		+box_size+'\','
		+seq+','
		+position
		+')';*/
	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_item_full_box_err"(?,?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,item);
		pcall2.setString(4,vendorid);
		pcall2.setString(5,box_size);
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
		query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	for(i=0;i<data.length;i++)
	{
		item = processData(data[i].ITEM);
		vendorid = processData(data[i].VENDORID);
		box_size = data[i].BOX_SIZE;

		position = i+1;
		
		if(item === undefined || vendorid === undefined || box_size=== undefined)
		{
			error_message='not enough values';
			exception_process();//position,tableName,error_message,fileName);
			continue;
		}
		
		
		if(item.length>40)
		{
			error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
			exception_process();//position,tableName,error_message,fileName);
			continue;
		}
		if(vendorid.length>40)
		{
			error_message='ITEM_DESC::The length of "VENDORID" is too large(no more than 40)';
			exception_process();//position,tableName,error_message,fileName);
			continue;
		}
/*		
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_item_full_box"'
		    + '(\''
		    + item + '\',\''
		    + vendorid + '\',\''
		    + box_size + '\',\''

		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';*/
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_item_full_box"(?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,item);
			pcall.setString(2,vendorid);
			pcall.setString(3,box_size);
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
