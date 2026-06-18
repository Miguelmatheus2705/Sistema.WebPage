CREATE TABLE clientes :

id Serial PRIMARY KEY, 

nome varchar (150)
telefone varchar (20)
cpf varchar (14)
email varchar  (150)
cidade varchar (150)
estado varchar (2)
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP