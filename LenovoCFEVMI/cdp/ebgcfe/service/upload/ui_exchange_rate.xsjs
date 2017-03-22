/**
 *2.7.X86  Exchange Rate UI designV1.0
 *updated by Chris Gao 2015-09-26
 *as requirements changed
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_exchange_rate::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_EXCHANGE_RATE';
var data = json.data;
var fileName = json.filename;
var result="";

//var errorMsg,currencyName,cycle,productGroup,country;
var errorMsg,currencyName,cycle,productGroup;
var m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16,m17,m18;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_exchange_rate_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,currencyName);
		pcall.setString(2,cycle);
		pcall.setString(3,productGroup);
		//pcall.setString(4,country);
		pcall.setString(4,m1);
		pcall.setString(5,m2);
		pcall.setString(6,m3);
		pcall.setString(7,m4);
		pcall.setString(8,m5);
		pcall.setString(9,m6);
		pcall.setString(10,m7);
		pcall.setString(11,m8);
		pcall.setString(12,m9);
		pcall.setString(13,m10);
		pcall.setString(14,m11);
		pcall.setString(15,m12);
		pcall.setString(16,m13);
		pcall.setString(17,m14);
		pcall.setString(18,m15);
		pcall.setString(19,m16);
		pcall.setString(20,m17);
		pcall.setString(21,m18);
		pcall.setString(22,tableName);
		pcall.setString(23,businessName);
		pcall.setInteger(24,businessCode);
		pcall.setInteger(25,position);
		pcall.setString(26,errorMsg);
		
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
	currencyName = lib.processData(data[i].CURRENCY_NAME);
	cycle = 'CURRENT';
	//country = lib.processData(data[i].COUNTRY);
	m1 = data[i].M1;
	m2 = data[i].M2;
	m3 = data[i].M3;
	m4 = data[i].M4;
	m5 = data[i].M5;
	m6 = data[i].M6;
	m7 = data[i].M7;
	m8 = data[i].M8;
	m9 = data[i].M9;
	m10 = data[i].M10;
	m11 = data[i].M11;
	m12 = data[i].M12;
	m13 = data[i].M13;
	m14 = data[i].M14;
	m15 = data[i].M15;
	m16 = data[i].M16;
	m17 = data[i].M17;
	m18 = data[i].M18;
	
	if(currencyName === undefined || cycle ===undefined /*|| country===undefined*/
			|| m1 ===undefined || m2 === undefined ||
			m3 === undefined || m4 === undefined || m5 === undefined
			|| m6 === undefined || m7 === undefined || m8 === undefined|| m9 === undefined|| m10 === undefined
			|| m11 === undefined|| m12 === undefined|| m13 === undefined|| m14 === undefined|| m15 === undefined
			|| m16 === undefined|| m17 === undefined|| m18 === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
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
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_exchange_rate"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,currencyName);
		pcall.setString(2,cycle);
		pcall.setString(3,productGroup);
		//pcall.setString(4,country);
		pcall.setString(4,m1);
		pcall.setString(5,m2);
		pcall.setString(6,m3);
		pcall.setString(7,m4);
		pcall.setString(8,m5);
		pcall.setString(9,m6);
		pcall.setString(10,m7);
		pcall.setString(11,m8);
		pcall.setString(12,m9);
		pcall.setString(13,m10);
		pcall.setString(14,m11);
		pcall.setString(15,m12);
		pcall.setString(16,m13);
		pcall.setString(17,m14);
		pcall.setString(18,m15);
		pcall.setString(19,m16);
		pcall.setString(20,m17);
		pcall.setString(21,m18);
		pcall.setString(22,tableName);
		pcall.setString(23,businessName);
		pcall.setInteger(24,businessCode);
		pcall.setInteger(25,position);
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