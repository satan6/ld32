precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform vec2 playerPos;
uniform float time;
uniform sampler2D uSampler;

const float WIDTH = 1280.0;
const float HEIGHT = 720.0;

float noise(float seed){
	return fract(sin(seed * 12.9898) * 43758.5453);
}

void main(void) {
	vec2 pos = vec2(vTextureCoord.x * WIDTH, HEIGHT - vTextureCoord.y * HEIGHT);
	vec4 orig = texture2D(uSampler, vTextureCoord);
	float dist = distance(pos, playerPos);
	float near = 1.0 - dist / WIDTH;

	vec4 sum = vec4(0.0);
	float blur = dist / 1000.0 / WIDTH;

	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;
	sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;
	
	//sum = mix(sum, orig, 0.1 + near * near);



	float lightness = min(0.2 + (near * 1.6) * sum.r / 0.3 + (sum.r + sum.g + sum.b) / 5.0 * near, 1.1);

	sum = sum * lightness;

	float grey = noise(time * 17.3234 + vTextureCoord.x * 2.43 + vTextureCoord.y * 9.283 + vTextureCoord.x * time);
	sum = mix(sum, vec4(grey, grey, grey, 1.0), 0.04);

	gl_FragColor = vec4(sum.x, sum.y, sum.z, 1.0);
}