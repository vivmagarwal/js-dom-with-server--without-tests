const dotenv = require("dotenv");
dotenv.config();

const jsonServer = require("json-server");
const path = require("path");
const { join } = require("path");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require('isomorphic-fetch');

const protectedRoutesConfig = {
  protectedRoutes: [
    { route: "/recipes", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
    { route: "/areas", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/recipeTags", methods: ["POST", "PUT", "DELETE", "PATCH"] },
    { route: "/employees", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
  ],
};

const uid = new ShortUniqueId({ length: 10 });

const dbFile = process.env.DB || "db.json";
const staticDirectoryName = process.env.STATIC_FILES || "server-files";
const serverPort = process.env.REACT_APP_JSON_SERVER_PORT || 9090;

const server = jsonServer.create();

const router = jsonServer.router(join(__dirname, dbFile), {
  foreignKeySuffix: "dummy",
});

const staticDir = path.join(__dirname, staticDirectoryName);
const middlewares = jsonServer.defaults({ static: staticDir });

server.use(middlewares);
server.use(jsonServer.bodyParser);

async function getUserByUsername(username) {
  const response = await fetch(`http://localhost:${serverPort}/users?username=${username}`);
  const users = await response.json();
  return users[0];
}

const jsonServerMiddleware = (req, res, next) => {
  // config
  const protectedRoutes = protectedRoutesConfig.protectedRoutes;

  // Authorization logic
  server.use((req, res, next) => {
    let NeedsAuthorization = false;

    for (let i = 0; i < protectedRoutes.length; i++) {
      let { route, methods } = protectedRoutes[i];

      // if ((route === 'GET' && ))

      if (req.url.startsWith(route)) {
        if (methods.includes(req.method)) {
          NeedsAuthorization = true;
          break;
        }
      }
    }

    if (NeedsAuthorization) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!authHeader || !token)
        return res
          .status(403)
          .send(
            "Its a protected route/method. You need an auth token to access it."
          );

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET ||
          "62a798775294eda38d9d5bdb57cfae9d1fff7a550c11c06ef2888fc1af641c09291d17f07f04156356fd86223256fbcc026e791a80a876fe7b14d4ba30ec185d",
        (err, user) => {
          if (err)
            return res
              .status(403)
              .send("Some error occurred wile verifying token.");
          req.user = user;
          next();
        }
      );
    } else {
      next();
    }
  });

  // default id & created at
  server.use((req, res, next) => {
    if (req.method === "POST") {
      req.body.createdAt = Date.now();
    }

    if (req.method === "POST" && !req.body.id) {
      req.body.id = uid();
    }

    if (req.method === "POST" && req.user && !req.body.userId) {
      req.body.userId = req.user.id;
    }

    next();
  });

// registration logic
server.post("/register", async (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newUserData = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    firstname: req.body.firstname || "",
    lastname: req.body.lastname || "",
    avatar: req.body.avatar || "",
    createdAt: Date.now(),
  };

  try {
    const response = await fetch(`http://localhost:${serverPort}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });

    if (response.ok) {
      const newUser = await response.json();
      res.status(201).send(newUser);
    } else {
      res.status(response.status).send("User registration failed.");
    }
  } catch (error) {
    res.status(500).send("Error occurred during registration: " + error.message);
  }
});


  // login/sign in logic
  server.post("/login", async (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
      return res
        .status(400)
        .send("Bad request, requires username & password both.");
    }
  
    const user = await getUserByUsername(req.body.username);
    if (user == null) {
      return res.status(400).send(`Cannot find user: ${req.body.username}`);
    }
  
    if (bcrypt.compareSync(req.body.password, user.password)) {
      // creating JWT token
      const accessToken = generateAccessToken(user);
      return res.send({
        accessToken: accessToken,
        user: user,
      });
    } else {
      res.send("Not allowed, name/password mismatch.");
    }
  });

  server.use(router);

  server(req, res, next);
};

function generateAccessToken(user) {
  return jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET ||
      "62a798775294eda38d9d5bdb57cfae9d1fff7a550c11c06ef2888fc1af641c09291d17f07f04156356fd86223256fbcc026e791a80a876fe7b14d4ba30ec185d",
    { expiresIn: "3h" }
  );
}

module.exports = jsonServerMiddleware;