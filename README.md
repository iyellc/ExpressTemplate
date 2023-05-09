# ## Express JS Template

This project is for generating express.js apps with pre-configured controllers, mongodb (mongoose), validation and authorization.

#### Creating an App
You can easily use our cli tool, express-initializr to instantly create new apps!
```bash
npx express-initializr {project_name}
```

#### API Documentation
The documentation of the current base project.

##### Error IDs
- TOKEN_NOT_FOUND: Token header is not found
- TOKEN_EXPIRED: JWT Token is expired
- UNKNOWN_ERROR_OCCURED: An unknown error has occured
- ACCESS_FORBIDDEN: User cannot view this resource
- INTERNAL_SERVER_ERROR: Internal server error
- FIELDS_NOT_PROVIDED: Required fields are not provided
- INVALID_REQUEST: Request is not valid
- INVALID_CREDENTIALS: Wrong username and password!
- RECORD_ALREADY_EXISTS: There is another record with same unique keys
- RECORD_NOT_FOUND: Cannot find the database record