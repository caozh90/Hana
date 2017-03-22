var username = $.session.getUsername();

	if (username !== "") {

	username = '';
	var conn = $.db.getConnection();
	var pcall;
	var body;
	var error_message;
	var p_out_exitcode = -1 ;
	
	var query = 'CALL "EBGDF"."lcpe.ebgdf.procedures.pkg_report::PRC_CONSOLIDATION"(?)';
	try
	{
		pcall = conn.prepareCall(query);
		
		p_out_exitcode = Number(pcall.execute( ));
		pcall.close();
		body = 'Finished! You can check the result on HANA';
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
	$.response.setBody(JSON.stringify(p_out_exitcode) );
	
	

}
