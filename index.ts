import "dotenv/config";
import express from "express";
import { test, getArticles, newSchedule, getSchedules } from "./controllers";
import { Crawler } from "./crawler";
import { Scheduler } from "./scheduler";
import { json } from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(json());

app.get("/test", test);

app.get("/article", getArticles);

app.get("/schedule", getSchedules);

app.post("/schedule", newSchedule);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  app.locals.crawler = new Crawler("https://tw.news.yahoo.com/world/");
  app.locals.scheduler = new Scheduler({ "crawl": app.locals.crawler.getArticlesWithComments });
});
