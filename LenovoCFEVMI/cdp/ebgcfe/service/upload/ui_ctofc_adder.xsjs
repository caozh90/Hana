/****
 * 11.1 CTO-FC Adder
 * **/
/* Declare ******Common Part**********************/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;
var role = 'ui_ctofc_adder::uploadable';

var json=JSON.parse($.request.body.asString());

var tableName = 'UI_CTOFC_ADDER';
var data = json.data;
var fileName = json.filename;
var result="";
var error_message;

var position =0;
var i;


var hconn = $.hdb.getConnection();
var pcall;
var query;
var body="";
var pcall_seq;
var seq;
 
var index;
var length;
var object;
var error_result = [];
var success_result = [];
/* Declare ******Special Part**********************/

var CTO ="";
var FC ="";
var SUBGEO ="";
var PLANT ="";
var TBA_TYPE ="";
var COST_LEVEL ="";

var M1 = null;
var M2 = null;
var M3 = null;
var M4 = null;
var M5 = null;
var M6 = null;
var M7 = null;
var M8 = null;
var M9 = null;
var M10 = null;
var M11 = null;
var M12 = null;
var M13 = null;
var M14 = null;
var M15 = null;
var M16 = null;
var M17 = null;
var M18 = null;

function exception_process()
{
	object.ERROR_MESSAGE = error_message;
	object.BUSINESS_NAME = fileName;
	object.SEQ = seq;
	object.POSITION = position;
	object.SOURCE = 'xsjs';
	error_result.push(object);
}

//验证权限
if (role === 'ui_ctofc_adder::uploadable')//(lib.assertAppRole(role) === 'OK') //(role === 'ui_ctofc_adder::uploadable')//
{
	
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
		object = {};
		//object =  data[i];
		position = i+1;
		
		if ( data[i].CTO !== undefined && data[i].CTO !== null )	
		{			
			CTO = lib.processData(data[i].CTO);
	
	    }
	    
		
		if ( data[i].FC  !== undefined && data[i].FC !== null )	
		{			
			FC  = lib.processData(data[i].FC );
			
	    }
		
		if ( data[i].SUBGEO  !== undefined && data[i].SUBGEO  !== null )	
		{			
			SUBGEO  = lib.processData(data[i].SUBGEO );
			
	    }
	   
		
		if ( data[i].PLANT  !== undefined && data[i].PLANT  !== null )	
		{			
			PLANT = lib.processData(data[i].PLANT );			
		
	    }
	   
		
		if ( data[i].TBA_TYPE  !== undefined && data[i].TBA_TYPE !== null )	
		{			
			TBA_TYPE  = lib.processData(data[i].TBA_TYPE );			
	    }
	   		
		
		if ( data[i].COST_LEVEL  !== undefined && data[i].COST_LEVEL !== null )	
		{
			COST_LEVEL  = lib.processData(data[i].COST_LEVEL );	
	    }
		
		
		if ( data[i].M1   !== undefined &&  data[i].M1 !== null )	
		{
			M1   = lib.processData(data[i].M1  );	
	    }else{
	    	M1 = null;
	    }
		
		if ( data[i].M2   !== undefined &&  data[i].M2 !== null )	
		{
			M2   = lib.processData(data[i].M2  );	
	    }else{
	    	M2 = null;
	    }
		if ( data[i].M3   !== undefined &&  data[i].M3 !== null )	
		{
			M3   = lib.processData(data[i].M3  );	
	    }else{
	    	M3 = null;
	    }
		if ( data[i].M4   !== undefined &&  data[i].M4 !== null )	
		{
			M4   = lib.processData(data[i].M4  );	
	    }else{
	    	M4 = null;
	    }
		
		if ( data[i].M5   !== undefined &&  data[i].M5 !== null )	
		{
			M5   = lib.processData(data[i].M5  );	
	    }else{
	    	M5 = null;
	    }
		
		if ( data[i].M6   !== undefined &&  data[i].M6 !== null )	
		{
			M6   = lib.processData(data[i].M6  );	
	    }else{
	    	M6 = null;
	    }
		
		if ( data[i].M7   !== undefined &&  data[i].M7 !== null )	
		{
			M7   = lib.processData(data[i].M7  );	
	    }else{
	    	M7 = null;
	    }
		
		if ( data[i].M8   !== undefined &&  data[i].M8 !== null )	
		{
			M8  = lib.processData(data[i].M8  );	
	    }else{
	    	M8 = null;
	    }
		
		if ( data[i].M9   !== undefined && data[i].M9  !== null )	
		{
			M9   = lib.processData(data[i].M9  );	
	    }else{
	    	M9 = null;
	    }
		
		if ( data[i].M10   !== undefined && data[i].M10  !== null )	
		{
			M10   = lib.processData(data[i].M10 );	
	    }else{
	    	M10 = null;
	    }
		
		if ( data[i].M11   !== undefined && data[i].M11  !== null )	
		{
			M11   = lib.processData(data[i].M11  );	
	    }else{
	    	M11 = null;
	    }
		
		if ( data[i].M12   !== undefined &&  data[i].M12 !== null )	
		{
			M12   = lib.processData(data[i].M2  );	
	    }else{
	    	M12 = null;
	    }
		
		if ( data[i].M13  !== undefined &&  data[i].M13 !== null )	
		{
			M13  = lib.processData(data[i].M13 );	
	    }else{
	    	M13 = null;
	    }
		
		if ( data[i].M14   !== undefined &&  data[i].M14 !== null )	
		{
			M14  = lib.processData(data[i].M14 );	
	    }else{
	    	M14 = null;
	    }
		
		if ( data[i].M15   !== undefined &&  data[i].M15 !== null )	
		{
			M15  = lib.processData(data[i].M15 );	
	    }else{
	    	M15 = null;
	    }
		
		if ( data[i].M16   !== undefined && data[i].M16 !== null )	
		{
			M16  = lib.processData(data[i].M16 );	
	    }else{
	    	M16 = null;
	    }
		
		if ( data[i].M17   !== undefined && data[i].M17 !== null )	
		{
			M17  = lib.processData(data[i].M17 );	
	    }else{
	    	M17 = null;
	    }
		
		if ( data[i].M18   !== undefined && data[i].M18 !== null )	
		{
			M18  = lib.processData(data[i].M18 );	
	    }else{
	    	M18 = null;
	    }
				
		object.CTO  = CTO ;
		object.PLANT   = PLANT  ;
		object.FC   = FC  ;
		object.SUBGEO  = SUBGEO ;
		if( data[i].ADDER_NAME  !== undefined && data[i].ADDER_NAME  !== null)	
		{
			object.ADDER_NAME  = lib.processData(data[i].ADDER_NAME ) ;
	    }else{
	    	object.ADDER_NAME  = "";
	    }
		
		object.TBA_TYPE  = TBA_TYPE ;
		object.COST_LEVEL  = COST_LEVEL ;
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
		
		//非空检查
		if(CTO === '' || FC === ''|| SUBGEO === ''|| PLANT === ''
			||TBA_TYPE === '' || COST_LEVEL === '' || object.ADDER_NAME === '' || M1 === null || M2 === null || M3 === null
			|| M4 === null || M5 === null || M6 === null || M7 === null || M8 === null || M9 === null
			|| M10 === null || M11 === null || M12 === null || M13 === null || M14 === null || M15 === null
			|| M16 === null || M17 === null || M18 === null)
		{
			error_message='not enough values';
			exception_process();
			continue;
		}
			
	
		object.BUSINESS_NAME = fileName;
		object.SEQ = seq;
		object.POSITION = position;
		success_result.push(object);


	}
	
	
	if(success_result.length>0){
		try
		{
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_ctofc_adder');
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
			var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.upload::ui_ctofc_adder_err');
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
