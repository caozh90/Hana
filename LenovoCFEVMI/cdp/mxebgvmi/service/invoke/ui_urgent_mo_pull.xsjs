var json=JSON.parse(decodeURI($.request.body.asString()));

//var tableName = json.tablename;
var job_type = json.JOB_TYPE;
//var columns = json.columns;
var query = '';
var conn = $.db.getConnection();
var pcall ;
var body;


/*
 * 调用UI_URGENT_MO_PULL页面的DS
 */

//获取任务类型和流程名
var process_name = json.PROCESS_NAME;
var TABLE_NAME = 'MXEBGVMI.UI_URGENT_MO_PULL';
var SEGMENT_NAME = 'STATUS'; //需要更新的字段

var status = 'RUNNING';
//DS info
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

var sessionID='';
var current_user;
//获取session的user
var user_sql = 'select session_user from dummy';
var pcall_user = conn.prepareStatement(user_sql);
var rs_user = pcall_user.executeQuery();
if(rs_user.next())
{
	current_user = rs_user.getNString(1);
}
rs_user.close();
pcall_user.close();


function run_job()
{
	req.setBody(run_body);
	req.headers.set('SOAPAction','jobAdmin=Run_Batch_Job');
	
	client.request(req,url);
	run_response = client.getResponse();
	
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
//	var off_response = client.getResponse();
	
	body = 'Finished! You can check the result.';
	$.response.status = $.net.http.OK;
}

//调用DS的主函数
function trigger()
{

		query = 'select top 1 * from "_SYS_BIC"."cdp.ds.models/AT_HANA_DS_CON_INFO"';
		var pcall_ds = conn.prepareStatement(query);
		var rs = pcall_ds.executeQuery();
		
		if(rs.next())
		{
			//Step1. 拼写URL
			host = rs.getNString(1);
			webserver_port = rs.getNString(2);
			url_path_postfix = rs.getNString(3);
			url = 'http://'+ host +':'+ webserver_port + url_path_postfix;
			//Step2.拼写cms_system
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

		//Log on
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
		
		//修改表中对应记录的状态值	
		var update_query,pcall_update;
		update_query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::ui_urgent_mo_pull_run"()';
		try
		{
			pcall_update = conn.prepareCall(update_query);
			pcall_update.execute();
			conn.commit();
		}
		catch(e)
		{
			body = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			return;
		}
			
		
		var temp2 = log_on_response.body.asString();
		var pos1 = temp2.indexOf('<SessionID>');
		var pos2 = temp2.indexOf('</SessionID>');
		sessionID = temp2.substring(pos1+11,pos2);
		
		//query = 'select top 1 * from "DS_INFO"."HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
		query = 'select top 1 * from "_SYS_BIC"."cdp.ds.models/AT_HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
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

		if(server_group !== null && server_group.length >0)
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
				  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
				  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
				  +'\n'+'</globalVariables>'
				  +'\n'+'</ser:RunBatchJobRequest>'
				  +'\n'+'</soapenv:Body>'
				  +'\n'+'</soapenv:Envelope>';
			
			run_job();
		}
		else if(job_server !== null || job_server.length >0)
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
				  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
				  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
				  +'\n'+'</globalVariables>'
				  +'\n'+'</ser:RunBatchJobRequest>'
				  +'\n'+'</soapenv:Body>'
				  +'\n'+'</soapenv:Envelope>';
			
			run_job();
		} 
		else//JOBSERVER和SERVERGROUP至少一个不能为null
		{
			body= 'JOBSERVER and SERVERGROUP are null';
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			return;
		}
	$.response.contentType = "application/json; charset=UTF-8";

}


//验证权限
var privilegeExists;
query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
	+'\'urgentmomaintaince::trigger\',?)';
var pcall1 = conn.prepareCall(query);
pcall1.execute();
privilegeExists = pcall1.getNString(1);

if(privilegeExists!== 'OK')
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}
else
{
	try
	{
		var rs_status,pcall_status;
		var status_count=0;
		if(job_type === "ready_all")
		{
			query = 'select count(1) from "_SYS_BIC"."cdp.mxebgvmi.models/AT_URGENT_MO_MAINTENCE" where STATUS=\'DRAFT\'';
			pcall_status = conn.prepareStatement(query);
			rs_status = pcall_status.executeQuery();
			if(rs_status.next())
			{
				status_count = rs_status.getInteger(1);
			}
			pcall_status.close();
			if(status_count >0)
			{
				query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::ui_urgent_mo_pull_all"()';
				pcall = conn.prepareCall(query);
				pcall.execute();
				pcall.close();
				body = "Finished! You can check the result.";
				$.response.status = $.net.http.OK;
			}
			else
			{
				body = 'There is no "DRAFT" record to be set as "READY"!';
				$.response.status = $.net.http.BAD_REQUEST;
			}

		}
		else if(job_type === "ready")
		{
			
			query = 'select count(1) from "_SYS_BIC"."cdp.mxebgvmi.models/AT_URGENT_MO_MAINTENCE" where STATUS=\'DRAFT\'';
			pcall_status = conn.prepareStatement(query);
			rs_status = pcall_status.executeQuery();
			if(rs_status.next())
			{
				status_count = rs_status.getInteger(1);
			}
			pcall_status.close();
			if(status_count >0)
			{
				var mo_id = json.MO_ID;
				query = ' call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::ui_urgent_mo_pull_ready"(\'' +
				mo_id+'\')';
				pcall = conn.prepareCall(query);
				pcall.execute();
				pcall.close();
				body = "Finished! You can check the result.";
				$.response.status = $.net.http.OK;
			}
			else
			{
				body = 'There is no "DRAFT" record to be set as "READY"!';
				$.response.status = $.net.http.BAD_REQUEST;
			}

		} 
		else if(job_type === "running")
		{
			query = 'select count(1) from "_SYS_BIC"."cdp.mxebgvmi.models/AT_URGENT_MO_MAINTENCE" where STATUS=\'READY\'';
			pcall_status = conn.prepareStatement(query);
			rs_status = pcall_status.executeQuery();
			status_count=0;
			if(rs_status.next())
			{
				status_count = rs_status.getInteger(1);
			}
			
			if(status_count>0)
			{
				trigger();
			}
			else
			{
				body = "There is no 'READY' record!";
				$.response.status = $.net.http.BAD_REQUEST;
			}
			
			pcall_status.close();
		}
		
		conn.commit();
		conn.close();
		
	}
	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}
	
	
	
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);

}

