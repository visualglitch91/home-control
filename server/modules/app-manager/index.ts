import * as pm2 from "./pm2";
import * as docker from "./docker";
import { createAppModule, compareByName } from "$server/utils";

export default createAppModule("app-manager", (instance) => {
  docker.setupUpdateChecker();

  instance.get("/apps", async () => {
    const containers = await docker.getContainers();
    const apps = await pm2.list();

    return { apps: [...containers, ...apps].sort(compareByName) };
  });

  /*
   * Docker Apps
   */

  instance.get<{ Params: { name: string } }>("/docker/:name", (req) => {
    const { name } = req.params;
    return docker.getContainerByName(name);
  });

  instance.post<{ Params: { name: string }; Body: { running: boolean } }>(
    "/docker/:name",
    async (req) => {
      const { name } = req.params;
      return docker.action(name, req.body.running ? "start" : "stop");
    }
  );

  instance.post<{
    Params: {
      name: string;
      action: "start" | "stop" | "restart";
    };
  }>("/docker/:name/:action", async (req) => {
    const { name, action } = req.params;
    return docker.action(name, action);
  });

  instance.get<{ Params: { name: string } }>(
    "/docker/:name/logs",
    (req, res) => {
      docker
        .createLogStreamer(req.params.name)
        .then((streamLogs) => streamLogs(req, res));
    }
  );

  instance.get<{ Params: { name: string } }>(
    "/docker/:name/image-update-status",
    (req) => docker.checkForContainerImageUpdates(req.params.name)
  );

  /*
   * PM2 Apps
   */

  instance.get<{ Params: { name: string } }>("/pm2/:name", (req) => {
    const { name } = req.params;
    return pm2.getAppByName(name);
  });

  instance.post<{ Params: { name: string }; Body: { running: boolean } }>(
    "/pm2/:name",
    async (req) => {
      const { name } = req.params;
      return pm2.action(name, req.body.running ? "start" : "stop");
    }
  );

  instance.post<{
    Params: { name: string; action: "start" | "stop" | "restart" };
  }>("/pm2/:name/:action", async (req) => {
    const { name, action } = req.params;
    return pm2.action(name, action);
  });

  instance.get<{ Params: { name: string } }>("/pm2/:name/logs", (req, res) => {
    pm2
      .createLogStreamer(req.params.name)
      .then((streamLogs) => streamLogs(req, res));
  });
});
