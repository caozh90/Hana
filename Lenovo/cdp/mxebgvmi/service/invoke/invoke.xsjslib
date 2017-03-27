function checkPrivilege(privilege){
	var conn = $.db.getConnection();
	var cstmt=conn.prepareCall('call "SECURITY"."cdp.security.procedures::checkPrivilege" (?,?)');
	cstmt.setNString(1,privilege);
	cstmt.execute();
	var result=cstmt.getNString(2);
	
	conn.commit();
	cstmt.close();
	conn.close();
	
	return result;
}