
//% emitAsConstant
enum Filterlist {
    //% block="MM"
    //% blockIdentity="filters.pick"
    MM = 1,
    //% block="MA"
    //% blockIdentity="filters.pick"
    MA = 2,
    //% block="WMA"
    //% blockIdentity="filters.pick"
    WMA = 3,
    //% block="EMA"
    //% blockIdentity="filters.pick"
    EMA = 4,
    //% block="LMS"
    //% blockIdentity="filters.pick"
    LMS = 5,
    //% block="NLMS"
    //% blockIdentity="filters.pick"
    NLMS = 6,
    //% block="Kalman"
    //% blockIdentity="filters.pick"
    Kalman = 7,
    //% block="No"
    //% blockIdentity="filters.pick"
    No = 8
}

namespace filters {
    //% shim=TD_ID
    //% blockId=FilterlistItem
    //% block="Filter $pick"
    export function pick(pick: Filterlist) {
        switch (pick) {
            case Filterlist.MM:
                return new Filter.MM(5)
            case Filterlist.MA:
                return new Filter.MA(10)
            case Filterlist.WMA:
                return new Filter.WMA(10)
            case Filterlist.EMA:
                return new Filter.EMA(0.1)
            case Filterlist.LMS:
                return new Filter.LMS(15, 0.00000102)
            case Filterlist.NLMS:
                return new Filter.NLMS(8)
            case Filterlist.Kalman:
                return new Filter.Kalman(0.49, 1, 0, 1, 0.49, 1225)
            case Filterlist.No:
                return 0
            default:
                return new Filter.MM(5)
        }
    }
}

//% enumIdentity="Filterlist.MM"
//% blockIdentity="filters.pick"
const MM = Filterlist.MM;

//% enumIdentity="Filterlist.MA"
//% blockIdentity="filters.pick"
const MA = Filterlist.MA;

//% enumIdentity="Filterlist.WMA"
//% blockIdentity="filters.pick"
const WMA = Filterlist.WMA;

//% enumIdentity="Filterlist.EMA"
//% blockIdentity="filters.pick"
const EMA = Filterlist.EMA;

//% enumIdentity="Filterlist.LMS"
//% blockIdentity="filters.pick"
const LMS = Filterlist.LMS;

//% enumIdentity="Filterlist.NLMS"
//% blockIdentity="filters.pick"
const NLMS = Filterlist.NLMS;

//% enumIdentity="Filterlist.Kalman"
//% blockIdentity="filters.pick"
const Kalman = Filterlist.Kalman;

//% enumIdentity="Filterlist.No"
//% blockIdentity="filters.pick"
const No = Filterlist.No;