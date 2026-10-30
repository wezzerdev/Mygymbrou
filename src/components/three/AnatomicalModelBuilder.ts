import * as THREE from "three";

export type MuscleGroupId =
  | "chest"
  | "back"
  | "shoulder"
  | "rear_delt"
  | "bicep"
  | "tricep"
  | "forearm"
  | "core"
  | "glute"
  | "quad"
  | "hamstring"
  | "calf";

export interface JointPose3D {
  /** Root pelvis position in meters/units (Y=0 is floor) */
  rootPos: [number, number, number];
  /** Root body rotation [rx, ry, rz] in radians */
  rootRot: [number, number, number];
  /** Spine / thorax pitch, yaw, roll */
  spineRot: [number, number, number];
  /** Neck & Head pitch, yaw, roll */
  headRot: [number, number, number];
  /** Left & Right Shoulder [rx, ry, rz] */
  shoulderL: [number, number, number];
  shoulderR: [number, number, number];
  /** Left & Right Elbow flexion [rx, ry, rz] */
  elbowL: [number, number, number];
  elbowR: [number, number, number];
  /** Left & Right Hip [rx, ry, rz] */
  hipL: [number, number, number];
  hipR: [number, number, number];
  /** Left & Right Knee [rx, ry, rz] */
  kneeL: [number, number, number];
  kneeR: [number, number, number];
  /** Left & Right Ankle [rx, ry, rz] */
  ankleL?: [number, number, number];
  ankleR?: [number, number, number];
}

export interface AnatomicalAthleteRig {
  root: THREE.Group;
  pelvis: THREE.Group;
  spine: THREE.Group;
  chestGroup: THREE.Group;
  neck: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  elbowL: THREE.Group;
  elbowR: THREE.Group;
  handL: THREE.Group;
  handR: THREE.Group;
  hipL: THREE.Group;
  hipR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  ankleL: THREE.Group;
  ankleR: THREE.Group;
  muscleMeshes: Record<MuscleGroupId, THREE.Mesh[]>;
  muscleMaterials: Record<MuscleGroupId, THREE.MeshStandardMaterial>;
}

const BASE_SKIN_COLOR = new THREE.Color("#E2E5EC");
const PRIMARY_RED_REST = new THREE.Color("#DC2626");
const PRIMARY_RED_PEAK = new THREE.Color("#EF4444");
const PRIMARY_EMISSIVE = new THREE.Color("#7F1D1D");
const SECONDARY_ORANGE = new THREE.Color("#F97316");
const SECONDARY_EMISSIVE = new THREE.Color("#431407");

/**
 * Helper to create a sculpted anatomical muscle mesh (stretched sphere / capsule)
 */
function createSculptedMuscle(
  rx: number,
  ry: number,
  rz: number,
  pos: [number, number, number],
  rot: [number, number, number],
  mat: THREE.Material
): THREE.Mesh {
  const geom = new THREE.SphereGeometry(1, 20, 16);
  geom.scale(rx, ry, rz);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.set(rot[0], rot[1], rot[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Builds a complete 3D Ecorché / Anatomical Human Rig with sculpted muscle bellies
 * matching medical/fitness 3D apps (silver-white anatomical body, dark shorts,
 * and individually addressable muscle groups that light up in red).
 */
export function buildAnatomicalAthlete3D(): AnatomicalAthleteRig {
  const root = new THREE.Group();

  // Base materials
  const tendonMat = new THREE.MeshStandardMaterial({
    color: "#F1F5F9",
    roughness: 0.45,
    metalness: 0.08,
  });

  const headSkinMat = new THREE.MeshStandardMaterial({
    color: "#E5E7EB",
    roughness: 0.42,
    metalness: 0.06,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: "#1F2937",
    roughness: 0.7,
    metalness: 0.05,
  });

  const shortsMat = new THREE.MeshStandardMaterial({
    color: "#27272A",
    roughness: 0.65,
    metalness: 0.1,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#18181B",
    roughness: 0.5,
    metalness: 0.15,
  });

  const soleMat = new THREE.MeshStandardMaterial({
    color: "#F8FAFC",
    roughness: 0.4,
  });

  const muscleGroups: MuscleGroupId[] = [
    "chest",
    "back",
    "shoulder",
    "rear_delt",
    "bicep",
    "tricep",
    "forearm",
    "core",
    "glute",
    "quad",
    "hamstring",
    "calf",
  ];

  const muscleMaterials = {} as Record<
    MuscleGroupId,
    THREE.MeshStandardMaterial
  >;
  const muscleMeshes = {} as Record<MuscleGroupId, THREE.Mesh[]>;

  for (const mg of muscleGroups) {
    muscleMaterials[mg] = new THREE.MeshStandardMaterial({
      color: BASE_SKIN_COLOR.clone(),
      roughness: 0.38,
      metalness: 0.08,
    });
    muscleMeshes[mg] = [];
  }

  const registerMuscle = (mg: MuscleGroupId, mesh: THREE.Mesh) => {
    muscleMeshes[mg].push(mesh);
    return mesh;
  };

  // =========================================================================
  // 1. PELVIS & SHORTS & GLUTES
  // =========================================================================
  const pelvis = new THREE.Group();
  pelvis.position.set(0, 0.96, 0);
  root.add(pelvis);

  // Pelvis core / athletic shorts waist
  const pelvisCore = createSculptedMuscle(
    0.155,
    0.11,
    0.115,
    [0, 0, 0],
    [0, 0, 0],
    shortsMat
  );
  pelvis.add(pelvisCore);

  // Gluteus Maximus & Medius (Left & Right) — visible at back of hip
  for (const side of [-1, 1]) {
    const gluteMax = registerMuscle(
      "glute",
      createSculptedMuscle(
        0.082,
        0.095,
        0.075,
        [side * 0.075, -0.02, -0.065],
        [0.15, 0, side * -0.08],
        muscleMaterials.glute
      )
    );
    const gluteMed = registerMuscle(
      "glute",
      createSculptedMuscle(
        0.065,
        0.065,
        0.06,
        [side * 0.11, 0.035, -0.03],
        [0, 0, 0],
        muscleMaterials.glute
      )
    );
    pelvis.add(gluteMax, gluteMed);
  }

  // =========================================================================
  // 2. SPINE, CORE (ABS / OBLIQUES), RIBCAGE, PECTORALS & LATS/BACK
  // =========================================================================
  const spine = new THREE.Group();
  spine.position.set(0, 0.06, 0);
  pelvis.add(spine);

  // Base abdomen cylinder
  const abdomenBase = createSculptedMuscle(
    0.135,
    0.17,
    0.095,
    [0, 0.12, 0],
    [0, 0, 0],
    tendonMat
  );
  spine.add(abdomenBase);

  // 6-Pack Rectus Abdominis + External Obliques
  for (const side of [-1, 1]) {
    for (let row = 0; row < 3; row++) {
      const abBlock = registerMuscle(
        "core",
        createSculptedMuscle(
          0.038,
          0.032,
          0.028,
          [side * 0.038, 0.06 + row * 0.058, 0.082],
          [0, 0, 0],
          muscleMaterials.core
        )
      );
      spine.add(abBlock);
    }
    // External obliques
    const oblique = registerMuscle(
      "core",
      createSculptedMuscle(
        0.045,
        0.11,
        0.075,
        [side * 0.115, 0.11, 0.01],
        [0, 0, side * 0.12],
        muscleMaterials.core
      )
    );
    spine.add(oblique);
  }

  // Upper Thorax / Ribcage Group
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.22, 0);
  spine.add(chestGroup);

  const thoraxCore = createSculptedMuscle(
    0.165,
    0.17,
    0.11,
    [0, 0.11, 0],
    [0, 0, 0],
    tendonMat
  );
  chestGroup.add(thoraxCore);

  // Pectoralis Major (Clavicular + Sternal bellies on Left & Right)
  for (const side of [-1, 1]) {
    const pecMajor = registerMuscle(
      "chest",
      createSculptedMuscle(
        0.088,
        0.078,
        0.052,
        [side * 0.078, 0.135, 0.082],
        [-0.12, side * 0.18, side * -0.15],
        muscleMaterials.chest
      )
    );
    const pecUpper = registerMuscle(
      "chest",
      createSculptedMuscle(
        0.078,
        0.048,
        0.044,
        [side * 0.075, 0.185, 0.072],
        [-0.25, side * 0.15, side * -0.22],
        muscleMaterials.chest
      )
    );
    chestGroup.add(pecMajor, pecUpper);

    // Latissimus Dorsi (Wide V-Taper Back Wings)
    const latWing = registerMuscle(
      "back",
      createSculptedMuscle(
        0.085,
        0.165,
        0.068,
        [side * 0.122, 0.085, -0.048],
        [0.12, side * -0.2, side * 0.26],
        muscleMaterials.back
      )
    );
    // Trapezius & Rhomboids (Upper & Mid Back)
    const midTrap = registerMuscle(
      "back",
      createSculptedMuscle(
        0.068,
        0.125,
        0.052,
        [side * 0.055, 0.145, -0.085],
        [-0.08, 0, side * 0.1],
        muscleMaterials.back
      )
    );
    const upperTrap = registerMuscle(
      "back",
      createSculptedMuscle(
        0.075,
        0.045,
        0.055,
        [side * 0.085, 0.245, -0.025],
        [0, 0, side * -0.35],
        muscleMaterials.back
      )
    );
    // Erector Spinae (Lower back pillars)
    const erector = registerMuscle(
      "back",
      createSculptedMuscle(
        0.042,
        0.13,
        0.042,
        [side * 0.045, -0.06, -0.072],
        [0, 0, 0],
        muscleMaterials.back
      )
    );
    chestGroup.add(latWing, midTrap, upperTrap, erector);
  }

  // =========================================================================
  // 3. NECK & ANATOMICAL HEAD
  // =========================================================================
  const neck = new THREE.Group();
  neck.position.set(0, 0.26, 0);
  chestGroup.add(neck);

  const neckCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.052, 0.062, 0.09, 16),
    headSkinMat
  );
  neckCyl.position.set(0, 0.035, 0);
  neck.add(neckCyl);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.11, 0.01);
  neck.add(headGroup);

  // Cranium
  const cranium = createSculptedMuscle(
    0.092,
    0.112,
    0.102,
    [0, 0.02, 0],
    [0, 0, 0],
    headSkinMat
  );
  // Jawline / Chin
  const jaw = createSculptedMuscle(
    0.072,
    0.068,
    0.078,
    [0, -0.035, 0.022],
    [0.15, 0, 0],
    headSkinMat
  );
  // Nose bridge (makes facing direction 100% clear from any angle)
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.018, 0.045, 8),
    headSkinMat
  );
  nose.rotation.x = Math.PI / 2 - 0.2;
  nose.position.set(0, 0.0, 0.106);

  // Brow ridge & Eyes
  const brow = createSculptedMuscle(
    0.068,
    0.016,
    0.025,
    [0, 0.03, 0.088],
    [0, 0, 0],
    headSkinMat
  );

  // Short cropped athletic hair cap
  const hairCap = createSculptedMuscle(
    0.095,
    0.085,
    0.104,
    [0, 0.052, -0.008],
    [-0.15, 0, 0],
    hairMat
  );

  // Ears
  const earL = createSculptedMuscle(
    0.015,
    0.03,
    0.02,
    [0.09, 0.0, -0.005],
    [0, 0, 0],
    headSkinMat
  );
  const earR = createSculptedMuscle(
    0.015,
    0.03,
    0.02,
    [-0.09, 0.0, -0.005],
    [0, 0, 0],
    headSkinMat
  );

  headGroup.add(cranium, jaw, nose, brow, hairCap, earL, earR);

  // =========================================================================
  // 4. LEFT & RIGHT ARMS (3-HEAD DELTOID, BICEPS, TRICEPS, FOREARM, HAND)
  // =========================================================================
  const buildArm = (side: -1 | 1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.205, 0.205, 0);
    chestGroup.add(shoulder);

    // Lateral & Anterior Deltoid Cap
    const deltLat = registerMuscle(
      "shoulder",
      createSculptedMuscle(
        0.065,
        0.082,
        0.065,
        [side * 0.022, -0.015, 0.01],
        [0, 0, side * 0.2],
        muscleMaterials.shoulder
      )
    );
    const deltAnt = registerMuscle(
      "shoulder",
      createSculptedMuscle(
        0.052,
        0.072,
        0.052,
        [side * 0.01, -0.02, 0.038],
        [-0.2, 0, 0],
        muscleMaterials.shoulder
      )
    );
    // Posterior Deltoid (Rear Delt)
    const deltPost = registerMuscle(
      "rear_delt",
      createSculptedMuscle(
        0.055,
        0.072,
        0.052,
        [side * 0.01, -0.02, -0.038],
        [0.2, 0, 0],
        muscleMaterials.rear_delt
      )
    );
    // Also register deltPost in shoulder so general shoulder exercises light it up
    muscleMeshes.shoulder.push(deltPost);
    shoulder.add(deltLat, deltAnt, deltPost);

    // Humerus bone core
    const humerus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.03, 0.27, 12),
      tendonMat
    );
    humerus.position.set(0, -0.14, 0);
    shoulder.add(humerus);

    // Biceps Brachii (Front of upper arm)
    const bicepBelly = registerMuscle(
      "bicep",
      createSculptedMuscle(
        0.044,
        0.098,
        0.048,
        [0, -0.145, 0.026],
        [0, 0, 0],
        muscleMaterials.bicep
      )
    );
    // Triceps Brachii (Back & outer horseshoe of upper arm)
    const tricepLong = registerMuscle(
      "tricep",
      createSculptedMuscle(
        0.046,
        0.105,
        0.048,
        [0, -0.135, -0.028],
        [0, 0, 0],
        muscleMaterials.tricep
      )
    );
    const tricepLat = registerMuscle(
      "tricep",
      createSculptedMuscle(
        0.042,
        0.088,
        0.042,
        [side * 0.02, -0.13, -0.015],
        [0, 0, side * 0.1],
        muscleMaterials.tricep
      )
    );
    shoulder.add(bicepBelly, tricepLong, tricepLat);

    // Elbow Joint
    const elbow = new THREE.Group();
    elbow.position.set(0, -0.28, 0);
    shoulder.add(elbow);

    const elbowJointSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 12, 12),
      tendonMat
    );
    elbow.add(elbowJointSphere);

    // Forearm tendon shaft
    const forearmShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.024, 0.24, 12),
      tendonMat
    );
    forearmShaft.position.set(0, -0.125, 0);
    elbow.add(forearmShaft);

    // Forearm Brachioradialis & Flexors
    const forearmMuscle = registerMuscle(
      "forearm",
      createSculptedMuscle(
        0.042,
        0.088,
        0.042,
        [0, -0.085, 0.01],
        [0, 0, 0],
        muscleMaterials.forearm
      )
    );
    elbow.add(forearmMuscle);

    // Hand / Grip Group
    const hand = new THREE.Group();
    hand.position.set(0, -0.255, 0);
    elbow.add(hand);

    const palm = createSculptedMuscle(
      0.032,
      0.042,
      0.022,
      [0, -0.02, 0],
      [0, 0, 0],
      headSkinMat
    );
    const fingers = createSculptedMuscle(
      0.03,
      0.028,
      0.026,
      [0, -0.045, 0.012],
      [0.4, 0, 0],
      headSkinMat
    );
    hand.add(palm, fingers);

    return { shoulder, elbow, hand };
  };

  // In anatomical coordinates: +X is Left, -X is Right
  const armL = buildArm(1);
  const armR = buildArm(-1);

  // =========================================================================
  // 5. LEFT & RIGHT LEGS (QUADRICEPS 3 HEADS, HAMSTRINGS, CALVES, FEET)
  // =========================================================================
  const buildLeg = (side: -1 | 1) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.105, -0.04, 0);
    pelvis.add(hip);

    // Upper thigh compression shorts leg sleeve
    const shortSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.082, 0.14, 16),
      shortsMat
    );
    shortSleeve.position.set(0, -0.065, 0);
    hip.add(shortSleeve);

    // Femur / Tendon core
    const femurShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.058, 0.048, 0.42, 14),
      tendonMat
    );
    femurShaft.position.set(0, -0.21, 0);
    hip.add(femurShaft);

    // QUADRICEPS (3 distinct sculpted heads on front/sides of thigh, just like Image 1!)
    // 1. Rectus Femoris (center front)
    const rectusFemoris = registerMuscle(
      "quad",
      createSculptedMuscle(
        0.052,
        0.155,
        0.058,
        [0, -0.21, 0.042],
        [0.04, 0, 0],
        muscleMaterials.quad
      )
    );
    // 2. Vastus Lateralis (outer quad sweep)
    const vastusLat = registerMuscle(
      "quad",
      createSculptedMuscle(
        0.054,
        0.16,
        0.056,
        [side * 0.042, -0.215, 0.022],
        [0, 0, side * -0.08],
        muscleMaterials.quad
      )
    );
    // 3. Vastus Medialis / VMO (inner teardrop above knee)
    const vastusMed = registerMuscle(
      "quad",
      createSculptedMuscle(
        0.048,
        0.105,
        0.05,
        [side * -0.034, -0.275, 0.032],
        [0, 0, side * 0.12],
        muscleMaterials.quad
      )
    );

    // HAMSTRINGS (Biceps Femoris & Semitendinosus on back of thigh)
    const hamLateral = registerMuscle(
      "hamstring",
      createSculptedMuscle(
        0.048,
        0.155,
        0.055,
        [side * 0.022, -0.22, -0.042],
        [-0.04, 0, 0],
        muscleMaterials.hamstring
      )
    );
    const hamMedial = registerMuscle(
      "hamstring",
      createSculptedMuscle(
        0.048,
        0.155,
        0.055,
        [side * -0.022, -0.22, -0.042],
        [-0.04, 0, 0],
        muscleMaterials.hamstring
      )
    );

    hip.add(rectusFemoris, vastusLat, vastusMed, hamLateral, hamMedial);

    // KNEE JOINT & PATELLA
    const knee = new THREE.Group();
    knee.position.set(0, -0.42, 0);
    hip.add(knee);

    const kneeCap = createSculptedMuscle(
      0.046,
      0.048,
      0.046,
      [0, 0, 0.015],
      [0, 0, 0],
      tendonMat
    );
    knee.add(kneeCap);

    // Shin / Tibia & Achilles Tendon (white tendon lower leg)
    const tibiaShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.032, 0.4, 14),
      tendonMat
    );
    tibiaShaft.position.set(0, -0.2, 0);
    knee.add(tibiaShaft);

    // CALVES (Gastrocnemius medial & lateral heads on upper back of shin)
    const calfMed = registerMuscle(
      "calf",
      createSculptedMuscle(
        0.038,
        0.115,
        0.048,
        [side * -0.018, -0.135, -0.032],
        [-0.08, 0, 0],
        muscleMaterials.calf
      )
    );
    const calfLat = registerMuscle(
      "calf",
      createSculptedMuscle(
        0.038,
        0.11,
        0.046,
        [side * 0.02, -0.14, -0.03],
        [-0.08, 0, 0],
        muscleMaterials.calf
      )
    );
    knee.add(calfMed, calfLat);

    // ANKLE & ANATOMICAL FOOT / SHOE
    const ankle = new THREE.Group();
    ankle.position.set(0, -0.4, 0);
    knee.add(ankle);

    const footUpper = createSculptedMuscle(
      0.048,
      0.036,
      0.105,
      [0, -0.022, 0.045],
      [0.08, 0, 0],
      shoeMat
    );
    const footSole = new THREE.Mesh(
      new THREE.BoxGeometry(0.092, 0.016, 0.21),
      soleMat
    );
    footSole.position.set(0, -0.048, 0.045);
    ankle.add(footUpper, footSole);

    return { hip, knee, ankle };
  };

  const legL = buildLeg(1);
  const legR = buildLeg(-1);

  return {
    root,
    pelvis,
    spine,
    chestGroup,
    neck,
    shoulderL: armL.shoulder,
    shoulderR: armR.shoulder,
    elbowL: armL.elbow,
    elbowR: armR.elbow,
    handL: armL.hand,
    handR: armR.hand,
    hipL: legL.hip,
    hipR: legR.hip,
    kneeL: legL.knee,
    kneeR: legR.knee,
    ankleL: legL.ankle,
    ankleR: legR.ankle,
    muscleMeshes,
    muscleMaterials,
  };
}

/**
 * Applies interpolated 3D joint angles and updates the anatomical red muscle highlighting
 */
export function applyPoseToAthlete3D(
  rig: AnatomicalAthleteRig,
  pose: JointPose3D,
  primaryMuscles: MuscleGroupId[],
  secondaryMuscles: MuscleGroupId[],
  phaseT: number
) {
  rig.pelvis.position.set(pose.rootPos[0], pose.rootPos[1], pose.rootPos[2]);
  rig.pelvis.rotation.set(pose.rootRot[0], pose.rootRot[1], pose.rootRot[2]);

  rig.spine.rotation.set(pose.spineRot[0], pose.spineRot[1], pose.spineRot[2]);
  rig.neck.rotation.set(pose.headRot[0], pose.headRot[1], pose.headRot[2]);

  rig.shoulderL.rotation.set(
    pose.shoulderL[0],
    pose.shoulderL[1],
    pose.shoulderL[2]
  );
  rig.shoulderR.rotation.set(
    pose.shoulderR[0],
    pose.shoulderR[1],
    pose.shoulderR[2]
  );

  rig.elbowL.rotation.set(pose.elbowL[0], pose.elbowL[1], pose.elbowL[2]);
  rig.elbowR.rotation.set(pose.elbowR[0], pose.elbowR[1], pose.elbowR[2]);

  rig.hipL.rotation.set(pose.hipL[0], pose.hipL[1], pose.hipL[2]);
  rig.hipR.rotation.set(pose.hipR[0], pose.hipR[1], pose.hipR[2]);

  rig.kneeL.rotation.set(pose.kneeL[0], pose.kneeL[1], pose.kneeL[2]);
  rig.kneeR.rotation.set(pose.kneeR[0], pose.kneeR[1], pose.kneeR[2]);

  const aL = pose.ankleL || [0, 0, 0];
  const aR = pose.ankleR || [0, 0, 0];
  rig.ankleL.rotation.set(aL[0], aL[1], aL[2]);
  rig.ankleR.rotation.set(aR[0], aR[1], aR[2]);

  // Highlight active muscles in Anatomical Crimson Red (Primary) and Orange-Red (Secondary)
  const allGroups = Object.keys(rig.muscleMaterials) as MuscleGroupId[];
  for (const mg of allGroups) {
    const mat = rig.muscleMaterials[mg];
    if (primaryMuscles.includes(mg)) {
      mat.color.lerpColors(PRIMARY_RED_REST, PRIMARY_RED_PEAK, phaseT);
      mat.emissive.copy(PRIMARY_EMISSIVE);
      mat.emissiveIntensity = 0.25 + 0.35 * phaseT;
      mat.roughness = 0.32;
    } else if (secondaryMuscles.includes(mg)) {
      mat.color.copy(SECONDARY_ORANGE);
      mat.emissive.copy(SECONDARY_EMISSIVE);
      mat.emissiveIntensity = 0.15 + 0.2 * phaseT;
      mat.roughness = 0.36;
    } else {
      mat.color.copy(BASE_SKIN_COLOR);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      mat.roughness = 0.38;
    }
  }
}
