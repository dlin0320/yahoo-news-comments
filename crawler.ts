import { chromium } from "playwright-chromium";
import { ArticleData, CrawlData } from "./types";

class Crawler {
  target_url: string;

  constructor() {
    this.target_url = process.env.TARGET_URL ?? "https://tw.news.yahoo.com/world/";
  }

  getArticles = async (): Promise<ArticleData[] | undefined> => {
    console.log('scraping articles')

    try {
      const articles: ArticleData[] = [];
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      let previousScrollY = 0;
      let currentScrollY = -1;
      await page.goto(this.target_url);

      while (previousScrollY !== currentScrollY) {
        console.log("scrolling...");
        await page.mouse.wheel(0, 15000);
        await page.waitForTimeout(3000);
        previousScrollY = currentScrollY;
        currentScrollY = await page.evaluate(() => window.scrollY);
      }

      console.log("scrolling done");

      const contents = await page.$$(".js-stream-content");

      for (const content of contents) {
        const hasComments = await content.$(".comment-btn-count");
        if (hasComments) {
          const anchor = await content.$("a");
          const title = await anchor?.textContent();
          const href = await anchor?.getAttribute("href");
          if (title && href) {
            const link = `${this.target_url}${href}`;
            articles.push({ title, link });
          }
        }
      }
      await browser.close();

      return articles;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  getComments = async (crawlData: CrawlData): Promise<string[] | undefined> => {
    try {
      const comments: string[] = [];
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(crawlData.link);
      const container = await page.waitForSelector("#community-bar-container");;
      await container.hover();
      const iFrame = await container.waitForSelector("iframe");
      const frameContent = await iFrame.contentFrame();

      if (frameContent) {
        const commentsTitle = await frameContent.waitForSelector(".comments-title");
        await commentsTitle.click();
        const commentsBody = await frameContent.waitForSelector(".comments-body .comments-list");
        const commentsList = await commentsBody.$$(".Wow\\(bw\\)");
        for (const comment of commentsList) {
          const text = (await comment.textContent()) ?? "";
          console.log(text);
          // await insertComment({ article_link: crawlData.link, text });
          comments.push(text);
        }

        return comments;
      } else {
        console.log("iFrame not found")
      }

      await browser.close();

      return comments;
    } catch (error) {
      console.error(error);
    }
  }
}

export { Crawler };