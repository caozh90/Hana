/*

Monitor\Search
view name
1.   receipts          receipts             'Receipts'
2.   pullSignals       pullsignals          'Pull Signals'
3.   pullLines         pulllines            'Pull Lines'
4.   dispatches        dispatches           'Dispatches'
5.   events            events               'Events'
6.   sa                sa                   'SA'


*/
/**************************************
1.   receipts          receipts             'Receipts'
**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Receipts'
 	,'Receipts'
	,'cdp.mxebgvmi.roles.receipts::access'
	,'receipts::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Receipts'
 	,'Receipts'
	,'cdp.mxebgvmi.roles.receipts::exportable'
	,'receipts::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'receipts'  ,'cdp.mxebgvmi.roles.receipts::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'receipts'  ,'cdp.mxebgvmi.roles.receipts::exportable', 'controllor',?);
       
/**************************************
2.   pullSignals       pullsignals          'Pull Signals'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull Signals'
 	,'Pull Signals'
	,'cdp.mxebgvmi.roles.pullsignals::access'
	,'pullsignals::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull Signals'
 	,'Pull Signals'
	,'cdp.mxebgvmi.roles.pullsignals::exportable'
	,'pullsignals::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullSignals'  ,'cdp.mxebgvmi.roles.pullsignals::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullSignals'  ,'cdp.mxebgvmi.roles.pullsignals::exportable', 'controllor',?);
       

/**************************************
3.   pullLines         pulllines            'Pull Lines'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull Lines'
 	,'Pull Lines'
	,'cdp.mxebgvmi.roles.pulllines::access'
	,'pulllines::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull Lines'
 	,'Pull Lines'
	,'cdp.mxebgvmi.roles.pulllines::exportable'
	,'pulllines::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullLines'  ,'cdp.mxebgvmi.roles.pulllines::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullLines'  ,'cdp.mxebgvmi.roles.pulllines::exportable', 'controllor',?);


/**************************************
4.   dispatches        dispatches           'Dispatches'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Dispatches'
 	,'Dispatches'
	,'cdp.mxebgvmi.roles.dispatches::access'
	,'dispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Dispatches'
 	,'Dispatches'
	,'cdp.mxebgvmi.roles.dispatches::exportable'
	,'dispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dispatches'  ,'cdp.mxebgvmi.roles.dispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dispatches'  ,'cdp.mxebgvmi.roles.dispatches::exportable', 'controllor',?);



/**************************************
5.   events            events               'Events'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	 'Events'
 	, 'Events'
	,'cdp.mxebgvmi.roles.events::access'
	,'events::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	 'Events'
 	, 'Events'
	,'cdp.mxebgvmi.roles.events::exportable'
	,'events::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
5*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'events'  ,'cdp.mxebgvmi.roles.events::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'events'  ,'cdp.mxebgvmi.roles.events::exportable', 'controllor',?);
              

/**************************************
6.   sa                sa                   'SA'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SA'
 	,'SA'
	,'cdp.mxebgvmi.roles.sa::access'
	,'sa::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SA'
 	,'SA'
	,'cdp.mxebgvmi.roles.sa::exportable'
	,'sa::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
6*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sa'  ,'cdp.mxebgvmi.roles.sa::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sa'  ,'cdp.mxebgvmi.roles.sa::exportable', 'controllor',?);
              

