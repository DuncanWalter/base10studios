/**
 * Created by Weeels on 12-Dec-15.
 *
 * File holds objects for the world itself: tiles, world, world generator objects, etc.
 */

var tileCatalogue      = [
    /*	hot	hot 	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	hot	hot 	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	31	], // 	0
    /*	hot	hot 	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	31	], // 	1
    /*	hot	hot 	Swamp	*/	[	1.00,	1.00,	2.35,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	32	], // 	2
    /*	hot	hot 	Basin	*/	[	1.00,	1.00,	3.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	32	], // 	3
    /*	hot	hot 	Woods	*/	[	0.65,	0.65,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	33	], // 	4
    /*	hot	hot 	Hills	*/	[	1.00,	1.00,	2.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	33	], // 	5
    /*	hot	hot 	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	34	], // 	6
    /*	hot	hot 	Crags	*/	[	1.00,	1.00,	2.65,	0.00,	1.0,	2.0,	"Clear",	"Rough",	34	], // 	7
    /*	hot	hot 	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	35	], // 	8
    /*	hot	hot 	spire	*/	[	1.00,	1.00,	3.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	35	], // 	9

    /*	dry	hot 	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	dry	hot 	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	31	], // 	10
    /*	dry	hot 	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	31	], // 	11
    /*	dry	hot 	Swamp	*/	[	2.35,	1.00,	1.00,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	32	], // 	12
    /*	dry	hot 	Basin	*/	[	3.00,	1.00,	1.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	32	], // 	13
    /*	dry	hot 	Woods	*/	[	2.00,	0.65,	0.65,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	33	], // 	14
    /*	dry	hot 	Hills	*/	[	2.00,	1.00,	1.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	33	], // 	15
    /*	dry	hot 	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	34	], // 	16
    /*	dry	hot 	Crags	*/	[	2.65,	1.00,	1.00,	0.00,	1.0,	2.0,	"Clear",	"Rough",	34	], // 	17
    /*	dry	hot 	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	35	], // 	18
    /*	dry	hot 	spire	*/	[	3.00,	1.00,	1.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	35	], // 	19

    /*	wet	hot 	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	wet	hot 	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	41	], // 	20
    /*	wet	hot 	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	41	], // 	21
    /*	wet	hot 	Swamp	*/	[	1.00,	2.35,	1.00,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	42	], // 	22
    /*	wet	hot 	Basin	*/	[	1.00,	3.00,	1.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	42	], // 	23
    /*	wet	hot 	Woods	*/	[	0.65,	2.00,	0.65,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	43	], // 	24
    /*	wet	hot 	Hills	*/	[	1.00,	2.00,	1.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	43	], // 	25
    /*	wet	hot 	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	44	], // 	26
    /*	wet	hot 	Crags	*/	[	1.00,	2.65,	1.00,	0.00,	1.0,	2.0,	"Clear",	"Rough",	44	], // 	27
    /*	wet	hot 	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	45	], // 	28
    /*	wet	hot 	spire	*/	[	1.00,	3.00,	1.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	45	], // 	29

    /*	dry	cold	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	dry	cold	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	71	], // 	30
    /*	dry	cold	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	71	], // 	31
    /*	dry	cold	Swamp	*/	[	1.00,	2.35,	1.00,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	72	], // 	32
    /*	dry	cold	Basin	*/	[	1.00,	3.00,	1.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	72	], // 	33
    /*	dry	cold	Woods	*/	[	0.65,	2.00,	0.65,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	73	], // 	34
    /*	dry	cold	Hills	*/	[	1.00,	2.00,	1.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	73	], // 	35
    /*	dry	cold	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	74	], // 	36
    /*	dry	cold	Crags	*/	[	1.00,	2.65,	1.00,	0.00,	1.0,	2.0,	"Clear",	"Rough",	74	], // 	37
    /*	dry	cold	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	75	], // 	38
    /*	dry	cold	spire	*/	[	1.00,	3.00,	1.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	75	], // 	39

    /*	wet	cold	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	wet	cold	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	41	], // 	40
    /*	wet	cold	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	41	], // 	41
    /*	wet	cold	Swamp	*/	[	2.35,	1.00,	1.00,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	42	], // 	42
    /*	wet	cold	Basin	*/	[	3.00,	1.00,	1.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	42	], // 	43
    /*	wet	cold	Woods	*/	[	2.00,	0.65,	0.65,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	43	], // 	44
    /*	wet	cold	Hills	*/	[	2.00,	1.00,	1.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	43	], // 	45
    /*	wet	cold	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	44	], // 	46
    /*	wet	cold	Crags	*/	[	2.65,	1.00,	1.00,	0.00,	1.0,	2.0,	"Clear",	"Rough",	44	], // 	47
    /*	wet	cold	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	45	], // 	48
    /*	wet	cold	spire	*/	[	3.00,	1.00,	1.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	45	], // 	49

    /*	col	cold	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	col	cold	Oasis	*/	[	2.00,	2.00,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	71	], // 	50
    /*	col	cold	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	71	], // 	51
    /*	col	cold	Swamp	*/	[	1.00,	1.00,	2.35,	0.00,	1.0,	2.0,	"Wild", 	"Flat", 	72	], // 	52
    /*	col	cold	Basin	*/	[	1.00,	1.00,	3.00,	0.00,	1.0,	3.0,	"Wild", 	"Rough",	72	], // 	53
    /*	col	cold	Woods	*/	[	0.65,	0.65,	2.00,	1.00,	1.0,	2.0,	"Wild", 	"Flat", 	73	], // 	54
    /*	col	cold	Hills	*/	[	1.00,	1.00,	2.00,	1.00,	1.0,	3.0,	"Wild", 	"Rough",	73	], // 	55
    /*	col	cold	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	74	], // 	56
    /*	col	cold	Crags	*/	[	1.00,	1.00,	2.65,	0.00,	1.0,	2.0,	"Clear",	"Rough",	74	], // 	57
    /*	col	cold	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	75	], // 	58
    /*	col	cold	spire	*/	[	1.00,	1.00,	3.00,	2.00,	1.0,	3.0,	"Clear",	"Rough",	75	], // 	59

    /*	nan	none	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	gra	eymun	Oasis	*/	[	1.35,	1.35,	1.35,	3.00,	1.0,	2.0,	"Wild", 	"Flat", 	21	], // 	60
    /*	gra	eymun	lakes	*/	[	0.00,	0.00,	0.00,	0.00,	2.0,	0.0,	"Paved",	"Water",	21	], // 	61
    /*	gra	eymun	Swamp	*/	[	0.65,	0.65,	0.65,	2.35,	1.0,	2.0,	"Wild", 	"Flat", 	22	], // 	62
    /*	gra	eymun	Basin	*/	[	1.00,	1.00,	1.00,	2.00,	1.0,	3.0,	"Wild", 	"Rough",	22	], // 	63
    /*	gra	eymun	Woods	*/	[	1.00,	1.00,	1.00,	1.35,	1.0,	2.0,	"Wild", 	"Flat", 	23	], // 	64
    /*	gra	eymun	Hills	*/	[	1.00,	1.00,	1.00,	2.00,	1.0,	3.0,	"Wild", 	"Rough",	23	], // 	65
    /*	gra	eymun	Wastes	*/	[	1.00,	1.00,	1.00,	1.00,	1.0,	1.0,	"Clear",	"Flat", 	24	], // 	66
    /*	gra	eymun	Crags	*/	[	1.00,	1.00,	1.00,	1.65,	1.0,	2.0,	"Clear",	"Rough",	24	], // 	67
    /*	gra	eymun	Peaks	*/	[	0.00,	0.00,	0.00,	0.00,	1.0,	100,	"Clear",	"Cliffed",	25	], // 	68
    /*	gra	eymun	spire	*/	[	1.65,	1.65,	1.65,	2.00,	1.0,	3.0,	"Clear",	"Rough",	25	], // 	69

    /*	nan	none	Biome	*/	//	Food	Ind.	Tho.	Plat 	To  	Thru	Biomass 	Terrain 	Image
    /*	O	cean	shore	*/	[	0.00,	0.00,	0.00,	0.00,	2.5,	-0.5,	"Paved",	"Water",	91	], // 	70
    /*	O	cean	deeps	*/	[	0.00,	0.00,	0.00,	0.00,	3.5,	-1.5,	"Paved",	"Water",	81	], // 	71
    /*	O	cean	poles	*/	[	0.00,	0.00,	0.00,	0.00,	100,	1000,	"Paved",	"Water",	73	]  // 	72
];
var elevationCatalogue = [
    [   0   ],
    [	1,	1,	0	],
    [	2,	2,	2,	4,	6,	3	],
    [	4,	4,	5,	2,	4,	6	],
    [	3,	5,	7,	7,	6,	6	],
    [	8,	8,	9	]
];

function World() { //Main class of the world object

    this.pathfinder = new Pathfinder(this);

    this.initialize = function() {

        /*World Constants*/
        this.width  = 98; //the number of tiles in a single row
        this.height = 55; //the number of rows in the world
        this.length = this.width * this.height;
        this.tileSize = 48; // number of pixels a tile is; initial size of a tile in grid coordinates; conversion factor from tiles to pixels

        this.pixelWidth = this.width * this.tileSize; //length of the board in pixels
        // this.pixelHeight = this.height * this.tileSize * 3/ 4 + (this.tileSize / 4); // height of the board in pixels

        /*Map Tiles and other world variables*/
        // THE ARRAY OF TILES
        this.tiles = [];
        for(var t = 0; t < this.width * this.height; t++){this.tiles[t] = new Tile(t, this);}

        // describes the elevation shifts
        this.perlinOpacity = 0.99; // 0 < perlinOpacity < 1; larger means that the smaller blooms matter more (tiles will be more dissimilar)
        this.perlinDepth = 2; // 0 <= integer <= 4
        this.perlinCentrality = 1; // 1 <= perlinCentrality; larger means more linear; smaller means more sinusoidal

        // describes the den and resource placement
        this.nodeSpacing = 4.5; // 6 / 7 / 8 is standard
        this.nodeDensity = 20; // should be bigger than 10 for sure, but slows things down
        this.nodeVarience = 1.0; // keep between 0 and 1

        this.biomeRadius    = 5.50; // 6 ish is cool
        this.oceanFrequency = 0.62; // from 0 to 1, describes precisely the amount of water that will appear
        this.continentCount = 3.30; // defines how island-ish the world tends to be... is not exact every time, but does describe the world well.
        this.continentChaos = 0.07; // the sprawl and invasion of continents and oceans

        this.perlinGenerator = new PerlinNoiseGenerator(this);
        this.nodeGenerator = new DiscNodeGenerator(this);
        this.biomeGenerator = new BiomeGenerator(this, this.perlinGenerator, this.nodeGenerator);
        this.biomeGenerator.generate(this.oceanFrequency, this.biomeRadius, this.continentCount, this.continentChaos);
        this.perlinGenerator.generate(this.perlinDepth, this.perlinOpacity, this.perlinCentrality);
        this.nodeGenerator.generate(this.nodeSpacing, this.nodeDensity, this.nodeVarience);

        for(t = 0; t < this.length; t++){
            this.tiles[t].setElevation(this.tiles[t].perlin, this.tiles[t].biome, this);
            this.tiles[t].defineTile(this.tiles[t], this.tiles[t].biome, this.tiles[t].elevation);
            // this.tiles[t].imageFile = this.tiles[t].selectImageFile(this.tiles[t].image);
        }
    };

    /*
     Index = the tile Index
     Coords  are in grid coords measured in tiles
     Pixels  are in grid coords measured in pixels
     Screens are in grid coords measured in pixels w/ reference to the UL point of
     the camera and factoring in scale (where things draw on the screen)
     */

    // coords translations to index
    this.getIndexAtCoords   = function(x, y, optWidth){

        var index;
        var width = optWidth;
        if(optWidth == null){
            width = this.width;
        }

        // origin of the upper point
        var xA;
        var yA = Math.floor(y);
        if (yA % 2 == 0) { //even row
            xA = Math.floor(x  + 0.5);
        } else { // odd row
            xA = Math.floor(x) + 0.5 ;
        }

        // origin of the lower point
        var xB;
        var yB = Math.ceil(y);
        if (yB % 2 == 0) { //even row
            xB = Math.floor(x  + 0.5);
        } else { // odd row
            xB = Math.floor(x) + 0.5 ;
        }

        // calculates the index
        if ((Math.pow(x - xA, 2) + Math.pow(y - yA, 2)) < (Math.pow(x - xB, 2) + Math.pow(y - yB, 2))){

            index = yA * width + (xA - yA * 0.5) % width;
            if((xA - yA * 0.5) % width <= -0.5){
                index += width;
            }
        } else{

            index = yB * width + (xB - yB * 0.5) % width;
            if((xB - yB * 0.5) % width <= -0.5){
                index += width;
            }
        }

        //won't return an index outside the world
        if (index < 0 || index >= (this.length)) {
            index = null;
        }

        return index;
    };
    this.getCoordsAtPixels  = function(x, y){

        var tempX = (x / this.tileSize);
        var tempY = (y / this.tileSize * 4 / 3);

        return {x: tempX, y: tempY};

    };
    this.getPixelsAtScreens = function(x, y, camera){

        var tempX = camera.ULX + x / camera.scale;
        var tempY = camera.ULY + y / camera.scale;
        return {x: tempX, y: tempY};

    };

    this.getIndexAtPixels   = function(x, y, optWidth){

        var tempCoords = this.getCoordsAtPixels(x, y);
        var tempX = tempCoords.x;
        var tempY = tempCoords.y;
        return this.getIndexAtCoords(tempX, tempY, optWidth);

    };
    this.getIndexAtScreens  = function(x, y, optWidth, camera){

        var tempPixels = this.getPixelsAtScreens(x, y, camera);
        var tempX = tempPixels.x;
        var tempY = tempPixels.y;
        var tempCoords = this.getCoordsAtPixels(tempX, tempY);
        tempX = tempCoords.x;
        tempY = tempCoords.y;
        return this.getIndexAtCoords(tempX, tempY, optWidth);

    };
    this.getCoordsAtScreens = function(x, y, camera){

        var tempPixels = this.getPixelsAtScreens(x, y, camera);
        var tempX = tempPixels.x;
        var tempY = tempPixels.y;
        return this.getCoordsAtPixels(tempX, tempY);

    };

    // coords translations from index
    this.getCoordsAtIndex   = function(i, optWidth){

        var width = optWidth;
        if(optWidth == null){
            width = this.width;
        }

        var tempY = Math.floor(i / width);
        var tempX = i % width + tempY / 2;

        return {x: tempX, y: tempY};

    };
    this.getPixelsAtCoords  = function(x, y){

        var tempX = x * this.tileSize;
        var tempY = y * this.tileSize * 3 / 4;

        return {x: tempX, y: tempY};

    };
    this.getScreensAtPixels = function(x, y, camera){

        var tempX = (x - camera.ULX) * camera.scale;
        var tempY = (y - camera.ULY) * camera.scale;
        return {x: tempX, y: tempY};

    };

    this.getPixelsAtIndex   = function(i, optWidth){

        var tempCoords = this.getCoordsAtIndex(i, optWidth);

        return this.getPixelsAtCoords(tempCoords.x, tempCoords.y);

    };
    this.getScreensAtCoords = function(x, y, camera){

        var tempPixels = this.getPixelsAtCoords(x, y);
        return this.getScreensAtPixels(tempPixels.x, tempPixels.y, camera);

    };
    this.getScreensAtIndex  = function(i, optWidth, camera){

        var tempCoords = this.getCoordsAtIndex(i, optWidth);

        return this.getScreensAtCoords(tempCoords.x, tempCoords.y, camera)

    };

    // automatically initializes
    this.initialize();
}

function Tile(index, world){ // give it what you have replacing others w/ null

    this.world = world;
    this.index = index;

    this.moveTo    =   1;
    this.moveThrough = 2;

    this.land = false;
    this.biome = null;

    this.perlin = 0;

    //this.river = false;
    this.noded = false;

    this.image = 10;
    this.imageFile  = document.getElementById("error");
}
Tile.prototype.getIndexUL = function(distance) { //returns the tile that is in the upLeft direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexDR(-distance);}
    //set the new index up
    var newIndex = this.index - distance * this.world.width;
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};
Tile.prototype.getIndexUR = function(distance) { //returns the tile that is in the upRight direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexDL(-distance);}
    //set the new index up
    var newIndex = this.index - distance * this.world.width + distance;
    while (Math.floor(newIndex / this.world.width) != Math.floor((this.index - distance*this.world.width) / this.world.width)){
        //check to see if the upRight tile and the upLeft tile are on the same row. If not...
        newIndex -= this.world.width; //...subtract the length of a row in the perlin noise to wrap from right to left
    }
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};
Tile.prototype.getIndexLL = function(distance) { //returns the tile that is in the Left direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexRR(-distance);}
    //set the new index up
    var newIndex = this.index - distance;
    while (Math.floor(newIndex / this.world.width) != Math.floor(this.index / this.world.width)) { //check to see if the tiles are on the same row. If not...
        newIndex += this.world.width; //...add the length of a row in the perlin noise to wrap from left to right
    }
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};
Tile.prototype.getIndexRR = function(distance) { //returns the tile that is in the Right direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexLL(-distance);}
    //set the new index up
    var newIndex = this.index + distance;
    while (Math.floor(newIndex / this.world.width) != Math.floor(this.index / this.world.width)) { //check to see if the tiles are on the same row. If not...
        newIndex -= this.world.width; //...jump back a row
    }
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};
Tile.prototype.getIndexDL = function(distance) { //returns the tile that is in the downLeft direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexUR(-distance);}
    //set the new index up
    var newIndex = this.index + distance * this.world.width - distance;
    while (Math.floor(newIndex / this.world.width) != Math.floor((this.index + distance*this.world.width) / this.world.width)){
        //check to see if the downRight tile and the downLeft tile are on the same row. If not...
        newIndex += this.world.width; //...jump back a row
    }
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};
Tile.prototype.getIndexDR = function(distance) { //returns the tile that is in the downRight direction distance tiles away

    //ensures that null values get carried through the function
    if (this.index == null) {return null;}
    //use the downRight if distance is negative
    if (distance < 0) {return this.getIndexUL(-distance);}
    //set the new index up
    var newIndex = this.index + distance * this.world.width;
    if (newIndex >= this.world.length || newIndex < 0) {newIndex = null;} //attempted to access a bad tile

    return newIndex;
};

Tile.prototype.setElevation = function(perlin, biome, world) {

    var elevation = perlin;

    var boundary1 = 1.0001; //buffer just in case there is rounding error
    var boundary2 = 8 / 9 * boundary1; // 2 / 3
    var boundary3 = 2 / 9 * boundary1; // 2 / 9

    if      (-boundary1 <= elevation && elevation < -boundary2) {elevation = 1;} // lakes & oasis
    else if (-boundary2 <= elevation && elevation < -boundary3) {elevation = 2;} // low, swampy terrain
    else if (-boundary3 <= elevation && elevation <  boundary3) {elevation = 3;} // middle grounds
    else if ( boundary3 <= elevation && elevation <  boundary2) {elevation = 4;} // rougher, hilly terrain
    else if ( boundary2 <= elevation && elevation <  boundary1) {elevation = 5;} // mountains and spires

    if(this.biome != 8 && this.biome != 9 && this.noded == true){
        this.biome = 7; // TODO this is in the wrong spot; I'm cheating
    }

    if(this.biome == 8 || this.biome == 9){
        elevation = 0;
    }

    this.elevation = elevation;
    //return 10 * this.biome + elevation; //really, later we will switch which one gets multiplied by 10
    //return 10 * elevation + 3; // if you want to see an elevation map
};
Tile.prototype.defineTile = function(tile, biome, elevation){

    var b = biome;
    var e = elevation;

    var tempReference;
    if     (biome == 9){tempReference = 70}
    else if(biome == 8){tempReference = 71}
    else {tempReference = 10 * (b - 1) + elevationCatalogue[e][Math.floor(Math.random() * elevationCatalogue[e].length)]}

    var info = tileCatalogue[tempReference];

    this.food     = Math.floor(info[0]) + Math.ceil(info[0] % 1 - Math.random());
    this.industry = Math.floor(info[1]) + Math.ceil(info[1] % 1 - Math.random());
    this.thought  = Math.floor(info[2]) + Math.ceil(info[2] % 1 - Math.random());
    this.plat     = Math.floor(info[3]) + Math.ceil(info[3] % 1 - Math.random());

    this.moveTo      = info[4];
    this.moveThrough = info[5];

    this.image    = info[8];

};

function Point(X, Y, index, world) {
    this.x = X;
    this.y = Y;
    this.index = index;
    this.noded = false;
    this.world = world;
}
Point.prototype = Tile;
Point.prototype.snapToGrid = function(worldWidth) { // moves the point to the origin of the tile it’s on and sets the point’s index

    var index;

    //origin of the upper point
    var xA;
    var yA = Math.floor(this.y);
    if (yA % 2 == 0) { //even row
        xA = Math.round(this.x);
    } else { //odd row
        xA = Math.ceil(this.x) - 0.5;
    }

    //origin of the lower point
    var xB;
    var yB = Math.floor(this.y) + 1;
    if (yB % 2 == 0) { //even row
        xB = Math.round(this.x);
    } else { //odd row
        xB = Math.ceil(this.x) - 0.5;
    }


    //sets the point's definitions to the correct tile origin
    if (Math.pow(this.x - xA, 2) + Math.pow(this.y - yA, 2) <= Math.pow(this.x - xB, 2) + Math.pow(this.y - yB, 2)){
        index = yA * worldWidth + xA - yA * 0.5;
        if (xA - yA / 2 < 0) { //then you've wrapped back a row
            index += worldWidth;
        }
    }else{
        index = yB * worldWidth + xB - yB*0.5;
        if (xB - yB / 2 < 0) { //then you've wrapped back a row
            index += worldWidth;
        }
    }

    if (index < 0 || index >= (this.world.width * this.world.height)) {
        index = null; //outside of world. Don't do anything on a click
    }

    this.index = index;
    return index;
};

function Step(index, allowance, path, world, optNewPathStep) {
    this.index = index;
    this.allowance = allowance;
    this.path = path;
    this.world = world;
    if (optNewPathStep != null) {
        this.path.push(optNewPathStep);
    }
}
Step.prototype = Tile;
Step.prototype.getIndexUL = Tile.prototype.getIndexUL;
Step.prototype.getIndexUR = Tile.prototype.getIndexUR;
Step.prototype.getIndexLL = Tile.prototype.getIndexLL;
Step.prototype.getIndexRR = Tile.prototype.getIndexRR;
Step.prototype.getIndexDL = Tile.prototype.getIndexDL;
Step.prototype.getIndexDR = Tile.prototype.getIndexDR;

function Pathfinder(world) {

    this.world = world;

    this.pathfind = function(startIndex, movementAllowance){

        // steps are objects{} with index, allowance, and path[]
        var moveBonus = this.world.tiles[startIndex].moveThrough;
        var activeSteps  = [new Step(startIndex, movementAllowance + moveBonus, [], this.world)];
        //console.log(activeSteps[0]);
        var reachedSteps = [new Step(startIndex, movementAllowance + moveBonus, [], this.world)];

        while(activeSteps.length > 0){
            this.growPath(activeSteps[0], reachedSteps, activeSteps);
            activeSteps.splice(0,1);
        }

        return reachedSteps; //returns an array of indexes that know the path to themselves and the cost to move there
    };

    this.growPath = function(step, reachedSteps, activeSteps){

        var moveThrough = this.world.tiles[step.index].moveThrough;
        var tempMoveTo;
        var tempIndex;
        var tempStep;

        if(step.getIndexLL(1) != null){
            tempIndex  = step.getIndexLL(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }
        if(step.getIndexRR(1) != null){
            tempIndex  = step.getIndexRR(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }
        if(step.getIndexUL(1) != null){
            tempIndex  = step.getIndexUL(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }
        if(step.getIndexDL(1) != null){
            tempIndex  = step.getIndexDL(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }
        if(step.getIndexUR(1) != null){
            tempIndex  = step.getIndexUR(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }
        if(step.getIndexDR(1) != null){
            tempIndex  = step.getIndexDR(1); // finds the new index it's dealing with
            tempMoveTo =  this.world.tiles[tempIndex].moveTo; // finds
            tempStep   = new Step(tempIndex, step.allowance - moveThrough - tempMoveTo, step.path, step.world, step.index);
            this.testStep(tempStep, reachedSteps, activeSteps);
        }

    };
    this.testStep = function(step, reachedSteps, activeSteps){

        var isDuplicate = -1;

        for(var i = 0; i < reachedSteps.length; i++){
            if(reachedSteps[i].index == step.index){
                isDuplicate = i;
                if(step.allowance > reachedSteps[i].allowance){
                    reachedSteps[i] = step;
                    activeSteps.push(step);
                }
            }
        }

        if(isDuplicate == -1){
            if (step.allowance >= 0) {
                reachedSteps.push(step);
                if (step.allowance > 0){
                    activeSteps.push (step);
                }
            }
        }
    };
}

function PerlinNoiseGenerator(world) {
    /*Generates a perlin noise array based on the size of the world (width and height) and the number of iterations
     of the perlin function (perlinDepth) with a granularity between 0 and 1 (perlinOpacity) that describes
     the strength of the smaller perlin arrays compared to the largest one (0 means only the biggest one shows,
     while 1 means they all show equally*/
    this.generate = function(depth, opacity, linearity) {// resets the calling worlds tiles array's perlin figures to a new perlin noise

        var perlinRange = (Math.sin(Math.PI / 2.0 / linearity))*((1 - Math.pow( 1.0 / opacity, depth + 1)) / (1 - 1.0 / opacity)); //maximum value returned by the Perlin Noise functions

        // oversizes the noise array horizontally to a # divisible by 49
        if (world.width % 49 != 0) {
            this.perlinWidth = world.width + (49 - world.width % 49);
        } else {
            // already divisible by 49
            this.perlinWidth = world.width;
        }

        this.perlinHeight = world.height + 2 * Math.floor(Math.pow(3, depth - 1) + 2); // oversizes the noise array vertically to avoid vertical wrapping (actually oversizes too much) (but we don't care yet)
        this.perlinLength = this.perlinWidth * this.perlinHeight; // the number of tiles in the noise array
        //this.worldLength = world.height * world.width; // the number of tiles in the world array

        //initializes and fills a blank perlin array, needs to be deleted
        this.perlinArray = [];
        for (var i = 0; i < this.perlinLength; i++) {
            this.perlinArray[i] = 0;
        }

        //Plants blooms at the appropriate depths
        for (var d = 0; d <= world.perlinDepth; d++) {
            this.plantBlooms(d, opacity, linearity);
        }

        this.readIn(depth, perlinRange);
    };

    this.getIndexUL = function(index, distance) { //returns the tile that is in the upLeft direction distance tiles away

        //ensures that null values get carried through the function
        if (index == null) {return null;}
        //use the downRight if distance is negative
        if (distance < 0) {return this.getIndexDR(index, -distance);}

        index = index - distance*this.perlinWidth;
//                    if (index < 0) {
//                        return null; //attempted to access a negative value. return null so we know that that tile DNE
//                    }
        return index;
    };
    this.getIndexUR = function(index, distance) { //returns the tile that is in the upRight direction distance tiles away
        if (index == null) {
            return null; //ensures that null values get carried through the function
        }

        if (distance < 0) {
            return this.getIndexDL(index, -distance); //use the downLeft if distance is negative
        }

        var newIndex = index - distance*this.perlinWidth + distance;
//                    if (newIndex < 0) {
//                        return null; //attempted to access a negative value. return null so we know that that tile DNE
//                    }

        while (Math.floor(newIndex / this.perlinWidth) != Math.floor( (index - distance*this.perlinWidth) / this.perlinWidth)) { //check to see if the upRight tile and the upLeft tile are on the same row. If not...
            newIndex -= this.perlinWidth; //...subtract the length of a row in the perlin noise to wrap from right to left
        }

        return newIndex;
    };
    this.getIndexLL = function(index, distance) { //returns the tile that is in the left direction distance tiles away
        if (index == null) {
            return null; //ensures that null values get carried through the function
        }

        if (distance < 0) {
            return this.getIndexRR(index, -distance); //use the right if distance is negative
        }

        var newIndex = index - distance;
//                    if (newIndex < 0) {
//                        return null; //attempted to access a negative value. return null so we know that that tile DNE
//                    }

        while (Math.floor(newIndex / this.perlinWidth) != Math.floor(index / this.perlinWidth)) { //check to see if the tiles are on the same row. If not...
            newIndex += this.perlinWidth; //...add the length of a row in the perlin noise to wrap from left to right
        }

        return newIndex;
    };
    this.getIndexRR = function(index, distance) { //returns the tile that is in the right direction distance tiles away
        if (index == null) {
            return null; //ensures that null values get carried through the function
        }

        if (distance < 0) {
            return this.getIndexLL(index, -distance); //use the left if distance is negative
        }

        var newIndex = index + distance;
//                    if (newIndex >= this.perlinLength) {
//                        return null; //attempted to access a value that is too large. return null so we know that that tile DNE
//                    }

        while (Math.floor(newIndex / this.perlinWidth) != Math.floor(index / this.perlinWidth)) { //check to see if the tiles are on the same row. If not...
            newIndex -= this.perlinWidth; //...subtract the length of a row in the perlin noise to wrap from right to left
        }

        return newIndex;
    };
    this.getIndexDL = function(index, distance) { //returns the tile that is in the downLeft direction distance tiles away
        if (index == null) {
            return null; //ensures that null values get carried through the function
        }

        if (distance < 0) {
            return this.getIndexUR(index, -distance); //use the upRight if distance is negative
        }

        var newIndex = index + distance*this.perlinWidth - distance;
//                    if (newIndex >= this.perlinLength) {
//                        return null; //attempted to access a value that is too large. return null so we know that that tile DNE
//                    }

        while (Math.floor(newIndex / this.perlinWidth) != Math.floor( (index + distance*this.perlinWidth) / this.perlinWidth)) { //check to see if the downLeft and downRight tiles are on the same row. If not...
            newIndex += this.perlinWidth; //...add the length of a row in the perlin noise to wrap from left to right
        }

        return newIndex;
    };
    this.getIndexDR = function(index, distance) { //returns the tile that is in the downRight direction distance tiles away
        if (index == null) {
            return null; //ensures that null values get carried through the function
        }

        if (distance < 0) {
            return this.getIndexUL(index, -distance); //use the upLeft if distance is negative
        }

        index = index + distance*this.perlinWidth;
//                    if (index >= this.perlinLength) {
//                        return null; //attempted to access a value that is too large. return null so we know that that tile DNE
//                    }

        return index;
    };

    this.plantBlooms = function(depth, opacity, linearity){// sets and runs the bloom function at a given depth
        var rowOffset;

        if(depth < 2) {
            rowOffset = 0;
            for (var h = 0; h < this.perlinHeight; h += 1) {
                for (var w = 0; w + rowOffset < this.perlinWidth; w += Math.pow(7, depth)) {
                    var index1 = (h * this.perlinWidth) + w + rowOffset;
                    this.bloom(index1, depth, Math.pow(opacity, -depth) * this.random(linearity));
                }
                rowOffset += Math.floor(2 * Math.pow(7, depth - 1));
                rowOffset = rowOffset % Math.pow(7, depth);
            }
        }

        if(depth == 2){
            for (h = 0; h  < this.perlinHeight; h += 7){
                for (w = 0; w  < this.perlinWidth; w += 7){
                    var index2 = (h * this.perlinWidth) + w ;
                    this.bloom(index2, depth, Math.pow(opacity, -depth) * this.random(linearity));
                }
            }
        }

        if(depth == 3){
            rowOffset = 0;
            for (h = 0; h  < this.perlinHeight; h += 7){
                for (w = 0; w  < this.perlinWidth; w += 49){
                    var index3 = (h * this.perlinWidth) + w + rowOffset;
                    this.bloom(index3, depth, Math.pow(opacity, -depth) * this.random(linearity));
                }
                rowOffset += 14;
                rowOffset = rowOffset % 49;
            }
        }

        if(depth == 4){
            rowOffset = 0;
            for (h = 0; h  < this.perlinHeight; h += 49){
                for (w = 0; w  < this.perlinWidth; w += 49){
                    var index4 = (h * this.perlinWidth) + w + rowOffset;
                    this.bloom(index4, depth, Math.pow(opacity, -depth) * this.random(linearity));
                }
                rowOffset += 0;
                rowOffset = rowOffset % 147;
            }
        }
    };

    this.bloom = function(index, depth, bloomValue){// expands a node at index into an appropriately sized bloom

        if(depth == 0){//ends when depth hits 0
            if (index >= 0 && index < this.perlinLength) {
                this.perlinArray[index] += bloomValue;
            }
            return;
        }

        var run, spin, newIndex = index;
        //determines the hockey-sticking distances
        if(depth == 1) {run = 1; spin = 0;}
        if(depth == 2) {run = 2; spin = 1;}
        if(depth == 3) {run = 7; spin = 0;}
        if(depth == 4) {run = 7; spin = 14;}


        // for the "null" (center) direction
        this.bloom(newIndex, depth - 1, bloomValue); //calls recursion of the function on the null (center) reference tile

        // for the "right" direction
        newIndex = this.getIndexDR(this.getIndexRR(index, run), spin); //inside most occurs first (so move first right then downRight)
        this.bloom(newIndex, depth - 1, bloomValue); // calls recursion of the function on the right reference tile

        // for the "downRight" direction
        newIndex = this.getIndexDL(this.getIndexDR(index, run), spin); //inside most occurs first (so move downRight then downLeft)
        this.bloom(newIndex, depth - 1, bloomValue); //calls recursion of the function on the downRight reference tile

        // for the "downLeft" direction
        newIndex = this.getIndexLL(this.getIndexDL(index, run), spin); //inside most occurs first (so move first downLeft, then left)
        this.bloom(newIndex, depth - 1, bloomValue); // calls recursion of the function on the downLeft reference tile

        // for the "left" direction
        newIndex = this.getIndexUL(this.getIndexLL(index, run), spin); //inside most occurs first (so move first left then upLeft)
        this.bloom(newIndex, depth - 1, bloomValue); //calls recursion of the function on the left reference tile

        // for the "upLeft" direction
        newIndex = this.getIndexUR(this.getIndexUL(index, run), spin); //inside most occurs first (so move first upLeft then upRight)
        this.bloom(newIndex, depth - 1, bloomValue); //calls recursion of the function on the upleft reference tile

        // for the "upRight" direction
        newIndex = this.getIndexRR(this.getIndexUR(index, run), spin); //inside most occurs first (so move first upRight the right)
        this.bloom(newIndex, depth - 1, bloomValue); //calls recursion of the function on the upleft reference tile

    };

    this.random = function(linearity){
        return Math.sin(((Math.PI / 2) - (Math.random() * Math.PI)) / linearity); // returns a random value scaled for centrality
    };

    this.readIn = function(depth, range){// writes the perlin numbers into the world's tiles array
        for (var h = 0; h < world.height; h++) {
            for (var w = 0; w < world.width; w++) {
                world.tiles[(h * world.width) + w].perlin = this.perlinArray[((h + Math.floor(Math.pow(3, depth - 1) + 2)) * this.perlinWidth) + w] / range;
            }
        }
    };
}
function DiscNodeGenerator(world) {
    this.world = world;

    this.dormantNodes = []; // list of accepted points sorted by x value

    this.activeNodes = [];
    // start with a random initial value in the array


    this.generate = function(nodeSpacing, density, variance, maxCount){
        // while there are points in the active array, pop them out randomly and run them through the gauntlet
        if(maxCount==null){this.maxCount = 1000000;}else{this.maxCount = maxCount;}

        this.dormantNodes = [];
        this.activeNodes = [new Point((world.width) * Math.random(), (world.height) * Math.random(), null, world)];

        var spacing = nodeSpacing;
        while(this.activeNodes.length > 0){
            var tempIndex = Math.floor(Math.random() * this.activeNodes.length);
            var point = this.activeNodes[tempIndex];
            if(this.checkZone(point, spacing) == true){ //if no dormant nodes exist in the zone
                this.cleanZone(point.x, point.y, spacing); //clear out any other active nodes in the zone
                this.populateZone(point.x, point.y, spacing, density, variance); //x, y, density, variance
                this.dormantNodes.push(point); //copy active node to dormant nodes
            }
            this.activeNodes.splice(tempIndex, 1); //remove node from active node list
        }

        // snap all of the final nodes to their respective tiles
        for(var i = 0; i < this.dormantNodes.length; i++){
            var temp = this.dormantNodes[i];
            temp.snapToGrid(this.world.width);
        }

        //cuts the number of nodes down to the desired length
        while(this.dormantNodes.length > this.maxCount){
            this.dormantNodes.splice(Math.floor(Math.random() * this.dormantNodes.length), 1);
        }

        this.dormantNodes.sort(function(a, b){return a.index - b.index}); //sort the dormant nodes by index

        var length = this.dormantNodes.length;
        for (i = length - 1; i >= 0; i--) {
            if (this.dormantNodes[i].index == null) {
                this.dormantNodes.splice(i, 1); //remove the null node from the list
                length--;
            }
        }

        formatReturn(this.dormantNodes); //return an array of 0's and 1's, with 1's corresponding to nodes (Instead transfers directly to world.tiles)
    };


//        this.add = function(point, PointArray){//adds a point to an array of points using insertion sort
//
//            console.log(PointArray.length);
//            if (PointArray.length == 0) {
//                PointArray[0] = point;
//                return (0);
//            }
//            var scan = PointArray.length - 1;
//            console.log(scan);
//            console.log(PointArray[scan]);
//            console.log(PointArray[scan].x);
//            while(scan >= 0 && point.x >= PointArray[scan].x){ //this line appears to be "broken"
//                PointArray[scan+1] = PointArray[scan];
//                scan -= 1;
//            }
//            PointArray[scan + 1] = point;
//            return (scan + 1);
//        };

    this.checkZone = function(point, spacing){ // scans the dormant list for offending points
        for(var i = 0; i < this.dormantNodes.length; i++){ // sweeps the whole array (unfortunately)
            if(Math.abs(this.dormantNodes[i].x - point.x) <= spacing){ // runs if the points are close
                if(Math.pow((this.dormantNodes[i].x - point.x), 2) + Math.pow((this.dormantNodes[i].y - point.y), 2) < Math.pow(spacing, 2)){
                    //compares the distance between the points to Spacing
                    return false; // indicates the test failure
                }
            }
            if(Math.abs(this.dormantNodes[i].x - point.x) - world.width >= -spacing){ // runs if the points are close by wrapping
                if(Math.pow(Math.abs(this.dormantNodes[i].x - point.x) - world.width, 2) + Math.pow((this.dormantNodes[i].y - point.y), 2) < Math.pow(spacing, 2)){
                    //compares the distance between the wrapped points to nodeSpacing
                    return false; // indicates the test failure
                }
            }
        }
        return true; // otherwise, it passes
    };

    this.cleanZone = function(X, Y, spacing){ // eliminates near points from the active array
        for(var i = 0; i < this.activeNodes.length; i++) { // sweeps the whole array (unfortunately)
            if (Math.abs(this.activeNodes[i].x - X) <= spacing) { // runs if the points are close
                if (Math.pow((this.activeNodes[i].x - X), 2) + Math.pow((this.activeNodes[i].y - Y), 2) < Math.pow(spacing, 2)) {
                    //compares the distance between the points to nodeSpacing
                    this.activeNodes.splice(i, 1); // kills the offending point
                }
            } else if (Math.abs(this.activeNodes[i].x - X) - world.width >= -spacing) { // runs if the points are close by wrapping
                if (Math.pow((this.activeNodes[i].x - X) - world.width, 2) + Math.pow((this.activeNodes[i].y - Y), 2) < Math.pow(spacing, 2)) {
                    //compares the distance between the wrapped points to nodeSpacing
                    this.activeNodes.splice(i, 1); // kills the offending point
                }
            }
        }
    };

    this.populateZone = function(X, Y, spacing, density, variance){ // creates density points between nS and 2*nS away

        for(var i = 0; i < density; i++){
            var randomAngle = Math.random(); //ensures we use the same random to calculate the angles
            var randomDistance = Math.random();
            var newX = X + Math.cos(randomAngle * 2 * Math.PI) * (spacing + randomDistance * variance * spacing);
            newX %= world.width;
            var newY = Y + Math.sin(randomAngle * 2 * Math.PI) * (spacing + randomDistance * variance * spacing);
            if(newY >= 0 && newY <= world.height) {
                //console.log("Proposing new tile.");
                this.activeNodes.push(new Point(newX, newY, null, world));
            }
        }
    };

//        function indexSort(PointArray){
//            for(var scan = 1; scan < PointArray.length; scan++) {
//                var temp = PointArray[scan];
//                console.log(PointArray[scan]);
//                while (temp.index >= PointArray[scan].index && scan >= 0) {
//                    PointArray[scan + 1] = PointArray[scan]; //shift every tile to the next value
//                    scan -= 1;
//                    console.log(scan);
//                }
//                PointArray[scan + 1] = temp; //assign the point to its rightful spot in the array
//            }
//        }

    function formatReturn(PointArray){ //takes our list of nodes and reads it into the tile array
        var walker = 0;
        var newArray = [];
        PointArray.push({index: world.length});
        for(var builder = 0; builder < world.width * world.height && walker < PointArray.length; builder++){
            if(PointArray[walker].index == builder){
                newArray[builder] = true; //if the index is at node, return 1
                walker ++; //cycle to the next index in the pointArray
            } else {
                newArray[builder] = false; //if the index is not a node, return 0
            }
        }

        //console.log(newArray);

        for (var i = 0; i < world.length; i++) {
            world.tiles[i].noded = newArray[i];
        }
    }
}
function BiomeGenerator(world, perlinGenerator, discGenerator) { // creates regions of biome and oceans

    this.world = world;
    this.dormantTiles = [];
    this.activeTiles = [];
    this.perlinGenerator = perlinGenerator;
    this.discGenerator = discGenerator;

    this.generate = function(oceanFrequency, regionRadius, continentCount, continentChaos){

        var tempRandom;
        var temp;

        //uses the disc generator to place roughly the right number of continents about the same distance form one another
        this.discGenerator.generate(Math.pow(world.length / (continentCount + 1 - (1 / continentCount)) * 1.1, 0.5), 20, 0.35);

        for(var s = 0; s < world.length; s++){
            if(world.tiles[s].noded == true){
                this.seedLand(this.world.tiles[s])
            }
        }

        //while the world still needs more land, the continents randomly expand at their borders
        while(this.dormantTiles.length <= (this.world.length * (1.0 - oceanFrequency)) && this.activeTiles.length > 0){ // grows the land as long as there needs to be more
            tempRandom = Math.floor(Math.random() * this.activeTiles.length); // gets the random index needed
            temp = this.activeTiles[tempRandom]; // selects the random tile
            if(this.activeTiles.indexOf(temp) == this.activeTiles.lastIndexOf(temp)){ // if it's the only active one
                this.growLand(temp); // the tile grows the land
            }
            this.activeTiles.splice(tempRandom, 1);
        }

        // Resets after growing land in order to generate biomes
        this.activeTiles = []; // needs to be reset to deal with biomes
        this.discGenerator.generate(regionRadius, 20, 1);
        this.perlinGenerator.generate(0, 0.95, 5); // creates a humidity map for biome choices

        //set the world's nodes up as the seeds for biomes. Biomes on continents get land iomes etc.
        for(var t = 0; t < world.tiles.length; t++){
            var tempTile = world.tiles[t];
            if(tempTile.noded == true){
                this.seedBiome(tempTile, oceanFrequency, continentChaos);
            }
        }

        //master loop: randomly picks tiles adjacent to a seeded biome and grows it
        while(this.activeTiles.length > 0){
            tempRandom = Math.floor(Math.random() * this.activeTiles.length); // gets the random index needed
            temp = this.activeTiles[tempRandom]; // selects the random tile
            this.growBiome(temp); // the tile picks a biome
            this.activeTiles.splice(tempRandom, 1);
        }

        /*Biomes = {
         0: "Not Defined",
         1: "tundra",
         2: "(cold dry)",
         3: "temperate (cold wet)",
         4: "tropical (hot wet)",
         5: "arid (hot dry)",
         6: "desert",
         7: "neutral",
         8: "oceanic",
         9: "coastal"
         };*/
    };

    this.seedBiome = function(tile, oceanFrequency, continentChaos) { // assigns a biome to a node, eventually bool should be a cutoff number instead

        // if the tile isn't on land, make it a water tile
        var tempFactor = oceanFrequency / (1 - oceanFrequency);
        if((tile.land == false && Math.random() >= continentChaos / tempFactor) || Math.random() <= continentChaos){
            tile.biome = 8;
            if(Math.random() < continentChaos){
                // tile.biome = 9;
            }
            tile.noded = true;
            this.sporeGrowth(tile);
            return;
        }

        var polarity = (Math.floor(tile.index / world.width + 0.5)) / this.world.height; //gets halfway through calculating latitude
        polarity = 2 * Math.abs(polarity - 0.5); // sets latitude to between 0 and one, where 0 lies on the equator

        var random = Math.random() * 80 + polarity * 280;
        random = Math.floor(random / 20) + 1; // sets random to an int from 1 to 18 inclusive

        // Using the random variable to select a biome
        switch (random) {
            case (1 ): tile.biome = 1; break;
            case (2 ): tile.biome = 1; break;
            case (3 ): tile.biome = 1; break;
            case (4 ): tile.biome = 1; break;
            case (5 ): if(tile.perlin >= 0){tile.biome = 2;}else{tile.biome = 3;} break;
            case (6 ): if(tile.perlin >= 0){tile.biome = 2;}else{tile.biome = 3;} break;
            case (7 ): if(tile.perlin >= 0){tile.biome = 2;}else{tile.biome = 3;} break;
            case (8 ): if(tile.perlin >= 0){tile.biome = 2;}else{tile.biome = 3;} break;
            case (9 ): if(tile.perlin >= 0){tile.biome = 2;}else{tile.biome = 3;} break;
            case (10): if(tile.perlin >= 0){tile.biome = 4;}else{tile.biome = 5;} break;
            case (11): if(tile.perlin >= 0){tile.biome = 4;}else{tile.biome = 5;} break;
            case (12): if(tile.perlin >= 0){tile.biome = 4;}else{tile.biome = 5;} break;
            case (13): if(tile.perlin >= 0){tile.biome = 4;}else{tile.biome = 5;} break;
            case (14): if(tile.perlin >= 0){tile.biome = 4;}else{tile.biome = 5;} break;
            case (15): tile.biome = 6; break;
            case (16): tile.biome = 6; break;
            case (17): tile.biome = 6; break;
            case (18): tile.biome = 6; break;
        }

        //keep the spread going
        tile.noded = true;
        this.sporeGrowth(tile);
    };

    this.seedLand = function(tile){
        tile.land = true;
        tile.noded = true;
        this.dormantTiles.push(tile);
        this.sporeGrowth(tile);
    };

    this.sporeGrowth = function(tile){
        var temp;
        //console.log("tracker 1");
        if(tile.getIndexRR(1) != null){
            temp = this.world.tiles[tile.getIndexRR(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 2");
        if(tile.getIndexLL(1) != null){
            temp = this.world.tiles[tile.getIndexLL(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 3");
        if(tile.getIndexUL(1) != null){
            temp = this.world.tiles[tile.getIndexUL(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 4");
        if(tile.getIndexDR(1) != null){
            temp = this.world.tiles[tile.getIndexDR(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 5");
        if(tile.getIndexUR(1) != null){
            temp = this.world.tiles[tile.getIndexUR(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 6");
        if(tile.getIndexDL(1) != null){
            temp = this.world.tiles[tile.getIndexDL(1)];
            if(temp.noded == false){this.activeTiles.push(temp);}
        }
        //console.log("tracker 7");
    };

    this.growBiome = function(tile){
        //checks to see if it needs a biome
        if(tile.noded == true){return;}
        //console.log("check1");
        //sets up a little array of nearby biomes
        var nearBiomes = [null, null, null, null, null, null];

        if(tile.getIndexRR(1) != null){
            nearBiomes[0] = this.world.tiles[tile.getIndexRR(1)].biome;}
        if(tile.getIndexLL(1) != null){
            nearBiomes[1] = this.world.tiles[tile.getIndexLL(1)].biome;}
        if(tile.getIndexUL(1) != null){
            nearBiomes[2] = this.world.tiles[tile.getIndexUL(1)].biome;}
        if(tile.getIndexDR(1) != null){
            nearBiomes[3] = this.world.tiles[tile.getIndexDR(1)].biome;}
        if(tile.getIndexUR(1) != null){
            nearBiomes[4] = this.world.tiles[tile.getIndexUR(1)].biome;}
        if(tile.getIndexDL(1) != null){
            nearBiomes[5] = this.world.tiles[tile.getIndexDL(1)].biome;}

        //console.log("check2");
        //cuts the null biomes out of the array
        for(var i = 0; i < nearBiomes.length;){
            if(nearBiomes[i] == null || nearBiomes[i] == 7){nearBiomes.splice(i,1); i -= 1}
            i += 1;
        }
        //console.log("check3");
        // if there are in fact nearby biomes...
        if(nearBiomes.length == 0){
            tile.biome = 7;
        }
        if(nearBiomes.length == 1){
            tile.biome = nearBiomes[0];
        }
        if(nearBiomes.length >1){
            //in the case that all surrounding biomes are same, set that as the biome
            tile.biome = nearBiomes[Math.floor(nearBiomes.length * Math.random())];

            nearBiomes.sort(function(a,b){return a - b});
            if(nearBiomes[0] == nearBiomes[nearBiomes.length - 1]){
                tile.biome = nearBiomes[0];
            }else{ // if it's caught between multiple biomes
                if(nearBiomes.indexOf(8.0, 0) > -1){
                    tile.biome = 9; // sets shallow seas if on a coast
                }
                //else{tile.biome = 7;} // sets neutral biomes between regions
            }
        }
        //keep the spread going
        tile.noded = true;
        this.sporeGrowth(tile);
    };

    this.growLand = function(tile){
        if(tile.noded == true || tile.land == true){return;}

        //var tempBool = Math.random() >= continentChaos;
        tile.noded = true;
        this.dormantTiles.push(tile);
        //if(tempBool){
        this.sporeGrowth(tile);
        tile.land = true;
        //}
    };
}


