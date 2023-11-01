import { existsSync } from "fs";
import { randomUUID } from "crypto";
import { exec } from "child_process";


const defaultLocation = "/tmp/rml-" + randomUUID() + ".jar";
let rmlJarPromise: undefined | Promise<string> = undefined;

export async function getJarFile(mLocation: string | undefined, offline: boolean, url: string): Promise<string> {
  const location = mLocation || defaultLocation;

  try {
    if (existsSync(location)) {
      return location;
    }
  } catch (e: any) { }

  // Did not find the file :/
  if (offline) {
    throw "Did not find jar file, and the runner is started in offline mode. Cannot continue.";
  }

  if (!rmlJarPromise) {
    rmlJarPromise = (async function() {
      const cmd = `wget ${url} -O ${location}`;
      console.log("Executing $", cmd)
      const proc = exec(cmd);
      await new Promise(res => proc.once("exit", res));
      return location;
    })();
  }

  return rmlJarPromise;
}
