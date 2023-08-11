import "dotenv/config";
import express from "express";
import schedule from "node-schedule";
import { test, getArticles } from "./controllers";
import { Crawler } from "./crawler";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/test", test);

app.get("/articles", getArticles);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  app.locals.crawler = new Crawler("https://tw.news.yahoo.com/world/");
  app.locals.crawler.getArticlesWithComments();

  schedule.scheduleJob('0 12 * * *', () => {
    app.locals.crawler.getArticlesWithComments();
  });

  schedule.scheduleJob('0 0 * * *', () => {
    app.locals.crawler.getArticlesWithComments();
  });
});
