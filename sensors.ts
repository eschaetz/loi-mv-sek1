namespace Sensoren {

    class BaseSensor {
        live: number
        filter: any;
        low_bound: number
        high_bound: number
        cal_factor: number

        constructor(cal_factor?: number) {
            if (cal_factor) {
                this.cal_factor = cal_factor
            }
        }

        get_filtered() {
            return this.filter.get_last_value()
        }

        get_unfiltered() {
            return this.live
        }

        is_valid(measurement: number): boolean {
            if (measurement >= this.low_bound && measurement <= this.high_bound) {
                return true
            }
            return false
        }

        set_filter(filter: any) {
            this.filter = filter
        }

        set_filter_list(filter: Filterlist) {
            switch (filter) {
                case Filterlist.MM:
                    this.filter = new Filter.MM(5)
                    break
                case Filterlist.MA:
                    this.filter = new Filter.MA(10)
                    break
                case Filterlist.WMA:
                    this.filter = new Filter.WMA(10)
                    break
                case Filterlist.EMA:
                    this.filter = new Filter.EMA(0.1)
                    break
                case Filterlist.LMS:
                    this.filter = new Filter.LMS(15, 0.00000102)
                    break
                case Filterlist.NLMS:
                    this.filter = new Filter.NLMS(8)
                    break
                case Filterlist.Kalman:
                    this.filter = new Filter.Kalman(0.49, 1, 0, 1, 0.49, 1225)
                    break
                case Filterlist.No:
                    this.filter = 0
                    break
                default:
                    this.filter = new Filter.MM(5)
                    break
            }
        }

        measure(): number {
            return 0
        }

        digital_pipeline() {
            if (this.is_valid(this.live)) {
                return this.filter.update(this.live)
            }
        }

        update() {
            let messung = this.measure()
            if (this.cal_factor) {
                messung = messung / this.cal_factor
            }

            this.live = messung
            if (this.filter != 0) {
                return this.digital_pipeline()
            }
            else {
                if (this.is_valid(messung)) {
                    return messung
                }
            }
        }
    }


    export class Ultraschallsensor extends BaseSensor {
        trig: DigitalPin
        echo: DigitalPin

        constructor(trig: DigitalPin = DigitalPin.P8,
            echo: DigitalPin = DigitalPin.P9,
            low_bound: number,
            high_bound: number,
            factor?: number) {
            super(factor)
            this.trig = trig
            this.echo = echo
            this.low_bound = low_bound
            this.high_bound = high_bound
        }

        measure(): number {
            let trig = this.trig
            let echo = this.echo
            // send pulse
            pins.setPull(trig, PinPullMode.PullNone);
            pins.digitalWritePin(trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);

            // read pulse
            const d = pins.pulseIn(echo, PulseValue.High, 400 * 58);

            //time divided by 2 times the sonicspeed
            return d / 2 * 0.03432
        }

        calibration() {
            I2C_LCD1602.LcdInit(0)
            I2C_LCD1602.ShowString("Entfernung 10cm", 0, 0)
            I2C_LCD1602.ShowString("Press A", 1, 1)

            let messung = true
            let first: number
            let second: number

            while (messung) {
                if (input.buttonIsPressed(Button.A)) {
                    first = this.measure()
                    console.log("messung" + first.toString())
                    messung = false
                }
            }
            I2C_LCD1602.LcdInit(0)
            I2C_LCD1602.ShowString("Entfernung 20cm", 0, 0)
            I2C_LCD1602.ShowString("Press B", 1, 1)

            messung = true
            while (messung) {
                if (input.buttonIsPressed(Button.B)) {
                    second = this.measure()
                    messung = false
                }
            }

            this.calibrate(first, second)

            I2C_LCD1602.LcdInit(0)
            I2C_LCD1602.ShowString("Ultraschalls", 0, 0)
            I2C_LCD1602.ShowString("Kalibriert", 1, 1)
        }

        calibrate(first: number, second: number) {
            let temp1 = first / 10
            let temp2 = second / 20

            this.cal_factor = (temp1 + temp2) / 2
        }
    }
}