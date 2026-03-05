import { Dex } from "@pkmn/dex";
import BaseHandler from "../../../base/BaseHandler.ts";

export default class HandleRandomNature extends BaseHandler {
    constructor() {
        super(HandleRandomNature.name);
    }

    override handle() {
        const natures = Dex.natures.all();
        return natures[Math.floor(Math.random() * natures.length) - 1];
    }
}