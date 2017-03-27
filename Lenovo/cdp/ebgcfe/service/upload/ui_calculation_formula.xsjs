/**
 * 2.4.X86 Calculation Formula UI designV1.2
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_cost_calcu_formu::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_COST_CALCU_FORMU';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,brand,prodFamily,category,plant,subgeo,level1,level2,level3,level4,level5,level6;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position,cycle;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_calculation_formula_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,brand);
		pcall.setString(3,prodFamily);
		pcall.setString(4,category);
		pcall.setString(5,plant);
		pcall.setString(6,subgeo);
		pcall.setString(7,level1);
		pcall.setString(8,level2);
		pcall.setString(9,level3);
		pcall.setString(10,level4);
		pcall.setString(11,level5);
		pcall.setString(12,level6);
		pcall.setString(13,tableName);
		pcall.setString(14,businessName);
		pcall.setInteger(15,businessCode);
		pcall.setInteger(16,position);
		pcall.setString(17,errorMsg);
		pcall.setString(18,cycle);
		
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
	plant = lib.processData(data[i].PLANT);
	subgeo = lib.processData(data[i].SUBGEO);
	category = lib.processData(data[i].CATEGORY);
	brand = lib.processData(data[i].BRAND);
	prodFamily = lib.processData(data[i].PRODFAMILY);
	cycle = lib.processData('CURRENT');
	level1 = lib.processData(data[i].LEVEL1_TBAS);
	level2 = lib.processData(data[i].LEVEL2_TBAS);
	level3 = lib.processData(data[i].LEVEL3_TBAS);
	level4 = lib.processData(data[i].LEVEL4_TBAS);
	level5 = lib.processData(data[i].LEVEL5_TBAS);
	level6 = lib.processData(data[i].LEVEL6_TBAS);
	
	
	if(level1 === undefined)
	{
		level1 = '';
	}
	if(level2 === undefined)
	{
		level2 = '';
	}
	if(level3 === undefined)
	{
		level3 = '';
	}
	if(level4 === undefined)
	{
		level4 = '';
	}
	if(level5 === undefined)
	{
		level5 = '';
	}
	if(level6 === undefined)
	{
		level6 = '';
	}		
	
	
	if(brand === undefined || prodFamily ===undefined || plant===undefined
			|| subgeo ===undefined || category === undefined ) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	
	if(cycle !== 'CURRENT'){
		errorMsg='CYCLE::"CYCLE" must be "CURRENT"';
		exception_process();
		continue;
	}
	if(brand.length>40)
	{
			errorMsg='BRAND::The length of "BRAND" is too large(no more than 40)';
			exception_process();
			continue;
	}
	if(prodFamily.length>120)
	{
		errorMsg='PRODFAMILY::The length of "PRODFAMILY" is too large(no more than 120)';
		exception_process();
		continue;
	}
	if(plant.length>20)
	{
		errorMsg='PLANT::The length of "PLANT" is too large(no more than 20)';
		exception_process();
		continue;
	}
	if(subgeo.length>20)
	{
		errorMsg='SUBGEO::The length of "SUBGEO" is too large(no more than 20)';
		exception_process();
		continue;
	}
	if(category.length>10)
	{
		errorMsg='CATEGORY::The length of "CATEGORY" is too large(no more than 10)';
		exception_process();
		continue;
	}
	if(level1.length>200)
	{
		errorMsg='LEVEL1_TBAS::The length of "LEVEL1_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
	if(level2.length>200)
	{
		errorMsg='LEVEL2_TBAS::The length of "LEVEL2_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
	if(level3.length>200)
	{
		errorMsg='LEVEL3_TBAS::The length of "LEVEL3_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
	if(level4.length>200)
	{
		errorMsg='LEVEL4_TBAS::The length of "LEVEL4_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
	if(level5.length>200)
	{
		errorMsg='LEVEL5_TBAS::The length of "LEVEL5_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
	if(level6.length>200)
	{
		errorMsg='LEVEL6_TBAS::The length of "LEVEL6_TBAS" is too large(no more than 200)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_calculation_formula"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,brand);
		pcall.setString(3,prodFamily);
		pcall.setString(4,category);
		pcall.setString(5,plant);
		pcall.setString(6,subgeo);
		pcall.setString(7,level1);
		pcall.setString(8,level2);
		pcall.setString(9,level3);
		pcall.setString(10,level4);
		pcall.setString(11,level5);
		pcall.setString(12,level6);
		pcall.setString(13,tableName);
		pcall.setString(14,businessName);
		pcall.setInteger(15,businessCode);
		pcall.setInteger(16,position);
		pcall.setString(17,cycle);
		
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