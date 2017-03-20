/**
 * Created by Duncan on 3/8/2017.
 */
define(function(){

    var vertexId = "plain-vertex"; // vertexId: (ScriptId :: String)
    var fragmentId = "plain-fragment"; // fragmentId: (ScriptId :: String)

    var head = $("head");

    head.append("<script id='"+vertexId+"' type='sglsl'>\
        \
        uniform mat4 u_projection;\
        \
        attribute vec3 a_position;\
        attribute vec4 a_color;\
        \
        varying vec4 v_color;\
        \
        void main() {\
        \
            v_color = a_color;\
            gl_Position = u_projection * vec4(a_position, 1.0);\
        \
        }\
        \
        </script>"
    );

    head.append("<script id='"+fragmentId+"' type='sglsl'>\
        precision mediump float;\
        \
        varying vec4 v_color;\
        \
        void main(){\
        \
            gl_FragColor = v_color;\
        }\
        \
        </script>"
    );

    return {vertex: vertexId, fragment: fragmentId}; // : {vertex: (ScriptId :: String), fragment: (ScriptId :: String)}
});