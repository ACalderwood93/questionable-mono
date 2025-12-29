import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GameConfig {
  player: {
    startingHealth: number;
  };
  powerPoints: {
    max: number;
    min: number;
    timeThreshold: number;
  };
  powerUps: {
    attack: {
      cost: number;
      baseDamage: number;
      powerPointsDrained: number;
      shieldDamageReduction: number;
    };
    shield: {
      cost: number;
      shieldsGained: number;
    };
    skip: {
      cost: number;
      powerPointsDrained: number;
    };
  };
  questions: {
    count: number;
    category: string;
    provider: string;
  };
}

let config: GameConfig | null = null;

export function loadConfig(): GameConfig {
  if (config) {
    return config;
  }

  try {
    const configPath = join(__dirname, "../game-config.yml");
    const fileContents = readFileSync(configPath, "utf8");
    config = yaml.load(fileContents) as GameConfig;

    // Validate required fields
    if (!config.player?.startingHealth) {
      throw new Error("Missing player.startingHealth in config");
    }
    if (
      !config.powerPoints?.max ||
      !config.powerPoints?.min ||
      !config.powerPoints?.timeThreshold
    ) {
      throw new Error("Missing powerPoints configuration in config");
    }
    if (!config.powerUps?.attack || !config.powerUps?.shield || !config.powerUps?.skip) {
      throw new Error("Missing powerUps configuration in config");
    }
    if (!config.questions?.count || !config.questions?.category || !config.questions?.provider) {
      throw new Error("Missing questions configuration in config");
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load game config: ${error.message}`);
    }
    throw new Error("Failed to load game config: Unknown error");
  }
}

export function getConfig(): GameConfig {
  return loadConfig();
}
