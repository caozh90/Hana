//1. to enable the scheduler in xs engine
--ALTER SYSTEM ALTER CONFIGURATION ('xsengine.ini', 'SYSTEM') SET ('scheduler', 'enabled') = 'true' WITH RECONFIGURE;

--ALTER SYSTEM ALTER CONFIGURATION('webdispatcher.ini','system') 
--SET('profile','icm/HTTP/logging_0')='PREFIX=/, LOGFILE=$(DIR_INSTANCE)/trace/access_log-%y-%m-%d, MAXSIZEKB=10000, SWITCHTF=hour, LOGFORMAT=SAP' WITH RECONFIGURE;




//2.active the sceduled job
//http://10.99.10.52:8000/sap/hana/xs/admin/


//3..

--1模块建立之后，首先要创建相关的role
--2 初始化一个管理员。

--3--------------------
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.log.roles::logAccess'
 	,'to view the log information of related module.'
	,'EBGCFE'    ,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.log.roles::logAdmin'
 	,'can delete log information of related module.'
	,'EBGCFE'    ,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
    'cdp.log.roles::logAccess'
    ,'to view the log information of related module.'
    ,'MXEBGVMI'    ,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
    'cdp.log.roles::logAdmin'
    ,'can delete log information of related module.'
    ,'MXEBGVMI'    ,?             )           ;
    
--4    

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'log'  ,'cdp.log.roles::logAccess', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'log'  ,'cdp.log.roles::logAdmin', 'controllor',?);
       
       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'log'  ,'cdp.log.roles::logAccess', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'log'  ,'cdp.log.roles::logAdmin', 'controllor',?);       

       
	
