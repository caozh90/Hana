/***
 * 4.5 X86 XATT UI Design
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_xatt::uploadable';
var json=JSON.parse($.request.body.asString());

//var tableName = json.tablename;
var tableName = 'UI_XATT';
//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var CYCLE;
var TBA_TYPE;
var BRAND;
var PLANT;
var FAMILY;
var SUBGEO;
var M1;
var M2;
var M3;
var M4;
var M5;
var M6;
var M7;
var M8;
var M9;
var M10;
var M11;
var M12;
var M13;
var M14;
var M15;
var M16;
var M17;
var M18;

var position =0;
var i;
var conn = $.db.getConnection();
var pcall;
var query;

var body;

var pcall_seq;
var seq;//upload seq

var index;
var length;

function processData(data){
	if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
		data = data.substring(1,data.length - 1);
	}
	return data;
}

function exception_process()
{
	
/*	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_xatt_err"(\''
		+error_message+'\',\''
		+fileName+'\',\''
		
		+ CYCLE+'\',\''
		+ TBA_TYPE+'\',\''
		+ BRAND+'\',\''
		+ PLANT+'\',\''
		+ FAMILY+'\',\''
		+ SUBGEO+'\',\''
		+ M1+'\',\''
		+ M2+'\',\''
		+ M3+'\',\''
		+ M4+'\',\''
		+ M5+'\',\''
		+ M6+'\',\''
		+ M7+'\',\''
		+ M8+'\',\''
		+ M9+'\',\''
		+ M10+'\',\''
		+ M11+'\',\''
		+ M12+'\',\''
		+ M13+'\',\''
		+ M14+'\',\''
		+ M15+'\',\''
		+ M16+'\',\''
		+ M17+'\',\''
		+ M18+'\',\''

	    + seq +'\','
		+position
		+')';*/
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_xatt_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	try
	{
		var pcall2 = conn.prepareCall(info_sql);
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setString(3,CYCLE);
		pcall2.setString(4,TBA_TYPE);
		pcall2.setString(5,BRAND);
		pcall2.setString(6,PLANT);
		pcall2.setString(7,FAMILY);
		pcall2.setString(8,SUBGEO);
		pcall2.setString(9,M1);
		pcall2.setString(10,M2);
		pcall2.setString(11,M3);
		pcall2.setString(12,M4);
		pcall2.setString(13,M5);
		pcall2.setString(14,M6);
		pcall2.setString(15,M7);
		pcall2.setString(16,M8);
		pcall2.setString(17,M9);
		pcall2.setString(18,M10);
		pcall2.setString(19,M11);
		pcall2.setString(20,M12);
		pcall2.setString(21,M13);
		pcall2.setString(22,M14);
		pcall2.setString(23,M15);
		pcall2.setString(24,M16);
		pcall2.setString(25,M17);
		pcall2.setString(26,M18);	
		pcall2.setInteger(27,seq);
		pcall2.setInteger(28,position);	
		
		pcall2.execute();
		pcall2.close();
		conn.commit();
		body = 'Finished! You can check the result on HANA';
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}

}
//验证权限
if(lib.assertAppRole(role)==='OK')
{
	if(data.length < 1)
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Empty file!';
	}
	else 
	{
		//在XSJS中统一为该次上传操作生成统一的sequence
		query = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode"(?)';
		pcall_seq = conn.prepareCall(query);
		pcall_seq.execute();
		seq = pcall_seq.getInteger(1);
	}

	for(i=0;i<data.length;i++)
	{
		CYCLE = 'CURRENT';
		TBA_TYPE = lib.processData(data[i].TBA_TYPE);
		BRAND = lib.processData(data[i].BRAND);
		PLANT = lib.processData(data[i].PLANT);
		FAMILY = lib.processData(data[i].FAMILY);
		SUBGEO = lib.processData(data[i].SUBGEO);
		M1 = data[i].M1.replace(',','');
		M2 = data[i].M2.replace(',','');
		M3 = data[i].M3.replace(',','');
		M4 = data[i].M4.replace(',','');
		M5 = data[i].M5.replace(',','');
		M6 = data[i].M6.replace(',','');
		M7 = data[i].M7.replace(',','');
		M8 = data[i].M8.replace(',','');
		M9 = data[i].M9.replace(',','');
		M10 = data[i].M10.replace(',','');
		M11 = data[i].M11.replace(',','');
		M12 = data[i].M12.replace(',','');
		M13 = data[i].M13.replace(',','');
		M14 = data[i].M14.replace(',','');
		M15 = data[i].M15.replace(',','');
		M16 = data[i].M16.replace(',','');
		M17 = data[i].M17.replace(',','');
		M18 = data[i].M18.replace(',','');

		position = i+1;
		
		if(TBA_TYPE === undefined ||BRAND === undefined ||PLANT === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(FAMILY === undefined ||SUBGEO === undefined ||CYCLE === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(M1 === undefined ||M2 === undefined ||M3 === undefined ||M4 === undefined ||M5 === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(M6 === undefined ||M7 === undefined ||M8 === undefined ||M9 === undefined ||M10 === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(M11 === undefined ||M12 === undefined ||M13 === undefined ||M14 === undefined ||M15 === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		else if(M16 === undefined ||M17 === undefined ||M18 === undefined)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		
		if(CYCLE.length>40)
		{
				error_message='CYCLE::The length of "CYCLE" is too large(no more than 40)';
				exception_process();
				continue;
		}
		
		if(CYCLE.toLowerCase() !== 'current'){
			error_message='CYCLE must be "CURRENT or "current"';
			exception_process();
			continue;
		}
		
		if(TBA_TYPE.length>10)
		{
				error_message='TBA_TYPE::The length of "TBA_TYPE" is too large(no more than 10)';
				exception_process();
				continue;
		}
		if(BRAND.length>40)
		{
			error_message='BRAND::The length of "BRAND" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(PLANT.length>20)
		{
				error_message='PLANT::The length of "PLANT" is too large(no more than 20)';
				exception_process();
				continue;
		}
		if(FAMILY.length>40)
		{
			error_message='FAMILY::The length of "FAMILY" is too large(no more than 40)';
			exception_process();
			continue;
		}
		if(SUBGEO.length>20)
		{
				error_message='SUBGEO::The length of "SUBGEO" is too large(no more than 20)';
				exception_process();
				continue;
		}
		
		//判断M1到M18的精度
		index = M1.lastIndexOf('.');
		length = M1.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M1"::'+M1+' is illegal';
			exception_process();
			continue;
		}
		
		index = M2.lastIndexOf('.');
		length = M2.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M2"::'+M2+' is illegal';
			exception_process();
			continue;
		}
		
		index = M3.lastIndexOf('.');
		length = M3.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M3"::'+M3+' is illegal';
			exception_process();
			continue;
		}
		
		index = M4.lastIndexOf('.');
		length = M4.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M4"::'+M4+' is illegal';
			exception_process();
			continue;
		}
		
		index = M5.lastIndexOf('.');
		length = M5.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M5"::'+M5+' is illegal';
			exception_process();
			continue;
		}
		
		index = M6.lastIndexOf('.');
		length = M6.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M6"::'+M6+' is illegal';
			exception_process();
			continue;
		}
		
		index = M7.lastIndexOf('.');
		length = M7.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M7"::'+M7+' is illegal';
			exception_process();
			continue;
		}
		
		index = M8.lastIndexOf('.');
		length = M8.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M8"::'+M8+' is illegal';
			exception_process();
			continue;
		}
		
		index = M9.lastIndexOf('.');
		length = M9.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M9"::'+M9+' is illegal';
			exception_process();
			continue;
		}
		
		index = M10.lastIndexOf('.');
		length = M10.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M10"::'+M10+' is illegal';
			exception_process();
			continue;
		}
		
		index = M11.lastIndexOf('.');
		length = M11.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M11"::'+M11+' is illegal';
			exception_process();
			continue;
		}
		
		index = M12.lastIndexOf('.');
		length = M12.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M12"::'+M12+' is illegal';
			exception_process();
			continue;
		}
		
			index = M13.lastIndexOf('.');
		length = M13.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M13"::'+M13+' is illegal';
			exception_process();
			continue;
		}
		
		index = M14.lastIndexOf('.');
		length = M14.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M14"::'+M14+' is illegal';
			exception_process();
			continue;
		}
		
		index = M15.lastIndexOf('.');
		length = M15.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M15"::'+M15+' is illegal';
			exception_process();
			continue;
		}
		
		index = M16.lastIndexOf('.');
		length = M16.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M16"::'+M16+' is illegal';
			exception_process();
			continue;
		}
		
		index = M17.lastIndexOf('.');
		length = M17.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M17"::'+M17+' is illegal';
			exception_process();
			continue;
		}
		
		index = M18.lastIndexOf('.');
		length = M18.length;
		if((index >=0) && (length-index > 5) )
		{
			error_message='"M18"::'+M18+' is illegal';
			exception_process();
			continue;
		}
		
		
		
/*		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_xatt"'
		    + '(\''

			+ CYCLE+'\',\''
			+ TBA_TYPE+'\',\''
			+ BRAND+'\',\''
			+ PLANT+'\',\''
			+ FAMILY+'\',\''
			+ SUBGEO+'\',\''
		    + M1+'\',\''
		    + M2+'\',\''
		    + M3+'\',\''
		    + M4+'\',\''
		    + M5+'\',\''
		    + M6+'\',\''
		    + M7+'\',\''
		    + M8+'\',\''
		    + M9+'\',\''
		    + M10+'\',\''
		    + M11+'\',\''
		    + M12+'\',\''
		    + M13+'\',\''
		    + M14+'\',\''
		    + M15+'\',\''
		    + M16+'\',\''
		    + M17+'\',\''
		    + M18+'\',\''
			
		    + fileName+'\',\''
		    + seq +'\','
		    + position
		    + ')';*/
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_xatt"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,CYCLE);
			pcall.setString(2,TBA_TYPE);
			pcall.setString(3,BRAND);
			pcall.setString(4,PLANT);
			pcall.setString(5,FAMILY);
			pcall.setString(6,SUBGEO);
			pcall.setString(7,M1);
			pcall.setString(8,M2);
			pcall.setString(9,M3);
			pcall.setString(10,M4);
			pcall.setString(11,M5);
			pcall.setString(12,M6);
			pcall.setString(13,M7);
			pcall.setString(14,M8);
			pcall.setString(15,M9);
			pcall.setString(16,M10);
			pcall.setString(17,M11);
			pcall.setString(18,M12);
			pcall.setString(19,M13);
			pcall.setString(20,M14);
			pcall.setString(21,M15);
			pcall.setString(22,M16);
			pcall.setString(23,M17);
			pcall.setString(24,M18);	
			pcall.setString(25,fileName);
			pcall.setInteger(26,seq);
			pcall.setInteger(27,position);
			
			pcall.execute();
			pcall.close();
			conn.commit();
			body = 'Finished! You can check the result on HANA';
			$.response.status = $.net.http.OK;
		}
		catch(e)
		{	
			error_message = e.message;
			//替换单引号'
			while(error_message.indexOf("'") >0 ) {
				error_message = error_message.replace('\'','"'); 
			}
			exception_process();
			$.response.status = $.net.http.BAD_REQUEST;
			body = e.message;
		}

	}
	conn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}