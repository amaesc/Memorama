import * as THREE from 'three';

/**
 * Authentic PlayStation 2 (Emotion Engine / Graphics Synthesizer) Post-Processing Shader.
 * Recreates:
 * - 480i / 448p virtual resolution rasterization
 * - 4x4 Bayer matrix ordered dithering (GS 16-bit color emulation)
 * - Color channel quantization (5-bit RGB555 / 6-bit RGB565)
 * - Composite video horizontal chroma bleed
 * - CRT scanlines and subtle phosphorescent vignette
 */

export const PS2Shader = {
  name: 'PS2Shader',
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(640, 448) },
    time: { value: 0 },
    enabled: { value: 1.0 },
    ditherIntensity: { value: 0.85 },
    colorDepth: { value: 32.0 }, // 32 steps = 5 bits per channel (PS2 RGB555)
    scanlineIntensity: { value: 0.28 },
    chromaBleed: { value: 0.65 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time;
    uniform float enabled;
    uniform float ditherIntensity;
    uniform float colorDepth;
    uniform float scanlineIntensity;
    uniform float chromaBleed;
    varying vec2 vUv;

    // 4x4 Bayer Dithering Matrix normalized (-0.5 to 0.5)
    float getBayerValue(vec2 pos) {
      int x = int(mod(pos.x, 4.0));
      int y = int(mod(pos.y, 4.0));
      int index = x + y * 4;

      if (index == 0) return -0.50;
      if (index == 1) return 0.00;
      if (index == 2) return -0.375;
      if (index == 3) return 0.125;
      if (index == 4) return 0.25;
      if (index == 5) return -0.25;
      if (index == 6) return 0.375;
      if (index == 7) return -0.125;
      if (index == 8) return -0.3125;
      if (index == 9) return 0.1875;
      if (index == 10) return -0.4375;
      if (index == 11) return 0.0625;
      if (index == 12) return 0.4375;
      if (index == 13) return -0.0625;
      if (index == 14) return 0.3125;
      return -0.1875;
    }

    void main() {
      if (enabled < 0.5) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }

      // 1. CRT slight curvature
      vec2 uv = vUv;
      vec2 cc = uv - 0.5;
      float dist = dot(cc, cc);
      uv = uv + cc * (dist * 0.04);

      // Edge cutoff for CRT frame
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.02, 0.03, 0.04, 1.0);
        return;
      }

      // 2. Downsampled Virtual PS2 Resolution (e.g. 512x448)
      vec2 targetRes = resolution;
      vec2 pixelatedUv = floor(uv * targetRes) / targetRes;

      // 3. Composite Cable Horizontal Chroma Bleed
      float bleedOffset = (1.0 / targetRes.x) * chromaBleed;
      float r = texture2D(tDiffuse, pixelatedUv + vec2(bleedOffset, 0.0)).r;
      float g = texture2D(tDiffuse, pixelatedUv).g;
      float b = texture2D(tDiffuse, pixelatedUv - vec2(bleedOffset, 0.0)).b;
      vec3 color = vec3(r, g, b);

      // Ambient illumination lift so dark details and pieces remain distinct
      color = color * 1.08 + vec3(0.02, 0.032, 0.028);

      // 4. PS2 Ordered Bayer Matrix Dithering
      vec2 screenPixel = floor(uv * targetRes);
      float dither = getBayerValue(screenPixel) * (1.0 / colorDepth) * ditherIntensity;
      color += vec3(dither);

      // 5. Quantize to 16-bit color depth (RGB555)
      color = floor(color * colorDepth + 0.5) / colorDepth;

      // 6. Scanlines (CRT 480i interlace lines) - softened so scene is not dimmed
      float scanline = sin(uv.y * targetRes.y * 3.14159) * 0.5 + 0.5;
      scanline = pow(scanline, 1.4);
      color *= mix(1.0, 0.90 + 0.10 * scanline, scanlineIntensity);

      // 7. CRT Vignette - gentle falloff that preserves piece visibility at borders
      float vig = 1.0 - dist * 0.35;
      vig = clamp(vig, 0.82, 1.0);
      color *= vig;

      // 8. Subtle retro green-tinted phosphorescence
      color = mix(color, color * vec3(0.96, 1.04, 0.98), 0.2);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
