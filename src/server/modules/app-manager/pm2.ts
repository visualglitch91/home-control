import pm2 from "pm2";
import { bytesToSize, isDefined, timeSince } from "../../helpers";
import { App, AppStatus, PM2Status } from "../../../types/app-manager";

const statusMap: Record<PM2Status, AppStatus> = {
  online: "running",
  stopping: "running",
  stopped: "stoppped",
  launching: "running",
  errored: "errored",
  "one-launch-status": "stoppped",
};

function translateStatus(status?: PM2Status) {
  if (!status) {
    return null;
  }

  return statusMap[status];
}

export function list() {
  return new Promise<App[]>((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject(err);
      }

      pm2.list((err, apps) => {
        pm2.disconnect();
        if (err) {
          reject(err);
        }

        resolve(
          apps.map((app) => ({
            id: app.pm_id!.toString(),
            name: app.name || app.pm_id!.toString(),
            status: translateStatus(app.pm2_env?.status),
            cpu: isDefined(app.monit?.cpu) ? app.monit!.cpu! : 0,
            memory: isDefined(app.monit?.memory)
              ? bytesToSize(app.monit!.memory!)
              : "0mb",
            uptime: app.pm2_env?.pm_uptime
              ? timeSince(app.pm2_env.pm_uptime)
              : null,
            type: "pm2",
          }))
        );
      });
    });
  });
}

export function getAppByName(name: string) {
  return list().then((apps) => apps.find((it) => it.name === name));
}

export function action(name: string, action: "start" | "stop" | "restart") {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject(err);
      }

      pm2[action === "stop" ? "stop" : "restart"](name, (err, proc) => {
        pm2.disconnect();

        if (err) {
          reject(err);
        }

        resolve(proc);
      });
    });
  });
}