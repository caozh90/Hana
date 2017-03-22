/*
VMI
Other
view name --- ROLE NAME --- COMMENTS
1. configuration         configuration        'DS Workflow Configuration'
2. DSJob                 dsjob			        'DS Job Configuration'
3. dsMonitor			dsmonitor		'DS Job Monitor&Resubmission'



*/
/**************************************
1. configuration                  configuration        'DS Workflow Configuration'
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Workflow Configuration'
	,'DS Workflow Configuration'
	,'cdp.ds.roles.configuration::access'
	,'configuration::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'configuration'  ,'cdp.ds.roles.configuration::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'configuration'  ,'cdp.ds.roles.configuration::access', 'controllor',?);
       
       
/**************************************
2. DSJob                 dsjob			        'DS Job Configuration'
 
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Configuration'
	,'DS Job Configuration'
	,'cdp.ds.roles.dsjob::access'
	,'dsjob::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'DSJob'  ,'cdp.ds.roles.dsjob::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'DSJob'  ,'cdp.ds.roles.dsjob::access', 'controllor',?);

/**************************************
3. dsMonitor			dsmonitor		'DS Job Monitor&Resubmission'
 
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Monitor&Resubmission'
	,'DS Job Monitor&Resubmission'
	,'cdp.ds.roles.dsmonitor::access'
	,'dsmonitor::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Monitor&Resubmission'
	,'DS Job Monitor&Resubmission'
	,'cdp.ds.roles.dsmonitor::admin'
	,'dsmonitor::admin'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::access', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::admin', 'controllor',?);

       
       

