/**
 * Created by Duncan on 5/29/2016.
 */


function RTSEngine(units){
    this.data = {
        aveVIT: null,
        aveHRD: null,
        aveSIZ: null,
        aveSPD: null,
        aveSTR: null,
        aveAGI: null,
        aveSKL: null,
        aveRNG: null,
        aveDLY: null,

        aveDUR: null,
        aveDPS: null,
        aveRAT: null,
        aveTAC: null,
        aveGRP: null,

        setVAL: 10
    };

    // common calculation and data functions
    this.clean = function(num, sigDigs, isFromDecimal){
        if(typeof num == typeof "hello"){
            return num;
        }
        if(num == null || typeof num != typeof 1 || isNaN(num)){
            return "--";
        }
        var sigs = sigDigs || 3;
        if(isFromDecimal){
            return num.toFixed(sigs);
        } else {
            if((parseFloat(num).toPrecision(sigs) + "").indexOf("e") == -1){
                return parseFloat(num).toPrecision(sigs);
            } else {
                return Math.round(parseFloat(num));
            }

        }
    };
    var harMean = function(numArray){
        var d = 0;
        var l = numArray.length;
        for (var i = 0; i < numArray.length; i++){
            if(numArray[i] == null){
                l -= 1;
            } else {
                d += 1 / numArray[i];
            }
        }
        return l / d;
    };
    var geoMean = function(numArray){
        var p = 1;
        var l = numArray.length;
        for (var i = 0; i < numArray.length; i++){
            if(numArray[i] == null){
                l -= 1;
            } else {
                p *= numArray[i];
            }

        }
        return Math.pow(p, 1 / l);
    };
    var artMean = function(numArray){
        var s = 0;
        var l = numArray.length;
        for (var i = 0; i < numArray.length; i++){
            if(numArray[i] == null){
                l -= 1;
            } else {
                s += numArray[i];
            }
        }
        return s / l;
    };
    // simple way to call functions over entire database
    var perUnit = function(operation, settings, results){
        var res = results || [];
        var n = units.length;
        for(var i = 0; i < n; i++){
            res[i] = operation(units[i], settings)
        }
        return res;
    };
    // a shortcut for finding DB trait attributes
    this.calcAve = function(trait, mean){
        if (mean == "HAR"){
            this.data["ave" + trait] = harMean(perUnit(function(u, d){return u[trait] || null}, this.data));
        } else if (mean == "GEO"){
            this.data["ave" + trait] = geoMean(perUnit(function(u, d){return u[trait] || null}, this.data));
        } else if (mean == "ART"){
            this.data["ave" + trait] = artMean(perUnit(function(u, d){return u[trait] || null}, this.data));
        } else {
            console.log("invalid mean type")
        }
    };
    this.calcDUR = function(){
        perUnit(function(u, e){
            if(!(u.VIT && u.AGI && u.HRD)){
                u.DUR = NaN;
                return;
            }
            var d = e.data;
            var dur = u.VIT;
            var blk = 1 - (d.aveSKL)/(d.aveSKL + u.AGI);
            var crt = (1 - blk) * (d.aveSKL)/(d.aveSKL + u.AGI + u.HRD);
            var hit = 1 - crt - blk;
            var ave = crt * d.aveSTR + hit * (d.aveSTR)/(d.aveSTR + u.HRD);
            u.DUR = (dur / ave + 0.5) * d.aveSTR;
        }, this);
    };
    this.calcDPS = function(){
        perUnit(function(u, e){
            if(!(u.SKL && u.STR && u.DLY)){
                u.DPS = NaN;
                return;
            }
            var d = e.data;
            var locBlk = 1 - (u.SKL)/(d.aveAGI + u.SKL);
            var refBlk = 1 - (d.aveSKL)/(d.aveAGI + d.aveSKL);
            var locCrt = (1 - locBlk) * (u.SKL)/(d.aveAGI + u.SKL + d.aveHRD);
            var refCrt = (1 - refBlk) * (d.aveSKL)/(d.aveAGI + d.aveSKL + d.aveHRD);
            var locHit = 1 - locCrt - locBlk;
            var refHit = 1 - refCrt - refBlk;
            u.DPS = u.STR / u.DLY * (locCrt + locHit * (u.STR)/(d.aveHRD + u.STR)) / (refCrt + refHit * (d.aveSTR)/(d.aveHRD + d.aveSTR));
        }, this);
    };
    this.calcRAT = function(){
        perUnit(function(u, e){
            var d = e.data;
            u.RAT = u.DUR / u.DPS;
            if (u.RAT == 0){
                u.RAT = NaN;
            }
        }, this);
    };
    this.calcTAC = function(){
        perUnit(function(u, e){
            var d = e.data;
            // TODO one of the magic equations
            var refDUR = Math.pow(u.DUR * u.DPS * d.aveRAT, 0.5);
            var refDPS = Math.pow(u.DUR * u.DPS / d.aveRAT, 0.5);
            var refRED = (u.DUR  - (d.aveRNG / u.SPD    + d.aveDLY) * refDPS) / u.DUR;
            var locRED = (refDUR - (u.RNG    / d.aveSPD + u.DLY)    * u.DPS) / refDUR;
            u.TAC = refRED / locRED;
        }, this);
    };
    this.calcGRP = function(){
        perUnit(function(u, e){
            var d = e.data;
            // TODO one of the magic equations
            var locEff = (u.RNG / u.SIZ * 1.27 + 1) / u.SIZ * u.SPD * Math.pow(u.DUR * u.DPS * u.TAC, 0.5);
            var refEff = (d.aveRNG / d.aveSIZ * 1.27 + 1) / d.aveSIZ * d.aveSPD * Math.pow(d.aveDUR * d.aveDPS * d.aveTAC, 0.5);
            u.GRP = locEff / refEff;
        }, this);
    };
    this.calcVAL = function(){
        perUnit(function(u, e){
            var d = e.data;
            u.VAL = d.setVAL * Math.pow(u.DUR * u.DPS * u.TAC * u.GRP, 0.5)
        }, this);
    };
    (function(e){
        //initialization steps
        e.calcAve("VIT", "HAR");
        e.calcAve("STR", "HAR");
        e.calcAve("SIZ", "HAR");
        e.calcAve("SPD", "ART");
        e.calcAve("HRD", "HAR");
        e.calcAve("AGI", "HAR");
        e.calcAve("SKL", "HAR");
        e.calcAve("DLY", "HAR");
        e.calcAve("RNG", "ART");
        e.calcDUR();
        e.calcAve("DUR", "HAR");
        e.calcDPS();
        e.calcAve("DPS", "HAR");
        e.calcRAT();
        e.calcAve("RAT", "GEO");
        e.calcTAC();
        e.calcAve("TAC", "GEO");
        e.calcGRP();
        e.calcAve("GRP", "GEO");
        e.calcVAL();
        //initialization steps
    })(this);
}
//noinspection JSUnresolvedFunction
var D = angular.module('D', []);
D.controller('C', function($scope){
    $scope.units = [
        {NAM: "Lng", VIT: 10,  HRD: 4,  STR: 5,  AGI: 5, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
        {NAM: "Rch", VIT: 40, HRD: 13, STR: 16,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
        {NAM: "Hyd", VIT: 25, HRD: 5,  STR: 12,  AGI: 5, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
        {NAM: "Ult", VIT: 170, HRD: 15, STR: 18, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9},
        {NAM: "Lng",  VIT: 7,  HRD: 2,  STR: 5,  AGI: 7, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
        {NAM: "Rch",  VIT: 16, HRD: 10, STR: 7,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
        {NAM: "Hyd",  VIT: 13, HRD: 3,  STR: 5,  AGI: 4, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
        {NAM: "Ult",  VIT: 45, HRD: 15, STR: 17, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9},
        {NAM: "Lng",  VIT: 7,  HRD: 2,  STR: 5,  AGI: 7, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
        {NAM: "Rch",  VIT: 16, HRD: 10, STR: 7,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
        {NAM: "Hyd",  VIT: 13, HRD: 3,  STR: 5,  AGI: 4, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
        {NAM: "Ult",  VIT: 45, HRD: 15, STR: 17, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9}
    ];
    $scope.traits = [
        "NAM",
        "VIT",
        "HRD",
        "SIZ",
        "SPD",
        "AGI",
        "STR",
        "SKL",
        "RNG",
        "DLY",
        "DUR",
        "DPS",
        "RAT",
        "TAC",
        "GRP",
        "VAL"
    ];
    $scope.engine = new RTSEngine($scope.units);
    console.dir($scope);
    setTimeout(function(){
        var d = $scope.units;
        d[1].STR = 100;
        d[2].VIT = 37;
        d[3].SKL = 43;
        console.dir("changed");
    }, 3000)
});