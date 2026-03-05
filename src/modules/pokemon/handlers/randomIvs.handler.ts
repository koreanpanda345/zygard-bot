import BaseHandler from "../../../base/BaseHandler.ts";

export default class HandleRandomIvs extends BaseHandler {
    constructor() {
        super(HandleRandomIvs.name);
    }

    override handle(
    hp: number = -1,
    atk: number = -1,
    def: number = -1,
    spa: number = -1,
    spd: number = -1,
    spe: number = -1,
  ) {
    const _hp = hp === -1 ? Math.floor(Math.random() * 31) : hp;
    const _atk = atk === -1 ? Math.floor(Math.random() * 31) : atk;
    const _def = def === -1 ? Math.floor(Math.random() * 31) : def;
    const _spa = spa === -1 ? Math.floor(Math.random() * 31) : spa;
    const _spd = spd === -1 ? Math.floor(Math.random() * 31) : spd;
    const _spe = spe === -1 ? Math.floor(Math.random() * 31) : spe;

    return {
      hp: _hp,
      atk: _atk,
      def: _def,
      spa: _spa,
      spd: _spd,
      spe: _spe,
    };
  }
}