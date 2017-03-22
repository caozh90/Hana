/************************************************************************
* Created by zhangzj6
* 2016-07-21
* to call DS job or download data form tabel:rpt_forecast_volume_his
*                                            rpt_actual_volume_his
* for SR: WO0000000280686(tuyn1)
*************************************************************************/
	//DS info
	var query = '';
	var conn = $.db.getConnection();

	var host;
	var webserver_port;
	var url_path_postfix;
	var url; // host + webserver_port + url_path_postfix
	var cms_port;
	var cms_authentication;
	var cms_system;
	var repo_name;
	var job_server;
	var server_group;
	var DS_server;
	var userName;
	var passwd;

	//DS job info
	var job_name;
	var G_JOB_INIT_FLAG;
	var G_DEBUG;
	var G_STARTFROMSTEP;
	var G_IVID;
	var G_WFNAME;

	var client;
	var req;
	var run_body;

	var log_on_body;
	var log_on_response;
	var run_body;
	var run_response;

	var sessionID='';
	var process_name='SW_ORI';
	var user_id = $.session.getUsername();

function run_job()
{
	req.setBody(run_body);
	req.headers.set('SOAPAction','jobAdmin=Run_Batch_Job');
	
	client.request(req,url);
	run_response = client.getResponse();
	
	var run_str = run_response.body.asString();	
	var errorMessage = '';
	var error_pos1 = run_str.indexOf('<errorMessage/>');
	if(error_pos1 < 0)
	{
		error_pos1 = run_str.indexOf('<errorMessage>');
		var error_pos2 = run_str.indexOf('</errorMessage>');
		errorMessage = run_str.substring(error_pos1 + 14,error_pos2);
		
		if(errorMessage === '')
		{
			errorMessage = 'SUCCESSFUL';
		}
	}
	else
	{
		errorMessage = 'SUCCESSFUL';
	}
	
	//$.response.status = $.net.http.OK;
		
	var logoff_body='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		+'\n'+'<soapenv:Header>'
		+'\n'+'<ser:session>'
		+'\n'+'<SessionID>'+sessionID+'</SessionID>'
		+'\n'+'</ser:session>'
		+'\n'+'</soapenv:Header>'
		+'\n'+'<soapenv:Body>'
		+'\n'+'<ser:Logout_Input/>'
		+'\n'+'</soapenv:Body>'
		+'\n'+'</soapenv:Envelope>';
	
	req.setBody(logoff_body);
	req.headers.set('SOAPAction','function=Logout');
	
	client.request(req,url);

	$.response.setBody(errorMessage);
	$.response.status = $.net.http.OK;
}

function call_DS(){
	
	//2. get DS server info	
	query = 'select top 1 * from "_SYS_BIC"."cdp.ds.models/AT_HANA_DS_CON_INFO"';
	var pcall = conn.prepareStatement(query);
	var rs = pcall.executeQuery();
	
	if(rs.next())
	{
		//Step1 拼写URL
		host = rs.getNString(1);
		webserver_port = rs.getNString(2);
		url_path_postfix = rs.getNString(3);
		url = 'http://'+ host +':'+ webserver_port + url_path_postfix;
		
		cms_port = rs.getNString(4);
		cms_system = host+':'+cms_port;
		
		userName = rs.getNString(5);
		
		passwd = rs.getNString(6);
		cms_authentication = rs.getNString(8);
		repo_name = rs.getNString(9);
		job_server = rs.getNString(10);
		server_group = rs.getNString(11);
		//JOBSERVER和SERVERGROUP任选一个	
	}
	
	//3. log on DS server
	log_on_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		   +'\n'+'<soapenv:Header/>'
	+'\n'+'<soapenv:Body>'
	+'\n'+'<ser:LogonRequest>'
	+'\n'+'<username>'+userName+'</username>'
	+'\n'+' <password>'+passwd+'</password>'
	+'\n'+'<cms_system>'+cms_system+'</cms_system>'
	+'\n'+' <cms_authentication>'+cms_authentication+'</cms_authentication>'
	+'\n'+'</ser:LogonRequest>'
	+'\n'+'</soapenv:Body>'
	+'\n'+'</soapenv:Envelope>';
	
	client = new $.net.http.Client();
	req =new $.web.WebRequest($.net.http.POST,'');
	req.setBody(log_on_body);
	req.headers.set('SOAPAction','function=Logon');
	client.request(req,url);
	
	log_on_response = client.getResponse();
	var temp = log_on_response.body.asString();
	var pos1 = temp.indexOf('<SessionID>');
	var pos2 = temp.indexOf('</SessionID>');
	sessionID = temp.substring(pos1+11,pos2);
	
	
	//4 get DS job info
	query = 'select * from "_SYS_BIC"."cdp.ds.models/AT_HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
	var pcall_job = conn.prepareStatement(query);
	var rs_job = pcall_job.executeQuery();
	if(rs_job.next())
	{
		job_name = rs_job.getNString(2);
		G_JOB_INIT_FLAG = rs_job.getNString(3);
		G_DEBUG = rs_job.getNString(4);
		G_STARTFROMSTEP = rs_job.getNString(5);
		G_IVID = rs_job.getNString(6);
		G_WFNAME = rs_job.getNString(7);
	}
	
	
	//send request to DS server with parameters
	if(server_group  !== null && server_group.length > 0)
	{	
		run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
			  +	'xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
			  +'\n'+'<soapenv:Header>'
			  +'\n'+'<ser:session>'
			  +'\n'+'<SessionID>'+sessionID+'</SessionID>'
			  +'\n'+'</ser:session>'
			  +'\n'+'</soapenv:Header>'
			  +'\n'+'<soapenv:Body>'
			  +'\n'+'<ser:RunBatchJobRequest>'
			  +'\n'+'<jobName>'+job_name+'</jobName>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<repoName>'+repo_name+'</repoName>'
			  +'\n'+'<!--You have a CHOICE of the next 2 items at this level-->'
			  +'\n'+'<serverGroup>'+server_group+'</serverGroup>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<globalVariables>'
			  +'\n'+'<!--Zero or more repetitions:-->'
			  +'\n'+'<variable name="G_JOB_INIT_FLAG">'+G_JOB_INIT_FLAG+'</variable>'
			  +'\n'+'<variable name="G_DEBUG">'+G_DEBUG+'</variable>'
			  +'\n'+'<variable name="G_IVID">'+G_IVID+'</variable>'
			  +'\n'+'<variable name="G_STARTFROMSTEP">'+G_STARTFROMSTEP+'</variable>'
			  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
			  /***************************UI parameters************************************/

			  /***************************************************************************/
			  +'\n'+'<variable name="G_USERNAME">'+$.session.getUsername()+'</variable>'
			  +'\n'+'</globalVariables>'
			  +'\n'+'</ser:RunBatchJobRequest>'
			  +'\n'+'</soapenv:Body>'
			  +'\n'+'</soapenv:Envelope>';
		
		run_job();		
		//$.response.setBody("Finished! You can check the result::"+job_name);
	}
	else if(job_server !== null && job_server.length > 0)
	{
		run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
			  +	'xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
			  +'\n'+'<soapenv:Header>'
			  +'\n'+'<ser:session>'
			  +'\n'+'<SessionID>'+sessionID+'</SessionID>'
			  +'\n'+'</ser:session>'
			  +'\n'+'</soapenv:Header>'
			  +'\n'+'<soapenv:Body>'
			  +'\n'+'<ser:RunBatchJobRequest>'
			  +'\n'+'<jobName>'+job_name+'</jobName>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<repoName>'+repo_name+'</repoName>'
			  +'\n'+'<!--You have a CHOICE of the next 2 items at this level-->'
			  +'\n'+'<jobServer>'+job_server+'</jobServer>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<globalVariables>'
			  +'\n'+'<!--Zero or more repetitions:-->'
			  +'\n'+'<variable name="G_JOB_INIT_FLAG">'+G_JOB_INIT_FLAG+'</variable>'
			  +'\n'+'<variable name="G_DEBUG">'+G_DEBUG+'</variable>'
			  +'\n'+'<variable name="G_IVID">'+G_IVID+'</variable>'
			  +'\n'+'<variable name="G_STARTFROMSTEP">'+G_STARTFROMSTEP+'</variable>'
			  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
			  /***************************UI parameters**********************************/
			  
			  /***************************************************************************/
			  +'\n'+'<variable name="G_USERNAME">'+$.session.getUsername()+'</variable>'
			  +'\n'+'</globalVariables>'
			  +'\n'+'</ser:RunBatchJobRequest>'
			  +'\n'+'</soapenv:Body>'
			  +'\n'+'</soapenv:Envelope>';
		
		run_job();
		//$.response.setBody(run_body);
		//$.response.status = $.net.http.OK;
	}
	else//JOBSERVER和SERVERGROUP至少一个不能为null
	{
		$.response.setBody('JOBSERVER and SERVERGROUP are null');
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	}
	
}


function download(){
	var query1;
	var body1 = '';
	var query2;
	var body2 = '';
	
	body1 += "CYCLE" + "\t" + "PRODUCT_GROUP" + "\t" + "PART_NUMBER" + "\t" + "COMMODITY_CODE" + "\t" + "DESCRIPTION" + "\t" +
	         "PLANT" + "\t" + "SUBGEO" + "\t" + "M1" + "\t" + "M2" + "\t" + "M3" + "\t" + "M4" + "\t" + "M5" + "\t" + "M6" + "\t" + "M7" + "\t" + "M8" + "\t" + "M9" + "\t" +
	         "M10" + "\t" + "M11" + "\t" + "M12" + "\t" + "START_MONTH" + "\t" +
	         "SYS_CREATED_DATE" + "\t" + "VERSION" + "\n";
	
	body2 += "CYCLE" + "\t" + "PRODUCT_GROUP" + "\t" + "PART_NUMBER" + "\t" + "COMMODITY_CODE" + "\t" + "DESCRIPTION" + "\t" +
             "PLANT" + "\t" + "SUBGEO" + "\t" + "M1" + "\t" + "M2" + "\t" + "M3" + "\t" + "M4" + "\t" + "M5" + "\t" + "M6" + "\t" + "M7" + "\t" + "M8" + "\t" + "M9" + "\t" +
             "M10" + "\t" + "M11" + "\t" + "M12" + "\t" + "START_MONTH" + "\t" +
             "SYS_CREATED_DATE" + "\t" + "VERSION" + "\n";

	
	var exporttime = $.request.parameters.get("exporttime");
	if(exporttime === null){
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('Please Input the Export Time');
	}else{	
	
	try{
		query1 = "SELECT \"CYCLE\", \"PRODUCT_GROUP\", \"PART_NUMBER\", \"COMMODITY_CODE\", \"DESCRIPTION\", \"PLANT\", \"SUBGEO\", \"M1\"," +
				" \"M2\", \"M3\", \"M4\", \"M5\", \"M6\", \"M7\", \"M8\", \"M9\", \"M10\", \"M11\", \"M12\", \"START_MONTH\", " +
				"to_varchar(\"SYS_CREATED_DATE\",'YYYY-MM-DD'), to_varchar(\"VERSION\",'YYYY-MM-DD') from" + 
		        "\"_SYS_BIC\".\"cdp.ebgcfe.models.rpt_volume_report/CV_RPT_FORECAST_VOLUME_HIS\" where( \"VERSION\" = " + "'" + exporttime + "'" + ")";
		var conn1 = $.db.getConnection();
		var stmt1 = conn1.prepareStatement(query1);
		var rs = stmt1.executeQuery();
		while(rs.next()){
			
			body1 += rs.getNString(1) + "\t" + 
	                 rs.getNString(2) + "\t" +
	                 rs.getNString(3) + "\t" +
	                 rs.getNString(4) + "\t" +
	                 rs.getNString(5) + "\t" +
	                 rs.getNString(6) + "\t" + 
		             rs.getNString(7) + "\t" +
		             rs.getNString(8) + "\t" +
		             rs.getNString(9) + "\t" +
		             rs.getNString(10) + "\t" +
		             rs.getNString(11) + "\t" +
	                 rs.getNString(12) + "\t" +
	                 rs.getNString(13) + "\t" +
	                 rs.getNString(14) + "\t" +
	                 rs.getNString(15) + "\t" + 
		             rs.getNString(16) + "\t" +
		             rs.getNString(17) + "\t" +
		             rs.getNString(18) + "\t" +
		             rs.getNString(19) + "\t" +
		             rs.getNString(20) + "\t" +
		             rs.getNString(21) + "\t" +
	                 rs.getNString(22) + "\n";						
		}
		
	}catch(e){
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
	
	try{
		query2 = "SELECT \"CYCLE\", \"PRODUCT_GROUP\", \"PART_NUMBER\", \"COMMODITY_CODE\", \"DESCRIPTION\", \"PLANT\", \"SUBGEO\", \"M1\"," +
		         " \"M2\", \"M3\", \"M4\", \"M5\", \"M6\", \"M7\", \"M8\", \"M9\", \"M10\", \"M11\", \"M12\", \"START_MONTH\", " +
		         "to_varchar(\"SYS_CREATED_DATE\",'YYYY-MM-DD'), to_varchar(\"VERSION\",'YYYY-MM-DD') from" + 
                 "\"_SYS_BIC\".\"cdp.ebgcfe.models.rpt_volume_report/CV_RPT_ACTUAL_VOLUME_HIS\" where( \"VERSION\" = " + "'" + exporttime + "'" + ")";
		var conn2 = $.db.getConnection();
		var stmt2 = conn2.prepareStatement(query2);
		var rs1 = stmt2.executeQuery();
		while(rs1.next()){
			
			body2 += rs1.getNString(1) + "\t" + 
                     rs1.getNString(2) + "\t" +
                     rs1.getNString(3) + "\t" +
                     rs1.getNString(4) + "\t" +
                     rs1.getNString(5) + "\t" +
                     rs1.getNString(6) + "\t" + 
                     rs1.getNString(7) + "\t" +
                     rs1.getNString(8) + "\t" +
                     rs1.getNString(9) + "\t" +
                     rs1.getNString(10) + "\t" +
                     rs1.getNString(11) + "\t" +
                     rs1.getNString(12) + "\t" +
                     rs1.getNString(13) + "\t" +
                     rs1.getNString(14) + "\t" +
                     rs1.getNString(15) + "\t" + 
                     rs1.getNString(16) + "\t" +
                     rs1.getNString(17) + "\t" +
                     rs1.getNString(18) + "\t" +
                     rs1.getNString(19) + "\t" +
                     rs1.getNString(20) + "\t" +
                     rs1.getNString(21) + "\t" +
                     rs1.getNString(22) + "\n";						
		}
		
	}catch(e){
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
	
	
	var zip = new $.util.Zip();
	zip['forecast_volume.xls'] = body1;
	zip['actual_volume.xls'] = body2;
	$.response.setBody(zip);
	$.response.contentType = 'application/zip';
	$.response.headers.set('Content-Disposition', 'attachment; filename=VolumeReport.zip');
	$.response.status = $.net.http.OK;
	
	}
}


var action = $.request.parameters.get("cycle");

switch (action){
case 'CURRENT':
	call_DS();
	break;
case 'HISTORY':
	download();
	break;
}