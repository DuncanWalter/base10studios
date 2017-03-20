/**
 * Created by Duncan on 2/19/2017.
 */

define(["src/PoissonDistribution"],
    function(PoissonDistribution){

        /*
         PerlinAt :: (size: SizeSettings,
                      settings: (PerlinSettings :: {
                        octaveSizes: float[] | 0 < octaveSizes[i],
                        octaveWeights: float[],
                        centrality: float
         })) -> perlinAt
         */
    return function PerlinAt(size, settings) {

        console.log("Entered the generate function of Perlin");

        if (settings.octaveSizes.length != settings.octaveWeights.length) {
            throw "PANIC: octaveSizes and octaveWeights have different sizes for PerlinGenerator";
        }

        // use the octaveSizes to calculate minRadius and maxRadius for the underlying PoissonGenerator
        var octaves = [];
        var minRadius;
        var maxRadius;
        var nodeDensity = 10; // hardcoded number
        var sumOfWeights = settings.octaveWeights.reduce(function(a, b){
            return a + b;
        });
        for (var i = 0; i < settings.octaveSizes.length; i++) {
            minRadius = settings.octaveSizes[i];
            maxRadius = minRadius * 2; // mediumcoded number
            octaves[i] = new PoissonDistribution(size, {
                minRadius: minRadius,
                maxRadius: maxRadius,
                nodeDensity: nodeDensity
            }); // call on the underlying PoissonGenerator to generate a random set of points
            // add a perlin value to each point in the poissonOctave
            octaves[i].forEach(function(point) {
                point.perlin = Math.random()*((Math.random()>0.5)?-1:1);
            });
            octaves[i].weight = settings.octaveWeights[i] / sumOfWeights;
            octaves[i].radius = minRadius;
        }

        console.dir(octaves);



        // we now have the poisson points with perlin values for each of the octaves

        /*
          perlinAt :: (point: Point) -> (PerlinValue :: float | -1 < float < 1)
         */
        return function perlinAt(point) {

            // console.log("Entered the perlinAt function: ("+point.x+", "+point.y+")");

            point.x = point.x % size.width; // Immediately wrap the x coordinate of the point
            if (point.y < 0 || point.y > size.height) {
                console.log("You just tried to get a perlin for a point outside the world... Fix it!");
                return 0;
            }

            var perlin = 0;
            // var perlinForOctave;
            var neighborhood;
            // We need to take the weighted sum of the octaves
            octaves.forEach(function(octave){


                // perlinForOctave = 0;

                // get all points within 3 times the octaveSize (which was the minRadius between poisson points)
                neighborhood = octave.getNeighborhood(point, octave.radius * 2);
                // console.dir(neighborhood);
                var n = Math.min(1, neighborhood.length);
                for(var i = 0; i < n; i++){

                    perlin += octave.weight * neighborhood[i].perlin / n;
                }




                // // if the neighborhood contains 3 or fewer points, take the average of all points
                // if (neighborhood.length <= 3) {
                //     for (var j = 0; j < neighborhood.length; j++) {
                //         perlinForOctave += neighborhood[j].perlin; // sum of perlin values
                //     }
                //     perlinForOctave /= neighborhood.length; // find average
                // } else { // if there are more than 3 points, find the closest three
                //
                //     // calculate the distance between each point and point
                //     neighborhood.forEach( function(currentPoint){
                //         currentPoint.distance = Math.min( Math.pow(point.x - currentPoint.x, 2) , Math.pow(point.x + size.width - currentPoint.x, 2) ) // calculate distance between x coords (accounting for wrap
                //             + Math.pow(point.y - currentPoint.y, 2); // calculate distance between y coords
                //     });
                //     // sort all points by distance
                //     neighborhood.sort(function(point1, point2) {
                //         return point1.distance - point2.distance;
                //     });
                //     // the points are now all sorted by distance
                //     perlinForOctave = (neighborhood[0] + neighborhood[1] + neighborhood[2])/3; // take average
                //
                // }
                // // determine perlin value from octave
                // perlin += perlinForOctave * (settings.octaveWeights[i] / sumOfWeights);
            });

            // console.log("Perlin at: " + perlin);

            return perlin;
        };
    };

});