/**
 * Created by Weeels on 12-Dec-15.
 *
 * File holds user, camera, mouse functions, input listeners, settings, gameloop, etc.
 */

/* we'll give users / their cameras an array storing the images of the world, and tiles will forget their images.
 * the user will hold an array of visible indexes for the empire, while individual units will hold their reached step arrays.
 * whenever a unit's step array changes, the empire visible indexes array will also shift accordingly.*/
armyNameCatalogue = [
    "Gungan Hoard",
    "RedShirt Phalanx",
    "Angry Puppies",
    "A Sleeping Shia LeBoufe",
    "Purple People Eaters"
];

function getMousePosition(canvas, event) {
    var rectangle = canvas.getBoundingClientRect();
    return {
        x: Math.round((event.clientX - rectangle.left) / (rectangle.right - rectangle.left) * canvasWidth),
        y: Math.round((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top) * canvasHeight)
    };
}

function User(world, settings) {

    // components of user experience
    this.world = world; // multiple users reference the same world
    this.pathfinder = new Pathfinder(this.world);
    this.settings = settings; // settings
    this.camera = new Camera(settings.cameraStartX, settings.cameraStartY, settings.cameraStartZ, world, this); // each user gets a unique and static camera
    this.interface = new Interface(world, this); // the HUD / UI will be run independent of the map behind it
    this.inputListener = new InputListener(this); // each user gets a unique and static listener
    this.empire = new Empire(this.world, this);

    // user information
    this.mousePosition = {x: null, y: null};
    this.mouseIndex = null;
    this.mouseGhost = {x: null, y: null};
    this.cameraGhost = {x: null, y: null};

    this.selectedArmy = null;
    this.drawHalts = 1;

    var tempPixels;
    var tempZoom;

    // this function takes all the user input from the last frame into account and updates the user
    this.calcFrame = function(currentTime, delay, input){

        this.mousePosition = input.mouseScreens;
        this.mouseIndex = this.world.getIndexAtScreens(this.mousePosition.x, this.mousePosition.y, null, this.camera);

        // looks through the keys that changed position and acts on them
        for(var i = 0; i < input.deltaKeys.length; i++){
            if(input.deltaKeys[i].isDown){
                this.keyDown(input.deltaKeys[i].keyCode);
            } else {
                this.keyUp  (input.deltaKeys[i].keyCode);
            }
        }

        // looks through the mice that changed positions and acts on them
        for(var j = 0; j < input.deltaMice.length; j++){
            if(input.deltaMice[j].isDown){
                this.mouseDown(input.deltaMice[j].button);
            } else {
                this.mouseUp  (input.deltaMice[j].button);
            }
        }

        // looks through any scrolling that occurs and acts on it
        for(var k = 0; k < input.deltaWheels.length; k++){
            tempPixels = world.getPixelsAtScreens(this.mousePosition.x, this.mousePosition.y, this.camera);
            if(input.deltaWheels[k] > 0){
                tempZoom = this.settings.zoomSpeed;
            } else {
                tempZoom = 1 / this.settings.zoomSpeed;
            }
            this.camera.zoom(tempZoom, tempPixels.x, tempPixels.y)
        }

        // the current implementation of mouse panning...
        if(input.miceDown[0] && this.mouseIndex != null){
            this.camera.snapTo(this.cameraGhost.x + (this.mouseGhost.x - this.mousePosition.x) / this.camera.scale,
                               this.cameraGhost.y + (this.mouseGhost.y - this.mousePosition.y) / this.camera.scale,
                               null);
        }
    };

    // this function decides when to draw the world and interface
    this.drawFrame = function(currentTime, delay, pacer){
        if (this.drawHalts <= 0) {
            this.draw();
            this.drawHalts = Math.ceil(1.5 * (Date.now() - currentTime) / delay) + pacer - 1; // the user will skip future draws if the older ones are taking too long

        } else {
            this.drawHalts -= 1;
        }
    };

    this.draw = function() {

        this.camera.draw();
        this.interface.draw(this.mousePosition);

    };

    // button processing
    this.mouseDown = function(button){

        var tempIndex = this.world.getIndexAtScreens(this.mousePosition.x, this.mousePosition.y, null, this.camera);
        var tempTile = this.world.tiles[this.world.getIndexAtScreens(this.mousePosition.x, this.mousePosition.y, null, this.camera)];

        if(tempIndex != null){
            if(button == 0){
                this.cameraGhost = {x: this.camera.x, y: this.camera.y};
                this.mouseGhost = this.mousePosition;

                if(tempTile.army != null){
                    this.selectedArmy = tempTile.army;
                }else{
                    this.selectedArmy = null;
                }

            } else {
                if(this.selectedArmy != null && tempTile.army == null){
                    this.selectedArmy.setLocation(tempTile.index);
                }
            }
        }
    };
    this.mouseUp   = function(button){};
    this.keyDown = function(keyCode){
        switch (keyCode) {
            case 87: //w || up Arrow
                this.camera.panVertical(this.settings.panSpeed);
                //this.mouseMove(null);
                break;
            case 83: //s || down Arrow
                this.camera.panVertical(-this.settings.panSpeed);
                //this.mouseMove(null);
                break;
            case 65: //a || left Arrow
                this.camera.panHorizontal(-this.settings.panSpeed);
                //this.mouseMove(null);
                break;
            case 68: //d || right Arrow
                this.camera.panHorizontal(this.settings.panSpeed);
                //this.mouseMove(null);
                break;
            case 69: //e (zoom in)
                this.camera.zoom(this.settings.zoomSpeed);
                //this.mouseMove(null);
                break;
            case 81: //q (zoom out)
                this.camera.zoom(1 / this.settings.zoomSpeed);
                //this.mouseMove(null);
                break;
            case 32: // space
                this.world.initialize();
                this.camera.setActualImage();
                // this.draw();
                // this.mouseMove(null);
                break;
            default:
                //just warn that that button does nothing
                console.log(keyCode + " does nothing.");
        }
    };
    this.keyUp = function(keyCode){}; // currently has no functions
}

function Interface(world, user) {

    var that = this;
    this.world = world;
    this.user = user;

    this.spacing = 4;
    this.fontSize = 16;

    var HUDElements = [];
    this.ULOffset = 0;
    this.UROffset = 0;
    this.DLOffset = 0;
    this.DROffset = 0;

    // This is where HUD element contents are defined. A given HUD element Content knows how to
    // fetch its information and display its self within a HUD Element. They
    // each also have to be able to determine whether or not they are worth drawing

    // The tile info Content:
    function TileInfo(){

        this.info = {images: [], values: []};
        this.interface = that;
        this.tracker = 0;

    }
    TileInfo.prototype.draw = function(ULX, ULY, DRX, DRY, element, world){
        var spacing = this.interface.spacing;
        var fontSize = this.interface.fontSize;
        var tracker = this.tracker;

        for(var i = 0; i < this.tracker; i++){
            canvasContext.drawImage(this.info.images[i], ULX + spacing, ULY + (4 + i) * spacing + (i + 1) * fontSize, fontSize, fontSize);
            canvasContext.textAlign = "left";
            canvasContext.fillText (this.info.values[i], ULX + spacing * 3 + fontSize, ULY + (3 + i) * spacing + (i + 2) * fontSize);
        }
    };
    TileInfo.prototype.setDrawBool = function(element){

        return (element.interface.user.mouseIndex != null && this.tracker != 0 && element.user.empire.visableIndexes.indexOf(element.interface.user.mouseIndex) >= 0)

    };
    TileInfo.prototype.setContent = function(element){

        var user = element.interface.user;
        var tiles = element.interface.world.tiles;

        if(element.interface.user.mouseIndex != null){
            this.tracker = 0;

            if(tiles[user.mouseIndex].food != 0 && tiles[user.mouseIndex].food != null){
                this.info.images[this.tracker] = document.getElementById("food");
                this.info.values[this.tracker] = tiles[user.mouseIndex].food;
                this.tracker += 1;
            }
            if(tiles[user.mouseIndex].industry != 0 && tiles[user.mouseIndex].industry != null){
                this.info.images[this.tracker] = document.getElementById("industry");
                this.info.values[this.tracker] = tiles[user.mouseIndex].industry;
                this.tracker += 1;
            }
            if(tiles[user.mouseIndex].thought != 0 && tiles[user.mouseIndex].thought != null){
                this.info.images[this.tracker] = document.getElementById("thought");
                this.info.values[this.tracker] = tiles[user.mouseIndex].thought;
                this.tracker += 1;
            }
            if(tiles[user.mouseIndex].plat != 0 && tiles[user.mouseIndex].plat != null){
                this.info.images[this.tracker] = document.getElementById("plat");
                this.info.values[this.tracker] = tiles[user.mouseIndex].plat;
                this.tracker += 1;
            }

            element.width = 180;
            element.height = (4 + this.tracker) * element.interface.spacing + (this.tracker + 1) * element.interface.fontSize;
        }
    };

    // The tile info Content:
    function ArmyInfo(){

        this.interface = that;
        this.army = this.interface.user.selectedArmy;

    }
    ArmyInfo.prototype.draw = function(ULX, ULY, DRX, DRY, element, world){

        var spacing = this.interface.spacing;
        var fontSize = this.interface.fontSize;

        canvasContext.align = "left";
        canvasContext.fillText(this.army.lable, ULX + spacing, ULY + 3 * spacing + 2 * fontSize);

    };
    ArmyInfo.prototype.setDrawBool = function(element){

        return (this.army != null)

    };
    ArmyInfo.prototype.setContent = function(element){
        this.army = this.interface.user.selectedArmy;
        if(this.setDrawBool(element)){
            element.width = 540;
            element.height = 150;
        }
    };

    // The tile info Content:
    function Header(){

        this.interface = that;
        this.army = this.interface.user.selectedArmy;

    }
    Header.prototype.draw = function(ULX, ULY, DRX, DRY, element, world){

        // does nada

    };
    Header.prototype.setDrawBool = function(element){

        return true;

    };
    Header.prototype.setContent = function(element){
        if(this.setDrawBool(element)){
            element.width = canvasWidth - 2 * this.interface.spacing ;
            element.height = 5 * this.interface.spacing + 2 * this.interface.fontSize;
        }
    };

    var temp;
    temp = new HUDElement("Selected Army", new ArmyInfo, "DL", that); // an army info HUD that appears in the lower left of the screen
    HUDElements.push(temp);
    temp = new HUDElement("Terrain", new TileInfo, "DL", that); // a terrain hud that displays basic incomes from land tiles
    HUDElements.push(temp);
    temp = new HUDElement("These HUD Elements are now super flexible and fun!", new Header, "UL", that); // a banner across the top that should later house menu links
    HUDElements.push(temp);

    this.draw = function() {

        for(var i = 0; i < HUDElements.length; i++){
            HUDElements[i].draw();
        }

        this.ULOffset = 0;
        this.UROffset = 0;
        this.DLOffset = 0;
        this.DROffset = 0;

    };

}
function HUDElement(lable, content, originCorner, Interface){

    var that = this;
    var world = that.world;
    this.interface = Interface;
    this.user = Interface.user;

    // spacing and font size affect the borders between elements and the size of scripts in the hud
    var spacing = this.interface.spacing;
    var fontSize = this.interface.fontSize;

    var ULX;
    var ULY;
    var DRX;
    var DRY;
    this.width = 0;
    this.height = 0;
    this.drawBool = false;

    this.draw = function(){

        content.setContent(this); // width and height are defined here too

        var ULOffset = this.interface.ULOffset;
        var UROffset = this.interface.UROffset;
        var DLOffset = this.interface.DLOffset;
        var DROffset = this.interface.DROffset;

        if(originCorner.substr(0, 1) == "U"){
            ULY = spacing;
            DRY = this.height + spacing;
        }
        else{
            ULY = canvasHeight - this.height - spacing;
            DRY = canvasHeight - spacing;
        }

        if(originCorner.substr(1, 1) == "L"){
            ULX = spacing;
            DRX = this.width + spacing;
        }
        else{
            ULX = canvasWidth - this.width - spacing;
            DRX = canvasWidth - spacing;
        }

        this.drawBool = content.setDrawBool(this);

        if (this.drawBool == true){

            // fix offsets from other elements
            if(originCorner == "UL"){
                ULX += ULOffset;
                DRX += ULOffset;
                this.interface.ULOffset += this.width + spacing;
            }
            if(originCorner == "DL"){
                ULX += DLOffset;
                DRX += DLOffset;
                this.interface.DLOffset += this.width + spacing;
            }
            if(originCorner == "UR"){
                ULX -= UROffset;
                DRX -= UROffset;
                this.interface.UROffset += this.width + spacing;
            }
            if(originCorner == "DR"){
                ULX -= DROffset;
                DRX -= DROffset;
                this.interface.DROffset += this.width + spacing;
            }

            //this.user.camera.draw(this.user.camera, ULX, ULY, DRX, DRY);

            // draw thw little rectangles
            canvasContext.globalAlpha = 0.5;
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(ULX, ULY, DRX - ULX, DRY - ULY);
            canvasContext.fillRect(ULX + spacing, ULY + spacing, DRX - ULX - 2 * spacing, 2 * spacing + fontSize);
            canvasContext.globalAlpha = 1.0;

            // draw the lable and set the fontSize
            canvasContext.fillStyle = "white";
            canvasContext.font = (fontSize + "px Lucida Console");
            canvasContext.textAlign = "center";
            canvasContext.fillText(lable, (ULX + DRX) / 2, ULY + spacing + fontSize);
            canvasContext.textAlign = "left";

            // have the content draw its self in...
            content.draw(ULX, ULY, DRX, DRY, that, world);
        }
    }
}

function Camera(pixelX, pixelY, zoom, world, user) {

    //
    this.actualImages = [];
    for(var i = 0; i < world.tiles.length; i++){
        this.actualImages[i] = [this.processImage(world.tiles[i].image)];
    }

    //
    this.visableImages = [];
    for(var j = 0; j < world.tiles.length; j++){
        this.visableImages[j] = [graeymun];
    }

    // size of the camera in game pixels
    this.scale  = zoom; // Times zoomed in
    this.width  = canvasWidth  / this.scale; // size in game, not on screen
    this.height = canvasHeight / this.scale; // size in game, not on screen

    this.minScale = user.settings.cameraStartZ;
    this.maxScale = this.minScale * (world.height - 1) / 3;

    // points located at the center, upper left, and bottom Right of the camera
    this.x   = pixelX;
    this.y   = pixelY;
    this.ULX = pixelX - this.width  / 2;
    this.ULY = pixelY - this.height / 2;
    this.DRX = pixelX + this.width  / 2;
    this.DRY = pixelY + this.height / 2;

    var ULCoords;
    var DRCoords;
    var startY;
    var endY;
    var startX;
    var endX;

    var Offset;
    var tempImage;
    var tempScreens;
    var tempIndex;
    var seeker;
    var walker;

    var tempX;
    var tempY;
    var tempZoom;

    var armyImage = document.getElementById("army");

    this.draw = function(camera, optScreenStartX, optScreenStartY, optScreenEndX, optScreenEndY) {

        //draw only the part of the screen if both values of the bounding points are not null
        if (optScreenStartX != null && optScreenStartY != null && optScreenEndX != null && optScreenEndY != null) {
            ULCoords = world.getCoordsAtScreens(optScreenStartX, optScreenStartY, camera);
            DRCoords = world.getCoordsAtScreens(optScreenEndX, optScreenEndY, camera);
            //don't fill background. allow it to stay
        } else { //else draw the whole screen
            ULCoords = world.getCoordsAtPixels(this.ULX, this.ULY);
            DRCoords = world.getCoordsAtPixels(this.DRX, this.DRY);
            //This fills the background with grey, erasing anything previous
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            canvasContext.fillStyle = "#333333";
            canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        Offset = this.scale * world.tileSize / 2;

        startY = Math.floor(ULCoords.y);
        endY   = Math.ceil (DRCoords.y) + 1;
        startX = Math.floor(ULCoords.x);
        endX   = Math.ceil (DRCoords.x) + 1;

        user.empire.visableIndexes.sort(function(a, b){return a - b});
        seeker = 0;

        for (var h = startY; h < endY; h++) {
            for (var w = startX; w < endX; w++) {
                tempIndex = (world.getIndexAtCoords(w + (h % 2) / 2, h)); // gets the index of the tile to draw
                if(tempIndex != null){

                    tempScreens = world.getScreensAtCoords(w + (h % 2) / 2, h, this); // gets the locations to draw tiles on the canvas

                    // this searches the sorted array of visible indexes to see if the next needed one is present
                    if(user.empire.visableIndexes[seeker] > tempIndex){
                        while(user.empire.visableIndexes[seeker] > tempIndex && seeker > 0){
                            seeker -= 1;
                        }
                    } else {
                        while(user.empire.visableIndexes[seeker] < tempIndex && seeker < user.empire.visableIndexes.length - 1){
                            seeker += 1;
                        }
                    }

                    if(user.empire.visableIndexes[seeker] == tempIndex){
                        for(walker = 0; walker < this.actualImages[tempIndex].length; walker++){
                            tempImage = this.actualImages[tempIndex][walker]; // fetches the world image
                            if(tempImage != null){
                                canvasContext.drawImage(tempImage, tempScreens.x - Offset, tempScreens.y - Offset, Offset * 2, Offset * 2);
                            }
                        }
                    } else {
                        for(walker = 0; walker < this.visableImages[tempIndex].length; walker++){
                            tempImage = this.visableImages[tempIndex][walker]; // fetches the shroud image
                            if(tempImage != null){
                                canvasContext.drawImage(tempImage, tempScreens.x - Offset, tempScreens.y - Offset, Offset * 2, Offset * 2);
                            }
                        }
                    }
                }
            }
        }
    };

    // Camera moving functions
    this.snapTo = function(pixelX, pixelY, zoom){

        if (pixelX != null) {
            this.x = pixelX % world.pixelWidth;
        }
        if (pixelY != null) {
            this.y = pixelY;
        }
        if (zoom != null) {
            this.scale = zoom;
        }

        this.width = canvasWidth / this.scale; // size in game, not on screen
        this.height = canvasHeight / this.scale; // size in game, not on screen

        this.ULX = this.x - this.width / 2;
        this.ULY = this.y - this.height / 2;
        this.DRX = this.x + this.width / 2;
        this.DRY = this.y + this.height / 2;

        this.checkPosition();

    };
    this.panHorizontal = function(pixels){

        this.x += pixels / this.scale;
        this.snapTo(this.x, this.y);
        // this.callDraw();

    };
    this.panVertical = function(pixels){

        this.y -= pixels / this.scale;
        this.snapTo(this.x, this.y);
        // this.callDraw();

    };
    this.zoom = function(timesZoom, optFocusX, optFocusY){

        tempZoom = timesZoom;

        if (timesZoom < 1){
            tempZoom = Math.pow(timesZoom, (this.scale / this.minScale - 1) / (this.scale / this.minScale));
        } else {
            tempZoom = Math.pow(timesZoom, (this.maxScale / this.scale - 1) / (this.maxScale / this.scale));
        }

        tempX = this.x;
        tempY = this.y;

        if(optFocusX != null){
            tempX = optFocusX + (this.x - optFocusX) / tempZoom;
        }
        if(optFocusY != null){
            tempY = optFocusY + (this.y - optFocusY) / tempZoom;
        }

        this.snapTo(tempX, tempY, this.scale * tempZoom);
    };
    this.checkPosition = function(){

        if(this.x > world.pixelWidth * 2){
            this.snapTo(this.x % world.pixelWidth);
        }

        if(this.x < - world.pixelWidth * 2){
            this.snapTo(this.x % world.pixelWidth);
        }

        if(this.ULY < - world.tileSize / 2){
            this.snapTo(null, this.y - this.ULY - world.tileSize / 2);
        }

        if(this.DRY > world.tileSize * ((world.height - 1) * 0.75 + 0.5)){
            this.snapTo(null, this.y + world.tileSize * ((world.height - 1) * 0.75 + 0.5) - this.DRY);
        }

    }; // this will snap the camera around for wrapping and zooming over edges eventually

    this.setActualImage = function(optIndex){
        var start = 0;
        var end   = this.actualImages.length;
        if(optIndex != null){
            start = optIndex;
            end   = optIndex + 1;
        }
        for(var i = start; i < end; i++){
            this.actualImages[i] = this.processImage(world.tiles[i].image);
        }
        for(var j = start; j < end; j++){
            this.visableImages[j] = this.actualImages[j];
        }
    }
}
Camera.prototype.processImage = function(image) {
    switch(image) {
        case 13:
            return red;
            break;
        case 14:
            return redHills;
            break;
        case 15:
            return redMountains;
            break;
        case 12:
            return redValleys;
            break;
        case 11:
            return redRivers;
            break;

        case 23:
            return orange;
            break;
        case 24:
            return orangeHills;
            break;
        case 25:
            return orangeMountains;
            break;
        case 22:
            return orangeValleys;
            break;
        case 21:
            return orangeRivers;
            break;

        case 33:
            return yellow;
            break;
        case 34:
            return yellowHills;
            break;
        case 35:
            return yellowMountains;
            break;
        case 32:
            return yellowValleys;
            break;
        case 31:
            return yellowRivers;
            break;

        case 43:
            return green;
            break;
        case 44:
            return greenHills;
            break;
        case 45:
            return greenMountains;
            break;
        case 42:
            return greenValleys;
            break;
        case 41:
            return greenRivers;
            break;

        case 53:
            return blue;
            break;
        case 54:
            return blueHills;
            break;
        case 55:
            return blueMountains;
            break;
        case 52:
            return blueValleys;
            break;
        case 51:
            return blueRivers;
            break;

        case 63:
            return purple;
            break;
        case 64:
            return purpleHills;
            break;
        case 65:
            return purpleMountains;
            break;
        case 62:
            return purpleValleys;
            break;
        case 61:
            return purpleRivers;
            break;

        case 73:
            return graeymun;
            break;
        case 74:
            return graeymunHills;
            break;
        case 75:
            return graeymunMountains;
            break;
        case 72:
            return graeymunValleys;
            break;
        case 71:
            return graeymunRivers;
            break;

        case 91:
            return water;
            break;
        case 92:
            return water;
            break;
        case 93:
            return water;
            break;
        case 94:
            return water;
            break;
        case 97:
            return water;
            break;
        case 81:
            return deepWater;
            break;
        case 82:
            return deepWater;
            break;
        case 83:
            return deepWater;
            break;
        case 84:
            return deepWater;
            break;
        case 87:
            return deepWater;
            break;

        case -1:
            return document.getElementById("error"); //biome not assigned properly
            break;
        default:
            return document.getElementById("error"); //biome not assigned
    }
};

function InputListener(user) { // listens for input and calls functions on "user"

    var that = this; // yup...

    this.deltaKeys = []; // any keys that have changed state this frame
    this.keysDown  = []; // keeps an array of keys and their states
    for(var i = 0; i < 221; i++){this.keysDown[i] = false;}

    this.deltaMice = []; // any mouse buttons that have changed state this frame
    this.miceDown  = []; // also keeps an array of mouse buttons
    for(var j = 0; j < 3;   j++){this.keysDown[j] = false;}

    this.deltaWheels = [];

    this.mouseScreens = {x: null, y: null};

    // The Event Listeners, which update the inputListener's information between firings
    canvas.addEventListener("mousemove", function(e){that.setMouseState(e)}, false);
    this.setMouseState = function(event){
        this.mouseScreens = getMousePosition(canvas, event);
    };

    // mouse button listeners
    canvas.addEventListener("mousedown", function(e){that.setMice(e, true )});
    canvas.addEventListener("mouseup",   function(e){that.setMice(e, false)});
    this.setMice = function(event, isDown){
        this.miceDown[event.button] = isDown;
        this.deltaMice.push({button: event.button, isDown: isDown});
    };

    canvas.addEventListener("mousewheel", function(e){that.setRoll(e)});
    this.setRoll = function(event){
        this.deltaWheels.push(event.wheelDelta);
    };
    document.onmousewheel = function(){return false};

    // key listeners
    canvas.addEventListener("keydown",   function(e){that.setKeys(e, true )}, false);
    canvas.addEventListener("keyup",     function(e){that.setKeys(e, false)}, false);
    this.setKeys = function(event, isDown){
        this.keysDown[event.keyCode] = isDown;
        this.deltaKeys.push({keyCode: event.keyCode, isDown: isDown});
    };

    canvas.oncontextmenu = function(){return false;}; // this prevents context menus from appearing on the canvas

    // x times a second, the listener will prompt the user to acknowledge commands and update figures
    var calcDelay = 1000 / user.settings.FramesPerSecond;
    setInterval(function(){that.cycleCalcFrame(Date.now(), calcDelay)}, calcDelay);
    this.cycleCalcFrame = function(currentTime, delay){
        user.calcFrame(currentTime, delay, this);
        this.deltaMice   = [];
        this.deltaKeys   = [];
        this.deltaWheels = [];
    };

    // x times a turn, the listener will request that the user draw the next frame... the user processes this further
    var drawPacer = user.settings.recoveryAccelerator;
    var drawDelay = 1000 / user.settings.FramesPerSecond / drawPacer;
    setInterval(function(){that.cycleDrawFrame(Date.now(), drawDelay)}, drawDelay);
    this.cycleDrawFrame = function(currentTime, delay){
        user.drawFrame(currentTime, delay, drawPacer);
    };
}

function Empire(world, user){
    this.world = world;
    this.user = user;

    //this.gold += this.collectPlat();
    //this.food = this.collectFood();
    //this.industry = this.collectIndustry();
    //this.thought  = this.collectThought() ;
    this.visableIndexes = [];
    this.armies = [new Army(null, this), new Army(null, this), new Army(null, this)];


}
function Army(units, empire){

    this.world = empire.world;
    this.user = empire.user;
    this.empire = empire;
    this.camera = this.user.camera;

    this.visableSteps = [];

    this.movementAllowance = this.user.settings.movementAllowance; // temporary- will later be set from units
    this.location = Math.floor(Math.random() * this.world.length); // will later be given relative to other locations
    this.lable = armyNameCatalogue.splice(Math.floor(Math.random() * armyNameCatalogue.length), 1)[0];

    this.setLocation();

    //this.setMovementAllowance = function(){};
    //this.setVisionAllowance   = function(){};
}
Army.prototype.setVision = function(){

    for(var i = 0; i < this.visableSteps.length; i++){
        if(this.empire.visableIndexes.indexOf(this.visableSteps[i].index) >= 0){
            this.empire.visableIndexes.splice(this.empire.visableIndexes.indexOf(this.visableSteps[i].index), 1);
            this.camera.visableImages[this.visableSteps[i].index] = [this.camera.actualImages[this.visableSteps[i].index][0]];
            this.camera.visableImages[this.visableSteps[i].index][1] = document.getElementById("empireOverlay");
        }
    }

    this.visableSteps = this.world.pathfinder.pathfind(this.location, this.movementAllowance);

    for(i = 0; i < this.visableSteps.length; i++){
        this.empire.visableIndexes.push(this.visableSteps[i].index)
    }

};
Army.prototype.setLocation = function(optLocation){

    world.tiles[this.location].army = null;
    this.camera.actualImages[this.location][1] = null;

    if(optLocation != null){
        this.location = optLocation;
    }

    world.tiles[this.location].army = this;
    this.camera.actualImages[this.location][1] = document.getElementById("army");

    this.setVision();
};

function Unit(superClass, exp){

}
function City(empire){

    this.world = empire.world;
    this.user = empire.user;
    this.empire = empire;

    this.buildings = [];
    this.citizens = [];
}
function Building(){}
function Citizen(){}