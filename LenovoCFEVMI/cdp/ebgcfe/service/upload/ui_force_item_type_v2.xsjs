/**
 * 1.7.X86  Force ItemType UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_force_item_type::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_ITEM';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,productGroup,item,itemType,itemDesc,position,eolStatus;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_force_item_type_v2_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,item);
		pcall.setString(3,itemDesc);
		pcall.setString(4,itemType);
		pcall.setString(5,eolStatus);
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
	productGroup = 'EBG';//lib.processData(data[i].PRODUCT_GROUP);
	item = lib.processData(data[i].ITEM);
	itemDesc = lib.processData(data[i].USER_ITEM_DESC);
	itemType = lib.processData(data[i].USER_ITEM_TYPE);
	eolStatus = lib.processData(data[i].USER_EOL_STATUS);
	cycle = 'CURRENT';
	
	if(item === undefined ) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(itemDesc!== undefined && itemDesc.length>200)
	{
			errorMsg='PART::The length of "USER_ITEM_DESC" is too large(no more than 200)';
			exception_process();
			continue;
	}
	if(itemType!== undefined && itemType.length>20)
	{
		errorMsg='USER_ITEM_TYPE::The length of "USER_ITEM_TYPE" is too large(no more than 20)';
		exception_process();
		continue;
	}
	if(eolStatus!== undefined && eolStatus.length>20)
	{
		errorMsg='USER_EOL_STATUS::The length of "USER_EOL_STATUS" is too large(no more than 20)';
		exception_process();
		continue;
	}
	
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_force_item_type_v2"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,item);
		if(itemDesc === undefined){
			pcall.setNull(3,null);
		}else{
			pcall.setString(3,itemDesc);
		}
		if(itemType===undefined){
			pcall.setString(4,"");
		}else{
			pcall.setString(4,itemType);
		}
		if(eolStatus === undefined){
			pcall.setString(5,"");
		}else{
			pcall.setString(5,eolStatus);
		}
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