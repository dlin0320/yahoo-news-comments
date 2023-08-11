import { chromium } from "playwright-chromium";
import fastq from "fastq";
import { insertArticle, insertComment } from "./db";

interface JobData {
  link: string;
  retries: number;
}

class Crawler {
  target_url: string;
  tasks: fastq.queue;

  constructor(target_url: string) {
    this.target_url = target_url;
    this.tasks = fastq(this.getCommentsFromLink, 1);
  }

  test = async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://google.com");
    const title = await page.title();
    await browser.close();
    return title;
  }

  getArticlesWithComments = async () => {
    console.log('scraping articles')
    try {
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

      const articles = await page.$$(".js-stream-content");

      for (const article of articles) {
        const hasComments = await article.$(".comment-btn-count");
        if (hasComments) {
          const anchor = await article.$("a");
          const title = await anchor?.textContent();
          const href = await anchor?.getAttribute("href");
          if (title && href) {
            const link = `${this.target_url}${href}`;
            this.tasks.push({ link, retries: 3 });
            await insertArticle({ title, link });
          }
        }
      }

      await browser.close();
    } catch (error) {
      console.error(error);
    }
  }

  getCommentsFromLink = async (jobData: JobData, cb: (error?: any) => void) => {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(jobData.link);
      const container = await page.waitForSelector("#community-bar-container");;
      await container.hover();
      const iFrame = await container.waitForSelector("iframe");
      const frameContent = await iFrame.contentFrame();

      if (frameContent) {
        const commentsTitle = await frameContent.waitForSelector(".comments-title");
        await commentsTitle.click();
        const comments = await frameContent.waitForSelector(".comments-body .comments-list");
        const commentsList = await comments.$$(".Wow\\(bw\\)");
        for (const comment of commentsList) {
          const text = (await comment.textContent()) ?? "";
          console.log(text);
          await insertComment({ article_link: jobData.link, text });
        }
      } else {
        console.log("iFrame not found")
      }

      await browser.close();

      setTimeout(() => {
        console.log("done", this.tasks.length(), "remaining");
      }, 10000);
    } catch (error) {
      console.error(error);

      if (jobData.retries > 1) {
        this.tasks.push({ link: jobData.link, retires: jobData.retries - 1 });
      }
    } finally {
      cb();
    }
  }
}

export { Crawler };