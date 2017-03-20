/**
 * Created by Duncan on 2/14/2017.
 */

// Animates a cascading entrance for nested html elements
// take a JQuery element set
cascade = function(e){
    // creates constant and encapsulated functions to allow parallel delays
    // takes a JQuery element set and an index
    var deferCascade = function(e, i){
        return function(){
            // indexes into the set to retrieve a single element
            var child = e.eq(i);
            // attempts to preserve transition properties where possible- only 100% viable using JQuery on Chrome
            var temp = "opacity 1s ease 0s, top 0.35s ease 0s";
            (child.css("transition")||"").split(',').forEach(function(transition){
                temp += ", " + transition;
            });
            child.css("transition", temp);
            // kicks off the animations recursively
            child.css("opacity","1.0");
            child.css("top","0");
            cascade(child.children());
        }
    };
    for(var i = 0; i < e.length; i++){
        setTimeout(deferCascade(e, i), Math.pow(i, 1.2) * 75);
    }
};

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function runWebGL(number){
    // set up the render context and shaders
    var canvas = document.getElementById("enigmagon");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    var programInfo = twgl.createProgramInfo(gl, ["vertex-shader", "fragment-shader"]);

    // the color cycle. feel free to add some! Background colors etc. will be handled for you.
    var color1 = 0;
    var color2 = 0;
    var colors = [
        [0.93, 0.93, 0.93, 1.0], // white
        [0.32, 0.97, 0.45, 1.0], // green
        [0.45, 0.67, 0.97, 1.0], // blue
        [0.88, 0.32, 0.88, 1.0], // purple
        [0.97, 0.32, 0.45, 1.0], // red
        [0.88, 0.63, 0.24, 1.0], // orange
        [0.0,  0.0,  0.0,  1.0]  // black
        // [0.1406,0.1406,0.1406,0] // grey / transparent
    ];
    var color3 = colors.length - 1;

    var vertices;
    var positions;
    var vertexColors;
    var buffers;
    var bufferInfo;
    function Vertex(angle, radius, velocity){
        return {angle: angle * 2 * Math.PI, radius: radius, velocity: velocity}
    }

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    // instantiates a new, random enigmagon.
    function primeEnigmagon(enigma){
        // sets the enigmagon complexity
        var count = Math.max(((enigma) ? enigma : Math.floor(Math.pow(Math.random()*0.65+1.42,4))),4);
        vertices = [];

        var step = Math.floor((Math.random()*(count-4)+4)/4)/count;
        for(var j = 0; j < count; j++){

            vertices.push(new Vertex(j/count, 0.75, 0.1));
            vertices.push(new Vertex(j/count + step, 0.75, -0.13));

            vertices.push(new Vertex(j/count, 0.75, 0.1));
            vertices.push(new Vertex(j/count + 2*step, 0.75, -0.13));

            vertices.push(new Vertex(j/count, 0.75, 0.1));
            vertices.push(new Vertex(j/count + 3*step, 0.75, -0.13));

            vertices.push(new Vertex(j/count, 0.75, 0.1));
            vertices.push(new Vertex(j/count + 4*step, 0.75, -0.13));

        }

        positions = new Float32Array(vertices.length * 3);
        vertexColors = new Float32Array(vertices.length);
        buffers = {
            position: {data: positions, numComponents: 3, drawType: gl.DYNAMIC_DRAW},
            color: {data: vertexColors, numComponents: 1}
        };
        bufferInfo = twgl.createBufferInfoFromArrays(gl, buffers);
    }

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    primeEnigmagon(number);
    var ringSegments = 200;
    var ringPositions = new Float32Array(3 * ringSegments);
    var ringColors = new Float32Array(ringSegments);
    var ringBuffers = {
        position: {data: ringPositions, numComponents: 3, drawType: gl.DYNAMIC_DRAW},
        color: {data: ringColors, numComponents: 1}
    };
    var ringBufferInfo = twgl.createBufferInfoFromArrays(gl, ringBuffers);

    var rings = false;
    // halts the passage of time
    var paused = false;
    // halts the change of radii
    var frozen = false;
    // the passage in time since the last frame in seconds
    var delta = 0;
    // the actual time of the last frame
    var previous = Date.now();
    var elapsed = 0;

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    function render(time) {

        // make sure the canvas is in the correct location
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // sets the background color for blending
        gl.enable(gl.DEPTH_TEST);
        // enables the alpha channel- slightly diminishes the effect
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        // gl.enable(gl.BLEND);
        gl.clearColor( // this math makes the bg colors darker. Note that I cheat on the alpha channel
            Math.pow(colors[color3][0]*0.74,2.3),
            Math.pow(colors[color3][1]*0.74,2.3),
            Math.pow(colors[color3][2]*0.74,2.3),
            1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        $("body").css("background-color","rgba(" +
            Math.round(Math.pow(colors[color3][0]*0.74,2.3)*255) + "," +
            Math.round(Math.pow(colors[color3][1]*0.74,2.3)*255) + "," +
            Math.round(Math.pow(colors[color3][2]*0.74,2.3)*255) + "," +
            1 + ")");



        // manage the clocks
        delta = paused ? 0 : (time - previous) * 0.001;
        elapsed += delta * (frozen ? 0 : 1);
        previous = time;

        var index = 0;
        // interpret the vertices into 3-tuples of gl coordinates
        vertices.forEach(function(vertex){
            if(!(index % 2)){ // alternating vertices
                vertex.radius = Math.sin(elapsed / 1.6) / 3 + 0.65;
                vertexColors[index/3] = 1.0;
            } else {
                vertex.radius = Math.cos(elapsed / 2.2) / 3 + 0.65;
                vertexColors[index/3] = 2.0;
            }
            vertex.angle += vertex.velocity * delta;
            vertex.angle %= 2 * Math.PI;
            positions[index++] = Math.cos(vertex.angle) * vertex.radius;
            positions[index++] = Math.sin(vertex.angle) * vertex.radius;
            positions[index++] = (index%2) ? 0.5 : -0.5;
        });
        twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.color, vertexColors);
        twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.position, positions);

        // establish shader uniforms
        var uniforms = {
            projection: twgl.m4.identity(), // actually calculated bellow
            color1: colors[color1],
            color2: colors[color2]
        };
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        twgl.m4.ortho(-aspect, aspect, 1, -1, -1, 1, uniforms.projection);

        // //3D. If you like that sort of thing
        // uniforms.projection = twgl.m4.perspective(15 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 15);
        // var view = twgl.m4.inverse(twgl.m4.lookAt([0, 0, -12], [0, 0, 0], [0, 1, 0]));
        // uniforms.projection = twgl.m4.multiply(uniforms.projection, view);
        // var world = twgl.m4.rotationY(time/4000);
        // uniforms.projection = twgl.m4.multiply(uniforms.projection, world);

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo, gl.LINES); // actual drawing happens here

        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////

        // when rings are being drawn as well

        if(rings){
            // ring 1
            var j;
            index = 0;
            uniforms.color = colors[color1];
            twgl.setUniforms(programInfo, uniforms);
            var radius1 = vertices[0].radius;
            var radius2 = vertices[1].radius;
            var segments = ringSegments;
            for(j = 0; j < segments; j++){
                ringPositions[index++] = Math.cos(Math.PI*2*j/segments) * radius1;
                ringPositions[index++] = Math.sin(Math.PI*2*j/segments) * radius1;
                ringPositions[index++] = 0.5;
            }
            for(j = 0; j < ringColors.length; j++){
                ringColors[j] = 1.0;
            }
            twgl.setAttribInfoBufferFromArray(gl, ringBufferInfo.attribs.color, ringColors);
            twgl.setAttribInfoBufferFromArray(gl, ringBufferInfo.attribs.position, ringPositions);
            twgl.setBuffersAndAttributes(gl, programInfo, ringBufferInfo);
            twgl.drawBufferInfo(gl, ringBufferInfo, gl.LINE_LOOP); // note the loop primitive use
            ///////////////////////////////////////////////////////////////////////////
            // ring 2
            index = 0;
            uniforms.color = colors[color2];
            twgl.setUniforms(programInfo, uniforms);
            for(j = 0; j < segments; j++){
                ringPositions[index++] = Math.cos(Math.PI*2*j/segments) * radius2;
                ringPositions[index++] = Math.sin(Math.PI*2*j/segments) * radius2;
                ringPositions[index++] = -0.5;
            }
            for(j = 0; j < ringColors.length; j++){
                ringColors[j] = 2.0;
            }
            twgl.setAttribInfoBufferFromArray(gl, ringBufferInfo.attribs.position, ringPositions);
            twgl.setAttribInfoBufferFromArray(gl, ringBufferInfo.attribs.color, ringColors);
            twgl.setBuffersAndAttributes(gl, programInfo, ringBufferInfo);
            twgl.drawBufferInfo(gl, ringBufferInfo, gl.LINE_LOOP); // note the loop primitive use
        }

        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////

        requestAnimationFrame(render);
    }

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    requestAnimationFrame(render);

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    // global resources for handling html / css
    var hud = true;
    var unlocks = [false,false,false,false,false,false,false]; // nothing is unlocked by default
    function unlock(n){
        if(!unlocks[n]){
            unlocks[n] = true;
            $(".achievement").eq(n).addClass("complete");
        }
    }

    // no right click menu, etc.
    window.oncontextmenu = function(){return false;};

    // all key input comes through these switch statements
    $(document).on("keydown", function(e){
        switch(e.keyCode){
            case 32: // space bar
                e.preventDefault();
                unlock(0);
                paused = true;
                break;
            case 37: // left
                unlock(1);
                vertices.forEach(function(vertex){
                    vertex.velocity -= 0.023;
                });
                break;
            case 39: // right
                unlock(1);
                vertices.forEach(function(vertex){
                    vertex.velocity += 0.023;
                });
                break;
            case 40: // down
                unlock(2);
                vertices.forEach(function(vertex){
                    vertex.velocity *= 0.93;
                });
                break;
            case 38: // up
                unlock(2);
                vertices.forEach(function(vertex){
                    vertex.velocity *= 1.08;
                });
                break;
            case 84: // 't'
                unlock(3);
                rings = !rings;
                break;
            case 52: // '4'
                color1 = color3;
                color2 = color3;
                // falling through intentionally
            case 49: // '1'
                unlock(4);
                color1++;
                color1 %= colors.length;
                if(e.keyCode == 49){ // optional fall through
                    break;
                }
            case 50: // '2'
                unlock(4);
                color2++;
                color2 %= colors.length;
                if(e.keyCode == 50){ // optional fall through
                    break;
                }
            case 51: // '3'
                unlock(4);
                color3++;
                color3 %= colors.length;
                break;
            case 70: // 'f'
                unlock(5);
                frozen = !frozen;
                break;
            case 83: // 's'
                unlock(6);
                var l;
                var s = Math.floor(Math.random()*4);
                for(l = s; l < vertices.length; l+=4){
                    vertices[l].velocity = -vertices[l].velocity;
                }
                for(l = (s+1)%4; l < vertices.length; l+=4){
                    vertices[l].velocity = -vertices[l].velocity;
                }
                break;
            case 72: // 'h'
                unlock(7);
                $("div").css("opacity", hud ? 0 : 1);
                hud = !hud;
                break;
            case 13: // enter
                e.preventDefault();
                break;
            default:
                // console.log(e.keyCode);
                break;
        }
    }).on("keyup", function(e){
        switch(e.keyCode){
            case 32: // space bar
                unlock(0);
                paused = false;
                break;
            case 37: // left
                unlock(1);
                vertices.forEach(function(vertex){
                    vertex.velocity -= 0.039;
                });
                break;
            case 39: // right
                unlock(1);
                vertices.forEach(function(vertex){
                    vertex.velocity += 0.039;
                });
                break;
            case 40: // down
                unlock(2);
                vertices.forEach(function(vertex){
                    vertex.velocity *= 0.93;
                });
                break;
            case 38: // up
                unlock(2);
                vertices.forEach(function(vertex){
                    vertex.velocity *= 1.08;
                });
                break;
            default:
                // console.log(e.keyCode);
                break;
        }
    });

    // makes all the achievements clickable without trashing the namespace
    (function(){
        var achievements = $(".achievement:not(.complete)");
        for(var i = 0; i < achievements.length; i++){
            achievements.eq(i).click((function(i){
                return function(){
                    achievements.eq(i).addClass("complete");
                };
            })(i));
        }
    })();

    // enables the NEW ENIGMAGON button without trashing the namespace
    (function(){
        $("button").click(function(){
            var canvas = $("canvas");
            canvas.css("opacity", "0.0");
            setTimeout(function(){
                primeEnigmagon();
                canvas.css("opacity", "1.0");
            }, 700);
        });
    })();

    console.log("For the best viewing experience, remember to hit F11 to go fullscreen and F12 to close the console.");

}