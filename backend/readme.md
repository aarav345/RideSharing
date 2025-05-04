# API Documentation

## Endpoint: `/user/register`

### Description
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns an authentication token along with the user details.

### Method
`POST`

### Request Body
The request body should be in JSON format and must include the following fields:

| Field              | Type   | Required | Description                                      |
|--------------------|--------|----------|--------------------------------------------------|
| `fullname.firstname` | String | Yes      | The first name of the user (minimum 3 characters). |
| `fullname.lastname`  | String | No       | The last name of the user (minimum 3 characters).  |
| `email`             | String | Yes      | The email address of the user (must be valid).    |
| `password`          | String | Yes      | The password of the user (minimum 6 characters).  |

### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Success Response
**Status Code: 201 Created**  
**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1c2e8f1d3c2a1b2c3d4e5",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Validation Error
**Status Code: 200 OK**  
**Body:**
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Missing Fields Error
**Status Code: 500 Internal Server Error**  
**Body:**
```json
{
  "error": "All fields are required"
}
```

### Notes
- Ensure the Content-Type header is set to application/json.
- The password is hashed before being stored in the database.
- The token is a JSON Web Token (JWT) used for authentication.

### Route Definition
The route is defined in `user.route.js` as follows:

router.post('user/register', registerUserController);
