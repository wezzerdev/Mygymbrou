import * as THREE from "three";
import { AnatomicalAthleteRig } from "./AnatomicalModelBuilder";

export type Station3DType =
  | "standing_floor"
  | "incline_bench_30"
  | "flat_bench"
  | "seated_bench_80"
  | "smith_incline"
  | "convergent_press_machine"
  | "dual_cable_crossover"
  | "single_cable_tower"
  | "pec_deck_machine"
  | "lateral_raise_machine"
  | "dip_pullup_tower"
  | "lat_pulldown_machine"
  | "chest_supported_row_machine"
  | "seated_cable_row_machine"
  | "preacher_curl_bench"
  | "hack_squat_machine"
  | "leg_press_45_machine"
  | "bulgarian_split_bench"
  | "hip_thrust_bench"
  | "seated_leg_curl_machine"
  | "lying_leg_curl_machine"
  | "leg_extension_machine"
  | "foam_roller_mat"
  | "heel_wedge_floor";

export type DynamicPropType =
  | "none"
  | "dumbbells_both_hands"
  | "dumbbell_right_hand"
  | "dumbbell_goblet"
  | "dumbbell_ankles"
  | "barbell_hands"
  | "ez_bar_hands"
  | "barbell_hips"
  | "smith_bar_hands"
  | "lat_bar_cable"
  | "low_row_cable"
  | "dual_cables_low"
  | "single_cable_low_right"
  | "high_rope_cable"
  | "machine_arms_press"
  | "machine_arms_fly"
  | "machine_arms_lat_raise"
  | "machine_arms_row"
  | "leg_curl_seated_roller"
  | "leg_curl_lying_roller"
  | "leg_ext_roller"
  | "hack_sled"
  | "leg_press_sled";

export interface GymEquipmentRig3D {
  group: THREE.Group;
  updateDynamicProps: (athlete: AnatomicalAthleteRig, phaseT: number) => void;
}

const STEEL_FRAME_MAT = new THREE.MeshStandardMaterial({
  color: "#9CA3AF",
  roughness: 0.35,
  metalness: 0.65,
});

const DARK_STEEL_MAT = new THREE.MeshStandardMaterial({
  color: "#374151",
  roughness: 0.45,
  metalness: 0.55,
});

const CHROME_MAT = new THREE.MeshStandardMaterial({
  color: "#E5E7EB",
  roughness: 0.18,
  metalness: 0.85,
});

const PAD_BLACK_MAT = new THREE.MeshStandardMaterial({
  color: "#18181B",
  roughness: 0.6,
  metalness: 0.08,
});

const PLATE_BLACK_MAT = new THREE.MeshStandardMaterial({
  color: "#1F2937",
  roughness: 0.5,
  metalness: 0.3,
});

const CABLE_MAT = new THREE.MeshStandardMaterial({
  color: "#374151",
  roughness: 0.4,
  metalness: 0.5,
});

function createDumbbellMesh(): THREE.Group {
  const g = new THREE.Group();
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.15, 12),
    CHROME_MAT
  );
  handle.rotation.z = Math.PI / 2;
  g.add(handle);

  for (const s of [-1, 1]) {
    const p1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.062, 0.028, 16),
      PLATE_BLACK_MAT
    );
    p1.rotation.z = Math.PI / 2;
    p1.position.x = s * 0.065;
    const p2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.022, 16),
      PLATE_BLACK_MAT
    );
    p2.rotation.z = Math.PI / 2;
    p2.position.x = s * 0.09;
    g.add(p1, p2);
  }
  return g;
}

function createOlympicBarbellMesh(width = 1.65): THREE.Group {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, width, 16),
    CHROME_MAT
  );
  bar.rotation.z = Math.PI / 2;
  g.add(bar);

  const sleeveOffset = width * 0.36;
  for (const s of [-1, 1]) {
    const bigPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.032, 24),
      PLATE_BLACK_MAT
    );
    bigPlate.rotation.z = Math.PI / 2;
    bigPlate.position.x = s * sleeveOffset;

    const midPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.145, 0.145, 0.026, 24),
      PLATE_BLACK_MAT
    );
    midPlate.rotation.z = Math.PI / 2;
    midPlate.position.x = s * (sleeveOffset + 0.035);

    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.04, 16),
      CHROME_MAT
    );
    collar.rotation.z = Math.PI / 2;
    collar.position.x = s * (sleeveOffset + 0.065);

    g.add(bigPlate, midPlate, collar);
  }
  return g;
}

function createWeightStackTower3D(
  pos: [number, number, number],
  height = 1.65
): { tower: THREE.Group; movingPlates: THREE.Group } {
  const tower = new THREE.Group();
  tower.position.set(pos[0], pos[1], pos[2]);

  // Left & Right steel columns
  for (const s of [-1, 1]) {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, height, 0.075),
      STEEL_FRAME_MAT
    );
    col.position.set(s * 0.16, height / 2, 0);
    col.castShadow = true;
    tower.add(col);

    // Chrome guide rod
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, height - 0.1, 10),
      CHROME_MAT
    );
    rod.position.set(s * 0.07, height / 2, 0);
    tower.add(rod);
  }

  // Top & Bottom caps
  const topCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.07, 0.14),
    STEEL_FRAME_MAT
  );
  topCap.position.set(0, height, 0);
  const botCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.05, 0.36),
    STEEL_FRAME_MAT
  );
  botCap.position.set(0, 0.025, 0);
  tower.add(topCap, botCap);

  // Static bottom weight stack
  const staticStack = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.42, 0.11),
    PLATE_BLACK_MAT
  );
  staticStack.position.set(0, 0.25, 0);
  tower.add(staticStack);

  // Moving weight plates group
  const movingPlates = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.245, 0.036, 0.115),
      PLATE_BLACK_MAT
    );
    plate.position.set(0, 0.5 + i * 0.044, 0);
    movingPlates.add(plate);
  }
  tower.add(movingPlates);

  return { tower, movingPlates };
}

/**
 * Updates a cylinder mesh so it stretches between two 3D points p1 and p2
 */
function alignCylinderBetweenPoints(
  mesh: THREE.Mesh,
  p1: THREE.Vector3,
  p2: THREE.Vector3
) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = Math.max(0.01, dir.length());
  mesh.position.copy(p1).addScaledVector(dir, 0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  );
}

/**
 * Builds the 3D gym station and dynamic weights/levers/cables for a given exercise
 */
export function buildGymEquipment3D(
  station: Station3DType,
  propType: DynamicPropType
): GymEquipmentRig3D {
  const group = new THREE.Group();
  let movingStackRef: THREE.Group | null = null;

  // =========================================================================
  // 1. STATIC STATION GEOMETRY
  // =========================================================================
  if (
    station === "incline_bench_30" ||
    station === "smith_incline" ||
    station === "seated_bench_80" ||
    station === "convergent_press_machine" ||
    station === "lateral_raise_machine"
  ) {
    // Base frame
    const baseBeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 1.05),
      STEEL_FRAME_MAT
    );
    baseBeam.position.set(0, 0.025, -0.05);
    const frontPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.44, 12),
      STEEL_FRAME_MAT
    );
    frontPost.position.set(0, 0.22, 0.16);
    const backPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.48, 12),
      STEEL_FRAME_MAT
    );
    backPost.position.set(0, 0.24, -0.24);

    // Seat pad
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.34),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.44, 0.1);
    seatPad.rotation.x = -0.12;

    // Backrest pad
    const backPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.78, 0.065),
      PAD_BLACK_MAT
    );
    const isUpright =
      station === "seated_bench_80" ||
      station === "convergent_press_machine" ||
      station === "lateral_raise_machine";
    backPad.position.set(
      0,
      isUpright ? 0.82 : 0.72,
      isUpright ? -0.12 : -0.24
    );
    backPad.rotation.x = isUpright ? -0.16 : -0.68;

    group.add(baseBeam, frontPost, backPost, seatPad, backPad);

    if (station === "smith_incline") {
      for (const s of [-1, 1]) {
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 1.95, 0.06),
          STEEL_FRAME_MAT
        );
        post.position.set(s * 0.62, 0.975, -0.02);
        const rail = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.014, 1.9, 12),
          CHROME_MAT
        );
        rail.position.set(s * 0.54, 0.95, -0.02);
        group.add(post, rail);
      }
      const topBeam = new THREE.Mesh(
        new THREE.BoxGeometry(1.32, 0.06, 0.08),
        STEEL_FRAME_MAT
      );
      topBeam.position.set(0, 1.95, -0.02);
      group.add(topBeam);
    }

    if (
      station === "convergent_press_machine" ||
      station === "lateral_raise_machine"
    ) {
      const { tower, movingPlates } = createWeightStackTower3D(
        [0, 0, -0.52],
        1.65
      );
      movingStackRef = movingPlates;
      group.add(tower);
    }
  } else if (station === "flat_bench") {
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.065, 1.18),
      PAD_BLACK_MAT
    );
    pad.position.set(0, 0.45, -0.1);
    const leg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.44, 0.06),
      STEEL_FRAME_MAT
    );
    leg1.position.set(0, 0.22, 0.34);
    const leg2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.44, 0.06),
      STEEL_FRAME_MAT
    );
    leg2.position.set(0, 0.22, -0.54);
    group.add(pad, leg1, leg2);
  } else if (station === "dual_cable_crossover") {
    const leftT = createWeightStackTower3D([0.88, 0, -0.25], 1.85);
    const rightT = createWeightStackTower3D([-0.88, 0, -0.25], 1.85);
    movingStackRef = leftT.movingPlates;
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.07, 0.1),
      STEEL_FRAME_MAT
    );
    bridge.position.set(0, 1.85, -0.25);
    group.add(leftT.tower, rightT.tower, bridge);
  } else if (station === "single_cable_tower") {
    const towerObj = createWeightStackTower3D([0.75, 0, -0.15], 1.8);
    movingStackRef = towerObj.movingPlates;
    group.add(towerObj.tower);
  } else if (station === "pec_deck_machine") {
    const towerObj = createWeightStackTower3D([0, 0, -0.46], 1.75);
    movingStackRef = towerObj.movingPlates;
    const topArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.06, 0.45),
      STEEL_FRAME_MAT
    );
    topArm.position.set(0, 1.72, -0.22);
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.34),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.46, 0.02);
    const backPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.72, 0.06),
      PAD_BLACK_MAT
    );
    backPad.position.set(0, 0.85, -0.14);
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.46, 12),
      STEEL_FRAME_MAT
    );
    post.position.set(0, 0.23, 0.02);
    group.add(towerObj.tower, topArm, seatPad, backPad, post);
  } else if (station === "lat_pulldown_machine") {
    const towerObj = createWeightStackTower3D([0, 0, 0.55], 1.95);
    movingStackRef = towerObj.movingPlates;
    const topBoom = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.06, 0.65),
      STEEL_FRAME_MAT
    );
    topBoom.position.set(0, 1.95, 0.26);
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.055, 0.38),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.46, 0);
    const seatPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.46, 0.08),
      STEEL_FRAME_MAT
    );
    seatPost.position.set(0, 0.23, 0);
    // Thigh hold-down rollers
    const roller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16),
      PAD_BLACK_MAT
    );
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, 0.62, 0.16);
    group.add(towerObj.tower, topBoom, seatPad, seatPost, roller);
  } else if (station === "dip_pullup_tower") {
    const towerObj = createWeightStackTower3D([0, 0, -0.42], 1.95);
    movingStackRef = towerObj.movingPlates;
    for (const s of [-1, 1]) {
      const dipBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12),
        DARK_STEEL_MAT
      );
      dipBar.rotation.x = Math.PI / 2;
      dipBar.position.set(s * 0.26, 1.15, -0.15);

      const topGrip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.85, 12),
        DARK_STEEL_MAT
      );
      topGrip.rotation.z = Math.PI / 2;
      topGrip.position.set(0, 1.92, -0.05);
      group.add(dipBar, topGrip);
    }
    group.add(towerObj.tower);
  } else if (station === "chest_supported_row_machine") {
    const towerObj = createWeightStackTower3D([0, 0, 0.56], 1.65);
    movingStackRef = towerObj.movingPlates;
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.34),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.46, -0.02);
    const chestPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.48, 0.065),
      PAD_BLACK_MAT
    );
    chestPad.position.set(0, 0.88, 0.14);
    chestPad.rotation.x = 0.22;
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.85, 0.08),
      STEEL_FRAME_MAT
    );
    post.position.set(0, 0.42, 0.14);
    group.add(towerObj.tower, seatPad, chestPad, post);
  } else if (station === "seated_cable_row_machine") {
    const towerObj = createWeightStackTower3D([0, 0, 0.78], 1.65);
    movingStackRef = towerObj.movingPlates;
    const longSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.95),
      PAD_BLACK_MAT
    );
    longSeat.position.set(0, 0.36, -0.15);
    const footPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.24, 0.04),
      DARK_STEEL_MAT
    );
    footPlate.position.set(0, 0.42, 0.48);
    footPlate.rotation.x = -0.25;
    const legPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.36, 0.8),
      STEEL_FRAME_MAT
    );
    legPost.position.set(0, 0.18, -0.15);
    group.add(towerObj.tower, longSeat, footPlate, legPost);
  } else if (station === "preacher_curl_bench") {
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.32),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.46, -0.18);
    const armPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.36, 0.075),
      PAD_BLACK_MAT
    );
    armPad.position.set(0, 0.82, 0.12);
    armPad.rotation.x = 0.65;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.78, 0.55),
      STEEL_FRAME_MAT
    );
    frame.position.set(0, 0.39, -0.02);
    group.add(seatPad, armPad, frame);
  } else if (
    station === "seated_leg_curl_machine" ||
    station === "leg_extension_machine"
  ) {
    // Side weight stack tower just like real gym leg machines
    const towerObj = createWeightStackTower3D([-0.52, 0, -0.1], 1.55);
    movingStackRef = towerObj.movingPlates;

    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 0.42),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.52, -0.08);
    seatPad.rotation.x = -0.08;

    const backPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.68, 0.065),
      PAD_BLACK_MAT
    );
    backPad.position.set(0, 0.88, -0.28);
    backPad.rotation.x = -0.18;

    const basePost = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.5, 0.45),
      STEEL_FRAME_MAT
    );
    basePost.position.set(0, 0.25, -0.1);

    // Side cam housing at knee axis
    const camWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.04, 20),
      DARK_STEEL_MAT
    );
    camWheel.rotation.z = Math.PI / 2;
    camWheel.position.set(-0.24, 0.52, 0.26);

    group.add(towerObj.tower, seatPad, backPad, basePost, camWheel);

    if (station === "seated_leg_curl_machine") {
      // Thigh lock roller pad on top of thighs
      const thighPad = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 0.38, 16),
        PAD_BLACK_MAT
      );
      thighPad.rotation.z = Math.PI / 2;
      thighPad.position.set(0, 0.65, 0.12);
      group.add(thighPad);
    }
  } else if (station === "lying_leg_curl_machine") {
    const towerObj = createWeightStackTower3D([-0.52, 0, 0.0], 1.5);
    movingStackRef = towerObj.movingPlates;

    // Angled chevron prone pads
    const torsoPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.065, 0.65),
      PAD_BLACK_MAT
    );
    torsoPad.position.set(0, 0.54, 0.24);
    torsoPad.rotation.x = 0.14;

    const thighPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.065, 0.48),
      PAD_BLACK_MAT
    );
    thighPad.position.set(0, 0.53, -0.26);
    thighPad.rotation.x = -0.16;

    const frameLeg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.5, 0.08),
      STEEL_FRAME_MAT
    );
    frameLeg1.position.set(0, 0.25, 0.42);
    const frameLeg2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.5, 0.08),
      STEEL_FRAME_MAT
    );
    frameLeg2.position.set(0, 0.25, -0.42);

    group.add(towerObj.tower, torsoPad, thighPad, frameLeg1, frameLeg2);
  } else if (station === "hack_squat_machine") {
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 1.95, 12),
        CHROME_MAT
      );
      rail.position.set(s * 0.32, 0.82, -0.1);
      rail.rotation.x = -0.58;
      group.add(rail);
    }
    const footPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.04, 0.55),
      DARK_STEEL_MAT
    );
    footPlate.position.set(0, 0.16, 0.42);
    footPlate.rotation.x = 0.55;
    group.add(footPlate);
  } else if (station === "leg_press_45_machine") {
    const seatPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.55, 0.07),
      PAD_BLACK_MAT
    );
    seatPad.position.set(0, 0.38, -0.38);
    seatPad.rotation.x = -0.78;

    const bottomPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 0.34),
      PAD_BLACK_MAT
    );
    bottomPad.position.set(0, 0.18, -0.12);
    bottomPad.rotation.x = 0.35;

    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 1.75, 12),
        CHROME_MAT
      );
      rail.position.set(s * 0.32, 0.78, 0.25);
      rail.rotation.x = 0.72;
      group.add(rail);
    }
    group.add(seatPad, bottomPad);
  } else if (station === "bulgarian_split_bench") {
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.46, 16),
      PAD_BLACK_MAT
    );
    pad.rotation.z = Math.PI / 2;
    pad.position.set(0, 0.42, -0.52);
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.42, 0.06),
      STEEL_FRAME_MAT
    );
    post.position.set(0, 0.21, -0.52);
    group.add(pad, post);
  } else if (station === "hip_thrust_bench") {
    const backPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.28, 0.28),
      PAD_BLACK_MAT
    );
    backPad.position.set(0, 0.42, -0.44);
    group.add(backPad);
  } else if (station === "foam_roller_mat") {
    const mat = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.015, 1.75),
      new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.8 })
    );
    mat.position.set(0, 0.008, 0);
    const roller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.48, 20),
      PAD_BLACK_MAT
    );
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, 0.085, -0.18);
    group.add(mat, roller);
  } else if (station === "heel_wedge_floor") {
    const wedge = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.05, 0.22),
      DARK_STEEL_MAT
    );
    wedge.position.set(0, 0.025, -0.04);
    wedge.rotation.x = 0.22;
    group.add(wedge);
  }

  // =========================================================================
  // 2. DYNAMIC PROPS (MOVING WEIGHTS, CABLES, ROLLERS, LEVERS)
  // =========================================================================
  const dbL = createDumbbellMesh();
  const dbR = createDumbbellMesh();
  const barbell = createOlympicBarbellMesh(1.65);
  const cableL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 1, 8),
    CABLE_MAT
  );
  const cableR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 1, 8),
    CABLE_MAT
  );
  const latBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.92, 12),
    CHROME_MAT
  );
  latBar.rotation.z = Math.PI / 2;

  const rollerPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.42, 16),
    PAD_BLACK_MAT
  );
  rollerPad.rotation.z = Math.PI / 2;
  const leverArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1, 10),
    STEEL_FRAME_MAT
  );
  const leverArmR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1, 10),
    STEEL_FRAME_MAT
  );

  // Sled platform for Leg Press / Hack Squat
  const sledGroup = new THREE.Group();
  const sledPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.44, 0.05),
    DARK_STEEL_MAT
  );
  sledGroup.add(sledPlate);
  for (const s of [-1, 1]) {
    const wPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20),
      PLATE_BLACK_MAT
    );
    wPlate.rotation.z = Math.PI / 2;
    wPlate.position.set(s * 0.36, 0, 0);
    sledGroup.add(wPlate);
  }

  // Add needed dynamic props to scene
  if (propType === "dumbbells_both_hands") {
    group.add(dbL, dbR);
  } else if (
    propType === "dumbbell_right_hand" ||
    propType === "dumbbell_goblet" ||
    propType === "dumbbell_ankles"
  ) {
    group.add(dbR);
  } else if (
    propType === "barbell_hands" ||
    propType === "ez_bar_hands" ||
    propType === "barbell_hips" ||
    propType === "smith_bar_hands"
  ) {
    group.add(barbell);
  } else if (propType === "lat_bar_cable") {
    group.add(latBar, cableL);
  } else if (
    propType === "low_row_cable" ||
    propType === "single_cable_low_right" ||
    propType === "high_rope_cable"
  ) {
    group.add(cableL);
  } else if (propType === "dual_cables_low") {
    group.add(cableL, cableR);
  } else if (
    propType === "machine_arms_press" ||
    propType === "machine_arms_fly" ||
    propType === "machine_arms_lat_raise" ||
    propType === "machine_arms_row"
  ) {
    group.add(leverArm, leverArmR);
  } else if (
    propType === "leg_curl_seated_roller" ||
    propType === "leg_curl_lying_roller" ||
    propType === "leg_ext_roller"
  ) {
    group.add(rollerPad, leverArm);
  } else if (propType === "hack_sled" || propType === "leg_press_sled") {
    group.add(sledGroup);
  }

  const vHandL = new THREE.Vector3();
  const vHandR = new THREE.Vector3();
  const vElbowL = new THREE.Vector3();
  const vElbowR = new THREE.Vector3();
  const vAnkleL = new THREE.Vector3();
  const vAnkleR = new THREE.Vector3();
  const vHip = new THREE.Vector3();
  const vShoulder = new THREE.Vector3();

  const updateDynamicProps = (
    athlete: AnatomicalAthleteRig,
    phaseT: number
  ) => {
    athlete.root.updateMatrixWorld(true);

    athlete.handL.getWorldPosition(vHandL);
    athlete.handR.getWorldPosition(vHandR);
    athlete.elbowL.getWorldPosition(vElbowL);
    athlete.elbowR.getWorldPosition(vElbowR);
    athlete.ankleL.getWorldPosition(vAnkleL);
    athlete.ankleR.getWorldPosition(vAnkleR);
    athlete.pelvis.getWorldPosition(vHip);
    athlete.chestGroup.getWorldPosition(vShoulder);

    // Move weight stack plates up & down with contraction phaseT
    if (movingStackRef) {
      movingStackRef.position.y = phaseT * 0.35;
    }

    if (propType === "dumbbells_both_hands") {
      dbL.position.copy(vHandL);
      dbR.position.copy(vHandR);
    } else if (propType === "dumbbell_right_hand") {
      dbR.position.copy(vHandR);
    } else if (propType === "dumbbell_goblet") {
      dbR.position.copy(vHandL).lerp(vHandR, 0.5);
      dbR.rotation.set(0, 0, Math.PI / 2);
    } else if (propType === "dumbbell_ankles") {
      dbR.position.copy(vAnkleL).lerp(vAnkleR, 0.5);
    } else if (
      propType === "barbell_hands" ||
      propType === "ez_bar_hands" ||
      propType === "smith_bar_hands"
    ) {
      barbell.position.copy(vHandL).lerp(vHandR, 0.5);
    } else if (propType === "barbell_hips") {
      barbell.position.set(vHip.x, vHip.y + 0.09, vHip.z + 0.04);
    } else if (propType === "lat_bar_cable") {
      const midHand = vHandL.clone().lerp(vHandR, 0.5);
      latBar.position.copy(midHand);
      alignCylinderBetweenPoints(
        cableL,
        new THREE.Vector3(0, 1.95, 0.08),
        midHand
      );
    } else if (propType === "low_row_cable") {
      const midHand = vHandL.clone().lerp(vHandR, 0.5);
      alignCylinderBetweenPoints(
        cableL,
        new THREE.Vector3(0, 0.45, 0.72),
        midHand
      );
    } else if (propType === "single_cable_low_right") {
      alignCylinderBetweenPoints(
        cableL,
        new THREE.Vector3(0.68, 0.18, -0.15),
        vHandR
      );
    } else if (propType === "high_rope_cable") {
      const midHand = vHandL.clone().lerp(vHandR, 0.5);
      alignCylinderBetweenPoints(
        cableL,
        new THREE.Vector3(0.68, 1.45, -0.15),
        midHand
      );
    } else if (propType === "dual_cables_low") {
      alignCylinderBetweenPoints(
        cableL,
        new THREE.Vector3(0.82, 0.18, -0.25),
        vHandL
      );
      alignCylinderBetweenPoints(
        cableR,
        new THREE.Vector3(-0.82, 0.18, -0.25),
        vHandR
      );
    } else if (
      propType === "machine_arms_press" ||
      propType === "machine_arms_fly"
    ) {
      alignCylinderBetweenPoints(
        leverArm,
        new THREE.Vector3(0.28, 1.55, -0.22),
        vHandL
      );
      alignCylinderBetweenPoints(
        leverArmR,
        new THREE.Vector3(-0.28, 1.55, -0.22),
        vHandR
      );
    } else if (propType === "machine_arms_lat_raise") {
      alignCylinderBetweenPoints(
        leverArm,
        new THREE.Vector3(0.2, 1.15, -0.18),
        vElbowL
      );
      alignCylinderBetweenPoints(
        leverArmR,
        new THREE.Vector3(-0.2, 1.15, -0.18),
        vElbowR
      );
    } else if (propType === "machine_arms_row") {
      alignCylinderBetweenPoints(
        leverArm,
        new THREE.Vector3(0.26, 1.35, 0.42),
        vHandL
      );
      alignCylinderBetweenPoints(
        leverArmR,
        new THREE.Vector3(-0.26, 1.35, 0.42),
        vHandR
      );
    } else if (
      propType === "leg_curl_seated_roller" ||
      propType === "leg_ext_roller"
    ) {
      const midAnkle = vAnkleL.clone().lerp(vAnkleR, 0.5);
      const offsetZ = propType === "leg_ext_roller" ? 0.055 : -0.055;
      rollerPad.position.set(midAnkle.x, midAnkle.y + 0.04, midAnkle.z + offsetZ);
      alignCylinderBetweenPoints(
        leverArm,
        new THREE.Vector3(-0.22, 0.52, 0.26),
        new THREE.Vector3(-0.22, rollerPad.position.y, rollerPad.position.z)
      );
    } else if (propType === "leg_curl_lying_roller") {
      const midAnkle = vAnkleL.clone().lerp(vAnkleR, 0.5);
      rollerPad.position.set(midAnkle.x, midAnkle.y + 0.05, midAnkle.z - 0.04);
      alignCylinderBetweenPoints(
        leverArm,
        new THREE.Vector3(-0.22, 0.48, -0.46),
        new THREE.Vector3(-0.22, rollerPad.position.y, rollerPad.position.z)
      );
    } else if (propType === "hack_sled") {
      sledGroup.position.set(0, vShoulder.y + 0.05, vShoulder.z - 0.14);
      sledGroup.rotation.x = -0.58;
    } else if (propType === "leg_press_sled") {
      const midAnkle = vAnkleL.clone().lerp(vAnkleR, 0.5);
      sledGroup.position.set(0, midAnkle.y + 0.04, midAnkle.z + 0.08);
      sledGroup.rotation.x = 0.72;
    }
  };

  return { group, updateDynamicProps };
}
