/**
 * Created by Duncan on 3/8/2017.
 */
define(function(){
    var pi = Math.PI;

    function Vertex(angle, radius, velocity){
        return {
            angle: angle * 2 * pi,
            radius: radius,
            velocity: velocity
        };
    }

    return function Enigmagon(){
        // sets the enigmagon complexity
        var count = Math.max(Math.floor(Math.pow(Math.random()*0.65+1.42,4)),4);
        var step = Math.floor((Math.random()*(count-4)+4)/4)/count;
        console.log(count);
        console.log(step);
        var vertices = [];
        for(var j = 0; j < count; j++){

            vertices.push(new Vertex(j/count, 0.75, 0.13));
            vertices.push(new Vertex(j/count + 2*step, 0.75, -0.16));

            vertices.push(new Vertex(j/count, 0.75, 0.13));
            vertices.push(new Vertex(j/count + 3*step, 0.75, -0.16));

            vertices.push(new Vertex(j/count, 0.75, 0.13));
            vertices.push(new Vertex(j/count + 4*step, 0.75, -0.16));

            vertices.push(new Vertex(j/count, 0.75, 0.13));
            vertices.push(new Vertex(j/count + 5*step, 0.75, -0.16));

        }
        console.log(vertices.length);

        var paused = false;

        var positions = new Float32Array(vertices.length * 3);
        var colors    = new Float32Array(vertices.length * 4);

        this.calculatePositions = function(delta, radius1, radius2){
            var pi = 0;
            vertices.forEach(function(vertex){
                if(!(pi % 2)){ // alternating vertices
                    vertex.radius = radius1;
                } else {
                    vertex.radius = radius2;
                }
                if(!paused){
                    vertex.angle += vertex.velocity * delta;
                    vertex.angle %= 2 * Math.PI;
                }
                positions[pi++] = Math.cos(vertex.angle) * vertex.radius;
                positions[pi++] = Math.sin(vertex.angle) * vertex.radius;
                positions[pi++] = (pi%2) ? 0.5 : -0.5;
            });
            return positions;
        };
        this.calculateColors = function(color1, color2){
            var ci = 0;
            vertices.forEach(function(){
                if(!(ci % 8)){ // alternating vertices
                    color1.forEach(function(value){
                        colors[ci++] = value;
                    });
                } else {
                    color2.forEach(function(value){
                        colors[ci++] = value;
                    });
                }
            });
            return colors;
        };

        this.spin = function(speed){
            vertices.forEach(function(vertex){
                vertex.velocity += speed;
            });
        };
        this.energize = function(speed){
            vertices.forEach(function(vertex){
                vertex.velocity *= speed;
            });
        };
        this.split = function(){
            var l;
            var s = Math.floor(Math.random()*4);
            for(l = s; l < vertices.length; l+=4){
                vertices[l].velocity = -vertices[l].velocity;
            }
            for(l = (s+1)%4; l < vertices.length; l+=4){
                vertices[l].velocity = -vertices[l].velocity;
            }
        };
        this.pause = function(){
            paused = true;
        };
        this.play = function(){
            paused = false;
        };

    }
});