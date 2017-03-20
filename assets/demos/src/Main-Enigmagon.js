/**
 * Created by Duncan on 3/8/2017.
 */



require(["lib/TWGL.min", "src/Audio", "src/Enigmagon", "src/plainShaders", "src/Input"],
    function(twgl, Audio, Enigmagon, plain, Input){

        // set up the render context and shaders
        var canvas = document.getElementById("enigmagon");
        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        var plainSPI = twgl.createProgramInfo(gl, [plain.vertex, plain.fragment]);

        var uniforms   = {};
        var bufferInfo = twgl.createBufferInfoFromArrays(gl, {
            a_position: { numComponents: 3, drawType: gl.DYNAMIC_DRAW, data: new Float32Array(0) },
            a_color:    { numComponents: 4, drawType: gl.DYNAMIC_DRAW, data: new Float32Array(0) }
        });

        var input = new Input();

        var CHANNELS  = 4;
        var songs = [
            "assets/Slaptop - Sunrise.mp3",
            "assets/Shake.mp3",
            "assets/CloudDulcet Relapse.mp3",
            "assets/Woodkid - Run Boy Run.mp3",
            "assets/AWOLNATION - Sail (Official Music Video).mp3",
            "assets/Trouble.mp3",
            "assets/Coast Modern-The Way It Was.mp3",
            "assets/Jon Bellion - Jungle.mp3",
            "assets/Ed Sheeran - Shape Of You Official Lyric Video.mp3",
            "assets/Portugal. The Man - Feel It Still (Official Video).mp3",
            "assets/COIN - Talk Too Much.mp3",
            "assets/WALK THE MOON - Shut Up and Dance.mp3"
        ];
        songs.pick = function(){
            return this[Math.floor(Math.random()*this.length)];
        };

        var colorPool = [

            [0.32, 0.97, 0.45, 1.0], // green
            [0.45, 0.67, 0.97, 1.0], // blue
            [0.88, 0.32, 0.88, 1.0], // purple
            [0.97, 0.32, 0.45, 1.0], // red
            [0.88, 0.63, 0.27, 1.0]  // orange

        ];
        colorPool.mix = function(selector, value){

            var c1 = this[Math.floor(selector) % colorPool.length];
            var c2 = this[Math.ceil (selector) % colorPool.length];
            var lerp = selector % 1;

            return [
                c1[0] + lerp * (c2[0]-c1[0]),
                c1[1] + lerp * (c2[1]-c1[1]),
                c1[2] + lerp * (c2[2]-c1[2]),
                c1[3] + lerp * (c2[3]-c1[3])
            ].map(function(s){
                return Math.pow((s * value), 1/value);
            });

        };

        //
        var music = new Audio(songs.pick(), CHANNELS);
        var sound = music.poll();

        var positions ; // = new Float32Array(sound.length*3);
        var colors    ; // = new Float32Array(sound.length*4);


        var enigmagon = new Enigmagon();


        var now = 0, paused = false;
        var volumes = [], radii = [], palette = [];
        for(;volumes.length < CHANNELS;){
            volumes.push(0);
            radii.push(0);
            palette.push(volumes.length/2);
        }
        function render(time){
            var delta = (time - now) / 1000;
            now = time;

            // make sure the canvas is in the correct location
            twgl.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            // sets the background color for blending
            gl.clearColor(0.0,0.0,0.0,1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // enables a z test for the fragment shader
            gl.enable(gl.DEPTH_TEST);
            // gl.enable(gl.CULL_FACE);
            // // enables the alpha channel
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.enable(gl.BLEND);




            var c1 = 4.8; // lower numbers can detect finer changes, while higher numbers prevent effect from bleeding together
            var c2 = 0.000006;


            // TODO ever improve the visual!!!
            if(!paused){
                sound = music.poll(delta);
                for(var i = 0; i < sound.length; i++){
                    var current = sound[i].volume;
                    if (volumes[i] < current) volumes[i] += (current - volumes[i]) * delta * c1; // Math.min((volumes[i]+105*delta), current);
                    if (volumes[i] > current) volumes[i] += (current - volumes[i]) * delta * c1; // Math.max((volumes[i]-105*delta), current);

                    var c = 0.004;
                    var s = current - volumes[i];
                    s = Math.pow(Math.abs(s), 0.4) * ((s > 0) ? 1 : -1);
                    var u = 2 * Math.atan(c * s) / Math.PI;

                    // console.log(sound[i].contrast);

                    radii[i] = ( ((u<0)?0:1) - radii[i] )*Math.abs(u) + radii[i];
                    // console.log(radii);
                }

                palette.forEach(function(value, index){
                    palette[index] += delta / 5;
                    palette[index] %= colorPool.length;
                });
            }

            uniforms.u_projection = twgl.m4.identity();
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            twgl.m4.ortho(-aspect, aspect, 1, -1, 1, -1, uniforms.u_projection);

            positions = enigmagon.calculatePositions(delta, 0.05+0.65*radii[0], 0.1+0.65*radii[1]);
            colors    = enigmagon.calculateColors(colorPool.mix(palette[0], 1.0), colorPool.mix(palette[2], 0.9));

            bufferInfo.numElements = positions.length / 3;
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_color, colors);
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_position, positions);

            gl.useProgram(plainSPI.program);
            twgl.setBuffersAndAttributes(gl, plainSPI, bufferInfo);
            twgl.setUniforms(plainSPI, uniforms);
            twgl.drawBufferInfo(gl, bufferInfo, gl.LINES); // actual drawing happens here

            positions = enigmagon.calculatePositions(delta, 0.3+0.7*radii[2], 0.3+0.7*radii[3]);
            colors    = enigmagon.calculateColors(colorPool.mix(palette[1], 0.8), colorPool.mix(palette[3], 0.7));

            bufferInfo.numElements = positions.length / 3;
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_color, colors);
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_position, positions);

            gl.useProgram(plainSPI.program);
            twgl.setBuffersAndAttributes(gl, plainSPI, bufferInfo);
            twgl.setUniforms(plainSPI, uniforms);
            twgl.drawBufferInfo(gl, bufferInfo, gl.LINES); // actual drawing happens here





            var ci = 0, pi = 0;
            positions = new Float32Array(CHANNELS * 6);
            positions = new Float32Array(CHANNELS * 8);
            sound.forEach(function(partition, index){

                // positions[pi++] = ((sound.boundaries[index-1] || 0) / 1024 * 2 - 1);
                // positions[pi++] = 1;
                // positions[pi++] = -1;

                positions[pi++] = ((sound.boundaries[index-1] || 0) / 1024 * 2 - 1) * aspect;
                positions[pi++] = (partition.volume / 255 / 1024 * CHANNELS - 0.5) * -2;
                positions[pi++] = -1;

                positions[pi++] = ((sound.boundaries[index]) / 1024 * 2 - 1) * aspect;
                positions[pi++] = (partition.volume / 255 / 1024 * CHANNELS - 0.5) * -2;
                positions[pi++] = -1;

                // positions[pi++] = ((sound.boundaries[index]) / 1024 * 2 - 1);
                // positions[pi++] = 1;
                // positions[pi++] = -1;

                colors[ci++] = 0.17;colors[ci++] = 0.17;colors[ci++] = 0.17;colors[ci++] = 1.0;
                colors[ci++] = 0.17;colors[ci++] = 0.17;colors[ci++] = 0.17;colors[ci++] = 1.0;
                // colors[ci++] = 0.55;colors[ci++] = 0.55;colors[ci++] = 0.55;colors[ci++] = 1.0;
                // colors[ci++] = 0.55;colors[ci++] = 0.55;colors[ci++] = 0.55;colors[ci++] = 1.0;

            });

            bufferInfo.numElements = CHANNELS * 2;
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_color, colors);
            twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.a_position, positions);

            gl.useProgram(plainSPI.program);
            twgl.setBuffersAndAttributes(gl, plainSPI, bufferInfo);
            twgl.setUniforms(plainSPI, uniforms);
            twgl.drawBufferInfo(gl, bufferInfo, gl.LINE_STRIP); // actual drawing happens here






            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);






        var hud = true;
        var unlocks = [false,false,false,false,false,false,false]; // nothing is unlocked by default
        function unlock(n){
            if(!unlocks[n]){
                unlocks[n] = true;
                $(".achievement").eq(n).addClass("complete");
            }
        }

        $("#next").click(function(){
            music.play(songs.pick());
            enigmagon = new Enigmagon();
        });

        input.onDown(37, function(){ // LEFT
            unlock(1);
            enigmagon.spin(-0.023);
        });
        input.onUp(37, function(){ // LEFT
            enigmagon.spin(-0.039);
        });
        input.onDown(39, function(){ // RIGHT
            unlock(1);
            enigmagon.spin(+0.023);
        });
        input.onUp(39, function(){ // RIGHT
            enigmagon.spin(+0.039);
        });
        input.onDown(38, function(){ // UP
            unlock(2);
            enigmagon.energize(1.08);
        });
        input.onUp(38, function(){ // UP
            enigmagon.energize(1.21);
        });
        input.onDown(40, function(){ // DOWN
            unlock(2);
            enigmagon.energize(0.92);
        });
        input.onUp(40, function(){ // DOWN
            enigmagon.energize(0.82);
        });
        input.onDown(32, function(){ // SPACE
            unlock(0);
            paused = true;
            enigmagon.pause();
            music.pause();
        });
        input.onUp(32, function(){ // SPACE
            paused = false;
            enigmagon.play();
            music.play();
        });
        input.onUp(83, function(){ // S
            unlock(3);
            enigmagon.split();
        });
        input.onUp(72, function(){ // H
            unlock(5);
            $("div").css("opacity", hud ? 0 : 1);
            hud = !hud;
        });
        input.onUp(65, function(){ // A
            unlock(6);
            music.pause();
            music = new Audio(undefined, CHANNELS);
        });

        // hooks up the track play button without trashing the namespace
        (function(){
            for(var i = 0; i < 10; i++){
                input.onUp(i+48, (function(i){
                    return function(){
                        unlock(4);
                        music.pause();
                        music.play(songs[i]);
                    }
                })(i));
            }
        })();

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

    }
);