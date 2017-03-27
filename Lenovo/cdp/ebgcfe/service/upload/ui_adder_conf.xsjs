/****
 * 4.7 X86 Adder Configuration UI Design
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_adder_conf::uploadable';

var json=JSON.parse($.request.body.asString());

//var tableName = json.tablename;
var tableName = 'UI_ADDER_CONF';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE;
var ADDER_NAME;
var ADDER_DESC;
var ASP_PROD_FAMILY;

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

var index;
var length;

function exception_process()
{
	
/*	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_adder_conf_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ CYCLE+'\',\''
		+ ADDER_NAME+'\',\''
		+ ADDER_DESC+'\',\''
		+ ASP_PROD_FAMILY+'\',\''
		
	    + seq +'\','
		+position
		+')';	*/
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_adder_conf_err"(?,?,?,?,?,?,?,?)';
	try 
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,CYCLE);
		pcall2.setString(4,ADDER_NAME);
		pcall2.setString(5,ADDER_DESC);
		pcall2.setString(6,ASP_PROD_FAMILY);
		pcall2.setInteger(7,seq);
		pcall2.setInteger(8,position);
		
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

	for(i=0;i<data.length;i++)
	{
		CYCLE = 'CURRENT';
		ADDER_NAME = lib.processData(data[i].ADDER_NAME);
		ADDER_DESC = lib.processData(data[i].ADDER_DESC);
		ASP_PROD_FAMILY = lib.processData(data[i].ASP_PROD_FAMILY);

		position = i+1;
		
		if(ADDER_NAME === undefined ||ADDER_DESC === undefined ||ASP_PROD_FAMILY === undefined || CYCLE === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(CYCLE.length>40)
		{
			error_message='CYCLE::The length of "CYCLE" is too large(no more than 40)';
			exception_process();
			continue;
		}
		
		if(CYCLE.toLowerCase() !== 'current'){
			error_message='CYCLE must be "CURRENT or "current"';
			exception_process();
			continue;
		}

		if(ADDER_NAME.length>40)
		{
			error_message='ADDER_NAME::The length of "ADDER_NAME" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(ADDER_DESC.length>200)
		{
			error_message='ADDER_DESC::The length of "ADDER_DESC" is too large(no more than 200)';
			exception_process();
			continue;
		}
		if(ASP_PROD_FAMILY.length>40)
		{
			error_message='ASP_PROD_FAMILY::The length of "ASP_PROD_FAMILY" is too large(no more than 40)';
			exception_process();
			continue;
		}
		
		/*query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_adder_conf"'
		    + '(\''
		    
		    + CYCLE+'\',\''
		    + ADDER_NAME+'\',\''
		    + ADDER_DESC+'\',\''
		    + ASP_PROD_FAMILY+'\',\''
			
		    + fileName+'\',\''
		    + seq +'\','
		    + position
		    + ')';*/
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_adder_conf"(?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,CYCLE);
			pcall.setString(2,ADDER_NAME);
			pcall.setString(3,ADDER_DESC);
			pcall.setString(4,ASP_PROD_FAMILY);
			pcall.setString(5,fileName);
			pcall.setInteger(6,seq);
			pcall.setInteger(7,position);
			
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