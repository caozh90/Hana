var username = $.session.getUsername();

	if (username !== "") {

	username = '';
	var conn = $.db.getConnection();
	var pcall;
	var pcall2;
	var body;
	var body2; 
	var error_message;
	var error_message2;
	var p_out_exitcode = -1 ;
	var p_out_exitcode2 = -1 ;
	
	var query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_report::PRC_INTERLOCK"(?)';
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
	
	var query2 = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_report::PRC_LEADTIME"(?)';
	try
	{
		pcall2 = conn.prepareCall(query2);
		
		p_out_exitcode2 = Number(pcall2.execute( ));
		pcall2.close();
		body2 = 'Finished! You can check the result on HANA';
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{	
		error_message2 = e.message;
		//替换单引号'
		while(error_message2.indexOf("'") >0 ) {
			error_message2 = error_message2.replace('\'','"'); 
		}
		$.response.status = $.net.http.BAD_REQUEST;
		body2 = e.message;
	}
	conn.commit();
	conn.close();
	
	if (p_out_exitcode === -1 || p_out_exitcode2 === -1){
		p_out_exitcode = -1;
	}
	
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(JSON.stringify(p_out_exitcode) );
	
	

}
