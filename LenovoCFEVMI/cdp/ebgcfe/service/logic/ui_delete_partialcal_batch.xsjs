var username = $.session.getUsername();
var json=JSON.parse($.request.body.asString());
var TABLENAME = json.table_name;
var data = json.condition;
var where_clause = '';
var i;


if (username !== "") {

	if(TABLENAME !== undefined)
	{
		var conn = $.db.getConnection();
		var hconn = $.hdb.getConnection();
		var body;
		var error_message;
		var pcall;
		var query = '';
		
		for(i=0;i<data.length;i++)
		{
			if(i > 0){
				where_clause += ' OR ';
			}
			where_clause += '(' + data[i].KEY + ' = \'' + data[i].VAL + '\')';			
			
		}
		
		if (data.length > 0){				
			
			try
			{
				var callProcedure = hconn.loadProcedure('EBGCFE', 'cdp.ebgcfe.procedures.pkg_ui.ui_partial_cal::recLogUiPartialCal');
				var result = callProcedure(data);
				
				if(result.ERRORINFO[0].ERROR_MESSAGE === 'SUCCESS'){
					
					query = 'CALL "EBGCFE"."cdp.ebgcfe.procedures.pkg_ui.ui_common::ui_table_delete_batch"(?,?)';
					
					pcall = conn.prepareCall(query);
					pcall.setString(1,TABLENAME);
					pcall.setString(2,where_clause);
					
					pcall.execute();
					pcall.close();
					body = 'Finished! You can check the result on HANA';
					$.response.status = $.net.http.OK;
				}
				
				
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
			
			hconn.commit();
			hconn.close();	
			conn.commit();
			conn.close();
		}

	}
	else
	{
		$.response.status = $.net.http.BAD_REQUEST;
		body = "Missing table name";
	}
	

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
	
	

}
