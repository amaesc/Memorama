import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PS2Shader } from './PS2Shader';
import { CardItem, Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIGS } from '../../data/lovecraftCards';
import { createBeastModel } from './BeastModels3D';
import { Camera, Compass, Sparkles, Gamepad2 } from 'lucide-react';

interface MemoryScene3DProps {
  cards: CardItem[];
  difficulty: Difficulty;
  onCardClick: (card: CardItem) => void;
  disabled: boolean;
  isPS2Active: boolean;
  onTogglePS2: () => void;
}

interface Card3DInstance {
  group: THREE.Group;
  slab: THREE.Mesh;
  beastGroup: THREE.Group;
  instanceId: string;
  targetRotZ: number;
  currentRotZ: number;
  targetY: number;
  currentY: number;
  shakeTime: number;
}

export const MemoryScene3D: React.FC<MemoryScene3DProps> = ({
  cards,
  difficulty,
  onCardClick,
  disabled,
  isPS2Active,
  onTogglePS2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cardsMapRef = useRef<Map<string, Card3DInstance>>(new Map());
  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);
  const hoveredIdRef = useRef<string | null>(null);
  const disabledRef = useRef<boolean>(disabled);
  const onCardClickRef = useRef<(card: CardItem) => void>(onCardClick);
  const cardsRef = useRef<CardItem[]>(cards);
  const isPS2ActiveRef = useRef<boolean>(isPS2Active);
  const composerRef = useRef<EffectComposer | null>(null);
  const ps2PassRef = useRef<ShaderPass | null>(null);
  const animFrameRef = useRef<number>(0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  disabledRef.current = disabled;
  onCardClickRef.current = onCardClick;
  cardsRef.current = cards;
  isPS2ActiveRef.current = isPS2Active;

  // Primary 3D Scene Initialization
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

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

    // Scene - Luminous Lovecraftian Arcane Chamber
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071110);
    scene.fog = new THREE.FogExp2(0x071110, 0.022);

    // Subtle floating eldritch dust / cosmic embers in the background
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 26;
      particlePos[i * 3 + 1] = Math.random() * 10 - 1;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Subterranean cavern floor beneath the altar for depth and grounding
    const cavernFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshStandardMaterial({
        color: 0x050c0b,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    cavernFloor.rotation.x = -Math.PI / 2;
    cavernFloor.position.y = -0.9;
    cavernFloor.receiveShadow = !isSoftwareGl;
    scene.add(cavernFloor);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 8.5, 8.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // EffectComposer for PS2 Post-Processing Shader
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const ps2Pass = new ShaderPass(PS2Shader);
    ps2Pass.uniforms.resolution.value.set(
      Math.min(640, width),
      Math.min(448, height)
    );
    composer.addPass(ps2Pass);
    composerRef.current = composer;
    ps2PassRef.current = ps2Pass;

    // Comprehensive Lighting for Maximum Piece Visibility & Arcane Atmosphere
    const keyLight = new THREE.DirectionalLight(0xc6f6d5, 2.2);
    keyLight.position.set(6, 13, 7);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -7;
      keyLight.shadow.camera.right = 7;
      keyLight.shadow.camera.top = 7;
      keyLight.shadow.camera.bottom = -7;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    // Top-down altar direct light ensuring cards are brilliantly illuminated
    const altarDownLight = new THREE.DirectionalLight(0xa7f3d0, 1.2);
    altarDownLight.position.set(0, 12, 1);
    scene.add(altarDownLight);

    // High rear rim light - gives cards and pieces sharp edge definition against the table
    const rimLight = new THREE.DirectionalLight(0x6ee7b7, 1.3);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-6, 8, -4);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x28564a, 0x0a1815, 1.2);
    scene.add(hemiLight);

    // Central altar green arcane point light
    const altarCenterLight = new THREE.PointLight(0x34d399, 1.5, 15, 1.2);
    altarCenterLight.position.set(0, 2.2, 0);
    scene.add(altarCenterLight);

    // Cyclopean Altar (Ancient Carved Granite Table with Inscribed Runes)
    const altar = new THREE.Mesh(
      new THREE.BoxGeometry(11.4, 0.45, 9.4),
      new THREE.MeshStandardMaterial({
        color: 0x122221,
        roughness: 0.72,
        metalness: 0.18,
      })
    );
    altar.position.y = -0.22;
    altar.receiveShadow = !isSoftwareGl;
    scene.add(altar);

    // Inscribed Arcane Circles on Altar Surface
    const altarRuneMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    });
    const centerRing = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.26, 48), altarRuneMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.y = 0.012;
    const innerRing = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.25, 36), altarRuneMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.012;
    const outerRing = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.66, 64), altarRuneMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.012;
    scene.add(centerRing, innerRing, outerRing);

    // Glowing green perimeter rune borders
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
    });
    const rimN = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.03, 0.09), rimMat);
    rimN.position.set(0, 0.01, 4.66);
    const rimS = rimN.clone();
    rimS.position.set(0, 0.01, -4.66);
    const rimE = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 9.32), rimMat);
    rimE.position.set(5.71, 0.01, 0);
    const rimW = rimE.clone();
    rimW.position.set(-5.71, 0.01, 0);
    scene.add(rimN, rimS, rimE, rimW);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minPolarAngle = Math.PI / 8;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Build 3D Monolith Cards
    cardsMapRef.current.clear();
    clickableMeshesRef.current = [];

    const isHard = difficulty === 'hard';
    const cols = isHard ? 6 : 4;
    const currentCards = cardsRef.current;
    const rows = Math.ceil(currentCards.length / cols);

    const cardW = 1.35;
    const cardH = 1.75;
    const cardD = 0.1;
    const gapX = 0.35;
    const gapZ = 0.35;

    const totalW = cols * cardW + (cols - 1) * gapX;
    const totalZ = rows * cardH + (rows - 1) * gapZ;
    const startX = -totalW / 2 + cardW / 2;
    const startZ = -totalZ / 2 + cardH / 2;

    // Shared Materials for Card Slab and Runic Frame
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x22373b,
      roughness: 0.52,
      metalness: 0.3,
    });

    const cardBorderMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
    });

    currentCards.forEach((card, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const posX = startX + col * (cardW + gapX);
      const posZ = startZ + row * (cardH + gapZ);

      const group = new THREE.Group();
      group.position.set(posX, 0.05, posZ);

      // Stone Tablet Slab with distinct contrast
      const slabGeo = new THREE.BoxGeometry(cardW, cardD, cardH);
      const slab = new THREE.Mesh(slabGeo, stoneMat.clone());
      slab.castShadow = !isSoftwareGl;
      slab.receiveShadow = !isSoftwareGl;
      slab.userData.instanceId = card.instanceId;
      group.add(slab);

      // Tablet Edge Silhouette Lines for instant piece definition
      const edgeGeo = new THREE.EdgesGeometry(slabGeo);
      const edgeLine = new THREE.LineSegments(
        edgeGeo,
        new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55 })
      );
      group.add(edgeLine);

      // FACEDOWN SIDE (+Y): R'lyeh Occult Seal + Glowing Runic Border Frame
      const sealGroup = new THREE.Group();
      sealGroup.position.y = cardD / 2 + 0.005;

      // Ornate Runic Border Frame around card top face
      const borderThickness = 0.035;
      const bN = new THREE.Mesh(new THREE.BoxGeometry(cardW - 0.12, 0.008, borderThickness), cardBorderMat);
      bN.position.set(0, 0.002, cardH / 2 - 0.08);
      const bS = new THREE.Mesh(new THREE.BoxGeometry(cardW - 0.12, 0.008, borderThickness), cardBorderMat);
      bS.position.set(0, 0.002, -cardH / 2 + 0.08);
      const bW = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 0.008, cardH - 0.16), cardBorderMat);
      bW.position.set(-cardW / 2 + 0.07, 0.002, 0);
      const bE = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 0.008, cardH - 0.16), cardBorderMat);
      bE.position.set(cardW / 2 - 0.07, 0.002, 0);
      sealGroup.add(bN, bS, bW, bE);

      // 4 Corner Rune Gem Dots
      const cornerGeo = new THREE.BoxGeometry(0.06, 0.012, 0.06);
      [-1, 1].forEach((cx) => {
        [-1, 1].forEach((cz) => {
          const corner = new THREE.Mesh(cornerGeo, cardBorderMat);
          corner.position.set(cx * (cardW / 2 - 0.07), 0.004, cz * (cardH / 2 - 0.08));
          sealGroup.add(corner);
        });
      });

      const sealOuter = new THREE.Mesh(
        new THREE.RingGeometry(0.24, 0.38, 20),
        new THREE.MeshStandardMaterial({
          color: 0x6ee7b7,
          emissive: 0x10b981,
          emissiveIntensity: 1.0,
          side: THREE.DoubleSide,
        })
      );
      sealOuter.rotation.x = -Math.PI / 2;

      const sealPupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 1.1,
        })
      );
      sealPupil.scale.set(1, 0.25, 1);
      sealGroup.add(sealOuter, sealPupil);
      group.add(sealGroup);

      // FACEUP SIDE (-Y before flip, +Y after flip): Beast Dais & 3D Beast Model
      const daisGroup = new THREE.Group();
      daisGroup.position.y = -cardD / 2 - 0.005;

      const daisDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.02, 20),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(card.entity.color),
          emissive: new THREE.Color(card.entity.color),
          emissiveIntensity: 0.65,
          roughness: 0.35,
        })
      );
      daisGroup.add(daisDisc);

      // Rudimentary 3D Beast Model standing on the dais
      const beast = createBeastModel(card.entity.id);
      beast.position.set(0, -0.05, 0);
      beast.rotation.z = Math.PI; // Inverted so it stands upright when the tablet flips around Z
      daisGroup.add(beast);
      group.add(daisGroup);

      scene.add(group);
      clickableMeshesRef.current.push(slab);

      cardsMapRef.current.set(card.instanceId, {
        group,
        slab,
        beastGroup: beast,
        instanceId: card.instanceId,
        targetRotZ: card.isFlipped || card.isMatched ? Math.PI : 0,
        currentRotZ: card.isFlipped || card.isMatched ? Math.PI : 0,
        targetY: 0.05,
        currentY: 0.05,
        shakeTime: 0,
      });
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshesRef.current);

      if (intersects.length > 0) {
        hoveredIdRef.current = intersects[0].object.userData.instanceId;
        renderer.domElement.style.cursor = 'pointer';
      } else {
        hoveredIdRef.current = null;
        renderer.domElement.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (disabledRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshesRef.current);

      if (intersects.length > 0) {
        const id = intersects[0].object.userData.instanceId;
        const targetCard = cardsRef.current.find((c) => c.instanceId === id);
        if (targetCard && !targetCard.isFlipped && !targetCard.isMatched) {
          onCardClickRef.current(targetCard);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

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

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate background cosmic particles for mystical ambient motion
      particleField.rotation.y = elapsed * 0.02;
      particleField.position.y = Math.sin(elapsed * 0.5) * 0.15;

      // Animate card tablets
      cardsMapRef.current.forEach((instance) => {
        const matchingCard = cardsRef.current.find((c) => c.instanceId === instance.instanceId);
        const isHovered = hoveredIdRef.current === instance.instanceId;
        const isRevealed = matchingCard ? matchingCard.isFlipped || matchingCard.isMatched : false;

        // Target rotation Z (0 = facedown, PI = faceup beast standing)
        instance.targetRotZ = isRevealed ? Math.PI : 0;

        // Lift tablet when revealed or hovered
        instance.targetY = matchingCard?.isMatched
          ? 0.48 + Math.sin(elapsed * 2.5 + instance.instanceId.length) * 0.06
          : isRevealed
          ? 0.32
          : isHovered
          ? 0.2
          : 0.05;

        // Smooth damping
        instance.currentRotZ = THREE.MathUtils.damp(instance.currentRotZ, instance.targetRotZ, 12, delta);
        instance.group.rotation.z = instance.currentRotZ;

        instance.currentY = THREE.MathUtils.damp(instance.currentY, instance.targetY, 14, delta);
        instance.group.position.y = instance.currentY;

        // Mismatch shake
        if (matchingCard?.isMismatching) {
          instance.shakeTime += delta * 30;
          instance.group.rotation.x = Math.sin(instance.shakeTime) * 0.2;
        } else {
          instance.shakeTime = 0;
          instance.group.rotation.x = THREE.MathUtils.damp(instance.group.rotation.x, 0, 10, delta);
        }

        // Slow spin of 3D beast when revealed
        if (instance.beastGroup && isRevealed) {
          instance.beastGroup.rotation.y = elapsed * 0.6;
        }
      });

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
        // Pace CPU draw on software WebGL
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
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
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
  }, [difficulty]);

  // Update card state without rebuilding scene
  useEffect(() => {
    cards.forEach((card) => {
      const instance = cardsMapRef.current.get(card.instanceId);
      if (instance) {
        instance.targetRotZ = card.isFlipped || card.isMatched ? Math.PI : 0;
      }
    });
  }, [cards]);

  const setCameraPerspective = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 8.5, 8.2);
    controlsRef.current.target.set(0, 0, 0);
  };

  const setCameraTopDown = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 11.5, 0.1);
    controlsRef.current.target.set(0, 0, 0);
  };

  const setCameraLowAngle = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 4.5, 7.5);
    controlsRef.current.target.set(0, 0.4, 0);
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] md:h-[680px] rounded-xl overflow-hidden border border-[#24533e] bg-[#0a1816] shadow-[0_0_45px_rgba(16,185,129,0.12)]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Camera Controls Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#091114]/95 border border-[#1b3227] px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-2xl z-20">
        <div className="flex items-center gap-1.5 text-xs font-cinzel text-[#7e9e8f] mr-1 hidden sm:flex">
          <Camera className="w-3.5 h-3.5 text-[#34d399]" />
          <span>Ángulos de Visión:</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={setCameraPerspective}
            className="px-2.5 py-1 text-[11px] font-cinzel rounded-md bg-[#11211b] hover:bg-[#1a382c] border border-[#214737] text-[#e6ede8] transition-colors cursor-pointer"
          >
            Perspectiva
          </button>
          <button
            type="button"
            onClick={setCameraTopDown}
            className="px-2.5 py-1 text-[11px] font-cinzel rounded-md bg-[#11211b] hover:bg-[#1a382c] border border-[#214737] text-[#e6ede8] transition-colors cursor-pointer"
          >
            Cenital
          </button>
          <button
            type="button"
            onClick={setCameraLowAngle}
            className="px-2.5 py-1 text-[11px] font-cinzel rounded-md bg-[#11211b] hover:bg-[#1a382c] border border-[#214737] text-[#e6ede8] transition-colors cursor-pointer"
          >
            Rasante
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#1a2d24]" />

        {/* PS2 Retro Shader Toggle */}
        <button
          type="button"
          onClick={onTogglePS2}
          className={`px-2.5 py-1 text-[11px] font-cinzel rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
            isPS2Active
              ? 'bg-[#1b3a2e] border-[#34d399] text-[#e6ede8] font-bold shadow-[0_0_10px_rgba(52,211,153,0.3)]'
              : 'bg-[#11211b] hover:bg-[#1a382c] border-[#214737] text-[#8ca89a]'
          }`}
          title="Activar/desactivar shader retro PlayStation 2"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-[#34d399]" />
          <span>Shader PS2: <strong className={isPS2Active ? 'text-[#34d399]' : 'text-[#6b8277]'}>{isPS2Active ? 'ON' : 'OFF'}</strong></span>
        </button>

        <div className="h-4 w-[1px] bg-[#1a2d24] hidden sm:block" />

        <div className="text-[10px] text-[#5c7a6e] font-cinzel hidden md:flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#34d399]" />
          <span>Arrastra para orbitar el altar</span>
        </div>
      </div>
    </div>
  );
};
