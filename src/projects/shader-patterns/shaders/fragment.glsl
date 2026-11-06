varying vec2 vUV;

void main() {
  /* Pattern 1 */
  //   gl_FragColor = vec4(vUV, 1.0, 1.0);

  /* Pattern 2 */
  //   gl_FragColor = vec4(vUV, 0.0, 1.0);

  /* Pattern 3 */
  // Method A
  //   float strength = vUV.x;
  //   gl_FragColor = vec4(vec3(strength), 1.0);
  // Method B
  //   gl_FragColor = vec4(1.0, 1.0, 1.0, vUV.x);

  /* Pattern 4 */
  //   float strength = vUV.y;
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 5 */
  //   float strength = 1.0 - vUV.y;
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 6 */
  //   float strength = vUV.y * 10.0;
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 7 */
  // Method A
  //   float strength = abs(sin(vUV.y * 30.0));
  //   gl_FragColor = vec4(vec3(strength), 1.0);
  // Method B
  //   float strength = mod(vUV.y * 10.0, 1.0);
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 8 */
  // Method A - skip because of performance issues
  //   float strength = mod(vUV.y * 10.0, 1.0);
  //   strength = strength < 0.5 ? 0.0 : 1.0;
  //   gl_FragColor = vec4(vec3(strength), 1.0);
  // Method B
  //   float strength = mod(vUV.y * 10.0, 1.0);
  //   strength = step(0.5, strength);
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 9 */
  //   float strength = mod(vUV.y * 10.0, 1.0);
  //   strength = step(0.8, strength);
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 10 */
  //   float strength = mod(vUV.x * 10.0, 1.0);
  //   strength = step(0.8, strength);
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 11 */
  //   float strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  //   strength += step(0.8, mod(vUV.y * 10.0, 1.0));
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 12 */
  //   float strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  //   strength *= step(0.8, mod(vUV.y * 10.0, 1.0));
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 13 */
  //   float strength = step(0.4, mod(vUV.x * 10.0, 1.0));
  //   strength *= step(0.8, mod(vUV.y * 10.0, 1.0));
  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 14 */
  //   float barX = step(0.4, mod(vUV.x * 10.0, 1.0));
  //   barX *= step(0.8, mod(vUV.y * 10.0, 1.0));

  //   float barY = step(0.8, mod(vUV.x * 10.0, 1.0));
  //   barY *= step(0.4, mod(vUV.y * 10.0, 1.0));

  //   float strength = barX + barY;

  //   gl_FragColor = vec4(vec3(strength), 1.0);

  /* Pattern 15 */
  float barX = step(0.4, mod((vUV.x * 10.0) - 0.2, 1.0));
  barX *= step(0.8, mod(vUV.y * 10.0, 1.0));

  float barY = step(0.8, mod(vUV.x * 10.0, 1.0));
  barY *= step(0.4, mod((vUV.y * 10.0) - 0.2, 1.0));

  float strength = barX + barY;

  gl_FragColor = vec4(vec3(strength), 1.0);
}