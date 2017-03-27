/*2014-11-3 shangq & fangyuan access web dispatcher and read logs into a string,
 * then split the string and handle all kinds of fields into hana db.
 */

function allPathModule(module,pack){
	var conn = $.db.getConnection();
	var pstmt = conn.prepareStatement("select module_name,replace(module_path,'.','/') from \"SECURITY\".\"cdp.security.data::userManagement.INFO_MODULE\"");
	var rs=pstmt.executeQuery();
		
	while(rs.next()){
		module.push(rs.getString(1));
		pack.push(rs.getString(2));	
	}
	
	rs.close();
	pstmt.close();
	conn.close();
}

/*
function getUrl(){
	var conn = $.db.getConnection();
	var pstmt = conn.prepareStatement("SELECT host FROM SYS.M_DATABASE");
			//"SELECT value FROM SYS.M_HOST_INFORMATION where key='net_ip_addresses'"
	var rs=pstmt.executeQuery();
	rs.next();
	var ip=rs.getString(1);

	pstmt = conn.prepareStatement("SELECT value FROM PUBLIC.M_SYSTEM_OVERVIEW where name='Instance Number'");
	rs=pstmt.executeQuery();
	rs.next();
	var instance=rs.getString(1);
	
	rs.close();
	pstmt.close();
	conn.close();
	
	return 'http://'+ip+':80'+instance+'/sap/hana/xs/wdisp/admin/download?ftype=2&hdlsel=';
}
*/
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
	else
	{
		pstmt = conn.prepareStatement("SELECT host FROM SYS.M_DATABASE");
		//"SELECT value FROM SYS.M_HOST_INFORMATION where key='net_ip_addresses'"
		rs=pstmt.executeQuery();
		rs.next();
		var ip=rs.getString(1);
		
		pstmt = conn.prepareStatement("SELECT value FROM PUBLIC.M_SYSTEM_OVERVIEW where name='Instance Number'");
		rs=pstmt.executeQuery();
		rs.next();
		var instance=rs.getString(1);
		log_url = 'http://'+ip+':80'+instance+'/sap/hana/xs/wdisp/admin/download?ftype=2&hdlsel=';
	}
	
	rs.close();
	pstmt.close();
	conn.close();
	return log_url;
}

function insertData()
{
	
	var client = new $.net.http.Client();
	//var req = new $.web.WebRequest($.net.http.GET, "");
	//req.headers.set("Authorization","Basic aWNtYWRtOkljbVdkaXNwQWQxMjM=");
		
	//var dest = $.net.http.readDestination("cdp.log.dest", "wdisp"); 
	//var req = new $.web.WebRequest($.net.http.GET, "/sap/hana/xs/wdisp/admin/download?ftype=2&hdlsel="); 
	//client.request(req, dest); 
	var url=getUrl();
	
	var req = new $.web.WebRequest($.net.http.GET,"/");
	client.request(req, url);
	var response = client.getResponse();
	var batch_length = 0; //定义batch操作的SP数量
	
	if(response.body)
	{
		//the records in the string should not exceed 2,000,000, or the string memory out.
		var body =  response.body.asString();

		var logs = body.split("[");
		logs.shift();
		
		var conn = $.db.getConnection();
		var i,j, record, accessTime, ipAddress, first, second, uri, uris, action,username,other,usernamestart,module;
		var path, version, tailStr, lastNumbers, code, length, duration, sql, pstmt;
		
		sql = "INSERT INTO EX_LOG.\"cdp.log.data::Logs.HTTP_LOG_FILE\"(LOGSID,ACCESS_TIME,REMOTE_HOST,USER_NAME,HTTP_REQUEST_METHOD,HTTP_REQUEST_PATH,HTTP_REQUEST_VERSION," +
		"HTTP_RESPONSE_CODE,HTTP_RESPONSE_LENGTH,HTTP_REQUEST_DURATION,MODULE) " +
		"VALUES(EX_LOG.\"cdp.log.data::logKeyId\".NEXTVAL,TO_TIMESTAMP(?,'DD/MON/YYYY:HH24:MI:SS'),?,?,?,?,?,?,?,?,?)";
		
		pstmt = conn.prepareStatement(sql); 
		if(logs.length > 0){
			
		if(logs.length!== 1){
				//if the length is 1, don't use batch insert
				pstmt.setBatchSize(logs.length);

		}	
			
			
		var packs=[];
		var modules=[];
		allPathModule(modules,packs);// determine the packages of the user 
		for(i = 0; i < logs.length; i++)
		{
			record= logs[i];
			accessTime = record.match(/\d+\/[A-Za-z]+\/\d+:\d+:\d+:\d+/);			
			ipAddress = record.match(/\d+\.\d+\.\d+\.\d+/);
			
			first = record.indexOf('"');
			second = record.lastIndexOf('"');
			uri = record.substring(first + 1, second);
			uris = uri.split(" ");
			action = uris[0];
			path = uris[1];
			version = uris[2];
			
			other = record.substring(0, first-3);
			usernamestart = other.lastIndexOf(" ");
			username=other.substring(usernamestart+1,other.length);
			
			tailStr = record.substring(second + 2, record.length);		
			lastNumbers = tailStr.split(" ");
			code = lastNumbers[0];
			length = lastNumbers[1];
			duration = lastNumbers[2];
			
			module="OTHERS";
			for(j=0;j<modules.length;j++){
				if(path.indexOf(String(packs[j]))>-1){
					module=modules[j];
					continue;
				}
			}
			if(module === 'OTHERS')
			{
				continue;
			}
			pstmt.setString(1,String(accessTime));//accessTime
			pstmt.setString(2,String(ipAddress));//remote_host
			pstmt.setString(3,username);//user_name
			pstmt.setString(4,action);//http_request_method
			pstmt.setString(5,path);//http_request_path
			pstmt.setString(6,version);//http_request_version
			pstmt.setString(7,code);//http_response_code
			pstmt.setInteger(8,Number(length));//http_response_length
			pstmt.setInteger(9,Number(duration));//http_response_duration
			pstmt.setString(10,module);//module
			
			if(logs.length!== 1){ 
					pstmt.addBatch();   
			}
			batch_length = batch_length+1;
		}
		
		if(batch_length>1){
			//if the length is 1, don't use batch insert
			pstmt.setBatchSize(batch_length);
			pstmt.executeBatch();
		}
		if(batch_length === 1)
		{
			pstmt.execute();
		}	
	}

		conn.commit();
		conn.close();			
	}
	
}

insertData();
