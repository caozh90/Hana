/**
 * 1.8.X86  Manual BOM UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_dummy_part::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_DUMMYPART';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,dummyPart,partDesc,position;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,businessName,cycle,productGroup;
var body = 'Finished! You can check the result on HANA';

businessName = fileName;

function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_dummy_parts_err"(?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,dummyPart);
		pcall.setString(2,partDesc);
		pcall.setString(3,tableName);
		pcall.setString(4,businessName);
		pcall.setInteger(5,businessCode);
		pcall.setInteger(6,position);
		pcall.setString(7,errorMsg);
		pcall.setString(8,productGroup);
		pcall.setString(9,cycle);
		
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
	dummyPart = lib.processData(data[i].DUMMY_PART);
	partDesc = lib.processData(data[i].PART_DESC);
	cycle = lib.processData('CURRENT');
	productGroup = 'EBG';
	
	if(dummyPart === undefined || partDesc ===undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(dummyPart.length>40)
	{
			errorMsg='DUMMY_PART::The length of "DUMMY_PART" is too large(no more than 40)';
			exception_process();
			continue;
	}
	if(partDesc.length>60)
	{
		errorMsg='PART_DESC::The length of "PART_DESC" is too large(no more than 60)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_dummy_parts"(?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,dummyPart);
		pcall.setString(2,partDesc);
		pcall.setString(3,tableName);
		pcall.setString(4,businessName);
		pcall.setInteger(5,businessCode);
		pcall.setInteger(6,position);
		pcall.setString(7,productGroup);
		pcall.setString(8,cycle);
		
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