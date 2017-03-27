/**
 * 2.3.X86 Source of Supply UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_sos::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_SOS';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,produceGroup,prodFamily,plant,subgeo,brand,eolStatus;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_source_of_supply_err"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,produceGroup);
		pcall.setString(2,prodFamily);
		pcall.setString(3,plant);
		pcall.setString(4,subgeo);
		pcall.setString(5,brand);
		pcall.setString(6,eolStatus);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		pcall.setString(11,errorMsg);
		pcall.setString(12,cycle);
		
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
	produceGroup = 'EBG';//data[i].PRODUCT_GROUP;
	plant = lib.processData(data[i].PLANT);
	subgeo = lib.processData(data[i].SUBGEO);
	eolStatus = lib.processData(data[i].EOL_STATUS);
	brand = lib.processData(data[i].BRAND);
	prodFamily = lib.processData(data[i].PROD_FAMILY);
	cycle = 'CURRENT';
	
	if(brand === undefined || prodFamily ===undefined || plant===undefined
			|| subgeo ===undefined || eolStatus === undefined) {
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
	if(plant.length>30)
	{
		errorMsg='PLANT::The length of "PLANT" is too large(no more than 30)';
		exception_process();
		continue;
	}
	if(subgeo.length>20)
	{
		errorMsg='SUBGEO::The length of "SUBGEO" is too large(no more than 20)';
		exception_process();
		continue;
	}
	if(eolStatus.length>20)
	{
		errorMsg='EOL_STATUS::The length of "EOL_STATUS" is too large(no more than 20)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_source_of_supply"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,produceGroup);
		pcall.setString(2,prodFamily);
		pcall.setString(3,plant);
		pcall.setString(4,subgeo);
		pcall.setString(5,brand);
		pcall.setString(6,eolStatus);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		pcall.setString(11,cycle);
		
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