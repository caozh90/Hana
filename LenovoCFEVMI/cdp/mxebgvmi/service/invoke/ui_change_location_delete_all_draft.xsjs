/**
 * function: ui_change_location_delete_all_draft 删除所有的dtrft数据
 */

// 获取从URL post过来的参数
var json = JSON.parse(decodeURI($.request.body.asString()));

var conn = $.db.getConnection();
var query;
var pcall;
var result_status;

query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_change_location::deleteAllDraftUiChangeLocation"(?,?)';
try{
	pcall = conn.prepareCall(query);
	pcall.setString(1,"DRAFT");
	pcall.execute();
//	error_message = pcall.getNString(8);
	conn.commit();	
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody('All \'DRAFT\' records have been deleted!');
	$.response.status = $.net.http.OK;
}
catch(e){
	conn.commit();
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(e.message);
	$.response.status = $.net.http.BAD_REQUEST;
}

