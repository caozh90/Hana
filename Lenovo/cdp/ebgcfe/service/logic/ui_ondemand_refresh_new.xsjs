/************************************************************************
*name       :      
*function   :call ds for ui_ondemand_refresh
*input      ：
*output     :
*author     :shangqian
*CreateDate :2015-01-20
*UpdateDate :
*************************************************************************/
/*2015-01-29 add authorization judge*/
function assertAppRole(role){
	var query = 'call "SECURITY"."cdp.security.procedures::checkPrivilege"(?,?)';
	var conn = $.db.getConnection();
	var stmt = conn.prepareCall(query);
	stmt.setNString(1,role);
	stmt.execute();
	var result = stmt.getNString(2);
	return result;
}

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

var log_on_body;
var log_on_response;
var run_body;
var run_response;

var sessionID = '';
var product_group = 'EBG';
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
	
	//$.response.setBody("Finished! You can check the result::"+run_response.body.asString());
		
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
	//var off_response = client.getResponse();
	
	/*return control_point_status to UI*/
	/*var sql = "select top 1 control_point_status from \"_SYS_BIC\".\"cdp.ebgcfe.models.ds/AT_UI_CONTROL_POINT\" where control_point='BAKE'";
	var pcall_status = conn.prepareStatement(sql);
	var rs_status = pcall_status.executeQuery();
	rs_status.next();
    var control_point_status = rs_status.getNString(1);
	
	$.response.setBody(control_point_status);*/
	$.response.setBody(errorMessage);
	if(errorMessage === 'SUCCESSFUL')
	{
		$.response.status = $.net.http.OK;
	}
	else
	{
		$.response.status = $.net.http.BAD_REQUEST;
	}
	
}
if (assertAppRole('ui_management_center::executable') !== 'OK')
{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Not Authorized, no execute privilege');
}
else 
{
	/*1. get data from UI*/
	var change_id = String($.request.parameters.get("event_name"));
	var process_name = String($.request.parameters.get("process_name"));
	var model = String($.request.parameters.get("model"));
	var family = String($.request.parameters.get("family"));
	
	/*1.5 insert Model and Family to ui_ondemand_refresh*/
	/*if(process_name === 'ONDEMAND_CALCULATION' || process_name === 'ONDEMAND_MODELIST')
	{
		var model = String($.request.parameters.get("model"));
		var family = String($.request.parameters.get("family"));
		var model_array = [];
         
		if (model !== '')
		{
			model_array = model.split(",");
		}
		else if(family !== '')
		{
			//read and insert item from ui_item according to family.
			var conn1 = $.db.getConnection();
			var sql_r = "select distinct item from EBGCFE.\"UI_ITEM\" where ASP_PRD_FAMILY=\'" + family + "\'";
			var pstmt = conn1.prepareStatement(sql_r);
			var rs=pstmt.executeQuery();
			
			while(rs.next()){
				model_array.push(rs.getString(1));	
			}
			
			rs.close();
			conn1.close();
		}
		
		if(model_array.length > 0)
		{
			var conn2 = $.db.getConnection();
			var i, pstmt, sql;
			var ondemand_type;
	        
	        if(process_name === 'ONDEMAND_CALCULATION')
	        {
	        	ondemand_type = 'COST_BOM';
	        }
	        else	        	
	        {
	        	ondemand_type = 'MODEL_LIST';
	        }
	        
			sql = "INSERT INTO EBGCFE.\"UI_ONDEMAND_REFRESH\"(PRODUCT_GROUP, ONDEMAND_TYPE, ITEM, PROD_FAMILY, EVENT_NAME, MESSAGE, SYS_CREATED_BY, SYS_CREATED_DATE)" +
			"VALUES(?,?,?,?,?,?,?,CURRENT_TIMESTAMP)";
			
			pstmt = conn2.prepareStatement(sql); 
			
			if(model_array.length > 1){
				//if the length is 1, don't use batch insert
				pstmt.setBatchSize(model_array.length);
			}
			
		    for(i = 0; i < model_array.length; i++){
		    	pstmt.setString(1, 'EBG');
		    	pstmt.setString(2, ondemand_type);
		    	pstmt.setString(3, model_array[i]);
		    	pstmt.setString(4, family);
		    	pstmt.setString(5, change_id);
		    	pstmt.setString(6, 'SUCCESS');
		    	pstmt.setString(7, $.session.getUsername());        
		        if(model_array.length > 1){
		        	pstmt.addBatch();
		        }		              
		    }
		    
		    if(model_array.length > 1)
		    {
		    	pstmt.executeBatch();
		    }
		    else
		    {
		    	pstmt.execute();
		    }		    
		    conn2.commit();
		    conn2.close();
		}		
	}*/

	/*2. get DS server info*/
	//query = 'select top 1 * from "DS_INFO"."HANA_DS_CON_INFO"';
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
	
	/*3. log on DS server*/
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
	
	/*4 get DS job info*/
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
	
	/*send request to DS server with parameters*/
	if(server_group  !== null && server_group.length > 0)
	{	
		var run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
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
			  +'\n'+'<variable name="G_PRODUCT_GROUP">'+product_group+'</variable>'
			  +'\n'+'<variable name="G_CHANGE_ID">'+change_id+'</variable>'
			  +'\n'+'<variable name="G_USER_ID">'+user_id+'</variable>'
			  +'\n'+'<variable name="G_MODEL">'+model+'</variable>'
			  +'\n'+'<variable name="G_FAMILY">'+family+'</variable>'
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
			  +'\n'+'<variable name="G_PRODUCT_GROUP">'+product_group+'</variable>'
			  +'\n'+'<variable name="G_CHANGE_ID">'+change_id+'</variable>'
			  +'\n'+'<variable name="G_USER_ID">'+user_id+'</variable>'
			  +'\n'+'<variable name="G_MODEL">'+model+'</variable>'
			  +'\n'+'<variable name="G_FAMILY">'+family+'</variable>'
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



