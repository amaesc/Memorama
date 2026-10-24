import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PS2Shader } from './PS2Shader';
import { createBeastModel } from './BeastModels3D';
import { MythosEntity } from '../../types/game';
import { X, Rotate3d, Compass, Gamepad2 } from 'lucide-react';

interface ModelViewer3DProps {
  entity: MythosEntity | null;
  isOpen: boolean;
  onClose: () => void;
  defaultPS2?: boolean;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  entity,
  isOpen,
  onClose,
  defaultPS2 = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isPS2Active, setIsPS2Active] = useState<boolean>(defaultPS2);
  const isPS2ActiveRef = useRef<boolean>(defaultPS2);
  const composerRef = useRef<EffectComposer | null>(null);
  const ps2PassRef = useRef<ShaderPass | null>(null);

  useEffect(() => {
    isPS2ActiveRef.current = isPS2Active;
    if (ps2PassRef.current) {
      ps2PassRef.current.uniforms.enabled.value = isPS2Active ? 1.0 : 0.0;
    }
  }, [isPS2Active]);

  useEffect(() => {
    if (!isOpen || !entity || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 450;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1816);
    scene.fog = new THREE.FogExp2(0x0a1816, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2, 1.8, 2.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // EffectComposer for PS2 Post-Processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const ps2Pass = new ShaderPass(PS2Shader);
    ps2Pass.uniforms.resolution.value.set(
      Math.min(640, width),
      Math.min(448, height)
    );
    ps2Pass.uniforms.enabled.value = isPS2ActiveRef.current ? 1.0 : 0.0;
    composer.addPass(ps2Pass);
    ps2PassRef.current = ps2Pass;
    composerRef.current = composer;

    // Studio Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    pmrem.dispose();

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xc6f6d5, 2.5);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6ee7b7, 1.4);
    rimLight.position.set(-2, 4, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x326e5e, 0x112722, 1.4);
    scene.add(hemiLight);

    // Stone Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.15, 24),
      new THREE.MeshStandardMaterial({
        color: 0x172b2a,
        roughness: 0.7,
        metalness: 0.2,
      })
    );
    pedestal.position.y = -0.075;
    scene.add(pedestal);

    // Runic ring on pedestal
    const runeRing = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.85, 32),
      new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
      })
    );
    runeRing.rotation.x = -Math.PI / 2;
    runeRing.position.y = 0.002;
    scene.add(runeRing);

    // Beast 3D Model
    const beast = createBeastModel(entity.id);
    // Scale up slightly for solo viewer inspection
    beast.scale.set(1.2, 1.2, 1.2);
    scene.add(beast);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 6;
    controls.target.set(0, 0.6, 0);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      if (ps2PassRef.current) {
        ps2PassRef.current.uniforms.resolution.value.set(
          Math.min(640, w),
          Math.min(448, h)
        );
      }
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Subtle breathing float and slow rotation
      beast.rotation.y = elapsed * 0.35;
      beast.position.y = Math.sin(elapsed * 1.5) * 0.04;

      if (ps2PassRef.current) {
        ps2PassRef.current.uniforms.time.value = elapsed;
        ps2PassRef.current.uniforms.enabled.value = isPS2ActiveRef.current ? 1.0 : 0.0;
      }

      controls.update();

      if (isPS2ActiveRef.current && composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            animFrameRef.current = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            animFrameRef.current = window.setTimeout(animate, 60);
          }
        };
        animFrameRef.current = window.setTimeout(poll, 5);
      } else {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        clearTimeout(animFrameRef.current);
      }
      controls.dispose();
      composer.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, entity]);

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090f12] border-2 border-[#224436] rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1b3127] bg-[#060a0c]">
          <div className="flex items-center gap-2">
            <Rotate3d className="w-5 h-5 text-[#34d399]" />
            <div>
              <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#789e8e] block">
                Visualizador Arcano 3D
              </span>
              <h3 className="font-cinzel text-base font-bold text-[#e6ede8]">
                {entity.name} · <span className="text-xs font-normal" style={{ color: entity.color }}>{entity.title}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PS2 Shader Toggle */}
            <button
              type="button"
              onClick={() => setIsPS2Active((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-cinzel rounded-lg border transition-colors cursor-pointer ${
                isPS2Active
                  ? 'bg-[#183427] border-[#34d399] text-[#eefcf4] shadow-[0_0_10px_rgba(52,211,153,0.3)] font-bold'
                  : 'bg-[#0c1417] border-[#1d3328] text-[#8ca89a] hover:text-[#e4efe9]'
              }`}
              title="Alternar filtro PlayStation 2 (Dithering & CRT Scanlines)"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#34d399]" />
              <span>PS2: <strong>{isPS2Active ? 'ON' : 'OFF'}</strong></span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6f8a7e] hover:text-[#e6ede8] hover:bg-[#14231d] transition-colors cursor-pointer"
              aria-label="Cerrar visor 3D"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Viewport container */}
        <div className="relative w-full h-[400px] sm:h-[450px]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Interaction hint overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#091114]/90 border border-[#1b3127] px-3.5 py-1.5 rounded-full text-[11px] font-cinzel text-[#8aa99c] flex items-center gap-2 pointer-events-none backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Arrastra para rotar · Rueda para hacer zoom</span>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="px-6 py-3 border-t border-[#1b3127] bg-[#060a0c] text-xs text-[#a0b8ad] italic font-serif text-center">
          "{entity.quote}"
        </div>
      </div>
    </div>
  );
};
