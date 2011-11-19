# meltdown - a [dead man's switch](http://en.wikipedia.org/wiki/Dead_man's_switch) for [hook.io](http://hook.io)

##  if you don't `meltdown::pushthebutton` before the `meltdown::critical` happens, all hook.io jobs you added with `meltdown::jobs::add` will execute.

## emitting `meltdown::pushthebutton` will reset `meltdown.countdown` back to `meltdown.timer`


### Installation

    npm install meltdown -g


### Usage

    meltdown
    
    
## Add a Job

     hook.emit('meltdown::jobs::add', {"event":"custom-event", "data" : {"foo":"bar"}});
     
**this will now execute when `meltdown::critical` occurs.**
