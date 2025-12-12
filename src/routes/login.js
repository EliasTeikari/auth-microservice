const express = require("express");
const app = express();
const router = express.Router();

app.use(router);
app.router("/login");

router.get("/", (req, res) => {});
