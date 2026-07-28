import type { AssetKey, ImageBank } from "./assets";

export const VIEW_W = 1280;
export const VIEW_H = 720;
export const WORLD_W = 3072;
export const WORLD_H = 2048;
export const TILE = 64;
const COLS = WORLD_W / TILE;
const ROWS = WORLD_H / TILE;

export type GameMode = "stage" | "endless";
export type ResourceKind = "wood" | "gold" | "meat";
export type PlayerUnitKind = "pawn" | "warrior" | "lancer" | "archer" | "monk";
export type EnemyKind =
  | "gnome"
  | "goblin"
  | "gnoll"
  | "thief"
  | "skull"
  | "panda"
  | "minotaur"
  | "troll";
export type UnitKind = PlayerUnitKind | EnemyKind;
export type PlayerBuildingKind =
  | "castle"
  | "house"
  | "barracks"
  | "archery"
  | "monastery"
  | "tower";
export type EnemyBuildingKind =
  | "cave"
  | "goblinHouse"
  | "goblinTower"
  | "rootTree";
export type BuildingKind = PlayerBuildingKind | EnemyBuildingKind;
export type UnitAction =
  | "idle"
  | "move"
  | "gather"
  | "return"
  | "attack"
  | "heal"
  | "guard"
  | "windup"
  | "recovery";

interface Point {
  x: number;
  y: number;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface Unit {
  id: number;
  kind: UnitKind;
  team: "player" | "enemy";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  action: UnitAction;
  facing: 1 | -1;
  anim: number;
  attackClock: number;
  healClock: number;
  specialClock: number;
  pathClock: number;
  path: Point[];
  targetUnitId?: number;
  targetBuildingId?: number;
  targetResourceId?: number;
  homeResourceId?: number;
  workingResource?: ResourceKind;
  gatherClock: number;
  carrying?: ResourceKind;
  carryAmount: number;
  boss?: boolean;
}

export interface TrainingOrder {
  kind: PlayerUnitKind;
  remaining: number;
  total: number;
}

export interface Building {
  id: number;
  kind: BuildingKind;
  team: "player" | "enemy";
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  queue?: TrainingOrder;
  attackClock: number;
  construction: number;
  variant: number;
  respawnClock: number;
  cleared: boolean;
}

export interface ResourceNode {
  id: number;
  kind: ResourceKind;
  x: number;
  y: number;
  amount: number;
  maxAmount: number;
  variant: number;
  respawnClock: number;
  respawnDelay: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  targetId: number;
  team: "player" | "enemy";
  damage: number;
  speed: number;
  age: number;
}

export interface Effect {
  id: number;
  kind: "dust" | "explosion" | "fire" | "heal" | "splash";
  x: number;
  y: number;
  age: number;
  duration: number;
}

export type NoticeKey =
  | "insufficient"
  | "invalidPlacement"
  | "autoSaved"
  | "autoFarmOn"
  | "autoFarmOff"
  | null;

export interface GameState {
  version: 6;
  mode: GameMode;
  level: number;
  time: number;
  resources: Record<ResourceKind, number>;
  units: Unit[];
  buildings: Building[];
  nodes: ResourceNode[];
  projectiles: Projectile[];
  effects: Effect[];
  selectedUnitIds: number[];
  selectedBuildingId?: number;
  buildMode?: "house" | "tower";
  hoverBuildX?: number;
  hoverBuildY?: number;
  populationCap: number;
  wave: number;
  totalWaves: number;
  waveClock: number;
  waveActive: boolean;
  bossSpawned: boolean;
  tutorialStep: number;
  tutorialEnabled: boolean;
  autoFarm: boolean;
  devGodMode: boolean;
  nestsCleared: number;
  endlessTier: number;
  endlessRegionOrder: number[];
  endlessExpansionClock: number;
  outcome: "playing" | "victory" | "defeat";
  notice: NoticeKey;
  noticeAge: number;
  marker?: {
    x: number;
    y: number;
    age: number;
    kind: "move" | "attack" | "gather" | "invalid";
  };
  nextId: number;
}

export interface HoverTarget {
  type: "unit" | "building" | "resource";
  id: number;
  kind: UnitKind | BuildingKind | ResourceKind;
  hp?: number;
  maxHp?: number;
  amount?: number;
  respawnClock?: number;
  boss?: boolean;
}

interface UnitSpec {
  hp: number;
  speed: number;
  damage: number;
  range: number;
  cooldown: number;
  frame: number;
  scale: number;
}

interface BuildingSpec {
  hp: number;
  asset: AssetKey;
  scale: number;
  frame?: number;
  frameHeight?: number;
}

type TerrainKind =
  | "water"
  | "grass"
  | "deep"
  | "autumn"
  | "road"
  | "bridge"
  | "hill"
  | "cliff"
  | "stair";

interface CellRect {
  c: number;
  r: number;
  w: number;
  h: number;
}

interface RangeRect {
  c1: number;
  r1: number;
  c2: number;
  r2: number;
}

interface MapLayout {
  hills: CellRect[];
  roads: RangeRect[];
  bridges: RangeRect[];
  stairs: RangeRect[];
  palette: "spring" | "deep" | "autumn" | "coast";
}

interface CampLayout {
  kind: EnemyBuildingKind;
  x: number;
  y: number;
}

export const UNIT_SPEC: Record<UnitKind, UnitSpec> = {
  pawn: { hp: 80, speed: 96, damage: 4, range: 36, cooldown: 1.3, frame: 192, scale: 0.54 },
  warrior: { hp: 190, speed: 96, damage: 27, range: 48, cooldown: 0.82, frame: 192, scale: 0.6 },
  lancer: { hp: 310, speed: 78, damage: 22, range: 68, cooldown: 1, frame: 320, scale: 0.42 },
  archer: { hp: 120, speed: 91, damage: 22, range: 245, cooldown: 1.15, frame: 192, scale: 0.56 },
  monk: { hp: 130, speed: 89, damage: 8, range: 150, cooldown: 1.4, frame: 192, scale: 0.56 },
  gnome: { hp: 68, speed: 86, damage: 11, range: 40, cooldown: 0.85, frame: 192, scale: 0.54 },
  goblin: { hp: 105, speed: 77, damage: 16, range: 58, cooldown: 1, frame: 256, scale: 0.435 },
  gnoll: { hp: 145, speed: 70, damage: 22, range: 190, cooldown: 1.35, frame: 192, scale: 0.61 },
  thief: { hp: 96, speed: 118, damage: 17, range: 40, cooldown: 0.68, frame: 192, scale: 0.54 },
  skull: { hp: 170, speed: 65, damage: 23, range: 46, cooldown: 1.05, frame: 192, scale: 0.59 },
  panda: { hp: 240, speed: 68, damage: 26, range: 50, cooldown: 1.05, frame: 256, scale: 0.48 },
  minotaur: { hp: 620, speed: 59, damage: 48, range: 76, cooldown: 1.5, frame: 320, scale: 0.52 },
  troll: { hp: 1450, speed: 48, damage: 82, range: 92, cooldown: 3.2, frame: 384, scale: 0.58 },
};

export const BUILDING_SPEC: Record<BuildingKind, BuildingSpec> = {
  castle: { hp: 1700, asset: "castle", scale: 0.82 },
  house: { hp: 440, asset: "house1", scale: 0.72 },
  barracks: { hp: 760, asset: "barracks", scale: 0.68 },
  archery: { hp: 660, asset: "archery", scale: 0.66 },
  monastery: { hp: 640, asset: "monastery", scale: 0.61 },
  tower: { hp: 800, asset: "tower", scale: 0.73 },
  cave: { hp: 1500, asset: "cave", scale: 0.96, frame: 192 },
  goblinHouse: { hp: 620, asset: "goblinHouse", scale: 0.68 },
  goblinTower: {
    hp: 760,
    asset: "goblinTower",
    scale: 0.61,
    frame: 256,
    frameHeight: 192,
  },
  rootTree: { hp: 1750, asset: "deadTree", scale: 0.76 },
};

export const UNIT_COST: Record<
  PlayerUnitKind,
  { wood: number; gold: number; meat: number; time: number }
> = {
  pawn: { wood: 0, gold: 0, meat: 35, time: 6 },
  warrior: { wood: 0, gold: 22, meat: 45, time: 8 },
  lancer: { wood: 30, gold: 35, meat: 45, time: 11 },
  archer: { wood: 42, gold: 26, meat: 35, time: 9 },
  monk: { wood: 15, gold: 55, meat: 40, time: 12 },
};

export const BUILD_COST = {
  house: { wood: 85, gold: 18, meat: 0 },
  tower: { wood: 120, gold: 68, meat: 0 },
} as const;

const PLAYER_SPRITES: Record<
  PlayerUnitKind,
  { idle: AssetKey; run: AssetKey; action: AssetKey }
> = {
  pawn: { idle: "pawnIdle", run: "pawnRun", action: "pawnAxe" },
  warrior: { idle: "warriorIdle", run: "warriorRun", action: "warriorAttack" },
  lancer: { idle: "lancerIdle", run: "lancerRun", action: "lancerAttack" },
  archer: { idle: "archerIdle", run: "archerRun", action: "archerAttack" },
  monk: { idle: "monkIdle", run: "monkRun", action: "monkHeal" },
};

const ENEMY_SPRITES: Record<
  EnemyKind,
  { idle: AssetKey; run: AssetKey; action: AssetKey }
> = {
  gnome: { idle: "gnomeIdle", run: "gnomeRun", action: "gnomeAttack" },
  goblin: { idle: "goblinIdle", run: "goblinRun", action: "goblinAttack" },
  gnoll: { idle: "gnollIdle", run: "gnollRun", action: "gnollAttack" },
  thief: { idle: "thiefIdle", run: "thiefRun", action: "thiefAttack" },
  skull: { idle: "skullIdle", run: "skullRun", action: "skullAttack" },
  panda: { idle: "pandaIdle", run: "pandaRun", action: "pandaAttack" },
  minotaur: { idle: "minotaurIdle", run: "minotaurRun", action: "minotaurAttack" },
  troll: { idle: "trollIdle", run: "trollRun", action: "trollAttack" },
};

const PLAYER_SPAWN = { x: 650, y: 1510 };
const ENEMY_SPAWNS = [
  { x: 2600, y: 360 },
  { x: 2580, y: 1060 },
  { x: 2680, y: 1570 },
];

export const MAP_COUNT = 4;

const MAP_LAYOUTS: Record<number, MapLayout> = {
  1: {
    hills: [
      { c: 9, r: 3, w: 7, h: 4 },
      { c: 29, r: 18, w: 7, h: 4 },
      { c: 36, r: 8, w: 5, h: 3 },
    ],
    roads: [
      { c1: 5, r1: 23, c2: 24, r2: 24 },
      { c1: 23, r1: 8, c2: 42, r2: 9 },
      { c1: 15, r1: 14, c2: 19, r2: 15 },
    ],
    bridges: [
      { c1: 22, r1: 8, c2: 24, r2: 9 },
      { c1: 22, r1: 23, c2: 24, r2: 24 },
      { c1: 7, r1: 14, c2: 12, r2: 15 },
    ],
    stairs: [
      { c1: 12, r1: 5, c2: 12, r2: 8 },
      { c1: 32, r1: 20, c2: 32, r2: 23 },
    ],
    palette: "spring",
  },
  2: {
    hills: [
      { c: 5, r: 4, w: 8, h: 5 },
      { c: 27, r: 4, w: 7, h: 5 },
      { c: 35, r: 21, w: 7, h: 4 },
    ],
    roads: [
      { c1: 5, r1: 22, c2: 20, r2: 24 },
      { c1: 18, r1: 6, c2: 43, r2: 8 },
      { c1: 28, r1: 14, c2: 33, r2: 18 },
    ],
    bridges: [
      { c1: 17, r1: 6, c2: 19, r2: 7 },
      { c1: 17, r1: 23, c2: 19, r2: 24 },
      { c1: 31, r1: 14, c2: 32, r2: 16 },
    ],
    stairs: [
      { c1: 9, r1: 7, c2: 9, r2: 10 },
      { c1: 30, r1: 7, c2: 30, r2: 10 },
      { c1: 38, r1: 23, c2: 38, r2: 26 },
    ],
    palette: "deep",
  },
  3: {
    hills: [
      { c: 3, r: 12, w: 7, h: 5 },
      { c: 18, r: 4, w: 7, h: 4 },
      { c: 35, r: 9, w: 8, h: 5 },
    ],
    roads: [
      { c1: 5, r1: 22, c2: 25, r2: 24 },
      { c1: 22, r1: 10, c2: 43, r2: 12 },
      { c1: 16, r1: 17, c2: 28, r2: 18 },
    ],
    bridges: [
      { c1: 22, r1: 10, c2: 24, r2: 11 },
      { c1: 22, r1: 24, c2: 24, r2: 25 },
      { c1: 10, r1: 9, c2: 16, r2: 10 },
      { c1: 29, r1: 20, c2: 35, r2: 21 },
    ],
    stairs: [
      { c1: 6, r1: 15, c2: 6, r2: 18 },
      { c1: 21, r1: 6, c2: 21, r2: 9 },
      { c1: 39, r1: 12, c2: 39, r2: 16 },
    ],
    palette: "autumn",
  },
  4: {
    hills: [
      { c: 18, r: 5, w: 10, h: 5 },
      { c: 5, r: 18, w: 7, h: 5 },
      { c: 37, r: 18, w: 7, h: 5 },
    ],
    roads: [
      { c1: 5, r1: 22, c2: 16, r2: 24 },
      { c1: 14, r1: 8, c2: 34, r2: 10 },
      { c1: 33, r1: 17, c2: 43, r2: 19 },
    ],
    bridges: [
      { c1: 13, r1: 8, c2: 15, r2: 9 },
      { c1: 13, r1: 23, c2: 15, r2: 24 },
      { c1: 32, r1: 17, c2: 34, r2: 18 },
    ],
    stairs: [
      { c1: 22, r1: 8, c2: 22, r2: 11 },
      { c1: 8, r1: 21, c2: 8, r2: 25 },
      { c1: 40, r1: 21, c2: 40, r2: 25 },
    ],
    palette: "coast",
  },
};

const STAGE_CAMPS: Record<number, CampLayout[]> = {
  1: [
    { kind: "cave", x: 1880, y: 340 },
    { kind: "goblinHouse", x: 2700, y: 900 },
    { kind: "goblinTower", x: 2260, y: 1720 },
  ],
  2: [
    { kind: "cave", x: 1640, y: 350 },
    { kind: "goblinHouse", x: 2660, y: 480 },
    { kind: "goblinTower", x: 1740, y: 1740 },
    { kind: "rootTree", x: 2740, y: 1710 },
  ],
  3: [
    { kind: "cave", x: 1640, y: 340 },
    { kind: "goblinHouse", x: 2720, y: 330 },
    { kind: "goblinTower", x: 1940, y: 980 },
    { kind: "rootTree", x: 2720, y: 1480 },
    { kind: "cave", x: 1660, y: 1760 },
  ],
  4: [
    { kind: "cave", x: 1680, y: 340 },
    { kind: "goblinHouse", x: 2700, y: 390 },
    { kind: "goblinTower", x: 1730, y: 1070 },
    { kind: "rootTree", x: 2730, y: 1080 },
    { kind: "cave", x: 1680, y: 1740 },
    { kind: "goblinHouse", x: 2700, y: 1730 },
  ],
};

const ENDLESS_REGION_WIDTH = 12;
const ENDLESS_REGION_TEMPLATES: Record<number, MapLayout> = {
  1: {
    hills: [
      { c: 2, r: 5, w: 4, h: 3 },
      { c: 7, r: 19, w: 3, h: 3 },
    ],
    roads: [{ c1: 4, r1: 7, c2: 7, r2: 25 }],
    bridges: [],
    stairs: [
      { c1: 4, r1: 7, c2: 4, r2: 9 },
      { c1: 8, r1: 21, c2: 8, r2: 23 },
    ],
    palette: "spring",
  },
  2: {
    hills: [
      { c: 6, r: 5, w: 4, h: 4 },
      { c: 2, r: 20, w: 4, h: 3 },
    ],
    roads: [{ c1: 3, r1: 8, c2: 8, r2: 24 }],
    bridges: [],
    stairs: [
      { c1: 7, r1: 7, c2: 7, r2: 10 },
      { c1: 4, r1: 21, c2: 4, r2: 24 },
    ],
    palette: "deep",
  },
  3: {
    hills: [
      { c: 2, r: 11, w: 4, h: 4 },
      { c: 7, r: 21, w: 3, h: 3 },
    ],
    roads: [{ c1: 3, r1: 6, c2: 8, r2: 25 }],
    bridges: [],
    stairs: [
      { c1: 4, r1: 13, c2: 4, r2: 16 },
      { c1: 8, r1: 22, c2: 8, r2: 25 },
    ],
    palette: "autumn",
  },
  4: {
    hills: [
      { c: 6, r: 6, w: 4, h: 4 },
      { c: 2, r: 18, w: 4, h: 4 },
    ],
    roads: [{ c1: 3, r1: 7, c2: 8, r2: 25 }],
    bridges: [],
    stairs: [
      { c1: 7, r1: 8, c2: 7, r2: 11 },
      { c1: 4, r1: 20, c2: 4, r2: 23 },
    ],
    palette: "coast",
  },
};

function mapLayout(level: number) {
  return MAP_LAYOUTS[Math.max(1, Math.min(MAP_COUNT, level))];
}

function inside(c: number, r: number, rect: { c: number; r: number; w: number; h: number }) {
  return c >= rect.c && c < rect.c + rect.w && r >= rect.r && r < rect.r + rect.h;
}

function inRange(c: number, r: number, rect: { c1: number; r1: number; c2: number; r2: number }) {
  return c >= rect.c1 && c <= rect.c2 && r >= rect.r1 && r <= rect.r2;
}

function terrainAtCell(c: number, r: number, level = 1): TerrainKind {
  const layout = mapLayout(level);
  if (c < 3 || r < 3 || c >= COLS - 3 || r >= ROWS - 3) return "water";
  const bridge = layout.bridges.some((rect) => inRange(c, r, rect));
  if (bridge) return "bridge";
  const stair = layout.stairs.some((rect) => inRange(c, r, rect));
  if (stair) return "stair";
  const water =
    level === 1
      ? (c >= 22 && c <= 24) ||
        (c >= 7 && c <= 12 && r >= 12 && r <= 17) ||
        (c >= 34 && c <= 40 && r <= 6) ||
        (c >= 35 && c <= 42 && r >= 26)
      : level === 2
        ? (c >= 17 && c <= 19) ||
          (r >= 14 && r <= 16 && c >= 18 && c <= 42) ||
          (c >= 2 && c <= 7 && r >= 26)
        : level === 3
          ? (c >= 22 && c <= 24) ||
            (c >= 10 && c <= 16 && r >= 7 && r <= 13) ||
            (c >= 29 && c <= 35 && r >= 17 && r <= 23)
          : (c >= 13 && c <= 15) ||
            (c >= 32 && c <= 34 && r >= 10) ||
            (r >= 2 && r <= 5 && c >= 3 && c <= 10) ||
            (r >= 26 && c >= 20 && c <= 30);
  if (water) return "water";
  if (layout.hills.some((rect) => inside(c, r, rect))) return "hill";
  if (
    layout.hills.some(
      (rect) =>
        c >= rect.c &&
        c < rect.c + rect.w &&
        r >= rect.r + rect.h &&
        r < rect.r + rect.h + 2,
    )
  ) {
    return "cliff";
  }
  if (layout.roads.some((rect) => inRange(c, r, rect))) return "road";
  if (layout.palette === "autumn" || (layout.palette === "coast" && c > 26)) return "autumn";
  if (layout.palette === "deep" || r < 9 || (c > 26 && r > 17)) return "deep";
  return "grass";
}

function endlessRegionMap(state: GameState, region: number) {
  return state.endlessRegionOrder[region] ?? ((region % MAP_COUNT) + 1);
}

function endlessTerrainAtCell(state: GameState, c: number, r: number): TerrainKind {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return "water";
  const region = Math.floor(c / ENDLESS_REGION_WIDTH);
  if (region >= state.endlessTier) return "water";
  const localC = c % ENDLESS_REGION_WIDTH;
  const mapId = endlessRegionMap(state, region);
  const layout = ENDLESS_REGION_TEMPLATES[mapId];
  if (r < 3 || r >= ROWS - 3) return "water";

  const connectionRow = r >= 14 && r <= 16;
  if (
    connectionRow &&
    ((localC === 0 && region > 0) ||
      (localC === ENDLESS_REGION_WIDTH - 1 && region + 1 < state.endlessTier))
  ) {
    return "bridge";
  }
  if (localC === 0 || localC === ENDLESS_REGION_WIDTH - 1) return "water";
  if (layout.stairs.some((rect) => inRange(localC, r, rect))) return "stair";

  const inlet =
    mapId === 1
      ? localC >= 7 && localC <= 9 && r >= 10 && r <= 13
      : mapId === 2
        ? localC >= 2 && localC <= 4 && r >= 11 && r <= 15
        : mapId === 3
          ? localC >= 6 && localC <= 9 && r >= 5 && r <= 8
          : localC >= 2 && localC <= 4 && r >= 23 && r <= 26;
  if (inlet) return "water";
  if (layout.hills.some((rect) => inside(localC, r, rect))) return "hill";
  if (
    layout.hills.some(
      (rect) =>
        localC >= rect.c &&
        localC < rect.c + rect.w &&
        r >= rect.r + rect.h &&
        r < rect.r + rect.h + 2,
    )
  ) {
    return "cliff";
  }
  if (layout.roads.some((rect) => inRange(localC, r, rect))) return "road";
  if (layout.palette === "autumn" || (layout.palette === "coast" && r > 16)) return "autumn";
  if (layout.palette === "deep" || r < 9) return "deep";
  return "grass";
}

function stateTerrainAtCell(state: GameState, c: number, r: number) {
  return state.mode === "endless"
    ? endlessTerrainAtCell(state, c, r)
    : terrainAtCell(c, r, state.level);
}

function cellWalkable(c: number, r: number, level = 1) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
  const kind = terrainAtCell(c, r, level);
  return kind !== "water" && kind !== "cliff";
}

function stateCellWalkable(state: GameState, c: number, r: number) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
  const kind = stateTerrainAtCell(state, c, r);
  return kind !== "water" && kind !== "cliff";
}

function terrainTransitionAllowed(
  state: GameState,
  fromC: number,
  fromR: number,
  toC: number,
  toR: number,
) {
  const from = stateTerrainAtCell(state, fromC, fromR);
  const to = stateTerrainAtCell(state, toC, toR);
  if (from === "water" || from === "cliff" || to === "water" || to === "cliff") {
    return false;
  }
  if (from === "stair" || to === "stair") return true;
  return (from === "hill") === (to === "hill");
}

export function isWalkable(x: number, y: number, padding = 18, level = 1) {
  const samples = [
    [x, y],
    [x - padding, y - padding],
    [x + padding, y - padding],
    [x - padding, y + padding],
    [x + padding, y + padding],
  ];
  return samples.every(([sx, sy]) =>
    cellWalkable(Math.floor(sx / TILE), Math.floor(sy / TILE), level),
  );
}

function stateIsWalkable(state: GameState, x: number, y: number, padding = 18) {
  const samples = [
    [x, y],
    [x - padding, y - padding],
    [x + padding, y - padding],
    [x - padding, y + padding],
    [x + padding, y + padding],
  ];
  return samples.every(
    ([sx, sy]) =>
      stateCellWalkable(state, Math.floor(sx / TILE), Math.floor(sy / TILE)) &&
      !pointBlockedByDecor(state, sx, sy),
  );
}

function nearestStateWalkablePoint(
  state: GameState,
  x: number,
  y: number,
  padding: number,
) {
  if (stateIsWalkable(state, x, y, padding)) return { x, y };
  const baseC = Math.floor(x / TILE);
  const baseR = Math.floor(y / TILE);
  for (let radius = 1; radius < 16; radius += 1) {
    for (let r = baseR - radius; r <= baseR + radius; r += 1) {
      for (let c = baseC - radius; c <= baseC + radius; c += 1) {
        if (Math.abs(c - baseC) !== radius && Math.abs(r - baseR) !== radius) continue;
        const candidate = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 };
        if (stateIsWalkable(state, candidate.x, candidate.y, padding)) return candidate;
      }
    }
  }
  return null;
}

function buildingPointAllowed(
  state: GameState,
  building: Building,
  x: number,
  y: number,
) {
  if (!stateIsWalkable(state, x, y, 42)) return false;
  if (stateTerrainAtCell(state, Math.floor(x / TILE), Math.floor(y / TILE)) === "bridge") {
    return false;
  }
  return !state.buildings.some((other) => {
    if (other.id === building.id || other.hp <= 0) return false;
    const enemyPair = building.team === "enemy" && other.team === "enemy";
    const mixedTeams = building.team !== other.team;
    const buffer = mixedTeams ? 470 : enemyPair ? 330 : 145;
    return distance(x, y, other.x, other.y) < buffer;
  });
}

function nearestBuildingPoint(state: GameState, building: Building) {
  const baseC = Math.floor(building.x / TILE);
  const baseR = Math.floor(building.y / TILE);
  for (let radius = 0; radius < 18; radius += 1) {
    for (let r = baseR - radius; r <= baseR + radius; r += 1) {
      for (let c = baseC - radius; c <= baseC + radius; c += 1) {
        if (
          radius > 0 &&
          Math.abs(c - baseC) !== radius &&
          Math.abs(r - baseR) !== radius
        ) {
          continue;
        }
        const candidate = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 };
        if (buildingPointAllowed(state, building, candidate.x, candidate.y)) return candidate;
      }
    }
  }
  return nearestStateWalkablePoint(state, building.x, building.y, 42);
}

function resourcePointAllowed(
  state: GameState,
  node: ResourceNode,
  x: number,
  y: number,
) {
  if (!stateIsWalkable(state, x, y, node.kind === "wood" ? 30 : 22)) return false;
  if (stateTerrainAtCell(state, Math.floor(x / TILE), Math.floor(y / TILE)) === "bridge") {
    return false;
  }
  if (
    state.buildings.some((building) => {
      if (building.hp <= 0) return false;
      const buffer = building.team === "enemy" ? 220 : 125;
      return distance(x, y, building.x, building.y) < buffer;
    })
  ) {
    return false;
  }
  return !state.nodes.some((other) => {
    if (other.id === node.id || other.amount <= 0) return false;
    const buffer = node.kind === "wood" || other.kind === "wood" ? 82 : 64;
    return distance(x, y, other.x, other.y) < buffer;
  });
}

function nearestResourcePoint(state: GameState, node: ResourceNode) {
  const baseC = Math.floor(node.x / TILE);
  const baseR = Math.floor(node.y / TILE);
  for (let radius = 0; radius < 18; radius += 1) {
    for (let r = baseR - radius; r <= baseR + radius; r += 1) {
      for (let c = baseC - radius; c <= baseC + radius; c += 1) {
        if (
          radius > 0 &&
          Math.abs(c - baseC) !== radius &&
          Math.abs(r - baseR) !== radius
        ) {
          continue;
        }
        const candidate = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 };
        if (resourcePointAllowed(state, node, candidate.x, candidate.y)) return candidate;
      }
    }
  }
  return nearestStateWalkablePoint(state, node.x, node.y, node.kind === "wood" ? 30 : 22);
}

function nearestWalkablePoint(
  x: number,
  y: number,
  level: number,
  padding: number,
) {
  if (isWalkable(x, y, padding, level)) return { x, y };
  const baseC = Math.floor(x / TILE);
  const baseR = Math.floor(y / TILE);
  for (let radius = 1; radius < 14; radius += 1) {
    for (let r = baseR - radius; r <= baseR + radius; r += 1) {
      for (let c = baseC - radius; c <= baseC + radius; c += 1) {
        if (Math.abs(c - baseC) !== radius && Math.abs(r - baseR) !== radius) continue;
        const candidate = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 };
        if (isWalkable(candidate.x, candidate.y, padding, level)) return candidate;
      }
    }
  }
  return null;
}

export function worldWidthForState(state: GameState) {
  return state.mode === "endless"
    ? state.endlessTier * ENDLESS_REGION_WIDTH * TILE
    : WORLD_W;
}

export function clampCamera(camera: Camera, state?: GameState) {
  camera.zoom = Math.max(0.25, Math.min(1.5, camera.zoom || 1));
  const worldWidth = state ? worldWidthForState(state) : WORLD_W;
  const maxX = worldWidth - VIEW_W / camera.zoom;
  const maxY = WORLD_H - VIEW_H / camera.zoom;
  camera.x =
    maxX < 0 ? maxX / 2 : Math.max(0, Math.min(maxX, camera.x));
  camera.y =
    maxY < 0 ? maxY / 2 : Math.max(0, Math.min(maxY, camera.y));
}

export function createCamera(state: GameState): Camera {
  const castle = state.buildings.find((building) => building.kind === "castle");
  const camera = {
    x: (castle?.x ?? PLAYER_SPAWN.x) - VIEW_W * 0.43,
    y: (castle?.y ?? PLAYER_SPAWN.y) - VIEW_H * 0.62,
    zoom: 1,
  };
  clampCamera(camera, state);
  return camera;
}

function nearestWalkableCell(c: number, r: number, level: number) {
  if (cellWalkable(c, r, level)) return { c, r };
  for (let radius = 1; radius < 12; radius += 1) {
    for (let y = r - radius; y <= r + radius; y += 1) {
      for (let x = c - radius; x <= c + radius; x += 1) {
        if (
          (Math.abs(x - c) === radius || Math.abs(y - r) === radius) &&
          cellWalkable(x, y, level)
        ) {
          return { c: x, r: y };
        }
      }
    }
  }
  return null;
}

function pathCellWalkable(
  state: GameState,
  c: number,
  r: number,
  allowX: number,
  allowY: number,
) {
  if (!stateCellWalkable(state, c, r)) return false;
  const x = c * TILE + TILE / 2;
  const y = r * TILE + TILE / 2;
  if (distance(x, y, allowX, allowY) < 78) return true;
  const blockedByBuilding = state.buildings.some((building) => {
    if (building.hp <= 0) return false;
    const size = getBuildingSize(building.kind);
    const radius =
      building.team === "enemy"
        ? Math.min(112, Math.max(70, size.w * 0.34))
        : Math.min(82, Math.max(48, size.w * 0.3));
    return distance(x, y, building.x, building.y) < radius;
  });
  if (blockedByBuilding) return false;
  if (pointBlockedByDecor(state, x, y)) return false;
  return !state.nodes.some(
    (node) =>
      node.amount > 0 &&
      node.kind === "wood" &&
      distance(x, y, node.x, node.y) < 38,
  );
}

function nearestStateWalkableCell(
  state: GameState,
  c: number,
  r: number,
  allowX: number,
  allowY: number,
) {
  if (pathCellWalkable(state, c, r, allowX, allowY)) return { c, r };
  for (let radius = 1; radius < 14; radius += 1) {
    for (let y = r - radius; y <= r + radius; y += 1) {
      for (let x = c - radius; x <= c + radius; x += 1) {
        if (
          (Math.abs(x - c) === radius || Math.abs(y - r) === radius) &&
          pathCellWalkable(state, x, y, allowX, allowY)
        ) {
          return { c: x, r: y };
        }
      }
    }
  }
  return null;
}

function findPath(
  state: GameState,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
): Point[] {
  const start = nearestStateWalkableCell(
    state,
    Math.floor(startX / TILE),
    Math.floor(startY / TILE),
    startX,
    startY,
  );
  const goal = nearestStateWalkableCell(
    state,
    Math.floor(targetX / TILE),
    Math.floor(targetY / TILE),
    targetX,
    targetY,
  );
  if (!start || !goal) return [];
  const startKey = start.r * COLS + start.c;
  const goalKey = goal.r * COLS + goal.c;
  if (startKey === goalKey) return [{ x: targetX, y: targetY }];

  const open = [startKey];
  const came = new Map<number, number>();
  const g = new Map<number, number>([[startKey, 0]]);
  const f = new Map<number, number>([
    [startKey, Math.hypot(goal.c - start.c, goal.r - start.r)],
  ]);
  const inOpen = new Set(open);
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  while (open.length) {
    let bestIndex = 0;
    for (let index = 1; index < open.length; index += 1) {
      if ((f.get(open[index]) ?? Infinity) < (f.get(open[bestIndex]) ?? Infinity)) {
        bestIndex = index;
      }
    }
    const current = open.splice(bestIndex, 1)[0];
    inOpen.delete(current);
    if (current === goalKey) {
      const keys = [current];
      let cursor = current;
      while (came.has(cursor)) {
        cursor = came.get(cursor)!;
        keys.push(cursor);
      }
      keys.reverse();
      const points = keys.slice(1).map((key) => ({
        x: (key % COLS) * TILE + TILE / 2,
        y: Math.floor(key / COLS) * TILE + TILE / 2,
      }));
      points.push({
        x: stateCellWalkable(state, Math.floor(targetX / TILE), Math.floor(targetY / TILE))
          ? targetX
          : goal.c * TILE + TILE / 2,
        y: stateCellWalkable(state, Math.floor(targetX / TILE), Math.floor(targetY / TILE))
          ? targetY
          : goal.r * TILE + TILE / 2,
      });
      return points;
    }

    const cc = current % COLS;
    const cr = Math.floor(current / COLS);
    for (const [dc, dr] of directions) {
      const nc = cc + dc;
      const nr = cr + dr;
      if (!pathCellWalkable(state, nc, nr, targetX, targetY)) continue;
      if (!terrainTransitionAllowed(state, cc, cr, nc, nr)) continue;
      if (
        dc &&
        dr &&
        (!pathCellWalkable(state, cc + dc, cr, targetX, targetY) ||
          !pathCellWalkable(state, cc, cr + dr, targetX, targetY) ||
          !terrainTransitionAllowed(state, cc, cr, cc + dc, cr) ||
          !terrainTransitionAllowed(state, cc, cr, cc, cr + dr))
      ) {
        continue;
      }
      const neighbor = nr * COLS + nc;
      const tentative = (g.get(current) ?? Infinity) + (dc && dr ? 1.414 : 1);
      if (tentative >= (g.get(neighbor) ?? Infinity)) continue;
      came.set(neighbor, current);
      g.set(neighbor, tentative);
      f.set(neighbor, tentative + Math.hypot(goal.c - nc, goal.r - nr));
      if (!inOpen.has(neighbor)) {
        open.push(neighbor);
        inOpen.add(neighbor);
      }
    }
  }
  return [];
}

function nextId(state: GameState) {
  const id = state.nextId;
  state.nextId += 1;
  return id;
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function createUnit(
  id: number,
  kind: UnitKind,
  team: "player" | "enemy",
  x: number,
  y: number,
  level = 1,
): Unit {
  const spec = UNIT_SPEC[kind];
  const difficulty = team === "enemy" ? 1 + Math.max(0, level - 1) * 0.16 : 1;
  return {
    id,
    kind,
    team,
    x,
    y,
    targetX: x,
    targetY: y,
    hp: Math.round(spec.hp * difficulty),
    maxHp: Math.round(spec.hp * difficulty),
    action: kind === "lancer" ? "guard" : "idle",
    facing: team === "player" ? 1 : -1,
    anim: Math.random() * 1.8,
    attackClock: Math.random() * 0.3,
    healClock: 0,
    specialClock: 0,
    pathClock: 0,
    path: [],
    gatherClock: 0,
    carryAmount: 0,
  };
}

function createBuilding(
  id: number,
  kind: BuildingKind,
  team: "player" | "enemy",
  x: number,
  y: number,
  variant = 0,
): Building {
  const spec = BUILDING_SPEC[kind];
  return {
    id,
    kind,
    team,
    x,
    y,
    hp: spec.hp,
    maxHp: spec.hp,
    attackClock: 0,
    construction: 1,
    variant,
    respawnClock: 0,
    cleared: false,
  };
}

function createNode(
  id: number,
  kind: ResourceKind,
  x: number,
  y: number,
  amount: number,
  variant: number,
): ResourceNode {
  return {
    id,
    kind,
    x,
    y,
    amount,
    maxAmount: amount,
    variant,
    respawnClock: 0,
    respawnDelay: kind === "wood" ? 30 : kind === "gold" ? 40 : 27,
  };
}

function shuffledRegionOrder() {
  const rest = [2, 3, 4];
  for (let index = rest.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [rest[index], rest[swap]] = [rest[swap], rest[index]];
  }
  return [1, ...rest];
}

function stageResourceLayout(level: number) {
  const base: Array<[ResourceKind, number, number, number]> = [
    ["wood", 1120, 1430, 0],
    ["wood", 1200, 1500, 1],
    ["wood", 1080, 1610, 2],
    ["wood", 1270, 1700, 3],
    ["wood", 450, 1020, 1],
    ["wood", 560, 940, 3],
    ["wood", 1850, 470, 0],
    ["wood", 1970, 550, 2],
    ["wood", 2150, 1190, 1],
    ["wood", 2230, 1280, 3],
    ["wood", 1760, 1760, 0],
    ["wood", 1890, 1830, 2],
    ["wood", 330, 430, 3],
    ["wood", 760, 470, 0],
    ["wood", 1480, 820, 2],
    ["gold", 1180, 1820, 0],
    ["gold", 1320, 1800, 1],
    ["gold", 490, 760, 2],
    ["gold", 1780, 990, 3],
    ["gold", 2310, 720, 4],
    ["gold", 2380, 1770, 5],
    ["gold", 820, 360, 1],
    ["gold", 2860, 1160, 5],
    ["meat", 960, 1810, 0],
    ["meat", 1050, 1740, 1],
    ["meat", 350, 1180, 2],
    ["meat", 1830, 1360, 3],
    ["meat", 2100, 810, 0],
    ["meat", 2440, 1370, 1],
    ["meat", 980, 620, 2],
    ["meat", 1540, 430, 3],
    ["meat", 2850, 1500, 0],
  ];
  const shifts = [
    { x: 0, y: 0 },
    { x: 120, y: -95 },
    { x: -90, y: 80 },
    { x: 70, y: 55 },
  ][level - 1];
  const shifted = base.map(([kind, x, y, variant], index) => [
    kind,
    x + shifts.x * (index % 2 ? 1 : -0.45),
    y + shifts.y * (index % 3 ? 0.65 : -0.35),
    variant + level - 1,
  ] as [ResourceKind, number, number, number]);
  const extras: Array<[ResourceKind, number, number, number]> = [
    ["wood", 1520, 720, level],
    ["gold", 1460, 1320, level + 3],
    ["meat", 820, 520, level + 1],
    ["wood", 2050, 1530, level + 2],
    ["meat", 1550, 1750, level + 2],
    ["gold", 900, 1180, level + 4],
  ];
  return shifted.concat(extras.slice(0, Math.max(0, level - 1) * 2));
}

function addEndlessRegionContent(state: GameState, region: number, initial = false) {
  const baseX = region * ENDLESS_REGION_WIDTH * TILE;
  const campSlots = [
    { x: 570, y: 350 },
    { x: 245, y: 760 },
    { x: 590, y: 1110 },
    { x: 260, y: 1510 },
    { x: 555, y: 1740 },
  ];
  const count = Math.min(campSlots.length, 3 + region);
  const campKinds: CampLayout["kind"][] = [
    "cave",
    "goblinHouse",
    "goblinTower",
    "rootTree",
  ];
  for (let index = 0; index < count; index += 1) {
    const slot = campSlots[(index + region) % campSlots.length];
    const camp = createBuilding(
      nextId(state),
      campKinds[(index + region) % campKinds.length],
      "enemy",
      baseX + slot.x,
      slot.y,
      region,
    );
    const safe = nearestBuildingPoint(state, camp);
    if (safe) {
      camp.x = safe.x;
      camp.y = safe.y;
    }
    state.buildings.push(camp);
  }

  const resources: Array<[ResourceKind, number, number, number]> = [
    ["wood", 170, 430, region],
    ["wood", 610, 610, region + 1],
    ["wood", 165, 1080, region + 2],
    ["wood", 610, 1370, region + 3],
    ["gold", 350, 570, region],
    ["gold", 410, 1260, region + 3],
    ["meat", 200, 1320, region],
    ["meat", 520, 920, region + 1],
    ["meat", 390, 1710, region + 2],
  ];
  for (const [kind, localX, y, variant] of resources) {
    const node = createNode(
      nextId(state),
      kind,
      baseX + localX,
      y,
      kind === "gold" ? 120 + region * 12 : kind === "meat" ? 86 + region * 8 : 145,
      variant,
    );
    const safe = nearestResourcePoint(state, node);
    if (safe) {
      node.x = safe.x;
      node.y = safe.y;
    }
    state.nodes.push(node);
  }

  if (!initial) {
    state.resources.wood += 120 + region * 35;
    state.resources.gold += 85 + region * 30;
    state.resources.meat += 95 + region * 28;
    state.populationCap += 5;
    const entryX = baseX + 110;
    const pawn = createUnit(nextId(state), "pawn", "player", entryX, 1510);
    const reinforcement = createUnit(
      nextId(state),
      region >= 2 ? "lancer" : "warrior",
      "player",
      entryX + 58,
      1570,
    );
    state.units.push(pawn, reinforcement);
    addEffect(state, "heal", entryX + 25, 1520, 0.9);
  }
}

export function createInitialGame(
  tutorialEnabled = true,
  mode: GameMode = "stage",
  level = 1,
): GameState {
  level = Math.max(1, Math.min(MAP_COUNT, level));
  const state: GameState = {
    version: 6,
    mode,
    level,
    time: 0,
    resources:
      mode === "endless"
        ? { wood: 260, gold: 185, meat: 190 }
        : {
            wood: 190 + (level - 1) * 55,
            gold: 140 + (level - 1) * 42,
            meat: 155 + (level - 1) * 48,
          },
    units: [],
    buildings: [],
    nodes: [],
    projectiles: [],
    effects: [],
    selectedUnitIds: [],
    populationCap: mode === "endless" ? 18 : 12 + Math.max(0, level - 1) * 2,
    wave: 0,
    totalWaves: mode === "stage" ? [4, 5, 5, 6][level - 1] : 0,
    waveClock: mode === "stage" ? 48 : 34,
    waveActive: false,
    bossSpawned: false,
    tutorialStep: tutorialEnabled ? 0 : 7,
    tutorialEnabled,
    autoFarm: mode === "endless",
    devGodMode: false,
    nestsCleared: 0,
    endlessTier: 1,
    endlessRegionOrder: shuffledRegionOrder(),
    endlessExpansionClock: 0,
    outcome: "playing",
    notice: null,
    noticeAge: 0,
    nextId: 1000,
  };

  if (mode === "endless") {
    state.buildings = [
      createBuilding(1, "castle", "player", 345, 1515),
      createBuilding(2, "house", "player", 170, 1700),
      createBuilding(3, "barracks", "player", 570, 1580),
      createBuilding(4, "tower", "player", 635, 1360),
      createBuilding(5, "archery", "player", 320, 1810),
      createBuilding(6, "monastery", "player", 560, 1810),
    ];
    state.units = [
      createUnit(10, "pawn", "player", 300, 1590),
      createUnit(11, "pawn", "player", 370, 1600),
      createUnit(12, "warrior", "player", 470, 1650),
      createUnit(13, "lancer", "player", 530, 1690),
      createUnit(14, "archer", "player", 420, 1740),
      createUnit(15, "monk", "player", 350, 1770),
    ];
    addEndlessRegionContent(state, 0, true);
  } else {
    state.buildings = [
      createBuilding(1, "castle", "player", 560, 1515),
      createBuilding(2, "house", "player", 345, 1680),
      createBuilding(3, "barracks", "player", 800, 1560),
      createBuilding(4, "tower", "player", 955, 1380),
      ...STAGE_CAMPS[level].map((camp, index) =>
        createBuilding(100 + index, camp.kind, "enemy", camp.x, camp.y, index),
      ),
    ];
    if (level >= 2) state.buildings.push(createBuilding(5, "archery", "player", 610, 1810));
    if (level >= 3) state.buildings.push(createBuilding(6, "monastery", "player", 890, 1810));
    state.units = [
      createUnit(10, "pawn", "player", 610, 1580),
      createUnit(11, "pawn", "player", 680, 1570),
      createUnit(12, "warrior", "player", 790, 1670),
      createUnit(13, "lancer", "player", 880, 1690),
    ];
    if (level >= 2) {
      state.units.push(
        createUnit(14, "pawn", "player", 715, 1610),
        createUnit(15, "archer", "player", 710, 1750),
      );
    }
    if (level >= 3) {
      state.units.push(
        createUnit(16, "warrior", "player", 940, 1710),
        createUnit(17, "monk", "player", 820, 1770),
      );
    }
    if (level >= 4) {
      state.units.push(
        createUnit(18, "lancer", "player", 1010, 1660),
        createUnit(19, "archer", "player", 980, 1780),
      );
    }
    state.nodes = stageResourceLayout(level).map(([kind, x, y, variant], index) =>
      createNode(
        200 + index,
        kind,
        x,
        y,
        kind === "gold" ? 130 : kind === "meat" ? 90 : 150,
        variant,
      ),
    );
  }
  for (const building of state.buildings) {
    const safe = nearestBuildingPoint(state, building);
    if (safe) {
      building.x = safe.x;
      building.y = safe.y;
    }
  }
  for (const unit of state.units) {
    const safe = nearestStateWalkablePoint(state, unit.x, unit.y, 18);
    if (safe) {
      unit.x = safe.x;
      unit.y = safe.y;
      unit.targetX = unit.x;
      unit.targetY = unit.y;
    }
  }
  for (const node of state.nodes) {
    const safe = nearestResourcePoint(state, node);
    if (safe) {
      node.x = safe.x;
      node.y = safe.y;
    }
  }
  return state;
}

export function restoreGame(raw: string | null, tutorialEnabled = true) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GameState;
    if (
      parsed.version !== 6 ||
      !Array.isArray(parsed.units) ||
      !Array.isArray(parsed.buildings) ||
      !parsed.resources
    ) {
      return null;
    }
    parsed.tutorialEnabled = tutorialEnabled;
    if (!tutorialEnabled) parsed.tutorialStep = 7;
    parsed.selectedUnitIds = [];
    parsed.selectedBuildingId = undefined;
    parsed.buildMode = undefined;
    parsed.hoverBuildX = undefined;
    parsed.hoverBuildY = undefined;
    parsed.notice = null;
    parsed.noticeAge = 0;
    parsed.projectiles ??= [];
    parsed.effects ??= [];
    parsed.devGodMode = false;
    parsed.endlessTier ??= 1;
    parsed.endlessRegionOrder ??= [1, 2, 3, 4];
    parsed.endlessExpansionClock ??= 0;
    parsed.nodes.forEach((node) => {
      node.respawnClock ??= 0;
      node.respawnDelay ??= node.kind === "wood" ? 30 : node.kind === "gold" ? 40 : 27;
    });
    parsed.units.forEach((unit) => {
      unit.path ??= [];
      unit.pathClock ??= 0;
      unit.specialClock ??= 0;
    });
    parsed.buildings.forEach((building) => {
      building.variant ??= 0;
      building.respawnClock ??= 0;
      building.cleared ??= false;
    });
    parsed.outcome = "playing";
    return parsed;
  } catch {
    return null;
  }
}

export function serializeGame(state: GameState) {
  return JSON.stringify({
    ...state,
    selectedUnitIds: [],
    selectedBuildingId: undefined,
    buildMode: undefined,
    hoverBuildX: undefined,
    hoverBuildY: undefined,
    marker: undefined,
    projectiles: [],
    effects: [],
    notice: null,
  });
}

export function population(state: GameState) {
  return state.units.filter((unit) => unit.team === "player" && unit.hp > 0).length;
}

export function getBuildingSize(kind: BuildingKind) {
  const spec = BUILDING_SPEC[kind];
  const source =
    kind === "castle"
      ? { w: 320, h: 256 }
      : kind === "monastery"
        ? { w: 192, h: 320 }
        : kind === "rootTree"
          ? { w: 384, h: 320 }
        : kind === "cave"
          ? { w: 192, h: 192 }
          : kind === "house"
            ? { w: 128, h: 192 }
            : kind === "tower"
              ? { w: 128, h: 256 }
      : kind === "goblinHouse"
        ? { w: 192, h: 192 }
        : kind === "goblinTower"
          ? { w: 256, h: 192 }
        : { w: 192, h: 256 };
  return { w: source.w * spec.scale, h: source.h * spec.scale };
}

function canAfford(
  state: GameState,
  cost: { wood: number; gold: number; meat: number },
) {
  return (
    state.resources.wood >= cost.wood &&
    state.resources.gold >= cost.gold &&
    state.resources.meat >= cost.meat
  );
}

function spend(state: GameState, cost: { wood: number; gold: number; meat: number }) {
  state.resources.wood -= cost.wood;
  state.resources.gold -= cost.gold;
  state.resources.meat -= cost.meat;
}

function setNotice(state: GameState, notice: Exclude<NoticeKey, null>) {
  state.notice = notice;
  state.noticeAge = 0;
}

export function setAutoFarm(state: GameState, enabled: boolean) {
  state.autoFarm = enabled;
  setNotice(state, enabled ? "autoFarmOn" : "autoFarmOff");
}

export function setDevGodMode(state: GameState, enabled: boolean) {
  state.devGodMode = enabled;
  if (enabled) devHealAll(state);
}

export function devAddResources(state: GameState, amount = 500) {
  state.resources.wood += amount;
  state.resources.gold += amount;
  state.resources.meat += amount;
}

export function devMaxResources(state: GameState) {
  state.resources = { wood: 9999, gold: 9999, meat: 9999 };
}

export function devSetResources(
  state: GameState,
  resources: Record<ResourceKind, number>,
) {
  state.resources = {
    wood: Math.max(0, Math.round(resources.wood)),
    gold: Math.max(0, Math.round(resources.gold)),
    meat: Math.max(0, Math.round(resources.meat)),
  };
}

export function devAdjustPopulationCap(state: GameState, amount: number) {
  state.populationCap = Math.max(
    population(state),
    Math.min(200, state.populationCap + Math.round(amount)),
  );
}

export function devHealAll(state: GameState) {
  for (const unit of state.units) {
    if (unit.team === "player") unit.hp = unit.maxHp;
  }
  for (const building of state.buildings) {
    if (building.team === "player") building.hp = building.maxHp;
  }
}

export function devSpawnPlayer(
  state: GameState,
  kind: PlayerUnitKind,
  count = 1,
) {
  const castle = state.buildings.find(
    (building) => building.kind === "castle" && building.hp > 0,
  );
  const amount = Math.max(1, Math.min(30, Math.round(count)));
  for (let index = 0; index < amount; index += 1) {
    const angle = (index / Math.max(1, amount)) * Math.PI * 2;
    const radius = 210 + Math.floor(index / 10) * 46;
    const x = (castle?.x ?? 560) + Math.cos(angle) * radius;
    const y = (castle?.y ?? 1515) + Math.sin(angle) * radius * 0.85;
    const safe = nearestStateWalkablePoint(state, x, y, 18);
    const unit = createUnit(
      nextId(state),
      kind,
      "player",
      safe?.x ?? x,
      safe?.y ?? y,
      state.level,
    );
    state.units.push(unit);
    addEffect(state, "heal", unit.x, unit.y, 0.45);
  }
  state.populationCap = Math.max(state.populationCap, population(state));
}

export function devSpawnEnemy(
  state: GameState,
  kind: EnemyKind,
  count = 1,
) {
  const castle = state.buildings.find(
    (building) => building.kind === "castle" && building.hp > 0,
  );
  const amount = Math.max(1, Math.min(40, Math.round(count)));
  const activeWidth = worldWidthForState(state);
  for (let index = 0; index < amount; index += 1) {
    const x = Math.min(
      activeWidth - 110,
      (castle?.x ?? 560) + 520 + (index % 5) * 46,
    );
    const y = Math.max(
      180,
      (castle?.y ?? 1515) - 300 + Math.floor(index / 5) * 52,
    );
    const safe = nearestStateWalkablePoint(state, x, y, 18);
    const unit = createUnit(
      nextId(state),
      kind,
      "enemy",
      safe?.x ?? x,
      safe?.y ?? y,
      state.mode === "endless" ? state.endlessTier : state.level,
    );
    unit.boss = kind === "troll" || kind === "minotaur";
    state.units.push(unit);
    addEffect(state, "dust", unit.x, unit.y, 0.55);
  }
}

export function devClearEnemies(state: GameState) {
  state.units = state.units.filter((unit) => unit.team === "player");
  state.waveActive = false;
  state.waveClock = state.mode === "endless" ? 8 : 12;
}

export function devSetPhase(state: GameState, phase: number) {
  const maxPhase =
    state.mode === "stage" ? state.totalWaves : Math.max(1, state.wave + 20);
  const target = Math.max(1, Math.min(maxPhase, Math.round(phase)));
  state.units = state.units.filter((unit) => unit.team === "player");
  state.wave = target - 1;
  state.waveActive = false;
  state.bossSpawned = false;
  state.waveClock = 0;
}

export function devNextWave(state: GameState) {
  state.units = state.units.filter((unit) => unit.team === "player");
  state.waveActive = false;
  state.waveClock = 0;
}

export function devWinMap(state: GameState) {
  state.units = state.units.filter((unit) => unit.team === "player");
  state.waveActive = false;
  if (state.mode === "endless") {
    const activeRegion = state.endlessTier - 1;
    state.buildings
      .filter(
        (building) =>
          building.team === "enemy" &&
          building.hp > 0 &&
          Math.floor(building.x / (ENDLESS_REGION_WIDTH * TILE)) === activeRegion,
      )
      .forEach((building) => damageBuilding(state, building, building.maxHp * 2));
    state.waveClock = 6;
    return;
  }
  state.wave = state.totalWaves;
  state.bossSpawned = true;
  state.buildings
    .filter((building) => building.team === "enemy" && building.hp > 0)
    .forEach((building) => damageBuilding(state, building, building.maxHp * 2));
  state.outcome = "victory";
}

export function beginBuild(state: GameState, kind: "house" | "tower") {
  if (!canAfford(state, BUILD_COST[kind])) {
    setNotice(state, "insufficient");
    return false;
  }
  state.buildMode = kind;
  state.selectedBuildingId = undefined;
  return true;
}

export function cancelBuild(state: GameState) {
  state.buildMode = undefined;
  state.hoverBuildX = undefined;
  state.hoverBuildY = undefined;
}

export function setBuildHover(state: GameState, x: number, y: number) {
  if (!state.buildMode) return;
  state.hoverBuildX = Math.round(x / 32) * 32;
  state.hoverBuildY = Math.round(y / 32) * 32;
}

function placementIsValid(state: GameState, x: number, y: number) {
  if (!stateIsWalkable(state, x, y, 70)) return false;
  if (stateTerrainAtCell(state, Math.floor(x / TILE), Math.floor(y / TILE)) === "bridge") {
    return false;
  }
  const insideTerritory = state.buildings.some((building) => {
    if (building.team !== "player" || building.hp <= 0) return false;
    const influence =
      building.kind === "castle"
        ? 590
        : building.kind === "house"
          ? 310
          : building.kind === "tower"
            ? 280
            : 390;
    return distance(x, y, building.x, building.y) <= influence;
  });
  if (!insideTerritory) return false;
  if (
    state.buildings.some((building) => {
      if (building.hp <= 0) return false;
      const size = getBuildingSize(building.kind);
      return distance(x, y, building.x, building.y) < Math.max(95, (size.w + 118) * 0.48);
    })
  ) {
    return false;
  }
  return !state.nodes.some(
    (node) => node.amount > 0 && distance(x, y, node.x, node.y) < 92,
  );
}

export function placeBuilding(state: GameState, x: number, y: number) {
  const kind = state.buildMode;
  if (!kind) return false;
  x = Math.round(x / 32) * 32;
  y = Math.round(y / 32) * 32;
  if (!placementIsValid(state, x, y)) {
    setNotice(state, "invalidPlacement");
    return false;
  }
  if (!canAfford(state, BUILD_COST[kind])) {
    setNotice(state, "insufficient");
    cancelBuild(state);
    return false;
  }
  spend(state, BUILD_COST[kind]);
  const building = createBuilding(nextId(state), kind, "player", x, y, state.nextId % 3);
  building.construction = 0;
  building.hp = Math.round(building.maxHp * 0.25);
  state.buildings.push(building);
  addEffect(state, "dust", x, y, 0.9);
  if (kind === "house") state.populationCap += 4;
  state.selectedBuildingId = building.id;
  state.buildMode = undefined;
  state.notice = null;
  state.noticeAge = 0;
  return true;
}

export function trainUnit(state: GameState, kind: PlayerUnitKind) {
  if (population(state) >= state.populationCap) {
    setNotice(state, "insufficient");
    return false;
  }
  const selected = state.buildings.find(
    (building) => building.id === state.selectedBuildingId && building.hp > 0,
  );
  if (!selected || selected.queue || selected.construction < 1) return false;
  const valid =
    (selected.kind === "castle" && kind === "pawn") ||
    (selected.kind === "barracks" && (kind === "warrior" || kind === "lancer")) ||
    (selected.kind === "archery" && kind === "archer") ||
    (selected.kind === "monastery" && kind === "monk");
  if (!valid) return false;
  const cost = UNIT_COST[kind];
  if (!canAfford(state, cost)) {
    setNotice(state, "insufficient");
    return false;
  }
  spend(state, cost);
  selected.queue = { kind, remaining: cost.time, total: cost.time };
  if (state.tutorialStep === 4 && kind === "warrior") state.tutorialStep = 5;
  return true;
}

function hitUnit(state: GameState, x: number, y: number, team?: "player" | "enemy") {
  return [...state.units].reverse().find((unit) => {
    const radius = unit.kind === "troll" ? 82 : unit.kind === "minotaur" ? 66 : 48;
    return unit.hp > 0 && (!team || unit.team === team) && distance(x, y, unit.x, unit.y - 12) < radius;
  });
}

function hitBuilding(
  state: GameState,
  x: number,
  y: number,
  team?: "player" | "enemy",
) {
  return [...state.buildings].reverse().find((building) => {
    if (building.hp <= 0 || (team && building.team !== team)) return false;
    const size = getBuildingSize(building.kind);
    return (
      x >= building.x - size.w * 0.55 &&
      x <= building.x + size.w * 0.55 &&
      y >= building.y - size.h * 0.88 &&
      y <= building.y + 22
    );
  });
}

function hitResource(state: GameState, x: number, y: number) {
  return [...state.nodes].reverse().find((node) => {
    const radius = node.kind === "wood" ? 70 : node.kind === "meat" ? 54 : 58;
    return node.amount > 0 && distance(x, y, node.x, node.y - 8) < radius;
  });
}

export function getHoverTarget(state: GameState, x: number, y: number): HoverTarget | null {
  const unit = hitUnit(state, x, y);
  if (unit) {
    return {
      type: "unit",
      id: unit.id,
      kind: unit.kind,
      hp: Math.ceil(unit.hp),
      maxHp: unit.maxHp,
      boss: unit.boss,
    };
  }
  const building = hitBuilding(state, x, y);
  if (building) {
    return {
      type: "building",
      id: building.id,
      kind: building.kind,
      hp: Math.ceil(building.hp),
      maxHp: building.maxHp,
      respawnClock: building.respawnClock,
    };
  }
  const node = [...state.nodes]
    .reverse()
    .find((candidate) => distance(x, y, candidate.x, candidate.y) < 66);
  if (node) {
    return {
      type: "resource",
      id: node.id,
      kind: node.kind,
      amount: Math.ceil(node.amount),
      respawnClock: node.respawnClock,
    };
  }
  return null;
}

export function selectPoint(state: GameState, x: number, y: number, additive = false) {
  if (state.buildMode) return placeBuilding(state, x, y);
  const unit = hitUnit(state, x, y, "player");
  if (unit) {
    state.selectedBuildingId = undefined;
    state.selectedUnitIds = additive
      ? Array.from(new Set([...state.selectedUnitIds, unit.id]))
      : [unit.id];
    if (state.tutorialStep === 0 && unit.kind === "pawn") state.tutorialStep = 1;
    return true;
  }
  const building = hitBuilding(state, x, y, "player");
  if (building) {
    state.selectedUnitIds = [];
    state.selectedBuildingId = building.id;
    if (state.tutorialStep === 3 && building.kind === "barracks") state.tutorialStep = 4;
    return true;
  }
  if (!additive) {
    state.selectedUnitIds = [];
    state.selectedBuildingId = undefined;
  }
  return false;
}

export function selectArea(
  state: GameState,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  additive = false,
) {
  const left = Math.min(startX, endX);
  const right = Math.max(startX, endX);
  const top = Math.min(startY, endY);
  const bottom = Math.max(startY, endY);
  const ids = state.units
    .filter(
      (unit) =>
        unit.team === "player" &&
        unit.hp > 0 &&
        unit.x >= left &&
        unit.x <= right &&
        unit.y >= top &&
        unit.y <= bottom,
    )
    .map((unit) => unit.id);
  state.selectedBuildingId = undefined;
  state.selectedUnitIds = additive
    ? Array.from(new Set([...state.selectedUnitIds, ...ids]))
    : ids;
  if (
    state.tutorialStep === 0 &&
    state.units.some((unit) => ids.includes(unit.id) && unit.kind === "pawn")
  ) {
    state.tutorialStep = 1;
  }
}

function clearTargets(unit: Unit) {
  unit.targetUnitId = undefined;
  unit.targetBuildingId = undefined;
  unit.targetResourceId = undefined;
  unit.path = [];
}

function setDestination(state: GameState, unit: Unit, x: number, y: number) {
  unit.targetX = x;
  unit.targetY = y;
  unit.path = findPath(state, unit.x, unit.y, x, y);
  unit.pathClock = 0.7;
}

export function issueCommand(state: GameState, x: number, y: number) {
  if (state.buildMode) {
    cancelBuild(state);
    return;
  }
  const selected = state.units.filter(
    (unit) => state.selectedUnitIds.includes(unit.id) && unit.hp > 0,
  );
  if (!selected.length) return;
  const enemy = hitUnit(state, x, y, "enemy");
  const enemyBuilding = hitBuilding(state, x, y, "enemy");
  const resource = hitResource(state, x, y);

  if (enemy || enemyBuilding) {
    for (const unit of selected) {
      clearTargets(unit);
      if (unit.kind === "pawn") continue;
      unit.action = "attack";
      unit.targetUnitId = enemy?.id;
      unit.targetBuildingId = enemyBuilding?.id;
    }
    state.marker = { x, y, age: 0, kind: "attack" };
    if (state.tutorialStep === 5) state.tutorialStep = 6;
    return;
  }

  if (resource && selected.some((unit) => unit.kind === "pawn")) {
    for (const unit of selected) {
      if (unit.kind !== "pawn") continue;
      clearTargets(unit);
      unit.action = "gather";
      unit.targetResourceId = resource.id;
      unit.homeResourceId = resource.id;
      unit.workingResource = resource.kind;
      setDestination(state, unit, resource.x, resource.y + 26);
    }
    state.marker = { x, y, age: 0, kind: "gather" };
    if (state.tutorialStep === 1 && resource.kind === "wood") state.tutorialStep = 2;
    return;
  }

  if (!stateIsWalkable(state, x, y, 8)) {
    state.marker = { x, y, age: 0, kind: "invalid" };
    return;
  }

  const columns = Math.ceil(Math.sqrt(selected.length));
  selected.forEach((unit, index) => {
    clearTargets(unit);
    const col = index % columns;
    const row = Math.floor(index / columns);
    const ox = (col - (columns - 1) / 2) * 46;
    const oy = row * 38;
    setDestination(state, unit, x + ox, y + oy);
    unit.action = "move";
  });
  state.marker = { x, y, age: 0, kind: "move" };
  if (state.tutorialStep === 6) state.tutorialStep = 7;
}

function moveDirect(unit: Unit, x: number, y: number, dt: number) {
  const dx = x - unit.x;
  const dy = y - unit.y;
  const length = Math.hypot(dx, dy);
  if (length < 3) return true;
  const step = Math.min(length, UNIT_SPEC[unit.kind].speed * dt);
  unit.x += (dx / length) * step;
  unit.y += (dy / length) * step;
  if (Math.abs(dx) > 1) unit.facing = dx < 0 ? -1 : 1;
  return length <= UNIT_SPEC[unit.kind].speed * dt + 3;
}

function moveAlongPath(state: GameState, unit: Unit, dt: number) {
  if (!unit.path.length) {
    unit.path = findPath(state, unit.x, unit.y, unit.targetX, unit.targetY);
    if (!unit.path.length) return true;
  }
  const next = unit.path[0];
  if (moveDirect(unit, next.x, next.y, dt)) {
    unit.path.shift();
  }
  return unit.path.length === 0;
}

function addEffect(
  state: GameState,
  kind: Effect["kind"],
  x: number,
  y: number,
  duration = 0.7,
) {
  state.effects.push({ id: nextId(state), kind, x, y, age: 0, duration });
}

function damageBuilding(state: GameState, building: Building, amount: number) {
  if (state.devGodMode && building.team === "player") return;
  if (building.hp <= 0) return;
  building.hp = Math.max(0, building.hp - amount);
  if (building.hp <= 0) {
    addEffect(state, "explosion", building.x, building.y - 44, 0.9);
    if (building.kind === "house") {
      state.populationCap = Math.max(4, state.populationCap - 4);
    }
    if (building.team === "enemy" && !building.cleared) {
      building.cleared = true;
      state.nestsCleared += 1;
      state.resources.wood += 45;
      state.resources.gold += 35;
      if (state.mode === "endless" && state.endlessTier >= MAP_COUNT) {
        building.respawnClock = 55 + Math.random() * 15;
      }
    }
  }
}

function damageUnit(state: GameState, unit: Unit, amount: number) {
  if (state.devGodMode && unit.team === "player") return;
  const guarded = unit.action === "guard" && (unit.kind === "lancer" || unit.kind === "skull");
  unit.hp = Math.max(0, unit.hp - amount * (guarded ? 0.5 : 1));
  if (unit.hp <= 0) addEffect(state, "explosion", unit.x, unit.y - 20, 0.65);
}

function waveRoster(state: GameState): EnemyKind[] {
  const wave = state.wave;
  if (state.mode === "endless") {
    const roster: EnemyKind[] = [];
    const count = Math.min(24, 3 + state.endlessTier * 2 + Math.floor(wave * 1.45));
    const pool: EnemyKind[] =
      state.endlessTier === 1 && wave < 3
        ? ["gnome", "goblin", "thief"]
        : state.endlessTier < 3 && wave < 7
          ? ["goblin", "gnoll", "thief", "skull", "panda"]
          : ["gnoll", "skull", "panda", "minotaur", "thief"];
    for (let index = 0; index < count; index += 1) {
      roster.push(pool[(index * 3 + wave) % pool.length]);
    }
    if (state.endlessTier >= 3 && wave % 5 === 0) roster.unshift("troll");
    else if (state.endlessTier >= 2 && wave % 3 === 0) roster.unshift("minotaur");
    return roster;
  }
  const ratio = wave / state.totalWaves;
  if (wave === state.totalWaves) {
    return ["troll", "minotaur", "panda", "gnoll", "skull", "thief", "goblin"];
  }
  if (wave === Math.ceil(state.totalWaves / 2)) {
    return ["minotaur", "gnoll", "skull", "goblin", "goblin"];
  }
  if (ratio > 0.62) return ["minotaur", "panda", "gnoll", "skull", "thief", "goblin", "goblin"];
  if (ratio > 0.34) return ["gnoll", "thief", "thief", "skull", "goblin", "goblin"];
  return ["gnome", "gnome", "goblin", "goblin", "thief"];
}

function spawnWave(state: GameState) {
  state.wave += 1;
  state.waveActive = true;
  const roster = waveRoster(state);
  const activeDens = state.buildings.filter(
    (building) => building.team === "enemy" && building.hp > 0,
  );
  roster.forEach((kind, index) => {
    const preferredKinds: EnemyBuildingKind[] =
      kind === "troll" || kind === "minotaur" || kind === "panda"
        ? ["rootTree", "cave"]
        : kind === "goblin" || kind === "thief"
          ? ["goblinHouse", "goblinTower"]
          : ["cave", "rootTree"];
    const preferredDens = activeDens.filter((building) =>
      preferredKinds.includes(building.kind as EnemyBuildingKind),
    );
    const denPool = preferredDens.length ? preferredDens : activeDens;
    const den = denPool[index % Math.max(1, denPool.length)];
    const fallback = ENEMY_SPAWNS[index % ENEMY_SPAWNS.length];
    const x = (den?.x ?? fallback.x) + (index % 3) * 34 - 34;
    const y = (den?.y ?? fallback.y) + 58 + Math.floor(index / 3) * 30;
    const difficultyLevel =
      state.mode === "endless"
        ? state.endlessTier + Math.floor(state.wave / 6)
        : state.level + Math.floor(state.wave / 4);
    const unit = createUnit(nextId(state), kind, "enemy", x, y, difficultyLevel);
    if (kind === "troll") {
      unit.boss = true;
      state.bossSpawned = true;
    } else if (
      state.mode === "stage" &&
      kind === "minotaur" &&
      state.wave === Math.ceil(state.totalWaves / 2)
    ) {
      unit.boss = true;
    }
    unit.anim += index * 0.14;
    state.units.push(unit);
    addEffect(state, "dust", unit.x, unit.y, 0.55);
  });
}

function nearestEnemy(state: GameState, unit: Unit, range: number) {
  let found: Unit | undefined;
  let best = range;
  for (const other of state.units) {
    if (other.team === unit.team || other.hp <= 0) continue;
    const d = distance(unit.x, unit.y, other.x, other.y);
    if (d < best) {
      best = d;
      found = other;
    }
  }
  return found;
}

function priorityEnemyForDefender(state: GameState, unit: Unit, localRange: number) {
  const castle = state.buildings.find(
    (building) => building.team === "player" && building.kind === "castle" && building.hp > 0,
  );
  if (castle && distance(unit.x, unit.y, castle.x, castle.y) < 720) {
    const invader = state.units
      .filter(
        (enemy) =>
          enemy.team === "enemy" &&
          enemy.hp > 0 &&
          (enemy.targetBuildingId === castle.id ||
            distance(enemy.x, enemy.y, castle.x, castle.y) < 360),
      )
      .sort(
        (a, b) =>
          distance(a.x, a.y, castle.x, castle.y) -
          distance(b.x, b.y, castle.x, castle.y),
      )[0];
    if (invader) return invader;
  }
  return nearestEnemy(state, unit, localRange);
}

function nearestResource(state: GameState, unit: Unit) {
  return state.nodes
    .filter((node) => node.amount > 0)
    .sort(
      (a, b) =>
        distance(unit.x, unit.y, a.x, a.y) -
        distance(unit.x, unit.y, b.x, b.y),
    )[0];
}

function beginGather(state: GameState, unit: Unit, node: ResourceNode) {
  clearTargets(unit);
  unit.action = "gather";
  unit.targetResourceId = node.id;
  unit.homeResourceId = node.id;
  unit.workingResource = node.kind;
  setDestination(state, unit, node.x, node.y + 28);
}

function updatePawn(state: GameState, unit: Unit, dt: number) {
  unit.healClock = Math.max(0, unit.healClock - dt);
  const threat = nearestEnemy(state, unit, 165);
  if (threat) {
    const castle = state.buildings.find(
      (building) => building.kind === "castle" && building.hp > 0,
    );
    if (castle) {
      const fleeX = castle.x + 105;
      const fleeY = castle.y + 25;
      if (
        unit.action !== "move" ||
        distance(unit.targetX, unit.targetY, fleeX, fleeY) > 30
      ) {
        clearTargets(unit);
        unit.action = "move";
        setDestination(state, unit, fleeX, fleeY);
      }
      moveAlongPath(state, unit, dt);
      return;
    }
  }
  if (unit.action === "move") {
    if (moveAlongPath(state, unit, dt)) unit.action = "idle";
    return;
  }
  const wounded = state.units
    .filter(
      (candidate) =>
        candidate.team === "player" &&
        candidate.kind !== "pawn" &&
        candidate.hp > 0 &&
        candidate.hp < candidate.maxHp &&
        distance(unit.x, unit.y, candidate.x, candidate.y) < 115,
    )
    .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (wounded && unit.healClock <= 0) {
    wounded.hp = Math.min(wounded.maxHp, wounded.hp + 8);
    unit.healClock = 2.4;
    addEffect(state, "heal", wounded.x, wounded.y - 18, 0.55);
  }
  if (unit.action === "idle" && state.autoFarm) {
    const node = nearestResource(state, unit);
    if (node) beginGather(state, unit, node);
  }
  if (unit.action === "gather") {
    let node = state.nodes.find(
      (candidate) => candidate.id === unit.targetResourceId && candidate.amount > 0,
    );
    if (!node && state.autoFarm) {
      node = nearestResource(state, unit);
      if (node) beginGather(state, unit, node);
    }
    if (!node) {
      unit.action = "idle";
      unit.targetResourceId = undefined;
      unit.workingResource = undefined;
      return;
    }
    unit.targetX = node.x;
    unit.targetY = node.y + 28;
    if (distance(unit.x, unit.y, unit.targetX, unit.targetY) > 44) {
      if (!unit.path.length) setDestination(state, unit, unit.targetX, unit.targetY);
      moveAlongPath(state, unit, dt);
      return;
    }
    unit.gatherClock += dt;
    if (unit.gatherClock >= 1.15) {
      unit.gatherClock = 0;
      const amount = Math.min(12, node.amount);
      node.amount -= amount;
      if (node.amount <= 0) node.respawnClock = node.respawnDelay;
      unit.carrying = node.kind;
      unit.carryAmount = amount;
      unit.action = "return";
      unit.targetResourceId = undefined;
      unit.path = [];
    }
    return;
  }
  if (unit.action === "return") {
    const castle = state.buildings.find(
      (building) => building.kind === "castle" && building.hp > 0,
    );
    if (!castle) {
      unit.action = "idle";
      return;
    }
    unit.targetX = castle.x + 85;
    unit.targetY = castle.y - 4;
    if (distance(unit.x, unit.y, unit.targetX, unit.targetY) > 50) {
      if (!unit.path.length) setDestination(state, unit, unit.targetX, unit.targetY);
      moveAlongPath(state, unit, dt);
      return;
    }
    if (unit.carrying) {
      state.resources[unit.carrying] += unit.carryAmount;
      if (state.tutorialStep === 2 && unit.carrying === "wood") state.tutorialStep = 3;
    }
    unit.carrying = undefined;
    unit.carryAmount = 0;
    const home = state.nodes.find(
      (node) => node.id === unit.homeResourceId && node.amount > 0,
    );
    if (home) beginGather(state, unit, home);
    else if (state.autoFarm) {
      const next = nearestResource(state, unit);
      if (next) beginGather(state, unit, next);
      else unit.action = "idle";
    } else {
      unit.action = "idle";
      unit.workingResource = undefined;
    }
  }
}

function refreshChasePath(state: GameState, unit: Unit, x: number, y: number, dt: number) {
  unit.pathClock -= dt;
  if (unit.pathClock <= 0 || !unit.path.length) {
    setDestination(state, unit, x, y);
    unit.pathClock = 0.8;
  }
  moveAlongPath(state, unit, dt);
}

function updatePlayerCombat(state: GameState, unit: Unit, dt: number) {
  if (unit.kind === "monk") {
    unit.healClock -= dt;
    const ally = state.units
      .filter(
        (candidate) =>
          candidate.team === "player" &&
          candidate.id !== unit.id &&
          candidate.hp > 0 &&
          candidate.hp < candidate.maxHp &&
          distance(unit.x, unit.y, candidate.x, candidate.y) < 480,
      )
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (ally) {
      unit.action = "heal";
      const allyDistance = distance(unit.x, unit.y, ally.x, ally.y);
      if (allyDistance > 148) {
        refreshChasePath(state, unit, ally.x, ally.y, dt);
        return;
      }
      unit.path = [];
      unit.facing = ally.x < unit.x ? -1 : 1;
      if (unit.healClock <= 0) {
        ally.hp = Math.min(ally.maxHp, ally.hp + 32);
        unit.healClock = 1.15;
        addEffect(state, "heal", ally.x, ally.y - 22, 0.72);
      }
      return;
    }
  }

  let target = state.units.find(
    (candidate) =>
      candidate.id === unit.targetUnitId &&
      candidate.team === "enemy" &&
      candidate.hp > 0,
  );
  const building = state.buildings.find(
    (candidate) =>
      candidate.id === unit.targetBuildingId &&
      candidate.team === "enemy" &&
      candidate.hp > 0,
  );
  if (!target && !building && unit.action === "attack") {
    target = priorityEnemyForDefender(state, unit, 250);
    unit.targetUnitId = target?.id;
  }
  if (!target && !building) {
    if (unit.action === "attack" || unit.action === "heal") {
      unit.action = unit.kind === "lancer" ? "guard" : "idle";
      unit.targetUnitId = undefined;
      unit.targetBuildingId = undefined;
      unit.path = [];
    }
    return;
  }
  const tx = target?.x ?? building!.x;
  const ty = target?.y ?? building!.y - 38;
  const spec = UNIT_SPEC[unit.kind];
  const d = distance(unit.x, unit.y, tx, ty);
  if (d > spec.range) {
    unit.action = "attack";
    refreshChasePath(state, unit, tx, ty, dt);
    return;
  }
  unit.path = [];
  unit.action = "attack";
  unit.facing = tx < unit.x ? -1 : 1;
  if (unit.attackClock > 0) return;
  unit.attackClock = spec.cooldown;
  if (unit.kind === "archer" && target) {
    state.projectiles.push({
      id: nextId(state),
      x: unit.x,
      y: unit.y - 42,
      targetId: target.id,
      team: "player",
      damage: spec.damage,
      speed: 410,
      age: 0,
    });
  } else if (target) damageUnit(state, target, spec.damage);
  else if (building) damageBuilding(state, building, spec.damage);
}

function chooseEnemyTarget(state: GameState, unit: Unit) {
  const candidates = state.units.filter(
    (candidate) =>
      candidate.team === "player" &&
      candidate.hp > 0 &&
      distance(unit.x, unit.y, candidate.x, candidate.y) < 250,
  );
  const nearby =
    unit.kind === "thief"
      ? candidates.sort((a, b) => {
          const priority = (kind: UnitKind) =>
            kind === "monk" ? 0 : kind === "archer" ? 1 : kind === "pawn" ? 2 : 3;
          return priority(a.kind) - priority(b.kind);
        })[0]
      : candidates.sort(
          (a, b) =>
            distance(unit.x, unit.y, a.x, a.y) -
            distance(unit.x, unit.y, b.x, b.y),
        )[0];
  if (nearby) {
    unit.targetUnitId = nearby.id;
    unit.targetBuildingId = undefined;
    return;
  }
  const targetBuilding = state.buildings
    .filter((building) => building.team === "player" && building.hp > 0)
    .sort((a, b) => {
      const ap = a.kind === "castle" ? 0 : a.kind === "tower" ? 1 : 2;
      const bp = b.kind === "castle" ? 0 : b.kind === "tower" ? 1 : 2;
      return ap - bp;
    })[0];
  unit.targetBuildingId = targetBuilding?.id;
  unit.targetUnitId = undefined;
}

function trollImpact(state: GameState, unit: Unit, target?: Unit, building?: Building) {
  const victims = state.units.filter(
    (candidate) =>
      candidate.team === "player" &&
      candidate.hp > 0 &&
      distance(unit.x, unit.y, candidate.x, candidate.y) < 112,
  );
  victims.forEach((victim) => damageUnit(state, victim, UNIT_SPEC.troll.damage));
  if (building && distance(unit.x, unit.y, building.x, building.y) < 125) {
    damageBuilding(state, building, UNIT_SPEC.troll.damage);
  }
  if (target && !victims.includes(target)) damageUnit(state, target, UNIT_SPEC.troll.damage);
  addEffect(state, "explosion", unit.x + unit.facing * 46, unit.y - 18, 0.75);
}

function updateEnemy(state: GameState, unit: Unit, dt: number) {
  let target = state.units.find(
    (candidate) =>
      candidate.id === unit.targetUnitId &&
      candidate.team === "player" &&
      candidate.hp > 0,
  );
  let building = state.buildings.find(
    (candidate) =>
      candidate.id === unit.targetBuildingId &&
      candidate.team === "player" &&
      candidate.hp > 0,
  );
  if (!target && !building) {
    chooseEnemyTarget(state, unit);
    target = state.units.find((candidate) => candidate.id === unit.targetUnitId);
    building = state.buildings.find((candidate) => candidate.id === unit.targetBuildingId);
  }
  if (!target && !building) return;
  const tx = target?.x ?? building!.x;
  const ty = target?.y ?? building!.y - 26;
  const spec = UNIT_SPEC[unit.kind];
  const d = distance(unit.x, unit.y, tx, ty);

  if (unit.kind === "troll" && unit.action === "windup") {
    unit.specialClock -= dt;
    if (unit.specialClock <= 0) {
      trollImpact(state, unit, target, building);
      unit.action = "recovery";
      unit.specialClock = 1.1;
    }
    return;
  }
  if (unit.kind === "troll" && unit.action === "recovery") {
    unit.specialClock -= dt;
    if (unit.specialClock <= 0) {
      unit.action = "idle";
      unit.attackClock = spec.cooldown;
    }
    return;
  }
  if (d > spec.range) {
    unit.action = "move";
    refreshChasePath(state, unit, tx, ty, dt);
    return;
  }
  unit.path = [];
  unit.facing = tx < unit.x ? -1 : 1;
  if (unit.attackClock > 0) {
    unit.action = unit.kind === "skull" && unit.attackClock < 0.35 ? "guard" : "attack";
    return;
  }
  if (unit.kind === "troll") {
    unit.action = "windup";
    unit.specialClock = 0.9;
    return;
  }
  unit.action = "attack";
  unit.attackClock = spec.cooldown;
  if (unit.kind === "gnoll" && target) {
    state.projectiles.push({
      id: nextId(state),
      x: unit.x,
      y: unit.y - 36,
      targetId: target.id,
      team: "enemy",
      damage: spec.damage,
      speed: 325,
      age: 0,
    });
  } else if (target) damageUnit(state, target, spec.damage);
  else if (building) damageBuilding(state, building, spec.damage);
}

function updateProjectiles(state: GameState, dt: number) {
  for (const projectile of state.projectiles) {
    projectile.age += dt;
    const target = state.units.find(
      (unit) =>
        unit.id === projectile.targetId &&
        unit.team !== projectile.team &&
        unit.hp > 0,
    );
    if (!target) {
      projectile.age = 99;
      continue;
    }
    const dx = target.x - projectile.x;
    const dy = target.y - 34 - projectile.y;
    const length = Math.hypot(dx, dy);
    if (length < 13) {
      damageUnit(state, target, projectile.damage);
      projectile.age = 99;
      addEffect(state, "dust", target.x, target.y - 22, 0.35);
      continue;
    }
    const step = Math.min(length, projectile.speed * dt);
    projectile.x += (dx / length) * step;
    projectile.y += (dy / length) * step;
  }
  state.projectiles = state.projectiles.filter((projectile) => projectile.age < 5);
}

function resourceRespawnPoint(state: GameState, node: ResourceNode) {
  const castle = state.buildings.find(
    (building) => building.team === "player" && building.kind === "castle" && building.hp > 0,
  );
  const maxX =
    state.mode === "endless"
      ? state.endlessTier * ENDLESS_REGION_WIDTH * TILE - 80
      : WORLD_W - 180;
  const activeDens = state.buildings.filter(
    (building) => building.team === "enemy" && building.hp > 0,
  );
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const preferCastle = Boolean(castle) && Math.random() < (node.kind === "meat" ? 0.76 : 0.58);
    let x: number;
    let y: number;
    if (preferCastle && castle) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 230 + Math.random() * (node.kind === "meat" ? 370 : 500);
      x = castle.x + Math.cos(angle) * radius;
      y = castle.y + Math.sin(angle) * radius * 0.75;
    } else {
      x = 100 + Math.random() * Math.max(160, maxX - 100);
      y = 220 + Math.random() * (WORLD_H - 440);
    }
    if (!stateIsWalkable(state, x, y, node.kind === "wood" ? 34 : 24)) continue;
    if (stateTerrainAtCell(state, Math.floor(x / TILE), Math.floor(y / TILE)) === "bridge") {
      continue;
    }
    const enemyBuffer = node.kind === "meat" ? 330 : 245;
    if (activeDens.some((building) => distance(x, y, building.x, building.y) < enemyBuffer)) {
      continue;
    }
    if (
      state.nodes.some(
        (other) =>
          other.id !== node.id &&
          other.amount > 0 &&
          distance(x, y, other.x, other.y) < (node.kind === "wood" ? 86 : 72),
      )
    ) {
      continue;
    }
    if (
      state.buildings.some(
        (building) => building.hp > 0 && distance(x, y, building.x, building.y) < 115,
      )
    ) {
      continue;
    }
    return { x, y };
  }
  return nearestStateWalkablePoint(state, node.x, node.y, 24);
}

function updateResources(state: GameState, dt: number) {
  for (const node of state.nodes) {
    if (node.amount > 0 || node.respawnClock <= 0) continue;
    node.respawnClock -= dt;
    if (node.respawnClock <= 0) {
      const spawn = resourceRespawnPoint(state, node);
      if (spawn) {
        node.x = spawn.x;
        node.y = spawn.y;
      }
      node.amount = node.maxAmount;
      node.variant =
        (node.variant + 1 + Math.floor(Math.random() * 3)) %
        (node.kind === "wood" ? 4 : node.kind === "gold" ? 6 : 4);
      addEffect(state, node.kind === "meat" ? "splash" : "dust", node.x, node.y, 0.65);
    }
  }
}

function updateBuildings(state: GameState, dt: number) {
  for (const building of state.buildings) {
    if (building.hp <= 0) {
      if (state.mode === "endless" && building.team === "enemy" && building.respawnClock > 0) {
        building.respawnClock -= dt;
        if (building.respawnClock <= 0) {
          building.hp = building.maxHp;
          building.cleared = false;
          addEffect(state, "fire", building.x, building.y - 45, 0.9);
        }
      }
      continue;
    }
    building.attackClock = Math.max(0, building.attackClock - dt);
    if (building.construction < 1) {
      building.construction = Math.min(1, building.construction + dt / 5);
      building.hp = Math.min(building.maxHp, building.hp + (building.maxHp * dt) / 6.7);
      continue;
    }
    if (building.queue) {
      building.queue.remaining -= dt;
      if (building.queue.remaining <= 0) {
        const unit = createUnit(
          nextId(state),
          building.queue.kind,
          "player",
          building.x + 84,
          building.y + 32,
          state.level,
        );
        state.units.push(unit);
        addEffect(state, "dust", unit.x, unit.y, 0.55);
        building.queue = undefined;
      }
    }
    if (building.kind === "tower" && building.attackClock <= 0) {
      const enemy = state.units
        .filter(
          (unit) =>
            unit.team === "enemy" &&
            unit.hp > 0 &&
            distance(building.x, building.y, unit.x, unit.y) < 315,
        )
        .sort(
          (a, b) =>
            distance(building.x, building.y, a.x, a.y) -
            distance(building.x, building.y, b.x, b.y),
        )[0];
      if (enemy) {
        state.projectiles.push({
          id: nextId(state),
          x: building.x,
          y: building.y - 145,
          targetId: enemy.id,
          team: "player",
          damage: 36,
          speed: 440,
          age: 0,
        });
        building.attackClock = 1.1;
      }
    }
  }
}

function updateEndlessExpansion(state: GameState, dt: number) {
  if (state.mode !== "endless" || state.endlessTier >= MAP_COUNT) return;
  const activeRegion = state.endlessTier - 1;
  const activeCamps = state.buildings.filter(
    (building) =>
      building.team === "enemy" &&
      Math.floor(building.x / (ENDLESS_REGION_WIDTH * TILE)) === activeRegion,
  );
  if (!activeCamps.length || activeCamps.some((building) => building.hp > 0)) {
    state.endlessExpansionClock = 0;
    return;
  }
  if (state.endlessExpansionClock <= 0) {
    state.endlessExpansionClock = 3.25;
    return;
  }
  state.endlessExpansionClock -= dt;
  if (state.endlessExpansionClock > 0) return;
  state.endlessTier += 1;
  addEndlessRegionContent(state, state.endlessTier - 1);
  state.waveClock = Math.max(state.waveClock, 7);
  state.waveActive = state.units.some((unit) => unit.team === "enemy" && unit.hp > 0);
}

export function updateGame(state: GameState, dt: number) {
  if (state.outcome !== "playing") return;
  state.time += dt;
  state.noticeAge += dt;
  if (state.noticeAge > 2.4) state.notice = null;
  if (state.marker) {
    state.marker.age += dt;
    if (state.marker.age > 0.75) state.marker = undefined;
  }
  state.waveClock -= dt;
  if (
    !state.waveActive &&
    (state.mode === "endless" || state.wave < state.totalWaves) &&
    state.waveClock <= 0
  ) {
    spawnWave(state);
  }

  for (const unit of state.units) {
    if (unit.hp <= 0) continue;
    unit.anim += dt;
    unit.attackClock = Math.max(0, unit.attackClock - dt);
    if (unit.team === "enemy") {
      updateEnemy(state, unit, dt);
      continue;
    }
    if (unit.kind === "pawn") {
      updatePawn(state, unit, dt);
      continue;
    }
    if (unit.action === "move") {
      if (moveAlongPath(state, unit, dt)) unit.action = unit.kind === "lancer" ? "guard" : "idle";
      continue;
    }
    if (unit.kind === "monk") {
      updatePlayerCombat(state, unit, dt);
      continue;
    }
    if (unit.action === "attack" || unit.action === "heal" || unit.targetUnitId || unit.targetBuildingId) {
      updatePlayerCombat(state, unit, dt);
      continue;
    }
    const localRange =
      unit.kind === "archer" ? 310 : unit.kind === "lancer" ? 225 : 195;
    const nearby = priorityEnemyForDefender(state, unit, localRange);
    if (nearby) {
      unit.targetUnitId = nearby.id;
      unit.action = "attack";
    }
  }

  updateBuildings(state, dt);
  updateEndlessExpansion(state, dt);
  updateResources(state, dt);
  updateProjectiles(state, dt);
  for (const effect of state.effects) effect.age += dt;
  state.effects = state.effects.filter((effect) => effect.age < effect.duration);
  state.units = state.units.filter((unit) => unit.hp > 0);
  state.selectedUnitIds = state.selectedUnitIds.filter((id) =>
    state.units.some((unit) => unit.id === id && unit.hp > 0),
  );

  const livingEnemies = state.units.filter((unit) => unit.team === "enemy").length;
  if (state.waveActive && livingEnemies === 0) {
    state.waveActive = false;
    state.waveClock =
      state.mode === "endless"
        ? Math.max(8, 18 - state.wave * 0.45)
        : state.wave >= state.totalWaves
          ? 9999
          : 20;
  }
  const castle = state.buildings.find(
    (building) => building.kind === "castle" && building.team === "player",
  );
  const livingEnemyCamps = state.buildings.some(
    (building) => building.team === "enemy" && building.hp > 0,
  );
  if (!castle || castle.hp <= 0) state.outcome = "defeat";
  else if (
    state.mode === "stage" &&
    state.wave >= state.totalWaves &&
    state.bossSpawned &&
    !state.waveActive &&
    livingEnemies === 0 &&
    !livingEnemyCamps
  ) {
    state.outcome = "victory";
  }
}

function drawAtlasSprite(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  frameWidth: number,
  frameHeight: number,
  frame: number,
  x: number,
  y: number,
  scale: number,
  facing: 1 | -1 = 1,
  alpha = 1,
) {
  const frames = Math.max(1, Math.floor(image.width / frameWidth));
  const sourceFrame = ((frame % frames) + frames) % frames;
  const width = frameWidth * scale;
  const height = frameHeight * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    image,
    sourceFrame * frameWidth,
    0,
    frameWidth,
    frameHeight,
    -width / 2,
    -height * 0.78,
    width,
    height,
  );
  ctx.restore();
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  frameSize: number,
  frame: number,
  x: number,
  y: number,
  scale: number,
  facing: 1 | -1 = 1,
  alpha = 1,
) {
  drawAtlasSprite(
    ctx,
    image,
    frameSize,
    frameSize,
    frame,
    x,
    y,
    scale,
    facing,
    alpha,
  );
}

function tileAsset(kind: TerrainKind): AssetKey {
  if (kind === "autumn") return "grassAutumn";
  if (kind === "deep") return "grassDeep";
  return "grassSpring";
}

function drawTerrain(ctx: CanvasRenderingContext2D, images: ImageBank, state: GameState, camera: Camera) {
  const visibleW = VIEW_W / camera.zoom;
  const visibleH = VIEW_H / camera.zoom;
  const firstC = Math.max(0, Math.floor(camera.x / TILE) - 2);
  const lastC = Math.min(COLS - 1, Math.ceil((camera.x + visibleW) / TILE) + 2);
  const firstR = Math.max(0, Math.floor(camera.y / TILE) - 2);
  const lastR = Math.min(ROWS - 1, Math.ceil((camera.y + visibleH) / TILE) + 2);
  for (let r = firstR; r <= lastR; r += 1) {
    for (let c = firstC; c <= lastC; c += 1) {
      ctx.drawImage(images.water, c * TILE, r * TILE, TILE, TILE);
    }
  }
  for (let r = firstR; r <= lastR; r += 1) {
    for (let c = firstC; c <= lastC; c += 1) {
      const kind = stateTerrainAtCell(state, c, r);
      if (
        kind === "water" ||
        kind === "bridge" ||
        kind === "hill" ||
        kind === "cliff"
      ) {
        continue;
      }
      const leftWater = stateTerrainAtCell(state, c - 1, r) === "water";
      const rightWater = stateTerrainAtCell(state, c + 1, r) === "water";
      const topWater = stateTerrainAtCell(state, c, r - 1) === "water";
      const bottomWater = stateTerrainAtCell(state, c, r + 1) === "water";
      const sx = leftWater ? 0 : rightWater ? 128 : 64;
      const sy = topWater ? 0 : bottomWater ? 128 : 64;
      if (leftWater || rightWater || topWater || bottomWater) {
        const frame = Math.floor(state.time * 8 + c * 2 + r * 3) % 16;
        ctx.drawImage(
          images.foam,
          frame * 192,
          0,
          192,
          192,
          c * TILE - 64,
          r * TILE - 64,
          192,
          192,
        );
      }
      ctx.drawImage(images[tileAsset(kind)], sx, sy, 64, 64, c * TILE, r * TILE, 64, 64);
      if (kind === "road") {
        ctx.fillStyle = "rgba(190, 154, 92, .23)";
        ctx.fillRect(c * TILE + 3, r * TILE + 10, 58, 44);
      }
    }
  }

  if (state.mode === "endless") {
    for (let region = 0; region < state.endlessTier; region += 1) {
      const offset = region * ENDLESS_REGION_WIDTH;
      const layout = ENDLESS_REGION_TEMPLATES[endlessRegionMap(state, region)];
      for (const hill of layout.hills) {
        drawElevation(
          ctx,
          images,
          (hill.c + offset) * TILE,
          hill.r * TILE,
          hill.w,
          hill.h,
          state.time,
          layout.palette,
        );
      }
      for (const stair of layout.stairs) {
        drawStairs(
          ctx,
          images,
          {
            c1: stair.c1 + offset,
            c2: stair.c2 + offset,
            r1: stair.r1,
            r2: stair.r2,
          },
          layout.palette,
        );
      }
      if (region + 1 < state.endlessTier) {
        drawBridgeRect(ctx, images, {
          c1: offset + ENDLESS_REGION_WIDTH - 1,
          c2: offset + ENDLESS_REGION_WIDTH,
          r1: 14,
          r2: 16,
        });
      }
    }
    drawEndlessZones(ctx, state);
  } else {
    const layout = mapLayout(state.level);
    for (const hill of layout.hills) {
      drawElevation(
        ctx,
        images,
        hill.c * TILE,
        hill.r * TILE,
        hill.w,
        hill.h,
        state.time,
        layout.palette,
      );
    }
    for (const bridge of layout.bridges) drawBridgeRect(ctx, images, bridge);
    for (const stair of layout.stairs) drawStairs(ctx, images, stair, layout.palette);
    drawWorldPaths(ctx, images, state.level);
  }
}

function drawEndlessZones(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.save();
  ctx.setLineDash([14, 11]);
  ctx.lineWidth = 3;
  ctx.font = '900 17px "Segoe UI", sans-serif';
  ctx.textAlign = "center";
  for (let region = 0; region < state.endlessTier; region += 1) {
    const x = region * ENDLESS_REGION_WIDTH * TILE;
    const mapId = endlessRegionMap(state, region);
    ctx.strokeStyle = region === 0 ? "rgba(190,238,246,.48)" : "rgba(255,190,135,.38)";
    ctx.strokeRect(x + 68, 205, ENDLESS_REGION_WIDTH * TILE - 136, WORLD_H - 410);
    ctx.fillStyle = region === 0 ? "rgba(225,248,248,.78)" : "rgba(255,224,177,.72)";
    ctx.fillText(`REGION ${region + 1} · MAP ${mapId}`, x + ENDLESS_REGION_WIDTH * TILE / 2, 248);
  }
  ctx.restore();
}

function drawElevation(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  x: number,
  y: number,
  columns: number,
  rows: number,
  time: number,
  palette: MapLayout["palette"],
) {
  const terrain =
    palette === "deep"
      ? images.grassDeep
      : palette === "autumn" || palette === "coast"
        ? images.grassAutumn
        : images.grassSpring;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const sx = c === 0 ? 0 : c === columns - 1 ? 128 : 64;
      const sy = r === 0 ? 0 : r === rows - 1 ? 128 : 64;
      ctx.drawImage(terrain, sx, sy, 64, 64, x + c * 64, y + r * 64, 64, 64);
    }
  }
  for (let c = 0; c < columns; c += 1) {
    const sx = c === 0 ? 320 : c === columns - 1 ? 448 : 384;
    for (let face = 0; face < 2; face += 1) {
      ctx.drawImage(terrain, sx, 192 + face * 64, 64, 64, x + c * 64, y + rows * 64 + face * 64, 64, 64);
    }
  }
  const shimmer = 0.03 + Math.sin(time * 0.7 + x) * 0.01;
  ctx.fillStyle = `rgba(255,255,210,${shimmer})`;
  ctx.fillRect(x, y, columns * 64, rows * 64);
}

function drawBridgeRect(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  rect: RangeRect,
) {
  const width = rect.c2 - rect.c1 + 1;
  const height = rect.r2 - rect.r1 + 1;
  if (width >= height) {
    for (let index = 0; index < width; index += 1) {
      ctx.drawImage(
        images.bridgeAll,
        (index % 3) * TILE,
        0,
        TILE,
        TILE,
        (rect.c1 + index) * TILE,
        rect.r1 * TILE,
        TILE,
        TILE,
      );
    }
    return;
  }
  for (let index = 0; index < height; index += 1) {
    ctx.drawImage(
      images.bridgeAll,
      0,
      TILE + (index % 3) * TILE,
      TILE,
      TILE,
      rect.c1 * TILE,
      (rect.r1 + index) * TILE,
      TILE,
      TILE,
    );
  }
}

function drawStairs(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  rect: RangeRect,
  palette: MapLayout["palette"],
) {
  const width = (rect.c2 - rect.c1 + 1) * TILE;
  const height = (rect.r2 - rect.r1 + 1) * TILE;
  const x = rect.c1 * TILE;
  const y = rect.r1 * TILE;
  const terrain =
    palette === "deep"
      ? images.grassDeep
      : palette === "autumn" || palette === "coast"
        ? images.grassAutumn
        : images.grassSpring;
  ctx.save();
  // The lower-left triangular grass pieces form the ramp shoulders.
  ctx.drawImage(terrain, 0, 256, 192, 128, x - TILE, y, width + TILE * 2, height);
  // The narrow strip in Tilemap_Elevation is the actual walkable stair lane.
  ctx.drawImage(images.elevation, 192, 384, 64, 128, x, y, width, height);
  ctx.strokeStyle = "rgba(37, 65, 67, .34)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
  ctx.restore();
}

function drawWorldPaths(ctx: CanvasRenderingContext2D, images: ImageBank, level: number) {
  const offsets = [
    [0, 0],
    [-210, 120],
    [170, -100],
    [-80, -180],
  ][Math.max(0, Math.min(3, level - 1))];
  const fieldPatches = [
    { x: 850 + offsets[0], y: 1090 + offsets[1], sx: 0 },
    { x: 1730 - offsets[0] * 0.4, y: 740 - offsets[1] * 0.3, sx: 320 },
    { x: 2070 + offsets[0] * 0.3, y: 1440 + offsets[1] * 0.35, sx: 0 },
  ];
  for (const patch of fieldPatches) {
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.drawImage(images.flatGround, patch.sx, 0, 192, 192, patch.x, patch.y, 192, 192);
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#6f764d";
    ctx.lineWidth = 3;
    for (let row = 1; row < 5; row += 1) {
      ctx.beginPath();
      ctx.moveTo(patch.x + 14, patch.y + row * 34);
      ctx.lineTo(patch.x + 178, patch.y + row * 34);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  max: number,
  team: "player" | "enemy",
  width = 58,
) {
  const ratio = Math.max(0, Math.min(1, value / max));
  ctx.fillStyle = "rgba(20, 29, 34, .82)";
  ctx.fillRect(x - width / 2 - 2, y - 2, width + 4, 9);
  ctx.fillStyle = team === "player" ? "#7fd86d" : "#ed6a5b";
  ctx.fillRect(x - width / 2, y, width * ratio, 5);
  ctx.strokeStyle = "rgba(255, 244, 197, .82)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2, y, width, 5);
}

function unitOverlapsOccluder(
  state: GameState,
  x: number,
  y: number,
  halfWidth: number,
  height: number,
) {
  return state.units.some(
    (unit) =>
      unit.hp > 0 &&
      unit.y < y + 12 &&
      unit.y > y - height &&
      Math.abs(unit.x - x) < halfWidth,
  );
}

function buildingAsset(building: Building): AssetKey {
  if (building.kind === "house") return `house${(building.variant % 3) + 1}` as AssetKey;
  return BUILDING_SPEC[building.kind].asset;
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  state: GameState,
  building: Building,
  selected: boolean,
) {
  const spec = BUILDING_SPEC[building.kind];
  const image = images[buildingAsset(building)];
  const size = getBuildingSize(building.kind);
  const faded = unitOverlapsOccluder(state, building.x, building.y, size.w * 0.47, size.h * 0.77);
  const constructionAlpha = building.construction < 1 ? 0.55 + building.construction * 0.45 : 1;
  const alpha = constructionAlpha * (faded ? 0.34 : 1);
  if (selected) {
    ctx.fillStyle = "rgba(255, 232, 106, .28)";
    ctx.beginPath();
    ctx.ellipse(building.x, building.y - 6, size.w * 0.5, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffe36f";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  if (spec.frame) {
    drawAtlasSprite(
      ctx,
      image,
      spec.frame,
      spec.frameHeight ?? spec.frame,
      Math.floor(state.time * 8),
      building.x,
      building.y + 18,
      spec.scale,
      1,
      alpha,
    );
  } else {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, building.x - size.w / 2, building.y - size.h, size.w, size.h);
    ctx.restore();
  }
  if (building.hp < building.maxHp || selected) {
    drawHealthBar(
      ctx,
      building.x,
      building.y - size.h - 11,
      building.hp,
      building.maxHp,
      building.team,
      Math.min(112, size.w * 0.75),
    );
  }
  if (building.queue) {
    const progress = 1 - building.queue.remaining / building.queue.total;
    ctx.fillStyle = "rgba(20, 29, 34, .88)";
    ctx.fillRect(building.x - 42, building.y + 8, 84, 10);
    ctx.fillStyle = "#efcb62";
    ctx.fillRect(building.x - 40, building.y + 10, 80 * progress, 6);
  }
}

function unitAsset(unit: Unit): AssetKey {
  const sprites =
    unit.team === "player"
      ? PLAYER_SPRITES[unit.kind as PlayerUnitKind]
      : ENEMY_SPRITES[unit.kind as EnemyKind];
  if (unit.kind === "troll" && unit.action === "windup") return "trollWindup";
  if (unit.kind === "troll" && unit.action === "recovery") return "trollRecovery";
  if (unit.kind === "pawn" && unit.action === "return") {
    if (unit.carrying === "gold") return "pawnGold";
    if (unit.carrying === "meat") return "pawnMeat";
    return "pawnWood";
  }
  if (
    unit.path.length > 0 &&
    (unit.action === "gather" || unit.action === "attack")
  ) {
    return sprites.run;
  }
  if (unit.action === "move" || unit.action === "return") return sprites.run;
  if (
    unit.action === "attack" ||
    unit.action === "gather" ||
    unit.action === "heal"
  ) {
    if (unit.kind === "pawn") {
      if (unit.workingResource === "gold") return "pawnPickaxe";
      if (unit.workingResource === "meat") return "pawnKnife";
      return "pawnAxe";
    }
    return sprites.action;
  }
  if (unit.kind === "lancer" && unit.action === "guard") return "lancerGuard";
  return sprites.idle;
}

function drawUnit(ctx: CanvasRenderingContext2D, images: ImageBank, unit: Unit, selected: boolean) {
  const spec = UNIT_SPEC[unit.kind];
  if (selected) {
    const large = unit.kind === "troll" || unit.kind === "minotaur";
    ctx.fillStyle = "rgba(255, 232, 106, .24)";
    ctx.strokeStyle = "#ffe36f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(unit.x, unit.y - 4, large ? 52 : 35, large ? 24 : 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  const image = images[unitAsset(unit)];
  const travelling =
    unit.action === "move" ||
    unit.action === "return" ||
    ((unit.action === "attack" || unit.action === "gather") && unit.path.length > 0);
  const fps =
    travelling
      ? 9
      : unit.action === "attack" || unit.action === "gather" || unit.action === "heal"
      ? 11
      : 7;
  drawSprite(ctx, image, spec.frame, Math.floor(unit.anim * fps), unit.x, unit.y, spec.scale, unit.facing);
  if (unit.hp < unit.maxHp || selected || unit.boss) {
    drawHealthBar(
      ctx,
      unit.x,
      unit.y - spec.frame * spec.scale * 0.72,
      unit.hp,
      unit.maxHp,
      unit.team,
      unit.kind === "troll" ? 118 : unit.kind === "minotaur" ? 84 : 52,
    );
  }
  if (unit.boss) {
    ctx.fillStyle = "#fff0a2";
    ctx.font = "900 13px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("BOSS", unit.x, unit.y - spec.frame * spec.scale * 0.72 - 9);
  }
}

function drawResource(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  state: GameState,
  node: ResourceNode,
) {
  const drawRespawnMarker = () => {
    const progress =
      node.respawnDelay > 0
        ? 1 - Math.max(0, node.respawnClock) / node.respawnDelay
        : 0;
    ctx.save();
    ctx.fillStyle = "rgba(44, 58, 57, .4)";
    ctx.beginPath();
    ctx.ellipse(node.x, node.y - 4, 31, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 237, 171, .78)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(node.x, node.y - 8, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();
    ctx.fillStyle = "#fff0b5";
    ctx.font = '900 12px "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(node.respawnClock)}s`, node.x, node.y - 4);
    ctx.restore();
  };
  if (node.kind === "wood") {
    const key = `tree${(node.variant % 4) + 1}` as AssetKey;
    const stumpKey = `stump${(node.variant % 4) + 1}` as AssetKey;
    if (node.amount > 0) {
      const image = images[key];
      const frameWidth = 192;
      const frameHeight = image.height;
      const scale = frameHeight === 256 ? 0.82 : 0.9;
      const faded = unitOverlapsOccluder(
        state,
        node.x,
        node.y,
        frameWidth * scale * 0.42,
        frameHeight * scale * 0.74,
      );
      // Tree1/2 use 192x256 cells while Tree3/4 use 192x192 cells.
      // Keeping width and height separate prevents a frame from borrowing
      // the left edge of the neighboring tree in the atlas.
      drawAtlasSprite(
        ctx,
        image,
        frameWidth,
        frameHeight,
        0,
        node.x,
        node.y,
        scale,
        1,
        faded ? 0.3 : 1,
      );
      return;
    }
    const image = images[stumpKey];
    const scale = 0.48;
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.save();
    ctx.drawImage(image, node.x - width / 2, node.y - height * 0.82, width, height);
    ctx.restore();
    drawRespawnMarker();
    return;
  }
  if (node.kind === "gold") {
    if (node.amount <= 0) {
      drawRespawnMarker();
      return;
    }
    const key = `gold${(node.variant % 6) + 1}` as AssetKey;
    const image = images[key];
    const scale = 0.82;
    ctx.drawImage(
      image,
      node.x - (image.width * scale) / 2,
      node.y - image.height * scale * 0.68,
      image.width * scale,
      image.height * scale,
    );
    return;
  }
  if (node.amount <= 0) {
    return;
  }
  drawSprite(
    ctx,
    images.sheepIdle,
    128,
    Math.floor(state.time * 7 + node.variant * 2),
    node.x,
    node.y,
    0.78,
    node.variant % 2 ? -1 : 1,
  );
}

function drawEffect(ctx: CanvasRenderingContext2D, images: ImageBank, effect: Effect) {
  if (effect.kind === "heal") {
    const image = images.monkEffect;
    const frame = Math.floor((effect.age / effect.duration) * (image.width / 192));
    drawSprite(ctx, image, 192, frame, effect.x, effect.y + 35, 0.62);
    return;
  }
  const key =
    effect.kind === "explosion"
      ? "explosion"
      : effect.kind === "fire"
        ? "fire"
        : effect.kind === "splash"
          ? "splash"
          : "dust";
  const image = images[key];
  const frameSize = image.height;
  const frames = Math.max(1, Math.floor(image.width / frameSize));
  const frame = Math.min(frames - 1, Math.floor((effect.age / effect.duration) * frames));
  drawSprite(ctx, image, frameSize, frame, effect.x, effect.y + 15, 0.76);
}

interface Decor {
  key: AssetKey;
  x: number;
  y: number;
  w: number;
  h: number;
  frame?: number;
  frameSize?: number;
  occludes?: boolean;
  solid?: boolean;
  maps?: number[];
}

const STAGE_DECOR: Decor[] = [
  { key: "rock1", x: 270, y: 410, w: 64, h: 64, solid: true, maps: [1, 2] },
  { key: "rock4", x: 830, y: 760, w: 64, h: 64, solid: true, maps: [1, 4] },
  { key: "rock3", x: 1400, y: 1060, w: 64, h: 64, solid: true },
  { key: "rock2", x: 2010, y: 1890, w: 64, h: 64, solid: true },
  { key: "rock2", x: 720, y: 1240, w: 64, h: 64, solid: true },
  { key: "rock1", x: 1540, y: 360, w: 64, h: 64, solid: true },
  { key: "rock4", x: 2240, y: 1020, w: 64, h: 64, solid: true },
  { key: "rock3", x: 2910, y: 620, w: 64, h: 64, solid: true, maps: [1, 2] },
  { key: "rock1", x: 1160, y: 1010, w: 64, h: 64, solid: true, maps: [2, 3] },
  { key: "rock2", x: 1820, y: 1210, w: 64, h: 64, solid: true, maps: [2, 4] },
  {
    key: "bush1",
    x: 310,
    y: 920,
    w: 92,
    h: 92,
    frameSize: 128,
    frame: 1,
    occludes: true,
  },
  {
    key: "bush2",
    x: 1340,
    y: 480,
    w: 92,
    h: 92,
    frameSize: 128,
    frame: 5,
    occludes: true,
    maps: [1, 2],
  },
  {
    key: "bush1",
    x: 2050,
    y: 880,
    w: 92,
    h: 92,
    frameSize: 128,
    frame: 3,
    occludes: true,
  },
  {
    key: "bush2",
    x: 2390,
    y: 1470,
    w: 92,
    h: 92,
    frameSize: 128,
    frame: 2,
    occludes: true,
  },
  {
    key: "bush2",
    x: 1010,
    y: 380,
    w: 88,
    h: 88,
    frameSize: 128,
    frame: 4,
    occludes: true,
  },
  {
    key: "bush1",
    x: 1670,
    y: 1530,
    w: 90,
    h: 90,
    frameSize: 128,
    frame: 2,
    occludes: true,
  },
  {
    key: "bush2",
    x: 2860,
    y: 1350,
    w: 88,
    h: 88,
    frameSize: 128,
    frame: 6,
    occludes: true,
  },
  {
    key: "bush1",
    x: 540,
    y: 610,
    w: 86,
    h: 86,
    frameSize: 128,
    frame: 7,
    occludes: true,
    maps: [1, 3],
  },
  {
    key: "bush2",
    x: 1910,
    y: 610,
    w: 86,
    h: 86,
    frameSize: 128,
    frame: 1,
    occludes: true,
    maps: [2, 4],
  },
  {
    key: "deadTree",
    x: 2820,
    y: 700,
    w: 250,
    h: 210,
    occludes: true,
    solid: true,
    maps: [3, 4],
  },
  { key: "bones1", x: 2390, y: 440, w: 64, h: 64, maps: [3, 4] },
  { key: "bones2", x: 2780, y: 690, w: 64, h: 64, maps: [3, 4] },
  { key: "bones3", x: 2630, y: 820, w: 64, h: 64, maps: [3, 4] },
  { key: "bones1", x: 1880, y: 1280, w: 64, h: 64, maps: [3, 4] },
  { key: "bones2", x: 2310, y: 1580, w: 64, h: 64, maps: [3, 4] },
  {
    key: "skullSpike1",
    x: 2460,
    y: 650,
    w: 64,
    h: 128,
    occludes: true,
    solid: true,
    maps: [3, 4],
  },
  {
    key: "skullSpike2",
    x: 2860,
    y: 910,
    w: 64,
    h: 128,
    occludes: true,
    solid: true,
    maps: [3, 4],
  },
  {
    key: "fishHut",
    x: 2230,
    y: 350,
    w: 154,
    h: 154,
    frameSize: 192,
    occludes: true,
    solid: true,
    maps: [4],
  },
  {
    key: "pirateTower",
    x: 2160,
    y: 560,
    w: 112,
    h: 168,
    occludes: true,
    solid: true,
    maps: [4],
  },
  { key: "cannon", x: 2310, y: 585, w: 64, h: 64, solid: true, maps: [4] },
  { key: "cannon", x: 2860, y: 1260, w: 64, h: 64, solid: true, maps: [4] },
];

const ENDLESS_DECOR_TEMPLATES: Record<number, Decor[]> = {
  1: [
    { key: "rock1", x: 105, y: 320, w: 64, h: 64, solid: true },
    { key: "rock4", x: 675, y: 770, w: 64, h: 64, solid: true },
    { key: "bush1", x: 115, y: 910, w: 86, h: 86, frameSize: 128, frame: 1 },
    { key: "bush2", x: 660, y: 1160, w: 86, h: 86, frameSize: 128, frame: 4 },
    { key: "bones1", x: 320, y: 1010, w: 64, h: 64 },
  ],
  2: [
    { key: "rock2", x: 110, y: 600, w: 64, h: 64, solid: true },
    { key: "rock3", x: 675, y: 330, w: 64, h: 64, solid: true },
    { key: "bush2", x: 110, y: 940, w: 88, h: 88, frameSize: 128, frame: 2 },
    { key: "bush1", x: 670, y: 1490, w: 88, h: 88, frameSize: 128, frame: 6 },
    { key: "bones2", x: 365, y: 1030, w: 64, h: 64 },
  ],
  3: [
    { key: "deadTree", x: 650, y: 770, w: 205, h: 176, occludes: true, solid: true },
    { key: "rock4", x: 110, y: 360, w: 64, h: 64, solid: true },
    { key: "bush1", x: 105, y: 980, w: 86, h: 86, frameSize: 128, frame: 5 },
    { key: "bones1", x: 320, y: 940, w: 64, h: 64 },
    { key: "skullSpike1", x: 675, y: 1480, w: 54, h: 108, solid: true },
  ],
  4: [
    { key: "pirateTower", x: 650, y: 500, w: 96, h: 144, occludes: true, solid: true },
    { key: "cannon", x: 665, y: 650, w: 58, h: 58, solid: true },
    { key: "rock1", x: 105, y: 380, w: 64, h: 64, solid: true },
    { key: "bush2", x: 105, y: 980, w: 86, h: 86, frameSize: 128, frame: 3 },
    { key: "bones3", x: 345, y: 1060, w: 64, h: 64 },
  ],
};

function decorBlocksPoint(decor: Decor, x: number, y: number) {
  if (!decor.solid) return false;
  const radiusX = Math.max(24, decor.w * 0.3);
  const radiusY = Math.max(18, decor.h * 0.17);
  return (
    Math.abs(x - decor.x) < radiusX &&
    Math.abs(y - (decor.y - radiusY * 0.35)) < radiusY
  );
}

function pointBlockedByDecor(state: GameState, x: number, y: number) {
  if (state.mode === "stage") {
    return STAGE_DECOR.some(
      (decor) =>
        (!decor.maps || decor.maps.includes(state.level)) &&
        decorBlocksPoint(decor, x, y),
    );
  }
  const region = Math.floor(x / (ENDLESS_REGION_WIDTH * TILE));
  if (region < 0 || region >= state.endlessTier) return false;
  const localX = x - region * ENDLESS_REGION_WIDTH * TILE;
  const mapId = endlessRegionMap(state, region);
  return ENDLESS_DECOR_TEMPLATES[mapId].some((decor) =>
    decorBlocksPoint(decor, localX, y),
  );
}

function drawFenceTile(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  sourceX: number,
  sourceY: number,
  x: number,
  y: number,
) {
  ctx.drawImage(images.woodenFence, sourceX, sourceY, TILE, TILE, x, y, TILE, TILE);
}

function drawCampFenceBack(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  camp: Building,
) {
  const x = camp.x - 96;
  const y = camp.y - 154;
  drawFenceTile(ctx, images, 0, 0, x, y);
  drawFenceTile(ctx, images, 64, 0, x + 64, y);
  drawFenceTile(ctx, images, 192, 0, x + 128, y);
  drawFenceTile(ctx, images, 0, 64, x, y + 64);
  drawFenceTile(ctx, images, 192, 64, x + 128, y + 64);
}

function drawCampFenceFront(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  state: GameState,
  camp: Building,
) {
  const x = camp.x - 96;
  const y = camp.y + 6;
  const faded = unitOverlapsOccluder(state, camp.x, camp.y + 28, 118, 58);
  ctx.save();
  ctx.globalAlpha = faded ? 0.3 : 1;
  drawFenceTile(ctx, images, 0, 128, x, y);
  drawFenceTile(ctx, images, 64, 128, x + 64, y);
  drawFenceTile(ctx, images, 192, 128, x + 128, y);
  ctx.restore();
}

function campDecor(camp: Building): Decor[] {
  if (camp.kind === "rootTree") {
    return [
      {
        key: "skullSpike1",
        x: camp.x - 146,
        y: camp.y + 22,
        w: 54,
        h: 108,
        occludes: true,
      },
      {
        key: "skullSpike2",
        x: camp.x + 146,
        y: camp.y + 16,
        w: 54,
        h: 108,
        occludes: true,
      },
      { key: "bones3", x: camp.x - 92, y: camp.y + 44, w: 58, h: 58 },
      { key: "bones1", x: camp.x + 94, y: camp.y + 48, w: 58, h: 58 },
    ];
  }
  if (camp.kind === "cave") {
    return [
      { key: "bones1", x: camp.x - 118, y: camp.y + 36, w: 58, h: 58 },
      { key: "bones2", x: camp.x + 116, y: camp.y + 38, w: 58, h: 58 },
      { key: "rock3", x: camp.x + 128, y: camp.y - 58, w: 52, h: 52 },
    ];
  }
  return [
    {
      key: camp.kind === "goblinTower" ? "bush2" : "bush1",
      x: camp.x - 118,
      y: camp.y + 28,
      w: 68,
      h: 68,
      frameSize: 128,
      frame: camp.variant,
      occludes: true,
    },
    { key: "bones3", x: camp.x + 112, y: camp.y + 38, w: 54, h: 54 },
  ];
}

function drawDecor(ctx: CanvasRenderingContext2D, images: ImageBank, state: GameState, decor: Decor) {
  const alpha =
    decor.occludes && unitOverlapsOccluder(state, decor.x, decor.y, decor.w * 0.42, decor.h * 0.76)
      ? 0.3
      : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (decor.frameSize) {
    drawSprite(
      ctx,
      images[decor.key],
      decor.frameSize,
      Math.floor(state.time * 7 + (decor.frame ?? 0)),
      decor.x,
      decor.y,
      decor.w / decor.frameSize,
      1,
      alpha,
    );
  } else {
    ctx.drawImage(images[decor.key], decor.x - decor.w / 2, decor.y - decor.h, decor.w, decor.h);
  }
  ctx.restore();
}

function drawSeaDecor(ctx: CanvasRenderingContext2D, images: ImageBank, state: GameState) {
  const time = state.time;
  const rocks = [
    { key: "waterRock1" as const, x: 104, y: 300, seed: 3 },
    { key: "waterRock2" as const, x: 2920, y: 1180, seed: 9 },
    { key: "waterRock1" as const, x: 1520, y: 110, seed: 11 },
    { key: "waterRock2" as const, x: 1650, y: 1950, seed: 6 },
  ];
  for (const rock of rocks) {
    drawSprite(ctx, images[rock.key], 64, Math.floor(time * 7 + rock.seed), rock.x, rock.y, 1);
  }
  const clouds = [
    { key: "cloud1" as const, x: -155, y: 300, w: 205, h: 91, speed: 3 },
    { key: "cloud2" as const, x: -170, y: 760, w: 220, h: 98, speed: 4 },
    { key: "cloud3" as const, x: -140, y: 1420, w: 190, h: 84, speed: 2 },
    { key: "cloud2" as const, x: 2875, y: 470, w: 215, h: 96, speed: 5 },
    { key: "cloud1" as const, x: 2880, y: 1040, w: 205, h: 91, speed: 3 },
    { key: "cloud3" as const, x: 2900, y: 1620, w: 180, h: 80, speed: 4 },
    { key: "cloud3" as const, x: 950, y: 42, w: 225, h: 100, speed: 2 },
    { key: "cloud1" as const, x: 1740, y: 32, w: 235, h: 104, speed: 5 },
    { key: "cloud2" as const, x: 1020, y: 1938, w: 220, h: 98, speed: 4 },
    { key: "cloud1" as const, x: 2110, y: 1928, w: 225, h: 100, speed: 3 },
  ];
  if (state.mode === "endless" && state.endlessTier < MAP_COUNT) {
    const frontierX = state.endlessTier * ENDLESS_REGION_WIDTH * TILE;
    clouds.push(
      { key: "cloud2" as const, x: frontierX + 130, y: 540, w: 220, h: 98, speed: 4 },
      { key: "cloud1" as const, x: frontierX + 360, y: 980, w: 205, h: 91, speed: 3 },
      { key: "cloud3" as const, x: frontierX + 160, y: 1460, w: 190, h: 84, speed: 2 },
    );
  }
  for (const cloud of clouds) {
    ctx.save();
    ctx.globalAlpha = 0.76;
    const drift = Math.sin(time * 0.08 * cloud.speed + cloud.x) * 24;
    ctx.drawImage(images[cloud.key], cloud.x + drift, cloud.y, cloud.w, cloud.h);
    ctx.restore();
  }
}

function decorForState(state: GameState) {
  if (state.mode === "stage") {
    return STAGE_DECOR.filter(
      (decor) =>
        (!decor.maps || decor.maps.includes(state.level)) &&
        stateTerrainAtCell(state, Math.floor(decor.x / TILE), Math.floor(decor.y / TILE)) !==
          "water",
    );
  }
  const decor: Decor[] = [];
  for (let region = 0; region < state.endlessTier; region += 1) {
    const baseX = region * ENDLESS_REGION_WIDTH * TILE;
    const mapId = endlessRegionMap(state, region);
    for (const item of ENDLESS_DECOR_TEMPLATES[mapId]) {
      const placed = { ...item, x: baseX + item.x };
      const terrain = stateTerrainAtCell(
        state,
        Math.floor(placed.x / TILE),
        Math.floor(placed.y / TILE),
      );
      if (terrain !== "water" && terrain !== "bridge" && terrain !== "stair") {
        decor.push(placed);
      }
    }
  }
  return decor;
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  state: GameState,
  camera: Camera,
  drag?: { active: boolean; startX: number; startY: number; x: number; y: number },
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#49aaab";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
  drawTerrain(ctx, images, state, camera);
  drawSeaDecor(ctx, images, state);
  for (const camp of state.buildings) {
    if (camp.team !== "enemy" || camp.hp <= 0) continue;
    if (camp.kind !== "rootTree") drawCampFenceBack(ctx, images, camp);
  }

  const queue: Array<{ y: number; draw: () => void }> = [];
  for (const decor of decorForState(state)) {
    queue.push({ y: decor.y, draw: () => drawDecor(ctx, images, state, decor) });
  }
  for (const node of state.nodes) {
    queue.push({ y: node.y, draw: () => drawResource(ctx, images, state, node) });
  }
  for (const camp of state.buildings) {
    if (camp.team !== "enemy" || camp.hp <= 0) continue;
    for (const decor of campDecor(camp)) {
      queue.push({ y: decor.y, draw: () => drawDecor(ctx, images, state, decor) });
    }
  }
  for (const building of state.buildings) {
    if (building.hp <= 0) continue;
    queue.push({
      y: building.y,
      draw: () =>
        drawBuilding(
          ctx,
          images,
          state,
          building,
          state.selectedBuildingId === building.id,
        ),
    });
    if (building.team === "enemy" && building.kind !== "rootTree") {
      queue.push({
        y: building.y + 76,
        draw: () => drawCampFenceFront(ctx, images, state, building),
      });
    }
  }
  for (const unit of state.units) {
    queue.push({
      y: unit.y,
      draw: () => drawUnit(ctx, images, unit, state.selectedUnitIds.includes(unit.id)),
    });
  }
  queue.sort((a, b) => a.y - b.y);
  queue.forEach((entry) => entry.draw());

  for (const projectile of state.projectiles) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(Math.atan2(-12, projectile.team === "player" ? 30 : -30));
    ctx.drawImage(images.arrow, -22, -9, 44, 44);
    ctx.restore();
  }
  for (const effect of state.effects) drawEffect(ctx, images, effect);

  if (state.buildMode && state.hoverBuildX !== undefined && state.hoverBuildY !== undefined) {
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.lineWidth = 3;
    for (const building of state.buildings) {
      if (building.team !== "player" || building.hp <= 0) continue;
      const influence =
        building.kind === "castle"
          ? 590
          : building.kind === "house"
            ? 310
            : building.kind === "tower"
              ? 280
              : 390;
      ctx.fillStyle = "rgba(103, 196, 176, .055)";
      ctx.strokeStyle = "rgba(196, 246, 215, .38)";
      ctx.beginPath();
      ctx.arc(building.x, building.y, influence, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
    const kind = state.buildMode;
    const valid = placementIsValid(state, state.hoverBuildX, state.hoverBuildY);
    const ghost = createBuilding(-1, kind, "player", state.hoverBuildX, state.hoverBuildY);
    ctx.save();
    ctx.globalAlpha = valid ? 0.65 : 0.42;
    ctx.filter = valid ? "none" : "sepia(1) saturate(5) hue-rotate(320deg)";
    drawBuilding(ctx, images, state, ghost, false);
    ctx.restore();
    ctx.strokeStyle = valid ? "#9ef08e" : "#ff6b5f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(state.hoverBuildX, state.hoverBuildY, kind === "tower" ? 54 : 68, 27, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (state.marker) {
    const radius = 15 + state.marker.age * 26;
    ctx.strokeStyle =
      state.marker.kind === "invalid"
        ? "#ff5f54"
        : state.marker.kind === "attack"
          ? "#f1675b"
          : state.marker.kind === "gather"
            ? "#f0ce5e"
            : "#dbf6df";
    ctx.globalAlpha = Math.max(0, 1 - state.marker.age / 0.75);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(state.marker.x, state.marker.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (drag?.active) {
    const left = Math.min(drag.startX, drag.x);
    const top = Math.min(drag.startY, drag.y);
    const width = Math.abs(drag.x - drag.startX);
    const height = Math.abs(drag.y - drag.startY);
    ctx.fillStyle = "rgba(248, 232, 137, .16)";
    ctx.strokeStyle = "#f8e889";
    ctx.lineWidth = 2;
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left, top, width, height);
  }
  ctx.restore();

  const edge = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  edge.addColorStop(0, "rgba(21,52,65,.12)");
  edge.addColorStop(0.1, "transparent");
  edge.addColorStop(0.9, "transparent");
  edge.addColorStop(1, "rgba(21,52,65,.16)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

export function renderMinimap(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  camera: Camera,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const mapWorldWidth = worldWidthForState(state);
  const visibleColumns = Math.ceil(mapWorldWidth / TILE);
  const sx = w / mapWorldWidth;
  const sy = h / WORLD_H;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#3f9fa5";
  ctx.fillRect(0, 0, w, h);
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < visibleColumns; c += 1) {
      const terrain = stateTerrainAtCell(state, c, r);
      if (terrain === "water") continue;
      ctx.fillStyle =
        terrain === "bridge"
          ? "#b88852"
          : terrain === "hill"
            ? "#759b74"
            : terrain === "cliff"
              ? "#557878"
            : terrain === "stair"
              ? "#d0a76b"
            : terrain === "autumn"
              ? "#aab758"
              : "#8fbd67";
      ctx.fillRect(c * TILE * sx, r * TILE * sy, TILE * sx + 1, TILE * sy + 1);
    }
  }
  for (const building of state.buildings) {
    if (building.hp <= 0) continue;
    ctx.fillStyle = building.team === "player" ? "#f6df7f" : "#e45e51";
    ctx.fillRect(building.x * sx - 2, building.y * sy - 2, 5, 5);
  }
  for (const unit of state.units) {
    ctx.fillStyle = unit.team === "player" ? "#dff5c3" : "#802f38";
    ctx.fillRect(unit.x * sx - 1, unit.y * sy - 1, unit.boss ? 5 : 3, unit.boss ? 5 : 3);
  }
  ctx.strokeStyle = "#fff4b5";
  ctx.lineWidth = 2;
  const viewLeft = Math.max(0, camera.x);
  const viewRight = Math.min(mapWorldWidth, camera.x + VIEW_W / camera.zoom);
  const viewTop = Math.max(0, camera.y);
  const viewBottom = Math.min(WORLD_H, camera.y + VIEW_H / camera.zoom);
  ctx.strokeRect(
    viewLeft * sx,
    viewTop * sy,
    Math.max(0, viewRight - viewLeft) * sx,
    Math.max(0, viewBottom - viewTop) * sy,
  );
}

export function renderMenuWorld(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  time: number,
) {
  const state = createInitialGame(false, "stage", 1);
  state.time = time;
  const camera = { x: 80, y: 1060, zoom: 1 };
  renderGame(ctx, images, state, camera);
}
