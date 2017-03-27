var username = $.session.getUsername();

	if (username !== "") {

	username = '';
	var conn = $.db.getConnection();
	var body;
	var error_message;
	var pcall;
	var TABLENAME= String($.request.parameters.get("table_name"));
	
	var query = 'CALL "EBGDF"."cdp.ebgdf.procedures.pkg_ui.ui_common::ui_delete_all"(?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,TABLENAME);
		
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
