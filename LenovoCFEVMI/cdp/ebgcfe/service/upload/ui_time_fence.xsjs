$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_time_fence::uploadable';

var json=JSON.parse($.request.body.asString());

//var tableName = json.tablename;
var tableName = 'PM_UI_TIME_FENCE';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var oem_name;
var time_fence;
var function_type;
var time_fence_type;
var profit_center;
var start_date="";
var end_date="";
var created_by;
var created_date="";

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
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_time_fence_err"(?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,oem_name);
		pcall2.setString(4,time_fence);
		pcall2.setString(5,function_type);
		pcall2.setString(6,time_fence_type);
		pcall2.setString(7,profit_center);
		pcall2.setString(8,start_date);
		pcall2.setString(9,end_date);
		pcall2.setInteger(10,created_by);
		pcall2.setInteger(11,created_date);
		pcall2.setInteger(12,seq);
		pcall2.setInteger(13,position);
		
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
		oem_name = lib.processData(data[i].OEM_NAME);
		time_fence = lib.processData(data[i].TIME_FENCE);
		function_type = lib.processData(data[i].FUNCTION_TYPE);
		time_fence_type = lib.processData(data[i].TIME_FENCE_TYPE);
		profit_center = lib.processData(data[i].PROFIT_CENTER);
		start_date = lib.processData(data[i].START_TIME);
		end_date = lib.processData(data[i].END_TIME);
		created_by = lib.processData(data[i].CREATED_BY);
		created_date = lib.processData(data[i].CREATED_DATE);
		
		if(oem_name ===undefined || time_fence===undefined|| function_type === undefined || profit_center === undefined) {
			error_message='not enough values';
			exception_process(position,tableName,error_message,fileName);
			continue;
		}

		/*		eolDate = new Date(Date.parse(data[i].EOL_STARTDATE.replace(/-/g,   "/")));
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
		}*/
		

		query =  'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_time_fence"(?,?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,oem_name);
			pcall.setString(2,time_fence);
			pcall.setString(3,function_type);
			pcall.setString(4,time_fence_type);
			pcall.setString(5,profit_center);
			pcall.setString(6,start_date);
			pcall.setString(7,end_date);
			pcall.setInteger(8,created_by);
			pcall.setInteger(9,created_date);
			pcall.setInteger(10,fileName);
			pcall.setInteger(11,seq);
			pcall.setInteger(12,position);
			
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