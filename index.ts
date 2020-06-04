import "dotenv/config";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import { isAuth } from "./middleware/isAuth";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
} from "./graphql/resolvers/User/auth";
import { sendRefreshToken } from "./sendRefreshToken";

const port = process.env.SERVER_PORT;

const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  app.use(isAuth);
  app.use(cookieParser());

  app.post("/refresh_token", async (req, res) => {
    const db = await connectDatabase();
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res.send({ ok: false, accessToken: "" });
    }
    const user: any = await db.users.find({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });
  server.applyMiddleware({ app, path: "/api" });
  app.listen(port);
  console.log(`[server] running on port ${port}`);
};

mount(express());
