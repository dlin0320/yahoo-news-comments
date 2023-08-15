import axios from "axios";

describe("insert schedule and get all schedules", () => {
  it("should insert a schedule and get all schedules", async () => {
    const schedule = {
      hour: 0,
      minute: 0,
      second: 0,
      jobName: "yahoo_news"
    };
    await axios.post("http://localhost:8080/schedule", schedule);
    const response = await axios.get(`http://localhost:${process.env.PORT}/schedule`);
    expect(response.status).toEqual(200);
    expect(response.data).toContain(schedule);
  });

  it
});

describe("get articles", () => {

});