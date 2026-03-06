import BaseHandler from "../../../base/BaseHandler.ts";
import Database from "../../../core/Database.ts";

export default class HandleGetRoute extends BaseHandler {
    constructor() {
        super(HandleGetRoute.name);
    }

    override async handle(routeName: string) {
        const route = await Database.RouteCollection.findOne({
            routeId: routeName.toLowerCase().replaceAll(" ", "").trim(),
        });

        return route;
    }
}