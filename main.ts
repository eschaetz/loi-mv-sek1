
/**
 * Custom blocks
 */
//% weight=100 color=#00BFFF icon="⏩" block="LOI MV - Roboter"
namespace LOI_MV {
    /**
     * Baggersteuerung
     */
    //% blockId=loimvbagger
    //% block="Setze Motor links auf: %links und Motor rechts auf: %rechts"
    export function baggersteuerung(links: number, rechts: number): void {
        let motorMin = 400
        if (links > 0) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P1, Math.map(links, 0, 10, motorMin, 1023))
        } else if (links < 0) {
            pins.digitalWritePin(DigitalPin.P12, 1)
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.analogWritePin(AnalogPin.P1, Math.map(links, 0, -10, motorMin, 1023))
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
        }

        if (rechts > 0) {
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P2, Math.map(rechts, 0, 10, motorMin, 1023))
        } else if (rechts < 0) {
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P2, Math.map(rechts, 0, -10, motorMin, 1023))
        } else {
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 0)
        }

    }
    
    /**
     * Ultraschall 
     */
    //% blockId=loimvUltraschall
    //% block="gemessene Distanz"
    export function ultraschall(): number {
        return sonar.ping(DigitalPin.P8, DigitalPin.P9, PingUnit.Centimeters)
    }

    let ultraschall_obj: any;
    /**
     * Ultraschall Advanced
     */
    //% blockId=loimvUltraschallAdvanced
    //% block="ultraschall_advanced"
    function ultraschall_advanced(): number {
        //return sonar.ping(DigitalPin.P8, DigitalPin.P9, PingUnit.Centimeters)
        console.log(ultraschall_obj.filter.current)
        return Math.round(ultraschall_obj.get_filtered())
    }
    /**
     * Steuert die Antriebsmotoren mit den Parametern "Power" und "Lenkung".
     * Power gibt die Kraft von -10 bis 10 an, wobei negative Werte den Rückwärtsgang bedeuten
     * Lenkung lässt die Motoren auf auf beiden Seiten unterschiedlich schnell bewegen, um eine Drehung des Roboters zu erzeugen. 
     * -10 ist links, 0 gerade aus und 10 rechts
     */
    //% blockId=loimvAntrieb
    //% block="Setze Geschwindigkeit auf:%power und Lenkugn auf:%lenkung"
    //% power.min=-10 power.max=10
    //% lenkung.min=-10 lenkung.max=10
    export function antrieb(power: number, lenkung: number): void {
        let speedL //Geschwindigkeit der linken Motoren
        let speedR //Geschwindigkeit der rechten Motoren 
        const motorMin = 200
        if (lenkung < 0) {
            speedR = power
            speedL = power + 2 * power / 10 * lenkung
        } else if (lenkung > 0) {
            speedL = power
            speedR = power - 2 * power / 10 * lenkung
        } else {
            speedL = speedR = power
        }

        if (speedL > 0) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P1, Math.map(speedL, 0, 10, motorMin, 1023))
        } else if (speedL < 0) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P12, 1)
            pins.analogWritePin(AnalogPin.P1, Math.map(speedL, 0, -10, motorMin, 1023))
        } else {
            pins.analogWritePin(AnalogPin.P1, 0)
        }

        if (speedR > 0) {
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P2, Math.map(speedR, 0, 10, motorMin, 1023))
        } else if (speedR < 0) {
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.analogWritePin(AnalogPin.P2, Math.map(speedR, 0, -10, motorMin, 1023))
        } else {
            pins.analogWritePin(AnalogPin.P2, 0)
        }
    }

    enum Linetracker {
        //% block="links"
        LT0 = DigitalPin.P6,

        //% block="rechts"
        LT1 = DigitalPin.P7,

    }


    /**
     * Gibt aus, pb der gewählte Linetrackingsensor schwarzen UNtergrund erkennt
     */
    //%blockId=loimvlinetracking
    //%block="schwarzer Untergrund %linetracker erkannt"
    export function linetracking(linetracker:Linetracker){
        let s = pins.digitalReadPin(linetracker);
        return !!s;
    }


    /** 
     * Gibt des Wert des rechten Helligkeitssensors aus
     */
    //% blockId=loimvHelligkeitRechts
    //% block=""
    function helligkeitRechts(): number {
        return pins.digitalReadPin(DigitalPin.P7)
    }

    /**
     * Gibt des Wert des linken Helligkeitssensors aus
     */
    //% blockId=loimvHelligkeitLinks
    //% block="helligkeitLinks"
    function helligkeitLinks(): number {
        return pins.digitalReadPin(DigitalPin.P6)
    }

    /**
     * Dreht den Roboter um einen Winkel
     */
    //% blockId=loimvGraddrehung
    //% block="Graddrehung %drehung %toleranz"
    //% drehung.min=-180 drehung.max=180
    //%toleranz.min=5 toleranz.max=20
    function graddrehung(drehung: number, toleranz: number): void {
        antrieb(0, 0)
        let zielrichtung = (input.compassHeading() + drehung) % 360
        let i = 0
        while (Math.abs(zielrichtung - input.compassHeading()) > toleranz && i < 50) {
            i += 1
            if ((zielrichtung - input.compassHeading()) % 360 > 180) {
                antrieb(8, 10)
            } else {
                antrieb(8, -10)
            }
            basic.pause(100)
            antrieb(0, 0)
            basic.pause(200)
        }
        antrieb(0, 0)
        //if (i == 50) {
        //    return 1
        //} else {
        //    return 0
        //}
    }
    
    /**
     * Gibt an, wie sehr der Roboter nach vorn und hinten geneigt ist (positive Werte: Nase zeigt nach oben; negative Werte: Nase zeigt nach unten)
     */
    //% blockId=loimvPitch
    //% block="Längsneigung"
    export function pitch(): number {
        return -(input.rotation(Rotation.Pitch))+3
    }

    /**
     * Gibt die seitliche Neigung des ROboters an (positive Werte: nach rechts geneigt; negative Werte: nach links geneigt)
     */
    //% blockId=loimvRoll
    //% block="Querneigung"
    export function roll(): number {
        return -(input.rotation(Rotation.Roll))
    }


    /**
     * Fährt den Roboter korrekt hoch
     */
    //% blockId=loimvInit
    //% block="Roboter hochfahren"
    export function init(): void { //kompass: boolean
        let strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        //if (kompass) {
        //    basic.pause(input.compassHeading())
        //}
        I2C_LCD1602.LcdInit(0)
        antrieb(0, 0)
        I2C_LCD1602.ShowString("Landesolympiade", 0, 0)
        I2C_LCD1602.ShowString("Informatik MV", 1, 1)
        basic.pause(300)
    }

    /**
     * Fährt den Roboter korrekt hoch und hat zusätzliche Funktoinen
     */
    //% blockId=loimvInitAdvanced
    //% block="init_advanced kompass %kompass| calibrateUltraschall %ultra| filter %filter"
    function init_advanced(kompass: boolean, ultra: boolean, filter: Filterlist): void {
        let strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        if (kompass) {
            basic.pause(input.compassHeading())
        }


        I2C_LCD1602.LcdInit(0)
        antrieb(0, 0)
        I2C_LCD1602.ShowString("Landesolympiade", 0, 0)
        I2C_LCD1602.ShowString("Informatik MV", 1, 1)


        ultraschall_obj = new Sensoren.Ultraschallsensor(DigitalPin.P8, DigitalPin.P9, 2, 400, 0.64375)
        ultraschall_obj.set_filter_list(filter)

        if (ultra) {
            ultraschall_obj.calibration()
            basic.pause(300)
            I2C_LCD1602.ShowString("Landesolympiade", 0, 0)
            I2C_LCD1602.ShowString("Informatik MV", 1, 1)
        }

        basic.pause(300)
        control.runInBackground(function () {
            while (true) {
                ultraschall_obj.update()

                basic.pause(20)
            }
        })
    }

    function BooltoString(boo:boolean): string{
        if (boo) return "W";
        else return "F"  
    }

    /**
     * Gibt die Sensorwerte dauerhaft auf dem Display aus
     */
    //% blockId=loimvSensorausgabe
    //% block="Sensor-Ausgabe Intervall %intervall"
    export function sensor_ausgabe(intervall: number): void {

        I2C_LCD1602.clear()
        I2C_LCD1602.ShowString(" Sensorausgabe", 0, 0)
        
        control.runInBackground(function () {
            while (true) {                
                I2C_LCD1602.ShowString(BooltoString(LOI_MV.linetracking(Linetracker.LT0)), 0, 1)
                I2C_LCD1602.ShowString(BooltoString(LOI_MV.linetracking(Linetracker.LT1)), 15, 1)
                I2C_LCD1602.ShowString("    ", 7, 1)
                I2C_LCD1602.ShowNumber(LOI_MV.ultraschall(), 7, 1)
                basic.pause(intervall)
            }
        })
    }

}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="\f11b" block="LOI MV - Fernbedienung"
namespace LOI_Remote {
    /**
     * Knopf A gedrückt
     */
    //% blockId=loimvbuttonA
    //% block="Knopf A ist gedrückt"
    export function knopf_a(): boolean {
        pins.setPull(DigitalPin.P5, PinPullMode.PullUp)
        if (pins.digitalReadPin(DigitalPin.P5) == 0){
            return true
        }
        else {
            return false    
        }
    }

    /**
     * Knopf B gedrückt
     */
    //% blockId=loimvbuttonB
    //% block="Knopf B ist gedrückt"
    export function knopf_b(): boolean {
        pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
        if (pins.digitalReadPin(DigitalPin.P11) == 0) {
            return true
        }
        else {
            return false
        }
    }

    /**
     * Knopf C gedrückt
     */
    //% blockId=loimvbuttonC
    //% block="Knopf C ist gedrückt"
    export function knopf_c(): boolean {
        pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
        if (pins.digitalReadPin(DigitalPin.P8) == 0) {
            return true
        }
        else {
            return false
        }
    }
    /**
     * Knopf D gedrückt
     */
    //% blockId=loimvbuttonD
    //% block="Knopf D ist gedrückt"
    export function knopf_d(): boolean {
        pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
        if (pins.digitalReadPin(DigitalPin.P12) == 0) {
            return true
        }
        else {
            return false
        }
    }

    
}