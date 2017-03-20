// in order to a) appease twgl, b) work within security standards, and c) keep a slim html file,
// shaders are hard-loaded into the DOM here.

define(function(){

    var vertexId = "paper-vertex"; // vertexId: (ScriptId :: String)
    var fragmentId = "paper-fragment"; // fragmentId: (ScriptId :: String)

    var head = $("head");

    head.append("<script id='"+vertexId+"' type='sglsl'>\
        \
        uniform mat4 u_projection;\
        uniform vec3 u_lightAngle;\
        uniform vec3 u_viewPosition;\
        uniform vec4 u_materialTraits;\
        uniform vec4 u_lightColor;\
        \
        attribute vec3 a_position;\
        attribute vec3 a_normal;\
        attribute vec4 a_color;\
        \
        varying vec4 v_position;\
        varying vec3 v_normal;\
        varying vec3 v_lightAngle;\
        varying vec3 v_viewPosition;\
        varying vec3 v_vertPosition;\
        varying vec4 v_color;\
        varying vec4 v_lightColor;\
        \
        varying float v_ambient;\
        varying float v_diffuse;\
        varying float v_specular;\
        varying float v_sheen;\
        \
        void main() {\
        \
            v_lightColor = u_lightColor;\
            v_ambient = u_materialTraits[0];\
            v_diffuse = u_materialTraits[1];\
            v_specular = u_materialTraits[2];\
            v_sheen = u_materialTraits[3];\
            v_position = u_projection * vec4(a_position, 1.0);\
            v_normal   = a_normal;\
            v_lightAngle = u_lightAngle;\
            v_vertPosition = a_position;\
            v_viewPosition = u_viewPosition;\
            v_color = a_color;\
        \
            gl_Position = v_position;\
        }\
        </script>"
    );

    head.append("<script id='"+fragmentId+"' type='sglsl'>\
        precision mediump float;\
        \
        varying vec4 v_position;\
        varying vec3 v_normal;\
        varying vec3 v_lightAngle;\
        varying vec3 v_viewPosition;\
        varying vec3 v_vertPosition;\
        varying vec4 v_color;\
        varying vec4 v_lightColor;\
        varying float v_ambient;\
        varying float v_diffuse;\
        varying float v_specular;\
        varying float v_sheen;\
        \
        void main(){\
        \
        \
            vec3 viewAngle = normalize(v_viewPosition - v_vertPosition);\
        \
            float diff = v_diffuse * max(dot(v_normal, v_lightAngle), 0.0);\
            float amb = v_ambient * (v_diffuse + (1.0 - v_diffuse) * max(dot(v_normal, viewAngle), 0.0));\
        \
            float spec;\
            if(v_sheen == 1.0){\
                spec = v_specular * max(dot(viewAngle, normalize(-v_lightAngle - 2.0*dot(v_normal, -v_lightAngle)*v_normal)), 0.0);\
            } else {\
                spec = v_specular * pow(max(dot(viewAngle, normalize(-v_lightAngle - 2.0*dot(v_normal, -v_lightAngle)*v_normal)), 0.0), v_sheen);\
            }\
        \
            vec4 matteColor = (vec4(amb + diff, amb + diff, amb + diff, 1.0) * v_color);\
        \
            gl_FragColor = spec * (v_lightColor-matteColor) + matteColor;\
        }\
        </script>"
    );

    return {vertex: vertexId, fragment: fragmentId}; // : {vertex: (ScriptId :: String), fragment: (ScriptId :: String)}
});