/**
 * 1.1.X86 Material Master UI DesignV1.1
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_item::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_ITEM';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var item;
var item_desc;
var eol_status;
var eol_startdate="";
var eol_enddate="";
var temp_startdate;
var temp_enddate;
var eolDate;
var position;
var delta;
var conn=$.db.getConnection();
var pcall;
var query;
var cycle;

var body;
var pcall_seq;
var seq;//upload seq

function exception_process()
{
	
/*	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_item_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		+cycle+'\',\''
		+item+'\',\''
		+item_desc+'\',\''
		+eol_status+'\',\''
		+temp_startdate+'\',\''
		+temp_enddate+'\','
		+seq+','
		+position
		+')';
	*/
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_item_err"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var conn2 = $.db.getConnection();
		var pcall2 = conn2.prepareCall(info_sql);
		
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,cycle);
		pcall2.setString(4,item);
		pcall2.setString(5,item_desc);
		pcall2.setString(6,eol_status);
		pcall2.setString(7,temp_startdate);
		pcall2.setString(8,temp_enddate);
		pcall2.setInteger(9,seq);
		pcall2.setInteger(10,position);
		
		pcall2.execute();
		pcall2.close();
		conn2.commit();
		conn2.close();
		$.response.status = $.net.http.OK;
		body = 'Finished! You can check the result on HANA';
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
		query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	var i =0;
	for(i=0;i<data.length;i++)
	{
		
		position =i+1;
		item = lib.processData(data[i].ITEM);
		item_desc = lib.processData(data[i].ITEM_DESC);
		eol_status = lib.processData(data[i].EOL_STATUS);
		temp_startdate = lib.processData(data[i].EOL_STARTDATE);
		temp_enddate = lib.processData(data[i].EOL_ENDDATE);
		cycle = 'CURRENT';
		
		if(eol_status ===undefined || item===undefined||cycle === undefined) {
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(item_desc=== undefined|| temp_startdate === undefined || temp_enddate ===undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(cycle.length>40)
		{
				error_message='CYCLE::The length of "CYCLE" is too large(no more than 40)';
				exception_process();
				continue;
		}
		
		if(cycle.toLowerCase() !== 'current'){
			error_message='CYCLE must be "CURRENT or "current"';
			exception_process();
			continue;
		}

		eolDate = new Date(Date.parse(data[i].EOL_STARTDATE.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'EOL_STARTDATE::Wrong format of Date::'+temp_startdate;
			//error_message='The length of EOL_STARTDATE is too long(no more than 40)';
			exception_process();
			continue;
		}
		else
		{
			eol_startdate = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			eol_startdate += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
			//result += eol_startdate+"\n";
		}
		//eolDate = new Date(data[i].EOL_ENDDATE);
		eolDate = new Date(Date.parse(data[i].EOL_ENDDATE.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'EOL_ENDDATE::Wrong format of Date'+temp_enddate;
			exception_process();
			continue;
		}
		else
		{
			eol_enddate = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			eol_enddate += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		if(item.length>40)
		{
				error_message='ITEM::The length of "item" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(item_desc.length>200)
		{
			error_message='ITEM_DESC::The length of "ITEM_DESC" is too large(no more than 200)';
			exception_process();
			continue;
		}
		if(eol_status.length>10)
		{
			error_message='EOL_STATUS::The length of "EOL_STATUS" is too large(no more than 10)';
			exception_process();
			continue;
		}

			
/*		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_item"'
		    + '(\''
			+cycle+'\',\''
			+item+'\',\''
			+item_desc+'\',\''
			+eol_status+'\',\''
			+eol_startdate+'\',\''
			+eol_enddate+'\',\''
			
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';
	*/	
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_item"(?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			
			pcall.setString(1,cycle);
			pcall.setString(2,item);
			pcall.setString(3,item_desc);
			pcall.setString(4,eol_status);
			pcall.setString(5,eol_startdate);
			pcall.setString(6,eol_enddate);
			pcall.setString(7,fileName);
			pcall.setInteger(8,seq);
			pcall.setInteger(9,position);
			
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
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}