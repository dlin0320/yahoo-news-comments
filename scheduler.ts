import schedule from "node-schedule";
import { ScheduleData, insertSchedule, getAllSchedules } from "./db";

class Scheduler {
  tasks: { [name: string]: () => void };

  constructor(tasks: { [name: string]: () => void }) {
    this.tasks = tasks;
    getAllSchedules().then(schedules => {
      schedules.forEach(schedule => {
        this.schedule(schedule);
      });
    });
  }

  schedule = (scheduleData: ScheduleData) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = scheduleData.hour;
    rule.minute = scheduleData.minute;
    rule.second = scheduleData.second;
    schedule.scheduleJob(rule, this.tasks[scheduleData.taskName]);
    insertSchedule(scheduleData);
  }
}

export { Scheduler };