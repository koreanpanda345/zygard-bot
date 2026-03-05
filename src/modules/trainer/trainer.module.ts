import BaseModule from "../../base/BaseModule.ts";

export default class TrainerModule extends BaseModule {
    constructor() {
        super(TrainerModule.name);
        this.description = "This module contains all of the trainer related commands and functions.";
        this.isEnabled = true;
    }
}