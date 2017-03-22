/***
 * FRT by PH batch upload
 * Create by bianzh1 2017-02-08
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_frt_ph::uploadable';

var json=JSON.parse($.request.body.asString());

var datasource = json.data;
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;


var PH = "", ITEM = "" , PLANT = '', COUNTRY = '', TBA_TYPE ='';
var M1,M2,M3,M4,M5,M6,M7,M8,M9,M10,M11,M12,M13,M14,M15,M16,M17,M18;
var validateDecimalType = /^\d{0,11}(\.\d{0,4})?$/;

var position =0;
var i,j;

//var conn = $.db.getConnection();
var hconn = $.hdb.getConnection();
var pcall;
var query;
var body;
var pcall_seq;
var seq;
 
var index;
var length;
//new structure definition
var object;
var error_result = [];
var success_result = [];

function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	error_result.push(object);
}

//var distinct_obj = {};

//验证权限
if (lib.assertAppRole(role) === 'OK') //(role === 'ui_cryad_ph::uploadable')//
{
	//array Item distinct


	if(data.length < 1)
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Empty file!';
	}
	else 
	{
		//在XSJS中统一为该次上传操作生成统一的sequence
		query = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode');
		pcall_seq = query();
		seq = pcall_seq.businessCode;
	}
	
	
	for(i=0;i<data.length;i++)
	{  
		//Restructuring object
		object =  {};

		
		
		if (data[i].PH !== undefined && data[i].PH !== null)	
		{
			PH = lib.processData(data[i].PH);
	    }
		else
		{
			PH = "";
		}
		
		

		if (data[i].ITEM !== undefined && data[i].ITEM !== null)	
		{
			ITEM = lib.processData(data[i].ITEM);
	    }
		else
		{
			ITEM = "";
		}
		

		if (data[i].PLANT !== undefined && data[i].PLANT !== null)	
		{
			PLANT = lib.processData(data[i].PLANT);
	    }
		else
		{
			PLANT = "";
		}
		
		
		if (data[i].COUNTRY !== undefined && data[i].COUNTRY !== null)	
		{
			COUNTRY = lib.processData(data[i].COUNTRY);
	    }
		else
		{
			COUNTRY = "";
		}
			
		
		if (data[i].TBA_TYPE !== undefined && data[i].TBA_TYPE !== null)	
		{
			TBA_TYPE = lib.processData(data[i].TBA_TYPE);
	    }
		else
		{
			TBA_TYPE = "";
		}
		if(data[i].M1 !== undefined && data[i].M1 !== null)
		{
			M1 = data[i].M1.replace(',','');
		}
		if(data[i].M2 !== undefined && data[i].M2 !== null)
		{
			M2 = data[i].M2.replace(',','');
		}
		if(data[i].M3 !== undefined && data[i].M3 !== null)
		{
			M3 = data[i].M3.replace(',','');
		}
		if(data[i].M4 !== undefined && data[i].M4 !== null)
		{
			M4 = data[i].M4.replace(',','');
		}
		if(data[i].M5 !== undefined && data[i].M5 !== null)
		{
			M5 = data[i].M5.replace(',','');
		}
		if(data[i].M6 !== undefined && data[i].M6 !== null)
		{
			M6 = data[i].M6.replace(',','');
		}
		if(data[i].M7 !== undefined && data[i].M7 !== null)
		{
			M7 = data[i].M7.replace(',','');
		}
		if(data[i].M8 !== undefined && data[i].M8 !== null)
		{
			M8 = data[i].M8.replace(',','');
		}
		if(data[i].M9 !== undefined && data[i].M9 !== null)
		{
			M9 = data[i].M9.replace(',','');
		}
		if(data[i].M10 !== undefined && data[i].M10 !== null)
		{
			M10 = data[i].M10.replace(',','');
		}
		if(data[i].M11 !== undefined && data[i].M11 !== null)
		{
			M11 = data[i].M11.replace(',','');
		}
		if(data[i].M12 !== undefined && data[i].M12 !== null)
		{
			M12 = data[i].M12.replace(',','');
		}
		if(data[i].M13 !== undefined && data[i].M13 !== null)
		{
			M13 = data[i].M13.replace(',','');
		}
		if(data[i].M14 !== undefined && data[i].M14 !== null)
		{
			M14 = data[i].M14.replace(',','');
		}
		if(data[i].M15 !== undefined && data[i].M15 !== null)
		{
			M15 = data[i].M15.replace(',','');
		}
		if(data[i].M16 !== undefined && data[i].M16 !== null)
		{
			M16 = data[i].M16.replace(',','');
		}
		if(data[i].M17 !== undefined && data[i].M17 !== null)
		{
			M17 = data[i].M17.replace(',','');
		}
		if(data[i].M18 !== undefined && data[i].M18 !== null)
		{
			M18 = data[i].M18.replace(',','');
		}
		
		object.CYCLE = 'CURRENT';
		object.PRODUCT_GROUP = 'EBG';
        object.PH = PH;
		object.ITEM = ITEM;	
		object.PLANT = PLANT;
		object.COUNTRY = COUNTRY;
		object.TBA_TYPE = TBA_TYPE;
		object.M1  = M1 ;
		object.M2  =  M2   ;
		object.M3  =  M3   ;
		object.M4  =  M4   ;
		object.M5  =  M5   ;
		object.M6  =  M6   ;
		object.M7  =  M7   ;
		object.M8  =  M8   ;
		object.M9  =  M9   ;
		object.M10  =  M10   ;
		object.M11  =  M11   ;
		object.M12  =  M12   ;
		object.M13  =  M13   ;
		object.M14  =  M14   ;
		object.M15  =  M15   ;
		object.M16  =  M16   ;
		object.M17  =  M17   ;
		object.M18  =  M18   ;
		
		position = i+1;
		
		if (!M1.match(validateDecimalType)){
			error_message='M1 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M2.match(validateDecimalType)){
			error_message='M2 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M3.match(validateDecimalType)){
			error_message='M3 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M4.match(validateDecimalType)){
			error_message='M4 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M5.match(validateDecimalType)){
			error_message='M5 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M6.match(validateDecimalType)){
			error_message='M6 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M7.match(validateDecimalType)){
			error_message='M7 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M8.match(validateDecimalType)){
			error_message='M8 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M9.match(validateDecimalType)){
			error_message='M9 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M10.match(validateDecimalType)){
			error_message='M10 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M11.match(validateDecimalType)){
			error_message='M11 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M12.match(validateDecimalType)){
			error_message='M12 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M13.match(validateDecimalType)){
			error_message='M13 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M14.match(validateDecimalType)){
			error_message='M14 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M15.match(validateDecimalType)){
			error_message='M15 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M16.match(validateDecimalType)){
			error_message='M16 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M17.match(validateDecimalType)){
			error_message='M17 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		if (!M18.match(validateDecimalType)){
			error_message='M18 must be decimal (15,4)!';
			exception_process();
			continue;
		}
		
		//非空检查
		if( PLANT  === '' || COUNTRY  === ''  || TBA_TYPE  === '')
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
		if(PH === '' && ITEM  === '')
		{
			error_message='ITEM or PH should be filled at least one';
			exception_process();
			continue;
		}

		//字段长度检查
		if(PH.length > 20)
		{
				error_message='PH::The length of "PH" is too large(no more than 20)';
				exception_process();
				continue;
		}
		if(ITEM.length > 40)
		{
				error_message='ITEM::The length of "ITEM" is too large(no more than 40)';
				exception_process();
				continue;
		}
		if(PLANT.length > 20)
		{
				error_message='PLANT::The length of "PLANT" is too large(no more than 20)';
				exception_process();
				continue;
		}	
		if(COUNTRY.length > 20)
		{
				error_message='COUNTRY::The length of "COUNTRY" is too large(no more than 20)';
				exception_process();
				continue;
		}	
		if(TBA_TYPE.length > 20)
		{
				error_message='TBA_TYPE::The length of "TBA_TYPE" is too large(no more than 20)';
				exception_process();
				continue;
		}	
		
		
		
		//特殊检查
		
		if(PH === ''){
			PH = 'N/A';
		}
		if(ITEM === ''){
			ITEM = 'N/A';
		}
		if(PH !== 'N/A' && ITEM !== 'N/A'){
			PH = 'N/A';
		}
		
		object.CYCLE = 'CURRENT';
		object.PRODUCT_GROUP = 'EBG';
        object.PH = PH;
		object.ITEM = ITEM;	
		object.PLANT = PLANT;
		object.COUNTRY = COUNTRY;
		object.TBA_TYPE = TBA_TYPE;
		object.M1  = M1 ;
		object.M2  =  M2   ;
		object.M3  =  M3   ;
		object.M4  =  M4   ;
		object.M5  =  M5   ;
		object.M6  =  M6   ;
		object.M7  =  M7   ;
		object.M8  =  M8   ;
		object.M9  =  M9   ;
		object.M10  =  M10   ;
		object.M11  =  M11   ;
		object.M12  =  M12   ;
		object.M13  =  M13   ;
		object.M14  =  M14   ;
		object.M15  =  M15   ;
		object.M16  =  M16   ;
		object.M17  =  M17   ;
		object.M18  =  M18   ;
		
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);


	}
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_frt_ph');
			var result = callProcedure(success_result);
			
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
	
	if(error_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_frt_ph_err');
			var result = callProcedure(error_result);
			
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
	

	hconn.commit();
	hconn.close();

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
}