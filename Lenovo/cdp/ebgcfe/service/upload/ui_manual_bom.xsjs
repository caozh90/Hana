/**
 * 1.4.X86  Manual BOM UI designV1.0
 */
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_manual_bom::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_MANUAL_BOM';
var data = json.data;
var fileName = json.filename;
var result="";

var errorMsg,businessName,bomLevel,father,children,plant,quantity,position,flag;
var conn = $.db.getConnection();
var pcall;
var query;
var businessCode,cycle;
var body = 'Finished! You can check the result on HANA';
businessName = fileName;


function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_manual_bom_err"(?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall = conn.prepareCall(info_sql);
		pcall.setString(1,bomLevel);
		pcall.setString(2,father);
		pcall.setString(3,children);
		pcall.setString(4,plant);
		pcall.setString(5,quantity);
		pcall.setString(6,flag);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		pcall.setString(11,errorMsg);
		pcall.setString(12,cycle);
		
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
var reg = /^\d{0,10}(\.\d{0,3})?$/;
var varDigAndUppercase =  /^[0-9A-Za-z_]+$/;//added by caozh4 20170313 
for(i=0;i<data.length;i++)
{	
	position =i+1;
	bomLevel = data[i].BOM_LEVEL;
	flag = data[i].FLAG;
	father = lib.processData(data[i].FATHER);
	children = lib.processData(data[i].CHILDREN);
	plant = lib.processData(data[i].PLANT);
	quantity = data[i].QUANTITY;
	cycle = 'CURRENT';
	
	if(bomLevel === undefined || father ===undefined || children===undefined 
				|| plant ===undefined || quantity === undefined || flag === undefined) {
		errorMsg='not enough values';
		exception_process();
		continue;
	}
	if(cycle.toLowerCase() !== 'current'){
		errorMsg='CYCLE::"ELEMENT_NAME" must be "CURRENT or "current"';
		exception_process();
		continue;
	}
	if(bomLevel.length>10)
	{
			errorMsg='BOM_LEVEL::The length of "BOM_LEVEL" is too large(no more than 10)';
			exception_process();
			continue;
	}
	if(father.length>18)
	{
		errorMsg='FATHER::The length of "FATHER" is too large(no more than 18)';
		exception_process();
		continue;
	}
	if(children.length>100)
	{
		errorMsg='CHILDREN::The length of "CHILDREN" is too large(no more than 100)';
		exception_process();
		continue;
	}
	if(plant.length>40)
	{
		errorMsg='PLANT::The length of "PLANT" is too large(no more than 40)';
		exception_process();
		continue;
	}

	if(quantity.length>100)
	{
		errorMsg='QUANTITY::The length of "QUANTITY" is too large(no more than 100)';
		exception_process();
		continue;
	}
	
	if(!reg.test(quantity)){
		errorMsg='QUANTITY::"The date type of this field is Decimal(13,3)!';
		exception_process();
		continue;
	}

//added by caozh4 20170313 for tuyn1
	if(!father.match(varDigAndUppercase))
	{
		errorMsg='FATHER::Invalid father Number ' + father;
		exception_process();
		continue;
	}
	
	query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_manual_bom"(?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,bomLevel);
		pcall.setString(2,father);
		pcall.setString(3,children);
		pcall.setString(4,plant);
		pcall.setString(5,quantity);
		pcall.setString(6,flag);
		pcall.setString(7,tableName);
		pcall.setString(8,businessName);
		pcall.setInteger(9,businessCode);
		pcall.setInteger(10,position);
		pcall.setString(11,cycle);
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