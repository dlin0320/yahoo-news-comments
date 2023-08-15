import schedule from "node-schedule";
import { OnceData, RegularData } from "./types";

class Scheduler {
  jobs: { [name: string]: () => void } = {};

  newJob = (name: string, cb: () => void) => {
    this.jobs[name] = cb;
  }

  once = (data: OnceData, cb: () => void) => {
    if (data.retries > 0) {
      schedule.scheduleJob(data.date, cb);
    }
  }

  regular = (data: RegularData, cb: () => void) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = data.hour;
    rule.minute = data.minute;
    rule.second = data.second;
    schedule.scheduleJob(rule, cb);
  }
}

export { Scheduler };