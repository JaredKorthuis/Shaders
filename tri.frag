#version 400 compatibility

in vec3 gNs;
in vec3 gLs;
in vec3 gEs;

uniform float uKa, uKd, uKs;
uniform float uShininess;
uniform vec4 uSpecularColor; // light color
uniform vec4 uColor; 

void main( ){
	
	//Begin computation of lighting stuff, first by getting default normals	
	vec3	Normal = normalize(gNs);
	vec3	Light = normalize(gLs);
	vec3	Eye = normalize(gEs);
	
	
	vec4 ambient = uKa * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * uColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. ){		// only do specular if the light can see the point
		// use the reflection-vector:
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	
	vec4 specular = uKs * s * uSpecularColor;
	
	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1. ); //
}
