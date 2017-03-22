/**
 * 1.3.X86  SBB Category UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_sbbcategory::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_SBBCATEGORY';
var data = json.data;
var fileName = json.filename;
var result="";

var sbb,errorMsg,businessName,productGroup,costCategory,position,characterV;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_sbb_category_err"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,sbb);
		pcall.setString(2,productGroup);
//		pcall.setString(3,sbbDesc);
		pcall.setString(3,characterV);
		pcall.setString(4,costCategory);
		pcall.setString(5,tableName);
		pcall.setString(6,businessName);
		pcall.setInteger(7,businessCode);
		pcall.setInteger(8,position);
		pcall.setString(9,errorMsg);
		pcall.setString(10,cycle);
		
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
	sbb = lib.processData(data[i].BBID);
//	sbbDesc = data[i].SBB_DESC;
	productGroup = 'EBG';//data[i].PRODUCT_GROUP;
	cycle = 'CURRENT';
	
	costCategory = lib.processData(data[i].COST_CATEGORY);
	
	characterV = data[i].CHARACTER_V;
	
	if(productGroup === undefined || sbb ===undefined 
				|| costCategory === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"CYCLE" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(sbb.length>18)
	{
			errorMsg='BBID::The length of "item" is too large(no more than 18)';
			exception_process();
			continue;
	}
//	if(sbbDesc.length>200)
//	{
//		errorMsg='SBB_DESC::The length of "SBB_DESC" is too large(no more than 200)';
//		exception_process();
//		continue;
//	}
	if(productGroup.length>10)
	{
		errorMsg='PRODUCT_GROUP::The length of "PRODUCT_GROUP" is too large(no more than 10)';
		exception_process();
		continue;
	}
	if(costCategory.length>40)
	{
		errorMsg='COST CATEGORY::The length of "COST_CATEGORY" is too large(no more than 40)';
		exception_process();
		continue;
	}

	if(characterV.length>100)
	{
		errorMsg='CHARACTER_V::The length of "CHARACTER_V" is too large(no more than 100)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_sbb_category"(?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,sbb);
		pcall.setString(2,productGroup);
//		pcall.setString(3,sbbDesc);
		pcall.setString(3,characterV);
		pcall.setString(4,costCategory);
		pcall.setString(5,tableName);
		pcall.setString(6,businessName);
		pcall.setInteger(7,businessCode);
		pcall.setInteger(8,position);
		pcall.setString(9,cycle);
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