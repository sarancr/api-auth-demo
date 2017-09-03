 create database authdb;
 \connect authdb;
 
 CREATE TABLE public.user(
	id SERIAL PRIMARY KEY NOT NULL,
	login_id CHAR(256) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	last_update TIMESTAMP DEFAULT NOW()
 );
 
 CREATE TABLE public.permission(
	id SERIAL PRIMARY KEY NOT NULL,
	name CHAR(128) UNIQUE NOT NULL,
	description TEXT,
	last_update TIMESTAMP DEFAULT NOW()
 );
 
 CREATE TABLE public.user_permission(
	user_id INTEGER REFERENCES public.user(id) ,
	permission_id INTEGER REFERENCES public.permission(id),
	last_update TIMESTAMP DEFAULT NOW()
 );

 INSERT INTO user (login_id, password) VALUES('demouser','demo1234');
 INSERT INTO user (login_id, password) VALUES('demoadmin','demo1234');
 INSERT INTO permission (name, description) VALUES ('general', 'General user permission');
 INSERT INTO permission (name, description) VALUES ('admin', 'Admin user permission');

 INSERT INTO user_permission (user_id, permission_id) VALUES
 (
	2,
	4
 );