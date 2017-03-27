var username = $.session.getUsername();
var json=JSON.parse($.request.body.asString());
var data = json.data;
var i;


if (username !== "") {

	
		
		var hconn = $.hdb.getConnection();
		var body = 'Success';
		var error_message;
		var pcall;
		var query = '';
		
	
		if (data.length > 0){				
			
			try
			{
				var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.ui_xoutfr_rate::updateUiXoutfrRateBatch');
				var result = callProcedure(data);				
				
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
			
			if(result.ERRORINFO[0].ERROR_MESSAGE !== 'SUCCESS'){
				$.response.status = $.net.http.BAD_REQUEST;
			}
			body = result.ERRORINFO[0].ERROR_MESSAGE;
			
			
			hconn.commit();
			hconn.close();
		}

	
	

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
	
	

}
