let ws281x = require('rpi-ws281x');

class Strip {

    constructor(ledsCount) {
        this.config = {};

        // Number of leds in my strip
        this.config.leds = ledsCount || 20;

        // Use DMA 10 (default 10)
        this.config.dma = 10;

        // Set full brightness, a value from 0 to 255 (default 255)
        this.config.brightness = 255;

        // Set the GPIO number to communicate with the Neopixel strip (default 18)
        this.config.gpio = 18;

        // The RGB sequence may lety on some strips. Valid values
        // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
        // Default is "rgb".
        // RGBW strips are not currently supported.
        this.config.stripType = 'grb';

        this.pixels = new Uint32Array(this.config.leds)

        // Configure ws281x
        ws281x.configure(this.config);
    }

    randomInteger(min, max) {
		  // получить случайное число от (min-0.5) до (max+0.5)
		  let rand = min - 0.5 + Math.random() * (max - min + 1);
		  return Math.round(rand);
	}
    setAllLeds(red, green, blue) {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.

        // Create a fill color with red/green/blue.
        let color = (red << 16) | (green << 8)| blue;

        for (let i = 0; i < this.config.leds; i++)
            this.pixels[i] = color;

        // Render to strip
        ws281x.render(this.pixels);
    }
    setAllDefault(){
    	let red = 10, green = 34, blue = 255;
    	this.setAllLeds(red, green, blue)
    }
    setFromTo(startsPos, endsPos, red, green, blue){
        endsPos = endsPos > this.pixels.length ? this.pixels.length : endsPos

        // Create a fill color with red/green/blue.
        let color = (red << 16) | (green << 8)| blue;

        for (let i = startsPos; i < endsPos; i++)
        this.pixels[i] = color;

        // Render to strip
        ws281x.render(this.pixels);
    }
    setRandomCountWithRandomColor(){
        let startsPos = this.randomInteger(0, this.pixels.length - 1)
        let endsPos = this.randomInteger(startsPos, this.pixels.length - 1)

        let red = this.randomInteger(0, 255)
    	let green = this.randomInteger(0, 255)
    	let blue = this.randomInteger(0, 255)

        this.setFromTo(startsPos, endsPos, red, green, blue)

    }
    setAllLedsOneColorRandom(){
    	let red = this.randomInteger(0, 255)
    	let green = this.randomInteger(0, 255)
    	let blue = this.randomInteger(0, 255)

    	this.setAllLeds(red, green, blue)
    }
    
};



// let strip = new Strip(90);
// strip.setAllLeds(123, 12, 54);

// let timerId = setInterval(() => { 
//     console.log('blink')
//     strip.setAllLedsOneColorRandom()
// }, 500);
module.exports = Strip
