define(["lib/TWGL.min", "src/Input"],
    function(twgl, Input) {
        /*
         Camera :: (gl: WebGLContext, plainSPI: ShaderProgramInfo, paperSPI: ShaderProgramInfo, map: Map) -> {
             render: (delta: Seconds) -> void,

         }
         */
        return function Camera(gl, map) {
            var rt3 = Math.sqrt(3);
            var v3 = twgl.v3;
            var m4 = twgl.m4;

            var input = new Input();
            var focus = [map.width/2*rt3, map.height*0.75];
            var zoom = 1;

            var MIN_THETA = 0.2 * Math.PI;
            var MAX_THETA = 0.2 * Math.PI;
            var MAX_HEIGHT = (map.height - 1) * 0.75 / Math.tan(MIN_THETA / 2);
            var MED_HEIGHT = (map.height - 1) * 0.375 / Math.tan(MAX_THETA / 2);

            this.navigate = (function(){

                var zimocity = 1;
                var MAX_ZIMOCITY = 2;

                var panocity = {dx:0, dy:0};
                var MAX_PANOCITY = MAX_HEIGHT / 15;
                var PAN_ACCELERATION = 2.7;
                var PAN_DECELERATION = 4.3;

                return function(delta, input, cursor){
                    if (delta > 1 / PAN_DECELERATION) return; // ignore insane input delays which would break the camera

                    if (input.stateOf(69)) zimocity *= Math.pow(MAX_ZIMOCITY / zimocity, delta * 0.4) * Math.pow(zimocity, delta * 0.6);
                    if (cursor.dw > 0)     zimocity *= Math.pow(MAX_ZIMOCITY / zimocity, delta * 1.2) * Math.pow(zimocity, delta * 0.6);
                    if (input.stateOf(81)) zimocity /= Math.pow(MAX_ZIMOCITY / zimocity, delta * 0.4) * Math.pow(zimocity, delta * 0.6);
                    if (cursor.dw < 0)     zimocity /= Math.pow(MAX_ZIMOCITY / zimocity, delta * 1.2) * Math.pow(zimocity, delta * 0.6);

                    // navigating right via ->, D, or mouse position
                    if (input.stateOf(39) || input.stateOf(68) || cursor.x > gl.canvas.clientWidth  - 10){
                        panocity.dx += (delta * (MAX_PANOCITY - panocity.dx) * PAN_ACCELERATION) + (delta * panocity.dx * PAN_DECELERATION);
                    }
                    // navigating left via <-, A, or mouse position
                    if (input.stateOf(37) || input.stateOf(65) || cursor.x < 10){
                        panocity.dx -= (delta * (panocity.dx + MAX_PANOCITY) * PAN_ACCELERATION) - (delta * panocity.dx * PAN_DECELERATION);
                    }
                    // navigating up via ^, W, or mouse position
                    if (input.stateOf(38) || input.stateOf(87) || cursor.y < 10){
                        panocity.dy += (delta * (MAX_PANOCITY - panocity.dy) * PAN_ACCELERATION) + (delta * panocity.dy * PAN_DECELERATION);
                    }
                    // navigating down via v, S, or mouse position
                    if (input.stateOf(40) || input.stateOf(83) || cursor.y > gl.canvas.clientHeight - 10){
                        panocity.dy -= (delta * (panocity.dy + MAX_PANOCITY) * PAN_ACCELERATION) - (delta * panocity.dy * PAN_DECELERATION);
                    }

                    // decelerations due to camera friction
                    panocity.dy -= (delta * panocity.dy) * PAN_DECELERATION;
                    panocity.dy = (panocity.dy > 0) ? Math.max(0, panocity.dy - delta) : Math.min(0, panocity.dy + delta);
                    panocity.dx -= (delta * panocity.dx) * PAN_DECELERATION;
                    panocity.dx = (panocity.dx > 0) ? Math.max(0, panocity.dx - delta) : Math.min(0, panocity.dx + delta);
                    zimocity /= Math.pow(zimocity, delta * 0.9);
                    zimocity = (zimocity > 1) ? Math.max(1, zimocity - delta / 10) : Math.min(1, zimocity + delta / 10);




                    // movement of the camera occurs here
                    zoom *= zimocity;
                    zoom = Math.min(Math.max(zoom, 1), MED_HEIGHT/2.5);
                    focus[0] %= map.width * rt3;
                    focus[0] += panocity.dx / zoom;
                    focus[1] += panocity.dy / zoom;



                }

            })();

            this.getTheta = function(){
                switch(true){
                    case zoom < 1.0:
                        throw "Invalid zoom value";
                    case zoom <= 2.0:
                        return MIN_THETA + (zoom - 1) * (MAX_THETA-MIN_THETA);
                        break;
                    default:
                        return MAX_THETA;
                }
            };

            this.getFocus = function(){
                return [focus[0], focus[1], 0];
            };
            this.getPosition = function(){
                switch(true){
                    case zoom <  1.0:
                        throw "Invalid zoom value";
                    case zoom <= 2.0:
                        return [focus[0], focus[1], MAX_HEIGHT - (zoom - 1) * (MAX_HEIGHT-MED_HEIGHT)];
                        break;
                    case zoom <= 4.0:
                        return [focus[0], focus[1] - 3 * (zoom - 2), 2 * MED_HEIGHT / zoom];
                        break;
                    default:
                        return [focus[0], focus[1] - 6, 2 * MED_HEIGHT / zoom];
                        break;
                }
            };

            var elapsed = 0;
            this.update = function(delta, uniforms){
                elapsed += delta;

                var cursor = input.pollCursor();
                this.navigate(delta, input, cursor, 1);

                // establish shader uniforms
                uniforms.u_lightAngle = v3.normalize([Math.cos(elapsed/3), 0, Math.sin(elapsed/3) + 0.15]); // changes the position of the sun over time
                uniforms.u_projection = twgl.m4.identity(); // actually calculated below
                uniforms.u_lightColor = [
                    Math.max(0, Math.min(1, uniforms.u_lightAngle[2] + 0.72)),
                    Math.max(0, Math.min(1, uniforms.u_lightAngle[2] + 0.27)),
                    Math.max(0, Math.min(1, uniforms.u_lightAngle[2] + 0.15)),
                    1
                ];

                var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

                function calculateViewBox(that){
                    // vertical viewing angle, screen aspect ratio, near, far, memoryTarget
                    m4.perspective(that.getTheta(), aspect, 0.3, 3000, uniforms.u_projection);
                    var view = m4.inverse(
                        twgl.m4.lookAt(
                            that.getPosition(), // eye location
                            that.getFocus(), // focus location
                            [0, 1, 0] // up vector
                        )
                    );
                    m4.multiply(uniforms.u_projection, view, uniforms.u_projection);
                    // To clip our view and not exhaust computers, we clip the view
                    var projInv =  m4.inverse(uniforms.u_projection);
                    var thisVec = that.getPosition();
                    var viewBox = [   // Calculating the world coordinates at the corners of the canvas
                        [+1, -1, -1], // BR post-projection frustum vertex
                        [+1, +1, -1], // TR post-projection frustum vertex
                        [-1, -1, -1], // BL post-projection frustum vertex
                        [-1, +1, -1]  // TL post-projection frustum vertex
                    ].map(function(vec){
                        m4.transformPoint(projInv, vec, vec);
                        v3.subtract  (vec, thisVec, vec);
                        v3.divScalar (vec, -vec[2]/thisVec[2], vec);
                        return v3.add(vec, thisVec);
                    });
                    that.viewBR = viewBox[0]; // world coordinate vectors of the viewBox
                    that.viewTR = viewBox[1]; // world coordinate vectors of the viewBox
                    that.viewBL = viewBox[2]; // world coordinate vectors of the viewBox
                    that.viewTL = viewBox[3]; // world coordinate vectors of the viewBox
                }
                calculateViewBox(this);

                if(this.viewTR[1] - this.viewBR[1] > (map.height-1)*1.5){
                    zoom *= (this.viewTR[1] - this.viewBR[1]) / ((map.height-1)*1.5);
                    calculateViewBox(this);
                }
                if(this.viewTR[1] > (map.height - 1)*1.5){
                    focus[1] =  (map.height - 1)*1.5 - (this.viewTR[1] - focus[1]);
                    calculateViewBox(this);
                }
                if(this.viewBR[1] < 0){
                    focus[1] = (focus[1] - this.viewBR[1]);
                    calculateViewBox(this);
                }

                uniforms.u_viewPosition = this.getPosition();

            };

            this.destroy = function(){


            }
        }
    }
);