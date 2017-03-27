/**
 *3.2.X86 Comp Cost Upload UI designV1.1
 *  Modified by Chris Gao 2015-11-16
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_cost_tape_ori::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_COST_TAPE_ORI';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,cycle,partNumber='',mfgPlant='',costElem='',commodity='',currencyName='';
var owner_costtape; //add by Gavin
//var m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16,m17,m18;
//modified by Chris Gao
var m1='',m2='',m3='',m4='',m5='',m6='',m7='',m8='',m9='',m10='',m11='',m12='',m13='',m14='',m15='',m16='',m17='',m18 = '';
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position;
var body = 'Finished! You can check the result on HANA';

var error_flag = 0; //1:出错，0：成功
businessName = fileName;

function exception_process()
{
	error_flag = 1;
	body = 'Finish with errors!';
	$.response.status = $.net.http.BAD_REQUEST;
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_comp_cost_upload_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(info_sql);
		pcall.setString(1,partNumber);
		pcall.setString(2,cycle);
		pcall.setString(3,productGroup);
		pcall.setString(4,mfgPlant);
		pcall.setString(5,costElem);
		pcall.setString(6,m1);
		pcall.setString(7,m2);
		pcall.setString(8,m3);
		pcall.setString(9,m4);
		pcall.setString(10,m5);
		pcall.setString(11,m6);
		pcall.setString(12,m7);
		pcall.setString(13,m8);
		pcall.setString(14,m9);
		pcall.setString(15,m10);
		pcall.setString(16,m11);
		pcall.setString(17,m12);
		pcall.setString(18,m13);
		pcall.setString(19,m14);
		pcall.setString(20,m15);
		pcall.setString(21,m16);
		pcall.setString(22,m17);
		pcall.setString(23,m18);
		pcall.setString(24,tableName);
		pcall.setString(25,businessName);
		pcall.setInteger(26,businessCode);
		pcall.setInteger(27,position);
		pcall.setString(28,errorMsg);
		pcall.setString(29,commodity);
		pcall.setString(30,currencyName);
		pcall.setString(31,owner_costtape);

		pcall.execute();
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
/**
 * 先清空MID_UI_COST_TAPE_ORI中数据
 */
var delete_sp = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_comp_cost_upload_delete"(?)';
var pcall_delete = conn.prepareCall(delete_sp);
pcall_delete.setInteger(1,businessCode);
pcall_delete.execute(); 
conn.commit();
pcall_delete.close();


for(i=0;i<data.length;i++)
{	
	position =i+1;
	productGroup = 'EBG';//data[i].PRODUCT_GROUP;
	cycle = 'CURRENT';
	if(data[i].PART_NUMBER !== undefined && data[i].PART_NUMBER !== null)
	{
		partNumber = lib.processData(data[i].PART_NUMBER).trim();
		partNumber = lib.LTrim(partNumber);
	}
	if(data[i].MFG_PLANT !== undefined && data[i].MFG_PLANT !== null)
	{
		mfgPlant = lib.processData(data[i].MFG_PLANT).trim();
		mfgPlant = lib.LTrim(mfgPlant);
	}
	if(data[i].COST_ELEM !== undefined && data[i].COST_ELEM !== null)
	{
		costElem = lib.processData(data[i].COST_ELEM).trim();
		costElem = lib.LTrim(costElem);
	}
	if(data[i].COMMODITY !== undefined && data[i].COMMODITY !== null)
	{
		commodity = lib.processData(data[i].COMMODITY).trim();
		commodity = lib.LTrim(commodity);
	}
	if(data[i].CURRENCY_NAME !== undefined && data[i].CURRENCY_NAME !== null)
	{
		currencyName = lib.processData(data[i].CURRENCY_NAME).trim();
		currencyName = lib.LTrim(currencyName);
	}
	if(data[i].OWNER_COSTTAPE !== undefined && data[i].OWNER_COSTTAPE !== null)
	{
		owner_costtape = lib.processData(data[i].OWNER_COSTTAPE).trim();
		owner_costtape = lib.LTrim(owner_costtape);
	}
	if(data[i].M1 !== undefined && data[i].M1 !== null)
	{
		m1 = data[i].M1.trim().replace(',','');
	}
	if(data[i].M2 !== undefined && data[i].M2 !== null)
	{
		m2 = data[i].M2.trim().replace(',','');
	}
	if(data[i].M3 !== undefined && data[i].M3 !== null)
	{
		m3 = data[i].M3.trim().replace(',','');
	}
	if(data[i].M4 !== undefined && data[i].M4 !== null)
	{
		m4 = data[i].M4.trim().replace(',','');
	}
	if(data[i].M5 !== undefined && data[i].M5 !== null)
	{
		m5 = data[i].M5.trim().replace(',','');
	}
	if(data[i].M6 !== undefined && data[i].M6 !== null)
	{
		m6 = data[i].M6.trim().replace(',','');
	}
	if(data[i].M7 !== undefined && data[i].M7 !== null)
	{
		m7 = data[i].M7.trim().replace(',','');
	}
	if(data[i].M8 !== undefined && data[i].M8 !== null)
	{
		m8 = data[i].M8.trim().replace(',','');
	}
	if(data[i].M9 !== undefined && data[i].M9 !== null)
	{
		m9 = data[i].M9.trim().replace(',','');
	}
	if(data[i].M10 !== undefined && data[i].M10 !== null)
	{
		m10 = data[i].M10.trim().replace(',','');
	}
	if(data[i].M11 !== undefined && data[i].M11 !== null)
	{
		m11 = data[i].M11.trim().replace(',','');
	}
	if(data[i].M12 !== undefined && data[i].M12 !== null)
	{
		m12 = data[i].M12.trim().replace(',','');
	}
	if(data[i].M13 !== undefined && data[i].M13 !== null)
	{
		m13 = data[i].M13.trim().replace(',','');
	}
	if(data[i].M14 !== undefined && data[i].M14 !== null)
	{
		m14 = data[i].M14.trim().replace(',','');
	}
	if(data[i].M15 !== undefined && data[i].M15 !== null)
	{
		m15 = data[i].M15.trim().replace(',','');
	}
	if(data[i].M16 !== undefined && data[i].M16 !== null)
	{
		m16 = data[i].M16.trim().replace(',','');
	}
	if(data[i].M17 !== undefined && data[i].M17 !== null)
	{
		m17 = data[i].M17.trim().replace(',','');
	}
	if(data[i].M18 !== undefined && data[i].M18 !== null)
	{
		m18 = data[i].M18.trim().replace(',','');
	}
	
	if(partNumber === '' || owner_costtape ==='' || mfgPlant===''
			|| costElem ==='' || commodity ===''|| currencyName ===''  ) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(m1 === '' ||m2 === '' ||m3 === '' ||m4 === '' ||m5 === '')
	{
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	else if(m6 === '' ||m7 === '' ||m8 === '' ||m9 === '' ||m10 === '')
	{
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	else if(m11 === '' ||m12 === '' ||m13 === '' ||m14 === '' ||m15 === '')
	{
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	else if(m16 === '' ||m17 === '' ||m18 === '')
	{
		errorMsg='not enough values';
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
	
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_comp_cost_upload_raw"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,partNumber);
		pcall.setString(2,cycle);
		pcall.setString(3,productGroup);
		pcall.setString(4,mfgPlant);
		pcall.setString(5,costElem);
		pcall.setString(6,m1);
		pcall.setString(7,m2);
		pcall.setString(8,m3);
		pcall.setString(9,m4);
		pcall.setString(10,m5);
		pcall.setString(11,m6);
		pcall.setString(12,m7);
		pcall.setString(13,m8);
		pcall.setString(14,m9);
		pcall.setString(15,m10);
		pcall.setString(16,m11);
		pcall.setString(17,m12);
		pcall.setString(18,m13);
		pcall.setString(19,m14);
		pcall.setString(20,m15);
		pcall.setString(21,m16);
		pcall.setString(22,m17);
		pcall.setString(23,m18);
		pcall.setString(24,tableName);
		pcall.setString(25,businessName);
		pcall.setInteger(26,businessCode);
		pcall.setInteger(27,position);
		pcall.setString(28,commodity);
		pcall.setString(29,currencyName);
		pcall.setString(30,owner_costtape);
		
		pcall.execute();
	}
	catch(e)
	{
		error_flag = 1;
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	if(i%1000===101)
	{
		conn.commit();
	}
}
if(error_flag === 0)
{
	body = 'Finished! You can check the result on HANA';
	$.response.status = $.net.http.OK;
}
if(error_flag ===1 )
{
	body = 'Finished with some errors! You can check the result on HANA';
	$.response.status = $.net.http.OK;
}
conn.commit();
//执行验证

var validate_sp = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_comp_cost_upload_validate"(?,?,?)';
var pcall_validate = conn.prepareCall(validate_sp);
try
{
	pcall_validate.setString(1,tableName);
	pcall_validate.setString(2,businessName);
	pcall_validate.setInteger(3,businessCode);
	pcall_validate.execute(); 
	conn.commit();
	pcall_validate.close();
}
catch(e) 
{
	error_flag = 1;
	body = 'Validate failed!';
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
pcall.close();
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