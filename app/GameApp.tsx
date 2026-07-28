"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Locale = "vi" | "en";
type Screen = "menu" | "how" | "settings" | "game" | "victory" | "defeat";
type ResourceKind = "wood" | "gold" | "meat";
type PlayerUnitKind = "pawn" | "warrior";
type UnitKind = PlayerUnitKind | "goblin";
type Action =
  | "idle"
  | "move"
  | "gather"
  | "return"
  | "attack"
  | "dead";

const TEXT: Record<Locale, Record<string, string>> = {
  vi: {
    subtitle: "Giữ vững vương quốc. Viết nên huyền thoại.",
    chooseLanguage: "Chọn ngôn ngữ",
    continue: "Tiếp tục",
    newGame: "Trò chơi mới",
    howToPlay: "Cách chơi",
    settings: "Cài đặt",
    codex: "Thư viện",
    credits: "Credits",
    language: "Ngôn ngữ",
    campaign: "The Green Frontier · Bản thử nghiệm",
    campaignDesc:
      "Thu thập tài nguyên, điều quân và bảo vệ Lâu đài khỏi Goblin.",
    start: "Bắt đầu nhiệm vụ",
    back: "Quay lại",
    menu: "Menu",
    resume: "Tiếp tục",
    restart: "Chơi lại",
    loading: "Đang chuẩn bị chiến trường…",
    pause: "Tạm dừng",
    paused: "TRẬN ĐẤU ĐANG TẠM DỪNG",
    wood: "Gỗ",
    gold: "Vàng",
    meat: "Thịt",
    castle: "Lâu đài",
    castleTip: "Căn cứ chính. Bảo vệ nơi này bằng mọi giá.",
    pawn: "Dân công",
    pawnTip: "Thu thập Gỗ, Vàng và Thịt rồi mang về Lâu đài.",
    warrior: "Chiến binh",
    warriorTip: "Đơn vị cận chiến. Chọn rồi chuột phải vào Goblin để tấn công.",
    goblin: "Spear Goblin",
    goblinTip: "Kẻ địch cận chiến đang tiến về Lâu đài.",
    tree: "Cây gỗ",
    treeTip: "Chọn Dân công rồi chuột phải để khai thác Gỗ.",
    goldStone: "Đá vàng",
    goldStoneTip: "Chọn Dân công rồi chuột phải để đào Vàng.",
    sheep: "Cừu hoang",
    sheepTip: "Chọn Dân công rồi chuột phải để thu thập Thịt.",
    selectHint: "Click hoặc kéo chuột trái để chọn quân",
    commandHint: "Chuột phải để di chuyển, khai thác hoặc tấn công",
    selected: "Đang chọn",
    noSelection: "Chưa chọn đơn vị",
    move: "Di chuyển",
    gather: "Khai thác",
    attack: "Tấn công",
    objective: "Mục tiêu",
    objectiveText: "Thu thập tài nguyên và đánh bại toàn bộ Goblin.",
    wave: "Đợt 1",
    incoming: "Goblin đang tiến đến",
    victory: "CHIẾN THẮNG",
    victoryText:
      "The Green Frontier đã được bảo vệ. Tài nguyên và quân đội đều an toàn.",
    defeat: "THẤT BẠI",
    defeatText: "Lâu đài đã thất thủ. Hãy tổ chức đội hình và thử lại.",
    tutorial: "Hướng dẫn",
    tutorial0: "Chọn một Dân công bằng chuột trái.",
    tutorial1: "Chuột phải vào cây để ra lệnh khai thác Gỗ.",
    tutorial2: "Chờ Dân công mang Gỗ trở về Lâu đài.",
    tutorial3: "Chọn Chiến binh để chuẩn bị phòng thủ.",
    tutorial4: "Chuột phải vào Spear Goblin để tấn công.",
    tutorial5: "Tốt lắm! Hãy tự do điều quân và bảo vệ Lâu đài.",
    skip: "Bỏ qua",
    hints: "Gợi ý hướng dẫn",
    tooltips: "Tooltip khi trỏ chuột",
    uiScale: "Kích thước giao diện",
    audio: "Âm thanh",
    on: "Bật",
    off: "Tắt",
    howTitle: "Chỉ huy trong 60 giây",
    howSelect: "Chọn quân",
    howSelectDesc:
      "Click một đơn vị hoặc kéo khung chọn. Giữ Shift để thêm đơn vị vào nhóm.",
    howCommand: "Ra lệnh thông minh",
    howCommandDesc:
      "Chuột phải xuống đất để đi, vào tài nguyên để khai thác, vào kẻ địch để đánh.",
    howEconomy: "Xây nền kinh tế",
    howEconomyDesc:
      "Dân công mang Gỗ, Vàng và Thịt về Lâu đài. Tài nguyên sẽ mở rộng quân đội ở các bản sau.",
    howDefend: "Bảo vệ Lâu đài",
    howDefendDesc:
      "Goblin sẽ tấn công sau thời gian chuẩn bị. Dùng Chiến binh chặn chúng.",
    firstMission: "Nhiệm vụ đầu tiên",
    unavailable:
      "Chưa có tiến trình đã lưu. Hãy bắt đầu một Trò chơi mới.",
    alpha: "Playable Alpha · Canvas + DOM + Events",
  },
  en: {
    subtitle: "Hold the kingdom. Write the legend.",
    chooseLanguage: "Choose your language",
    continue: "Continue",
    newGame: "New Game",
    howToPlay: "How to Play",
    settings: "Settings",
    codex: "Codex",
    credits: "Credits",
    language: "Language",
    campaign: "The Green Frontier · Prototype",
    campaignDesc:
      "Gather resources, command your troops, and defend the Castle from Goblins.",
    start: "Start mission",
    back: "Back",
    menu: "Menu",
    resume: "Resume",
    restart: "Play again",
    loading: "Preparing the battlefield…",
    pause: "Pause",
    paused: "BATTLE PAUSED",
    wood: "Wood",
    gold: "Gold",
    meat: "Meat",
    castle: "Castle",
    castleTip: "Your main base. Protect it at all costs.",
    pawn: "Pawn",
    pawnTip: "Collects Wood, Gold, and Meat, then returns them to the Castle.",
    warrior: "Warrior",
    warriorTip: "Melee unit. Select it and right-click a Goblin to attack.",
    goblin: "Spear Goblin",
    goblinTip: "A melee enemy advancing toward your Castle.",
    tree: "Wood tree",
    treeTip: "Select a Pawn and right-click to gather Wood.",
    goldStone: "Gold stone",
    goldStoneTip: "Select a Pawn and right-click to mine Gold.",
    sheep: "Wild sheep",
    sheepTip: "Select a Pawn and right-click to gather Meat.",
    selectHint: "Left-click or drag to select units",
    commandHint: "Right-click to move, gather, or attack",
    selected: "Selected",
    noSelection: "No unit selected",
    move: "Move",
    gather: "Gather",
    attack: "Attack",
    objective: "Objective",
    objectiveText: "Gather resources and defeat every Goblin.",
    wave: "Wave 1",
    incoming: "Goblins are approaching",
    victory: "VICTORY",
    victoryText:
      "The Green Frontier is safe. Your resources and army have survived.",
    defeat: "DEFEAT",
    defeatText: "The Castle has fallen. Rebuild your formation and try again.",
    tutorial: "Tutorial",
    tutorial0: "Select a Pawn with the left mouse button.",
    tutorial1: "Right-click a tree to order the Pawn to gather Wood.",
    tutorial2: "Wait for the Pawn to bring Wood back to the Castle.",
    tutorial3: "Select the Warrior and prepare the defense.",
    tutorial4: "Right-click a Spear Goblin to attack.",
    tutorial5: "Great work! Command freely and protect the Castle.",
    skip: "Skip",
    hints: "Tutorial hints",
    tooltips: "Hover tooltips",
    uiScale: "Interface size",
    audio: "Audio",
    on: "On",
    off: "Off",
    howTitle: "Command in 60 seconds",
    howSelect: "Select your troops",
    howSelectDesc:
      "Click one unit or drag a selection box. Hold Shift to add units to the group.",
    howCommand: "Issue smart commands",
    howCommandDesc:
      "Right-click the ground to move, a resource to gather, or an enemy to attack.",
    howEconomy: "Build the economy",
    howEconomyDesc:
      "Pawns carry Wood, Gold, and Meat to the Castle. Future missions use them to grow the army.",
    howDefend: "Defend the Castle",
    howDefendDesc:
      "Goblins attack after a short preparation. Use the Warrior to stop them.",
    firstMission: "First mission",
    unavailable: "No saved progress yet. Start a New Game first.",
    alpha: "Playable Alpha · Canvas + DOM + Events",
  },
};

const ASSET_SOURCES = {
  pawnIdle: "/game-assets/player/pawn-idle.png",
  pawnRun: "/game-assets/player/pawn-run.png",
  pawnGatherWood: "/game-assets/player/pawn-gather-wood.png",
  pawnGatherGold: "/game-assets/player/pawn-gather-gold.png",
  pawnGatherMeat: "/game-assets/player/pawn-gather-meat.png",
  pawnCarryWood: "/game-assets/player/pawn-carry-wood.png",
  pawnCarryGold: "/game-assets/player/pawn-carry-gold.png",
  pawnCarryMeat: "/game-assets/player/pawn-carry-meat.png",
  warriorIdle: "/game-assets/player/warrior-idle.png",
  warriorRun: "/game-assets/player/warrior-run.png",
  warriorAttack: "/game-assets/player/warrior-attack.png",
  goblinIdle: "/game-assets/enemy/goblin-idle.png",
  goblinRun: "/game-assets/enemy/goblin-run.png",
  goblinAttack: "/game-assets/enemy/goblin-attack.png",
  castle: "/game-assets/world/castle.png",
  tree: "/game-assets/world/tree.png",
  stump: "/game-assets/world/stump.png",
  goldStone: "/game-assets/world/gold-stone.png",
  sheep: "/game-assets/world/sheep-idle.png",
} as const;

type AssetKey = keyof typeof ASSET_SOURCES;
type Images = Record<AssetKey, HTMLImageElement>;

interface Unit {
  id: number;
  kind: UnitKind;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  speed: number;
  selected: boolean;
  action: Action;
  facing: number;
  animTime: number;
  cooldown: number;
  attackTarget?: number;
  resourceTarget?: number;
  carrying?: ResourceKind;
  gatherTime: number;
  homeResource?: number;
}

interface ResourceNode {
  id: number;
  kind: ResourceKind;
  x: number;
  y: number;
  amount: number;
  maxAmount: number;
}

interface HoverInfo {
  kind:
    | "pawn"
    | "warrior"
    | "goblin"
    | "tree"
    | "goldStone"
    | "sheep"
    | "castle";
  x: number;
  y: number;
  hp?: number;
  maxHp?: number;
  amount?: number;
}

interface GameData {
  units: Unit[];
  nodes: ResourceNode[];
  castleHp: number;
  wood: number;
  gold: number;
  meat: number;
  time: number;
  marker?: { x: number; y: number; age: number; kind: "move" | "attack" | "gather" };
}

const WORLD_W = 1280;
const WORLD_H = 720;
const CASTLE = { x: 230, y: 370, w: 200, h: 160, maxHp: 1000 };

function createGame(): GameData {
  return {
    wood: 40,
    gold: 20,
    meat: 30,
    castleHp: CASTLE.maxHp,
    time: 0,
    units: [
      {
        id: 1,
        kind: "pawn",
        x: 380,
        y: 410,
        targetX: 380,
        targetY: 410,
        hp: 70,
        maxHp: 70,
        speed: 92,
        selected: false,
        action: "idle",
        facing: 1,
        animTime: 0,
        cooldown: 0,
        gatherTime: 0,
      },
      {
        id: 2,
        kind: "pawn",
        x: 330,
        y: 500,
        targetX: 330,
        targetY: 500,
        hp: 70,
        maxHp: 70,
        speed: 92,
        selected: false,
        action: "idle",
        facing: 1,
        animTime: 0,
        cooldown: 0,
        gatherTime: 0,
      },
      {
        id: 3,
        kind: "warrior",
        x: 440,
        y: 455,
        targetX: 440,
        targetY: 455,
        hp: 170,
        maxHp: 170,
        speed: 106,
        selected: false,
        action: "idle",
        facing: 1,
        animTime: 0,
        cooldown: 0,
        gatherTime: 0,
      },
      ...[
        [1030, 190],
        [1120, 310],
        [1060, 480],
      ].map(
        ([x, y], index): Unit => ({
          id: 100 + index,
          kind: "goblin",
          x,
          y,
          targetX: x,
          targetY: y,
          hp: 95,
          maxHp: 95,
          speed: 62 + index * 3,
          selected: false,
          action: "idle",
          facing: -1,
          animTime: index * 0.35,
          cooldown: 0,
          gatherTime: 0,
        }),
      ),
    ],
    nodes: [
      { id: 10, kind: "wood", x: 590, y: 180, amount: 60, maxAmount: 60 },
      { id: 11, kind: "wood", x: 700, y: 250, amount: 60, maxAmount: 60 },
      { id: 12, kind: "wood", x: 610, y: 360, amount: 60, maxAmount: 60 },
      { id: 20, kind: "gold", x: 690, y: 575, amount: 50, maxAmount: 50 },
      { id: 30, kind: "meat", x: 500, y: 610, amount: 35, maxAmount: 35 },
    ],
  };
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function moveToward(unit: Unit, x: number, y: number, dt: number) {
  const dx = x - unit.x;
  const dy = y - unit.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) return true;
  const step = Math.min(length, unit.speed * dt);
  unit.x += (dx / length) * step;
  unit.y += (dy / length) * step;
  unit.facing = dx < 0 ? -1 : 1;
  return length <= unit.speed * dt + 2;
}

async function loadImages(): Promise<Images> {
  const entries = await Promise.all(
    Object.entries(ASSET_SOURCES).map(
      ([key, src]) =>
        new Promise<[AssetKey, HTMLImageElement]>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve([key as AssetKey, image]);
          image.onerror = reject;
          image.src = src;
        }),
    ),
  );
  return Object.fromEntries(entries) as Images;
}

function useStoredLocale() {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem("tai-kingdom-locale");
    if (saved === "vi" || saved === "en") {
      document.documentElement.lang = saved;
      setLocaleState(saved);
    }
  }, []);
  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem("tai-kingdom-locale", next);
    document.documentElement.lang = next;
    setLocaleState(next);
  }, []);
  return [locale, setLocale] as const;
}

function GameScene({
  locale,
  hintsEnabled,
  tooltipsEnabled,
  onExit,
  onOutcome,
}: {
  locale: Locale;
  hintsEnabled: boolean;
  tooltipsEnabled: boolean;
  onExit: () => void;
  onOutcome: (outcome: "victory" | "defeat") => void;
}) {
  const t = useCallback((key: string) => TEXT[locale][key] ?? key, [locale]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameData>(createGame());
  const imagesRef = useRef<Images | null>(null);
  const pausedRef = useRef(false);
  const tutorialRef = useRef(hintsEnabled ? 0 : 5);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    x: number;
    y: number;
  }>({ active: false, startX: 0, startY: 0, x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [paused, setPausedState] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(hintsEnabled ? 0 : 5);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [selectedKinds, setSelectedKinds] = useState<UnitKind[]>([]);
  const [hud, setHud] = useState({
    wood: 40,
    gold: 20,
    meat: 30,
    castleHp: CASTLE.maxHp,
    enemies: 3,
  });

  const setPaused = useCallback((value: boolean) => {
    pausedRef.current = value;
    setPausedState(value);
  }, []);

  const setTutorial = useCallback((step: number) => {
    tutorialRef.current = step;
    setTutorialStep(step);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadImages()
      .then((images) => {
        if (!cancelled) {
          imagesRef.current = images;
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const loadedImages = imagesRef.current;
    if (!canvas || !loadedImages) return;
    const images: Images = loadedImages;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let frameId = 0;
    let lastTime = performance.now();
    let hudClock = 0;
    let ended = false;

    function getPointer(event: PointerEvent | MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * WORLD_W,
        y: ((event.clientY - rect.top) / rect.height) * WORLD_H,
      };
    }

    function selectedPlayers() {
      return gameRef.current.units.filter(
        (unit) =>
          unit.selected && unit.kind !== "goblin" && unit.action !== "dead",
      );
    }

    function refreshSelection() {
      setSelectedKinds(selectedPlayers().map((unit) => unit.kind));
    }

    function playerAt(x: number, y: number) {
      return gameRef.current.units
        .filter((unit) => unit.kind !== "goblin" && unit.action !== "dead")
        .reverse()
        .find((unit) => dist(x, y, unit.x, unit.y) < 44);
    }

    function enemyAt(x: number, y: number) {
      return gameRef.current.units
        .filter((unit) => unit.kind === "goblin" && unit.action !== "dead")
        .find((unit) => dist(x, y, unit.x, unit.y) < 48);
    }

    function resourceAt(x: number, y: number) {
      return gameRef.current.nodes.find((node) => {
        const radius = node.kind === "wood" ? 64 : 44;
        return node.amount > 0 && dist(x, y, node.x, node.y) < radius;
      });
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0 || pausedRef.current) return;
      const point = getPointer(event);
      dragRef.current = {
        active: true,
        startX: point.x,
        startY: point.y,
        x: point.x,
        y: point.y,
      };
      canvas!.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      const point = getPointer(event);
      if (dragRef.current.active) {
        dragRef.current.x = point.x;
        dragRef.current.y = point.y;
      }
      if (!tooltipsEnabled) {
        setHover(null);
        return;
      }
      const game = gameRef.current;
      const player = playerAt(point.x, point.y);
      const enemy = enemyAt(point.x, point.y);
      const resource = resourceAt(point.x, point.y);
      const rect = canvas!.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;
      if (player) {
        setHover({
          kind: player.kind as PlayerUnitKind,
          x: screenX,
          y: screenY,
          hp: player.hp,
          maxHp: player.maxHp,
        });
      } else if (enemy) {
        setHover({
          kind: "goblin",
          x: screenX,
          y: screenY,
          hp: enemy.hp,
          maxHp: enemy.maxHp,
        });
      } else if (resource) {
        setHover({
          kind:
            resource.kind === "wood"
              ? "tree"
              : resource.kind === "gold"
                ? "goldStone"
                : "sheep",
          x: screenX,
          y: screenY,
          amount: resource.amount,
        });
      } else if (
        point.x > CASTLE.x - 100 &&
        point.x < CASTLE.x + 100 &&
        point.y > CASTLE.y - 80 &&
        point.y < CASTLE.y + 80
      ) {
        setHover({
          kind: "castle",
          x: screenX,
          y: screenY,
          hp: game.castleHp,
          maxHp: CASTLE.maxHp,
        });
      } else {
        setHover(null);
      }
    }

    function onPointerUp(event: PointerEvent) {
      if (event.button !== 0 || !dragRef.current.active || pausedRef.current)
        return;
      const point = getPointer(event);
      const drag = dragRef.current;
      drag.active = false;
      const moved = dist(drag.startX, drag.startY, point.x, point.y);
      const game = gameRef.current;
      if (!event.shiftKey) {
        game.units.forEach((unit) => {
          if (unit.kind !== "goblin") unit.selected = false;
        });
      }
      if (moved < 10) {
        const target = playerAt(point.x, point.y);
        if (target) {
          target.selected = event.shiftKey ? !target.selected : true;
          if (tutorialRef.current === 0 && target.kind === "pawn") setTutorial(1);
          if (tutorialRef.current === 3 && target.kind === "warrior")
            setTutorial(4);
        }
      } else {
        const left = Math.min(drag.startX, point.x);
        const right = Math.max(drag.startX, point.x);
        const top = Math.min(drag.startY, point.y);
        const bottom = Math.max(drag.startY, point.y);
        game.units.forEach((unit) => {
          if (
            unit.kind !== "goblin" &&
            unit.action !== "dead" &&
            unit.x >= left &&
            unit.x <= right &&
            unit.y >= top &&
            unit.y <= bottom
          ) {
            unit.selected = true;
          }
        });
      }
      refreshSelection();
    }

    function onContextMenu(event: MouseEvent) {
      event.preventDefault();
      if (pausedRef.current) return;
      const point = getPointer(event);
      const units = selectedPlayers();
      if (!units.length) return;
      const game = gameRef.current;
      const resource = resourceAt(point.x, point.y);
      const enemy = enemyAt(point.x, point.y);

      if (resource && units.some((unit) => unit.kind === "pawn")) {
        units.forEach((unit, index) => {
          if (unit.kind !== "pawn") return;
          unit.resourceTarget = resource.id;
          unit.homeResource = resource.id;
          unit.attackTarget = undefined;
          unit.targetX = resource.x + (index % 2) * 24 - 12;
          unit.targetY = resource.y + Math.floor(index / 2) * 18;
          unit.action = "move";
          unit.carrying = undefined;
        });
        game.marker = {
          x: resource.x,
          y: resource.y,
          age: 0,
          kind: "gather",
        };
        if (
          tutorialRef.current === 1 &&
          resource.kind === "wood" &&
          units.some((unit) => unit.kind === "pawn")
        ) {
          setTutorial(2);
        }
        return;
      }

      if (enemy) {
        units.forEach((unit) => {
          unit.attackTarget = enemy.id;
          unit.resourceTarget = undefined;
          unit.action = "move";
        });
        game.marker = { x: enemy.x, y: enemy.y, age: 0, kind: "attack" };
        if (
          tutorialRef.current === 4 &&
          units.some((unit) => unit.kind === "warrior")
        ) {
          setTutorial(5);
        }
        return;
      }

      units.forEach((unit, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        unit.targetX = point.x + (column - 1) * 34;
        unit.targetY = point.y + row * 30;
        unit.resourceTarget = undefined;
        unit.attackTarget = undefined;
        unit.carrying = undefined;
        unit.action = "move";
      });
      game.marker = { x: point.x, y: point.y, age: 0, kind: "move" };
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        setPaused(!pausedRef.current);
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);

    function update(dt: number) {
      const game = gameRef.current;
      game.time += dt;
      if (game.marker) {
        game.marker.age += dt;
        if (game.marker.age > 0.65) game.marker = undefined;
      }

      for (const unit of game.units) {
        if (unit.action === "dead") continue;
        unit.animTime += dt;
        unit.cooldown = Math.max(0, unit.cooldown - dt);

        if (unit.kind === "pawn") {
          if (unit.action === "move" && unit.resourceTarget) {
            const node = game.nodes.find(
              (resource) => resource.id === unit.resourceTarget,
            );
            if (!node || node.amount <= 0) {
              unit.action = "idle";
              unit.resourceTarget = undefined;
            } else if (moveToward(unit, node.x, node.y + 24, dt)) {
              unit.action = "gather";
              unit.gatherTime = 0;
            }
          } else if (unit.action === "gather" && unit.resourceTarget) {
            const node = game.nodes.find(
              (resource) => resource.id === unit.resourceTarget,
            );
            if (!node || node.amount <= 0) {
              unit.action = "idle";
              unit.resourceTarget = undefined;
            } else {
              unit.gatherTime += dt;
              if (unit.gatherTime >= 1.5) {
                node.amount = Math.max(0, node.amount - 10);
                unit.carrying = node.kind;
                unit.action = "return";
                unit.resourceTarget = undefined;
                unit.gatherTime = 0;
              }
            }
          } else if (unit.action === "return" && unit.carrying) {
            if (moveToward(unit, CASTLE.x + 100, CASTLE.y + 46, dt)) {
              game[unit.carrying] += 10;
              const delivered = unit.carrying;
              unit.carrying = undefined;
              if (tutorialRef.current === 2 && delivered === "wood")
                setTutorial(3);
              const home = game.nodes.find(
                (node) => node.id === unit.homeResource && node.amount > 0,
              );
              if (home) {
                unit.resourceTarget = home.id;
                unit.targetX = home.x;
                unit.targetY = home.y;
                unit.action = "move";
              } else {
                unit.action = "idle";
              }
            }
          } else if (unit.action === "move" && !unit.attackTarget) {
            if (moveToward(unit, unit.targetX, unit.targetY, dt))
              unit.action = "idle";
          }
        } else if (unit.kind === "warrior") {
          if (unit.attackTarget) {
            const target = game.units.find(
              (candidate) =>
                candidate.id === unit.attackTarget &&
                candidate.action !== "dead",
            );
            if (!target) {
              unit.attackTarget = undefined;
              unit.action = "idle";
            } else if (dist(unit.x, unit.y, target.x, target.y) > 62) {
              unit.action = "move";
              moveToward(unit, target.x, target.y, dt);
            } else {
              unit.action = "attack";
              unit.facing = target.x < unit.x ? -1 : 1;
              if (unit.cooldown <= 0) {
                target.hp -= 26;
                unit.cooldown = 0.8;
                if (target.hp <= 0) {
                  target.hp = 0;
                  target.action = "dead";
                  target.selected = false;
                  unit.attackTarget = undefined;
                  unit.action = "idle";
                }
              }
            }
          } else if (unit.action === "move") {
            if (moveToward(unit, unit.targetX, unit.targetY, dt))
              unit.action = "idle";
          }
        } else if (unit.kind === "goblin") {
          if (game.time < 9) {
            unit.action = "idle";
            continue;
          }
          const nearbyPlayer = game.units
            .filter(
              (candidate) =>
                candidate.kind !== "goblin" && candidate.action !== "dead",
            )
            .sort(
              (a, b) =>
                dist(unit.x, unit.y, a.x, a.y) -
                dist(unit.x, unit.y, b.x, b.y),
            )[0];
          const attacksPlayer =
            nearbyPlayer &&
            dist(unit.x, unit.y, nearbyPlayer.x, nearbyPlayer.y) < 150;
          const targetX = attacksPlayer ? nearbyPlayer.x : CASTLE.x + 70;
          const targetY = attacksPlayer ? nearbyPlayer.y : CASTLE.y + 30;
          const range = attacksPlayer ? 58 : 92;
          if (dist(unit.x, unit.y, targetX, targetY) > range) {
            unit.action = "move";
            moveToward(unit, targetX, targetY, dt);
          } else {
            unit.action = "attack";
            unit.facing = targetX < unit.x ? -1 : 1;
            if (unit.cooldown <= 0) {
              if (attacksPlayer) {
                nearbyPlayer.hp -= 12;
                if (nearbyPlayer.hp <= 0) {
                  nearbyPlayer.hp = 0;
                  nearbyPlayer.action = "dead";
                  nearbyPlayer.selected = false;
                  refreshSelection();
                }
              } else {
                game.castleHp = Math.max(0, game.castleHp - 14);
              }
              unit.cooldown = 1.05;
            }
          }
        }
      }

      hudClock += dt;
      if (hudClock > 0.15) {
        hudClock = 0;
        setHud({
          wood: game.wood,
          gold: game.gold,
          meat: game.meat,
          castleHp: game.castleHp,
          enemies: game.units.filter(
            (unit) => unit.kind === "goblin" && unit.action !== "dead",
          ).length,
        });
      }

      if (!ended && game.castleHp <= 0) {
        ended = true;
        window.setTimeout(() => onOutcome("defeat"), 450);
      }
      const livingEnemies = game.units.filter(
        (unit) => unit.kind === "goblin" && unit.action !== "dead",
      ).length;
      if (!ended && livingEnemies === 0) {
        ended = true;
        window.setTimeout(() => onOutcome("victory"), 650);
      }
    }

    function drawSprite(
      image: HTMLImageElement,
      frameW: number,
      frameH: number,
      frames: number,
      time: number,
      x: number,
      y: number,
      width: number,
      height: number,
      facing = 1,
      fps = 10,
    ) {
      const frame = Math.floor(time * fps) % frames;
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.scale(facing, 1);
      ctx!.drawImage(
        image,
        frame * frameW,
        0,
        frameW,
        frameH,
        -width / 2,
        -height * 0.78,
        width,
        height,
      );
      ctx!.restore();
    }

    function drawHealth(
      x: number,
      y: number,
      value: number,
      max: number,
      width: number,
      color: string,
    ) {
      ctx!.fillStyle = "rgba(16, 25, 25, .72)";
      ctx!.fillRect(x - width / 2 - 2, y - 2, width + 4, 9);
      ctx!.fillStyle = "rgba(245, 245, 220, .9)";
      ctx!.fillRect(x - width / 2, y, width, 5);
      ctx!.fillStyle = color;
      ctx!.fillRect(x - width / 2, y, width * Math.max(0, value / max), 5);
    }

    function draw() {
      const game = gameRef.current;
      ctx!.clearRect(0, 0, WORLD_W, WORLD_H);

      const grass = ctx!.createLinearGradient(0, 0, 0, WORLD_H);
      grass.addColorStop(0, "#79a85a");
      grass.addColorStop(1, "#4e7e47");
      ctx!.fillStyle = grass;
      ctx!.fillRect(0, 0, WORLD_W, WORLD_H);

      ctx!.fillStyle = "rgba(32, 84, 73, .18)";
      for (let y = 80; y < WORLD_H; y += 64) {
        for (let x = 32; x < WORLD_W; x += 64) {
          ctx!.fillRect(x + ((y / 64) % 2) * 18, y, 3, 12);
          ctx!.fillRect(x + 8, y + 18, 2, 7);
        }
      }

      ctx!.fillStyle = "#428a91";
      ctx!.fillRect(0, 0, WORLD_W, 80);
      ctx!.fillStyle = "rgba(206, 238, 216, .5)";
      for (let x = 0; x < WORLD_W; x += 70) {
        ctx!.beginPath();
        ctx!.arc(x + ((game.time * 18) % 70), 76, 30, 0, Math.PI);
        ctx!.fill();
      }

      ctx!.fillStyle = "rgba(41, 74, 44, .22)";
      ctx!.beginPath();
      ctx!.ellipse(CASTLE.x, CASTLE.y + 56, 128, 47, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.drawImage(
        images.castle,
        CASTLE.x - CASTLE.w / 2,
        CASTLE.y - CASTLE.h / 2 - 22,
        CASTLE.w,
        CASTLE.h,
      );
      drawHealth(
        CASTLE.x,
        CASTLE.y - 104,
        game.castleHp,
        CASTLE.maxHp,
        116,
        "#52bf68",
      );

      for (const node of game.nodes) {
        const depleted = node.amount <= 0;
        if (node.kind === "wood") {
          if (depleted) {
            ctx!.drawImage(images.stump, node.x - 33, node.y - 30, 66, 66);
          } else {
            drawSprite(
              images.tree,
              256,
              256,
              6,
              game.time + node.id * 0.11,
              node.x,
              node.y + 34,
              138,
              138,
              1,
              5,
            );
          }
        } else if (node.kind === "gold" && !depleted) {
          ctx!.drawImage(images.goldStone, node.x - 42, node.y - 42, 84, 84);
        } else if (node.kind === "meat" && !depleted) {
          drawSprite(
            images.sheep,
            128,
            128,
            6,
            game.time,
            node.x,
            node.y + 20,
            84,
            84,
            1,
            6,
          );
        }
        if (!depleted && node.amount < node.maxAmount) {
          drawHealth(
            node.x,
            node.y - (node.kind === "wood" ? 75 : 50),
            node.amount,
            node.maxAmount,
            54,
            "#d6b552",
          );
        }
      }

      const sortedUnits = [...game.units].sort((a, b) => a.y - b.y);
      for (const unit of sortedUnits) {
        if (unit.action === "dead") {
          ctx!.fillStyle =
            unit.kind === "goblin"
              ? "rgba(72, 45, 65, .42)"
              : "rgba(35, 51, 50, .34)";
          ctx!.beginPath();
          ctx!.ellipse(unit.x, unit.y + 10, 31, 13, 0, 0, Math.PI * 2);
          ctx!.fill();
          continue;
        }
        if (unit.selected) {
          ctx!.strokeStyle = "#ffe48c";
          ctx!.lineWidth = 4;
          ctx!.beginPath();
          ctx!.ellipse(unit.x, unit.y + 10, 35, 18, 0, 0, Math.PI * 2);
          ctx!.stroke();
        }

        if (unit.kind === "pawn") {
          let image = images.pawnIdle;
          let frames = 8;
          if (unit.action === "move" || unit.action === "return") {
            image =
              unit.carrying === "wood"
                ? images.pawnCarryWood
                : unit.carrying === "gold"
                  ? images.pawnCarryGold
                  : unit.carrying === "meat"
                    ? images.pawnCarryMeat
                    : images.pawnRun;
            frames = 6;
          } else if (unit.action === "gather") {
            const node = game.nodes.find(
              (resource) => resource.id === unit.resourceTarget,
            );
            image =
              node?.kind === "gold"
                ? images.pawnGatherGold
                : node?.kind === "meat"
                  ? images.pawnGatherMeat
                  : images.pawnGatherWood;
            frames = node?.kind === "meat" ? 4 : 6;
          }
          drawSprite(
            image,
            192,
            192,
            frames,
            unit.animTime,
            unit.x,
            unit.y + 14,
            92,
            92,
            unit.facing,
          );
        } else if (unit.kind === "warrior") {
          const image =
            unit.action === "attack"
              ? images.warriorAttack
              : unit.action === "move"
                ? images.warriorRun
                : images.warriorIdle;
          const frames =
            unit.action === "attack" ? 4 : unit.action === "move" ? 6 : 8;
          drawSprite(
            image,
            192,
            192,
            frames,
            unit.animTime,
            unit.x,
            unit.y + 13,
            96,
            96,
            unit.facing,
          );
        } else {
          const image =
            unit.action === "attack"
              ? images.goblinAttack
              : unit.action === "move"
                ? images.goblinRun
                : images.goblinIdle;
          const frames =
            unit.action === "attack" ? 7 : unit.action === "move" ? 6 : 8;
          drawSprite(
            image,
            256,
            256,
            frames,
            unit.animTime,
            unit.x,
            unit.y + 16,
            112,
            112,
            unit.facing,
          );
        }
        if (unit.hp < unit.maxHp || unit.selected || unit.kind === "goblin") {
          drawHealth(
            unit.x,
            unit.y - 48,
            unit.hp,
            unit.maxHp,
            unit.kind === "goblin" ? 48 : 54,
            unit.kind === "goblin" ? "#df655e" : "#54bd73",
          );
        }
      }

      if (game.marker) {
        const progress = game.marker.age / 0.65;
        const radius = 13 + progress * 16;
        ctx!.strokeStyle =
          game.marker.kind === "attack"
            ? `rgba(244, 90, 78, ${1 - progress})`
            : game.marker.kind === "gather"
              ? `rgba(255, 216, 103, ${1 - progress})`
              : `rgba(219, 244, 210, ${1 - progress})`;
        ctx!.lineWidth = 4;
        ctx!.beginPath();
        ctx!.arc(game.marker.x, game.marker.y, radius, 0, Math.PI * 2);
        ctx!.stroke();
      }

      if (dragRef.current.active) {
        const drag = dragRef.current;
        const left = Math.min(drag.startX, drag.x);
        const top = Math.min(drag.startY, drag.y);
        const width = Math.abs(drag.x - drag.startX);
        const height = Math.abs(drag.y - drag.startY);
        ctx!.fillStyle = "rgba(255, 228, 140, .14)";
        ctx!.strokeStyle = "rgba(255, 239, 185, .9)";
        ctx!.lineWidth = 2;
        ctx!.fillRect(left, top, width, height);
        ctx!.strokeRect(left, top, width, height);
      }
    }

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!pausedRef.current && !ended) update(dt);
      draw();
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    onOutcome,
    ready,
    setPaused,
    setTutorial,
    tooltipsEnabled,
  ]);

  const selectedLabel = useMemo(() => {
    if (!selectedKinds.length) return t("noSelection");
    const pawns = selectedKinds.filter((kind) => kind === "pawn").length;
    const warriors = selectedKinds.filter((kind) => kind === "warrior").length;
    return [
      pawns ? `${pawns} ${t("pawn")}` : "",
      warriors ? `${warriors} ${t("warrior")}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }, [selectedKinds, t]);

  const hoverText = hover
    ? {
        pawn: [t("pawn"), t("pawnTip")],
        warrior: [t("warrior"), t("warriorTip")],
        goblin: [t("goblin"), t("goblinTip")],
        tree: [t("tree"), t("treeTip")],
        goldStone: [t("goldStone"), t("goldStoneTip")],
        sheep: [t("sheep"), t("sheepTip")],
        castle: [t("castle"), t("castleTip")],
      }[hover.kind]
    : null;

  return (
    <main className="game-shell">
      <div className="hud-top">
        <div className="resource-cluster" aria-label="Resources">
          <ResourceStat icon="/game-assets/ui/wood.png" label={t("wood")} value={hud.wood} />
          <ResourceStat icon="/game-assets/ui/gold.png" label={t("gold")} value={hud.gold} />
          <ResourceStat icon="/game-assets/ui/meat.png" label={t("meat")} value={hud.meat} />
        </div>
        <div className="mission-status">
          <strong>{t("wave")}</strong>
          <span>
            {hud.enemies} {t("goblin")}
          </span>
        </div>
        <div className="game-actions">
          <button
            className="icon-button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? t("resume") : t("pause")}
            data-tip={paused ? t("resume") : `${t("pause")} [P]`}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
          <button className="icon-button" onClick={onExit} data-tip={t("menu")}>
            ☰
          </button>
        </div>
      </div>

      <section className="battlefield-frame" aria-label="tai'kingdom battlefield">
        {!ready && <div className="loading-layer">{t("loading")}</div>}
        <canvas
          ref={canvasRef}
          width={WORLD_W}
          height={WORLD_H}
          className="battlefield"
          aria-label={t("objectiveText")}
        />

        <div className="objective-card">
          <span className="eyebrow">{t("objective")}</span>
          <strong>{t("objectiveText")}</strong>
          <span className="castle-health">
            {t("castle")}: {Math.ceil((hud.castleHp / CASTLE.maxHp) * 100)}%
          </span>
        </div>

        {hintsEnabled && tutorialStep < 5 && (
          <div className="tutorial-card" role="status">
            <div>
              <span className="eyebrow">{t("tutorial")} {tutorialStep + 1}/5</span>
              <strong>{t(`tutorial${tutorialStep}`)}</strong>
            </div>
            <button className="text-button" onClick={() => setTutorial(5)}>
              {t("skip")}
            </button>
          </div>
        )}

        {hintsEnabled && tutorialStep === 5 && (
          <div className="quick-hints">
            <span>◉ {t("selectHint")}</span>
            <span>◆ {t("commandHint")}</span>
          </div>
        )}

        {hover && hoverText && (
          <div
            className="game-tooltip"
            style={{
              left: Math.min(hover.x + 16, 870),
              top: Math.max(18, hover.y - 24),
            }}
          >
            <strong>{hoverText[0]}</strong>
            <span>{hoverText[1]}</span>
            {typeof hover.hp === "number" && (
              <small>
                HP {Math.ceil(hover.hp)}/{hover.maxHp}
              </small>
            )}
            {typeof hover.amount === "number" && (
              <small>
                {t("gather")}: {hover.amount}
              </small>
            )}
          </div>
        )}

        {paused && (
          <div className="pause-layer">
            <div className="modal-panel compact-panel">
              <span className="eyebrow">tai&apos;kingdom</span>
              <h2>{t("paused")}</h2>
              <button className="primary-button" onClick={() => setPaused(false)}>
                {t("resume")}
              </button>
              <button className="secondary-button" onClick={onExit}>
                {t("menu")}
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="command-bar">
        <div className="selected-summary">
          <span className="eyebrow">{t("selected")}</span>
          <strong>{selectedLabel}</strong>
        </div>
        <div className="command-guide">
          <span data-tip={t("selectHint")}>◉ {t("selected")}</span>
          <span data-tip={t("commandHint")}>◆ {t("move")}</span>
          <span data-tip={t("treeTip")}>♜ {t("gather")}</span>
          <span data-tip={t("warriorTip")}>⚔ {t("attack")}</span>
        </div>
      </div>
    </main>
  );
}

function ResourceStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="resource-stat" data-tip={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" aria-hidden="true" />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function LanguageSwitch({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="language-switch" aria-label={TEXT[locale].language}>
      <button
        className={locale === "vi" ? "active" : ""}
        onClick={() => onChange("vi")}
        aria-pressed={locale === "vi"}
      >
        VI
      </button>
      <span>/</span>
      <button
        className={locale === "en" ? "active" : ""}
        onClick={() => onChange("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}

export default function GameApp() {
  const [locale, setLocale] = useStoredLocale();
  const [screen, setScreen] = useState<Screen>("menu");
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [uiScale, setUiScale] = useState(100);
  const [session, setSession] = useState(0);

  const currentLocale = locale ?? "vi";
  const t = useCallback(
    (key: string) => TEXT[currentLocale][key] ?? key,
    [currentLocale],
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--game-ui-scale",
      `${uiScale / 100}`,
    );
  }, [uiScale]);

  const startGame = () => {
    setSession((value) => value + 1);
    setScreen("game");
  };

  if (locale === null) {
    return (
      <main className="language-screen">
        <div className="ambient-scene" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="scene-castle" src="/game-assets/world/castle.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="scene-warrior"
            src="/game-assets/player/warrior-idle.png"
            alt=""
          />
        </div>
        <div className="modal-panel language-panel">
          <div className="brand-mark">TK</div>
          <h1>tai&apos;kingdom</h1>
          <p>Choose your language · Chọn ngôn ngữ</p>
          <div className="language-options">
            <button className="primary-button" onClick={() => setLocale("vi")}>
              Tiếng Việt
            </button>
            <button className="secondary-button" onClick={() => setLocale("en")}>
              English
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "game") {
    return (
      <GameScene
        key={session}
        locale={locale}
        hintsEnabled={hintsEnabled}
        tooltipsEnabled={tooltipsEnabled}
        onExit={() => setScreen("menu")}
        onOutcome={setScreen}
      />
    );
  }

  if (screen === "victory" || screen === "defeat") {
    const won = screen === "victory";
    return (
      <main className={`result-screen ${won ? "is-victory" : "is-defeat"}`}>
        <div className="ambient-scene" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="scene-castle" src="/game-assets/world/castle.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="scene-warrior"
            src="/game-assets/player/warrior-idle.png"
            alt=""
          />
        </div>
        <div className="modal-panel result-panel">
          <span className="eyebrow">The Green Frontier</span>
          <h1>{t(won ? "victory" : "defeat")}</h1>
          <p>{t(won ? "victoryText" : "defeatText")}</p>
          <button className="primary-button" onClick={startGame}>
            {t("restart")}
          </button>
          <button className="secondary-button" onClick={() => setScreen("menu")}>
            {t("menu")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="menu-screen">
      <div className="ambient-scene" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="scene-castle" src="/game-assets/world/castle.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="scene-warrior"
          src="/game-assets/player/warrior-idle.png"
          alt=""
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="scene-sheep" src="/game-assets/world/sheep-idle.png" alt="" />
      </div>

      <header className="menu-header">
        <span className="alpha-label">{t("alpha")}</span>
        <LanguageSwitch locale={locale} onChange={setLocale} />
      </header>

      {screen === "menu" && (
        <section className="menu-layout">
          <div className="brand-block">
            <div className="brand-mark">TK</div>
            <h1>tai&apos;kingdom</h1>
            <p>{t("subtitle")}</p>
          </div>

          <div className="main-menu">
            <button
              className="menu-button disabled-button"
              disabled
              data-tip={t("unavailable")}
            >
              <span>↻</span>
              {t("continue")}
            </button>
            <button className="menu-button primary-menu-button" onClick={startGame}>
              <span>⚔</span>
              {t("newGame")}
            </button>
            <button className="menu-button" onClick={() => setScreen("how")}>
              <span>?</span>
              {t("howToPlay")}
            </button>
            <button className="menu-button" onClick={() => setScreen("settings")}>
              <span>⚙</span>
              {t("settings")}
            </button>
          </div>

          <aside className="mission-preview">
            <span className="eyebrow">{t("firstMission")}</span>
            <h2>{t("campaign")}</h2>
            <p>{t("campaignDesc")}</p>
            <div className="mission-tags">
              <span>RTS</span>
              <span>Canvas</span>
              <span>Top-down</span>
            </div>
            <button className="primary-button" onClick={startGame}>
              {t("start")} →
            </button>
          </aside>
        </section>
      )}

      {screen === "how" && (
        <section className="content-panel">
          <span className="eyebrow">tai&apos;kingdom</span>
          <h1>{t("howTitle")}</h1>
          <div className="how-grid">
            {[
              ["01", "howSelect", "howSelectDesc"],
              ["02", "howCommand", "howCommandDesc"],
              ["03", "howEconomy", "howEconomyDesc"],
              ["04", "howDefend", "howDefendDesc"],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h2>{t(title)}</h2>
                <p>{t(description)}</p>
              </article>
            ))}
          </div>
          <button className="secondary-button" onClick={() => setScreen("menu")}>
            ← {t("back")}
          </button>
        </section>
      )}

      {screen === "settings" && (
        <section className="content-panel settings-panel">
          <span className="eyebrow">tai&apos;kingdom</span>
          <h1>{t("settings")}</h1>
          <div className="setting-row">
            <div>
              <strong>{t("language")}</strong>
              <span>Tiếng Việt / English</span>
            </div>
            <LanguageSwitch locale={locale} onChange={setLocale} />
          </div>
          <SettingToggle
            label={t("hints")}
            enabled={hintsEnabled}
            onChange={setHintsEnabled}
            onText={t("on")}
            offText={t("off")}
          />
          <SettingToggle
            label={t("tooltips")}
            enabled={tooltipsEnabled}
            onChange={setTooltipsEnabled}
            onText={t("on")}
            offText={t("off")}
          />
          <SettingToggle
            label={t("audio")}
            enabled={audioEnabled}
            onChange={setAudioEnabled}
            onText={t("on")}
            offText={t("off")}
          />
          <label className="setting-row range-setting">
            <div>
              <strong>{t("uiScale")}</strong>
              <span>{uiScale}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="115"
              value={uiScale}
              onChange={(event) => setUiScale(Number(event.target.value))}
            />
          </label>
          <button className="secondary-button" onClick={() => setScreen("menu")}>
            ← {t("back")}
          </button>
        </section>
      )}
    </main>
  );
}

function SettingToggle({
  label,
  enabled,
  onChange,
  onText,
  offText,
}: {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  onText: string;
  offText: string;
}) {
  return (
    <div className="setting-row">
      <strong>{label}</strong>
      <button
        className={`toggle-button ${enabled ? "enabled" : ""}`}
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
      >
        <span />
        {enabled ? onText : offText}
      </button>
    </div>
  );
}
