## Posts and users api

### To set up project (api)

Step 1: Clone the repositery
```bash
git clone https://github.com/dhirajmokal13/varlyq-API-
```

Step 2: cd into clone repository and run the command
```bash
npm install
```
Step 3: Install mongodb server on machine

Step 4: Install redis Server on machine

Step 5: Make the .env file and add the following data in it (Change data according your usage)
```bash
PORT = "3000"
CLIENT_URLS = ["*"]
ALLOWED_METHODS = ["POST", "PUT", "GET", "PATCH", "DELETE"]
DATABASE_URL = ''
JWTKEY = ''
JWTKEYREFRESH = ''
RedisCreddentials = {"password":"","socket":{"host":"","port":"","connect_timeout": 5000}}
```

Step 6: Run development server using the command 
```bash
npm run dev
```

Step 7: According to documentation use the repository
```bash
https://documenter.getpostman.com/view/25159036/2s93RUuXjj
```
