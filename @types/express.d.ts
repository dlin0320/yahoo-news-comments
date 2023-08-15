import { Application } from "express";
import { Database } from "../database";
import { Crawler } from "../crawler";
import { Scheduler } from "../scheduler";

declare module "express" {
  interface Application {
    locals: {
      database: Database;
      crawler: Crawler;
      scheduler: Scheduler;
    }
  }
}