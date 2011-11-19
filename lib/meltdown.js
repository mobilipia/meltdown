//
// hook.io meltdown hook
//
var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util');

var Meltdown = exports.Meltdown = function(options){
  var self = this;
  Hook.call(self, options);

  self.INTERVAL = 2000;
  self.timer = options.countdown || 6000; // 6 seconds
  self.countdown = self.timer;
  self.startTime = new Date().getTime();

  self.state = "operational";

  self.on('**::meltdown::jobs::add' , self.addJob);
  self.on('**::meltdown::pushthebutton' , self.pushthebutton);
  
  
  self.on('hook::ready'  , self._poll());
};

// Meltdown inherits from Hook
util.inherits(Meltdown, Hook);

Meltdown.prototype.pushthebutton = function () { 
  this.startTime = new Date().getTime();
  this.countdown = this.timer;
  this.state = "operational";
  
  //
  // TODO: Add some metadata
  //
  var metadata = {};
  this.emit('meltdown::reset', metadata);
  
};


Meltdown.prototype.critical = function () {
  
  var self = this,
      jobs = self.jobs;
  
  //
  // TODO: Add some metadata
  //
  var metadata = {};
  self.emit('meltdown::critical', metadata);

  //
  // Iterate through all your jobs and execute them
  //
  if(jobs && self.state !== "critical"){
    jobs.forEach(function(job){
      self.emit(job.event, job.data);
    });
  }

  self.state = "critical";

};

Meltdown.prototype.addJob = function (job) {
  var self = this;
  var jobs = self.jobs || [];
  job.name = job.name || 'default job name';
  jobs.push(job);
  self.jobs = jobs;
};

Meltdown.prototype.removeJob = function(options, hook){
  //
  // TODO:
  //
};

Meltdown.prototype._poll = function(){
  var self = this;
  setInterval(function(){
    var timediff = new Date().getTime() - self.startTime;
    if(self.countdown > 0) {
      self.countdown = self.timer - timediff;
      self.emit('meltdown::countdown', self.countdown);
    }
    if (timediff > self.timer) {
      self.critical();
    }
  }, self.INTERVAL)
};
