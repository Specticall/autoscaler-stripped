import { RequestHandler } from "express";
import SchedulerService, { Job } from "../service/SchedulerService";
import { z } from "zod";
import { UIS_HOST, UIS_PASSWORD, UIS_USERNAME } from "../utils/config";
import axios from "axios";
import { AppError } from "../utils/AppError";
import { STATUS } from "../utils/statusCodes";
import vmConfig from "../utils/vmConfig";
import chalk from "chalk";

const scheduler = SchedulerService.getInstance();
const VMConfigSchema = z.object({
  templateId: z.number().int().positive(),
  targetHostId: z.number().int().positive(),
  storeSrc: z.string(),
  dest: z.string(),
  storePool: z.string(),
  vmName: z.string(),
  vmCpuSocket: z.number().int().positive(),
  vmCpuCore: z.number().int().positive(),
  vmMemory: z.number().int().positive(),
});
export type VMConfig = z.infer<typeof VMConfigSchema>;

/**
 * POST /schedule/scale
 * URL yang bakal di hit sama alert manager buat schedule "scale job"
 */
export const scaleHandler: RequestHandler = async (request, response, next) => {
  try {
    // Function that gets run when then scheduler performs the action
    const scaleJob: Job = () => provisionVM(vmConfig);

    // Push the job into the scheduler to prevent blocking
    scheduler.queue(scaleJob);
    response.send({
      status: "success",
      message: "Successfuly queued scale job",
    });
  } catch (error) {
    next(error);
  }
};

async function provisionVM(config: VMConfig) {
  try {
    console.log(`${chalk.magenta("[JOB]")} Obtaining AC_TOKEN`);
    const loginParams = {
      encrypt: false,
      loginType: "authorCenter",
      name: UIS_USERNAME,
      password: UIS_PASSWORD,
    };
    const loginResponse = await axios.post(
      `${UIS_HOST}/uis/spring_check`,
      null,
      {
        params: loginParams,
      }
    );
    const acToken = loginResponse.data.acToken;
    if (!acToken) {
      throw new AppError(
        "Authentication failed: no acToken returned",
        STATUS.INTERNAL_SERVER_ERROR
      );
    }
    console.log(`${chalk.magenta("[JOB]")} Successfully Obtained AC_TOKEN`);

    console.log(`${chalk.magenta("[JOB]")} Deploying VM`);
    const deployBody = {
      cpuSocket: config.vmCpuSocket,
      cpuCore: config.vmCpuCore,
      id: config.templateId,
      memory: config.vmMemory,
      store: [
        { src: config.storeSrc, dest: config.dest, pool: config.storePool },
      ],
      targetHostId: config.targetHostId,
      title: config.vmName,
      net: [
        {
          mac: "0c:da:41:1d:a6:e6",
          netInfos: [
            { name: "vswitch0", profileName: "Default", sysIpType: 0 },
          ],
        },
      ],
      autoStartVm: 0,
      deployMode: 0,
      deployType: 1,
      destType: 2,
      secretLevel: 1,
      sysConfig: false,
      vmNum: 1,
    };

    await axios.post(`${UIS_HOST}/uis/vm/deploy`, deployBody, {
      headers: {
        Cookie: `AC_TOKEN=${acToken}`,
      },
    });
    console.log(`${chalk.magenta("[JOB]")} Successfully Deployed VM`);
  } catch (err) {
    if (typeof err === "object" && err && "message" in err) {
      console.log(`${chalk.red("[PROVISION VM ERROR]")} ${err.message}`);
    } else {
      console.log(`${chalk.red("[PROVISION VM ERROR]")} Something went wrong`);
    }
  }
}
