var username = $.session.getUsername();

	if (username !== "") {

	username = '';
	var conn = $.db.getConnection();
	var pcall;
	var body;
	var error_message;
	var STEP= Number($.request.parameters.get("STEP"));
	
	var query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.ui_mfi_ppn::setSteps"(?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setInteger(1,STEP);
		
		pcall.execute();
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
	$.response.setBody(JSON.stringify(body));
	
	

}
