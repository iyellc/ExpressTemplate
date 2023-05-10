
# Express JS Template

This project is for generating express.js apps with pre-configured controllers, mongodb (mongoose), validation and authorization.

### Creating an App
You can easily use our cli tool, express-initializr to instantly create new apps!
```bash
npx express-initializr {project_name}
```

### API Documentation
The documentation of the current base project.

#### Error IDs
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

#### Creating a controller
You can easily create a controller by first creating a file on the folder, `src/controller`. For example, we will call our controller `CountryController.js`. Now, to configure routes you can just create a new module export:
```js
const asyncHandler = require('express-async-handler')

module.exports.listCountries = asyncHandler(async (req, res) => {
	// ...
})
```
We use `express-async-handler` package to keep everything in place. Don't forget to add it!

#### Configuring a Route
We have created a controller and now it's time for configuring a route for it. Let's open `src/routes.js` file:
```js
const express = require("express");
const router = express.Router();

require("dotenv").config();

// Controller Imports:
const AuthController = require("./http/controllers/AuthController");
const CountryController = require("./http/controllers/CountryController"); // Adding the import
// Middlewares:
const isInRole = require("./http/middleware/isInRole");

// Auth Routes:
router.post("/auth/login", AuthController.login)
router.post("/auth/register", AuthController.register);
router.post("/auth/refresh", AuthController.refreshToken);

router.get("/protected", isInRole("read", "User"), (req, res)  => {/*...*/})

// Adding a route down below:
router.get("/countries/list", /* middlewares */, CountryController.listCountries)

module.exports  = router;
```

You can also create routes for methods:
<img src="https://raw.githubusercontent.com/iyellc/.github/main/profile/httpmethods.png" height="250px">

#### Middlewares

We have our own middlewares for authentication, validation, authorization etc. Here is a list of them as well as how you can use it:
```js
ensureToken()
isAuthenticated()
hasPermission()
```
##### ensureToken
To use *ensureToken* middleware just use it while in the router For example:
```js
router.get("/example", ensureToken, RelatedController.relatedRoute)
```
Ensure token ensures that the jwt token is passed. It does not secure a route!

##### isAuthenticated
To use *isAuthenticated* middleware just use it while in the router For example:
```js
router.get("/example", isAuthenticated, RelatedController.relatedRoute)
```
isAuthenticated middleware ensures that the user is authenticated. It secures a route from guest users.

##### hasPermission
To use *hasPermission* middleware pass `permission`, `model` to use it while in the router For example:
```js
router.get("/example", hasPermission("read", "Post"), RelatedController.relatedRoute)
```
hasPermission middleware ensures that the authenticated user has the permission required to the following thing. More information about [roles](#roles)

#### Validation

Validation is supported by [Joi](https://joi.dev/). You can check their docs for more detailed usage but please note that to validate an object, first check if the object is undefined or not. If undefined, it may cause errors.

#### Roles

We use [Casl](https://casl.js.org/) to speed up the process of creating roles, permissions etc. For more documentation, please consider looking at their website.

##### Registering Roles Into The App

First, open up `src/http/roles.js`:
```js
/* ... */
const exampleRole = require("./roles/exampleRole")

module.exports = {
	adminRole: adminRole,
	userRole: userRole,
	exampleRole: exampleRole // Now the role is registered and ready to use
}
```
This registering allows us to use custom middlewares in the app.
#### Mongoose Models

[Mongoose](https://mongoosejs.com/) is the main database in Express Template, you can check their docs for mor detailed usage.

##### Creating a model
To create a model first import the required packages on top of the file:
```js
const  mongoose = require("mongoose");
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')
```
*We import @casl/mongoose for authorization.*

Follow that with the schema that we need to define by ourselves:

```js
const ExampleSchema = mongoose.Schema({
	stringValue: { type: String, required: true },
	uniqueStringValue: { type: String, unique: true, required: true },
	number: { type: Number, required: true },
}, { timestamps: true });
```
*[For more information](https://mongoosejs.com/docs/guide.html#definition)*

After that, let's use the `@casl/ability` authorization plugin:
```js
ExampleSchema.plugin(accessibleRecordsPlugin)
ExampleSchema.plugin(accessibleFieldsPlugin)
```

Now let's use our schema to create a model:
```js
module.exports = mongoose.model("Example", ExampleSchema)
```
And we are done!

##### Using authorization with mongoose
We can use our authorization package: `@casl/ability` with mongoose. In this example, we are going to securly get our data using `casl`. For post, put, delete; we recommend that you use a middleware. But for `get` requests, there shouldn't be multiple endpoints for multiple roles, so we implement the bare minimum requirement in the middleware and build on top of it.

Example: Listing data according to `@casl/ability` roles:
```js
const roles = require("../roles");

let posts = await Post
	.accessibleBy(roles[req.user.roleName])
	.find({})
	.select(Post.accessibleFieldsBy(roles[req.user.roleName]));
```
For explaining, we first get the accessible records by our role. Then, we get all of the data there. Lastly, we filter out the fields that are accessible by our role. You can write queries inside the `.find()` statement if you'd like.

