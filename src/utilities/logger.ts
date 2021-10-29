// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
//
//
// export class Logger {
//
//   private winston: winston.Logger;
//
//   constructor () {
//     // this.winston = new Logger();
//   }
//
//   public static buildLogger({domain, parseArgs = true, logInConsole = true,}:
//       {domain: string, parseArgs?: boolean, logInConsole?: boolean}): winston.Logger {
//     const logPath = path.join(__dirname, "..", "logs");
//
//     const errorTransport = Logger.getErrorTransport(logPath);
//     const infoTransport = Logger.getInfoTransport(logPath);
//     const debugTransport = Logger.getDebugTransport(logPath);
//
//     const transports = [errorTransport, infoTransport, debugTransport];
//
//     if (logInConsole) {
//       transports.push(Logger.getConsoleTransport("debug"));
//     }
//
//   public static assembleLogOutput(
//         domain: string,
//         parseArgs: boolean,
//         info: StampedInfo): string {
//       const {
//         timestamp, level, message, ...args
//       } = info;
//
//       const ts = timestamp.slice(0, 19).replace("T", " ");
//       // print out a special prefix when in test mode
//       const testPrefix = (process.env.JEST_WORKER_ID === undefined) ? "" : "TEST-MODE";
//
//       return `${testPrefix} [${domain}] [${level}] @ ${ts}: ${message} ${parseArgs ?
//                                                                          Object.keys(args).length ?
//                                                                          JSON.stringify(jc.decycle(args), null, 2) :
//                                                                          "" :
//                                                                          ""}`;
//
//     }
//
//   public static getFormat(domain: string, parseArgs: boolean = true): Format {
//       const extractError = winston.format((info: TransformableInfo) => {
//         function unfoldError(error: Error): TransformableInfo {
//           return Object.assign({
//                                  message: info.message,
//                                  stack: info.stack,
//                                }, info) as TransformableInfo;
//         }
//
//         if (info instanceof Error) { return unfoldError(info); }
//
//         for (const value of info.values()) {
//           if (value instanceof Error) {
//             return unfoldError(value);
//           }
//         }
//
//         return info; // Nothing special? Then, pass it along.
//       });
//
//       return winston.format.combine(
//           winston.format.timestamp(),
//           winston.format.align(),
//           extractError(),
//           winston.format.printf((info: StampedInfo) => {
//             return Logger.assembleLogOutput(domain, parseArgs, info);
//           }),
//       );
//     }
//   public static getDebugTransport(logPath: string): Transport {
//       return Logger.getFileTransport(logPath, "debug");
//     }
//
//   public static getInfoTransport(logPath: string): Transport {
//       return Logger.getFileTransport(logPath, "info");
//     }
//
//   public static getErrorTransport(logPath: string): Transport {
//       return Logger.getFileTransport(logPath, "error");
//     }
//
//   public static getFileTransport(logPath: string, level: string, config = {
//       datePattern: "HH-DD-MM-YYYY",
//       maxFiles: "14d",
//       maxSize: "20m",
//       zippedArchive: true,
//     }) {
//       return new DailyRotateFile(Object.assign({
//                                                  filename: path.join(logPath, level, `${level}-%DATE%.log`),
//                                                  level,
//                                                }, config));
//     }
//
//   public static getConsoleTransport(level: LogLevel) {
//       return new winston.transports.Console(
//           {
//             format: winston.format.combine(
//                 winston.format.colorize(),
//             ),
//             level,
//           },
//       );
//     }
//
//   public static isInTestMode(): boolean {
//       return process.env.JEST_WORKER_ID !== undefined;
//     }
//
//     return winston.createLogger({
//                                   format: Logger.getFormat(domain, parseArgs),
//                                   transports,
//                                 });
//   }
//
//   /**
//    * This method set the current severity based on the current NODE_ENV:
//    * show all the log levels if the server was run in development mode;
//    * otherwise, if it was run in production, show only warn and error messages.
//    */
//   level() {
//     const env = process.env.NODE_ENV || 'development'
//     const isDevelopment = env === 'development'
//     return isDevelopment ? 'debug' : 'warn'
//   }
// }
