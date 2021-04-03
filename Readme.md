# Notes Application

An app to create user profile, but stocks and add value to your wallet.

## Steps to Setup

1. Install dependencies

```
npm install
```

2. Run Server

```
node server.js
```

3. Routes / API Paths:

```
1. Create a user

POST /register
Payload : { username: " ", password: " " }

2. Login

POST /login
Payload : { username: " ", password: " " }

3. Retrieve user data

GET /userprofile

4. Retrieve wallet amount

GET /wallet

Where noteID is the ID of note your are looking for

5. Add value to your wallet

POST /addvalue
Payload : { amount: "" }

6. Buy a stock

POST /buystock
Payload : { symbol : " " , quantity : " " }

7. Logout

GET /logout
```

Some API Validation has not been done, so there might be problem with some with the APIs and payloads.



