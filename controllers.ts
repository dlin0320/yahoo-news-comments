import { RequestHandler } from "express";

const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const articles = await req.app.locals.database.getAllArticles();
    res.send(articles);
  } catch (error) {
    next(error);
  }
};

const getSchedules: RequestHandler = async (req, res, next) => {
  try {
    const schedules = await req.app.locals.database.getAllSchedules();
    res.send(schedules);
  } catch (error) {
    next(error);
  }
};

const insertSchedules: RequestHandler = async (req, res, next) => {
  try {
    const { hour, minute, second } = req.body;
    req.app.locals.scheduler.schedule({ hour, minute, second, jobName: "yahoo_news" });
    res.send("New schedule created");
  } catch (error) {
    next(error);
  }
};

export { getArticles, getSchedules, insertSchedules };