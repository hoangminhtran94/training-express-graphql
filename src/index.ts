import { join } from "path";
import { ServerError } from "./models/ServerError";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import { connect } from "mongoose";
import multer, { diskStorage } from "multer";
import { FileFilterCallback } from "multer";
import { createHandler } from "graphql-http";
import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";

const app = express();
const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(urlencoded());
app.use(json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/graphql", createHandler({ schema, rootValue: resolvers }));

app.use(
  (error: ServerError, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  }
);

connect(
  "mongodb://admin:admin@localhost:27018/express-graphql?authSource=admin&directConnection=true"
)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
