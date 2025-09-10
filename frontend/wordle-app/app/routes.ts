import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // make the login page the index
    route("/login/", "./routes/login.tsx"),
    route("/game/:id", "./routes/wordle-game.tsx"),
    route("/userhome/", "./routes/userhome.tsx"),
  ] satisfies RouteConfig;