
function allPathModule(module,pack){
	var conn = $.db.getConnection();
	var pstmt = conn.prepareStatement("select module_name,replace(module_path,'.','/') from \"SECURITY\".\"cdp.security.data::userManagement.INFO_MODULE\"");
	var rs=pstmt.executeQuery();
		
	while(rs.next()){
		module.push(rs.getString(1));
		pack.push(rs.getString(2));	
	}
	
	rs.close();
	pstmt.close();
	conn.close();
}

