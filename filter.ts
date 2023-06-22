namespace Filter {

    class BaseFilter {
        //current value
        current: number

        constructor() {
        }

        //returns the current value
        get_current(): number {
            return this.current
        }
    }

    class windowFilter extends BaseFilter {
        window: number[]
        windowsize: number

        constructor(windowsize: number) {
            super()
            this.windowsize = windowsize
            this.window = []
        }

        //adds measuremnt to the window
        add_measurement(measurement: number) {
            this.window.push(measurement)
            if (this.window.length > this.windowsize) { this.window.shift() }
        }
    }

    export class MM extends windowFilter {
        constructor(windowsize: number) {
            super(windowsize)
        }

        update(measurement: number): number {
            this.add_measurement(measurement)
            if (this.window.length < this.windowsize) { return measurement }

            this.current = this.calculate()
            return this.current
        }

        calculate(): number {
            const temp: number[] = [];
            this.window.forEach((item) => {
                temp.push(item)
            })
            temp.sort((a, b) => a - b);
            if (temp.length % 2 === 0) {
                return (temp[temp.length / 2 - 1] + temp[temp.length / 2]) / 2
            } else if (temp.length === 1) {
                return temp[0];
            } else {
                return temp[Math.floor(temp.length / 2)];
            }
        }
    }

    export class MA extends windowFilter {
        constructor(windowsize: number) {
            super(windowsize)
        }

        update(measurement: number): number {
            this.add_measurement(measurement)
            if (this.window.length < this.windowsize) { return measurement }

            this.current = this.calculate()
            return this.current
        }

        calculate(): number {
            let window_average = Math.roundWithPrecision(average(this.window), 10)
            return window_average
        }
    }

    export class WMA extends windowFilter {
        constructor(windowsize: number) {
            super(windowsize)
        }

        update(measurement: number): number {
            this.add_measurement(measurement)
            if (this.window.length < this.windowsize) { return measurement }

            this.current = this.calculate()
            return this.current
        }

        calculate(): number {
            const window_ww = this.window.map((value, index) => value * (index + 1));

            let av = 2 * sum(window_ww) / (this.windowsize * (this.windowsize + 1))
            return Math.roundWithPrecision(av, 10)
        }
    }

    export class EMA extends BaseFilter {
        //exponential factor
        alpha: number
        //last calculated ema value
        last_ema: number

        constructor(alpha: number) {
            super()
            this.alpha = alpha
            this.last_ema = 0
        }

        update(measurement: number): number {
            if (this.last_ema == 0) {
                this.last_ema = measurement
                return measurement
            }
            this.current = this.calculate(measurement)
            return this.current
        }

        calculate(measurement: number): number {
            this.last_ema = this.alpha * measurement + (1 - this.alpha) * this.last_ema
            return Math.roundWithPrecision(this.last_ema, 10)
        }
    }

    export class LMS extends windowFilter {
        //step size mu
        mu: number
        //weights
        h: number[]

        constructor(windowsize: number, mu: number) {
            super(windowsize)
            this.mu = mu
            this.h = zeros(windowsize)
        }

        update(measurement: number): number {
            if (this.window.length == this.windowsize) {
                this.current = this.calculate(measurement)
                this.add_measurement(measurement)

                return this.current
            }

            this.add_measurement(measurement)

            return measurement
        }

        calculate(measurement: number) {
            let input = this.window
            let xhatn = dot(this.h, input)
            let en = measurement - xhatn

            let temp1 = vectimesnum(input, en * this.mu)
            this.h = vecaddvec(temp1, this.h)

            return xhatn
        }
    }

    export class NLMS extends windowFilter {
        //weights
        h: number[]

        constructor(windowsize: number) {
            super(windowsize)
            this.h = zeros(windowsize)
        }

        update(measurement: number): number {
            if (this.window.length == this.windowsize) {
                this.current = this.calculate(measurement)
                this.add_measurement(measurement)
                return this.current
            }

            this.add_measurement(measurement)
            return measurement
        }

        calculate(measurement: number) {
            let input = this.window
            let xhatn = dot(this.h, input)
            let en = measurement - xhatn

            let temp1 = vectimesnum(input, en)
            let temp2 = dot(input, input)
            let temp3 = vecdivnum(temp1, temp2)

            this.h = vecaddvec(temp3, this.h)

            return xhatn
        }
    }

    export class Kalman extends BaseFilter {
        // initial state estimate
        private x: number;
        private P: number;

        // state transition matrix
        private F: number;

        // control input matrix
        private B: number;

        // observation matrix
        private H: number;

        // measurement noise covariance matrix
        private R: number;

        // process noise covariance matrix
        private Q: number;

        constructor(P: number, F: number, B: number, H: number, R: number, Q: number, x?: number) {
            super()
            if (x) {
                this.x = x
            } else {
                this.x = null
            }
            this.P = P;
            this.F = F;
            this.B = B;
            this.H = H;
            this.R = R;
            this.Q = Q;
        }

        public update(measurement: number) {
            this.current = this.calculate(measurement)
            return this.current
        }

        calculate(measurement: number) {
            if (this.x == null) {
                this.x = measurement
                return measurement
            }
            // prediction step
            const x_pred = this.F * this.x;
            const P_pred = this.F * this.P * this.F + this.Q;

            // measurement update step
            const y = measurement - this.H * x_pred;
            const S = this.H * P_pred * this.H + this.R;
            const K = P_pred * this.H / S;
            this.x = x_pred + K * y;
            this.P = (1 - K * this.H) * P_pred;

            return this.x
        }
    }

    function zeros(num: number): number[] {
        let temp: number[] = []
        for (let i = 0; i < num; i++) {
            temp.push(0)
        }
        return temp
    }

    function sum(array: number[]) {
        return array.reduce((a, b) => a + b, 0)
    }

    function average(array: number[]) {
        return (sum(array) / array.length)
    }

    function dot(arr1: number[], arr2: number[]): number {
        return arr1.reduce((acc, val, i) => acc + val * arr2[i], 0)
    }

    function vecaddvec(arr1: number[], arr2: number[]): number[] {
        return arr1.map((val, i) => val + arr2[i]);
    }

    function vectimesvec(arr1: number[], arr2: number[]): number[] {
        return arr1.map((val, i) => val * arr2[i]);
    }

    function vectimesnum(arr1: number[], num: number): number[] {
        return arr1.map((val) => val * num);
    }

    function vecaddnum(arr1: number[], num: number): number[] {
        return arr1.map((val) => val + num);
    }

    function vecdivnum(arr: number[], num: number): number[] {
        return arr.map((val) => val / num);
    }
}

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