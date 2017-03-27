function getUrl()
{
	var conn = $.db.getConnection();
	//IP+PORT or HOSTNAME
	var pstmt = conn.prepareStatement('SELECT HOSTNAME,HOST,PORT,URL_PATH_POSTFIX,PORT_VALIDATED FROM "EX_LOG"."cdp.log.data::Logs.LOG_FILE_CONF" WHERE STATUS=1');
	var rs = pstmt.executeQuery();
	var log_url;
	if(rs.next())
	{
		var port_validated = rs.getInteger(5);
		var url_path_postfix = rs.getNString(4);
		if(port_validated === 1)//使用IP+PORT
		{
			var host = rs.getNString(2);
			var port = rs.getNString(3);
			log_url = 'http://'+host+':'+port+url_path_postfix;
		}
		else
		{
			var hostname = rs.getNString(1);
			log_url = 'http://'+hostname+url_path_postfix;
		}
	}
	return log_url;
}

var url = getUrl();

$.response.setBody(url);