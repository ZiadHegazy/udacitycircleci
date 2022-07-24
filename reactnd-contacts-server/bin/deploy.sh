eb init deploy4 --platform node.js --region us-east-1
eb setenv postgres_username=$postgres_username
eb setenv postgres_password=$postgres_password
eb setenv port=$port
eb setenv link=$link
eb setenv dbname=$dbname
eb deploy