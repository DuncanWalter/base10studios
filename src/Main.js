
require([], function(){
    function cascade(e){
        // creates constant and encapsulated functions to allow parallel delays
        // takes a JQuery element set and an index
        var deferCascade = function(e, i){
            return function(){
                // indexes into the set to retrieve a single element
                var child = e.eq(i);
                child.css("animation", "cascade 0.75s ease-out");
                child.removeClass("cascade");
                cascade(child.children());
            }
        };
        for(var i = 0; i < e.length; i++){
            e.eq(i).addClass("cascade");
            setTimeout(deferCascade(e, i), Math.pow(i, 1.2) * 75);
        }
    }
    cascade($(".cascade"));

    // $(".TEN").click(function(){
        // var m = $("#mid");
        // m.css("flex", 0);
        // m.css("transition", "1.45s ease");
        // m.css("flex", "2");
        // // m.css("background", "#FA4D77");
        // m = $("#top-insert");
        // m.css("flex", 0);
        // m.css("transition", "1.45s ease");
        // m.css("flex", "2");
        // m.css("background", "#CA32CD");
        // m = $("#bot-insert");
        // m.css("flex", 0);
        // m.css("transition", "1.45s ease");
        // m.css("flex", "2");
        // m.css("background", "#3AfD77");
        // $(".TEN").css({
        //     // width: "100%",
        //     transition: "1.45s",
        //     height: "100%",
        //     left: "0",
        //     right: "0",
        //     top: "0",
        //     bottom: "0",
        //     flex: "2",
        //     border: "none"
        // }).css("border-radius", "0").css("opacity", "0");
    // });
});



