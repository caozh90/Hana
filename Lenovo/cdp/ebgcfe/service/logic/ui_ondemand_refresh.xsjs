var result = "";
var error_flg = "";
try {
	var json = JSON.parse(decodeURI($.request.body.asString()));

	var query = "CALL EBGCFE.\"cdp.ebgcfe.procedures.pkg_ondemand::PRC_EXECUTE_ONDEMAND_REFRESH\"('"
			+ json.EVENT_NAME
			+ "', '"
			+ json.PRODUCT_GROUP
			+ "', '"
			+ json.ONDEMAND_TYPE + "', ?, ? )";

	var conn = $.db.getConnection();
	var pc = conn.prepareCall(query);

	pc.execute();
	result += pc.getInt(1) + ":" + pc.getString(2);
	if (pc.getInt(1) !== 0) {
		error_flg = "X";
	}

	pc.close();
	conn.commit();
	conn.close();

} catch (e) {
	result += e.toString();
}
$.response.contentType = "text/plain; charset=UTF-8";
$.response.setBody(result);
if (error_flg === "") {
	$.response.status = $.net.http.OK;
} else {
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
