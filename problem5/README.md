# 1. cd problem5
# 2. Run command docker compose -p env_local_my_99tech -f docker-compose.env.local.yaml up -d
# 3. Run command docker exec -it mongo_99tech_env_local /bin/bash
# 4. Run command mongosh -u root -p
# 5. Enter password : Godofwar246357
# 6. Run command use tech99;
# 7. Run command 
#            db.createUser(
#               {
#                   user: "root",
#                   pwd: "99tech246357",
#                   roles: [
#                           { role : "readWrite", db: "tech99" }
#                          ]
#               }
#           );
# 8.    Import database from /problem5/document/99tech.js to database tech99
# 9.    cd /problem5/stack-be and run command npm run dev
# 10.   cd /problem5/stack-fe and run command npm run dev
# 11 .  Check Backend run port and http://localhost:8005
# 12 .  Check Frontend run port http://localhost:3005