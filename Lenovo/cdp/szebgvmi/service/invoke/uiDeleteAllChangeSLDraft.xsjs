var json=JSON.parse(decodeURI($.request.body.asString()));

var body;
var query;
var conn = $.db.getConnection();


	try
	{
		query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::deleteAllDraft"(?)';

		var pcall = conn.prepareCall(query);
		pcall.setString(1,'');
		pcall.execute();
		pcall.close();
		conn.commit();
		conn.close();
		body = 'All \'DRAFT\' records have been deleted!';
		$.response.status = $.net.http.OK;
	}

	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		body = 'Error when delete data.';
	}

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);


