/*
PCDW
Other
view name --- ROLE NAME --- COMMENTS
1. dsMonitor			dsmonitor		'DS Job Monitor&Resubmission'



*/


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
	,'PCDW'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'DS Job Monitor&Resubmission'
	,'DS Job Monitor&Resubmission'
	,'cdp.ds.roles.dsmonitor::admin'
	,'dsmonitor::admin'
 	,'view role '
	,'PCDW'    
,?             )           ;

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'PCDW' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'PCDW' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::access', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'PCDW' ,'dsMonitor'  ,'cdp.ds.roles.dsmonitor::admin', 'controllor',?);

       
       

