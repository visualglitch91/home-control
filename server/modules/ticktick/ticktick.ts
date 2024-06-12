import { CronJob } from "cron";
import { keyBy, orderBy, sortBy, uniqBy } from "lodash";
import {
  format,
  isEqual,
  subDays,
  isWithinInterval,
  differenceInCalendarDays,
  subMilliseconds,
} from "date-fns";
import objectid from "bson-objectid";
import ky from "ky";
import { rrulestr } from "rrule";
import { Habit, ScheduledTask, UnscheduledTask } from "$common/types/ticktick";
import { logger } from "$server/utils";
import { normalizeDate } from "./utils";

const client = ky.create({});

let token: string | undefined = undefined;

interface Checkin {
  habitId: string;
  id: string;
  opTime: string;
  status: 0 | 1 | 2;
  value: number;
}

function tickStamp(date: Date) {
  return format(date, "yyyy-MM-dd").split("-").join("");
}

function callAPI<T = any>(
  path: string,
  method: string,
  data?: any
): Promise<T> {
  return client(`https://ticktick.com/api/${path}`, {
    method,
    json: data,
    headers: {
      "content-type": "application/json",
      origin: "https://ticktick.com",
      "x-device": JSON.stringify({
        platform: "web",
        os: "Linux x86_64",
        device: "Chrome 114.0.0.0",
        name: "",
        version: 4531,
        id: "6488ceeb59aa0918a4b5fa85",
        channel: "website",
        campaign: "",
        websocket: "",
      }),
      cookie: token && `t=${token}`,
    },
  }).json();
}

export default class TickTick {
  loggedIn = false;
  username: string;
  password: string;

  private apiCache: {
    "GET_v2/batch/check/0": {
      inboxId: string;
      projectProfiles: any[];
      syncTaskBean: { update: any[] };
    };
    "GET_v2/calendar/bind/events/all": { events: any[] };
    "GET_v2/habits": { id: string; name: string; goal: number }[];
    "POST_v2/habitCheckins/query": Record<string, Checkin[]>;
  } = {
    "GET_v2/batch/check/0": {
      inboxId: "",
      projectProfiles: [],
      syncTaskBean: { update: [] },
    },
    "GET_v2/calendar/bind/events/all": { events: [] },
    "GET_v2/habits": [],
    "POST_v2/habitCheckins/query": {},
  };

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
    this.updateAPICache();
    new CronJob("* * * * *", () => this.updateAPICache()).start();
  }

  login() {
    if (this.loggedIn) {
      return Promise.resolve();
    }

    return callAPI("v2/user/signon?wc=true&remember=true", "POST", {
      username: this.username,
      password: this.password,
    }).then((res) => {
      if (typeof res?.username === "undefined") {
        logger.info("Error while loggin in on TickTick");
      } else {
        logger.info("TickTick logged in");
        token = res.token;
        this.loggedIn = true;
      }
    });
  }

  async updateAPICache() {
    try {
      await this.login();

      this.apiCache["GET_v2/batch/check/0"] = await callAPI(
        "v2/batch/check/0",
        "GET"
      );

      this.apiCache["GET_v2/calendar/bind/events/all"] = await callAPI(
        "v2/calendar/bind/events/all",
        "GET"
      );

      this.apiCache["GET_v2/habits"] = await callAPI("v2/habits", "GET");

      this.apiCache["POST_v2/habitCheckins/query"] = await callAPI(
        "v2/habitCheckins/query",
        "POST",
        {
          habitIds: this.apiCache["GET_v2/habits"].map((it: any) => it.id),
          afterStamp: tickStamp(subDays(new Date(), 1)),
        }
      ).then((res) => res.checkins);
    } catch (err) {
      logger.error(err);
    }
  }

  async getUncompletedTasks(
    since: Date,
    until: Date,
    projectIds = new Array<string>()
  ): Promise<{
    scheduled: ScheduledTask[];
    unscheduled: UnscheduledTask[];
  }> {
    const scheduled: ScheduledTask[] = [];
    const unscheduled = new Array<UnscheduledTask>();

    const { inboxId, projectProfiles, syncTaskBean } =
      this.apiCache["GET_v2/batch/check/0"];

    const projectsById = keyBy(projectProfiles, "id");
    const rawTasks = syncTaskBean.update;

    rawTasks.forEach((rawTask: any) => {
      if (rawTask.status !== 0 || !projectIds.includes(rawTask.projectId)) {
        return;
      }

      const projectName =
        rawTask.projectId === inboxId
          ? "Inbox"
          : projectsById[rawTask.projectId].name;

      if (!rawTask.dueDate) {
        unscheduled.push({
          id: rawTask.id,
          title: rawTask.title,
          projectId: rawTask.projectId,
          projectName,
          type: "task",
          raw: rawTask,
        });

        return;
      }

      let startDate = normalizeDate(rawTask.startDate, rawTask.timezone);
      let dueDate = normalizeDate(rawTask.dueDate, rawTask.timezone);

      if (!isWithinInterval(startDate, { start: since, end: until })) {
        return;
      }

      scheduled.push({
        id: rawTask.id,
        projectId: rawTask.projectId,
        projectName,
        title: rawTask.title,
        startDate: startDate.toISOString(),
        endDate: dueDate.toISOString(),
        timeZone: rawTask.timezone,
        isAllDay: rawTask.isAllDay,
        type: "task",
        raw: rawTask,
      });
    });

    const result = {
      scheduled: sortBy(scheduled, "startDate"),
      unscheduled,
    };

    return result;
  }

  async getEvents(
    since: Date,
    until: Date,
    excludedCalendarIds = new Array<string>()
  ): Promise<ScheduledTask[]> {
    const scheduled: ScheduledTask[] = [];

    const { events: rawEvents } =
      this.apiCache["GET_v2/calendar/bind/events/all"];

    rawEvents.forEach((calendar: any) => {
      if (excludedCalendarIds.includes(calendar.id)) {
        return;
      }

      calendar.events.forEach((rawEvent: any) => {
        try {
          if (
            rawEvent.attendees?.find((attendee: any) => attendee.self === true)
              ?.responseStatus === "declined"
          ) {
            return;
          }
        } catch (_) {}

        const startDate = normalizeDate(
          rawEvent.dueStart,
          rawEvent.isAllDay ? undefined : "America/Sao_Paulo"
        );

        const startDates = rawEvent.repeatFlag
          ? rrulestr(rawEvent.repeatFlag, {
              tzid: "America/Sao_Paulo",
              dtstart: startDate,
            }).between(since, until, true)
          : [startDate];

        startDates.forEach((startDate) => {
          let endDate: Date | null = normalizeDate(
            rawEvent.dueEnd,
            rawEvent.isAllDay ? undefined : "America/Sao_Paulo"
          );

          if (rawEvent.repeatFlag) {
            endDate = rrulestr(rawEvent.repeatFlag, {
              tzid: "America/Sao_Paulo",
              dtstart: endDate,
            }).after(startDate);
          }

          if (!endDate) {
            return;
          }

          if (rawEvent.isAllDay) {
            endDate = subMilliseconds(endDate, 1);
          }

          if (!isWithinInterval(startDate, { start: since, end: until })) {
            return;
          }

          if (
            rawEvent.eXDates?.some((dateStr: string) =>
              isEqual(startDate!, new Date(dateStr))
            )
          ) {
            return;
          }

          const parsedEvent = {
            id: `${rawEvent.id}@${calendar.id}`,
            title: rawEvent.title,
            projectId: calendar.id,
            projectName: calendar.name,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            timeZone: rawEvent.timezone,
            isAllDay: rawEvent.isAllDay,
            type: "event" as const,
            raw: rawEvent,
          };

          scheduled.push(parsedEvent);
        });
      });
    });

    const result = uniqBy(
      orderBy(scheduled, ["startDate"], ["desc"]),
      (it) => `${it.raw.uid}--${format(new Date(it.startDate), "yyyy-MM-dd")}`
    ).reverse();

    return result;
  }

  async getCalendar(
    since: Date,
    until: Date,
    projectIds = new Array<string>(),
    excludedCalendarIds = new Array<string>()
  ) {
    const [{ scheduled: scheduledTasks, unscheduled }, scheduledEvents] =
      await Promise.all([
        this.getUncompletedTasks(since, until, projectIds),
        this.getEvents(since, until, excludedCalendarIds),
      ]);

    return {
      unscheduled,
      scheduled: sortBy([...scheduledTasks, ...scheduledEvents], "startDate"),
    };
  }

  async getTodayHabits(): Promise<Habit[]> {
    const today = new Date();
    const habits = this.apiCache["GET_v2/habits"];
    const checkins = this.apiCache["POST_v2/habitCheckins/query"];

    const checkinsByHabitId = Object.values(checkins)
      .flat()
      .filter(
        (it: any) => differenceInCalendarDays(new Date(it.opTime), today) === 0
      )
      .reduce<Record<string, Checkin>>((acc, it: any) => {
        return { ...acc, [it.habitId]: it };
      }, {});

    const result = habits.map((habit: any) => {
      const checkin = checkinsByHabitId[habit.id];

      return {
        habitId: habit.id,
        checkinId: checkin?.id,
        name: habit.name,
        goal: habit.goal,
        value: checkin?.value || 0,
        raw: habit,
      };
    });

    return result;
  }

  async checkinHabit(habitId: string) {
    const habit = (await this.getTodayHabits()).find(
      (it) => it.habitId === habitId
    );

    if (!habit) {
      throw new Error("habit not found");
    }

    if (habit.value === habit.goal) {
      return;
    }

    const value = habit.value + 1;
    const status = value === habit.goal ? 2 : 0;

    const checkin = {
      checkinStamp: tickStamp(new Date()),
      opTime: new Date(),
      goal: habit.goal,
      habitId,
      id: habit.checkinId || objectid(),
      status,
      value,
    };

    const res = await callAPI("v2/habitCheckins/batch", "POST", {
      add: !habit.checkinId ? [checkin] : [],
      update: habit.checkinId ? [checkin] : [],
      delete: [],
    });

    await this.updateAPICache();

    return res;
  }

  async completeTask(id: string, projectId: string) {
    const task = await callAPI(`v2/task/${id}?projectId=${projectId}`, "GET");

    if (!task) {
      throw new Error("task not found");
    }

    const now = new Date();

    const res = await callAPI("v2/batch/task", "POST", {
      add: [],
      update: [
        {
          ...task,
          status: 2,
          modifiedTime: now,
          completedTime: now,
          timeZone: "America/Sao_Paulo",
        },
      ],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: [],
    });

    await this.updateAPICache();

    return res;
  }
}
