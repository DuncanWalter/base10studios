/**
 * Created by Duncan on 3/8/2017.
 */
define(function(){
        return function(source, partitions){
            // create a new audio analyser node so that we can read the frequency data
            var analyser = new (window.AudioContext || window.webkitAudioContext)().createAnalyser();
            var byteFrequency = new Uint8Array(analyser.frequencyBinCount);


            var media, stream, node;
            if(source){
                media = new Audio(source);
                node = analyser.context.createMediaElementSource(media);
                node.connect(analyser);
                analyser.connect(analyser.context.destination);
                media.play();
            } else {
                navigator.mediaDevices.getUserMedia(
                    {audio: true, video: false}
                ).then(function(ambientSound){
                    node = analyser.context.createMediaStreamSource(ambientSound);
                    node.connect(analyser);
                    stream = ambientSound;
                });
            }




            var boundaries = [];
            for(;boundaries.length < partitions;){
                boundaries.push((1 + boundaries.length) * byteFrequency.length / partitions);
            }



            var paused = false;
            this.pause = function(){
                if(!paused && media){
                    paused = true;
                    media.pause();
                }
            };
            this.play = function(source){
                if(media){
                    if(!!source){
                        media.pause();
                        media.src = source;
                        media.load();
                    }
                    paused = false;
                    media.play();
                } else if (!!source){
                    node.disconnect(analyser);
                    media = new Audio(source);
                    node = analyser.context.createMediaElementSource(media);
                    node.connect(analyser);
                    analyser.connect(analyser.context.destination);
                    media.play();
                }
            };


            var k = 0.2; // degree of capacity to react to new distributions of sound.
            // captures a live snapshot of the frequency data
            this.poll = function(delta){
                if(!paused){
                    analyser.getByteFrequencyData(byteFrequency);
                }

                var length = byteFrequency.length;
                var volume = byteFrequency.reduce(function(accum, byte){
                    return accum + byte;
                }, 0);

                var bucket = -1;
                var sound = byteFrequency.reduce(function(sound, byte, index){
                    if(!sound[bucket] || index >= boundaries[bucket]){
                        sound.push([]);
                        sound[++bucket].volume = 0;
                    }
                    if(byte != 0){
                        sound[bucket].volume += byte;
                        sound[bucket].push(byte);
                    }
                    return sound;
                }, []);
                while(sound.length < partitions){
                    var emptyBucket = [];
                    emptyBucket.volume = 0;
                    sound.push(emptyBucket);
                }

                var l = 0, r = volume, diff, target;
                for(bucket = 0; bucket < partitions; bucket++){
                    r -= sound[bucket].volume;
                    l += sound[bucket].volume;
                    diff = (l * (partitions - bucket - 1) - r * (bucket + 1));
                    // use a scalar to compensate for bias created by the comparison method
                    diff /= ((bucket + 1) * (partitions - bucket - 1));
                    switch(true){
                        case diff < 0:
                            target = -diff / 2 / volume * length;
                            boundaries[bucket] += k * delta * target;
                            break;
                        case diff > 0:
                            target = -diff / 2 / volume * length;
                            boundaries[bucket] += k * delta * target;
                            break;
                        default:
                            break;
                    }
                }

                sound.volume = volume;
                sound.boundaries = boundaries;

                return sound;
            }

        }
    }
);




