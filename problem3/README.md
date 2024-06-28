# 1. docker compose -p env_local_my_99tech -f docker-compose.env.local.yaml up -d

# 2. docker exec -it mongo_99tech_env_local /bin/bash

# 3. mongosh -u root -p

# 4. Enter password : Godofwar246357

# 5. use tech99;

# 6. db.createUser(

# {

# user: "root",

# pwd: "99tech246357",

# roles: [

# { role : "readWrite", db: "tech99" }

# ]

# }

# );

# 7. cd /problem3/stack-be run command npm run dev

# 8. cd /problem3/stack-fe run command npm run dev

# 9 .Check Backend run port http://localhost:8000

# 10 .Check Frontend run port http://localhost:3000
