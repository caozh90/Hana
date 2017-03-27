/************************************************************************
*name       :      
*function   :call ds to run daily cost flag report execution
*input      ：process_name=PRC_RPT_STDCOST_DAILY, ITEMS
*output     :
*author     :Chris Gao
*CreateDate :2015-08-26
*UpdateDate :
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

var log_on_body;
var log_on_response;
var run_body;
var run_response;

var sessionID='';

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

/*1. get data from UI*/
var cycle = String($.request.parameters.get("cycle"));
var delta_cycle = String($.request.parameters.get("delta_cycle"));
var process_name = String($.request.parameters.get("process_name"));
var part_number = String($.request.parameters.get("part_number"));
var items = String($.request.parameters.get("item")); // add new items (0000090Y6719,00D8213,00JX858,40K2500)
process_name = process_name.toUpperCase();

/*var temp = cycle + '/' + delta_cycle + '/' + process_name;
$.response.setBody(temp);
$.response.status = $.net.http.OK;*/

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

var parameters;
if(delta_cycle !== '')
{
	parameters = '\n'+'<variable name="G_V_CYCLE">'+cycle+'</variable>'
				+'\n'+'<variable name="G_V_DeltaCYCLE">'+delta_cycle+'</variable>';
}
else
{
	parameters = '\n'+'<variable name="G_V_CYCLE">'+cycle+'</variable>';
}

if(process_name === 'PRC_RPT_WHERE_USED')
{
	parameters += '\n'+'<variable name="G_V_PARTNUMBER">'+part_number+'</variable>';
}

//added by Chris Gao 2015-08-27
if(process_name === 'PRC_RPT_STDCOST_DAILY')
{
	if(items !== "" && items.indexOf(",") > -1)
	{
		var items_array = items.split(',');
		var items_quot = "";
		var i = 0;
		for( i=0; i < items_array.length; i++)
		{
			items_quot = items_quot + "'" + items_array[i] + "',";
		}
		items_quot = items_quot.substring(0,items_quot.length-1);
		parameters += '\n'+'<variable name="G_V_ITEM">'+ items_quot +'</variable>';
	}
	else
	{
		parameters += '\n'+'<variable name="G_V_ITEM">'+ items +'</variable>';
	}
	
}

//send request to DS server with parameters
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
		  + parameters
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
		  + parameters 
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
