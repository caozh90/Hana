var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'urgentmomaintaince::uploadable';

//var tableName = json.tablename;
var tableName = 'UI_URGENT_MO_PULL';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var logical_plant;
var mo_id;
var status;
var ds_line;
var bom_name;
var quantity;
var start_time,start_time;
var end_time,end_time;
var planned_start_time;
var planned_end_time;
var sys_source = 'UI'; // SYS_SOURCE默认的是"UI"

var position =0;
var i;
var conn = $.db.getConnection();
var pcall;
var query;
var hours ;
var minu ;
var sec ;

var eolDate;
var body;

var pcall_seq;
var seq;//upload seq
function processData(data){
	if(data !== undefined && data !== null)
	{
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}else{
			data = "";
		}
	}
	return data;
}
function exception_process()
{
	
/*	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_urgent_mo_pull_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+logical_plant+'\',\''
		+mo_id+'\',\''
		+status+'\',\''
		+ds_line+'\',\''
		+bom_name+'\','
		+quantity+',\''
		+temp_start_time+'\',\''
		+temp_end_time+'\',\''
		+temp_planned_start_time+'\',\''
		+temp_planned_end_time+'\',\''
		+sys_source+'\','

		+seq+','
		+position
		+')';
		*/
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_urgent_mo_pull_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,logical_plant);
		pcall2.setString(4,mo_id);
		pcall2.setString(5,status);
		pcall2.setString(6,ds_line);
		pcall2.setString(7,bom_name);
		pcall2.setString(8,quantity);
		pcall2.setString(9,start_time);
		pcall2.setString(10,end_time);
		pcall2.setString(11,planned_start_time);
		pcall2.setString(12,planned_end_time);
		pcall2.setString(13,sys_source);
		pcall2.setInteger(14,seq);
		pcall2.setInteger(15,position);
		
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
		logical_plant = processData(data[i].LOGICAL_PLANT);
		mo_id = processData(data[i].MO_ID);
		status = processData(data[i].STATUS);
		ds_line = processData(data[i].DS_LINE);
		bom_name = processData(data[i].BOM_NAME);
		quantity = data[i].QUANTITY;
		start_time = data[i].START_TIME;
		end_time = data[i].END_TIME;
		planned_start_time = data[i].PLANNED_START_TIME;
		planned_end_time = data[i].PLANNED_END_TIME;

		position = i+1;
		
		if(logical_plant === undefined || mo_id === undefined ||  quantity=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(ds_line === undefined || bom_name === undefined ||planned_end_time=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(start_time === undefined || end_time === undefined || planned_start_time=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(status=== undefined || status.length<=0 )//设定status默认值
		{
			status = 'DRAFT';
		}
		
		
		eolDate = new Date(Date.parse(data[i].START_TIME.replace(/-/g,   "/")));//时间格式确定为yyyy-MM-dd Hi:mm:ss
		
		
		if(isNaN(eolDate.getTime())) {
			error_message = 'START_TIME::Wrong format of Time';
			//error_message='The length of EOL_STARTDATE is too long(no more than 40)';
			exception_process();
			continue;
		}
		else
		{
			start_time = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{start_time += '0'+hours+':';}
			else 
				{start_time += hours+':';}
			
			if(parseInt(minu,0)<10)
				{start_time += '0'+minu+':';}
			else
				{start_time += minu+':';}
			
			if(parseInt(sec,0) <10)
				{start_time += '0' + sec;}
			else
				{start_time += sec;}
			//$.response.setBody("StartTime::"+start_time);
			//start_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		eolDate = new Date(Date.parse(data[i].END_TIME.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'END_TIME::Wrong format of time';
			exception_process();
			continue;
		}
		else
		{
			end_time = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{end_time += '0'+hours+':';}
			else 
				{end_time += hours+':';}
			
			if(parseInt(minu,0)<10)
				{end_time += '0'+minu+':';}
			else
				{end_time += minu+':';}
			
			if(parseInt(sec,0) <10)
				{end_time += '0' + sec;}
			else
				{end_time += sec;}
			//end_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}

		eolDate = new Date(Date.parse(data[i].PLANNED_START_TIME.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'PLANNED_START_TIME::Wrong format of time';
			exception_process();
			continue;
		}
		else
		{
			planned_start_time = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{planned_start_time += '0'+hours+':';}
			else 
				{planned_start_time += hours+':';}
			
			if(parseInt(minu,0)<10)
				{planned_start_time += '0'+minu+':';}
			else
				{planned_start_time += minu+':';}
			
			if(parseInt(sec,0) <10)
				{planned_start_time += '0' + sec;}
			else
				{planned_start_time += sec;}
			
			//planned_start_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		eolDate = new Date(Date.parse(data[i].PLANNED_END_TIME.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'PLANNED_END_TIME::Wrong format of time';
			exception_process();
			continue;
		}
		else
		{
			planned_end_time = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{planned_end_time += '0'+hours+':';}
			else 
				{planned_end_time += hours+':';}
			
			if(parseInt(minu,0)<10)
				{planned_end_time += '0'+minu+':';}
			else
				{planned_end_time += minu+':';}
			
			if(parseInt(sec,0) <10)
				{planned_end_time += '0' + sec;}
			else
				{planned_end_time += sec;}
			
		//	planned_end_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		if(data[i].START_TIME>data[i].END_TIME || data[i].PLANNED_START_TIME > data[i].PLANNED_END_TIME)
		{
			error_message = 'TIME::start should be earlier than end';
			exception_process();
			continue;
		}
		
		if(logical_plant.length>40)
		{
				error_message='LOGICAL_PLANT::The length of "LOGICAL_PLANT" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(mo_id.length>40)
		{
			error_message='MO_ID::The length of "MO_ID" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(status.length>40)
		{
			error_message='STATUS::The length of "STATUS" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(ds_line.length>200)
		{
			error_message='DS_LINE::The length of "DS_LINE" is too large(no more than 200)';
			exception_process();
			continue;
		}
		if(bom_name.length>40)
		{
			error_message='BOM_NAME::The length of "BOM_NAME" is too large(no more than 40)';
			exception_process();
			continue;
		}

		
		
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_urgent_mo_pull"'
		    + '(\''
			+logical_plant+'\',\''
			+mo_id+'\',\''
			+status+'\',\''
			+ds_line+'\',\''
			+bom_name+'\','
			+quantity+',\''
			+start_time+'\',\''
			+end_time+'\',\''
			+planned_start_time+'\',\''
			+planned_end_time+'\',\''
			+sys_source+'\',\''
			
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_urgent_mo_pull"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,logical_plant);
			pcall.setString(2,mo_id);
			pcall.setString(3,status);
			pcall.setString(4,ds_line);
			pcall.setString(5,bom_name);
			pcall.setString(6,quantity);
			pcall.setString(7,start_time);
			pcall.setString(8,end_time);
			pcall.setString(9,planned_start_time);
			pcall.setString(10,planned_end_time);
			pcall.setString(11,sys_source);
			pcall.setString(12,fileName);
			pcall.setInteger(13,seq);
			pcall.setInteger(14,position);
			
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