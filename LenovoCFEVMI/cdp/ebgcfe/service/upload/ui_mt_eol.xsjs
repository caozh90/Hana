/**
 *1.8.X86  MtEol designV1.0
 *created by zhaodan1 2016-01-20
 *as requirements changed
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_mt_eol::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_MT_EOL';
var data = json.data;
var fileName = json.filename;
var result="";

//var errorMsg,currencyName,cycle,productGroup,country;
var errorMsg,cycle,productGroup,cto,mt,eolStatus;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;
//validate sql
var result,query_validate,pcall_check,rs_validate;
function checkMachineType ( in_mt){
	try{
		query_validate = 
			"select top 1 * " +
			" from dummy " +
			" where '"+ in_mt + "' in  (" +
						"select  distinct MACHINETYPE "+ 
						"from \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_machine_type/CV_CUR_MACHINE_TYPE\")";
			pcall_check = conn.prepareStatement(query_validate);
			rs_validate = pcall_check.executeQuery();
			rs_validate.next();
			result = rs_validate.getString(1);//get current work step
			
			rs_validate.close();
			pcall_check.close();
	}
	catch(e)
	{
		body = e.message;
		result = e.message;
	}
	
	return result;
	
}
function checkEolStatus ( in_eolStatus){
	try{
		query_validate = 
			"select top 1 * " +
			" from dummy " +
			" where '"+ in_eolStatus + "' in  (" +
						"select distinct EOL_STATUS "+ 
						"from \"_SYS_BIC\".\"cdp.ebgcfe.models.common/CV_PARA_EOL_STATUS\")";
			pcall_check = conn.prepareStatement(query_validate);
			rs_validate = pcall_check.executeQuery();
			rs_validate.next();
			result = rs_validate.getString(1);//get current work step
				
			rs_validate.close();
			pcall_check.close();
	}
	catch(e){
		body = e.message;
		result = e.message;
	}
	
	return result;
	
}


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_mt_eol_err"(?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,errorMsg);
		pcall.setString(2,businessName);
		pcall.setString(3,cycle);
		pcall.setString(4,productGroup);
		pcall.setString(5,mt);
		pcall.setString(6,eolStatus);
		pcall.setInteger(7,businessCode);
		pcall.setInteger(8,position);
		
		pcall.execute();
		pcall.close();
		conn.commit();
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	
}
function handle(){
if(data.length < 1)
{
	$.response.status = $.net.http.BAD_REQUEST;
	body = 'Empty file!';
}

var i =0;

businessCode = lib.getBusinessCode();
for(i=0;i<data.length;i++)
{	
	position =i+1;
	productGroup = 'EBG';//data[i].PRODUCT_GROUP;
	cycle = 'CURRENT';
	if(data[i].MT !== undefined)
	{
		mt = lib.processDataLeadbyZero(data[i].MT);
	}
	
	eolStatus = data[i].EOL_STATUS;

	
	if(mt === undefined || eolStatus ===undefined ) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	
	if (checkMachineType(mt) !== 'X'){
		errorMsg='MT not exist';
		exception_process();
		continue;
	}
	
	if (checkEolStatus(eolStatus) !== 'X'){
		errorMsg='EOL STATUS not exist';
		exception_process();
		continue;
	}
	
		
	query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_mt_eol"(?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);

		pcall.setString(1,cycle);
		pcall.setString(2,productGroup);
		pcall.setString(3,mt);
		pcall.setString(4,eolStatus);
		pcall.setString(5,businessName);
		pcall.setInteger(6,businessCode);
		pcall.setInteger(7,position);
		
		pcall.execute();
		pcall.close();
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	
}
conn.commit();
conn.close();

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(body);
}

if(lib.assertAppRole(role)==='OK'){
	handle();
}else{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}