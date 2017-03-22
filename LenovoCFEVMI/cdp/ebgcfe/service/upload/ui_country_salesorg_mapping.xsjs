/**
 * 2.8.X86 Country salesorg Mapping UI designV1.2
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_country_salesorg_mapping::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_COUNTRY_SALESORG_MAPPING';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,country,salesOrg,salesOffice,countrySalesType,salesOfficePCT;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle,currency; //updated by Chris Gao as requirements changed
var body = 'Finished! You can check the result on HANA';

businessName = fileName;


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_country_salesorg_mapping_err"(?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,country);
		pcall.setString(3,salesOrg);
		pcall.setString(4,currency);
		pcall.setString(5,salesOffice);
		pcall.setString(6,salesOfficePCT);
		pcall.setString(7,countrySalesType);
		pcall.setString(8,tableName);
		pcall.setString(9,businessName);
		pcall.setInteger(10,businessCode);
		pcall.setInteger(11,position);
		pcall.setString(12,errorMsg);
		pcall.setString(13,cycle);
		
		
		
		
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
	country = lib.processData(data[i].COUNTRY);
	salesOrg = lib.processData(data[i].SALES_ORG);
	salesOffice = lib.processData(data[i].SALES_OFFICE);
	countrySalesType = lib.processData(data[i].COUNTRY_SALESORG_TYPE);
	currency = lib.processData(data[i].CURRENCY);
	//if(countrySalesType !== undefined && countrySalesType !== ''){
	//	countrySalesType = countrySalesType.toUpperCase();
	//}
	cycle = lib.processData('CURRENT');
    
	
	salesOfficePCT = lib.processData(data[i].SALES_OFFICE_PCT);
	
	if(country === undefined || salesOrg ===undefined || salesOffice===undefined
			|| countrySalesType ===undefined || currency === undefined || salesOfficePCT === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(salesOrg.length>20)
	{
			errorMsg='SALES_ORG::The length of "SALES_ORG" is too large(no more than 20)';
			exception_process();
			continue;
	}
	
	
	
	if(salesOffice.length>20)
	{
		errorMsg='SALES_OFFICE::The length of "SALES_OFFICE" is too large(no more than 20)';
		exception_process();
		continue;
	}

		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_country_salesorg_mapping"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,country);
		pcall.setString(3,salesOrg);
		pcall.setString(4,currency);
		pcall.setString(5,salesOffice);
		pcall.setString(6,salesOfficePCT);
		pcall.setString(7,countrySalesType);
		pcall.setString(8,tableName);
		pcall.setString(9,businessName);
		pcall.setInteger(10,businessCode);
		pcall.setInteger(11,position);
		pcall.setString(12,cycle);
		
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