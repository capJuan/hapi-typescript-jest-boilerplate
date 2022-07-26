import * as Hapi from '@hapi/hapi';
import Logger from './helper/logger';
import Router from './router';
import * as DotEnv from 'dotenv';

export default class Server {
  private static _instance: Hapi.Server;

  public static async start(): Promise<Hapi.Server> {
    try {
      DotEnv.config({
        path: `${process.cwd()}/.env`,
      });

      Server._instance = new Hapi.Server({
        port: process.env.PORT,
        routes: {
          cors: {
            origin: ['*'],
          },
          timeout: {
            server: 60000 * 24,
            socket: 60000 * 25
          }
        }
      });

      Server._instance.validator(require('Joi'));

      await Router.loadRoutes(Server._instance);

      await Server._instance.start();

      Logger.info(
        `Server - Up and running at http://${process.env.HOST}`
      );

      process.on('unhandledRejection', (err) => {
          Logger.error(`unhandledRejection ${err}`);
          throw err;
      });

      return Server._instance;
    } catch (error) {
      Logger.info(`Server - There was something wrong: ${error}`);

      throw error;
    }
  }

  public static stop(): Promise<Error | void> {
    Logger.info(`Server - Stopping execution`);

    return Server._instance.stop();
  }

  public static async recycle(): Promise<Hapi.Server> {
    Logger.info(`Server - Recycling instance`);

    await Server.stop();

    return await Server.start();
  }

  public static instance(): Hapi.Server {
    return Server._instance;
  }

  public static async inject(
    options: string | Hapi.ServerInjectOptions
  ): Promise<Hapi.ServerInjectResponse> {
    return await Server._instance.inject(options);
  }
}
