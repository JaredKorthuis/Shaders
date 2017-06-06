#version 330 compatibility
uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC;
flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;
vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );
void
main( )
{
vec4 a_vertex = gl_Vertex;
a_vertex.z = uA * cos(uB*a_vertex.x) * cos(uC*a_vertex.y);

float dzdx = -uA *uB *sin(uB*a_vertex.x) * cos(uC*a_vertex.x);
float dzdy = -uA *uB *cos(uB*a_vertex.x) * sin(uC*a_vertex.y);

vec3 move_x = vec3(1,0,dzdx);
vec3 move_y = vec3(1,0,dzdy);
vec3 normal = normalize(cross(move_x,move_y));


vec4 ECposition = gl_ModelViewMatrix * a_vertex;
vNf = normalize( gl_NormalMatrix * normal ); // surface normal vector
vNs = vNf;
vLf = eyeLightPosition - ECposition.xyz; // vector from the point
vLs = vLf; // to the light position
vEf = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point
vEs = vEf ; // to the eye position
gl_Position = gl_ModelViewProjectionMatrix * a_vertex;
}