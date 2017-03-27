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
	if(data !== undefined && data !== null){
		if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			data = data.substring(1,data.length - 1);
		}
	}
	return data;
}
function processDataLeadbyZero(data){
	var result;
	if(data !== undefined && data !== null){
		if(data.indexOf('="') === 0 && data.lastIndexOf('"') === data.length - 1){
			result = data.substring(2,data.length - 1);
		}
		else if(data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1){
			result = data.substring(1,data.length - 1);
		}
		else
		{
			result = data;
		}
	}
	return result;
}
function getBusinessCode(){
	var conn = $.db.getConnection();
	var id;
	var sequence = 'call "cdp.ebgcfe.procedures.pkg_ui.upload::getBusinessCode"(?)';
	var sequenceStmt = conn.prepareCall(sequence);
	sequenceStmt.execute();
	id = sequenceStmt.getInteger(1);
	sequenceStmt.close();
	conn.close();
	return id;
}

function LTrim(str){ 
	var i; 
	for(i=0; i<str.length;i++){
		if(str.charAt(i)!== " ") 
		{
			break; 
		}
	} 
	str = str.substring(i,str.length); 
	return str; 
} 
