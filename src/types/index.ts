import { Attack } from "./attack"
import { EntityId, Pair } from "./base"
import {
  Deadspeak,
  EggGrow,
  Food,
  PointLight,
  Potion,
  Radiation,
  SapCollector,
  ShieldGenerator,
  Turret,
} from "./components"
import {
  DamageModifier,
  DamageModifiers,
  DamageProfile,
  DamageType,
} from "./damage"
import { DropEntry, GeneralDrop } from "./drop"

export interface ApiKey {
  $id: string
  key: string
  name: string
  created: string
  status: "active" | "revoked"
  revokedAt?: string
}

export interface IUser {
  id: string
  name: string
  email: string
  apiKeys: { keysData: ApiKey[]; userPlan: any }
  plan: string
}

export interface IContextType {
  user: IUser
  isLoading: boolean
  isAuthenticated: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
  createApiKey: (name: string) => Promise<ApiKey | null>
  revokeApiKey: (keyId: string) => Promise<void>
}

export type INavLink = {
  imgURL: string
  route: string
  label: string
}

export type IUpdateUser = {
  userId: string
  name: string
}

export type INewUser = {
  name: string
  email: string
  password: string
}

export type Distribution = number[]
export type DropDist = Record<EntityId, Distribution>

export enum SkillType {
  Swords = 1,
  Knives,
  Clubs,
  Polearms,
  Spears,
  Blocking,
  Axes,
  Bows,
  ElementalMagic,
  BloodMagic,
  Unarmed = 11,
  Pickaxes,
  WoodCutting,
  Crossbows,
  Jump = 100,
  Sneak,
  Run,
  Swim,
  Fishing,
  Ride = 110,
  All = 999,
}

export type GameComponent =
  | "ArmorStand"
  | "BaseAI"
  | "Beacon"
  | "Bed"
  | "Beehive"
  | "Catapult"
  | "Chair"
  | "Character"
  | "Container"
  | "CookingStation"
  | "Corpse"
  | "CraftingStation"
  | "CraftingStationExtension"
  | "CreatureSpawner"
  | "Destructible"
  | "Door"
  | "DungeonGenerator"
  | "EggGrow"
  | "Fermenter"
  | "Fireplace"
  | "Fish"
  | "FishingFloat"
  | "Growup"
  | "Humanoid"
  | "ItemDrop"
  | "ItemStand" // also boss stones & parts of some altars
  | "Leviathan"
  | "LiquidVolume" /* TarLiquid */
  | "LocationProxy" /* ~ */ // | 'LootSpawner' // lootspawner_pineforest
  | "MapTable"
  | "MineRock"
  | "MineRock5"
  | "MonsterAI"
  | "Pickable"
  | "PickableItem"
  | "Piece"
  | "Plant"
  | "Player"
  | "PrivateArea"
  | "Procreation"
  | "Ragdoll"
  | "RandomAnimation"
  | "RandomFlyingBird"
  | "ResourceRoot"
  | "Runestone" /* boss stones */
  | "Saddle"
  | "SapCollector"
  | "SEMan"
  | "ShieldGenerator"
  | "ShipConstructor"
  | "Ship"
  | "Sign"
  | "Smelter"
  | "Tameable"
  | "TeleportWorld"
  | "TerrainComp"
  | "TombStone"
  | "Trader"
  | "Trap"
  | "TreeBase"
  | "TreeLog"
  | "Turret"
  | "Vagon"
  | "Vegvisir"
  | "VisEquipment"
  | "WearNTear"
  | "Windmill"
  | "WispSpawner"
  | "ZNetView"
  | "ZSyncTransform"

export type EntityGroup =
  | "ashtree"
  | "banner"
  | "bed"
  | "beech"
  | "berry"
  | "birch"
  | "bird"
  | "blob"
  | "chair"
  | "chest"
  | "cook"
  | "craft_station"
  | "demist"
  | "fir"
  | "fire"
  | "fish"
  | "gem"
  | "goblin"
  | "gray"
  | "hide"
  | "lumber"
  | "metal"
  | "ore"
  | "rug"
  | "runestone"
  | "seedTree"
  | "seedVeg"
  | "seeker"
  | "ship"
  | "smelt"
  | "stack"
  | "stand"
  | "torch"
  | "trader"
  | "value"
  | "semiboss"

export type Biome =
  | "Meadows"
  | "BlackForest"
  | "Swamp"
  | "Mountain"
  | "Plains"
  | "Ocean"
  | "Mistlands"
  | "DeepNorth"
  | "Ashlands"

export type ItemType =
  | "armor"
  | "arrow"
  | "bolt"
  | "missile"
  | "bomb"
  | "shield"
  | "building"
  | "creature"
  | "effect"
  | "fishe"
  | "object"
  | "resource"
  | "spawner"
  | "tool"
  | "ship"
  | "siege"
  | "cart"
  | "weapon"
  | "piece"

export type StationType =
  | "piece_cauldron"
  | "piece_oven"
  | "piece_workbench"
  | "piece_stonecutter"
  | "piece_artisanstation"
  | "forge"
  | "blackforge"
  | "piece_magetable"
  | "piece_enchanter"
  | "piece_augmenter"

export type DungeonRoomsConfig = {
  type: "dungeon"
  prefix: string
  rooms: RoomConfig[]
}

export type CampConfig = {
  type: "camp"
  prefix: string
  inner: CamplaceConfig[]
  perimeter: CamplaceConfig[]
}

export type RoomConnection = {
  pos: [x: number, y: number, z: number]
  type?: string
  entrance?: boolean
  allowDoor?: boolean
}

export type RoomConfig = {
  id: string
  theme: Theme
} & (
  | {
      type: "start"
    }
  | {
      type: "middle"
      minPlaceOrder?: number
    }
  | {
      type: "end"
      minPlaceOrder?: number
      endCapPriority?: number
    }
) & {
    size: [number, number, number]
    weight: number
    connections: RoomConnection[]
    items: LocationItem[]
    dist: Distribution
  }

export type CamplaceConfig = {
  id: string
  theme: Theme
  size: [number, number, number]
  weight: number
  items: LocationItem[]
  dist: Distribution
}

export enum Theme {
  None = 0,
  Crypt = 1,
  SunkenCrypt = 2,
  Cave = 4,
  ForestCrypt = 8,
  GoblinCamp = 16,
  MeadowsVillage = 32,
  MeadowsFarm = 64,
  DvergrTown = 128,
  DvergrBoss = 256,
  ForestCryptHildir = 512,
  CaveHildir = 1024,
  PlainsFortHildir = 2048,
  AshlandsRuins = 4096,
  FortressRuins = 8192,
}

const COLD_DAY = 1
const COLD_NIGHT = 2
const COLD = COLD_DAY | COLD_NIGHT
const FREEZE = 12
const WET = 16
const DARK = 32
const RAIN = WET | DARK

export const envStates = {
  Clear: { emoji: "☀️", wind: [0.1, 0.6], light: [1, 1.7], flags: COLD_NIGHT },
  Twilight_Clear: {
    emoji: "☀️",
    wind: [0.2, 0.6],
    light: [0.3, 0.5],
    flags: COLD,
  },
  Misty: { emoji: "🌫️", wind: [0.1, 0.3], light: [1, 1], flags: COLD_NIGHT },
  Darklands_dark: {
    emoji: "☁️",
    wind: [0.1, 0.6],
    light: [0, 1],
    flags: COLD | DARK,
  },
  Heath_clear: {
    emoji: "☀️",
    wind: [0.4, 0.8],
    light: [1, 1.5],
    flags: COLD_NIGHT,
  },
  DeepForest_Mist: {
    emoji: "☀️",
    wind: [0.1, 0.6],
    light: [1.2, 1.5],
    flags: COLD_NIGHT,
  },
  GDKing: {
    emoji: "🟣",
    wind: [0.1, 0.3],
    light: [1.4, 1.5],
    flags: COLD_NIGHT,
  },
  Rain: {
    emoji: "🌧️",
    wind: [0.5, 1],
    light: [0.5, 0.77],
    flags: COLD_NIGHT | RAIN,
  },
  LightRain: {
    emoji: "🌦️",
    wind: [0.1, 0.6],
    light: [0.8, 0.9],
    flags: COLD_NIGHT | RAIN,
  },
  ThunderStorm: {
    emoji: "⛈️",
    wind: [0.8, 1],
    light: [0.5, 0.77],
    flags: COLD_NIGHT | RAIN,
  },
  Eikthyr: {
    emoji: "🟣",
    wind: [0.9, 1],
    light: [0.5, 0.77],
    flags: COLD_NIGHT | DARK,
  },
  GoblinKing: { emoji: "🟣", wind: [0.5, 0.7], light: [0.6, 1], flags: DARK },
  nofogts: {
    emoji: "",
    wind: [1, 1],
    light: [0.5, 0.77],
    flags: COLD_NIGHT | RAIN,
  },
  SwampRain: {
    emoji: "🌧️",
    wind: [0.1, 0.3],
    light: [0.5, 0.6],
    flags: COLD_NIGHT | WET,
  },
  Bonemass: {
    emoji: "🟣",
    wind: [0.1, 0.3],
    light: [0.4, 0.6],
    flags: COLD_NIGHT | WET,
  },
  Snow: { emoji: "🌨️", wind: [0.1, 0.6], light: [0.4, 1.2], flags: FREEZE },
  Twilight_Snow: {
    emoji: "🌨️",
    wind: [0.3, 0.6],
    light: [0.5, 0.5],
    flags: COLD,
  },
  Twilight_SnowStorm: {
    emoji: "❄️",
    wind: [0.7, 1],
    light: [0.4, 0.4],
    flags: FREEZE | COLD_NIGHT,
  },
  SnowStorm: {
    emoji: "❄️",
    wind: [0.8, 1],
    light: [0.2, 0.7],
    flags: FREEZE | COLD_NIGHT,
  },
  Moder: {
    emoji: "🟣",
    wind: [1, 1],
    light: [0.5, 0.7],
    flags: FREEZE | COLD_NIGHT,
  },
  Mistlands_clear: {
    emoji: "☀️",
    wind: [0.05, 0.2],
    light: [0.5, 1.2],
    flags: COLD_NIGHT,
  },
  Mistlands_rain: {
    emoji: "🌧️",
    wind: [0.05, 0.2],
    light: [0.5, 0.7],
    flags: WET | COLD_NIGHT | DARK,
  },
  Mistlands_thunder: {
    emoji: "⛈️",
    wind: [0.5, 1],
    light: [0.5, 0.8],
    flags: WET | COLD_NIGHT | DARK,
  },
  Queen: { emoji: "🟣", wind: [1, 1], light: [0.6, 0.6], flags: DARK },
  Ashlands_ashrain: {
    emoji: "☔",
    wind: [0.1, 0.5],
    light: [0.4, 1.6],
    flags: 0,
  },
  Ashlands_storm: {
    emoji: "⛈️",
    wind: [0.8, 1.0],
    light: [0.4, 0.8],
    flags: 0,
  },
  Ashlands_meteorshower: {
    emoji: "",
    wind: [0.1, 0.5],
    light: [1, 1.2],
    flags: 0,
  },
  Ashlands_misty: {
    emoji: "🌫️",
    wind: [0.1, 0.5],
    light: [0.6, 1.0],
    flags: 0,
  },
  Ashlands_CinderRain: {
    emoji: "☔",
    wind: [0.75, 0.7],
    light: [0.8, 1.3],
    flags: 0,
  },
  Ashlands_SeaStorm: {
    emoji: "⛈️",
    wind: [0.8, 1.0],
    light: [0.5, 0.77],
    flags: DARK,
  },
  Crypt: { emoji: "⬛", wind: [0, 0], light: [0, 0], flags: DARK },
  SunkenCrypt: { emoji: "⬛", wind: [0, 0], light: [0, 0], flags: DARK },
  Caves: { emoji: "⬛", wind: [0, 0], light: [0.1, 0.1], flags: DARK | FREEZE },
  InfectedMine: { emoji: "⬛", wind: [0, 0], light: [0.1, 0.1], flags: DARK },
} as const

export type ES = typeof envStates
export type EnvId = keyof ES

export type Season = "midsummer" | "christmas" | "helloween"

interface GameObjectBase {
  id: EntityId
  iconId?: string
  group?: EntityGroup
  components?: GameComponent[]
  tags?: string[]
  dlc?: "beta"
  mod?: string
  disabled?: true
  season?: Season
  tier: number
  emoji?: string
}

export interface ItemGrowConfig {
  num: Pair<number>
  forcePlacement?: boolean
  scale?: Pair<number>
  randTilt?: number
  chanceToUseGroundTilt?: number
  locations: Biome[]
  biomeArea?: number
  blockCheck?: boolean
  altitude?: Pair<number>
  oceanDepth?: Pair<number>
  tilt?: Pair<number>
  terrainDelta?: Pair<number>
  terrainDeltaRadius?: number
  offset?: number
  group?: Pair<number>
  groupRadius?: number
  onSurface?: boolean
  inForest?: Pair<number> | null
  respawn?: number
  abundance?: number
}

export type ItemGrow = Required<ItemGrowConfig>

export type ItemRecipe =
  | {
      type: "craft"
      time: number
      onlyOneIngredient: boolean
      materials: Record<EntityId, number>
      materialsPerLevel: Record<EntityId, number>
      source: { station: EntityId | null; level: number }
      item: EntityId
      number: number
    }
  | {
      type: "haldor" | "hildir"
      value: number
      item: EntityId
      number: number
      killed?: EntityId
    }

export interface BaseItem extends GameObjectBase {
  stack?: number
  maxLvl?: number
  variants?: number
  trophyPos?: any
  weight: number
  floating?: true
  teleportable?: false
  demister?: number
  grow?: ItemGrow[]
  PointLight?: PointLight
}

export interface Resource extends BaseItem {
  type: "item" | "trophy"
  emoji?: string
  summon?: [EntityId, number]
  power?: EntityId
  Deadspeak?: Deadspeak
  Radiation?: Radiation
  Food?: Food
  EggGrow?: EggGrow
  Potion?: Potion
  Value?: number
}

export interface Arrow extends BaseItem {
  type: "arrow" | "bolt" | "missile"
  damage: DamageProfile
  knockback: number
}

export interface Tool extends BaseItem {
  type: "tool"
  special: "build" | "garden" | "ground" | "fishing" | "butcher" | "demister"
  maxLvl: number
  durability: Pair<number>
  produces: EntityId[]
}

export interface Weapon extends BaseItem {
  type: "weapon"
  emoji: string
  slot:
    | "primary"
    | "both"
    | "secondary"
    | "bow"
    | "either"
    | "head"
    | "shoulders"
    | "body"
    | "legs"
    | "none"
  special?: "harpoon"
  maxLvl: number
  moveSpeed: number
  block: number | Pair<number>
  // knockback when blocking
  parryForce: number | Pair<number>
  // perfect block multiplier
  parryBonus: number
  skill: Exclude<SkillType, SkillType.Blocking> | null
  toolTier?: number
  hitEffect?: { id: EntityId; chance: number }
  damage: Pair<DamageProfile>
  knockback: number
  backstab: number
  attacks: Attack[]
  durability: Pair<number>
  durabilityDrainPerSec?: number
  damageMultiplierPerMissingHP?: number
  set?: ItemSet
  holdDurationMin?: number
  holdStaminaDrain?: number
}
export interface Shield extends BaseItem {
  type: "shield"
  emoji: string
  slot: "secondary"
  maxLvl: number
  moveSpeed: number
  damageModifiers?: Partial<DamageModifiers>
  block: number | Pair<number>
  parryForce: number | Pair<number>
  parryBonus: number
  skill: SkillType.Blocking
  damage?: Pair<DamageProfile>
  knockback?: number
  backstab?: number
  durability: Pair<number>
  set?: ItemSet
}
export interface Bomb extends BaseItem {
  type: "bomb"
  emoji: string
  slot: "primary"
  spawns: EntityId
  stamina: number
}

export interface Armor extends BaseItem {
  type: "armor"
  slot: "head" | "shoulders" | "body" | "legs" | "util" | "none"
  special?: "light" | "strength" | "search" | "demister"
  hideHair?: boolean
  hideBeard?: boolean
  maxLvl: number
  moveSpeed: number
  staminaModifiers?: Partial<
    Record<"dodge" | "block" | "attack" | "home", number>
  >
  armor: Pair<number>
  damageModifiers?: Partial<DamageModifiers>
  durability: Pair<number>
  eitrRegen?: number
  set?: ItemSet
  effect?: Effect
}

export type Faction =
  | "Players" // 0
  | "AnimalsVeg" // 1
  | "ForestMonsters" // 2
  | "Undead" // 3
  | "Demon" // 4 best friends
  | "MountainMonsters" // 5
  | "SeaMonsters" // 6
  | "PlainsMonsters" // 7
  | "Boss" // 8 aggressive only to players
  | "MistlandsMonsters" // 9
  | "Dverger" // 10

export type BiomeConfig = {
  id: Biome
  active: boolean
  tier: number
  emoji: string
  locations: string[]
  destructibles: Set<EntityId>
  creatures: Set<Creature | Fish>
  resources: Set<EntityId>
}

export type LocationItem = {
  item: EntityId | LocationItem[]
  chance: number
  number: number
}

export type LocationConfig = {
  id: string
  typeId: string
  components?: GameComponent[]
  type: "altar" | "dungeon" | "runestone" | "misc"
  tier: number
  tags?: string[]

  quantity: number
  biomes: Biome[]
  biomeArea: number
  prioritized: boolean
  centerFirst: boolean
  unique: boolean
  group: string
  minApart: number
  maxApart: number
  iconAlways: boolean
  iconPlaced: boolean
  randomRotation: boolean
  slopeRotation: boolean
  terrainDelta: Pair<number>
  inForest: Pair<number> | null
  distance: Pair<number>
  altitude: Pair<number>
  // interior / exterior
  radius: Pair<number>

  destructibles: DropDist
  creatures: DropDist
  resources: DropDist
  customMusic?: string
  items: LocationItem[]
  needsKey?: EntityId
  dungeon?: DungeonRoomsConfig
  camp?: CampConfig
}

export type DungeonGenConfig = {
  id: string
} & (
  | {
      type: "Dungeon"
      rooms: Pair<number>
      minRequiredRooms: number
      requiredRooms: string[]
      doorTypes: EntityId[]
      doorChance: number
    } /*| {
  type: 'CampGrid';
  rooms: Pair<number>;
  maxTilt: number;
  tileWidth: number;
  gridSize: number;
  spawnChance: number;
}*/
  | {
      type: "CampRadial"
      rooms: Pair<number>
      maxTilt: number
      radius: Pair<number>
      perimeterSections: number
      perimeterBuffer: number
    }
)

export const damageModifiersValues: Record<DamageModifier, number> = {
  normal: 1,
  resistant: 0.5,
  weak: 1.5,
  immune: 0,
  ignore: 0,
  veryResistant: 0.25,
  veryWeak: 2,
}

export type Effect = {
  type: "effect"
  id: EntityId
  disabled?: boolean
  iconId?: string
  tier: number
  special?: "Tailwind" | "Demister"
  time?: number
  comfort?: { value: number }
  cooldown?: number
  absorbDamage?: Pair<number>
  healthOverTime?: [change: number, interval: number]
  damageModifiers?: Partial<DamageModifiers>
  damageValueModifier?: [damage: DamageType, modifier: number]
  attackModifier?: [skill: SkillType, modifier: number]
  skillModifiers?: Partial<Record<SkillType, number>>
  fallDamage?: number
  carryWeight?: number
  runStamina?: number
  jumpStamina?: number
  attackStamina?: number
  healthRegen?: number
  staminaRegen?: number
  eitrRegen?: number
  xpModifier?: number
  moveSpeed?: number
  windMovementModifier?: number
  Aoe?: Aoe
}

export type NormalAttackProfile = {
  dmg: DamageProfile
  burst?: number
  name: string
  unblockable?: true
  undodgeable?: true
  stagger?: number
  // knockback
  force?: number
  toolTier?: number
  aiMinHp?: number
  aiMaxHp?: number
}
export type SpawnAttackProfile = {
  spawn: EntityId[]
  number: Pair<number>
  max: number
}
export type CastAttackProfile = {
  cast: EntityId
}
export type AttackProfile =
  | NormalAttackProfile
  | SpawnAttackProfile
  | CastAttackProfile
export type AttackVariety = {
  rate: number
  variety: string
  attacks: AttackProfile[]
}

export const TOLERATE = {
  WATER: 1,
  FIRE: 2,
  SMOKE: 4,
  TAR: 8,
}

export interface Spawner extends GameObjectBase {
  type: "spawner"
  spawn: EntityId
  levels: Pair<number>
  levelUpChance: number
  respawnMinutes?: number
}

export interface SpawnerConfig {
  tier: number
  biomes: Biome[]
  biomeAreas: number
  // counts number of spawned in loaded zones (5x5)
  maxSpawned: number
  // passed time is divided by interval and rounded down
  interval: number
  // checked on every attempt
  chance: number
  // radius to check for closest
  distance: number
  radius: Pair<number>
  killed: EntityId | undefined
  envs: EnvId[]
  groupSize: Pair<number>
  groupRadius: number
  night: boolean | undefined
  altitude: Pair<number>
  tilt: Pair<number>
  forest: boolean | undefined
  offset: number
  levels: Pair<number>
  minDistance: number
}

export interface Creature extends GameObjectBase {
  ragdollId: EntityId | null
  type: "creature"
  PointLight?: PointLight
  components: GameComponent[]
  emoji: string
  upgradeDistance?: number
  faction: Faction
  maxLvl?: number
  spawners: SpawnerConfig[]
  tolerate: number
  speed: {
    // m_speed || m_flySlowSpeed
    walk: number
    // m_runSpeed || m_flyFastSpeed
    run: number
    // m_swimSpeed
    swim: number
  }
  turnSpeed: {
    // m_turnSpeed || m_flyTurnSpeed
    walk: number
    // m_runTurnSpeed || m_flyTurnSpeed
    run: number
    // m_swimTurnSpeed
    swim: number
  }
  hp: number
  stagger: {
    factor: number
    time: number
  } | null
  attacks: AttackVariety[]
  damageModifiers: DamageModifiers
  weakSpots?: { location: string; damageModifiers: DamageModifiers }[]
  // Gjall, SeekerBrute, TheHive, SeekerQueen
  drop: DropEntry[]
  timedDestruction?: Pair<number>
  tame?: {
    fedTime: number
    tameTime: number
    commandable: boolean
    eats: EntityId[]
  }
  pregnancy?: {
    points: number
    time: number
    chance: number
    grow: number
    childId: EntityId
  }
}

export interface Fish extends GameObjectBase {
  type: "fish"
  components: GameComponent[]
  emoji: string
  stack: number
  weight: Pair<number>
  spawners: SpawnerConfig[]
  speed: number
  turnSpeed: number
  baits: Record<EntityId, number>
  staminaUse: number
  escapeStaminaUse: number
  extraDrop: GeneralDrop
  Deadspeak?: Deadspeak
}

/**
 *           hp drop place plant
 * object  |   |    |  v  |
 * tree    | v | v  |  v  |  v
 * rock    | v | v  |  v  |
 * carrot  |   | v  |     |  v
 * seeds   |   | v  |  v  |  v
 */
export interface Destructible {
  hp: number
  damageModifiers: DamageModifiers
  minToolTier: number
  ashResist?: boolean
  ashImmune?: boolean
  parts: {
    id: EntityId
    num: number
  }[]
}

export interface ResourceRoot {
  maxLevel: number
  highThreshold: number
  emptyTreshold: number
  regenPerSec: number
}

export interface Aoe {
  damage: DamageProfile
  radius: number
  backstabBonus: number
  ttl: number
  chainTargets?: Pair<number>
}

export interface Plantable {
  subtype: "tree" | "vegetable" | "crop" | "shroom"
  plantedWith: EntityId
  growTime: Pair<number>
  cultivatedGround: boolean
  destroyUnhealthy: boolean
  freeSpaceRadius: number
  biomes: Biome[]
}

export interface Leviathan {
  chance: number
  delay: number
}

export interface SpawnArea {
  levelUpChance: number
  maxNear: number
  interval: number
  prefabs: { prefab: EntityId; weight: number; level: Pair<number> }[]
}

export type PhysicalObject = GameObjectBase & {
  type: "object"
  subtype:
    | "tree"
    | "plant"
    | "rock"
    | "ore"
    | "indestructible"
    | "misc"
    | "treasure"
    | "trader"
  PointLight?: PointLight
  Destructible?: Destructible
  Leviathan?: Leviathan
  Aoe?: Aoe
  ResourceRoot?: ResourceRoot
  drop?: GeneralDrop[]
  trader?: "haldor" | "hildir"
  grow?: ItemGrow[]
  Plant?: Plantable
  Beacon?: number
  Vegvisir?: string
  RuneStone?: string[]
  SpawnArea?: SpawnArea
  floating?: true
}

export enum MaterialType {
  Wood,
  Stone,
  Iron,
  HardWood,
  Marble,
  Ashstone,
  Ancient,
}

export type ComfortGroup =
  | "fire"
  | "bed"
  | "banner"
  | "chair"
  | "table"
  | "carpet"

export type Wear = {
  hp: number
  damageModifiers: DamageModifiers
  ashResist?: boolean
  ashImmune?: boolean
  burnable?: boolean
  noRoof?: boolean
  noSupport?: boolean
  providesSupport?: boolean
  materialType?: MaterialType
}

export interface BasePiece extends GameObjectBase {
  burnable?: boolean
  wear: Wear
  piece?: {
    target: "primary" | "random" | "none"
    water: boolean | undefined
    size: [width: number, height: number, depth: number]
    notOnWood?: boolean
    onlyOnFlat?: boolean
    notOnFloor?: boolean
    onlyCeiling?: boolean
    groundOnly?: boolean
    repairable?: boolean
    nonRemovable?: boolean
    allowedInDungeons?: boolean
    requiredSpace?: number
  }
  recipe?: {
    type: "craft_piece"
    materials: Record<EntityId, number>
    station: EntityId | null
  }
}

type Ignite = {
  interval: number
  chance: number
  spread: number
  capsuleRadius: number
}

export type Piece = BasePiece & {
  type: "piece"
  base: boolean
  demister?: number
  wear: Wear
  blockingPieces?: { pieces: EntityId[]; radius: number }
  SapCollector?: SapCollector
  PointLight?: PointLight
  Aoe?: {
    damage: DamageProfile
    self: number
    backstabBonus?: number
  }
  Turret?: Turret
  ShieldGenerator?: ShieldGenerator
} & (
    | {
        subtype: "fireplace"
        fireplace: {
          fuel: EntityId
          capacity: number
          burnTime: number
          minHeightAbove: number
          warmRadius: number
          lightRadius: number
          smoke: boolean
          fireworks: boolean
          ignite: Ignite
        }
        comfort?: {
          value: number
          group?: "fire"
        }
      }
    | {
        subtype: "craft"
        craft: {
          queueSize?: number
          batchSize?: number
          buildRange?: number
          requiresRoof?: boolean
          requiresFire?: boolean
        }
      }
    | {
        subtype: "craft_ext"
        extends: {
          id: EntityId
          distance: number
          requiresRoof?: boolean
          requiresFire?: boolean
        }
      }
    | {
        subtype: "misc" | "structure" | "door"
      }
    | {
        subtype: "bed" | "chair" | "table" | "decoration"
        comfort: {
          value: number
          group?: ComfortGroup
        }
      }
    | {
        subtype: "stand"
        supportedTypes: ItemType[]
      }
    | {
        subtype: "chest"
        space: [width: number, height: number]
      }
    | {
        subtype: "external"
      }
  )

export interface Structure extends GameObjectBase {
  type: "structure"
  Destructible?: Destructible
}

export interface Transport extends BasePiece {
  type: "ship" | "cart"
  storage: [columns: number, rows: number]
}

export interface Siege extends BasePiece {
  type: "siege"
  Siege?: {
    fuel: EntityId[]
    damage: DamageProfile
    toolTier: number
  }
}

export interface Ship extends Transport {
  type: "ship"
  sail: {
    forceDistance: number
    force: number
    damping: number
    dampingSideway: number
    dampingForward: number
    angularDamping: number
    sailForceOffset: number
    sailForceFactor: number
    rudderForce: number
    waterLevelOffset: number
    disableLevel: number
  }
  sailWidth: number
  speed: {
    rudder: number
    half: number[]
    full: number[]
  }
}

export interface Cart extends Transport {
  type: "cart"
}

interface GameEventSpawn {
  id: EntityId
  max: number
  group?: Pair<number>
  interval: number
  chance?: number
  // TODO: not used
  level?: Pair<number>
}

export interface GameEvent {
  id: EntityId
  tier: number
  icon: EntityId
  biomes: Biome[]
  killed: EntityId[]
  notKilled: EntityId[]
  altItems?: EntityId[]
  altItemsNot?: EntityId[]
  altPlayerKeys?: string[]
  altPlayerKeysNot?: string[]
  duration: number
  spawns: GameEventSpawn[]
  base: boolean
}

export * from "./base"
export * from "./attack"
export * from "./damage"
export * from "./drop"
export * from "./components"

export type Item = Resource | Weapon | Shield | Bomb | Armor | Arrow | Tool
export type ItemSet = {
  name: string
  items: EntityId[]
  bonus: (Effect | undefined)[]
}
export type ItemSpecial = Weapon["special"] | Armor["special"] | Tool["special"]

export type GameObject =
  | Item
  | Piece
  | Structure
  | PhysicalObject
  | Spawner
  | Ship
  | Cart
  | Siege
  | Creature
  | Fish

export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never
}[keyof T]

export type IItem<T> = T & {
  icon: string
  readableName: string
  originalName: EntityId
}

export type IItemCompact = {
  id: EntityId
  type: ItemType
  tier: number
  biomes: Biome[]
  group: EntityGroup
  station: StationType
}

export type IItemFull<T> = {
  item: IItem<T>
  recipe: ItemRecipe | null
}

export type IBiome = {
  name: string
  description: string
  bosses: IResponse<IItemFull<Creature>>
  imageUrl: string
}

export type IBiomeExtended = IBiome & {
  creatures: IResponse<IItemFull<Creature>>
  resources: IResponse<IItemFull<Resource>>
  food: IResponse<IItemFull<IItemCompact & { Food: Food }>>
}

export type IResponse<T> = {
  total: number
  items: T[]
}

export interface IPage {
  id: string
  type: "biome" | "calculator" | "page"
  title: string
  path: string
  description?: string
  icon?: string
}

export type AuthError = {
  type: "auth_error" | "server_error" | "validation_error" | "unknown_error"
  message: string
}
