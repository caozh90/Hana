/**
 *1.8.X86  CtoFcFlag designV1.0
 *created by zhaodan1 2016-01-18
 *as requirements changed
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_ctofc_flag::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_CTOFC_FLAG';
var data = json.data;
var fileName = json.filename;
var result="";

//var errorMsg,currencyName,cycle,productGroup,country;
var errorMsg,cycle,productGroup,cto,fc,announceDate,withdrawDate;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,position;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;
function checkCTO ( in_cto){
	var result;
	var query_cto = 
	"select top 1 *" +
	"from dummy" +
	"where"+ in_cto + "in  (" +
				"select  distinct (item)"+ 
				"from \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_item/AN_UI_ITEMS\""+
				" where item_type='CTO')";
	var pcall_checkCto = conn.prepareStatement(query_cto);
	var rs_cto = pcall_checkCto.executeQuery();

	
	rs_cto.next();
	
	result = rs_cto.getString(1);//get current work step
		
	rs_cto.close();
	pcall_checkCto.close();
	return result;
	
}
function checkFC ( in_fc){
	var result;
	var query_fc = 
	"select top 1 *" +
	"from dummy" +
	"where"+ in_fc + "in  (" +
				"select  * "+ 
				"from \"_SYS_BIC\".\"cdp.ebgcfe.models.biz_fcsbbmap/CV_CUR_BIZ_FCSBBMAP\"";
	var pcall_checkFC = conn.prepareStatement(query_fc);
	var rs_fc = pcall_checkFC.executeQuery();

	
	rs_fc.next();
	
	result = rs_fc.getString(1);//get current work step
		
	rs_fc.close();
	pcall_checkFC.close();
	return result;
	
}
/*function checkCountry ( in_country){
	var result;
	var query_country = 
	"select top 1 *" +
	"from dummy" +
	"where"+ in_country + "in  (" +
				"select  * "+ 
				"from \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_region/CV_UI_REGION\"";
	var pcall_checkCountry = conn.prepareStatement(query_country);
	var rs_country = pcall_checkCountry.executeQuery();

	
	rs_country.next();
	
	result = rs_country.getString(1);//get current work step
		
	rs_country.close();
	pcall_checkCountry.close();
	return result;
	
}
*/


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_ctofc_flag_err"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,errorMsg);
		pcall.setString(2,businessName);
		pcall.setString(3,cycle);
		pcall.setString(4,productGroup);
		pcall.setString(5,cto);
		pcall.setString(6,fc);
		pcall.setString(7,announceDate);
		pcall.setString(8,withdrawDate);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		
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
	cycle = 'CURRENT';
	
	cto = data[i].CTO;
	fc = data[i].FC;
	announceDate = data[i].ANNOUNCE_DATE;
    withdrawDate = data[i].WITHDRAW_DATE;

	
	if(cto === undefined || fc ===undefined || announceDate === undefined || withdrawDate === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	
//	if (checkCTO(cto) !== 'X'){
//		errorMsg='CTO not exist';
//		exception_process();
//		continue;
//	}
//	if (checkFC(fc) !== 'X'){
//		errorMsg='FC not exist';
//		exception_process();
//		continue;
//	}
//	if(/^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/.test(announceDate) ===false){
//		errorMsg= 'announceDate::Wrong format of Date::'+announceDate;
//		exception_process();
//		continue;
//	}
//	if(/^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/.test(withdrawDate) ===false){
//		errorMsg= 'withdrawDate::Wrong format of Date::'+withdrawDate;
//		exception_process();
//		continue;
//	}
	if(announceDate > withdrawDate ){
		errorMsg= 'announceDate > withdrawDate';
		exception_process();
		continue;
	}
		
		
	query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_ctofc_flag"(?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);

		pcall.setString(1,cycle);
		pcall.setString(2,productGroup);
		pcall.setString(3,cto);
		pcall.setString(4,fc);
		pcall.setString(5,announceDate);
		pcall.setString(6,withdrawDate);
		pcall.setString(7,businessName);
		pcall.setInteger(8,businessCode);
		pcall.setInteger(9,position);
		
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