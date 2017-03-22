var json=JSON.parse($.request.body.asString());

//import 验证逻辑
$.import('cdp.szebgvmi.service.upload', 'uploadLib');
var lib = $.cdp.szebgvmi.service.upload.uploadLib;
var role1 = 'changelocation::uploadable';

//var columns = json.columns;
var data = json.data;
var fileName = json.filename;
var error_message="";

var MATNR;
var MATNR_DESCR;
var MO_NUM;
var STORAGE_LOC;
var LINE_NUM;
var STATUS;
var REMARK;
var CREATED_DATE;
var CREATED_BY;
var MODIFIED_DATE;
var MODIFIED_BY;

var result_status;
var error_msg;
var result_matnr;
var result_mo_num;
var result_storage_loc;
var check_result = 0;
var i = 0;

var conn = $.db.getConnection();
var pcall;
var query;
var line_num_type;

$.response.contentType = "application/json; charset=UTF-8";


	for(i=0;i<data.length;i++)
	{
		MATNR = data[i].MATNR;
		MATNR_DESCR = data[i].MATNR_DESCR;
		MO_NUM = data[i].MO_NUM;
		STORAGE_LOC = data[i].STORAGE_LOC;
		LINE_NUM = data[i].LINE_NUM;
//		STATUS = data[i].STATUS;
		STATUS = "NEW";
		REMARK = data[i].REMARK;
		CREATED_BY = data[i].SYS_CREATED_BY;
		MODIFIED_DATE = data[i].SYS_LAST_MODIFIED_DATE;
		MODIFIED_BY = data[i].SYS_LAST_MODIFIED_BY;
		
//		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::createUiChangeLocation"'
//		    + '(\''
//		    + MATNR+'\',\''
//		    + MATNR_DESCR+'\',\''
//		    + MO_NUM+'\',\''
//		    + STORAGE_LOC+'\',\''
//		    + LINE_NUM+'\',\''
//		    + STATUS+'\',\''
//		    + REMARK+'\',\''
//		    + CREATED_DATE+'\',\''
//		    + CREATED_BY+'\',\''
//		    + MODIFIED_BY+'\',\''
//		    + MODIFIED_DATE+'\''
//		    + ')';
		if(MATNR !==undefined){
			if(MATNR.length > 18 && MATNR!== undefined){  
				error_message = 'The length of Part Num is too large (no more than 18)'+'\n';
				check_result = 1;
	//			continue;
			}
		}else{
			MATNR = '';
		}
		
		if(MATNR_DESCR !== undefined){
			if(MATNR_DESCR.length > 40 ){
				error_message =error_message + 'The length of Part Num Description is too large (no more than 40)'+'\n';
				check_result = 1;
	//			continue;
			}
		}
		else{
			MATNR_DESCR = '';
		}

		if(MO_NUM !== undefined){
			if(MO_NUM.length > 12 && MO_NUM!== undefined){
			error_message =error_message + 'The length of Mo Num is too large (no more than 12)'+'\n';
			check_result = 1;
	//		continue;
			}
		}else{
			MO_NUM = '';
		}
		
		if(STORAGE_LOC !== undefined){
			if(STORAGE_LOC.length > 40 && STORAGE_LOC!== undefined){
				error_message =error_message + 'The length of Storage Location is too large (no more than 40)'+'\n';
				check_result = 1;
	//			continue;
			}
		}else{
			STORAGE_LOC = '';
		}
		
		
		if(LINE_NUM !== undefined){
			if( isNaN(LINE_NUM)){ 
				error_message =error_message + ' Line Num is Number only !'+'\n';
				check_result = 1;
//				continue;
			}
			else if(LINE_NUM.length > 10 && LINE_NUM!== undefined){
				error_message =error_message + 'The length of Line Num is too large (no more than 10)'+'\n';
				check_result = 1;
//				continue;
			}	
			
		}else{
			LINE_NUM = '';
		}
//		if(LINE_NUM === undefined || LINE_NUM  === null){
//			LINE_NUM = '';
//		}
//		
		 
//		if(STATUS!== 'NEW'){
//			error_message =error_message + 'Status should be NEW '+'\n';
//			check_result = 1;
////			continue; 
//		}
		
		if(REMARK !== undefined){
			if(REMARK.length > 40){
				error_message =error_message + 'The length of REMARK is too large (no more than 40)'+'\n';
				check_result = 1;
	//			continue;
			}
		}else{
			REMARK = '';
		}
		
		if(check_result === 0){
			query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.upload::ui_change_sl"('
					+'?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
			try
			{
				pcall = conn.prepareCall(query);
				pcall.setString(1,MATNR);
				pcall.setString(2,MATNR_DESCR);
				pcall.setString(3,MO_NUM);
				pcall.setString(4,STORAGE_LOC);
				pcall.setString(5,LINE_NUM);
				pcall.setString(6,STATUS);
				pcall.setString(7,REMARK);
				pcall.setString(8,CREATED_DATE);
				pcall.setString(9,CREATED_BY);
				pcall.setString(10,MODIFIED_BY);
				pcall.setString(11,MODIFIED_DATE);
				
				pcall.execute();
				
				result_status = pcall.getInteger(13); 
				result_matnr = pcall.getString(14);
				result_mo_num = pcall.getString(15);
				result_storage_loc = pcall.getString(16);
				
				if(result_status === 0)
					{
					error_msg = pcall.getString(12);
					$.response.setBody("Error::all upload operation have been canceled."+'\n'+error_msg+'\n'+"Part Num: "+result_matnr+", MO Num: "
															+result_mo_num+",Storage loc: "+result_storage_loc);
					$.response.status = $.net.http.BAD_REQUEST;
					break;
					}else if(result_status === 1)
					{
						$.response.setBody('Finished! You can check the result on HANA');
						$.response.status = $.net.http.OK;
					}
			
				pcall.close();
				conn.commit();
				
			}catch(e)
			{	
				error_message = e.message;
				$.response.status = $.net.http.BAD_REQUEST;
				$.response.setBody("Exception::"+error_message);
			}
			
		}else{
			$.response.setBody(error_message);
			$.response.status = $.net.http.BAD_REQUEST;
		}
		
}
