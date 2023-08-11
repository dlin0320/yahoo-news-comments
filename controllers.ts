import { RequestHandler } from "express";
import { getAllArticles, getCommentsForArticle, CommentData } from "./db";

const test: RequestHandler = async (req, res, next) => {
  const title = await req.app.locals.crawler.test();
  res.send(`You are visiting: ${title}`);
};

const getArticles: RequestHandler = async (req, res, next) => {
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
};

export { test, getArticles };