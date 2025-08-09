import getDirName from "./bin/commands/get.dir.name";
import Environment from "./types/environment/environment";
// import {ENV_PARAMS_REMOTE}from "./types/environment/environment";
import {OnlineEnvironment} from "./types/environment/online.environment";
import { User } from "./types/environment/user";
import { bright, blue,green, red,reset, yellow,BGblue } from "./bin/console/console.colors";
import getAllFilesInDirectory from "./bin/commands/get.all.files";
import { formatMarkdown} from "./bin/encoders/format.markdown";
import { ScriptWorker, WorkerBot } from "./types/environment/bot";
// import { FRONT_MATTER } from "./types/transformer/yaml";

export {
    OnlineEnvironment,
    Environment,
    WorkerBot,
    ScriptWorker,
    User,
    // FRONT_MATTER, 
    getDirName,
    getAllFilesInDirectory,
    formatMarkdown,
    bright,
    blue,
    green,
    reset,
    red,
    yellow,
    BGblue
};