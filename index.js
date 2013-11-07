"use strict";

var Emitter = require('./lib/emitter'), Car, TrafficLights;


Car = Emitter.extend({
    name: 'Ferari',
    
    mileage: 0,
    
    moving: false,
    
    speed: 1000,
    
    breaks: null,
    
    move: function () {
        var self = this;
        
        if (self.moving) {
            return self;    
        }
        
        self.emit('start');
        
        self.breaks = setInterval(function () {
            self.mileage += 1;
            self.emit('move', self.mileage);
        }, self.speed);
        
        self.moving = true;
        
        return self; 
    },
    
    stop: function () {
        clearInterval(this.breaks);
        this.moving = false;
        this.emit('stop');
        
        return this;
    }
});


TrafficLights = Emitter.extend({
    color: 'green',
    
    colors: ['green', 'amber', 'red'],
    
    current: -1,
    
    power: null,
    
    active: false,
    
    interval: 5000,
    
    turnOn: function () {
        var self = this;
        
        self.emit('start');
        
        self.active = true;
        
        self.power = setInterval(function () {
            self.current += 1;
            
            if (self.current > 2) {
                self.current = 0;
            }
            
            self.color = self.colors[self.current];
            
            self.emit('change', self.color);
        }, self.interval);
        
        return self;        
    },
    
    turnOff: function () {
        clearInterval(this.power);
        this.active = false;
        
        this.emit('stop');
        
        return this;
    }
});


// create the objects
var myCar = new Car();
var lights = new TrafficLights();

// move the car
myCar.move();

// turn traffic lights on
lights.turnOn();

// the car needs to keep an eye on the traffic lights
myCar.listenTo(lights, 'change', function (color) {
    console.log('Traffic light is ' + color);
    
    // we are good to go
    if (color === 'green') {
        myCar.move();
    }
    
    // the car needs to stop
    if (color === 'red') {
        myCar.stop();
    }
});


myCar.on('start', function () {
    console.log('Car started \n');
})
.on('stop', function () {
    console.log('Car stopped');
    console.log('Milieage so far: ' + parseFloat(this.mileage / 100) + 'km \n');
});


