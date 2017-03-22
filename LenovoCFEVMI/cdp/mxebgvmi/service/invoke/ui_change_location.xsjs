/**
 * function: ui_change_location 页面的新增和更新
 */

// 获取从URL post过来的参数
var json = JSON.parse(decodeURI($.request.body.asString()));

var data = json.data;
var op_type = json.OP_TYPE;
var error_message = '';

var i = 0;

var conn = $.db.getConnection();
var query;
var pcall;
var result_status;

function create_change_location(){
	
	for(i = 0;i<data.length;i++){
		query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_change_location::createUiChangeLocation"(?,?,?,?,?,?,?,?)';
		try{
			pcall = conn.prepareCall(query);
			pcall.setString(1,data[i].MATNR);
			pcall.setString(2,data[i].MATNR_DESCR);
			pcall.setString(3,data[i].LINE_NUM);
			pcall.setString(4,data[i].STORAGE_LOC);
			pcall.setString(5,data[i].MO_NUM);
			pcall.setString(6,data[i].STATUS);
			
			pcall.execute();
			result_status = pcall.getInteger(7);
			$.response.contentType = "application/json; charset=UTF-8";
			if(result_status === 0)
			{
				conn.rollback();
				error_message = pcall.getNString(8);
				$.response.setBody("Error::"+error_message);
				$.response.status = $.net.http.BAD_REQUEST;
				break;
			}
			else if(result_status === 1)
			{
				$.response.setBody("Finished!");
				$.response.status = $.net.http.OK;
			}
			pcall.close();
		}
		catch(e){
			error_message = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody("Exception::"+error_message);
		}
	}
	try{
		conn.commit();	//add by caozh4
	}catch(e){
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);	
	}	
}

function update_change_location(){
	for(i = 0;i<data.length;i++){
		query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_change_location::updateUiChangeLocation"(?,?,?,?,?,?,?,?)';
		try{
			pcall = conn.prepareCall(query);
			pcall.setString(1,data[i].MATNR);
			pcall.setString(2,data[i].MATNR_DESCR);
			pcall.setString(3,data[i].LINE_NUM);
			pcall.setString(4,data[i].STORAGE_LOC);
			pcall.setString(5,data[i].MO_NUM);
			pcall.setString(6,data[i].STATUS);
			
			pcall.execute();
			result_status = pcall.getInteger(7);
			$.response.contentType = "application/json; charset=UTF-8";
			if(result_status === 0)
			{
				conn.rollback();
				error_message = pcall.getNString(8);
				$.response.setBody("Error::"+error_message);
				$.response.status = $.net.http.BAD_REQUEST;
				break;
			}
			else if(result_status === 1)
			{
				$.response.setBody("Finished!");
				$.response.status = $.net.http.OK;
			}
			pcall.close();
		}
		catch(e){
			error_message = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody("Exception::"+error_message);
		}
	}
	try{
		conn.commit();	//add by caozh4
	}catch(e){
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);	
	}	
}


//程序处理模块
if (data.length > 0) {
	if (op_type === 'CREATE') {
		
//		create item 
		create_change_location();
		
	} else if (op_type === 'UPDATE') {
		update_change_location();
//		$.response.setBody("Update Data!");
//		$.response.status = $.net.http.BAD_REQUEST;
	}
} else {
	$.response.setBody("No Data!");
	$.response.status = $.net.http.BAD_REQUEST;
}


