#                       PROBLEM 5
# 1. Run command docker compose -p env_local_my_99tech -f docker-compose.env.local.yaml up -d

# 2. Run command docker exec -it mongo_99tech_env_local /bin/bash

# 3. Run command mongosh -u root -p

# 4. Enter password : Godofwar246357

# 5. Run command use tech99;

# 6. Run command 
#            db.createUser(

#               {

#                   user: "root",

#                   pwd: "99tech246357",

#                   roles: [

#                           { role : "readWrite", db: "tech99" }

#                          ]

#               }

#           );

# 7. Import database from /problem5/document/99tech.js

# 8. cd /problem5/stack-be and run command npm run dev

# 9. cd /problem5/stack-fe and run command npm run dev

# 10 .Check Backend run port and http://localhost:8000

# 11 .Check Frontend run port http://localhost:3000
