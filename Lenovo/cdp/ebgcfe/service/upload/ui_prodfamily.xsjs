/**
 * 1.2.X86 Brand-Family mapping UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_prodfamily::uploadable';

var json=JSON.parse($.request.body.asString());

//var tableName = json.tablename;
var tableName = 'UI_PRODFAMILY';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var brand;
var prodfamily;
var product_group='EBG';
var eol_status;
var eol_startdate="";
var eol_enddate="";
var temp_startdate;
var temp_enddate;
var eolDate;

var position;
var delta;
var conn = $.db.getConnection();
var pcall;
var query;
var cycle;

var body;
var pcall_seq;
var seq;//upload seq

function exception_process()
{
	
/*	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_prodfamily_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''

		+cycle+'\',\''
		+product_group+'\',\''
		+brand+'\',\''
		+prodfamily+'\',\''
		+eol_status+'\',\''
		+temp_startdate+'\',\''
		+temp_enddate+'\','
		+seq+','
		+position
		+')';*/
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_prodfamily_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,cycle);
		pcall2.setString(4,product_group);
		pcall2.setString(5,brand);
		pcall2.setString(6,prodfamily);
		pcall2.setString(7,eol_status);
		pcall2.setString(8,temp_startdate);
		pcall2.setString(9,temp_enddate);
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
		query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	var i=0;
	for(i=0;i<data.length;i++)
	{
		//var json_entry = JSON.stringify(data[i]);
		delta = 0;
		if(i===0)
		{
			delta = 1;
		}
		else
		{
			delta =0;
		}
		position =i+1;
		brand = lib.processData(data[i].BRAND);
		prodfamily = lib.processData(data[i].PROD_FAMILY);
		
		eol_status = lib.processData(data[i].EOL_STATUS);
		
		temp_startdate = lib.processData(data[i].EOL_STARTDATE);
		temp_enddate = lib.processData(data[i].EOL_ENDDATE);
		cycle = 'CURRENT';
		
		if(eol_status ===undefined || brand===undefined|| cycle === undefined) {
			error_message='not enough values';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}
		else if(prodfamily=== undefined|| temp_startdate === undefined || temp_enddate ===undefined)
		{
			error_message='not enough values';
			exception_process(position,tableName,error_message,fileName);
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
			error_message = 'EOL_STARTDATE::Wrong format of Date';
			//error_message='The length of EOL_STARTDATE is too long(no more than 40)';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}
		else
		{
			eol_startdate = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			eol_startdate += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
			//result += eol_startdate+"\n";
		}
		eolDate = new Date(Date.parse(data[i].EOL_ENDDATE.replace(/-/g,   "/")));
		if(isNaN(eolDate.getTime())) {
			error_message = 'EOL_ENDDATE::Wrong format of Date';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}
		else
		{
			eol_enddate = eolDate.getFullYear() + "-" + (eolDate.getMonth() + 1) + "-" + eolDate.getDate()+" ";
			eol_enddate += eolDate.getHours()+":"+eolDate.getMinutes()+":"+eolDate.getSeconds();
		}
		
		if(brand.length>40)
		{
				error_message='BRAND::The length of "BRAND" is too large(no more than 40)';
				exception_process(position,tableName,error_message,fileName);
				continue;
		}
		if(prodfamily.length>100)
		{
			error_message='PROD_FAMILY::The length of "PROD_FAMILY" is too large(no more than 100)';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}
		if(eol_status.length>10)
		{
			error_message='EOL_STATUS::The length of "EOL_STATUS" is too large(no more than 10)';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}
		
	/*	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_prodfamily"'
		    + '(\''
		    
			+ cycle+'\',\''
			+ brand+'\',\''
			+ prodfamily+'\',\''
			+ eol_status+'\',\''
		    + eol_startdate + '\',\''
		    + eol_enddate+'\',\''
		    
		    + fileName+'\','
		    + seq+','
		    + position
		    + ')';*/

		query =  'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_prodfamily"(?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,cycle);
			pcall.setString(2,brand);
			pcall.setString(3,prodfamily);
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