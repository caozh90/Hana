function assertAppRole(role){
	var query = 'call "SECURITY"."cdp.security.procedures::checkPrivilege"(?,?)';
	var conn = $.db.getConnection();
	var stmt = conn.prepareCall(query);
	stmt.setNString(1,role);
	stmt.execute();
	var result = stmt.getNString(2);
	return result;
}


if (assertAppRole('ui_ondemand_refresh::executable') !== 'OK'){
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no export privilege');
} else {
	$.response.setBody('ok');
}

/*

var privilegeExists;

var query = "CALL SECURITY.\"cdp.security.procedures::checkPrivilege\"('"
	+ "'ui_cost_bake::access', ? )";

var conn1 = $.db.getConnection();
var pc = conn1.prepareCall(query);

pc.execute();
var result = pc.getString(1);

pc.close();
conn1.commit();
conn1.close();
	
*/
//$.response.setBody(result);
//$.response.setBody('result');
$.response.status = $.net.http.OK;

