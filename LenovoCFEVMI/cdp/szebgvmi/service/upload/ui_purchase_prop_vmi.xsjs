var json=JSON.parse($.request.body.asString());
//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role = 'vmipurchaseproportion::uploadable';

//var tableName = json.tablename;
var tableName = 'UI_PURCHASE_PROP_VMI';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var LOGICAL_PLANT;
var ITEM;
var START_DATE,temp_START_DATE;
var END_DATE,temp_END_DATE;
var VENDORID;
var PROPORTION;

var position =0;
var i;
var conn = $.db.getConnection();
var pcall;
var query;

var hours,minu,sec;
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
	
	var info_sql = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_purchase_prop_vmi_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ITEM +'\',\''
		+VENDORID +'\',\''
		+LOGICAL_PLANT +'\',\''
		+PROPORTION+'\',\''
		+temp_START_DATE+'\',\''
		+temp_END_DATE+'\','

		+seq+','
		+position
		+')';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
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
		ITEM = processData(data[i].ITEM);
		START_DATE = data[i].START_DATE;
		temp_START_DATE = START_DATE;
		END_DATE = data[i].END_DATE;
		temp_END_DATE = END_DATE;
		VENDORID = processData(data[i].VENDORID);
		PROPORTION = processData(data[i].PROPORTION);

		position = i+1;
		
		if(LOGICAL_PLANT === undefined || ITEM === undefined || PROPORTION === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(START_DATE === undefined || END_DATE === undefined ||VENDORID=== undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		eolDate = new Date(Date.parse(data[i].START_DATE.replace(/-/g,   "/")));//时间格式确定为yyyy-MM-dd Hi:mm:ss
		if(isNaN(eolDate.getTime())) {
			error_message = 'START_DATE::Wrong format of Time';
			//error_message='The length of EOL_STARTDATE is too long(no more than 40)';
			exception_process();
			continue;
		}
		else
		{
			START_DATE = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{START_DATE += '0'+hours+':';}
			else 
				{START_DATE += hours+':';}
			
			if(parseInt(minu,0)<10)
				{START_DATE += '0'+minu+':';}
			else
				{START_DATE += minu+':';}
			
			if(parseInt(sec,0) <10)
				{START_DATE += '0' + sec;}
			else
				{START_DATE += sec;}
			//$.response.setBody("StartTime::"+start_time);
			//start_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		eolDate = new Date(Date.parse(data[i].END_DATE.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'END_DATE::Wrong format of DATE';
			exception_process();
			continue;
		}
		else
		{
			END_DATE = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			hours = eolDate.getHours();
			minu = eolDate.getMinutes();
			sec = eolDate.getSeconds();
			if(parseInt(hours,0)<10)
				{END_DATE += '0'+hours+':';}
			else 
				{END_DATE += hours+':';}
			
			if(parseInt(minu,0)<10)
				{END_DATE += '0'+minu+':';}
			else
				{END_DATE += minu+':';}
			
			if(parseInt(sec,0) <10)
				{END_DATE += '0' + sec;}
			else
				{END_DATE += sec;}
			//end_time += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		if(data[i].START_DATE>data[i].END_DATE )
		{
			error_message = 'TIME::start should be earlier than end';
			exception_process();
			continue;
		}
		
		if(LOGICAL_PLANT.length>40)
		{
				error_message='LOGICAL_PLANT::The length of "LOGICAL_PLANT" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(ITEM.length>40)
		{
			error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
			exception_process();
			continue;
		}
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_purchase_prop_vmi"'
		    + '(\''
			+ITEM +'\',\''
			+VENDORID +'\',\''
			+LOGICAL_PLANT +'\',\''
			+PROPORTION+'\',\''
			+START_DATE+'\',\''
			+END_DATE+'\',\''
			
		    + fileName+'\','
		    + seq +','
		    + position
		    + ')';
		body = "HAHA::"+query;
		try
		{
			pcall = conn.prepareCall(query);
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

	//从buffer表中插入到UI_PURCHASE_PROP_VMI，并验证proportion的加和
	//query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::validationProportion"'
	query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::validationProportion2"'
	    + '(\''
		+ seq +'\',\''
		+ fileName+'\''
		+')';
	var pcall_delete = conn.prepareCall(query);
	pcall_delete.execute();
	pcall_delete.close();
	conn.commit();

	conn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}