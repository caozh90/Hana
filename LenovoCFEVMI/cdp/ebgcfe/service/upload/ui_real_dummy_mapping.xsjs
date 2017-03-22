/**
 * 3.5. Real Dummy Part
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_real_dummy_mapping::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_REAL_DUMMY_MAPPING';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,businessName,productGroup,realPart,dummyPart,commodity,owner;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,cycle,position;
var body = 'Finished! You can check the result on HANA';


businessName = fileName;


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_real_dummy_part_err"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,productGroup);
		pcall.setString(2,cycle);
		pcall.setString(3,realPart);
		pcall.setString(4,dummyPart);
		pcall.setString(5,commodity);
		pcall.setString(6,owner);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		pcall.setString(11,errorMsg);
		
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
var arr_REAL_PART_dup_err = [];
var arr_REAL_PART = [];

businessCode = lib.getBusinessCode();


for(i=0;i<data.length;i++){	
	
	if (arr_REAL_PART.indexOf(data[i].REAL_PART) !== -1){
		arr_REAL_PART_dup_err.push(data[i].REAL_PART);
	}
	arr_REAL_PART.push(data[i].REAL_PART);
}


for(i=0;i<data.length;i++)
{	
	
	
	position =i+1;
	realPart = lib.processData(data[i].REAL_PART);
	dummyPart = lib.processData(data[i].DUMMY_PART);
	commodity = lib.processData(data[i].COMMODITY);
	owner = lib.processData(data[i].OWNER);
	if(owner !== undefined){
		owner = owner.toUpperCase();
	}
	productGroup = 'EBG';//data[i].PRODUCT_GROUP;
	cycle = 'CURRENT';	
	
	if (arr_REAL_PART_dup_err.indexOf(data[i].REAL_PART) !== -1){
		errorMsg='REAL_PART not unique.';
		exception_process();
		continue;
	}
	
	if(productGroup === undefined || realPart ===undefined 
				|| dummyPart === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"CYCLE" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(realPart.length>40)
	{
			errorMsg='REAL_PART::The length of "REAL_PART" is too large(no more than 40)';
			exception_process();
			continue;
	}
	if(dummyPart.length>18)
	{
			errorMsg='DUMMY_PART::The length of "DUMMY_PART" is too large(no more than 18)';
			exception_process();
			continue;
	}
	if(commodity.length>40)
	{
		errorMsg='COMMODITY::The length of "COMMODITY" is too large(no more than 40)';
		exception_process();
		continue;
	}
	if(owner.length>70)
	{
		errorMsg='OWNER::The length of "OWNER" is too large(no more than 70)';
		exception_process();
		continue;
	}
		
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_real_dummy_part"(?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,productGroup);
		pcall.setString(2,cycle);
		pcall.setString(3,realPart);
		pcall.setString(4,dummyPart);
		pcall.setString(5,commodity);
		pcall.setString(6,owner);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
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