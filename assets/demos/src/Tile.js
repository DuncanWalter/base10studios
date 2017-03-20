/**
 * Created by Duncan on 2/21/2017.
 */
define(["lib/TWGL.min"],
    function(twgl){


        // tiles have a uniform mesh available for rendering
        var rt3 = Math.pow(3, 0.5);

        // Defining a single mesh containing all the points used by tiles
        Tile.mesh = (function(mesh){ // To simplify mesh creation, we process a human-friendly version
            return mesh.reduce(function(accumulator, point, index){
                var j = index * 6;
                accumulator[j++] = point;
                var temp = point;
                for(var i = 0; i < 5; i++){
                    temp = [
                        temp[0]*0.5 - temp[1]*0.5*rt3,
                        temp[0]*0.5*rt3 + temp[1]*0.5,
                        temp[2]
                    ];
                    accumulator[j++] = temp;
                }
                return accumulator;
            }, new Array(mesh.length * 6));
        })([ // The raw mesh to be processed by the function above
            [0, 1, 0],          // outer lip
            [0, 1, -1],
            [0, 0.85, 0],       // inner lip
            [-0.5 * 0.55, 0.55 * rt3 / 2, 0.1],    // raised inner lip
            [-0.5 * 0.55, 0.55 * rt3 / 2,-0.1],   // lowered inner lip
            [0, 0.5, 0],        // filler neutral
            [0, 0.5, 0.07],     // filler raised
            [0, 0.5, -0.07],    // filler lowered
            [0, 0, 0.1],        // cone
            [0, 0, 0.55],       // peak
            [0, 0, 0]           // center
        ]);
        var meshes = (function(meshes){
            function cycle(indexCluster){
                indexCluster.forEach(function(index, iterator){
                    indexCluster[iterator] = index-index%6+(index+1)%6;
                })
            }
            return meshes.map(function(mesh){
                var a = [];
                mesh.forEach(function(indexSet){
                    if(typeof a != typeof indexSet){
                        // un-grouped indices are assumed to be hard-coded, and are passed through
                        a.push(indexSet);
                    } else if(indexSet.length == 3) {
                        //
                        for(var i = 0; i < 6; i++){
                            a.push.apply(a, indexSet);
                            cycle(indexSet);
                        }
                    }
                });
                return a;
            });
        })([
            [
                0, 1, 2,
                0, 2, 3,
                0, 3, 4,
                0, 4, 5
            ],
            [
                0, 1, 2,
                0, 2, 3,
                0, 3, 4,
                0, 4, 5,
                [1, 0, 7],
                [8, 1, 7]
            ],
            [

                0, 1, 2,
                0, 2, 3,
                0, 3, 4,
                0, 4, 5,
                [1, 0, 7],
                [8, 1, 7]
                // [0, 1, 24],
                // [1, 25, 24],
                // // [12, 13, 24],
                // // [13, 25, 24],
                // 24, 25, 26,
                // 24, 26, 27,
                // 24, 27, 28,
                // 24, 28, 29,
                // [1, 0, 7],
                // [8, 1, 7]
            ],
            [
                0, 1, 2,
                0, 2, 3,
                0, 3, 4,
                0, 4, 5,
                [1, 0, 7],
                [8, 1, 7]
            ],
            [
                [0, 1, 12],
                [1, 13, 12],
                [12, 13, 18],
                [13, 19, 18],
                18, 19, 20,
                18, 20, 21,
                18, 21, 22,
                18, 22, 23,
                [1, 0, 7],
                [8, 1, 7]
            ],
            [
                [0, 1, 54],
                [1, 0, 7],
                [8, 1, 7]
            ]
        ]);


        // TODO calculate ALL the face normals once when the program loads...
        // TODO get arrays of arrays of indices by terrain type and of color by biome type
        function FaceNormals(mesh, indices){
            var pnt0, pnt1, pnt2;
            var vec1, vec2, vec3;
            var normals = new Array(indices.length);
            for(var i = 0; i < indices.length;){
                // grab the points described by the indices and the mesh
                pnt0 = mesh[indices[i++]];
                pnt1 = mesh[indices[i++]];
                pnt2 = mesh[indices[i++]];
                // calculate two of the vectors between the 3 points ...
                vec1 = [pnt1[0]-pnt0[0], pnt1[1]-pnt0[1], pnt1[2]-pnt0[2]];
                vec2 = [pnt2[0]-pnt0[0], pnt2[1]-pnt0[1], pnt2[2]-pnt0[2]];
                // ... and cross them to find an orthogonal vector
                vec3 = twgl.v3.normalize(twgl.v3.cross(vec1, vec2));
                normals[i - 3] = [vec3[0], vec3[1], vec3[2]];
                normals[i - 2] = normals[i - 3];
                normals[i - 1] = normals[i - 3];
            }
            return normals;
        }


        /*
        Tile :: (index: int, biome: (BiomeEnum :: int), elevation: (PerlinValue :: float)) -> {
            static mesh: float[];
            indices: int[];

            index: int,
            color: float[] | float.length == 4
        }
        */
        function Tile(index, biome, elevation){

            this.index = index;
            this.elevation = (biome==0) ? elevation * 0.15 - 0.2 : elevation * 0.23 + 0.25;
            if (biome==8) this.elevation += 0.15;


            // uses a grayscale color by biome
            var color = Math.min((4 + elevation*2) / 7, 1);

            switch(biome){
                case 1:
                    this.color = [0.82*color, 0.76*color, 0.46*color, 1.0];
                    break;
                case 2:
                    this.color = [0.58*color, 0.73*color, 0.49*color, 1.0];
                    break;
                case 3:
                    this.color = [0.15*color, 0.65*color, 0.07*color, 1.0];
                    break;
                case 4:
                    this.color = [0.47*color, 0.95*color, 0.55*color, 1.0];
                    break;
                case 5:
                    this.color = [0.85*color, 0.87*color, 0.90*color, 1.0];
                    break;
                case 6:
                    this.color = [1.15*color, 1.15*color, 1.2*color, 1.0];
                    break;
                case 7:
                    this.color = [0.97, 0.97, 1.0, 1.0];
                    break;
                default:
                    this.color = [color, color, color, 1.0];
            }




            if (biome==0) this.color = [
                0.40 + elevation * 0.15,
                0.60 + elevation * 0.15,
                0.80 + elevation * 0.15,
                1.0
            ];
            // sets indices based on terrain
            var terrain = (biome==0) ? 0 : Math.floor((2.5 * elevation) + 3.5);
            switch(terrain){
                case 0: // OCEAN
                    this.indices = meshes[0];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                case 1: // VALLEYS
                    this.indices = meshes[1];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                case 2: // LOWLANDS
                    this.indices = meshes[2];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                case 3: // FLATS
                    this.indices = meshes[3];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                case 4: // HILLS
                    this.indices = meshes[4];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                case 5: // MOUNTAINS
                    this.indices = meshes[5];
                    this.normals = FaceNormals(Tile.mesh, this.indices);
                    break;
                default: // UNDEFINED
                    throw "PANIC during tile instantiation- given terrain is not defined";
                    break;
            }
        }



        return Tile;
    }
);