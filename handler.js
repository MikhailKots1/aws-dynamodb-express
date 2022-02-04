
// const AWS = require("aws-sdk");
// const http = require("http");
// const PORT = process.env.PORT || 5000;
// const USERS_TABLE = process.env.USERS_TABLE;
// const dynamoDbClientParams = {};
// if (process.env.IS_OFFLINE) {
//   dynamoDbClientParams.region = 'localhost'
//   dynamoDbClientParams.endpoint = 'http://localhost:3000'
// }
// const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

// module.exports.handler = (event, context, callback) => {
//     const server = http.createServer(async (req, res) => {
//       //set the request route
//       if (req.url === "/api" && req.method === "GET") {
//           res.writeHead(200, { "Content-Type": "application/json" });
//           res.write("Hi there, This is a Vanilla Node.js API");
//           res.end();
//       }

//       if (req.url === "/todos" && req.method === "GET") {
//         async function get (req, res) {
//             const params = {
//               TableName: USERS_TABLE,
//               Key: {
//                 userId: req.params.userId,
//               },
//             };
          
//             try {
//               const { Item } = await dynamoDbClient.get(params).promise();
//               if (Item) {
//                 const { userId, name } = Item;
//                 res.json({ userId, name });
//               } else {
//                 res
//                   .status(404)
//                   .json({ error: 'Could not find user with provided "userId"' });
//               }
//             } catch (error) {
//               console.log(error);
//               res.status(500).json({ error: "Could not retreive user" });
//             }
//           };
//           response = get(req, res);
//       }

//       if (req.url === "/set" && req.method === "POST") {
//         async function set (req, res) {
//             const { userId, name } = req.body;
//             if (typeof userId !== "string") {
//               res.status(400).json({ error: '"userId" must be a string' });
//             } else if (typeof name !== "string") {
//               res.status(400).json({ error: '"name" must be a string' });
//             }
          
//             const params = {
//               TableName: USERS_TABLE,
//               Item: {
//                 userId: userId,
//                 name: name,
//               },
//             };
          
//             try {
//               await dynamoDbClient.put(params).promise();
//               res.json({ userId, name });
//             } catch (error) {
//               console.log(error);
//               res.status(500).json({ error: "Could not create user" });
//             }
//           };
//           response = set(req, res);
//       }

//       if (req.url === "/todos/:userId" && req.method === "GET") {
//         async function getById(req, res) {
//             const params = {
//               TableName: USERS_TABLE,
//               Key: {
//                 userId: req.params.userId,
//               },
//             };
          
//             try {
//               const { Item } = await dynamoDbClient.get(params).promise();
//               if (Item) {
//                 const { userId, name } = Item;
//                 res.json({ userId, name });
//               } else {
//                 res
//                   .status(404)
//                   .json({ error: 'Could not find user with provided "userId"' });
//               }
//             } catch (error) {
//               console.log(error);
//               res.status(500).json({ error: "Could not retreive user" });
//             }
//           };
//           response = getById(req, res);
//       }

//       // If no route present
//       if (req.url === "/") {
//         const response = {
//           statusCode: 200,
//           body: JSON.stringify({
//             message: 'Route not found',
//           }),
//         };
//       }
//   });

//   server.listen(PORT, () => {
//     console.log(`server started on port: ${PORT}`);
//   });
//   callback(null, response);
// };

const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);