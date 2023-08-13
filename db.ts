import pg from 'pg';

interface ArticleData {
  title: string;
  link: string;
}

interface CommentData {
  article_link: string;
  text: string;
}

interface ScheduleData {
  hour: number;
  minute: number;
  second: number;
  taskName: string;
}

const pool = new pg.Pool({
  host: process.env.POSTGRES_CONTAINER_NAME,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

const insertArticle = async (articleData: ArticleData) => {
  const query = `
    INSERT INTO articles (title, link)
    VALUES ($1, $2)
  `;
  const values = [articleData.title, articleData.link];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting article:', error);
  }
}

const insertComment = async (commentData: CommentData) => {
  const query = `
    INSERT INTO comments (article_link, text)
    VALUES ($1, $2)
  `;
  const values = [commentData.article_link, commentData.text];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting comment:', error);
  }
}

const insertSchedule = async (scheduleData: ScheduleData) => {
  const query = `
    INSERT INTO schedules (hour, minute, second, task_name)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [scheduleData.hour, scheduleData.minute, 
    scheduleData.second, scheduleData.taskName];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting schedule:', error);
  }
}

const getAllArticles = async (): Promise<ArticleData[]> => {
  const query = `
    SELECT title, link
    FROM articles
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching article:', error);
    return [];
  }
}

const getCommentsForArticle = async (articleLink: string): Promise<CommentData[]> => {
  const query = `
    SELECT text
    FROM comments
    WHERE article_link = $1
  `;
  const values = [articleLink];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

const getAllSchedules = async (): Promise<ScheduleData[]> => {
  const query = `
    SELECT hour, minute, second, task_name
    FROM schedules
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export { 
  ArticleData, 
  CommentData, 
  ScheduleData, 
  insertArticle, 
  insertComment, 
  insertSchedule, 
  getAllArticles, 
  getCommentsForArticle, 
  getAllSchedules 
};