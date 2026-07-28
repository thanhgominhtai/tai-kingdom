import type { AssetKey, ImageBank } from "./assets";

export const WORLD_W = 1280;
export const WORLD_H = 768;
export const TILE = 64;

export type ResourceKind = "wood" | "gold" | "meat";
export type PlayerUnitKind = "pawn" | "warrior" | "lancer" | "archer" | "monk";
export type EnemyKind =
  | "gnome"
  | "goblin"
  | "gnoll"
  | "thief"
  | "skull"
  | "panda"
  | "minotaur";
export type UnitKind = PlayerUnitKind | EnemyKind;
export type PlayerBuildingKind =
  | "castle"
  | "house"
  | "barracks"
  | "archery"
  | "monastery"
  | "tower";
export type EnemyBuildingKind = "cave" | "goblinHouse" | "goblinTower";
export type BuildingKind = PlayerBuildingKind | EnemyBuildingKind;
export type UnitAction =
  | "idle"
  | "move"
  | "gather"
  | "return"
  | "attack"
  | "heal"
  | "guard";

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
  targetUnitId?: number;
  targetBuildingId?: number;
  targetResourceId?: number;
  homeResourceId?: number;
  workingResource?: ResourceKind;
  gatherClock: number;
  carrying?: ResourceKind;
  carryAmount: number;
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
}

export interface ResourceNode {
  id: number;
  kind: ResourceKind;
  x: number;
  y: number;
  amount: number;
  maxAmount: number;
  variant: number;
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
  | null;

export interface GameState {
  version: 2;
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
  tutorialStep: number;
  tutorialEnabled: boolean;
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
}

export const UNIT_SPEC: Record<UnitKind, UnitSpec> = {
  pawn: { hp: 80, speed: 90, damage: 4, range: 36, cooldown: 1.3, frame: 192, scale: 0.5 },
  warrior: { hp: 190, speed: 93, damage: 27, range: 48, cooldown: 0.82, frame: 192, scale: 0.56 },
  lancer: { hp: 310, speed: 75, damage: 22, range: 62, cooldown: 1, frame: 320, scale: 0.39 },
  archer: { hp: 120, speed: 88, damage: 22, range: 230, cooldown: 1.15, frame: 192, scale: 0.52 },
  monk: { hp: 130, speed: 86, damage: 8, range: 140, cooldown: 1.4, frame: 192, scale: 0.52 },
  gnome: { hp: 68, speed: 80, damage: 11, range: 38, cooldown: 0.85, frame: 192, scale: 0.5 },
  goblin: { hp: 105, speed: 72, damage: 16, range: 56, cooldown: 1, frame: 192, scale: 0.54 },
  gnoll: { hp: 145, speed: 66, damage: 22, range: 180, cooldown: 1.35, frame: 192, scale: 0.57 },
  thief: { hp: 96, speed: 112, damage: 17, range: 38, cooldown: 0.68, frame: 192, scale: 0.5 },
  skull: { hp: 170, speed: 61, damage: 23, range: 44, cooldown: 1.05, frame: 192, scale: 0.55 },
  panda: { hp: 240, speed: 64, damage: 26, range: 48, cooldown: 1.05, frame: 192, scale: 0.6 },
  minotaur: { hp: 620, speed: 55, damage: 48, range: 70, cooldown: 1.5, frame: 320, scale: 0.48 },
};

export const BUILDING_SPEC: Record<BuildingKind, BuildingSpec> = {
  castle: { hp: 1500, asset: "castle", scale: 0.78 },
  house: { hp: 420, asset: "house1", scale: 0.68 },
  barracks: { hp: 720, asset: "barracks", scale: 0.64 },
  archery: { hp: 620, asset: "archery", scale: 0.62 },
  monastery: { hp: 600, asset: "monastery", scale: 0.57 },
  tower: { hp: 760, asset: "tower", scale: 0.69 },
  cave: { hp: 1300, asset: "cave", scale: 0.9, frame: 192 },
  goblinHouse: { hp: 540, asset: "goblinHouse", scale: 0.62 },
  goblinTower: { hp: 680, asset: "goblinTower", scale: 0.55 },
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
  minotaur: {
    idle: "minotaurIdle",
    run: "minotaurRun",
    action: "minotaurAttack",
  },
};

const PLAYER_SPAWN = { x: 290, y: 590 };
const ENEMY_SPAWN = { x: 1120, y: 205 };

const islandRects = [
  { x: 0, y: 128, w: 15 * TILE, h: 10 * TILE },
  { x: 832, y: 256, w: 4 * TILE, h: 4 * TILE },
  { x: 896, y: 0, w: 6 * TILE, h: 8 * TILE },
];

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
): Unit {
  const spec = UNIT_SPEC[kind];
  return {
    id,
    kind,
    team,
    x,
    y,
    targetX: x,
    targetY: y,
    hp: spec.hp,
    maxHp: spec.hp,
    action: kind === "lancer" ? "guard" : "idle",
    facing: team === "player" ? 1 : -1,
    anim: Math.random() * 1.8,
    attackClock: Math.random() * 0.3,
    healClock: 0,
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
  };
}

export function createInitialGame(tutorialEnabled = true): GameState {
  const state: GameState = {
    version: 2,
    time: 0,
    resources: { wood: 170, gold: 125, meat: 135 },
    units: [],
    buildings: [],
    nodes: [],
    projectiles: [],
    effects: [],
    selectedUnitIds: [],
    populationCap: 8,
    wave: 0,
    totalWaves: 3,
    waveClock: 45,
    waveActive: false,
    tutorialStep: tutorialEnabled ? 0 : 6,
    tutorialEnabled,
    outcome: "playing",
    notice: null,
    noticeAge: 0,
    nextId: 1000,
  };

  state.buildings = [
    createBuilding(1, "castle", "player", 225, 545),
    createBuilding(2, "house", "player", 385, 705),
    createBuilding(3, "barracks", "player", 485, 535),
    createBuilding(4, "archery", "player", 620, 605),
    createBuilding(5, "monastery", "player", 480, 330),
    createBuilding(6, "tower", "player", 110, 405),
    createBuilding(100, "cave", "enemy", 1135, 175),
    createBuilding(101, "goblinHouse", "enemy", 1020, 345),
    createBuilding(102, "goblinTower", "enemy", 1200, 430),
  ];

  state.units = [
    createUnit(10, "pawn", "player", 300, 620),
    createUnit(11, "pawn", "player", 360, 610),
    createUnit(12, "warrior", "player", 430, 650),
    createUnit(13, "lancer", "player", 500, 690),
  ];

  state.nodes = [
    { id: 200, kind: "wood", x: 700, y: 350, amount: 120, maxAmount: 120, variant: 0 },
    { id: 201, kind: "wood", x: 765, y: 405, amount: 120, maxAmount: 120, variant: 1 },
    { id: 202, kind: "wood", x: 690, y: 475, amount: 120, maxAmount: 120, variant: 2 },
    { id: 203, kind: "wood", x: 815, y: 540, amount: 120, maxAmount: 120, variant: 3 },
    { id: 210, kind: "gold", x: 690, y: 670, amount: 105, maxAmount: 105, variant: 0 },
    { id: 211, kind: "gold", x: 770, y: 690, amount: 105, maxAmount: 105, variant: 1 },
    { id: 220, kind: "meat", x: 595, y: 710, amount: 80, maxAmount: 80, variant: 0 },
    { id: 221, kind: "meat", x: 665, y: 585, amount: 80, maxAmount: 80, variant: 1 },
  ];

  return state;
}

export function restoreGame(raw: string | null, tutorialEnabled = true) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GameState;
    if (
      parsed.version !== 2 ||
      !Array.isArray(parsed.units) ||
      !Array.isArray(parsed.buildings) ||
      !parsed.resources
    ) {
      return null;
    }
    parsed.tutorialEnabled = tutorialEnabled;
    if (!tutorialEnabled) parsed.tutorialStep = 6;
    parsed.selectedUnitIds = [];
    parsed.selectedBuildingId = undefined;
    parsed.buildMode = undefined;
    parsed.hoverBuildX = undefined;
    parsed.hoverBuildY = undefined;
    parsed.notice = null;
    parsed.noticeAge = 0;
    parsed.projectiles ??= [];
    parsed.effects ??= [];
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

export function isWalkable(x: number, y: number, padding = 22) {
  return islandRects.some(
    (rect) =>
      x >= rect.x + padding &&
      x <= rect.x + rect.w - padding &&
      y >= rect.y + padding &&
      y <= rect.y + rect.h - padding,
  );
}

export function getBuildingSize(kind: BuildingKind) {
  const spec = BUILDING_SPEC[kind];
  const source =
    kind === "castle"
      ? { w: 320, h: 256 }
      : kind === "monastery"
        ? { w: 192, h: 320 }
        : kind === "cave"
          ? { w: 192, h: 192 }
          : kind === "house"
            ? { w: 128, h: 192 }
            : kind === "tower"
              ? { w: 128, h: 256 }
              : kind === "goblinHouse"
                ? { w: 192, h: 192 }
                : kind === "goblinTower"
                  ? { w: 192, h: 256 }
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

function spend(
  state: GameState,
  cost: { wood: number; gold: number; meat: number },
) {
  state.resources.wood -= cost.wood;
  state.resources.gold -= cost.gold;
  state.resources.meat -= cost.meat;
}

function setNotice(state: GameState, notice: Exclude<NoticeKey, null>) {
  state.notice = notice;
  state.noticeAge = 0;
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
  if (!isWalkable(x, y, 72)) return false;
  if (x > 880) return false;
  if (
    state.buildings.some((building) => {
      if (building.hp <= 0) return false;
      const a = getBuildingSize(building.kind);
      return distance(x, y, building.x, building.y) < Math.max(84, (a.w + 100) * 0.48);
    })
  ) {
    return false;
  }
  return !state.nodes.some(
    (node) => node.amount > 0 && distance(x, y, node.x, node.y) < 84,
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
  const building = createBuilding(nextId(state), kind, "player", x, y);
  building.construction = 0;
  building.hp = Math.round(building.maxHp * 0.25);
  state.buildings.push(building);
  state.effects.push({
    id: nextId(state),
    kind: "dust",
    x,
    y,
    age: 0,
    duration: 0.9,
  });
  if (kind === "house") state.populationCap += 4;
  state.selectedBuildingId = building.id;
  state.buildMode = undefined;
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
  return [...state.units]
    .reverse()
    .find(
      (unit) =>
        unit.hp > 0 &&
        (!team || unit.team === team) &&
        distance(x, y, unit.x, unit.y) < (unit.kind === "minotaur" ? 62 : 42),
    );
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
      x >= building.x - size.w * 0.43 &&
      x <= building.x + size.w * 0.43 &&
      y >= building.y - size.h * 0.78 &&
      y <= building.y + size.h * 0.1
    );
  });
}

function hitResource(state: GameState, x: number, y: number) {
  return [...state.nodes]
    .reverse()
    .find(
      (node) =>
        node.amount > 0 &&
        distance(x, y, node.x, node.y) < (node.kind === "wood" ? 58 : 45),
    );
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
    };
  }
  const node = hitResource(state, x, y);
  if (node) {
    return {
      type: "resource",
      id: node.id,
      kind: node.kind,
      amount: Math.ceil(node.amount),
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
    }
    state.marker = { x, y, age: 0, kind: "gather" };
    if (state.tutorialStep === 1 && resource.kind === "wood") state.tutorialStep = 2;
    return;
  }

  if (!isWalkable(x, y)) {
    state.marker = { x, y, age: 0, kind: "invalid" };
    return;
  }

  const columns = Math.ceil(Math.sqrt(selected.length));
  selected.forEach((unit, index) => {
    clearTargets(unit);
    const col = index % columns;
    const row = Math.floor(index / columns);
    const ox = (col - (columns - 1) / 2) * 42;
    const oy = row * 34;
    unit.targetX = x + ox;
    unit.targetY = y + oy;
    unit.action = "move";
  });
  state.marker = { x, y, age: 0, kind: "move" };
}

function moveToward(unit: Unit, x: number, y: number, dt: number) {
  const dx = x - unit.x;
  const dy = y - unit.y;
  const length = Math.hypot(dx, dy);
  if (length < 2) return true;
  const step = Math.min(length, UNIT_SPEC[unit.kind].speed * dt);
  unit.x += (dx / length) * step;
  unit.y += (dy / length) * step;
  if (Math.abs(dx) > 1) unit.facing = dx < 0 ? -1 : 1;
  return length <= UNIT_SPEC[unit.kind].speed * dt + 2;
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
  building.hp = Math.max(0, building.hp - amount);
  if (building.hp <= 0) {
    addEffect(state, "explosion", building.x, building.y - 44, 0.9);
    if (building.kind === "house") {
      state.populationCap = Math.max(4, state.populationCap - 4);
    }
  }
}

function damageUnit(state: GameState, unit: Unit, amount: number) {
  unit.hp = Math.max(0, unit.hp - amount);
  if (unit.hp <= 0) addEffect(state, "explosion", unit.x, unit.y - 20, 0.65);
}

function spawnWave(state: GameState) {
  state.wave += 1;
  state.waveActive = true;
  const waves: EnemyKind[][] = [
    ["gnome", "gnome", "goblin", "goblin", "goblin"],
    ["gnoll", "thief", "thief", "skull", "goblin", "goblin"],
    ["minotaur", "panda", "gnoll", "skull", "thief", "goblin", "gnome"],
  ];
  const kinds = waves[Math.min(state.wave - 1, waves.length - 1)];
  kinds.forEach((kind, index) => {
    const unit = createUnit(
      nextId(state),
      kind,
      "enemy",
      ENEMY_SPAWN.x + (index % 3) * 24 - 26,
      ENEMY_SPAWN.y + Math.floor(index / 3) * 28,
    );
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

function updatePawn(state: GameState, unit: Unit, dt: number) {
  if (unit.action === "gather") {
    const node = state.nodes.find(
      (candidate) => candidate.id === unit.targetResourceId && candidate.amount > 0,
    );
    if (!node) {
      unit.action = "idle";
      unit.targetResourceId = undefined;
      unit.workingResource = undefined;
      return;
    }
    if (!moveToward(unit, node.x - 25, node.y + 10, dt)) return;
    unit.gatherClock += dt;
    if (unit.gatherClock >= 1.15) {
      unit.gatherClock = 0;
      const amount = Math.min(10, node.amount);
      node.amount -= amount;
      unit.carrying = node.kind;
      unit.carryAmount = amount;
      unit.action = "return";
      unit.targetResourceId = undefined;
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
    if (!moveToward(unit, castle.x + 70, castle.y - 12, dt)) return;
    if (unit.carrying) {
      state.resources[unit.carrying] += unit.carryAmount;
      if (state.tutorialStep === 2 && unit.carrying === "wood") state.tutorialStep = 3;
    }
    unit.carrying = undefined;
    unit.carryAmount = 0;
    const home = state.nodes.find(
      (node) => node.id === unit.homeResourceId && node.amount > 0,
    );
    if (home) {
      unit.targetResourceId = home.id;
      unit.action = "gather";
    } else {
      unit.action = "idle";
      unit.workingResource = undefined;
    }
  }
}

function updatePlayerCombat(state: GameState, unit: Unit, dt: number) {
  if (unit.kind === "monk") {
    unit.healClock -= dt;
    const ally = state.units.find(
      (candidate) =>
        candidate.team === "player" &&
        candidate.hp > 0 &&
        candidate.hp < candidate.maxHp &&
        distance(unit.x, unit.y, candidate.x, candidate.y) < 155,
    );
    if (ally && unit.healClock <= 0) {
      ally.hp = Math.min(ally.maxHp, ally.hp + 22);
      unit.healClock = 1.3;
      unit.action = "heal";
      addEffect(state, "heal", ally.x, ally.y - 22, 0.65);
      return;
    }
  }

  let target = state.units.find(
    (candidate) =>
      candidate.id === unit.targetUnitId &&
      candidate.team === "enemy" &&
      candidate.hp > 0,
  );
  let building = state.buildings.find(
    (candidate) =>
      candidate.id === unit.targetBuildingId &&
      candidate.team === "enemy" &&
      candidate.hp > 0,
  );

  if (!target && !building && unit.action === "attack") {
    target = nearestEnemy(state, unit, 210);
    unit.targetUnitId = target?.id;
  }

  if (!target && !building) {
    if (unit.action === "attack" || unit.action === "heal") {
      unit.action = unit.kind === "lancer" ? "guard" : "idle";
      unit.targetUnitId = undefined;
      unit.targetBuildingId = undefined;
    }
    return;
  }

  const tx = target?.x ?? building!.x;
  const ty = target?.y ?? building!.y - 38;
  const spec = UNIT_SPEC[unit.kind];
  const d = distance(unit.x, unit.y, tx, ty);
  if (d > spec.range) {
    unit.action = "attack";
    moveToward(unit, tx, ty, dt);
    return;
  }

  unit.action = "attack";
  unit.facing = tx < unit.x ? -1 : 1;
  if (unit.attackClock > 0) return;
  unit.attackClock = spec.cooldown;

  if (unit.kind === "archer") {
    if (target) {
      state.projectiles.push({
        id: nextId(state),
        x: unit.x,
        y: unit.y - 42,
        targetId: target.id,
        team: "player",
        damage: spec.damage,
        speed: 390,
        age: 0,
      });
    } else if (building) {
      damageBuilding(state, building, spec.damage);
    }
  } else if (target) {
    damageUnit(state, target, spec.damage);
  } else if (building) {
    damageBuilding(state, building, spec.damage);
  }
}

function chooseEnemyTarget(state: GameState, unit: Unit) {
  const nearby = state.units
    .filter(
      (candidate) =>
        candidate.team === "player" &&
        candidate.hp > 0 &&
        distance(unit.x, unit.y, candidate.x, candidate.y) < 185,
    )
    .sort(
      (a, b) =>
        distance(unit.x, unit.y, a.x, a.y) - distance(unit.x, unit.y, b.x, b.y),
    )[0];
  if (nearby) {
    unit.targetUnitId = nearby.id;
    unit.targetBuildingId = undefined;
    return;
  }
  const castle = state.buildings.find(
    (building) => building.kind === "castle" && building.hp > 0,
  );
  unit.targetBuildingId = castle?.id;
  unit.targetUnitId = undefined;
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
    building = state.buildings.find(
      (candidate) => candidate.id === unit.targetBuildingId,
    );
  }
  if (!target && !building) return;

  const tx = target?.x ?? building!.x;
  const ty = target?.y ?? building!.y - 26;
  const spec = UNIT_SPEC[unit.kind];
  const d = distance(unit.x, unit.y, tx, ty);
  if (d > spec.range) {
    unit.action = "move";
    moveToward(unit, tx, ty, dt);
    return;
  }

  unit.action = "attack";
  unit.facing = tx < unit.x ? -1 : 1;
  if (unit.attackClock > 0) return;
  unit.attackClock = spec.cooldown;

  if (unit.kind === "gnoll" && target) {
    state.projectiles.push({
      id: nextId(state),
      x: unit.x,
      y: unit.y - 36,
      targetId: target.id,
      team: "enemy",
      damage: spec.damage,
      speed: 310,
      age: 0,
    });
  } else if (target) {
    damageUnit(state, target, spec.damage);
  } else if (building) {
    damageBuilding(state, building, spec.damage);
  }
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
    if (length < 12) {
      damageUnit(state, target, projectile.damage);
      projectile.age = 99;
      addEffect(state, "dust", target.x, target.y - 22, 0.35);
      continue;
    }
    const step = Math.min(length, projectile.speed * dt);
    projectile.x += (dx / length) * step;
    projectile.y += (dy / length) * step;
  }
  state.projectiles = state.projectiles.filter(
    (projectile) => projectile.age < 5,
  );
}

function updateBuildings(state: GameState, dt: number) {
  for (const building of state.buildings) {
    if (building.hp <= 0) continue;
    building.attackClock = Math.max(0, building.attackClock - dt);

    if (building.construction < 1) {
      building.construction = Math.min(1, building.construction + dt / 5);
      building.hp = Math.min(
        building.maxHp,
        building.hp + (building.maxHp * dt) / 6.7,
      );
      continue;
    }

    if (building.queue) {
      building.queue.remaining -= dt;
      if (building.queue.remaining <= 0) {
        const kind = building.queue.kind;
        const unit = createUnit(
          nextId(state),
          kind,
          "player",
          building.x + 72,
          building.y + 28,
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
            distance(building.x, building.y, unit.x, unit.y) < 285,
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
          y: building.y - 135,
          targetId: enemy.id,
          team: "player",
          damage: 34,
          speed: 430,
          age: 0,
        });
        building.attackClock = 1.15;
      }
    }
  }
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
  if (!state.waveActive && state.wave < state.totalWaves && state.waveClock <= 0) {
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

    if (unit.kind === "pawn" && (unit.action === "gather" || unit.action === "return")) {
      updatePawn(state, unit, dt);
      continue;
    }

    if (unit.action === "move") {
      if (moveToward(unit, unit.targetX, unit.targetY, dt)) {
        unit.action = unit.kind === "lancer" ? "guard" : "idle";
      }
      continue;
    }

    if (
      unit.action === "attack" ||
      unit.action === "heal" ||
      unit.targetUnitId ||
      unit.targetBuildingId
    ) {
      updatePlayerCombat(state, unit, dt);
      continue;
    }

    const nearby = nearestEnemy(state, unit, unit.kind === "archer" ? 220 : 120);
    if (nearby && unit.kind !== "pawn") {
      unit.targetUnitId = nearby.id;
      unit.action = "attack";
    } else if (unit.kind === "monk") {
      updatePlayerCombat(state, unit, dt);
    }
  }

  updateBuildings(state, dt);
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
    state.waveClock = state.wave >= state.totalWaves ? 9999 : 23;
  }

  const castle = state.buildings.find((building) => building.kind === "castle");
  const cave = state.buildings.find((building) => building.kind === "cave");
  if (!castle || castle.hp <= 0) {
    state.outcome = "defeat";
  } else if (
    state.wave >= state.totalWaves &&
    !state.waveActive &&
    livingEnemies === 0 &&
    (!cave || cave.hp <= 0)
  ) {
    state.outcome = "victory";
  }
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
  const frames = Math.max(1, Math.floor(image.width / frameSize));
  const sourceFrame = ((frame % frames) + frames) % frames;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    image,
    sourceFrame * frameSize,
    0,
    frameSize,
    frameSize,
    (-frameSize * scale) / 2,
    -frameSize * scale * 0.78,
    frameSize * scale,
    frameSize * scale,
  );
  ctx.restore();
}

function drawIslandRect(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  x: number,
  y: number,
  columns: number,
  rows: number,
  time: number,
  tilemap: AssetKey = "grassSpring",
) {
  const terrain = images[tilemap];
  const foam = images.foam;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      if (row !== 0 && row !== rows - 1 && col !== 0 && col !== columns - 1) continue;
      const frame = Math.floor(time * 9 + col * 2 + row * 3) % 16;
      ctx.drawImage(
        foam,
        frame * 192,
        0,
        192,
        192,
        x + col * TILE - 64,
        y + row * TILE - 64,
        192,
        192,
      );
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const sx = col === 0 ? 0 : col === columns - 1 ? 128 : 64;
      const sy = row === 0 ? 0 : row === rows - 1 ? 128 : 64;
      ctx.drawImage(
        terrain,
        sx,
        sy,
        64,
        64,
        x + col * TILE,
        y + row * TILE,
        64,
        64,
      );
    }
  }
}

function drawElevation(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  x: number,
  y: number,
  columns: number,
  rows: number,
  time: number,
) {
  drawIslandRect(ctx, images, x, y, columns, rows, time, "grassDeep");
  const terrain = images.grassDeep;
  for (let col = 0; col < columns; col += 1) {
    const sx = col === 0 ? 320 : col === columns - 1 ? 448 : 384;
    for (let face = 0; face < 3; face += 1) {
      ctx.drawImage(
        terrain,
        sx,
        192 + face * 64,
        64,
        64,
        x + col * 64,
        y + rows * 64 + face * 64,
        64,
        64,
      );
    }
  }
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  max: number,
  team: "player" | "enemy",
  width = 54,
) {
  const ratio = Math.max(0, Math.min(1, value / max));
  ctx.fillStyle = "rgba(20, 29, 34, .78)";
  ctx.fillRect(x - width / 2 - 2, y - 2, width + 4, 8);
  ctx.fillStyle = team === "player" ? "#7fd86d" : "#ed6a5b";
  ctx.fillRect(x - width / 2, y, width * ratio, 4);
  ctx.strokeStyle = "rgba(255, 244, 197, .75)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2, y, width, 4);
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  building: Building,
  selected: boolean,
  time: number,
) {
  const spec = BUILDING_SPEC[building.kind];
  const image = images[spec.asset];
  const size = getBuildingSize(building.kind);
  const alpha = building.construction < 1 ? 0.55 + building.construction * 0.45 : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (selected) {
    ctx.fillStyle = "rgba(255, 232, 106, .28)";
    ctx.beginPath();
    ctx.ellipse(building.x, building.y - 6, size.w * 0.48, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffe36f";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (spec.frame) {
    const frame = Math.floor(time * 8) % Math.max(1, Math.floor(image.width / spec.frame));
    drawSprite(
      ctx,
      image,
      spec.frame,
      frame,
      building.x,
      building.y + 18,
      spec.scale,
      1,
      alpha,
    );
  } else {
    ctx.drawImage(
      image,
      building.x - size.w / 2,
      building.y - size.h,
      size.w,
      size.h,
    );
  }
  ctx.restore();

  if (building.hp < building.maxHp || selected) {
    drawHealthBar(
      ctx,
      building.x,
      building.y - size.h - 10,
      building.hp,
      building.maxHp,
      building.team,
      Math.min(100, size.w * 0.7),
    );
  }

  if (building.queue) {
    const progress = 1 - building.queue.remaining / building.queue.total;
    ctx.fillStyle = "rgba(20, 29, 34, .85)";
    ctx.fillRect(building.x - 37, building.y + 7, 74, 9);
    ctx.fillStyle = "#efcb62";
    ctx.fillRect(building.x - 35, building.y + 9, 70 * progress, 5);
  }
}

function unitAsset(unit: Unit): AssetKey {
  const sprites =
    unit.team === "player"
      ? PLAYER_SPRITES[unit.kind as PlayerUnitKind]
      : ENEMY_SPRITES[unit.kind as EnemyKind];
  if (unit.kind === "pawn" && unit.action === "return") {
    if (unit.carrying === "gold") return "pawnGold";
    if (unit.carrying === "meat") return "pawnMeat";
    return "pawnWood";
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

function drawUnit(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  unit: Unit,
  selected: boolean,
) {
  const spec = UNIT_SPEC[unit.kind];
  if (selected) {
    ctx.fillStyle = "rgba(255, 232, 106, .24)";
    ctx.strokeStyle = "#ffe36f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(
      unit.x,
      unit.y - 4,
      unit.kind === "minotaur" ? 48 : 32,
      unit.kind === "minotaur" ? 22 : 15,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.stroke();
  }
  const image = images[unitAsset(unit)];
  const fps =
    unit.action === "attack" || unit.action === "gather" || unit.action === "heal"
      ? 11
      : unit.action === "move" || unit.action === "return"
        ? 9
        : 7;
  drawSprite(
    ctx,
    image,
    spec.frame,
    Math.floor(unit.anim * fps),
    unit.x,
    unit.y,
    spec.scale,
    unit.facing,
  );
  if (unit.hp < unit.maxHp || selected) {
    drawHealthBar(
      ctx,
      unit.x,
      unit.y - spec.frame * spec.scale * 0.72,
      unit.hp,
      unit.maxHp,
      unit.team,
      unit.kind === "minotaur" ? 78 : 48,
    );
  }
}

function drawResource(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  node: ResourceNode,
  time: number,
) {
  if (node.kind === "wood") {
    const treeKey = `tree${(node.variant % 4) + 1}` as AssetKey;
    const image = node.amount > 0 ? images[treeKey] : images.stump1;
    const scale = node.amount > 0 ? 0.67 : 0.9;
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.drawImage(image, node.x - width / 2, node.y - height * 0.82, width, height);
    return;
  }
  if (node.kind === "gold") {
    if (node.amount <= 0) return;
    const key = `gold${(node.variant % 3) + 1}` as AssetKey;
    const image = images[key];
    const scale = 0.76;
    ctx.drawImage(
      image,
      node.x - (image.width * scale) / 2,
      node.y - image.height * scale * 0.68,
      image.width * scale,
      image.height * scale,
    );
    return;
  }
  if (node.amount <= 0) return;
  const image = images.sheepIdle;
  drawSprite(
    ctx,
    image,
    128,
    Math.floor(time * 7 + node.variant * 2),
    node.x,
    node.y,
    0.72,
    node.variant % 2 ? -1 : 1,
  );
}

function drawEffect(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  effect: Effect,
) {
  if (effect.kind === "heal") {
    const image = images.monkEffect;
    const frame = Math.floor((effect.age / effect.duration) * (image.width / 192));
    drawSprite(ctx, image, 192, frame, effect.x, effect.y + 35, 0.58);
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
  drawSprite(ctx, image, frameSize, frame, effect.x, effect.y + 15, 0.72);
}

function drawStaticDecor(ctx: CanvasRenderingContext2D, images: ImageBank, time: number) {
  const waterRocks = [
    { key: "waterRock1" as const, x: 1010, y: 610, frame: 3 },
    { key: "waterRock2" as const, x: 925, y: 690, frame: 9 },
    { key: "waterRock1" as const, x: 22, y: 92, frame: 11 },
  ];
  for (const rock of waterRocks) {
    drawSprite(
      ctx,
      images[rock.key],
      64,
      Math.floor(time * 7 + rock.frame),
      rock.x,
      rock.y,
      1,
    );
  }

  const rocks = [
    { key: "rock1" as const, x: 65, y: 705 },
    { key: "rock4" as const, x: 845, y: 690 },
    { key: "rock3" as const, x: 930, y: 470 },
  ];
  for (const rock of rocks) {
    const image = images[rock.key];
    ctx.drawImage(image, rock.x - 32, rock.y - 48, 64, 64);
  }

  const bushes = [
    { key: "bush1" as const, x: 70, y: 255, seed: 0 },
    { key: "bush2" as const, x: 830, y: 215, seed: 4 },
    { key: "bush1" as const, x: 895, y: 475, seed: 2 },
  ];
  for (const bush of bushes) {
    drawSprite(
      ctx,
      images[bush.key],
      128,
      Math.floor(time * 5 + bush.seed),
      bush.x,
      bush.y,
      0.72,
    );
  }
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  state: GameState,
  drag?: { active: boolean; startX: number; startY: number; x: number; y: number },
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, WORLD_W, WORLD_H);
  ctx.fillStyle = "#49aaab";
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#e6fff2";
  ctx.lineWidth = 1;
  for (let y = 20; y < WORLD_H; y += 34) {
    ctx.beginPath();
    for (let x = 0; x <= WORLD_W; x += 16) {
      const yy = y + Math.sin(x * 0.028 + state.time * 1.4 + y) * 3;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.restore();

  drawIslandRect(ctx, images, 0, 128, 15, 10, state.time);
  drawIslandRect(ctx, images, 832, 256, 4, 4, state.time);
  drawIslandRect(ctx, images, 896, 0, 6, 8, state.time, "grassAutumn");
  drawElevation(ctx, images, 128, 128, 5, 2, state.time);
  drawStaticDecor(ctx, images, state.time);

  const queue: Array<{ y: number; draw: () => void }> = [];
  for (const node of state.nodes) {
    queue.push({
      y: node.y,
      draw: () => drawResource(ctx, images, node, state.time),
    });
  }
  for (const building of state.buildings) {
    if (building.hp <= 0) continue;
    queue.push({
      y: building.y,
      draw: () =>
        drawBuilding(
          ctx,
          images,
          building,
          state.selectedBuildingId === building.id,
          state.time,
        ),
    });
  }
  for (const unit of state.units) {
    queue.push({
      y: unit.y,
      draw: () =>
        drawUnit(ctx, images, unit, state.selectedUnitIds.includes(unit.id)),
    });
  }
  queue.sort((a, b) => a.y - b.y);
  queue.forEach((entry) => entry.draw());

  for (const projectile of state.projectiles) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(Math.atan2(-12, projectile.team === "player" ? 30 : -30));
    ctx.drawImage(images.arrow, -20, -8, 40, 40);
    ctx.restore();
  }
  for (const effect of state.effects) drawEffect(ctx, images, effect);

  if (
    state.buildMode &&
    state.hoverBuildX !== undefined &&
    state.hoverBuildY !== undefined
  ) {
    const kind = state.buildMode;
    const valid = placementIsValid(state, state.hoverBuildX, state.hoverBuildY);
    const ghost = createBuilding(
      -1,
      kind,
      "player",
      state.hoverBuildX,
      state.hoverBuildY,
    );
    ctx.save();
    ctx.globalAlpha = valid ? 0.65 : 0.42;
    ctx.filter = valid ? "none" : "sepia(1) saturate(5) hue-rotate(320deg)";
    drawBuilding(ctx, images, ghost, false, state.time);
    ctx.restore();
    ctx.strokeStyle = valid ? "#9ef08e" : "#ff6b5f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(
      state.hoverBuildX,
      state.hoverBuildY,
      kind === "tower" ? 50 : 64,
      24,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  if (state.marker) {
    const radius = 14 + state.marker.age * 24;
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
}

export function renderMenuWorld(
  ctx: CanvasRenderingContext2D,
  images: ImageBank,
  time: number,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#49aaab";
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  drawIslandRect(ctx, images, 90, 150, 11, 8, time);
  drawIslandRect(ctx, images, 860, 70, 5, 5, time, "grassDeep");
  drawElevation(ctx, images, 195, 150, 5, 2, time);

  const castle = createBuilding(-1, "castle", "player", 380, 460);
  drawBuilding(ctx, images, castle, false, time);
  drawBuilding(
    ctx,
    images,
    createBuilding(-2, "tower", "player", 140, 620),
    false,
    time,
  );
  drawBuilding(
    ctx,
    images,
    createBuilding(-3, "house", "player", 640, 620),
    false,
    time,
  );
  drawBuilding(
    ctx,
    images,
    createBuilding(-4, "cave", "enemy", 1030, 300),
    false,
    time,
  );

  const units = [
    createUnit(-10, "warrior", "player", 490, 580),
    createUnit(-11, "lancer", "player", 565, 565),
    createUnit(-12, "pawn", "player", 700, 570),
    createUnit(-13, "gnome", "enemy", 940, 390),
    createUnit(-14, "gnoll", "enemy", 1050, 430),
  ];
  units.forEach((unit, index) => {
    unit.anim = time + index * 0.28;
    unit.facing = unit.team === "player" ? 1 : -1;
    drawUnit(ctx, images, unit, false);
  });

  const tree = images.tree2;
  ctx.drawImage(tree, 685, 225, tree.width * 0.67, tree.height * 0.67);
  const cloud = images.cloud1;
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.drawImage(cloud, 820 + Math.sin(time * 0.15) * 18, 570, 360, 160);
  ctx.restore();
}
