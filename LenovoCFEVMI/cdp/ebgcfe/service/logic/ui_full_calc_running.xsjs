var username = $.session.getUsername();

if (username !== "") {


	var conn = $.db.getConnection();
	var body;
	var error_message;
	var pcall;
	
	
	var query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_cal::PRC_IF_FULL_CALC_RUNNING"(?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.execute();
		
		body = pcall.getInt(1);
		
		pcall.close();
		
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{	
		error_message = e.message;
		//替换单引号'
		while(error_message.indexOf("'") >0 ) {
			error_message = error_message.replace('\'','"'); 
		}
		$.response.status = $.net.http.BAD_REQUEST;
		body = e.message;
	}
	
	conn.commit();
	conn.close();
	
	

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
	
	

}
else
{
	$.response.status = $.net.http.BAD_REQUEST;
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody("User Session Missing");
}

