#version 330 compatibility
uniform float uSharpFactor, uDs, uDt, uScenter, uTcenter, uMagFactor, uRotAngle;
uniform sampler2D uImageUnit;
in vec2 vST;

float	 ResS, ResT;


void main(){
	
	ivec2 ires = textureSize( uImageUnit, 0 );
	ResS = float( ires.s );
	ResT = float( ires.t );
	
	//vec3 rgb;
	float uSize = uDs *uDt;
	vec2 temp = vST;
	//vec2 delta = vST - vec2(uScenter,uTcenter);
	//vec2 rot =vST;
	
	
	//vec2 st = vST;
	//vec3 irgb = texture2D( uImageUnit,  st ).rgb;
	//vec3 brgb = texture2D( BeforeUnit, st ).rgb;
	//vec3 argb = texture2D( AfterUnit,  st ).rgb;
	vec4 color = vec4( 1., 0., 0., 1. );
	vec3 irgb = texture2D(uImageUnit, vST).rgb;
	#define SHARPNESS

	if(uScenter-uDs <= vST.s && vST.s <= uScenter+uDs && uTcenter-uDt <= vST.t && vST.t <= uTcenter+uDt){
		
		vec2 st = vST;
		
		st = st - vec2(uScenter, uTcenter);
		
		st /= uMagFactor;
			
		float delta_s = st.s*cos(uRotAngle) - st.t*sin(uRotAngle);
		float delta_t = st.s*sin(uRotAngle) + st.t*cos(uRotAngle);
		
		vec2 stp = vec2( dot(st, vec2(cos(uRotAngle), sin(uRotAngle))), dot(st, vec2(-sin(uRotAngle), cos(uRotAngle))));
		
		st = vec2(delta_s, delta_t);
		
		st = st + vec2(uScenter, uTcenter);
		irgb= texture2D( uImageUnit,  st ).rgb;
		
		
		ivec2 ires = textureSize( uImageUnit, 0 );
		ResS = float( ires.s );
		ResT = float( ires.t );
		
		vec2 stp0 = vec2(1./ResS,  0. );
		vec2 st0p = vec2(0.     ,  1./ResT);
		vec2 stpp = vec2(1./ResS,  1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		vec3 i00 =   texture2D( uImageUnit, st ).rgb;
		vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
		vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
		vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
		vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
		vec3 im10 =  texture2D( uImageUnit, st-stp0 ).rgb;
		vec3 ip10 =  texture2D( uImageUnit, st+stp0 ).rgb;
		vec3 i0m1 =  texture2D( uImageUnit, st-st0p ).rgb;
		vec3 i0p1 =  texture2D( uImageUnit, st+st0p ).rgb;
		vec3 target = vec3(0.,0.,0.);
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		color = vec4( mix( target, irgb, uSharpFactor ), 1. );
		
		gl_FragColor = color;
		
		
	}else{
		gl_FragColor = vec4(irgb, 1. );
	}
	}
