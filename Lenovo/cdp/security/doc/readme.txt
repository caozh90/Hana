
1\添加新用户
"SECURITY"."cdp.security.procedures::createUser" (
             IN userName NVARCHAR(256), 
	         IN passwd NVARCHAR(256),
             IN loginName NVARCHAR(50),
             IN firstName NVARCHAR(30),
             IN lastName NVARCHAR(30),
             IN emailAddress NVARCHAR(200),
             IN status NVARCHAR(20),
             IN LOCALE NVARCHAR(16),
             IN DESIGNATION NVARCHAR(200)
             /*out code Integer*/
             ) 