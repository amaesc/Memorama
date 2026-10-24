import * as THREE from 'three';

/**
 * Procedural 3D multi-part composite models for Lovecraftian entities.
 * Follows threejs skill directives:
 * - 3 to 12 distinct composite parts per model (Group)
 * - Varied roughness, metalness, and procedural geometries
 * - Zero external file dependencies (100% procedural)
 */

export function createBeastModel(entityId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `beast_${entityId}`;

  switch (entityId) {
    case 'cthulhu': {
      // 1. Torso/Upper Body
      const bodyGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.8, 12);
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0x1b4332,
        roughness: 0.65,
        metalness: 0.15,
      });
      const body = new THREE.Mesh(bodyGeo, skinMat);
      body.position.y = 0.4;
      group.add(body);

      // 2. Head (Bulbous cephalopoid dome)
      const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
      headGeo.scale(1, 1.25, 1);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 0.95;
      group.add(head);

      // 3. Piercing alien eyes (Cluster of glowing yellow/orange eyes)
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.16, 1.05, 0.35);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.16, 1.05, 0.35);
      const centerEye = new THREE.Mesh(eyeGeo, eyeMat);
      centerEye.position.set(0, 1.15, 0.38);
      group.add(leftEye, rightEye, centerEye);

      // 4. Writhing Tentacles (6 distinct curved tentacles from jaw)
      const tentacleMat = new THREE.MeshStandardMaterial({
        color: 0x2d6a4f,
        roughness: 0.5,
        metalness: 0.2,
      });
      for (let i = 0; i < 6; i++) {
        const angle = -0.6 + i * 0.24;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(angle * 0.3, 0.75, 0.35),
          new THREE.Vector3(angle * 0.45, 0.5, 0.5 + Math.sin(i) * 0.08),
          new THREE.Vector3(angle * 0.3 + (i % 2 === 0 ? 0.1 : -0.1), 0.2, 0.65),
          new THREE.Vector3(angle * 0.2, 0.05, 0.5),
        ]);
        const tentacleGeo = new THREE.TubeGeometry(curve, 12, 0.045 - i * 0.003, 6, false);
        const tentacle = new THREE.Mesh(tentacleGeo, tentacleMat);
        group.add(tentacle);
      }

      // 5. Wings (Dragon/bat membranous wings on back)
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x0f2b20,
        roughness: 0.8,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const leftWingGeo = new THREE.ConeGeometry(0.45, 0.9, 4);
      leftWingGeo.scale(0.15, 1, 0.8);
      const leftWing = new THREE.Mesh(leftWingGeo, wingMat);
      leftWing.position.set(-0.45, 0.8, -0.2);
      leftWing.rotation.set(0.2, 0.4, 0.6);

      const rightWing = leftWing.clone();
      rightWing.position.set(0.45, 0.8, -0.2);
      rightWing.rotation.set(0.2, -0.4, -0.6);
      group.add(leftWing, rightWing);
      break;
    }

    case 'nyarlathotep': {
      // Shifting multi-faced shadowy avatar / pharaoh monolith
      const bodyGeo = new THREE.CylinderGeometry(0.12, 0.35, 1.3, 8);
      const shadowMat = new THREE.MeshStandardMaterial({
        color: 0x1f1629,
        roughness: 0.4,
        metalness: 0.6,
      });
      const body = new THREE.Mesh(bodyGeo, shadowMat);
      body.position.y = 0.65;
      group.add(body);

      // Mask / Face plate
      const maskGeo = new THREE.BoxGeometry(0.28, 0.4, 0.2);
      const maskMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mask = new THREE.Mesh(maskGeo, maskMat);
      mask.position.set(0, 1.25, 0.1);
      mask.rotation.x = 0.1;
      group.add(mask);

      // Shifting crown spikes / horns of chaos
      for (let i = 0; i < 5; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.04, 0.4, 4);
        const spike = new THREE.Mesh(spikeGeo, shadowMat);
        const angle = -0.5 + i * 0.25;
        spike.position.set(angle * 0.5, 1.5, 0.05);
        spike.rotation.z = -angle * 0.6;
        group.add(spike);
      }

      // Floating arcane ring of chaos
      const ringGeo = new THREE.TorusGeometry(0.45, 0.02, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0.8, 0);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      break;
    }

    case 'yog_sothoth': {
      // Central dimensional sphere
      const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.4,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.7;
      group.add(core);

      // Cluster of 8 orbiting spheres (The iridescent spheres of the gate)
      const orbColors = [0x7dd3fc, 0x38bdf8, 0x818cf8, 0x60a5fa];
      for (let i = 0; i < 8; i++) {
        const phi = (i / 8) * Math.PI * 2;
        const radius = 0.55 + (i % 3) * 0.1;
        const orbGeo = new THREE.SphereGeometry(0.12 + (i % 2) * 0.04, 12, 12);
        const orbMat = new THREE.MeshStandardMaterial({
          color: orbColors[i % orbColors.length],
          emissive: orbColors[i % orbColors.length],
          emissiveIntensity: 0.5,
          roughness: 0.3,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
          Math.cos(phi) * radius,
          0.7 + Math.sin(i * 1.5) * 0.25,
          Math.sin(phi) * radius
        );
        group.add(orb);
      }

      // Dimensional Keyhole Gate Frame
      const gateGeo = new THREE.TorusGeometry(0.65, 0.03, 8, 32);
      const gateMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.9,
        roughness: 0.1,
      });
      const gate = new THREE.Mesh(gateGeo, gateMat);
      gate.position.y = 0.7;
      group.add(gate);
      break;
    }

    case 'shub_niggurath': {
      // Dark monolith torso
      const trunkGeo = new THREE.ConeGeometry(0.4, 0.9, 8);
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x24160d,
        roughness: 0.9,
        metalness: 0.1,
      });
      const trunk = new THREE.Mesh(trunkGeo, woodMat);
      trunk.position.y = 0.45;
      group.add(trunk);

      // Goat skull head
      const skullGeo = new THREE.BoxGeometry(0.3, 0.35, 0.45);
      const skullMat = new THREE.MeshStandardMaterial({
        color: 0x3d2719,
        roughness: 0.7,
      });
      const skull = new THREE.Mesh(skullGeo, skullMat);
      skull.position.set(0, 0.95, 0.15);
      group.add(skull);

      // Spiral horns (Left & Right)
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.4,
        metalness: 0.3,
      });
      for (const side of [-1, 1]) {
        const hornCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.12, 1.1, 0.1),
          new THREE.Vector3(side * 0.35, 1.35, 0),
          new THREE.Vector3(side * 0.48, 1.2, -0.2),
          new THREE.Vector3(side * 0.35, 1.0, -0.3),
        ]);
        const hornGeo = new THREE.TubeGeometry(hornCurve, 16, 0.05, 6, false);
        const horn = new THREE.Mesh(hornGeo, hornMat);
        group.add(horn);
      }

      // Root tentacle legs
      for (let i = 0; i < 5; i++) {
        const legCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(i) * 0.25, 0.2, Math.sin(i) * 0.25),
          new THREE.Vector3(Math.cos(i) * 0.4, 0.05, Math.sin(i) * 0.4),
        ]);
        const legGeo = new THREE.TubeGeometry(legCurve, 6, 0.04, 5, false);
        const leg = new THREE.Mesh(legGeo, woodMat);
        group.add(leg);
      }
      break;
    }

    case 'azathoth': {
      // Nuclear Chaos Core
      const coreGeo = new THREE.IcosahedronGeometry(0.38, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.7;
      group.add(core);

      // Cosmic Radiation Rings
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 0.7,
      });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.02, 6, 24), ringMat);
      ring1.position.y = 0.7;
      ring1.rotation.x = Math.PI / 3;

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.02, 6, 24), ringMat);
      ring2.position.y = 0.7;
      ring2.rotation.y = Math.PI / 4;
      ring2.rotation.z = Math.PI / 3;
      group.add(ring1, ring2);

      // Spikes / chaotic energy flares
      for (let i = 0; i < 10; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.04, 0.35, 4);
        const spike = new THREE.Mesh(spikeGeo, coreMat);
        spike.position.set(
          Math.sin(i * 1.2) * 0.45,
          0.7 + Math.cos(i * 1.5) * 0.35,
          Math.sin(i * 2) * 0.45
        );
        spike.lookAt(new THREE.Vector3(0, 0.7, 0));
        spike.rotateX(Math.PI);
        group.add(spike);
      }
      break;
    }

    case 'necronomicon': {
      // Ancient grimoire volume
      const coverGeo = new THREE.BoxGeometry(0.65, 0.16, 0.85);
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x2b1c11, // Leather skin
        roughness: 0.8,
        metalness: 0.1,
      });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      cover.position.y = 0.35;
      group.add(cover);

      // Yellowed aged pages
      const pagesGeo = new THREE.BoxGeometry(0.6, 0.12, 0.8);
      const pagesMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.9,
      });
      const pages = new THREE.Mesh(pagesGeo, pagesMat);
      pages.position.set(0.02, 0.35, 0);
      group.add(pages);

      // Occult Eye embedded on the cover
      const eyeWhite = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2 })
      );
      eyeWhite.scale.set(1, 0.3, 1);
      eyeWhite.position.set(0, 0.45, 0.05);

      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.1 })
      );
      pupil.position.set(0, 0.48, 0.05);
      group.add(eyeWhite, pupil);

      // Corner metal hinges
      const hingeMat = new THREE.MeshStandardMaterial({ color: 0x78716c, metalness: 0.8 });
      for (const sx of [-0.3, 0.3]) {
        for (const sz of [-0.4, 0.4]) {
          const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), hingeMat);
          hinge.position.set(sx, 0.35, sz);
          group.add(hinge);
        }
      }
      break;
    }

    case 'dagon': {
      // Abyssal fish-leviathan monolith
      const bodyGeo = new THREE.CapsuleGeometry(0.3, 0.8, 8, 16);
      const scaleMat = new THREE.MeshStandardMaterial({
        color: 0x0e7490,
        roughness: 0.3,
        metalness: 0.4,
      });
      const body = new THREE.Mesh(bodyGeo, scaleMat);
      body.position.y = 0.65;
      body.rotation.x = Math.PI / 2.5;
      group.add(body);

      // Dorsal Fin
      const finGeo = new THREE.ConeGeometry(0.1, 0.5, 3);
      finGeo.scale(0.1, 1, 1);
      const fin = new THREE.Mesh(finGeo, scaleMat);
      fin.position.set(0, 0.95, -0.15);
      fin.rotation.x = -0.5;
      group.add(fin);

      // Fish bulbous eyes
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.6,
      });
      const le = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
      le.position.set(-0.25, 0.8, 0.3);
      const re = le.clone();
      re.position.set(0.25, 0.8, 0.3);
      group.add(le, re);

      // Ocean monolith pedestal
      const rockGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.3, 6);
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x15232d, roughness: 0.9 });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.y = 0.15;
      group.add(rock);
      break;
    }

    case 'elder_sign': {
      // 3D Stone Star Talisman
      const starGroup = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x22543d,
        roughness: 0.5,
        metalness: 0.3,
      });
      for (let i = 0; i < 5; i++) {
        const branchGeo = new THREE.ConeGeometry(0.12, 0.65, 4);
        const branch = new THREE.Mesh(branchGeo, stoneMat);
        branch.position.y = 0.32;
        const branchGroup = new THREE.Group();
        branchGroup.rotation.z = (i * Math.PI * 2) / 5;
        branchGroup.add(branch);
        starGroup.add(branchGroup);
      }
      starGroup.position.y = 0.7;
      group.add(starGroup);

      // Central glowing emerald eye
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        emissive: 0x22c55e,
        emissiveIntensity: 0.9,
      });
      const eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), eyeMat);
      eyeMesh.position.set(0, 0.7, 0.08);
      group.add(eyeMesh);
      break;
    }

    case 'tindalos': {
      // Non-Euclidean angular predator (built entirely from sharp tetrahedrons & prisms)
      const angularMat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.2,
        metalness: 0.8,
      });
      const core = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4), angularMat);
      core.position.y = 0.7;
      group.add(core);

      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 3), angularMat);
        spike.position.set(Math.cos(i * 1.5) * 0.35, 0.7 + Math.sin(i * 1.5) * 0.3, 0);
        spike.rotation.z = i * 1.2;
        group.add(spike);
      }
      break;
    }

    case 'migo': {
      // Extraterrestrial spore fungal crustacean
      const sporeGeo = new THREE.SphereGeometry(0.3, 12, 12);
      sporeGeo.scale(1, 1.4, 0.8);
      const fungiMat = new THREE.MeshStandardMaterial({
        color: 0x9333ea,
        roughness: 0.6,
      });
      const spore = new THREE.Mesh(sporeGeo, fungiMat);
      spore.position.y = 0.75;
      group.add(spore);

      // Sensor antennas
      for (let i = 0; i < 6; i++) {
        const antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.25),
          new THREE.MeshStandardMaterial({ color: 0xd8b4fe, emissive: 0xa855f7 })
        );
        antenna.position.set(
          Math.sin(i) * 0.2,
          1.15,
          Math.cos(i) * 0.15
        );
        antenna.rotation.x = 0.3 * Math.sin(i);
        antenna.rotation.z = 0.3 * Math.cos(i);
        group.add(antenna);
      }

      // Membranous wings
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x7e22ce,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const lw = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), wingMat);
      lw.position.set(-0.35, 0.75, 0);
      lw.rotation.y = 0.5;
      const rw = lw.clone();
      rw.position.set(0.35, 0.75, 0);
      rw.rotation.y = -0.5;
      group.add(lw, rw);
      break;
    }

    case 'trapezohedron': {
      // Shining Trapezohedron faceted jewel
      const gemGeo = new THREE.DodecahedronGeometry(0.42);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x4338ca,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.y = 0.7;
      group.add(gem);

      // Golden cage brackets
      const cageMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.95,
      });
      const cage = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 6, 24), cageMat);
      cage.position.y = 0.7;
      group.add(cage);
      break;
    }

    case 'relic':
    default: {
      // Cyclopean Soapstone Idol of R'lyeh
      const baseGeo = new THREE.BoxGeometry(0.5, 0.15, 0.5);
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x1b4332,
        roughness: 0.7,
        metalness: 0.2,
      });
      const base = new THREE.Mesh(baseGeo, stoneMat);
      base.position.y = 0.1;
      group.add(base);

      // Carved idol figure
      const idolGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.7, 8);
      const idol = new THREE.Mesh(idolGeo, stoneMat);
      idol.position.y = 0.5;
      group.add(idol);

      // Grotesque head
      const headGeo = new THREE.SphereGeometry(0.22, 10, 10);
      const head = new THREE.Mesh(headGeo, stoneMat);
      head.position.y = 0.95;
      group.add(head);
      break;
    }
  }

  // Scale model down slightly so it rests cleanly on stone card tablet
  group.scale.set(0.65, 0.65, 0.65);
  return group;
}
