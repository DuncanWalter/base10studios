
define(["src/PerlinAt", "src/PoissonDistribution", "src/Tile"],
    function(PerlinAt, PoissonDistribution, Tile) {
        var rt3 = Math.sqrt(3);

        /*
        Map :: ({
            size: (SizeSettings :: {
                height: int,
                width: int
            }),
            elevationPerlin: PerlinSettings,
            continentPoisson: {
                continentCount: float,
                landMass: float | 0 <= landMass <= 1,
                chaos: float
            }
        }) -> {
            tiles: Tile[],
            height: int,
            width: int
        }
        */
        return function Map(settings) {

            console.dir(settings);

            var h = this.height = settings.size.height + 2;
            var w = this.width  = settings.size.width;
            var tiles = new Array(this.width * this.height);
            for(var i = 0; i < tiles.length; i++){
                tiles[i] = {index: i};
            }

            /*
            // pointAt returns the Point at the canonical center of the tile with the given index.
            pointAt :: (index: int) -> Point
            */
            function pointAt(index) {
                var y = Math.floor(index/w) * 1.5;
                var x = ((index + y/3) % w) * rt3;
                return {x: x, y: y};
            }
            this.pointAt = pointAt;

            /*
            // indexAt returns the index of the tile under a given point.
            indexAt :: (point: Point) -> MapIndex
            */
            function indexAt(point) {
                var row = Math.ceil(Math.floor(point.y/0.75)/2);
                var col = Math.ceil(Math.floor(2*point.x/rt3 - row)/2);
                col = (col % w + w) % w;
                if(row < 0 || row >= h){return undefined}
                return w * row + col;
            }
            this.indexAt = indexAt;

            // shifts to the right along rows
            function rowShift(index, distance) {
                var temp = (index - (index % w)) + ((index + distance) % w);
                return (0 <= temp && temp < w * h) ? temp : undefined;
            }

            // shifts down and right along columns
            function colShift(index, distance) {
                var temp = (Math.floor(index / w) + distance) * w + index % w;
                return (0 <= temp && temp < w * h) ? temp : undefined;
            }

            // shifts down and left "diagonally"
            function altShift(index, distance) {
                var temp = (Math.floor(index / w) + distance) * w + index % w;
                temp = (temp - (temp % w)) + ((temp - distance) % w);
                return (0 <= temp && temp < w * h) ? temp : undefined;
            }

            function adjacentTo(tile){
                var index;
                var adjacent = [];

                index = rowShift(tile.index, +1);
                if (index != undefined) adjacent.push(tiles[index]);
                index = rowShift(tile.index, -1);
                if (index != undefined) adjacent.push(tiles[index]);
                index = colShift(tile.index, +1);
                if (index != undefined) adjacent.push(tiles[index]);
                index = colShift(tile.index, -1);
                if (index != undefined) adjacent.push(tiles[index]);
                index = altShift(tile.index, +1);
                if (index != undefined) adjacent.push(tiles[index]);
                index = altShift(tile.index, -1);
                if (index != undefined) adjacent.push(tiles[index]);

                return adjacent;
            }

            var noiseSize = {
                width: w*rt3,
                height: 2 + (h - 1)*1.5
            };
            var dormant = [];
            var active  = [];

            // spin up the continent shapes
            (new PoissonDistribution(noiseSize, { // poisson info
                minRadius: Math.sqrt(3*h*w / settings.continentPoisson.continentCount),
                maxRadius: this.minRadius * 1.2,
                nodeDensity: 12
            })).forEach(function(point){
                // spores land at each continent
                var index = indexAt(point);
                if(index != undefined){
                    sporeLand(tiles[index]);
                }
            });
            function sporeLand(tile){
                if (tile.isLand) return;
                if (active.indexOf(tile) != active.lastIndexOf(tile)) return;
                tile.isLand = true;
                dormant.push(tile);
                adjacentTo(tile).forEach(function(tile){
                    if(!tile.isLand){
                        active.push(tile);
                    }
                });
            }
            while(active.length > 0 && dormant.length < w*h*settings.continentPoisson.landMass/*landMass ratio*/){
                sporeLand(active.splice(Math.floor(active.length*Math.random()), 1)[0]);
            }
            // set up the tile elevations
            dormant = [];
            active  = [];
            (new PoissonDistribution(noiseSize, {
                minRadius: 8,
                nodeDensity: 12
            })).forEach(function(point){
                var index = indexAt(point);
                if(index != undefined)sporeBiome(tiles[index]);
            });
            function sporeBiome(tile){
                var options = adjacentTo(tile).reduce(function(accum, c){
                    if(c.biome != undefined){
                        accum.push(c.biome);
                    } else {
                        active.push(c); // sneak this in here...
                    }
                    return accum;
                }, []);
                if(options.length == 0){
                    var landChaos = 1 - settings.continentPoisson.chaos * 0.35;
                    var waterChaos = settings.continentPoisson.chaos;
                    if(Math.random() > ((tile.isLand) ? waterChaos : landChaos/*chaos variables*/)){
                        tile.biome = [
                            [1, 1, 2, 3],
                            [5, 4, 2, 3],
                            [6, 6, 4, 5]
                        ][Math.floor((Math.abs(0.5-Math.floor(tile.index/w)/h)*5.9999999))][Math.floor(Math.random()*4)];
                    } else {
                        tile.biome = 0;
                    }
                } else {
                    tile.biome = options[Math.floor(Math.random()*options.length)];
                }
            }
            while(active.length > 0){
                sporeBiome(active.splice(Math.floor(active.length*Math.random()), 1)[0]);
            }

            var perlinAt = new PerlinAt(noiseSize, settings.elevationPerlin);

            this.tiles = tiles.map(function(tile, index){
                return (index >= w && index < w*h-w) ?
                    new Tile(index, tile.biome, perlinAt(pointAt(index))):
                    new Tile(index, 7, perlinAt(pointAt(index)));
            });
        }
    }
);