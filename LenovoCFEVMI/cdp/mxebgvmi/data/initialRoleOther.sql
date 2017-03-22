/*

Other
view name --- ROLE NAME --- COMMENTS
1. configuration         configuration        'DS Workflow Configuration'
2. DSJob                 dsjob			        'DS Job Configuration'
3. dsMonitor			dsmonitor		'DS Job Monitor&Resubmission'


CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.configuration::access'
,'MXEBGVMI',?  );
CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.dsjob::access'
,'MXEBGVMI',?   );
CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.dsmonitor::access'
,'MXEBGVMI' ,?  );

CALL "SECURITY"."cdp.security.procedures::dropInfoRoleGroup" (
	IN	aROLEGROUP_NAME NVARCHAR(256)
	,'MXEBGVMI'
	,?             ) ;

*/
/**************************************
1. configuration                  configuration        'DS Workflow Configuration'
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Workflow Configuration'
	,'DS Workflow Configuration'
	,'cdp.mxebgvmi.roles.configuration::access'
	,'configuration::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'configuration'  ,'cdp.mxebgvmi.roles.configuration::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'configuration'  ,'cdp.mxebgvmi.roles.configuration::access', 'controllor',?);
       
       
/**************************************
2. DSJob                 dsjob			        'DS Job Configuration'
 
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Configuration'
	,'DS Job Configuration'
	,'cdp.mxebgvmi.roles.dsjob::access'
	,'dsjob::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'DSJob'  ,'cdp.mxebgvmi.roles.dsjob::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'DSJob'  ,'cdp.mxebgvmi.roles.dsjob::access', 'controllor',?);

/**************************************
3. dsMonitor			dsmonitor		'DS Job Monitor&Resubmission'
 
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Monitor&Resubmission'
	,'DS Job Monitor&Resubmission'
	,'cdp.mxebgvmi.roles.dsmonitor::access'
	,'dsmonitor::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dsMonitor'  ,'cdp.mxebgvmi.roles.dsmonitor::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dsMonitor'  ,'cdp.mxebgvmi.roles.dsmonitor::access', 'controllor',?);
       
