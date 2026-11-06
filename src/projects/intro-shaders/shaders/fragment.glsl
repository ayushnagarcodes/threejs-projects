uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUV;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUV);
  textureColor.rgb *= vElevation * 2.0 + 0.9;

  gl_FragColor = textureColor;
}