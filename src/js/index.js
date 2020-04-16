import AppService from "./modules/service";
import {conf} from "./modules/config";
import "./modules/component";
import "./modules/common";
import "../scss/main.scss";

console.log(`config.js: ${conf.key}`);
const service = new AppService('Hello!');
service.log();
const jquery = require('jquery');
