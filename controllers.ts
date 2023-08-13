import { RequestHandler } from "express";
import { CommentData, getAllArticles, getCommentsForArticle, getAllSchedules } from "./db";

const test: RequestHandler = async (req, res, next) => {
  const title = await req.app.locals.crawler.test();
  res.send(`You are visiting: ${title}`);
};

const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const articlesWithComments = [];
    const articles = await getAllArticles();

    for (const article of articles) {
      let comments: CommentData[] = [];
      if (article.link) {
        comments = await getCommentsForArticle(article.link);
      }
      articlesWithComments.push({
        ...article,
        comments: comments.map(comment => comment.text)
      });
    }

    res.send(articlesWithComments);
  } catch (error) {
    next(error);
  }
};

const newSchedule: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body)
    const { hour, minute, second } = req.body;
    req.app.locals.scheduler.schedule({ hour, minute, second, taskName: "crawl" });
    res.send("New schedule created");
  } catch (error) {
    next(error);
  }
};

const getSchedules: RequestHandler = async (req, res, next) => {
  try {
    const schedules = await getAllSchedules();
    res.send(schedules);
  } catch (error) {
    next(error);
  }
};

export { test, getArticles, newSchedule, getSchedules };