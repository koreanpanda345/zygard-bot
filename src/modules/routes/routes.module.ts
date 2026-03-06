import BaseModule from "../../base/BaseModule.ts";

export default class RoutesModule extends BaseModule {
    constructor() {
        super(RoutesModule.name);
        this.description = "This module contains all of the routes for the web server.";
        this.isEnabled = true;
    }
}