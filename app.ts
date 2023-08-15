import "dotenv/config";
import express, { json } from "express";
import { getArticles, getSchedules, insertSchedules } from "./controllers";
import { Database } from "./database";
import { Crawler } from "./crawler";
import { Scheduler } from "./scheduler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.get("/articles", getArticles);

app.get("/schedules", getSchedules);

app.post("/schedules", insertSchedules);

app.locals.database = new Database();

app.locals.crawler = new Crawler();

app.locals.scheduler = new Scheduler();

app.locals.scheduler.newJob("comments", async () => {
  app.locals.scheduler.once()
});

app.locals.scheduler.newJob("articles", async () => {
  const articles = await app.locals.crawler.getArticles();

});

app.locals.scheduler.newJob("yahoo", async () => {
  const articles = await app.locals.crawler.getArticles();
  let date = new Date(Date.now());
  for (const article of articles) {
    console.log(date);
    app.locals.database.insertArticle(article);
    const data = { date, retries: 3 };

    app.locals.scheduler.once(data, async () => {
      const crawlData = { link: article.link, retries: 3}
      const comments = await app.locals.crawler.getComments(crawlData);
      if (comments) {
        for (const comment of comments) {
          console.log(comment);
          app.locals.database.insertComment({ article_link: article.link, text: comment });
        }
      } else {
        app.locals.scheduler.once(data)
      }
    });

    const wait = Math.floor(Math.random() * 10000) + 10000;
    date = new Date(date.getTime() + wait);
  }
});

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);



  
});