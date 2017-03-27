/**
 *3.4.X86 Group Cost UI designV1.0
 * Modified by Chris Gao 2015-10-28
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_group_cost::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_GROUP_COST';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,cycle,plant,brand,type,prodFamily="",mt='',item='';
var m1='0',m2='0',m3='0',m4='0',m5='0',m6='0',m7='0',m8='0',m9='0',m10='0',m11='0',m12='0',m13='0',m14='0',m15='0',m16='0',m17='0',m18 = '0';
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;

function processData(data){
	if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
		data = data.substring(1,data.length - 1);
	}
	return data;
}

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_group_cost_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,cycle);
		pcall.setString(2,productGroup);
		pcall.setString(3,prodFamily);
		pcall.setString(4,mt);
		pcall.setString(5,item);
		pcall.setString(6,type);
		pcall.setString(7,brand);
		pcall.setString(8,plant);
		pcall.setString(9,m1);
		pcall.setString(10,m2);
		pcall.setString(11,m3);
		pcall.setString(12,m4);
		pcall.setString(13,m5);
		pcall.setString(14,m6);
		pcall.setString(15,m7);
		pcall.setString(16,m8);
		pcall.setString(17,m9);
		pcall.setString(18,m10);
		pcall.setString(19,m11);
		pcall.setString(20,m12);
		pcall.setString(21,m13);
		pcall.setString(22,m14);
		pcall.setString(23,m15);
		pcall.setString(24,m16);
		pcall.setString(25,m17);
		pcall.setString(26,m18);
		pcall.setString(27,tableName);
		pcall.setString(28,businessName);
		pcall.setInteger(29,businessCode);
		pcall.setInteger(30,position);
		pcall.setString(31,errorMsg);
		
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
var reg = /^-?\d{0,11}(\.\d{0,4})?$/;
businessCode = lib.getBusinessCode();
for(i=0;i<data.length;i++)
{	
	position =i+1;
	productGroup = 'EBG';//data[i].PRODUCT_GROUP;
	
	
	if (data[i].PROD_FAMILY !== undefined && data[i].PROD_FAMILY !== null)	
	{
		prodFamily = lib.processData(data[i].PROD_FAMILY);
    }
	else
	{
		prodFamily = "N/A";
	}
	
	if (data[i].MT !== undefined && data[i].MT !== null)	
	{
		mt = lib.processData(data[i].MT);
    }
	else
	{
		mt = "N/A";
	}
	
	if (data[i].ITEM !== undefined && data[i].ITEM !== null)	
	{
		item = lib.processData(data[i].ITEM);
    }
	else
	{
		item = "N/A";
	}
	
	if (data[i].BRAND !== undefined && data[i].BRAND !== null)	
	{
		brand = lib.processData(data[i].BRAND);
    }
	else
	{
		brand = "N/A";
	}
	cycle = 'CURRENT';
	plant = lib.processData(data[i].PLANT);	
	type = lib.processData(data[i].TYPE);
	if(data[i].M1 !== undefined && data[i].M1 !== null)
	{
		m1 = data[i].M1.replace(',','');
	}
	if(data[i].M2 !== undefined && data[i].M2 !== null)
	{
		m2 = data[i].M2.replace(',','');
	}
	if(data[i].M3 !== undefined && data[i].M3 !== null)
	{
		m3 = data[i].M3.replace(',','');
	}
	if(data[i].M4 !== undefined && data[i].M4 !== null)
	{
		m4 = data[i].M4.replace(',','');
	}
	if(data[i].M5 !== undefined && data[i].M5 !== null)
	{
		m5 = data[i].M5.replace(',','');
	}
	if(data[i].M6 !== undefined && data[i].M6 !== null)
	{
		m6 = data[i].M6.replace(',','');
	}
	if(data[i].M7 !== undefined && data[i].M7 !== null)
	{
		m7 = data[i].M7.replace(',','');
	}
	if(data[i].M8 !== undefined && data[i].M8 !== null)
	{
		m8 = data[i].M8.replace(',','');
	}
	if(data[i].M9 !== undefined && data[i].M9 !== null)
	{
		m9 = data[i].M9.replace(',','');
	}
	if(data[i].M10 !== undefined && data[i].M10 !== null)
	{
		m10 = data[i].M10.replace(',','');
	}
	if(data[i].M11 !== undefined && data[i].M11 !== null)
	{
		m11 = data[i].M11.replace(',','');
	}
	if(data[i].M12 !== undefined && data[i].M12 !== null)
	{
		m12 = data[i].M12.replace(',','');
	}
	if(data[i].M13 !== undefined && data[i].M13 !== null)
	{
		m13 = data[i].M13.replace(',','');
	}
	if(data[i].M14 !== undefined && data[i].M14 !== null)
	{
		m14 = data[i].M14.replace(',','');
	}
	if(data[i].M15 !== undefined && data[i].M15 !== null)
	{
		m15 = data[i].M15.replace(',','');
	}
	if(data[i].M16 !== undefined && data[i].M16 !== null)
	{
		m16 = data[i].M16.replace(',','');
	}
	if(data[i].M17 !== undefined && data[i].M17 !== null)
	{
		m17 = data[i].M17.replace(',','');
	}
	if(data[i].M18 !== undefined && data[i].M18 !== null)
	{
		m18 = data[i].M18.replace(',','');
	}
	
	
	if(    prodFamily === '' || mt === '' || item === ''
		|| cycle ===undefined || plant===undefined
		|| brand ===undefined || type === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(prodFamily.length > 100)
	{
		errorMsg='FAMILY::The length of "FAMILY" is too large(no more than 100)';
		exception_process();
		continue;
	}
	if(mt.length > 10)
	{
		errorMsg='MT::The length of "MT" is too large(no more than 10)';
		exception_process();
		continue;
	}
	if(item.length > 40)
	{
		errorMsg='ITEM::The length of "ITEM" is too large(no more than 40)';
		exception_process();
		continue;
	}
	if(!reg.test(m1)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}
	if(!reg.test(m2)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m3)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m4)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m5)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m6)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m7)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m8)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m9)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m10)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m11)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m12)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m13)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m14)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m15)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m16)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m17)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}if(!reg.test(m18)){
		errorMsg='DECIMAL VALIDATION FAILED, 4 decimal point behind at most';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_group_cost"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,cycle);
		pcall.setString(2,productGroup);
		pcall.setString(3,prodFamily);
		pcall.setString(4,mt);
		pcall.setString(5,item);
		pcall.setString(6,type);
		pcall.setString(7,brand);
		pcall.setString(8,plant);
		pcall.setString(9,m1);
		pcall.setString(10,m2);
		pcall.setString(11,m3);
		pcall.setString(12,m4);
		pcall.setString(13,m5);
		pcall.setString(14,m6);
		pcall.setString(15,m7);
		pcall.setString(16,m8);
		pcall.setString(17,m9);
		pcall.setString(18,m10);
		pcall.setString(19,m11);
		pcall.setString(20,m12);
		pcall.setString(21,m13);
		pcall.setString(22,m14);
		pcall.setString(23,m15);
		pcall.setString(24,m16);
		pcall.setString(25,m17);
		pcall.setString(26,m18);
		pcall.setString(27,tableName);
		pcall.setString(28,businessName);
		pcall.setInteger(29,businessCode);
		pcall.setInteger(30,position);
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