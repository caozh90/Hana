/**
 * 2.6.X86  Region UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_region::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_REGION';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,geo,subgeo,country,countryName;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_region_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,geo);
		pcall.setString(3,subgeo);
		pcall.setString(4,country);
		pcall.setString(5,countryName);
		pcall.setString(6,tableName);
		pcall.setString(7,businessName);
		pcall.setInteger(8,businessCode);
		pcall.setInteger(9,position);
		pcall.setString(10,errorMsg);
		pcall.setString(11,cycle);
		
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
	geo = lib.processData(data[i].GEO);
	subgeo = lib.processData(data[i].SUBGEO);
	country = lib.processData(data[i].COUNTRY);
	countryName = lib.processData(data[i].COUNTRY_NAME);
	cycle = 'CURRENT';
	
	if(geo === undefined || subgeo ===undefined || country===undefined
			|| countryName ===undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(geo.length>40)
	{
			errorMsg='GEO::The length of "GEO" is too large(no more than 40)';
			exception_process();
			continue;
	}
	if(subgeo.length>20)
	{
		errorMsg='SUBGEO::The length of "SUBGEO" is too large(no more than 20)';
		exception_process();
		continue;
	}
	if(countryName.length>40)
	{
		errorMsg='COUNTRY_NAME::The length of "COUNTRY_NAME" is too large(no more than 40)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_region"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,geo);
		pcall.setString(3,subgeo);
		pcall.setString(4,country);
		pcall.setString(5,countryName);
		pcall.setString(6,tableName);
		pcall.setString(7,businessName);
		pcall.setInteger(8,businessCode);
		pcall.setInteger(9,position);
		pcall.setString(10,cycle);
		
		
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