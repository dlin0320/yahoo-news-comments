import pg from "pg";
import { ArticleData, CommentData, ScheduleData, ArticleWithComments } from "./types";



class Database {
  pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      host: process.env.POSTGRES_CONTAINER_NAME,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    });
  }

  insertArticle = async (articleData: ArticleData) => {
    const query = `
      INSERT INTO articles (title, link)
      VALUES ($1, $2)
    `;
    const values = [articleData.title, articleData.link];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting article:", error);
    }
  }

  insertComment = async (commentData: CommentData) => {
    const query = `
      INSERT INTO comments (article_link, text)
      VALUES ($1, $2)
    `;
    const values = [commentData.article_link, commentData.text];

    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error("Error inserting comment:", error);
    }
  }

  insertSchedule = async (scheduleData: ScheduleData) => {
    const query = `
      INSERT INTO schedules (hour, minute, second, task_name)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [scheduleData.hour, scheduleData.minute, 
      scheduleData.second, scheduleData.jobName];

    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error("Error inserting schedule:", error);
    }
  }

  getAllArticles = async (): Promise<ArticleWithComments[]> => {
    const query = `
      SELECT a.title, a.link, c.text AS comment_text
      FROM articles a
      LEFT JOIN comments c ON a.link = c.article_link
    `;

    try {
      const result = await this.pool.query(query);
      console.log(result.rows);
      return []
      // const articles: ArticleWithComments[] = [];
      // let currentArticle: ArticleWithComments | undefined;

      // for (const row of result.rows) {
      //   if (!currentArticle || currentArticle.link !== row.link) {
      //     currentArticle = {
      //       title: row.title,
      //       link: row.link,
      //       comments: []
      //     };
      //     articles.push(currentArticle);
      //   }

      //   if (row.comment_text) {
      //     currentArticle.comments.push({ text: row.comment_text });
      //   }
      // }

      // return articles;
    } catch (error) {
      console.error("Error fetching articles with comments:", error);
      return [];
    }
  }


  getAllSchedules = async (): Promise<ScheduleData[]> => {
    const query = `
      SELECT hour, minute, second, task_name
      FROM schedules
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return [];
    }
  }
}

export { Database };
// export { 
//   insertArticle, 
//   insertComment, 
//   insertSchedule, 
//   getAllArticles,
//   getAllSchedules 
// };