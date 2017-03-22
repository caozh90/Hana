var json=JSON.parse($.request.body.asString());
var data = json.data;

var conn = $.db.getConnection();
var pcall;
var query;

var i;

var line;

var MATNR;
var MO_NUM;
var STORAGE_LOC;
var LINE_NUM;
var STATUS = 'NEW';
var REMARK;

var result_status; //1 for error, 0 for success
var error_message; 

var exitError;
var isErr; //1Error, 0 success 
var errorMessage = '';

function removeBlock(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}


if(data.length < 1){
	exitError = 1;
	errorMessage = 'Empty file!';
}else{
	exitError = 0;
	for(i=0;i<data.length;i++){
		isErr = 0;
		
		MATNR  = data[i].MATNR;
		MO_NUM  = data[i].MO_NUM;
		STORAGE_LOC  = data[i].STORAGE_LOC;
		LINE_NUM  = data[i].LINE_NUM;
		REMARK  = data[i].REMARK;
		
		if(MATNR !== undefined && MATNR !== null){
			MATNR = removeBlock(MATNR);
		}else{
			MATNR = '';
		}
		
		
		if(MO_NUM !== undefined && MO_NUM !== null){
			MO_NUM = removeBlock(MO_NUM);
			if(MO_NUM.length > 12){
				isErr = 1;
				errorMessage = errorMessage + 'MO_NUM is longer than 12.';
			}
		}else{
			MO_NUM = '';
		}
		
		if(STORAGE_LOC !== undefined && STORAGE_LOC !== null){
			STORAGE_LOC = removeBlock(STORAGE_LOC);
		}else{
			STORAGE_LOC = '';
		}
		
		
		if(LINE_NUM !== undefined && LINE_NUM !== null){
			LINE_NUM = removeBlock(LINE_NUM);
			if(isNaN(LINE_NUM)){
				isErr = 1;
				errorMessage = errorMessage + 'LINE_NUM is not a number.';
			}
			if(LINE_NUM.length > 10){
				isErr = 1;
				errorMessage = errorMessage + 'LINE_NUM is longer than 10.';
			}
		}else{
			LINE_NUM = '';
		}
			
		if(REMARK !== undefined && REMARK !== null){
			REMARK = removeBlock(REMARK);
			if(REMARK.length > 40){
				isErr = 1;
				errorMessage = errorMessage + 'REMARK is longer than 40.';
			}
		}else{
			REMARK = '';
		}
			
		if(isErr === 0){
			query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.upload::ui_change_location_create"(?,?,?,?,?,?,?,?)';
			try{
				pcall = conn.prepareCall(query);
				pcall.setString(1,MATNR);
				pcall.setString(2,LINE_NUM);
				pcall.setString(3,STORAGE_LOC);
				pcall.setString(4,MO_NUM);
				pcall.setString(5,STATUS);
				pcall.setString(6,REMARK);
				
				pcall.execute();
				
				result_status = pcall.getInteger(7); 
				error_message = pcall.getNString(8); 
				if(result_status === 1){
					errorMessage = errorMessage + error_message;
				}
				pcall.close();
//				
				if(result_status === 1){
					isErr = 1;
				}
			}catch(e){
				isErr = 1;
				errorMessage = e.message;
				conn.rollback();
			}
//		
		}
		if(isErr === 1){
			exitError = 1;
			line = i + 1;
			errorMessage = errorMessage + '(Line' + line + ')';
			errorMessage = errorMessage + '\n';
		}

	}
	try{
		if(exitError === 0){
			conn.commit();
		}else{
			conn.rollback();
		}	
	}catch(e){
		exitError = 1;
		errorMessage = e.message;
	}
}

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(errorMessage);
if(exitError === 0){
	$.response.status = $.net.http.OK;
}else{
	$.response.status = $.net.http.BAD_REQUEST;
}
