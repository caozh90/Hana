var username = $.session.getUsername();
var json=JSON.parse($.request.body.asString());
var TABLENAME = json.table_name;
var REPORT_NAME = json.report_name;

if (username !== "") {

	if(TABLENAME !== undefined)
	{
		var conn = $.db.getConnection();
		var body;
		var error_message;
		var pcall;
		var query = '';
		
		query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.ui_common::ui_table_delete_all_report_name"(?,?)';
		
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,TABLENAME);
			pcall.setString(2,REPORT_NAME);
			
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
	}
	else
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = "Missing table name";
	}
	

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
	
	

}
