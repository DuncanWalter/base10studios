/**
 * Created by Duncan on 2/24/2017.
 */
define(function(){
    function Input(){

        var cursor = {x: 0, y: 0, dx: 0, dy: 0, dw: 0};
        var inputsDown  = new Array(221); // keeps an array of all input states
        var bindings = {};

        this.stateOf = function(keyCode){
            return !!inputsDown[keyCode] ? inputsDown[keyCode] > 0 : false;
        };
        this.pollCursor = function(){
            var c = cursor;
            cursor = {x: c.x, y: c.y, dx: 0, dy: 0, dw: 0};
            return c;
        };
        this.onDown = function(keyCode, fun){
            if (!bindings["d"+keyCode]) bindings["d"+keyCode] = [];
            bindings["d"+keyCode].push(fun);
        };
        this.onUp   = function(keyCode, fun){
            if (!bindings["u"+keyCode]) bindings["u"+keyCode] = [];
            bindings["u"+keyCode].push(fun);
        };

        // The Event Listeners, which update the inputListener's information between firings
        document.addEventListener("mousemove", function(e){
            cursor.dx += e.clientX - cursor.x;
            cursor.dy += e.clientY - cursor.y;
            cursor.x = e.clientX;
            cursor.y = e.clientY;
        }, false);

        // mouse button listeners
        document.addEventListener("mousedown", function(e){
            if (bindings["d"+e.which]) bindings["d"+e.which].forEach(function(fun){fun()});
            if (inputsDown[16]>0 && e.which!=16) console.log(e.which);
            inputsDown[e.which] = +Date.now();
        });
        document.addEventListener("mouseup",   function(e){
            if (bindings["u"+e.which]) bindings["u"+e.which].forEach(function(fun){fun()});
            inputsDown[e.which] = -Date.now();
        });
        document.addEventListener("mousewheel", function(e){
            cursor.dw += e.wheelDelta;
        });

        // key listeners
        document.addEventListener("keydown",   function(e){
            if (bindings["d"+e.which]) bindings["d"+e.which].forEach(function(fun){fun()});
            if (inputsDown[16]>0 && e.which!=16) console.log(e.which);
            inputsDown[e.which] = +Date.now();
        }, false);
        document.addEventListener("keyup",     function(e){
            if (bindings["u"+e.which]) bindings["u"+e.which].forEach(function(fun){fun()});
            inputsDown[e.which] = -Date.now();
        }, false);

        // this prevents context menus from appearing on the canvas
        document.onmousewheel  = function(){return false;};
        document.oncontextmenu = function(){return false;};
        $("body").focus();
    }

    return Input;

});