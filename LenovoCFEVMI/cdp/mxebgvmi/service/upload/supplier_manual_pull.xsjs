var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.mxebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.mxebgvmi.service.upload.uploadLib;
var role = 'pullfromsupplier::uploadable';

var tableName = 'UI_MANUAL_PULL';
//var columns = json.columns;
var data = json.data; 
var fileName = json.filename;
var result="";
var error_message;

var DEST_STORAGE_LOC;
var DEST_STORAGE_TYPE;
var DEST_STORAGE_BIN;
var SRC_WERKS;
var PHYSICAL_PLANT;
var INVENTORY_TYPE = 'SOI';//supplier页面默认'SOI'
var PRODUCTION_LINE;
var HEAD_SUPPLIERID;
var DELIVERY_DATE,temp_DELIVERY_DATE;
var MATNR;
var PULL_QTY;
var SRC_STORAGE_TYPE;
var SRC_STORAGE_BIN;
var SRC_STORAGE_LOC;
var LINE_SUPPLIERID;
var REMARK;
var PULL_TYPE = 'SHIPPING_GROUP'; //在supplier页面，默认为'SHIPPING_GROUP'

var position =0;
var i = 0;
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
	var info_sql = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_manual_pull_err"('
		+'?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,DEST_STORAGE_LOC);
		pcall2.setString(4,DEST_STORAGE_TYPE);
		pcall2.setString(5,DEST_STORAGE_BIN);
		pcall2.setString(6,SRC_WERKS);
		pcall2.setString(7,PHYSICAL_PLANT);
		pcall2.setString(8,INVENTORY_TYPE);
		pcall2.setString(9,PRODUCTION_LINE);
		pcall2.setString(10,HEAD_SUPPLIERID);
		pcall2.setString(11,temp_DELIVERY_DATE);
		pcall2.setString(12,MATNR);
		pcall2.setString(13,PULL_QTY);
		pcall2.setString(14,SRC_STORAGE_TYPE);
		pcall2.setString(15,SRC_STORAGE_BIN);
		pcall2.setString(16,SRC_STORAGE_LOC);
		pcall2.setString(17,LINE_SUPPLIERID);
		pcall2.setString(18,REMARK); 
		pcall2.setInteger(19,seq);
		pcall2.setInteger(20,position);
		
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

var eolDate ;
var hours ;
var minu ;
var sec ;
var query;
var conn = $.db.getConnection();
var pcall;

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
		//var json_entry = JSON.stringify(data[i]);
		DEST_STORAGE_LOC = processData(data[i].DEST_STORAGE_LOC);
		DEST_STORAGE_TYPE = processData(data[i].DEST_STORAGE_TYPE);
		DEST_STORAGE_BIN = processData(data[i].DEST_STORAGE_BIN);
		SRC_WERKS = processData(data[i].SRC_WERKS);
		PHYSICAL_PLANT = processData(data[i].PHYSICAL_PLANT);
		//INVENTORY_TYPE = data[i].INVENTORY_TYPE; supplier页面默认'SOI'
		PRODUCTION_LINE = processData(data[i].PRODUCTION_LINE);
		HEAD_SUPPLIERID = processData(data[i].HEAD_SUPPLIERID);
		DELIVERY_DATE = data[i].DELIVERY_DATE;
		temp_DELIVERY_DATE = DELIVERY_DATE;
		MATNR = processData(data[i].MATNR);
		PULL_QTY = processData(data[i].PULL_QTY);
		SRC_STORAGE_TYPE = processData(data[i].SRC_STORAGE_TYPE);
		SRC_STORAGE_BIN = processData(data[i].SRC_STORAGE_BIN);
		SRC_STORAGE_LOC = processData(data[i].SRC_STORAGE_LOC);
		LINE_SUPPLIERID = processData(data[i].LINE_SUPPLIERID);
		REMARK = processData(data[i].REMARK);

		position = i+1;
		
/*		if(DEST_STORAGE_LOC === undefined ||DEST_STORAGE_TYPE === undefined ||DEST_STORAGE_BIN === undefined ||SRC_WERKS === undefined )
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(PHYSICAL_PLANT === undefined ||INVENTORY_TYPE === undefined ||PRODUCTION_LINE === undefined ||HEAD_SUPPLIERID === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(DELIVERY_DATE === undefined || MATNR === undefined ||PULL_QTY === undefined ||SRC_STORAGE_TYPE === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(SRC_STORAGE_BIN === undefined || SRC_STORAGE_LOC === undefined ||LINE_SUPPLIERID === undefined ||REMARK === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
			
		}
	*/	
		if(DEST_STORAGE_LOC!== undefined && DEST_STORAGE_LOC.length>40)
		{
				error_message='DEST_STORAGE_LOC::The length of "DEST_STORAGE_LOC" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(DEST_STORAGE_TYPE!== undefined && DEST_STORAGE_TYPE.length>40)
		{
			error_message='DEST_STORAGE_TYPE::The length of "DEST_STORAGE_TYPE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(DEST_STORAGE_BIN!== undefined && DEST_STORAGE_BIN.length>40)
		{
				error_message='DEST_STORAGE_BIN::The length of "DEST_STORAGE_BIN" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(SRC_WERKS!== undefined && SRC_WERKS.length>4)
		{
			error_message='SRC_WERKS::The length of "SRC_WERKS" is too large(no more than 4)';
			position = i+1;
			exception_process();
			continue;
		}
		if(PHYSICAL_PLANT!== undefined && PHYSICAL_PLANT.length>40)
		{
				error_message='PHYSICAL_PLANT::The length of "PHYSICAL_PLANT" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(INVENTORY_TYPE!== undefined && INVENTORY_TYPE.length>40)
		{
			error_message='INVENTORY_TYPE::The length of "INVENTORY_TYPE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(PRODUCTION_LINE!== undefined && PRODUCTION_LINE.length>40)
		{
			error_message='PRODUCTION_LINE::The length of "PRODUCTION_LINE" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}

		if(HEAD_SUPPLIERID!== undefined && HEAD_SUPPLIERID.length>10)
		{
				error_message='HEAD_SUPPLIERID::The length of "HEAD_SUPPLIERID" is too large(no more than 10)';
				position = i+1;
				exception_process();
				continue;
		}
		eolDate = new Date(Date.parse(DELIVERY_DATE.replace(/-/g,   "/")));//时间格式确定为yyyy-MM-dd Hi:mm:ss
		if(isNaN(eolDate.getTime())) {
			error_message = 'DELIVERY_DATE::Wrong format of Date';
			//error_message='The length of EOL_STARTDATE is too long(no more than 40)';
			exception_process();
			continue;
		}
		else
		{
			DELIVERY_DATE = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{DELIVERY_DATE += '0'+hours+':';}
			else 
				{DELIVERY_DATE += hours+':';}
			
			if(parseInt(minu,0)<10)
				{DELIVERY_DATE += '0'+minu+':';}
			else
				{DELIVERY_DATE += minu+':';}
			if(parseInt(sec,0) <10)
				{DELIVERY_DATE += '0' + sec;}
			else
				{DELIVERY_DATE += sec;}
			//$.response.setBody("StartTime::"+start_time);
			//start_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		if(MATNR!== undefined && MATNR.length>18)
		{
				error_message='MATNR::The length of "MATNR" is too large(no more than 18)';
				position = i+1;
				exception_process();
				continue;
		}
		if(SRC_STORAGE_TYPE!== undefined && SRC_STORAGE_TYPE.length>40)
		{
			error_message='SRC_STORAGE_TYPE::The length of "SRC_STORAGE_TYPE" is too large(no more than 4)';
			position = i+1;
			exception_process();
			continue;
		}
		if(SRC_STORAGE_BIN!== undefined && SRC_STORAGE_BIN.length>40)
		{
				error_message='SRC_STORAGE_BIN::The length of "SRC_STORAGE_BIN" is too large(no more than 40)';
				position = i+1;
				exception_process();
				continue;
		}
		if(SRC_STORAGE_LOC!== undefined && SRC_STORAGE_LOC.length>40)
		{
			error_message='SRC_STORAGE_LOC::The length of "SRC_STORAGE_LOC" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(LINE_SUPPLIERID!== undefined && LINE_SUPPLIERID.length>40)
		{
			error_message='LINE_SUPPLIERID::The length of "LINE_SUPPLIERID" is too large(no more than 40)';
			position = i+1;
			exception_process();
			continue;
		}
		if(REMARK !== undefined && REMARK.length>250)
		{
			error_message='REMARK::The length of "REMARK" is too large(no more than 250)';
			position = i+1;
			exception_process();
			continue;
		}
		
		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_manual_pull"('
			+'?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,DEST_STORAGE_LOC);
		pcall.setString(2,DEST_STORAGE_TYPE);
		pcall.setString(3,DEST_STORAGE_BIN);
		pcall.setString(4,SRC_WERKS);
		pcall.setString(5,PHYSICAL_PLANT);
		pcall.setString(6,INVENTORY_TYPE);
		pcall.setString(7,PRODUCTION_LINE);
		pcall.setString(8,HEAD_SUPPLIERID);
		pcall.setString(9,DELIVERY_DATE);
		pcall.setString(10,MATNR);
		pcall.setString(11,PULL_QTY);
		pcall.setString(12,SRC_STORAGE_TYPE);
		pcall.setString(13,SRC_STORAGE_BIN);
		pcall.setString(14,SRC_STORAGE_LOC);
		pcall.setString(15,LINE_SUPPLIERID);
		pcall.setString(16,REMARK);
		pcall.setString(17,PULL_TYPE);
		pcall.setString(18,fileName);
		pcall.setInteger(19,seq);
		pcall.setInteger(20,position);
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

	//清空UPLOAD_PULL_HEADER_ID中间表的数据
	query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_manual_pull_delete"()';
	var pcall_delete = conn.prepareCall(query);
	pcall_delete.execute();
	pcall_delete.close();
	conn.commit();
	conn.close();
	$.response.setBody(body);
	$.response.contentType = "application/json; charset=UTF-8";

}
else{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}


