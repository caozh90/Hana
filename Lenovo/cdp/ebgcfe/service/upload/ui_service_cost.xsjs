/***********************************
 * 10.1 Service Cost UI Design
 * Modified by Chris Gao 2015-09-16
 ***********************************/
$.import('cdp.ebgcfe.service.upload','uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_service_cost::uploadable';

var json = JSON.parse($.request.body.asString());

var tableName = 'UI_SERVICECOST';
var data = json.data;
var fileName = json.filename;
var result = "";
var error_message;

var CYCLE = 'CURRENT';
var PRODUCT_GROUP = 'EGB';
var MODEL = '';
//var MODEL_TMP = '';
var BRAND = '';
var SUBGEO = '';
var COUNTRY = '';
//Modified by Chris Gao 2015-09-16
var M1 = "";
var M2 = "";
var M3 = "";
var M4 = "";
var M5 = "";
var M6 = "";
var M7 = "";
var M8 = "";
var M9 = "";
var M10 = "";
var M11 = "";
var M12 = "";
var M13 = "";
var M14 = "";
var M15 = "";
var M16 = "";
var M17 = "";
var M18 = "";
//Added by Chris Gao 2015-09-16
var validateDecimalType = /^\d{0,11}(\.\d{0,})?$/;
//var valTabOrSpace = /(^\s)|(\s$)/; //ADD VAL BY ZHAODAN1 20170220
var varDigAndUppercase  = /^[0-9A-Z]+$/;//ADD VAL BY ZHAODAN1 20170220
//var validateDecimalType = /^\d{0,11}(\.\d{0,4})?$/; 

var position =0;
var i;

var conn = $.db.getConnection();
var pcall;
var query;
var body = "Default Value";
var pcall_seq;
var seq;

var index;
var length;


//exception process function
function exception_process()
{
	var info_sql = 'call "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_service_cost_err"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	
	try{
		
		var pcall2 = conn.prepareCall(info_sql);
		
		pcall2.setString(1,error_message);
		pcall2.setString(2,fileName);
		pcall2.setInteger(3,seq);
		pcall2.setInteger(4,position);
		
		pcall2.setString(5,"CURRENT");
		pcall2.setString(6,"EBG");
		pcall2.setString(7,MODEL);
		pcall2.setString(8,BRAND);
		pcall2.setString(9,"");
		pcall2.setString(10,COUNTRY);
		pcall2.setString(11,M1); //Update by Chris Gao 2015-09-17
		pcall2.setString(12,M2);
		pcall2.setString(13,M3);
		pcall2.setString(14,M4);
		pcall2.setString(15,M5);
		pcall2.setString(16,M6);
		pcall2.setString(17,M7);
		pcall2.setString(18,M8);
		pcall2.setString(19,M9);
		pcall2.setString(20,M10);
		pcall2.setString(21,M11);
		pcall2.setString(22,M12);
		pcall2.setString(23,M13);
		pcall2.setString(24,M14);
		pcall2.setString(25,M15);
		pcall2.setString(26,M16);
		pcall2.setString(27,M17);
		pcall2.setString(28,M18);
			
		pcall2.execute();
		pcall2.close();
		conn.commit();
		body = 'Finished! You can check the result on HANA';
		$.response.status = $.net.http.OK;
		
	}catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	
}//exception_process


//upload with authority check
if(lib.assertAppRole(role)==='OK'){
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
		
		//upload
		for(i=0;i<data.length;i++){
			
			position = i+1;
			
			//get data record		
			if(data[i].MODEL !== undefined){
				MODEL = lib.processData(data[i].MODEL);
			}else{
				MODEL = '';
			}//end if;
			
			
			
			if (data[i].BRAND !== undefined){
				BRAND = lib.processData(data[i].BRAND);
			}else{
				BRAND = '';
			}

			if(data[i].COUNTRY !== undefined){
				COUNTRY = lib.processData(data[i].COUNTRY);
			}else{
				COUNTRY = '';
			}
			
			if(data[i].M1 !== undefined)
			{
				M1 = lib.processData(data[i].M1);
				
			}
			else
			{
				M1 = 0;
			}
			if(data[i].M2 !== undefined)
			{
				M2 = lib.processData(data[i].M2);
			}
			else
			{
				M2 = 0;
			}
			if(data[i].M3 !== undefined)
			{
				M3 = lib.processData(data[i].M3);
			}
			else
			{
				M3 = 0;
			}
			if(data[i].M4 !== undefined)
			{
				M4 = lib.processData(data[i].M4);	
			}
			else
			{
				M4 = 0;
			}
			if(data[i].M5 !== undefined)
			{
				M5 = lib.processData(data[i].M5);
			}
			else
			{
				M5 = 0;
			}
			if(data[i].M6 !== undefined)
			{
				M6 = lib.processData(data[i].M6);	
			}
			else
			{
				M6 = 0;
			}
			if(data[i].M7 !== undefined)
			{
				M7 = lib.processData(data[i].M7);	
			}
			else
			{
				M7 = 0;
			}
			if(data[i].M8 !== undefined)
			{
				M8 = lib.processData(data[i].M8);
			}
			else
			{
				M8 = 0;
			}
			if(data[i].M9 !== undefined)
			{
				M9 = lib.processData(data[i].M9);
			}
			else
			{
				M9 = 0;
			}
			if(data[i].M10 !== undefined)
			{
				M10 = lib.processData(data[i].M10);
			}
			else
			{
				M10 = 0;
			}
			if(data[i].M11 !== undefined)
			{
				M11 = lib.processData(data[i].M11);
			}
			else
			{
				M11 = 0;
			}
			if(data[i].M12 !== undefined)
			{
				M12 = lib.processData(data[i].M12);
			}
			else
			{
				M12 = 0;
			}
			if(data[i].M13 !== undefined)
			{
				M13 = lib.processData(data[i].M13);
				
			}
			else
			{
				M13 = 0;
			}
			if(data[i].M14 !== undefined)
			{
				M14 = lib.processData(data[i].M14);
			}
			else
			{
				M14 = 0;
			}
			if(data[i].M15 !== undefined)
			{
				M15 = lib.processData(data[i].M15);
			}
			else
			{
				M15 = 0;
			}
			if(data[i].M16 !== undefined)
			{
				M16 = lib.processData(data[i].M16);
			}
			else
			{
				M16 = 0;
			}
			if(data[i].M17 !== undefined)
			{
				M17 = lib.processData(data[i].M17);
			}
			else
			{
				M17 = 0;
			}
			if(data[i].M18 !== undefined)
			{
				M18 = lib.processData(data[i].M18);
			}
			else
			{
				M18 = 0;
			}
			
			//data validation key must not be null
			if(MODEL === '' || BRAND === '' || COUNTRY === ''){
				error_message='not enough values';
				exception_process();
				continue;
			}
			
			//ERROR VALIDATION
			/***********************************
			 * update by Chris Gao 2015-09-16
			 *********************************/
			//convert_M1 = parseFloat(M1).toFixed(4);
			if(M1 !== 0)
			{
				if (!M1.match(validateDecimalType))
				{
					error_message='M1 must be float (11,n)!';
					//position = i+1;
					exception_process();
					continue;
				}
				else
				{
					M1 = parseFloat(M1).toFixed(4);
				}
			}
			
			if(M2 !== 0)
			{
				if (!M2.match(validateDecimalType))
				{
					error_message='M2 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M2 = parseFloat(M2).toFixed(4);
				}
			}

			if(M3 !== 0)
			{
				if (!M3.match(validateDecimalType))
				{
					error_message='M3 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M3 = parseFloat(M3).toFixed(4);
				}
			}
			
			if(M4 !== 0)
			{
				if (!M4.match(validateDecimalType))
				{
					error_message='M4 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M4 = parseFloat(M4).toFixed(4);
				}
			}
			
			if(M5 !== 0)
			{
				if (!M5.match(validateDecimalType))
				{
					error_message='M5 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M5 = parseFloat(M5).toFixed(4);
				}
			}
			
			
			if(M6 !== 0)
			{
				if (!M6.match(validateDecimalType))
				{
					error_message='M6 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M6 = parseFloat(M6).toFixed(4);
				}
			}

			if(M7 !== 0)
			{
				if (!M7.match(validateDecimalType))
				{
					error_message='M7 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M7 = parseFloat(M7).toFixed(4);
				}
			}
			
			if(M8 !== 0)
			{
				if (!M8.match(validateDecimalType))
				{
					error_message='M8 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M8 = parseFloat(M8).toFixed(4);
				}
			}

			if(M9 !== 0)
			{
				if (!M9.match(validateDecimalType))
				{
					error_message='M9 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M9 = parseFloat(M9).toFixed(4);
				}
			}
			
			if(M10 !== 0)
			{
				if (!M10.match(validateDecimalType))
				{
					error_message='M10 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M10 = parseFloat(M10).toFixed(4);
				}
			}

			if(M11 !== 0)
			{
				if (!M11.match(validateDecimalType))
				{
					error_message='M11 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M11 = parseFloat(M11).toFixed(4);
				}
			}
			
			if(M12 !== 0)
			{
				if (!M12.match(validateDecimalType))
				{
					error_message='M12 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M12 = parseFloat(M12).toFixed(4);
				}
			}
			
			if(M13 !== 0)
			{
				if (!M13.match(validateDecimalType))
				{
					error_message='M13 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M13 = parseFloat(M13).toFixed(4);
				}
			}
			
			if(M14 !== 0)
			{
				if (!M14.match(validateDecimalType))
				{
					error_message='M14 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M14 = parseFloat(M14).toFixed(4);
				}
			}

			if(M15 !== 0)
			{
				if (!M15.match(validateDecimalType))
				{
					error_message='M15 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M15 = parseFloat(M15).toFixed(4);
				}
			}
			

			if(M16 !== 0)
			{
				if (!M16.match(validateDecimalType))
				{
					error_message='M16 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M16 = parseFloat(M16).toFixed(4);
				}
			}
			
			if(M17 !== 0)
			{
				if (!M17.match(validateDecimalType))
				{
					error_message='M17 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M17 = parseFloat(M17).toFixed(4);
				}
			}

			if(M18 !== 0)
			{
				if (!M18.match(validateDecimalType))
				{
					error_message='M18 must be float (11,n)!';
					
					exception_process();
					continue;
				}
				else
				{
					M18 = parseFloat(M18).toFixed(4);
				}
			}
			/***********************************
			 * end by Chris Gao
			 *********************************/
			
			//check field length
			if(MODEL.length > 12){ //changed by zhaodan1 20160816
				error_message='MODEL::The length of "MODEL" is too large(no more than 12)';
				exception_process();
				continue;
			}
			/*if (MODEL.match(valTabOrSpace)){
				error_message='MODEL::Invalid Part Number ' + MODEL;
				exception_process();
				continue;
			}
			MODEL_TMP = MODEL.replace(/\s/g, "");*/
			if (!MODEL.match(varDigAndUppercase)){
				error_message='MODEL::Invalid Part Number ' + MODEL;
				exception_process();
				continue;
			}
			

			if(BRAND.length > 40){
				error_message='BRAND::The length of "BRAND" is too large(no more than 40)';
				exception_process();
				continue;
			}
			
			if(COUNTRY.length > 20){
				error_message='COUNTRY::The length of "COUNTRY" is too large(no more than 20)';
				exception_process();
				continue;
			}
			
			query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.upload::ui_service_cost"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
			try
			{
				pcall = conn.prepareCall(query);
				pcall.setString(1,fileName);
				pcall.setInteger(2,seq);
				pcall.setInteger(3,position);
				
				pcall.setString(4,MODEL);
				pcall.setString(5,BRAND);
				pcall.setString(6,COUNTRY);
				pcall.setDecimal(7,M1);
				pcall.setDecimal(8,M2);
				pcall.setDecimal(9,M3);
				pcall.setDecimal(10,M4);
				pcall.setDecimal(11,M5);
				pcall.setDecimal(12,M6);
				pcall.setDecimal(13,M7);
				pcall.setDecimal(14,M8);
				pcall.setDecimal(15,M9);
				pcall.setDecimal(16,M10);
				pcall.setDecimal(17,M11);
				pcall.setDecimal(18,M12);
				pcall.setDecimal(19,M13);
				pcall.setDecimal(20,M14);
				pcall.setDecimal(21,M15);
				pcall.setDecimal(22,M16);
				pcall.setDecimal(23,M17);
				pcall.setDecimal(24,M18);

				pcall.execute();
				pcall.close();
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
			
		}//end for;
		
		conn.commit();
		conn.close();

		$.response.contentType = "application/json; charset=UTF-8";
		$.response.setBody(body);
		
	}//end else;
	
}else{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no upload privilege');
} //end else;
