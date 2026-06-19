import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform vec3 u_glowColor;
uniform float u_padding;
uniform float u_cardRadius;
uniform float u_borderSizePx;
uniform float u_isSwiss;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

#ifndef VAR
#define VAR 0
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdRoundRectPx(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        float dpr = u_pixelRatio;
        float pad = u_padding * dpr;
        
        // Card size in physical pixels
        vec2 card_size = u_resolution.xy - 2.0 * pad;
        vec2 center = u_resolution.xy / 2.0;
        
        // Center the pixel coord
        vec2 p = gl_FragCoord.xy - center;
        vec2 half_size = card_size / 2.0;
        
        float r = u_cardRadius * dpr;
        
        // Mouse in WebGL pixels (Y coordinates are inverted in WebGL relative to client rect top-left)
        vec2 mouse_pixel = vec2(u_mouse.x, u_resolution.y / dpr - u_mouse.y) * dpr;
        float dist_to_mouse = length(gl_FragCoord.xy - mouse_pixel);
        
        // Glow radius & softness scaled by card diagonal
        float card_diagonal = length(card_size);
        float glow_radius = u_circleSize * card_diagonal;
        float glow_softness = u_circleEdge * card_diagonal * 0.5;
        
        float hover_mask = 1.0 - smoothstep(glow_radius - glow_softness, glow_radius + glow_softness, dist_to_mouse);
        hover_mask = clamp(hover_mask, 0.0, 1.0);
        
        if (u_isSwiss > 0.5) {
            // Shift shadow center to the bottom-right: 8px right (+X), 8px down (-Y)
            vec2 shadow_center = center + vec2(8.0 * dpr, -8.0 * dpr);
            vec2 p_shadow = gl_FragCoord.xy - shadow_center;
            float sdf_rect_shadow = sdRoundRectPx(p_shadow, half_size, r);
            
            // Dynamic blur radius and opacity based on hover intensity
            float blur_radius = mix(12.0 * dpr, 28.0 * dpr, hover_mask);
            float max_opacity = mix(0.45, 0.8, hover_mask);
            
            float shadow_val = 1.0 - smoothstep(0.0, blur_radius, sdf_rect_shadow);
            sdf = shadow_val * max_opacity;
            
            // Mask out anything inside the card boundary so it only shows outside the card
            float sdf_rect_original = sdRoundRectPx(p, half_size, r);
            float mask = smoothstep(-1.0 * dpr, 0.0, sdf_rect_original);
            sdf *= mask;
        } else {
            // Centered glowing border outline for other themes
            float border_w = u_borderSizePx * dpr;
            float sdf_rect = sdRoundRectPx(p, half_size, r);
            
            // Dynamic glow spread based on hover
            float max_glow_spread = 24.0 * dpr;
            float edge = hover_mask * max_glow_spread;
            
            sdf = strokeAA(sdf_rect, 0.0, border_w, edge);
            
            if (hover_mask > 0.0) {
                sdf = mix(sdf, sdf * 2.0, hover_mask);
            }
        }
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = u_glowColor;
    float alpha = sdf;
    gl_FragColor = vec4(color.rgb, alpha);
}
`;

const ShapeBlur = ({
  className = '',
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1.2,
  roundness = 0.4,
  borderSize = 0.05,
  circleSize = 0.3,
  circleEdge = 0.5,
  glowColor = '#ffffff',
  padding = 40,
  cardRadius = 24,
  borderSizePx = 2,
  theme = 'cream'
}) => {
  const mountRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let active = true;
    let animationFrameId;
    let time = 0,
      lastTime = 0;

    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    let w = 1,
      h = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';
    mount.appendChild(renderer.domElement);

    const geo = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: pixelRatioProp },
        u_shapeSize: { value: shapeSize },
        u_roundness: { value: roundness },
        u_borderSize: { value: borderSize },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_glowColor: { value: new THREE.Color(glowColor) },
        u_padding: { value: padding },
        u_cardRadius: { value: cardRadius },
        u_borderSizePx: { value: borderSizePx },
        u_isSwiss: { value: theme === 'swiss' ? 1.0 : 0.0 }
      },
      defines: { VAR: variation },
      transparent: true
    });

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const onPointerMove = e => {
      const rect = mount.getBoundingClientRect();
      vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    // Listen locally to parent instead of document for better card isolation, or keep document and restrict bounds
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      if (!active) return;
      w = mount.clientWidth;
      h = mount.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(w, h, 1);
      vResolution.set(w, h).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    const ro = new ResizeObserver(() => {
      if (!active) return;
      resize();
    });
    ro.observe(mount);

    const update = () => {
      if (!active) return;
      time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      ['x', 'y'].forEach(k => {
        vMouseDamp[k] = THREE.MathUtils.damp(vMouseDamp[k], vMouse[k], 8, dt);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      active = false;

      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('pointermove', onPointerMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [variation, pixelRatioProp, shapeSize, roundness, borderSize, circleSize, circleEdge, glowColor, padding, cardRadius, borderSizePx, theme]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default ShapeBlur;
