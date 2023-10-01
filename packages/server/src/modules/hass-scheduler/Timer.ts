import { Timer as TimerData } from "@home-control/types/hass-scheduler";
import { runActions } from "./utils";

export default class Timer {
  private config: TimerData;
  private timeout: NodeJS.Timeout;

  constructor(config: TimerData, onCompleted: () => void) {
    this.config = config;
    this.timeout = setTimeout(() => {
      onCompleted();
      runActions(this.config.actions);
    }, config.duration * 1000);
  }

  cancel() {
    clearTimeout(this.timeout);
  }

  toJSON() {
    return { ...this.config };
  }
}
