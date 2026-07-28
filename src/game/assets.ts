export const ASSET_PATHS = {
  water: "/game-assets/terrain/water.png",
  grassSpring: "/game-assets/terrain/grass-spring.png",
  grassDeep: "/game-assets/terrain/grass-deep.png",
  grassAutumn: "/game-assets/terrain/grass-autumn.png",
  foam: "/game-assets/terrain/foam.png",
  shadow: "/game-assets/terrain/shadow.png",
  rock1: "/game-assets/decor/rock1.png",
  rock2: "/game-assets/decor/rock2.png",
  rock3: "/game-assets/decor/rock3.png",
  rock4: "/game-assets/decor/rock4.png",
  waterRock1: "/game-assets/decor/water-rock1.png",
  waterRock2: "/game-assets/decor/water-rock2.png",
  bush1: "/game-assets/decor/bush1.png",
  bush2: "/game-assets/decor/bush2.png",
  cloud1: "/game-assets/decor/cloud1.png",
  cloud2: "/game-assets/decor/cloud2.png",
  cloud3: "/game-assets/decor/cloud3.png",
  tree1: "/game-assets/resources/tree1.png",
  tree2: "/game-assets/resources/tree2.png",
  tree3: "/game-assets/resources/tree3.png",
  tree4: "/game-assets/resources/tree4.png",
  stump1: "/game-assets/resources/stump1.png",
  gold1: "/game-assets/resources/gold1.png",
  gold2: "/game-assets/resources/gold2.png",
  gold3: "/game-assets/resources/gold3.png",
  sheepIdle: "/game-assets/resources/sheep-idle.png",
  sheepMove: "/game-assets/resources/sheep-move.png",
  castle: "/game-assets/buildings/castle.png",
  house1: "/game-assets/buildings/house1.png",
  house2: "/game-assets/buildings/house2.png",
  house3: "/game-assets/buildings/house3.png",
  barracks: "/game-assets/buildings/barracks.png",
  archery: "/game-assets/buildings/archery.png",
  monastery: "/game-assets/buildings/monastery.png",
  tower: "/game-assets/buildings/tower.png",
  pawnIdle: "/game-assets/units/pawn-idle.png",
  pawnRun: "/game-assets/units/pawn-run.png",
  pawnAxe: "/game-assets/units/pawn-axe.png",
  pawnPickaxe: "/game-assets/units/pawn-pickaxe.png",
  pawnKnife: "/game-assets/units/pawn-knife.png",
  pawnWood: "/game-assets/units/pawn-wood.png",
  pawnGold: "/game-assets/units/pawn-gold.png",
  pawnMeat: "/game-assets/units/pawn-meat.png",
  warriorIdle: "/game-assets/units/warrior-idle.png",
  warriorRun: "/game-assets/units/warrior-run.png",
  warriorAttack: "/game-assets/units/warrior-attack.png",
  lancerIdle: "/game-assets/units/lancer-idle.png",
  lancerRun: "/game-assets/units/lancer-run.png",
  lancerAttack: "/game-assets/units/lancer-attack.png",
  lancerGuard: "/game-assets/units/lancer-guard.png",
  archerIdle: "/game-assets/units/archer-idle.png",
  archerRun: "/game-assets/units/archer-run.png",
  archerAttack: "/game-assets/units/archer-attack.png",
  arrow: "/game-assets/units/arrow.png",
  monkIdle: "/game-assets/units/monk-idle.png",
  monkRun: "/game-assets/units/monk-run.png",
  monkHeal: "/game-assets/units/monk-heal.png",
  monkEffect: "/game-assets/units/monk-effect.png",
  cave: "/game-assets/enemies/cave.png",
  goblinHouse: "/game-assets/enemies/goblin-house.png",
  goblinTower: "/game-assets/enemies/goblin-tower.png",
  gnomeIdle: "/game-assets/enemies/gnome-idle.png",
  gnomeRun: "/game-assets/enemies/gnome-run.png",
  gnomeAttack: "/game-assets/enemies/gnome-attack.png",
  goblinIdle: "/game-assets/enemies/goblin-idle.png",
  goblinRun: "/game-assets/enemies/goblin-run.png",
  goblinAttack: "/game-assets/enemies/goblin-attack.png",
  gnollIdle: "/game-assets/enemies/gnoll-idle.png",
  gnollRun: "/game-assets/enemies/gnoll-run.png",
  gnollAttack: "/game-assets/enemies/gnoll-attack.png",
  thiefIdle: "/game-assets/enemies/thief-idle.png",
  thiefRun: "/game-assets/enemies/thief-run.png",
  thiefAttack: "/game-assets/enemies/thief-attack.png",
  skullIdle: "/game-assets/enemies/skull-idle.png",
  skullRun: "/game-assets/enemies/skull-run.png",
  skullAttack: "/game-assets/enemies/skull-attack.png",
  pandaIdle: "/game-assets/enemies/panda-idle.png",
  pandaRun: "/game-assets/enemies/panda-run.png",
  pandaAttack: "/game-assets/enemies/panda-attack.png",
  minotaurIdle: "/game-assets/enemies/minotaur-idle.png",
  minotaurRun: "/game-assets/enemies/minotaur-run.png",
  minotaurAttack: "/game-assets/enemies/minotaur-attack.png",
  dust: "/game-assets/fx/dust.png",
  explosion: "/game-assets/fx/explosion.png",
  fire: "/game-assets/fx/fire.png",
  splash: "/game-assets/fx/splash.png",
} as const;

export type AssetKey = keyof typeof ASSET_PATHS;
export type ImageBank = Record<AssetKey, HTMLImageElement>;

let imagePromise: Promise<ImageBank> | null = null;

export function loadGameImages() {
  if (imagePromise) return imagePromise;

  imagePromise = Promise.all(
    Object.entries(ASSET_PATHS).map(
      ([key, src]) =>
        new Promise<[AssetKey, HTMLImageElement]>((resolve, reject) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => resolve([key as AssetKey, image]);
          image.onerror = () => reject(new Error(`Unable to load ${src}`));
          image.src = src;
        }),
    ),
  ).then((entries) => Object.fromEntries(entries) as ImageBank);

  return imagePromise;
}
