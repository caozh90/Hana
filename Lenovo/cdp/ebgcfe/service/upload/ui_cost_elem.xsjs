/**
 * 3.1.X86 Cost Elem UI designV1.1
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_cost_elem::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_COST_ELEM';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,elementName,elementType,aspProdFamily,tote,totl;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cost_elem_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,elementName);
		pcall.setString(2,elementType);
		pcall.setString(3,aspProdFamily);
		pcall.setString(4,tote);
		pcall.setString(5,totl);
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
	elementName = lib.processData(data[i].ELEMENT_NAME);
	elementType = lib.processData(data[i].ELEMENT_TYPE);
//	desc = data[i].DESC;
	aspProdFamily = lib.processData(data[i].ASP_PROD_FAMILY);
	tote = lib.processData(data[i].TOTE);
	totl = lib.processData(data[i].TOTL);
	cycle = lib.processData('CURRENT');
	
	if(elementName === undefined || elementType ===undefined 
			|| aspProdFamily ===undefined ||  tote === undefined || totl === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(elementName.length>40)
	{
			errorMsg='ELEMENT_NAME::The length of "ELEMENT_NAME" is too large(no more than 40)';
			exception_process();
			continue;
	}
//	if(desc.length>200)
//	{
//		errorMsg='DESC::The length of "DESC" is too large(no more than 200)';
//		exception_process();
//		continue;
//	}
	
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_cost_elem"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,elementName);
		pcall.setString(2,elementType);
		pcall.setString(3,aspProdFamily);
		pcall.setString(4,tote);
		pcall.setString(5,totl);
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