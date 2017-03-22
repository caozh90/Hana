
var conn = $.db.getConnection();
var pcall ;
var body  ;
var rs ;
var error_message;
	var query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.ui_management_center::updateUiControlPoint" (?)';
		try{
			pcall = conn.prepareCall(query);
			pcall.execute();
			body = pcall.getString(1);
			pcall.close();
			//body = 'Finished! You can check the result on HANA';
			
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
