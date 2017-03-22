--1模块建立之后，首先要创建相关的role
--2 初始化一个管理员。

--1--------------------
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Base'
	,'securityBase'
 	,'base role '
	,'EBGCFE'    ,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Access'
	,'securityAccess'
 	,'open user management view. '
	,'EBGCFE'    ,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::userAdmin'
	,'securityUserAdmin'
 	,' user and user group management . '
	,'EBGCFE'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleSetup'
	,'securityRoleSetup'
 	,' role and role group management . '
	,'EBGCFE'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleAdmin'
	,'securityRoleAdmin'
 	,' grant activated role  . '
	,'EBGCFE'   ,?             );
	
--2--------------------
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::userAdmin',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::roleSetup',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::roleAdmin',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'user'  ,'cdp.security.roles::Access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'user'  ,'cdp.security.roles::userAdmin', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'user'  ,'cdp.security.roles::roleSetup', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'user'  ,'cdp.security.roles::roleAdmin', 'controllor',?);
       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'user'  ,'cdp.security.roles::Access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'user'  ,'cdp.security.roles::userAdmin', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'user'  ,'cdp.security.roles::roleSetup', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'user'  ,'cdp.security.roles::roleAdmin', 'controllor',?);
       
	
