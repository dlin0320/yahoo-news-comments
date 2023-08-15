interface CrawlData {
  link: string;
  retries: number;
}

interface ArticleData {
  title: string;
  link: string;
}

interface CommentData {
  article_link: string;
  text: string;
}

interface OnceData {
  date: Date;
  retries: number;
}

interface RegularData {
  hour: number;
  minute: number;
  second: number;
  jobName: string;
}

interface ArticleWithComments {
  title: string;
  link: string;
  comments: string[];
}

export { CrawlData, ArticleData, CommentData, OnceData, RegularData, ArticleWithComments };