import "dotenv/config";
import { FastifyInstance } from "fastify";

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function withRetry<O extends () => Promise<any>>(
  operation: O,
  delay: number,
  retries = 1
): ReturnType<O> {
  return new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(withRetry.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }

        return reject(reason);
      });
  }) as any;
}

export function bytesToSize(bytes: number, precision: number = 0) {
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;
  var terabyte = gigabyte * 1024;

  if (bytes >= 0 && bytes < kilobyte) {
    return bytes + "b";
  } else if (bytes >= kilobyte && bytes < megabyte) {
    return (bytes / kilobyte).toFixed(precision) + "kb";
  } else if (bytes >= megabyte && bytes < gigabyte) {
    return (bytes / megabyte).toFixed(precision) + "mb";
  } else if (bytes >= gigabyte && bytes < terabyte) {
    return (bytes / gigabyte).toFixed(precision) + "gb";
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + "tb";
  } else {
    return bytes + "b";
  }
}

export function timeSince(date: Date | number) {
  //@ts-ignore
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " yrs";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hrs";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export function compareByName(a: { name: string }, b: { name: string }) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
}

export function isDefined(value: any) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  return true;
}

export function createAppModule(
  name: string,
  definition: (instance: FastifyInstance) => void
) {
  async function plugin(instance: FastifyInstance) {
    return definition(instance);
  }

  return { name, plugin };
}
