function assertAppRole(role){
//	var v_role = role.substring(role.indexOf('roles.')+6);
	var query = 'call "SECURITY"."cdp.security.procedures::checkPrivilege"(?,?)';
	var conn = $.db.getConnection();
	var stmt = conn.prepareCall(query);
	stmt.setNString(1,role);
	stmt.execute();
	var result = stmt.getNString(2);
	return result;
}
function processData(data){
	if(data !== undefined){
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}
	}
	return data;
}
function getBusinessCode(){
	var conn = $.db.getConnection();
	var id;
	var sequence = 'call "cdp.ebgdf.procedures.pkg_ui.upload::getBusinessCode"(?)';
	var sequenceStmt = conn.prepareCall(sequence);
	sequenceStmt.execute();
	id = sequenceStmt.getInteger(1);
	sequenceStmt.close();
	conn.close();
	return id;
}