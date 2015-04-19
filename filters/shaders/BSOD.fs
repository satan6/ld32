precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform float time;
uniform sampler2D uSampler;

float noise(float seed){
	return fract(sin(seed * 12.9898) * 43758.5453);
}

void main(void) {
	vec4 orig = texture2D(uSampler, vTextureCoord);
	float grey = noise(time + vTextureCoord.x * 23.43 + vTextureCoord.y * 9.283 + time * vTextureCoord.x * 493.234);

	gl_FragColor = mix(orig, vec4(grey, grey, grey, 1.0), 0.2);
}