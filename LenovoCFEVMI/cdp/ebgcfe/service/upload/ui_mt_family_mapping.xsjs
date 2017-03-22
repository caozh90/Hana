/**
 * 1.4.X86  Manual BOM UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_machine_type::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_MACHINETYPE';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,prodFamily,machineType,position,brand;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_mt_family_mapping_err"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,prodFamily);
		pcall.setString(3,machineType);
		pcall.setString(4,tableName);
		pcall.setString(5,businessName);
		pcall.setInteger(6,businessCode);
		pcall.setInteger(7,position);
		pcall.setString(8,errorMsg);
		pcall.setString(9,cycle);
		pcall.setString(10,brand);
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
	brand = lib.processData(data[i].BRAND);
	productGroup = 'EBG';
	prodFamily = lib.processData(data[i].PROD_FAMILY);
	machineType = lib.processData(data[i].MACHINETYPE);
	cycle = 'CURRENT';
	
	if(prodFamily ===undefined || machineType===undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(brand.length>40)
	{
			errorMsg='BRAND::The length of "BRAND" is too large(no more than 40)';
			exception_process();
			continue;
	}
	if(prodFamily.length>100)
	{
		errorMsg='PROD_FAMILY::The length of "PROD_FAMILY" is too large(no more than 100)';
		exception_process();
		continue;
	}
	if(machineType.length>40)
	{
		errorMsg='MACHINETYPE::The length of "MACHINETYPE" is too large(no more than 40)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_mt_family_mapping"(?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,prodFamily);
		pcall.setString(3,machineType);
		pcall.setString(4,tableName);
		pcall.setString(5,businessName);
		pcall.setInteger(6,businessCode);
		pcall.setInteger(7,position);	
		pcall.setString(8,cycle);
		pcall.setString(9,brand);
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