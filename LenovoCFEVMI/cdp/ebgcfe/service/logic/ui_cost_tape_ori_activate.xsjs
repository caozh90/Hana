/************************************************************************
*name       :      
*function   :mass activate cost tape
*input      ：
*output     :
*author     :leonard ling
*CreateDate :2015-01-12
*UpdateDate :
*************************************************************************/
var result = "";
var error_flg = "";
try {
	
	try {
		var json = decodeURI($.request.body.asString());
	} catch (e) {
		json = "{\"data\":[{\"PART_NUMBER\": \"null\", \"MFG_PLANT\": \"null\"}]}";
	}	

	var query = "CALL EBGCFE.\"cdp.ebgcfe.procedures.pkg_costtape::PRC_COST_TAPE_IMPORT\"('"
			+ json + "', ?, ? )";

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



/**the following code uses table parameter to call procedure, user needs special authorization 
var conn = $.db.getConnection();
try {
	var json = JSON.parse(decodeURI($.request.body.asString()));
	var data = json.data;
} catch (e) {
	json = JSON
			.parse("{\"data\":[{\"PART_NUMBER\": \"null\", \"MFG_PLANT\": \"null\"}]}");
	data = json.data;
}

var XSProc = $.import("sap.hana.xs.libs.dbutils", "procedures");
XSProc.setTempSchema("EBGCFE");

var costTapeImport = XSProc.procedure("EBGCFE",
		"cdp.ebgcfe.procedures.pkg_costtape", "PRC_COST_TAPE_IMPORT", {
			connection : conn
		});

var result = costTapeImport(data);

$.response.contentType = "text/plain; charset=UTF-8";
var output = result.P_EXITCODE + ":" + result.P_EXITMESS;
$.response.setBody(output);
if (result.P_EXITCODE === 0) {
	$.response.status = $.net.http.OK;
} else {
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
*/