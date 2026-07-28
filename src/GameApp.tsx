"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadGameImages, type ImageBank } from "./game/assets";
import {
  BUILD_COST,
  BUILDING_SPEC,
  MAP_COUNT,
  UNIT_COST,
  VIEW_H,
  VIEW_W,
  WORLD_H,
  beginBuild,
  cancelBuild,
  clampCamera,
  createCamera,
  createInitialGame,
  devAddResources,
  devAdjustPopulationCap,
  devClearEnemies,
  devClearPlayerArmy,
  devHealAll,
  devMaxResources,
  devNextWave,
  devSpawnEnemy,
  devSpawnPlayer,
  devSetPhase,
  devSetResources,
  devWinMap,
  getHoverTarget,
  issueCommand,
  placeBuilding,
  population,
  renderGame,
  renderMinimap,
  renderMenuWorld,
  restoreGame,
  selectArea,
  selectPoint,
  serializeGame,
  setAutoFarm,
  setBuildHover,
  setDevGodMode,
  trainUnit,
  updateGame,
  worldWidthForState,
  type Building,
  type BuildingKind,
  type Camera,
  type EnemyKind,
  type GameMode,
  type GameState,
  type HoverTarget,
  type PlayerUnitKind,
  type ResourceKind,
  type UnitKind,
} from "./game/engine";
import {
  translator,
  type CopyKey,
  type Locale,
} from "./game/i18n";

type Screen =
  | "language"
  | "menu"
  | "resetConfirm"
  | "modes"
  | "maps"
  | "how"
  | "settings"
  | "game"
  | "victory"
  | "defeat";

interface Settings {
  tooltips: boolean;
  tutorial: boolean;
  largeUi: boolean;
  devMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  tooltips: true,
  tutorial: true,
  largeUi: true,
  devMode: false,
};

const SAVE_KEY = "tai-kingdom-campaign-v6";
const LOCALE_KEY = "tai-kingdom-locale";
const SETTINGS_KEY = "tai-kingdom-settings-v4";
const MAP_UNLOCK_KEY = "tai-kingdom-unlocked-map-v2";
const CAMPAIGN_STARTED_KEY = "tai-kingdom-campaign-started-v1";

function PaperButton({
  children,
  tone = "blue",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "blue" | "red" | "plain";
}) {
  return (
    <button
      className={`pixel-button pixel-button-${tone} ${className}`}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}

function RibbonTitle({
  children,
  size = "large",
}: {
  children: React.ReactNode;
  size?: "large" | "small";
}) {
  return (
    <div className={`ribbon-title ribbon-title-${size}`}>
      <span>{children}</span>
    </div>
  );
}

function SpritePreview({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      className={`sprite-preview ${className}`}
      style={{ backgroundImage: `url("${src}")` }}
      aria-hidden="true"
    />
  );
}

function MenuWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    let frame = 0;
    const started = performance.now();

    loadGameImages().then((images) => {
      if (!active) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const paint = (now: number) => {
        if (!active) return;
        renderMenuWorld(ctx, images, (now - started) / 1000);
        frame = requestAnimationFrame(paint);
      };
      frame = requestAnimationFrame(paint);
    });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="menu-world-canvas"
      width={VIEW_W}
      height={VIEW_H}
      aria-hidden="true"
    />
  );
}

function LanguageScreen({
  onChoose,
}: {
  onChoose: (locale: Locale) => void;
}) {
  return (
    <main className="storybook-screen language-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel language-panel" aria-labelledby="language-title">
        <RibbonTitle>tai&apos;kingdom</RibbonTitle>
        <h1 id="language-title">Choose your language</h1>
        <p>Chọn ngôn ngữ để bắt đầu hành trình.</p>
        <div className="language-grid">
          <PaperButton onClick={() => onChoose("vi")}>
            <strong>VI</strong>
            <span>Tiếng Việt</span>
          </PaperButton>
          <PaperButton onClick={() => onChoose("en")}>
            <strong>EN</strong>
            <span>English</span>
          </PaperButton>
        </div>
        <small>Language can be changed later in Settings.</small>
      </section>
    </main>
  );
}

function MenuScreen({
  locale,
  hasSave,
  onNavigate,
  onNewGame,
  onContinue,
  onLocale,
}: {
  locale: Locale;
  hasSave: boolean;
  onNavigate: (screen: Screen) => void;
  onNewGame: () => void;
  onContinue: () => void;
  onLocale: (locale: Locale) => void;
}) {
  const t = translator(locale);
  return (
    <main className="storybook-screen menu-screen">
      <MenuWorld />
      <div className="screen-vignette" />

      <header className="menu-topbar">
        <span className="chapter-badge">TAI&apos;KINGDOM · REALTIME STRATEGY</span>
        <div className="language-tabs" aria-label={t("chooseLanguage")}>
          <button
            className={locale === "vi" ? "active" : ""}
            onClick={() => onLocale("vi")}
          >
            VI
          </button>
          <span>/</span>
          <button
            className={locale === "en" ? "active" : ""}
            onClick={() => onLocale("en")}
          >
            EN
          </button>
        </div>
      </header>

      <div className="menu-composition">
        <section className="title-lockup">
          <div className="shield-mark">TK</div>
          <RibbonTitle>tai&apos;kingdom</RibbonTitle>
          <p>{t("gameTagline")}</p>
        </section>

        <section className="wood-panel main-menu-panel" aria-label="Main menu">
          <span className="panel-kicker">{t("missionLabel")}</span>
          <h2>{t("missionName")}</h2>
          <div className="menu-actions">
            <PaperButton tone="red" onClick={onNewGame}>
              <span className="button-glyph">⚔</span>
              {t("newGame")}
            </PaperButton>
            <PaperButton
              onClick={onContinue}
              disabled={!hasSave}
              data-tip={hasSave ? t("saveNote") : t("saveNote")}
            >
              <span className="button-glyph">▶</span>
              {t("continue")}
            </PaperButton>
            <PaperButton tone="plain" onClick={() => onNavigate("how")}>
              <span className="button-glyph">?</span>
              {t("howToPlay")}
            </PaperButton>
            <PaperButton tone="plain" onClick={() => onNavigate("settings")}>
              <span className="button-glyph">⚙</span>
              {t("settings")}
            </PaperButton>
          </div>
        </section>

        <aside className="paper-panel mission-card">
          <span className="panel-kicker">{t("missionLabel")}</span>
          <h2>{t("missionName")}</h2>
          <p>{t("missionDesc")}</p>
          <div className="mission-summary">
            <span>
              <img src="/game-assets/ui/wood.png" alt="" /> 4 {t("wave")}
            </span>
            <span>
              <SpritePreview src="/game-assets/units/warrior-idle.png" /> 5{" "}
              {t("units")}
            </span>
            <span>
              <SpritePreview src="/game-assets/enemies/cave.png" /> Root Den
            </span>
          </div>
          <PaperButton tone="red" onClick={onNewGame}>
            {t("startMission")}
          </PaperButton>
        </aside>
      </div>
    </main>
  );
}

function ModeScreen({
  locale,
  onChoose,
  onBack,
}: {
  locale: Locale;
  onChoose: (mode: GameMode) => void;
  onBack: () => void;
}) {
  const t = translator(locale);
  return (
    <main className="storybook-screen modal-screen mode-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel mode-panel">
        <RibbonTitle>{t("chooseMode")}</RibbonTitle>
        <p className="book-intro">{t("chooseModeIntro")}</p>
        <div className="mode-grid">
          <button className="mode-card stage-card" onClick={() => onChoose("stage")}>
            <span className="mode-art">
              <img src="/game-assets/buildings/castle.png" alt="" />
              <SpritePreview src="/game-assets/enemies/troll-idle.png" />
            </span>
            <span className="mode-copy">
              <small>{t("recommended")}</small>
              <strong>{t("stageMode")}</strong>
              <em>{t("stageModeDesc")}</em>
              <b>{t("stageModeGoal")}</b>
            </span>
          </button>
          <button className="mode-card endless-card" onClick={() => onChoose("endless")}>
            <span className="mode-art">
              <img src="/game-assets/buildings/tower.png" alt="" />
              <SpritePreview src="/game-assets/units/pawn-idle.png" />
            </span>
            <span className="mode-copy">
              <small>{t("survival")}</small>
              <strong>{t("endlessMode")}</strong>
              <em>{t("endlessModeDesc")}</em>
              <b>{t("endlessModeGoal")}</b>
            </span>
          </button>
        </div>
        <div className="panel-footer">
          <PaperButton onClick={onBack}>{t("back")}</PaperButton>
        </div>
      </section>
    </main>
  );
}

function ResetProgressScreen({
  locale,
  onConfirm,
  onCancel,
}: {
  locale: Locale;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = translator(locale);
  return (
    <main className="storybook-screen modal-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section
        className="paper-panel result-panel"
        role="alertdialog"
        aria-labelledby="reset-progress-title"
        aria-describedby="reset-progress-description"
      >
        <RibbonTitle>{t("resetProgressTitle")}</RibbonTitle>
        <h2 id="reset-progress-title">{t("resetProgressQuestion")}</h2>
        <p id="reset-progress-description">{t("resetProgressDescription")}</p>
        <PaperButton tone="red" onClick={onConfirm}>
          {t("resetProgressConfirm")}
        </PaperButton>
        <PaperButton onClick={onCancel}>{t("keepProgress")}</PaperButton>
      </section>
    </main>
  );
}

const MAP_CARDS = [
  { id: 1, name: "map1Name", desc: "map1Desc", tone: "spring" },
  { id: 2, name: "map2Name", desc: "map2Desc", tone: "river" },
  { id: 3, name: "map3Name", desc: "map3Desc", tone: "autumn" },
  { id: 4, name: "map4Name", desc: "map4Desc", tone: "coast" },
] as const;

function MapPreview({ level }: { level: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const state = createInitialGame(false, "stage", level);
    renderMinimap(ctx, state, { x: 0, y: 0, zoom: 0.72 });
  }, [level]);

  return <canvas ref={canvasRef} width={288} height={176} aria-hidden="true" />;
}

function MapScreen({
  locale,
  mode,
  unlockedMap,
  devMode,
  onChoose,
  onBack,
}: {
  locale: Locale;
  mode: GameMode;
  unlockedMap: number;
  devMode: boolean;
  onChoose: (level: number) => void;
  onBack: () => void;
}) {
  const t = translator(locale);
  return (
    <main className="storybook-screen modal-screen map-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel map-panel">
        <RibbonTitle>{t("chooseMap")}</RibbonTitle>
        <p className="book-intro">{t("chooseMapIntro")}</p>
        <div className="map-grid">
          {MAP_CARDS.map((map) => {
            const locked = mode === "stage" && map.id > unlockedMap && !devMode;
            return (
              <button
                key={map.id}
                className={`map-card map-${map.tone} ${locked ? "locked" : ""}`}
                disabled={locked}
                onClick={() => onChoose(map.id)}
              >
                <span className="map-preview">
                  <MapPreview level={map.id} />
                  <b>{locked ? "🔒" : `0${map.id}`}</b>
                </span>
                <span className="map-card-copy">
                  <small>
                    {mode === "stage" ? `${t("level")} ${map.id}` : t("endlessMode")}
                  </small>
                  <strong>{t(map.name)}</strong>
                  <em>{t(map.desc)}</em>
                  <i>{locked ? t("mapLocked") : t("twoBossPhases")}</i>
                </span>
              </button>
            );
          })}
        </div>
        <div className="panel-footer">
          <PaperButton onClick={onBack}>{t("back")}</PaperButton>
        </div>
      </section>
    </main>
  );
}

function HowScreen({
  locale,
  onBack,
}: {
  locale: Locale;
  onBack: () => void;
}) {
  const t = translator(locale);
  const cards = [
    {
      title: t("howSelectTitle"),
      text: t("howSelectText"),
      image: "/game-assets/units/pawn-idle.png",
      sprite: true,
    },
    {
      title: t("howSmartTitle"),
      text: t("howSmartText"),
      image: "/game-assets/ui/cursor.png",
      sprite: false,
    },
    {
      title: t("howEconomyTitle"),
      text: t("howEconomyText"),
      image: "/game-assets/resources/tree2.png",
      sprite: false,
    },
    {
      title: t("howWorldTitle"),
      text: t("howWorldText"),
      image: "/game-assets/terrain/bridge-all.png",
      sprite: false,
    },
    {
      title: t("howArmyTitle"),
      text: t("howArmyText"),
      image: "/game-assets/buildings/barracks.png",
      sprite: false,
    },
    {
      title: t("howWinTitle"),
      text: t("howWinText"),
      image: "/game-assets/enemies/cave.png",
      sprite: true,
    },
  ];

  return (
    <main className="storybook-screen modal-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel book-panel">
        <RibbonTitle>{t("howTitle")}</RibbonTitle>
        <p className="book-intro">{t("howIntro")}</p>
        <div className="lesson-grid">
          {cards.map((card) => (
            <article key={card.title}>
              <div className="lesson-art">
                {card.sprite ? (
                  <SpritePreview src={card.image} />
                ) : (
                  <img src={card.image} alt="" />
                )}
              </div>
              <div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="panel-footer">
          <PaperButton onClick={onBack}>{t("back")}</PaperButton>
        </div>
      </section>
    </main>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  t,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: () => void;
  t: ReturnType<typeof translator>;
}) {
  return (
    <div className="setting-row">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <button
        className={`toggle-switch ${value ? "enabled" : ""}`}
        onClick={onChange}
        aria-pressed={value}
      >
        <i />
        {value ? t("on") : t("off")}
      </button>
    </div>
  );
}

function SettingsScreen({
  locale,
  settings,
  onSettings,
  onLocale,
  onBack,
}: {
  locale: Locale;
  settings: Settings;
  onSettings: (settings: Settings) => void;
  onLocale: (locale: Locale) => void;
  onBack: () => void;
}) {
  const t = translator(locale);
  const flip = (key: keyof Settings) =>
    onSettings({ ...settings, [key]: !settings[key] });

  return (
    <main className="storybook-screen modal-screen">
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel settings-book">
        <RibbonTitle>{t("settings")}</RibbonTitle>
        <div className="setting-row language-setting">
          <span>{t("chooseLanguage")}</span>
          <div className="language-tabs paper-tabs">
            <button
              className={locale === "vi" ? "active" : ""}
              onClick={() => onLocale("vi")}
            >
              VI
            </button>
            <button
              className={locale === "en" ? "active" : ""}
              onClick={() => onLocale("en")}
            >
              EN
            </button>
          </div>
        </div>
        <ToggleRow
          label={t("tooltips")}
          description={t("tooltipsDesc")}
          value={settings.tooltips}
          onChange={() => flip("tooltips")}
          t={t}
        />
        <ToggleRow
          label={t("tutorialHints")}
          description={t("tutorialHintsDesc")}
          value={settings.tutorial}
          onChange={() => flip("tutorial")}
          t={t}
        />
        <ToggleRow
          label={`${t("uiScale")}: ${settings.largeUi ? t("large") : t("normal")}`}
          description={t("uiScaleDesc")}
          value={settings.largeUi}
          onChange={() => flip("largeUi")}
          t={t}
        />
        <ToggleRow
          label={t("devMode")}
          description={t("devModeDesc")}
          value={settings.devMode}
          onChange={() => flip("devMode")}
          t={t}
        />
        <div className="panel-footer">
          <PaperButton onClick={onBack}>{t("back")}</PaperButton>
        </div>
      </section>
    </main>
  );
}

interface HudSnapshot {
  mode: GameMode;
  level: number;
  elapsed: number;
  resources: Record<ResourceKind, number>;
  population: number;
  populationCap: number;
  wave: number;
  totalWaves: number;
  waveClock: number;
  waveActive: boolean;
  enemies: number;
  bossAlive: boolean;
  nestsAlive: number;
  nestsCleared: number;
  endlessTier: number;
  endlessExpansionClock: number;
  castleHp: number;
  castleMaxHp: number;
  selectedUnits: UnitKind[];
  selectedBuilding?: Building;
  tutorialStep: number;
  tutorialEnabled: boolean;
  autoFarm: boolean;
  buildMode?: "house" | "tower";
  notice: GameState["notice"];
  outcome: GameState["outcome"];
}

function makeSnapshot(state: GameState): HudSnapshot {
  const castle = state.buildings.find((building) => building.kind === "castle");
  return {
    mode: state.mode,
    level: state.level,
    elapsed: state.time,
    resources: { ...state.resources },
    population: population(state),
    populationCap: state.populationCap,
    wave: state.wave,
    totalWaves: state.totalWaves,
    waveClock: state.waveClock,
    waveActive: state.waveActive,
    enemies: state.units.filter((unit) => unit.team === "enemy").length,
    bossAlive: state.units.some((unit) => unit.team === "enemy" && unit.boss),
    nestsAlive: state.buildings.filter(
      (building) => building.team === "enemy" && building.hp > 0,
    ).length,
    nestsCleared: state.nestsCleared,
    endlessTier: state.endlessTier,
    endlessExpansionClock: state.endlessExpansionClock,
    castleHp: Math.ceil(castle?.hp ?? 0),
    castleMaxHp: castle?.maxHp ?? 1500,
    selectedUnits: state.units
      .filter((unit) => state.selectedUnitIds.includes(unit.id))
      .map((unit) => unit.kind),
    selectedBuilding: state.buildings.find(
      (building) => building.id === state.selectedBuildingId,
    ),
    tutorialStep: state.tutorialStep,
    tutorialEnabled: state.tutorialEnabled,
    autoFarm: state.autoFarm,
    buildMode: state.buildMode,
    notice: state.notice,
    outcome: state.outcome,
  };
}

function worldPoint(
  canvas: HTMLCanvasElement,
  camera: Camera,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: camera.x + (((clientX - rect.left) / rect.width) * VIEW_W) / camera.zoom,
    y: camera.y + (((clientY - rect.top) / rect.height) * VIEW_H) / camera.zoom,
    screenX: clientX - rect.left,
    screenY: clientY - rect.top,
  };
}

function applyCameraZoom(camera: Camera, state: GameState, nextZoom: number) {
  const centerX = camera.x + VIEW_W / camera.zoom / 2;
  const centerY = camera.y + VIEW_H / camera.zoom / 2;
  camera.zoom = Math.max(0.25, Math.min(1.5, nextZoom));
  camera.x = centerX - VIEW_W / camera.zoom / 2;
  camera.y = centerY - VIEW_H / camera.zoom / 2;
  clampCamera(camera, state);
}

function nameKey(kind: UnitKind | BuildingKind | ResourceKind): CopyKey {
  if (kind === "goblinHouse") return "house";
  if (kind === "goblinTower") return "tower";
  return kind as CopyKey;
}

function descriptionKey(kind: UnitKind | BuildingKind | ResourceKind): CopyKey | null {
  const map: Partial<Record<UnitKind | BuildingKind | ResourceKind, CopyKey>> = {
    pawn: "gatherer",
    warrior: "melee",
    lancer: "defender",
    archer: "ranged",
    monk: "healer",
    castle: "castleDesc",
    house: "houseDesc",
    tower: "towerDesc",
    barracks: "barracksDesc",
    archery: "archeryDesc",
    monastery: "monasteryDesc",
    goblinHouse: "houseDesc",
    goblinTower: "towerDesc",
    rootTree: "rootTreeDesc",
  };
  return map[kind] ?? null;
}

function ResourceHud({
  kind,
  value,
  label,
}: {
  kind: ResourceKind;
  value: number;
  label: string;
}) {
  return (
    <div className="resource-hud" data-tip={label}>
      <img src={`/game-assets/ui/${kind}.png`} alt="" />
      <span>
        <small>{label}</small>
        <strong>{Math.floor(value)}</strong>
      </span>
    </div>
  );
}

function CostLine({
  cost,
}: {
  cost: { wood: number; gold: number; meat: number };
}) {
  return (
    <span className="cost-line">
      {(["wood", "gold", "meat"] as ResourceKind[])
        .filter((kind) => cost[kind] > 0)
        .map((kind) => (
          <i key={kind}>
            <img src={`/game-assets/ui/${kind}.png`} alt="" />
            {cost[kind]}
          </i>
        ))}
    </span>
  );
}

function CommandButton({
  image,
  title,
  description,
  cost,
  onClick,
  disabled,
  sprite = false,
}: {
  image: string;
  title: string;
  description: string;
  cost?: { wood: number; gold: number; meat: number };
  onClick: () => void;
  disabled?: boolean;
  sprite?: boolean;
}) {
  return (
    <button
      className="command-button"
      onClick={onClick}
      disabled={disabled}
      data-tip={`${title} — ${description}`}
    >
      <span className="command-art">
        {sprite ? <SpritePreview src={image} /> : <img src={image} alt="" />}
      </span>
      <span className="command-copy">
        <strong>{title}</strong>
        {cost && <CostLine cost={cost} />}
      </span>
    </button>
  );
}

function CommandDeck({
  state,
  t,
  onTrain,
  onBuild,
  onAutoFarm,
}: {
  state: HudSnapshot;
  t: ReturnType<typeof translator>;
  onTrain: (kind: PlayerUnitKind) => void;
  onBuild: (kind: "house" | "tower") => void;
  onAutoFarm: () => void;
}) {
  const building = state.selectedBuilding;
  const pawnSelected = state.selectedUnits.includes("pawn");

  const training: PlayerUnitKind[] =
    building?.kind === "castle"
      ? ["pawn"]
      : building?.kind === "barracks"
        ? ["warrior", "lancer"]
        : building?.kind === "archery"
          ? ["archer"]
          : building?.kind === "monastery"
            ? ["monk"]
            : [];

  const unitImages: Record<PlayerUnitKind, string> = {
    pawn: "/game-assets/units/pawn-idle.png",
    warrior: "/game-assets/units/warrior-idle.png",
    lancer: "/game-assets/units/lancer-idle.png",
    archer: "/game-assets/units/archer-idle.png",
    monk: "/game-assets/units/monk-idle.png",
  };
  const descriptions: Record<PlayerUnitKind, CopyKey> = {
    pawn: "gatherer",
    warrior: "melee",
    lancer: "defender",
    archer: "ranged",
    monk: "healer",
  };
  const buildingImages: Record<BuildingKind, string> = {
    castle: "/game-assets/buildings/castle.png",
    house: "/game-assets/buildings/house1.png",
    barracks: "/game-assets/buildings/barracks.png",
    archery: "/game-assets/buildings/archery.png",
    monastery: "/game-assets/buildings/monastery.png",
    tower: "/game-assets/buildings/tower.png",
    cave: "/game-assets/enemies/cave.png",
    goblinHouse: "/game-assets/enemies/goblin-house.png",
    goblinTower: "/game-assets/enemies/goblin-tower.png",
    rootTree: "/game-assets/decor/dead-tree.png",
  };

  if (building) {
    return (
      <>
        <div className="selection-card">
          <span className="selection-portrait">
            {building.kind === "cave" ? (
              <SpritePreview src={buildingImages[building.kind]} />
            ) : (
              <img src={buildingImages[building.kind]} alt="" />
            )}
          </span>
          <span>
            <small>{t("selected")}</small>
            <strong>{t(nameKey(building.kind))}</strong>
            <em>
              {Math.ceil(building.hp)} / {building.maxHp} {t("health")}
            </em>
          </span>
        </div>
        <div className="commands-group">
          {building.queue ? (
            <div className="training-readout">
              <strong>
                {t("queued")}: {t(building.queue.kind)} ×2
              </strong>
              <div>
                <i
                  style={{
                    width: `${Math.max(
                      0,
                      100 - (building.queue.remaining / building.queue.total) * 100,
                    )}%`,
                  }}
                />
              </div>
              <small>
                {Math.ceil(building.queue.remaining)} {t("seconds")}
              </small>
            </div>
          ) : training.length ? (
            training.map((kind) => (
              <CommandButton
                key={kind}
                image={unitImages[kind]}
                title={`${t(kind)} ×2`}
                description={t(descriptions[kind])}
                cost={UNIT_COST[kind]}
                onClick={() => onTrain(kind)}
                sprite
              />
            ))
          ) : (
            <p className="command-description">
              {descriptionKey(building.kind)
                ? t(descriptionKey(building.kind)!)
                : t("selectPrompt")}
            </p>
          )}
        </div>
      </>
    );
  }

  if (state.selectedUnits.length) {
    const unique = Array.from(new Set(state.selectedUnits));
    return (
      <>
        <div className="selection-card">
          <span className="selection-portrait multi-portrait">
            {unique.slice(0, 2).map((kind) => (
              <SpritePreview
                key={kind}
                src={`/game-assets/units/${kind}-idle.png`}
              />
            ))}
          </span>
          <span>
            <small>{t("selected")}</small>
            <strong>
              {state.selectedUnits.length} {t("units")}
            </strong>
            <em>{unique.map((kind) => t(nameKey(kind))).join(" · ")}</em>
          </span>
        </div>
        <div className="commands-group">
          {pawnSelected ? (
            <>
              <CommandButton
                image="/game-assets/buildings/house1.png"
                title={t("house")}
                description={t("houseDesc")}
                cost={BUILD_COST.house}
                onClick={() => onBuild("house")}
              />
              <CommandButton
                image="/game-assets/buildings/tower.png"
                title={t("tower")}
                description={t("towerDesc")}
                cost={BUILD_COST.tower}
                onClick={() => onBuild("tower")}
              />
              <CommandButton
                image="/game-assets/resources/tree2.png"
                title={`${t("autoFarm")} · ${state.autoFarm ? t("on") : t("off")}`}
                description={t("autoFarmDesc")}
                onClick={onAutoFarm}
                sprite
              />
            </>
          ) : (
            <p className="command-description">
              {t("commandControl")}
              <br />
              {unique
                .map((kind) => descriptionKey(kind))
                .filter(Boolean)
                .map((key) => t(key!))
                .join(" ")}
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="empty-command">
      <img src="/game-assets/ui/cursor.png" alt="" />
      <span>
        <strong>{t("command")}</strong>
        <small>{t("selectPrompt")}</small>
      </span>
    </div>
  );
}

function DevPanel({
  t,
  hud,
  godMode,
  onGodMode,
  onAddResources,
  onMaxResources,
  onSetResources,
  onPopulation,
  onHeal,
  onSpawnPlayer,
  onSpawnEnemy,
  onClearPlayerArmy,
  onClearEnemies,
  onSetPhase,
  onNextWave,
  onWin,
  onClose,
}: {
  t: ReturnType<typeof translator>;
  hud: HudSnapshot;
  godMode: boolean;
  onGodMode: () => void;
  onAddResources: () => void;
  onMaxResources: () => void;
  onSetResources: (resources: Record<ResourceKind, number>) => void;
  onPopulation: (amount: number) => void;
  onHeal: () => void;
  onSpawnPlayer: (kind: PlayerUnitKind, count: number) => void;
  onSpawnEnemy: (kind: EnemyKind, count: number) => void;
  onClearPlayerArmy: () => void;
  onClearEnemies: () => void;
  onSetPhase: (phase: number) => void;
  onNextWave: () => void;
  onWin: () => void;
  onClose: () => void;
}) {
  const [spawnCount, setSpawnCount] = useState(3);
  const [phase, setPhase] = useState(Math.max(1, hud.wave || 1));
  const [resourceValues, setResourceValues] = useState({
    wood: hud.resources.wood,
    gold: hud.resources.gold,
    meat: hud.resources.meat,
  });
  const setResourceValue = (kind: ResourceKind, value: number) => {
    setResourceValues((current) => ({
      ...current,
      [kind]: Math.max(0, Math.min(99999, value || 0)),
    }));
  };

  return (
    <aside className="dev-panel paper-panel" aria-label={t("devPanel")}>
      <header>
        <span>
          <b>DEV</b>
          <strong>{t("devPanel")}</strong>
        </span>
        <button onClick={onClose} aria-label={t("close")}>×</button>
      </header>
      <div className="dev-status">
        <span className="dev-live-dot" />
        {t("devModeActive")}
      </div>
      <div className="dev-readout">
        <span>{t("wave")}: <b>{hud.wave}/{hud.mode === "stage" ? hud.totalWaves : "∞"}</b></span>
        <span>{t("region")}: <b>{hud.mode === "endless" ? `${hud.endlessTier}/${MAP_COUNT}` : hud.level}</b></span>
        <span>{t("population")}: <b>{hud.population}/{hud.populationCap}</b></span>
        <span>{t("enemiesLeft")}: <b>{hud.enemies}</b></span>
      </div>

      <section className="dev-section">
        <strong>{t("devQuick")}</strong>
        <div className="dev-grid">
          <button className={godMode ? "active" : ""} onClick={onGodMode}>
            {t("godMode")} · {godMode ? t("on") : t("off")}
          </button>
          <button onClick={onHeal}>{t("healAll")}</button>
          <button onClick={onAddResources}>+500 {t("allResources")}</button>
          <button onClick={onMaxResources}>9999 {t("allResources")}</button>
          <button onClick={() => onPopulation(5)}>+5 {t("population")}</button>
          <button onClick={() => onPopulation(-5)}>−5 {t("population")}</button>
        </div>
      </section>

      <section className="dev-section">
        <strong>{t("devResources")}</strong>
        <div className="dev-number-grid">
          {(["wood", "gold", "meat"] as const).map((kind) => (
            <label key={kind}>
              <span>{t(kind)}</span>
              <input
                type="number"
                min={0}
                max={99999}
                value={resourceValues[kind]}
                onChange={(event) => setResourceValue(kind, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
        <button className="dev-apply" onClick={() => onSetResources(resourceValues)}>
          {t("apply")}
        </button>
      </section>

      <section className="dev-section">
        <div className="dev-section-heading">
          <strong>{t("devArmy")}</strong>
          <label>
            {t("spawnCount")}
            <input
              type="number"
              min={1}
              max={30}
              value={spawnCount}
              onChange={(event) =>
                setSpawnCount(Math.max(1, Math.min(30, Number(event.target.value) || 1)))
              }
            />
          </label>
        </div>
        <small>{t("friendly")}</small>
        <div className="dev-unit-grid">
          {(["pawn", "warrior", "lancer", "archer", "monk"] as const).map((kind) => (
            <button key={kind} onClick={() => onSpawnPlayer(kind, spawnCount)}>
              +{spawnCount} {t(kind)}
            </button>
          ))}
        </div>
        <div className="dev-grid">
          <button className="danger" onClick={onClearPlayerArmy}>
            {t("clearPlayerArmy")}
          </button>
        </div>
        <small>{t("enemy")}</small>
        <div className="dev-unit-grid">
          {(["goblin", "gnoll", "minotaur", "troll"] as const).map((kind) => (
            <button key={kind} onClick={() => onSpawnEnemy(kind, spawnCount)}>
              +{spawnCount} {t(kind)}
            </button>
          ))}
        </div>
      </section>

      <section className="dev-section">
        <strong>{t("devScenario")}</strong>
        <div className="dev-phase-row">
          <label>
            {t("setPhase")}
            <input
              type="number"
              min={1}
              max={hud.mode === "stage" ? hud.totalWaves : 99}
              value={phase}
              onChange={(event) => setPhase(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          <button onClick={() => onSetPhase(phase)}>{t("apply")}</button>
        </div>
        <div className="dev-grid">
          <button onClick={onNextWave}>{t("nextWaveDev")}</button>
          <button onClick={onClearEnemies}>{t("clearEnemies")}</button>
          <button className="danger" onClick={onWin}>{t("winMapDev")}</button>
        </div>
      </section>
      <small>{t("devHint")}</small>
    </aside>
  );
}

function GameScene({
  locale,
  settings,
  resumeSaved,
  mode,
  level,
  onExit,
  onOutcome,
  onSaveAvailable,
}: {
  locale: Locale;
  settings: Settings;
  resumeSaved: boolean;
  mode: GameMode;
  level: number;
  onExit: () => void;
  onOutcome: (outcome: "victory" | "defeat") => void;
  onSaveAvailable: () => void;
}) {
  const t = translator(locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(
    resumeSaved
      ? restoreGame(
          typeof window === "undefined" ? null : localStorage.getItem(SAVE_KEY),
          settings.tutorial,
        ) ?? createInitialGame(settings.tutorial, mode, level)
      : createInitialGame(settings.tutorial, mode, level),
  );
  const imagesRef = useRef<ImageBank | null>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>(createCamera(stateRef.current));
  const pausedRef = useRef(false);
  const speedRef = useRef<1 | 2 | 3 | 4>(1);
  const keysRef = useRef(new Set<string>());
  const pointerRef = useRef({ x: VIEW_W / 2, y: VIEW_H / 2, inside: false });
  const outcomeSent = useRef(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    additive: false,
  });
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 3 | 4>(1);
  const [zoom, setZoom] = useState(1);
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [devGodMode, setDevGodModeState] = useState(false);
  const [minimapCollapsed, setMinimapCollapsed] = useState(false);
  const [hover, setHover] = useState<{
    target: HoverTarget;
    x: number;
    y: number;
  } | null>(null);
  const [hud, setHud] = useState(() => makeSnapshot(stateRef.current));

  const refreshHud = useCallback(() => {
    setHud(makeSnapshot(stateRef.current));
  }, []);

  useEffect(() => {
    if (!settings.devMode) {
      setDevPanelOpen(false);
      setDevGodModeState(false);
      setDevGodMode(stateRef.current, false);
    }
  }, [settings.devMode]);

  useEffect(() => {
    let active = true;
    loadGameImages()
      .then((images) => {
        if (!active) return;
        imagesRef.current = images;
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !imagesRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let active = true;
    let frame = 0;
    let last = performance.now();
    let hudClock = 0;
    let saveClock = 0;

    const loop = (now: number) => {
      if (!active) return;
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const keys = keysRef.current;
      const pointer = pointerRef.current;
      let panX = 0;
      let panY = 0;
      if (keys.has("KeyA") || keys.has("ArrowLeft") || (pointer.inside && pointer.x < 24)) panX -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight") || (pointer.inside && pointer.x > VIEW_W - 24)) panX += 1;
      if (keys.has("KeyW") || keys.has("ArrowUp") || (pointer.inside && pointer.y < 24)) panY -= 1;
      if (keys.has("KeyS") || keys.has("ArrowDown") || (pointer.inside && pointer.y > VIEW_H - 24)) panY += 1;
      if (panX || panY) {
        const length = Math.hypot(panX, panY);
        cameraRef.current.x += (panX / length) * 760 * dt;
        cameraRef.current.y += (panY / length) * 760 * dt;
        clampCamera(cameraRef.current, stateRef.current);
        if (stateRef.current.tutorialStep === 6) {
          stateRef.current.tutorialStep = 7;
        }
      }
      if (!pausedRef.current) {
        for (let tick = 0; tick < speedRef.current; tick += 1) {
          updateGame(stateRef.current, dt);
        }
      }
      clampCamera(cameraRef.current, stateRef.current);
      renderGame(
        ctx,
        imagesRef.current!,
        stateRef.current,
        cameraRef.current,
        dragRef.current,
      );
      const minimapCtx = minimapRef.current?.getContext("2d");
      if (minimapCtx) renderMinimap(minimapCtx, stateRef.current, cameraRef.current);

      hudClock += dt;
      saveClock += dt;
      if (hudClock > 0.12) {
        hudClock = 0;
        refreshHud();
      }
      if (saveClock > 5 && stateRef.current.outcome === "playing") {
        saveClock = 0;
        localStorage.setItem(SAVE_KEY, serializeGame(stateRef.current));
        onSaveAvailable();
      }
      if (
        stateRef.current.outcome !== "playing" &&
        !outcomeSent.current
      ) {
        outcomeSent.current = true;
        localStorage.removeItem(SAVE_KEY);
        onOutcome(stateRef.current.outcome);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [onOutcome, onSaveAvailable, ready, refreshHud]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || pausedRef.current) return;
      const point = worldPoint(canvas, cameraRef.current, event.clientX, event.clientY);
      if (stateRef.current.buildMode) {
        placeBuilding(stateRef.current, point.x, point.y);
        refreshHud();
        return;
      }
      dragRef.current = {
        active: true,
        startX: point.x,
        startY: point.y,
        x: point.x,
        y: point.y,
        additive: event.shiftKey,
      };
      canvas.setPointerCapture(event.pointerId);
    };

    const pointerMove = (event: PointerEvent) => {
      const point = worldPoint(canvas, cameraRef.current, event.clientX, event.clientY);
      pointerRef.current = {
        x: ((event.clientX - canvas.getBoundingClientRect().left) /
          canvas.getBoundingClientRect().width) * VIEW_W,
        y: ((event.clientY - canvas.getBoundingClientRect().top) /
          canvas.getBoundingClientRect().height) * VIEW_H,
        inside: true,
      };
      if (dragRef.current.active) {
        dragRef.current.x = point.x;
        dragRef.current.y = point.y;
      }
      if (stateRef.current.buildMode) {
        setBuildHover(stateRef.current, point.x, point.y);
      }
      if (settings.tooltips && !dragRef.current.active) {
        const target = getHoverTarget(stateRef.current, point.x, point.y);
        setHover(target ? { target, x: point.screenX, y: point.screenY } : null);
      } else {
        setHover(null);
      }
    };

    const pointerUp = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const point = worldPoint(canvas, cameraRef.current, event.clientX, event.clientY);
      const drag = dragRef.current;
      const moved = Math.hypot(point.x - drag.startX, point.y - drag.startY);
      if (moved > 12) {
        selectArea(
          stateRef.current,
          drag.startX,
          drag.startY,
          point.x,
          point.y,
          drag.additive,
        );
      } else {
        selectPoint(
          stateRef.current,
          point.x,
          point.y,
          drag.additive,
        );
      }
      dragRef.current.active = false;
      refreshHud();
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const contextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (pausedRef.current) return;
      const point = worldPoint(canvas, cameraRef.current, event.clientX, event.clientY);
      issueCommand(stateRef.current, point.x, point.y);
      refreshHud();
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const step = event.deltaY < 0 ? 0.1 : -0.1;
      applyCameraZoom(
        cameraRef.current,
        stateRef.current,
        cameraRef.current.zoom + step,
      );
      setZoom(cameraRef.current.zoom);
    };

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("contextmenu", contextMenu);
    canvas.addEventListener("wheel", wheel, { passive: false });
    const pointerLeave = () => {
      pointerRef.current.inside = false;
    };
    const viewportPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * VIEW_W,
        y: (event.clientY / window.innerHeight) * VIEW_H,
        inside: true,
      };
    };
    const viewportPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) pointerRef.current.inside = false;
    };
    canvas.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("pointermove", viewportPointerMove);
    window.addEventListener("pointerout", viewportPointerOut);
    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("contextmenu", contextMenu);
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("pointermove", viewportPointerMove);
      window.removeEventListener("pointerout", viewportPointerOut);
    };
  }, [refreshHud, settings.tooltips]);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (
        ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.code,
        )
      ) {
        keysRef.current.add(event.code);
        event.preventDefault();
      }
      if (event.code === "Digit1") {
        stateRef.current.selectedBuildingId = undefined;
        stateRef.current.selectedUnitIds = stateRef.current.units
          .filter((unit) => unit.team === "player" && unit.kind === "pawn")
          .map((unit) => unit.id);
        if (stateRef.current.tutorialStep === 0) {
          stateRef.current.tutorialStep = 1;
        }
        refreshHud();
      }
      if (event.code === "Digit2") {
        stateRef.current.selectedBuildingId = undefined;
        stateRef.current.selectedUnitIds = stateRef.current.units
          .filter((unit) => unit.team === "player" && unit.kind !== "pawn")
          .map((unit) => unit.id);
        refreshHud();
      }
      if (event.code === "KeyC") {
        const castle = stateRef.current.buildings.find(
          (building) => building.kind === "castle" && building.hp > 0,
        );
        stateRef.current.selectedUnitIds = [];
        stateRef.current.selectedBuildingId = castle?.id;
        refreshHud();
      }
      if (event.code === "Space") {
        event.preventDefault();
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
      }
      if (event.code === "Escape") {
        if (stateRef.current.buildMode) {
          cancelBuild(stateRef.current);
          refreshHud();
        } else {
          pausedRef.current = !pausedRef.current;
          setPaused(pausedRef.current);
        }
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [refreshHud]);

  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };
  const handleTrain = (kind: PlayerUnitKind) => {
    trainUnit(stateRef.current, kind);
    refreshHud();
  };
  const handleBuild = (kind: "house" | "tower") => {
    beginBuild(stateRef.current, kind);
    refreshHud();
  };
  const handleAutoFarm = () => {
    setAutoFarm(stateRef.current, !stateRef.current.autoFarm);
    refreshHud();
  };
  const handleSpeed = (next: 1 | 2 | 3 | 4) => {
    speedRef.current = next;
    setSpeed(next);
  };
  const panCamera = (dx: number, dy: number) => {
    cameraRef.current.x += dx / cameraRef.current.zoom;
    cameraRef.current.y += dy / cameraRef.current.zoom;
    clampCamera(cameraRef.current, stateRef.current);
  };
  const handleZoom = (direction: -1 | 1) => {
    const next = Number((cameraRef.current.zoom + direction * 0.1).toFixed(2));
    applyCameraZoom(cameraRef.current, stateRef.current, next);
    setZoom(cameraRef.current.zoom);
  };
  const toggleGodMode = () => {
    const next = !devGodMode;
    setDevGodModeState(next);
    setDevGodMode(stateRef.current, next);
    refreshHud();
  };
  const runDevAction = (action: (state: GameState) => void) => {
    action(stateRef.current);
    refreshHud();
  };
  const skipTutorial = () => {
    stateRef.current.tutorialStep = 7;
    stateRef.current.tutorialEnabled = false;
    refreshHud();
  };

  const waveLabel =
    hud.mode === "endless"
      ? `${t("wave")} ${Math.max(1, hud.wave)} · ${Math.floor(hud.elapsed / 60)
          .toString()
          .padStart(2, "0")}:${Math.floor(hud.elapsed % 60)
          .toString()
          .padStart(2, "0")}`
      : hud.wave >= hud.totalWaves
        ? t("finalWave")
      : hud.waveActive
        ? `${t("wave")} ${hud.wave}/${hud.totalWaves}`
        : `${t("preparing")} · ${Math.max(0, Math.ceil(hud.waveClock))}s`;

  return (
    <main
      className={`game-screen ${settings.largeUi ? "large-ui" : ""} ${
        settings.tooltips ? "" : "tooltips-disabled"
      }`}
    >
      <header className="game-top-hud">
        <div className="resource-strip hud-cluster wood-panel">
          <ResourceHud kind="wood" value={hud.resources.wood} label={t("wood")} />
          <ResourceHud kind="gold" value={hud.resources.gold} label={t("gold")} />
          <ResourceHud kind="meat" value={hud.resources.meat} label={t("meat")} />
          <div className="resource-hud population-hud" data-tip={t("population")}>
            <SpritePreview src="/game-assets/units/pawn-idle.png" />
            <span>
              <small>{t("population")}</small>
              <strong>
                {hud.population}/{hud.populationCap}
              </strong>
            </span>
          </div>
        </div>

        <div className="wave-status hud-cluster wood-panel">
          <small>
            {hud.mode === "stage"
              ? `${t(`map${hud.level}Name` as CopyKey)} · ${t("stageMode")}`
              : `${t("endlessMode")} · ${t("region")} ${hud.endlessTier}/${MAP_COUNT}`}
          </small>
          <strong>{waveLabel}</strong>
          <span>
            {hud.bossAlive ? `${t("boss")} · ` : ""}
            {t("enemiesLeft")}: {hud.enemies}
          </span>
        </div>

        <div className="hud-actions hud-cluster wood-panel">
          <div className="zoom-controls" aria-label={t("zoomMap")}>
            <button
              onClick={() => handleZoom(-1)}
              data-tip={t("zoomOut")}
              aria-label={t("zoomOut")}
            >
              −
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => handleZoom(1)}
              data-tip={t("zoomIn")}
              aria-label={t("zoomIn")}
            >
              +
            </button>
          </div>
          <div className="speed-controls" aria-label={t("gameSpeed")}>
            {([1, 2, 3, 4] as const).map((value) => (
              <button
                key={value}
                className={speed === value ? "active" : ""}
                onClick={() => handleSpeed(value)}
                data-tip={`${t("gameSpeed")} ${value}x`}
              >
                {value}x
              </button>
            ))}
          </div>
          <button onClick={handlePause} data-tip={t("pause")} aria-label={t("pause")}>
            {paused ? "▶" : "Ⅱ"}
          </button>
          {settings.devMode && (
            <button
              className="dev-toggle"
              onClick={() => setDevPanelOpen((open) => !open)}
              data-tip={t("devPanel")}
            >
              DEV
            </button>
          )}
        </div>
      </header>

      <section className="battlefield-shell">
        <canvas
          ref={canvasRef}
          className="battlefield"
          width={VIEW_W}
          height={VIEW_H}
          aria-label="The Verdant Reach realtime strategy battlefield"
        />

        <nav className="camera-controls" aria-label={t("moveCamera")}>
          <button className="camera-up" onClick={() => panCamera(0, -280)}>▲</button>
          <button className="camera-right" onClick={() => panCamera(360, 0)}>▶</button>
          <button className="camera-down" onClick={() => panCamera(0, 280)}>▼</button>
          <button className="camera-left" onClick={() => panCamera(-360, 0)}>◀</button>
        </nav>

        <div
          className={`minimap-frame paper-chip ${minimapCollapsed ? "collapsed" : ""}`}
        >
          <button
            className="minimap-toggle"
            onClick={() => setMinimapCollapsed((collapsed) => !collapsed)}
            aria-label={t(minimapCollapsed ? "showMap" : "hideMap")}
            data-tip={t(minimapCollapsed ? "showMap" : "hideMap")}
          >
            {minimapCollapsed ? "M" : "−"}
          </button>
          {!minimapCollapsed && (
            <>
              <canvas
                ref={minimapRef}
                width={240}
                height={160}
                aria-label={t("worldMap")}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  cameraRef.current.x =
                    ((event.clientX - rect.left) / rect.width) *
                      worldWidthForState(stateRef.current) -
                    VIEW_W / cameraRef.current.zoom / 2;
                  cameraRef.current.y =
                    ((event.clientY - rect.top) / rect.height) * WORLD_H -
                    VIEW_H / cameraRef.current.zoom / 2;
                  clampCamera(cameraRef.current, stateRef.current);
                }}
              />
              <span>{t("worldMap")} · {t("clickToMoveCamera")}</span>
            </>
          )}
        </div>

        <div className="castle-vitals paper-chip">
          <img src="/game-assets/buildings/castle.png" alt="" />
          <span>
            <small>Castle</small>
            <i>
              <b
                style={{
                  width: `${Math.max(
                    0,
                    (hud.castleHp / hud.castleMaxHp) * 100,
                  )}%`,
                }}
              />
            </i>
            <strong>
              {hud.castleHp}/{hud.castleMaxHp}
            </strong>
          </span>
        </div>

        <div className="objective-scroll paper-chip">
          <strong>{t("objective")}</strong>
          <span>
            {hud.mode === "stage" ? t("stageObjective") : t("endlessObjective")}
            {" · "}
            {t("nests")}: {hud.nestsAlive}
            {hud.mode === "endless" && hud.endlessExpansionClock > 0
              ? ` · ${t("expandingFrontier")} ${Math.ceil(hud.endlessExpansionClock)}s`
              : ""}
          </span>
        </div>

        {hud.tutorialEnabled && hud.tutorialStep <= 7 && (
          <div className="tutorial-scroll paper-panel">
            <span className="tutorial-number">
              {hud.tutorialStep < 7 ? hud.tutorialStep + 1 : "✓"}
            </span>
            <div>
              <small>{t("firstSteps")}</small>
              <strong>
                {t(
                  (hud.tutorialStep < 7
                    ? `tutorial${hud.tutorialStep}`
                    : "tutorialDone") as CopyKey,
                )}
              </strong>
              {hud.tutorialStep < 7 && (
                <button onClick={skipTutorial}>{t("skipTutorial")}</button>
              )}
            </div>
          </div>
        )}

        {hud.buildMode && (
          <div className="build-mode-ribbon">
            <strong>
              {t("build")}: {t(hud.buildMode)}
            </strong>
            <span>{t("buildMode")}</span>
            <button
              onClick={() => {
                cancelBuild(stateRef.current);
                refreshHud();
              }}
            >
              {t("cancel")} · Esc
            </button>
          </div>
        )}

        {hover && (
          <div
            className="world-tooltip paper-panel"
            style={{
              left: Math.min(hover.x + 18, 980),
              top: Math.max(16, hover.y - 24),
            }}
          >
            <strong>{t(nameKey(hover.target.kind))}</strong>
            {descriptionKey(hover.target.kind) && (
              <span>{t(descriptionKey(hover.target.kind)!)}</span>
            )}
            {hover.target.hp !== undefined && (
              <small>
                {t("health")}: {hover.target.hp}/{hover.target.maxHp}
              </small>
            )}
            {hover.target.amount !== undefined && (
              <small>
                {hover.target.amount > 0
                  ? `${t("resourceRemaining")}: ${hover.target.amount}`
                  : `${t("respawnIn")}: ${Math.ceil(hover.target.respawnClock ?? 0)}s`}
              </small>
            )}
          </div>
        )}

        {hud.notice && (
          <div className="game-notice">{t(hud.notice as CopyKey)}</div>
        )}

        {settings.devMode && devPanelOpen && (
          <DevPanel
            t={t}
            hud={hud}
            godMode={devGodMode}
            onGodMode={toggleGodMode}
            onAddResources={() => runDevAction((state) => devAddResources(state, 500))}
            onMaxResources={() => runDevAction(devMaxResources)}
            onSetResources={(resources) =>
              runDevAction((state) => devSetResources(state, resources))
            }
            onPopulation={(amount) =>
              runDevAction((state) => devAdjustPopulationCap(state, amount))
            }
            onHeal={() => runDevAction(devHealAll)}
            onSpawnPlayer={(kind, count) =>
              runDevAction((state) => devSpawnPlayer(state, kind, count))
            }
            onSpawnEnemy={(kind, count) =>
              runDevAction((state) => devSpawnEnemy(state, kind, count))
            }
            onClearPlayerArmy={() => runDevAction(devClearPlayerArmy)}
            onClearEnemies={() => runDevAction(devClearEnemies)}
            onSetPhase={(phase) =>
              runDevAction((state) => devSetPhase(state, phase))
            }
            onNextWave={() => runDevAction(devNextWave)}
            onWin={() => runDevAction(devWinMap)}
            onClose={() => setDevPanelOpen(false)}
          />
        )}

        {!ready && <div className="loading-cover">{t("loading")}</div>}

        {paused && (
          <div className="pause-cover">
            <section className="paper-panel pause-panel">
              <RibbonTitle size="small">{t("paused")}</RibbonTitle>
              <PaperButton
                tone="red"
                onClick={() => {
                  pausedRef.current = false;
                  setPaused(false);
                }}
              >
                {t("resume")}
              </PaperButton>
              <PaperButton
                onClick={() => {
                  stateRef.current = createInitialGame(settings.tutorial, mode, level);
                  cameraRef.current = createCamera(stateRef.current);
                  setZoom(1);
                  setDevGodModeState(false);
                  setDevPanelOpen(false);
                  outcomeSent.current = false;
                  pausedRef.current = false;
                  setPaused(false);
                  refreshHud();
                }}
              >
                {t("restart")}
              </PaperButton>
              <PaperButton tone="plain" onClick={onExit}>
                {t("mainMenu")}
              </PaperButton>
            </section>
          </div>
        )}
      </section>

      <footer
        className={`command-deck wood-panel ${
          hud.selectedUnits.length || hud.selectedBuilding ? "has-selection" : "is-empty"
        }`}
      >
        <CommandDeck
          state={hud}
          t={t}
          onTrain={handleTrain}
          onBuild={handleBuild}
          onAutoFarm={handleAutoFarm}
        />
        <div className="control-hints">
          <span>
            <i className="mouse-icon left-click" /> {t("selectControl")}
          </span>
          <span>
            <i className="mouse-icon right-click" /> {t("commandControl")}
          </span>
          <span>Space · {t("pause")}</span>
          <span>1 · Pawn &nbsp; 2 · Army &nbsp; C · Castle</span>
          <span>WASD / Arrows · {t("moveCamera")}</span>
        </div>
      </footer>
    </main>
  );
}

function ResultScreen({
  locale,
  outcome,
  mode,
  level,
  onRestart,
  onNext,
  onMenu,
}: {
  locale: Locale;
  outcome: "victory" | "defeat";
  mode: GameMode;
  level: number;
  onRestart: () => void;
  onNext: () => void;
  onMenu: () => void;
}) {
  const t = translator(locale);
  return (
    <main className={`storybook-screen result-screen ${outcome}`}>
      <MenuWorld />
      <div className="screen-vignette" />
      <section className="paper-panel result-panel">
        <SpritePreview
          className="result-hero"
          src={
            outcome === "victory"
              ? "/game-assets/units/warrior-idle.png"
              : "/game-assets/enemies/minotaur-idle.png"
          }
        />
        <RibbonTitle>
          {outcome === "victory" ? t("victory") : t("defeat")}
        </RibbonTitle>
        <p>{outcome === "victory" ? t("victoryText") : t("defeatText")}</p>
        {outcome === "victory" && mode === "stage" && level < MAP_COUNT && (
          <PaperButton tone="red" onClick={onNext}>
            {t("nextStage")} · {t("level")} {level + 1}
          </PaperButton>
        )}
        <PaperButton tone="red" onClick={onRestart}>
          {t("restart")}
        </PaperButton>
        <PaperButton onClick={onMenu}>{t("mainMenu")}</PaperButton>
      </section>
    </main>
  );
}

export default function GameApp() {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [screen, setScreen] = useState<Screen>("language");
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasSave, setHasSave] = useState(false);
  const [resumeSaved, setResumeSaved] = useState(false);
  const [activeMode, setActiveMode] = useState<GameMode>("stage");
  const [activeLevel, setActiveLevel] = useState(1);
  const [unlockedMap, setUnlockedMap] = useState(1);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const storedLocale = localStorage.getItem(LOCALE_KEY);
    if (storedLocale === "vi" || storedLocale === "en") {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
      setScreen("menu");
    }
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      } catch {
        setSettingsState(DEFAULT_SETTINGS);
      }
    }
    setHasSave(Boolean(localStorage.getItem(SAVE_KEY)));
    const storedUnlocked = Number(localStorage.getItem(MAP_UNLOCK_KEY));
    if (Number.isFinite(storedUnlocked)) {
      setUnlockedMap(Math.max(1, Math.min(MAP_COUNT, storedUnlocked)));
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_KEY, next);
    document.documentElement.lang = next;
    setLocaleState(next);
    setScreen("menu");
  }, []);

  const setSettings = useCallback((next: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    setSettingsState(next);
  }, []);

  const resetCampaign = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(MAP_UNLOCK_KEY);
    setHasSave(false);
    setResumeSaved(false);
    setUnlockedMap(1);
    setActiveMode("stage");
    setActiveLevel(1);
    setRunId((id) => id + 1);
    setScreen("modes");
  }, []);

  const newGame = useCallback(() => {
    const hasStarted = localStorage.getItem(CAMPAIGN_STARTED_KEY) === "1";
    if (hasSave || unlockedMap > 1 || hasStarted) {
      setScreen("resetConfirm");
      return;
    }
    resetCampaign();
  }, [hasSave, resetCampaign, unlockedMap]);

  const continueGame = useCallback(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as Pick<GameState, "mode" | "level">;
      if (saved.mode === "stage" || saved.mode === "endless") {
        setActiveMode(saved.mode);
      }
      if (Number.isFinite(saved.level)) {
        setActiveLevel(Math.max(1, Math.min(MAP_COUNT, saved.level)));
      }
    } catch {
      return;
    }
    setResumeSaved(true);
    setRunId((id) => id + 1);
    setScreen("game");
  }, []);

  const chooseMode = useCallback((mode: GameMode) => {
    setActiveMode(mode);
    if (mode === "endless") {
      localStorage.setItem(CAMPAIGN_STARTED_KEY, "1");
      localStorage.removeItem(SAVE_KEY);
      setHasSave(false);
      setResumeSaved(false);
      setActiveLevel(1);
      setRunId((id) => id + 1);
      setScreen("game");
      return;
    }
    setScreen("maps");
  }, []);

  const startMap = useCallback((level: number) => {
    localStorage.setItem(CAMPAIGN_STARTED_KEY, "1");
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
    setResumeSaved(false);
    setActiveLevel(Math.max(1, Math.min(MAP_COUNT, level)));
    setRunId((id) => id + 1);
    setScreen("game");
  }, []);

  if (!locale || screen === "language") {
    return <LanguageScreen onChoose={setLocale} />;
  }

  if (screen === "how") {
    return <HowScreen locale={locale} onBack={() => setScreen("menu")} />;
  }
  if (screen === "resetConfirm") {
    return (
      <ResetProgressScreen
        locale={locale}
        onConfirm={resetCampaign}
        onCancel={() => setScreen("menu")}
      />
    );
  }
  if (screen === "modes") {
    return (
      <ModeScreen
        locale={locale}
        onChoose={chooseMode}
        onBack={() => setScreen("menu")}
      />
    );
  }
  if (screen === "maps") {
    return (
      <MapScreen
        locale={locale}
        mode={activeMode}
        unlockedMap={unlockedMap}
        devMode={settings.devMode}
        onChoose={startMap}
        onBack={() => setScreen("modes")}
      />
    );
  }
  if (screen === "settings") {
    return (
      <SettingsScreen
        locale={locale}
        settings={settings}
        onSettings={setSettings}
        onLocale={setLocale}
        onBack={() => setScreen("menu")}
      />
    );
  }
  if (screen === "game") {
    return (
      <GameScene
        key={runId}
        locale={locale}
        settings={settings}
        resumeSaved={resumeSaved}
        mode={activeMode}
        level={activeLevel}
        onExit={() => {
          setHasSave(Boolean(localStorage.getItem(SAVE_KEY)));
          setScreen("menu");
        }}
        onOutcome={(outcome) => {
          setHasSave(false);
          if (
            outcome === "victory" &&
            activeMode === "stage" &&
            !settings.devMode
          ) {
            const nextUnlocked = Math.min(MAP_COUNT, activeLevel + 1);
            setUnlockedMap((current) => {
              const next = Math.max(current, nextUnlocked);
              localStorage.setItem(MAP_UNLOCK_KEY, String(next));
              return next;
            });
          }
          setScreen(outcome);
        }}
        onSaveAvailable={() => setHasSave(true)}
      />
    );
  }
  if (screen === "victory" || screen === "defeat") {
    return (
      <ResultScreen
        locale={locale}
        outcome={screen}
        mode={activeMode}
        level={activeLevel}
        onRestart={() => startMap(activeLevel)}
        onNext={() => {
          localStorage.removeItem(SAVE_KEY);
          setResumeSaved(false);
          setScreen("maps");
        }}
        onMenu={() => setScreen("menu")}
      />
    );
  }

  return (
    <MenuScreen
      locale={locale}
      hasSave={hasSave}
      onNavigate={setScreen}
      onNewGame={newGame}
      onContinue={continueGame}
      onLocale={setLocale}
    />
  );
}
