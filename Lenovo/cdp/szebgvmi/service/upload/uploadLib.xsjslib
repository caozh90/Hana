function assertAppRole(role){
	var query = 'call "SECURITY"."cdp.security.procedures::checkPrivilege"(?,?)';
	var conn = $.db.getConnection();
	var stmt = conn.prepareCall(query);
	stmt.setNString(1,role);
	stmt.execute();
	var result = stmt.getNString(2);
	return result;
}

function processData(data){
	if(data !== undefined && data !== null){
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}
	}
	return data;
}