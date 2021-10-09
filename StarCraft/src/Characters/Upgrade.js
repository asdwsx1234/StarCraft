import Terran from './Terran';
import Zerg from './Zerg';
import Protoss from './Protoss';
import BuildingStore from './BuildingStore';
import Magic from './Magic';
import { Unit } from './Units';

var Upgrade = {
  //Terran
  UpgradeInfantryWeapons: {
    name: 'UpgradeInfantryWeapons',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.Marine.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Terran.Firebat.prototype.damage[Number(Boolean(isEnemy))] += 2;
      Terran.Ghost.prototype.damage[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.EngineeringBay.prototype.items[1];
    },
  },
  UpgradeInfantryArmors: {
    name: 'UpgradeInfantryArmors',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.SCV.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Marine.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Firebat.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Ghost.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Medic.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Civilian.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.EngineeringBay.prototype.items[2];
    },
  },
  ResearchU238Shells: {
    name: 'ResearchU238Shells',
    cost: {
      mine: 150,
      gas: 150,
      time: 1000,
    },
    effect: function (isEnemy) {
      Terran.Marine.prototype.attackRange[Number(Boolean(isEnemy))] = 175;
      delete BuildingStore.TerranBuilding.Academy.prototype.items[1];
    },
  },
  ResearchStimPackTech: {
    name: 'ResearchStimPackTech',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.StimPacks.enabled = true;
      delete BuildingStore.TerranBuilding.Academy.prototype.items[2];
    },
  },
  ResearchRestoration: {
    name: 'ResearchRestoration',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.Restoration.enabled = true;
      delete BuildingStore.TerranBuilding.Academy.prototype.items[4];
    },
  },
  ResearchOpticalFlare: {
    name: 'ResearchOpticalFlare',
    cost: {
      mine: 100,
      gas: 100,
      time: 1200,
    },
    effect: function () {
      Magic.OpticalFlare.enabled = true;
      delete BuildingStore.TerranBuilding.Academy.prototype.items[5];
    },
  },
  ResearchCaduceusReactor: {
    name: 'ResearchCaduceusReactor',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Terran.Medic.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.TerranBuilding.Academy.prototype.items[6];
    },
  },
  ResearchIonThrusters: {
    name: 'ResearchIonThrusters',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function (isEnemy) {
      Terran.Vulture.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(20);
      delete BuildingStore.TerranBuilding.MachineShop.prototype.items[1];
    },
  },
  ResearchSpiderMines: {
    name: 'ResearchSpiderMines',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.SpiderMines.enabled = true;
      delete BuildingStore.TerranBuilding.MachineShop.prototype.items[2];
    },
  },
  ResearchSiegeTech: {
    name: 'ResearchSiegeTech',
    cost: {
      mine: 150,
      gas: 150,
      time: 800,
    },
    effect: function () {
      Magic.SeigeMode.enabled = true;
      delete BuildingStore.TerranBuilding.MachineShop.prototype.items[3];
    },
  },
  ResearchCharonBoosters: {
    name: 'ResearchCharonBoosters',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Terran.Goliath.prototype.attackMode.flying.attackRange[
        Number(Boolean(isEnemy))
      ] = 300;
      delete BuildingStore.TerranBuilding.MachineShop.prototype.items[4];
    },
  },
  ResearchCloakingField: {
    name: 'ResearchCloakingField',
    cost: {
      mine: 150,
      gas: 150,
      time: 1000,
    },
    effect: function () {
      Magic.Cloak.enabled = true;
      delete BuildingStore.TerranBuilding.ControlTower.prototype.items[1];
    },
  },
  ResearchApolloReactor: {
    name: 'ResearchApolloReactor',
    cost: {
      mine: 200,
      gas: 200,
      time: 1660,
    },
    effect: function (isEnemy) {
      Terran.Wraith.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.TerranBuilding.ControlTower.prototype.items[2];
    },
  },
  ResearchEMPShockwaves: {
    name: 'ResearchEMPShockwaves',
    cost: {
      mine: 200,
      gas: 200,
      time: 1200,
    },
    effect: function () {
      Magic.EMPShockwave.enabled = true;
      delete BuildingStore.TerranBuilding.ScienceFacility.prototype.items[1];
    },
  },
  ResearchIrradiate: {
    name: 'ResearchIrradiate',
    cost: {
      mine: 150,
      gas: 150,
      time: 800,
    },
    effect: function () {
      Magic.Irradiate.enabled = true;
      delete BuildingStore.TerranBuilding.ScienceFacility.prototype.items[2];
    },
  },
  ResearchTitanReactor: {
    name: 'ResearchTitanReactor',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Terran.Vessel.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.TerranBuilding.ScienceFacility.prototype.items[3];
    },
  },
  ResearchLockdown: {
    name: 'ResearchLockdown',
    cost: {
      mine: 200,
      gas: 200,
      time: 1000,
    },
    effect: function () {
      Magic.Lockdown.enabled = true;
      delete BuildingStore.TerranBuilding.ConvertOps.prototype.items[1];
    },
  },
  ResearchPersonalCloaking: {
    name: 'ResearchPersonalCloaking',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.PersonalCloak.enabled = true;
      delete BuildingStore.TerranBuilding.ConvertOps.prototype.items[2];
    },
  },
  ResearchOcularImplants: {
    name: 'ResearchOcularImplants',
    cost: {
      mine: 100,
      gas: 100,
      time: 1660,
    },
    effect: function (isEnemy) {
      Terran.Ghost.prototype.sight[Number(Boolean(isEnemy))] = 385;
      delete BuildingStore.TerranBuilding.ConvertOps.prototype.items[4];
    },
  },
  ResearchMoebiusReactor: {
    name: 'ResearchMoebiusReactor',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Terran.Ghost.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.TerranBuilding.ConvertOps.prototype.items[5];
    },
  },
  ResearchYamatoGun: {
    name: 'ResearchYamatoGun',
    cost: {
      mine: 200,
      gas: 200,
      time: 1200,
    },
    effect: function () {
      Magic.Yamato.enabled = true;
      delete BuildingStore.TerranBuilding.PhysicsLab.prototype.items[1];
    },
  },
  ResearchColossusReactor: {
    name: 'ResearchColossusReactor',
    cost: {
      mine: 150,
      gas: 150,
      time: 1600,
    },
    effect: function (isEnemy) {
      Terran.BattleCruiser.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.TerranBuilding.PhysicsLab.prototype.items[2];
    },
  },
  UpgradeVehicleWeapons: {
    name: 'UpgradeVehicleWeapons',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.Vulture.prototype.damage[Number(Boolean(isEnemy))] += 2;
      Terran.Tank.prototype.damage[Number(Boolean(isEnemy))] += 3;
      Terran.Goliath.prototype.attackMode.ground.damage[
        Number(Boolean(isEnemy))
      ] += 2;
      Terran.Goliath.prototype.attackMode.flying.damage[
        Number(Boolean(isEnemy))
      ] += 4;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.Armory.prototype.items[1];
    },
  },
  UpgradeShipWeapons: {
    name: 'UpgradeShipWeapons',
    cost: {
      mine: [100, 150, 200],
      gas: [100, 150, 200],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.Wraith.prototype.attackMode.ground.damage[
        Number(Boolean(isEnemy))
      ] += 1;
      Terran.Wraith.prototype.attackMode.flying.damage[
        Number(Boolean(isEnemy))
      ] += 2;
      Terran.BattleCruiser.prototype.damage[Number(Boolean(isEnemy))] += 3;
      Terran.Valkyrie.prototype.damage[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.Armory.prototype.items[2];
    },
  },
  UpgradeVehicleArmors: {
    name: 'UpgradeVehicleArmors',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.Vulture.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Tank.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Goliath.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.Armory.prototype.items[4];
    },
  },
  UpgradeShipArmors: {
    name: 'UpgradeShipArmors',
    cost: {
      mine: [150, 225, 300],
      gas: [150, 225, 300],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Terran.Wraith.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Dropship.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.BattleCruiser.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Vessel.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Terran.Valkyrie.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.TerranBuilding.Armory.prototype.items[5];
    },
  },
  //Zerg
  EvolveBurrow: {
    name: 'EvolveBurrow',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.Burrow.enabled = Magic.Unburrow.enabled = true;
      delete BuildingStore.ZergBuilding.Hatchery.prototype.items[3];
      delete BuildingStore.ZergBuilding.Lair.prototype.items[3];
      delete BuildingStore.ZergBuilding.Hive.prototype.items[3];
    },
  },
  EvolveVentralSacs: {
    name: 'EvolveVentralSacs',
    cost: {
      mine: 200,
      gas: 200,
      time: 1600,
    },
    effect: function () {
      Magic.Load.enabled = Magic.UnloadAll.enabled = true;
      delete BuildingStore.ZergBuilding.Lair.prototype.items[4];
      delete BuildingStore.ZergBuilding.Hive.prototype.items[4];
    },
  },
  EvolveAntennas: {
    name: 'EvolveAntennas',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Zerg.Overlord.prototype.sight[Number(Boolean(isEnemy))] = 385;
      delete BuildingStore.ZergBuilding.Lair.prototype.items[5];
      delete BuildingStore.ZergBuilding.Hive.prototype.items[5];
    },
  },
  EvolvePneumatizedCarapace: {
    name: 'EvolvePneumatizedCarapace',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Zerg.Overlord.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(8);
      delete BuildingStore.ZergBuilding.Lair.prototype.items[6];
      delete BuildingStore.ZergBuilding.Hive.prototype.items[6];
    },
  },
  EvolveMetabolicBoost: {
    name: 'EvolveMetabolicBoost',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function (isEnemy) {
      Zerg.Zergling.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(18);
      delete BuildingStore.ZergBuilding.SpawningPool.prototype.items[1];
    },
  },
  EvolveAdrenalGlands: {
    name: 'EvolveAdrenalGlands',
    cost: {
      mine: 200,
      gas: 200,
      time: 1000,
    },
    effect: function (isEnemy) {
      Zerg.Zergling.prototype.attackInterval[Number(Boolean(isEnemy))] = 600;
      delete BuildingStore.ZergBuilding.SpawningPool.prototype.items[2];
    },
  },
  UpgradeMeleeAttacks: {
    name: 'UpgradeMeleeAttacks',
    cost: {
      mine: [100, 150, 200],
      gas: [100, 150, 200],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Zerg.Zergling.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Zerg.Ultralisk.prototype.damage[Number(Boolean(isEnemy))] += 3;
      Zerg.Broodling.prototype.damage[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ZergBuilding.EvolutionChamber.prototype.items[1];
    },
  },
  UpgradeMissileAttacks: {
    name: 'UpgradeMissileAttacks',
    cost: {
      mine: [100, 150, 200],
      gas: [100, 150, 200],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Zerg.Hydralisk.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Zerg.Lurker.prototype.damage[Number(Boolean(isEnemy))] += 2;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ZergBuilding.EvolutionChamber.prototype.items[2];
    },
  },
  EvolveCarapace: {
    name: 'EvolveCarapace',
    cost: {
      mine: [150, 225, 300],
      gas: [150, 225, 300],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Zerg.Drone.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Zergling.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Hydralisk.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Lurker.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Ultralisk.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Defiler.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Broodling.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.InfestedTerran.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ZergBuilding.EvolutionChamber.prototype.items[3];
    },
  },
  EvolveMuscularAugments: {
    name: 'EvolveMuscularAugments',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function (isEnemy) {
      Zerg.Hydralisk.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(13);
      delete BuildingStore.ZergBuilding.HydraliskDen.prototype.items[1];
    },
  },
  EvolveGroovedSpines: {
    name: 'EvolveGroovedSpines',
    cost: {
      mine: 150,
      gas: 150,
      time: 1000,
    },
    effect: function (isEnemy) {
      Zerg.Hydralisk.prototype.attackRange[Number(Boolean(isEnemy))] = 175;
      delete BuildingStore.ZergBuilding.HydraliskDen.prototype.items[2];
    },
  },
  EvolveLurkerAspect: {
    name: 'EvolveLurkerAspect',
    cost: {
      mine: 125,
      gas: 125,
      time: 1200,
    },
    effect: function () {
      Magic.Lurker.enabled = true;
      delete BuildingStore.ZergBuilding.HydraliskDen.prototype.items[4];
    },
  },
  UpgradeFlyerAttacks: {
    name: 'UpgradeFlyerAttacks',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Zerg.Mutalisk.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Zerg.Guardian.prototype.damage[Number(Boolean(isEnemy))] += 2;
      Zerg.Devourer.prototype.damage[Number(Boolean(isEnemy))] += 2;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3) {
        delete BuildingStore.ZergBuilding.Spire.prototype.items[1];
        delete BuildingStore.ZergBuilding.GreaterSpire.prototype.items[1];
      }
    },
  },
  UpgradeFlyerCarapace: {
    name: 'UpgradeFlyerCarapace',
    cost: {
      mine: [150, 225, 300],
      gas: [150, 225, 300],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Zerg.Overlord.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Mutalisk.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Guardian.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Devourer.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Scourge.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Zerg.Queen.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3) {
        delete BuildingStore.ZergBuilding.Spire.prototype.items[2];
        delete BuildingStore.ZergBuilding.GreaterSpire.prototype.items[2];
      }
    },
  },
  EvolveSpawnBroodling: {
    name: 'EvolveSpawnBroodling',
    cost: {
      mine: 200,
      gas: 200,
      time: 800,
    },
    effect: function () {
      Magic.SpawnBroodlings.enabled = true;
      delete BuildingStore.ZergBuilding.QueenNest.prototype.items[1];
    },
  },
  EvolveEnsnare: {
    name: 'EvolveEnsnare',
    cost: {
      mine: 100,
      gas: 100,
      time: 800,
    },
    effect: function () {
      Magic.Ensnare.enabled = true;
      delete BuildingStore.ZergBuilding.QueenNest.prototype.items[2];
    },
  },
  EvolveGameteMeiosis: {
    name: 'EvolveGameteMeiosis',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Zerg.Queen.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ZergBuilding.QueenNest.prototype.items[3];
    },
  },
  EvolveAnabolicSynthesis: {
    name: 'EvolveAnabolicSynthesis',
    cost: {
      mine: 200,
      gas: 200,
      time: 1330,
    },
    effect: function (isEnemy) {
      Zerg.Ultralisk.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(18);
      delete BuildingStore.ZergBuilding.UltraliskCavern.prototype.items[1];
    },
  },
  EvolveChitinousPlating: {
    name: 'EvolveChitinousPlating',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Zerg.Ultralisk.prototype.armor[Number(Boolean(isEnemy))] += 2;
      delete BuildingStore.ZergBuilding.UltraliskCavern.prototype.items[2];
    },
  },
  EvolvePlague: {
    name: 'EvolvePlague',
    cost: {
      mine: 200,
      gas: 200,
      time: 1000,
    },
    effect: function () {
      Magic.Plague.enabled = true;
      delete BuildingStore.ZergBuilding.DefilerMound.prototype.items[1];
    },
  },
  EvolveConsume: {
    name: 'EvolveConsume',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function () {
      Magic.Consume.enabled = true;
      delete BuildingStore.ZergBuilding.DefilerMound.prototype.items[2];
    },
  },
  EvolveMetasynapticNode: {
    name: 'EvolveMetasynapticNode',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Zerg.Defiler.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ZergBuilding.DefilerMound.prototype.items[3];
    },
  },
  //Protoss
  UpgradeGroundWeapons: {
    name: 'UpgradeGroundWeapons',
    cost: {
      mine: [100, 150, 200],
      gas: [100, 150, 200],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Protoss.Zealot.prototype.damage[Number(Boolean(isEnemy))] += 2;
      Protoss.Dragoon.prototype.damage[Number(Boolean(isEnemy))] += 2;
      Protoss.Templar.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Protoss.DarkTemplar.prototype.damage[Number(Boolean(isEnemy))] += 3;
      Protoss.Archon.prototype.damage[Number(Boolean(isEnemy))] += 3;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ProtossBuilding.Forge.prototype.items[1];
    },
  },
  UpgradeGroundArmor: {
    name: 'UpgradeGroundArmor',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Protoss.Probe.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Zealot.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Dragoon.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Templar.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.DarkTemplar.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Archon.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.DarkArchon.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Reaver.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ProtossBuilding.Forge.prototype.items[2];
    },
  },
  UpgradePlasmaShields: {
    name: 'UpgradePlasmaShields',
    cost: {
      mine: [200, 300, 400],
      gas: [200, 300, 400],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      for (var unitType in Protoss) {
        Protoss[unitType].prototype.plasma[Number(Boolean(isEnemy))] += 1;
      }
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ProtossBuilding.Forge.prototype.items[3];
    },
  },
  UpgradeAirWeapons: {
    name: 'UpgradeAirWeapons',
    cost: {
      mine: [100, 175, 250],
      gas: [100, 175, 250],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Protoss.Scout.prototype.attackMode.ground.damage[
        Number(Boolean(isEnemy))
      ] += 1;
      Protoss.Scout.prototype.attackMode.flying.damage[
        Number(Boolean(isEnemy))
      ] += 2;
      Protoss.Carrier.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Protoss.Arbiter.prototype.damage[Number(Boolean(isEnemy))] += 1;
      Protoss.Corsair.prototype.damage[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ProtossBuilding.CyberneticsCore.prototype.items[1];
    },
  },
  UpgradeAirArmor: {
    name: 'UpgradeAirArmor',
    cost: {
      mine: [150, 225, 300],
      gas: [150, 225, 300],
      time: [2660, 2980, 3300],
    },
    level: [0, 0],
    effect: function (isEnemy) {
      Protoss.Scout.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Carrier.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Arbiter.prototype.armor[Number(Boolean(isEnemy))] += 1;
      Protoss.Corsair.prototype.armor[Number(Boolean(isEnemy))] += 1;
      this.level[Number(Boolean(isEnemy))]++;
      if (this.level[0] >= 3)
        delete BuildingStore.ProtossBuilding.CyberneticsCore.prototype.items[2];
    },
  },
  DevelopSingularityCharge: {
    name: 'DevelopSingularityCharge',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Dragoon.prototype.attackRange[Number(Boolean(isEnemy))] = 210;
      delete BuildingStore.ProtossBuilding.CyberneticsCore.prototype.items[3];
    },
  },
  DevelopLegEnhancements: {
    name: 'DevelopLegEnhancements',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Protoss.Zealot.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(14);
      delete BuildingStore.ProtossBuilding.CitadelOfAdun.prototype.items[1];
    },
  },
  UpgradeScarabDamage: {
    name: 'UpgradeScarabDamage',
    cost: {
      mine: 200,
      gas: 200,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Reaver.prototype.damage[Number(Boolean(isEnemy))] = 125;
      delete BuildingStore.ProtossBuilding.RoboticsSupportBay.prototype.items[1];
    },
  },
  IncreaseReaverCapacity: {
    name: 'IncreaseReaverCapacity',
    cost: {
      mine: 200,
      gas: 200,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Reaver.prototype.scarabCapacity[Number(Boolean(isEnemy))] = 10;
      delete BuildingStore.ProtossBuilding.RoboticsSupportBay.prototype.items[2];
    },
  },
  DevelopGraviticDrive: {
    name: 'DevelopGraviticDrive',
    cost: {
      mine: 200,
      gas: 200,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Shuttle.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(16);
      delete BuildingStore.ProtossBuilding.RoboticsSupportBay.prototype.items[3];
    },
  },
  DevelopApialSensors: {
    name: 'DevelopApialSensors',
    cost: {
      mine: 100,
      gas: 100,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Scout.prototype.sight[Number(Boolean(isEnemy))] = 350;
      delete BuildingStore.ProtossBuilding.FleetBeacon.prototype.items[1];
    },
  },
  DevelopGraviticThrusters: {
    name: 'DevelopGraviticThrusters',
    cost: {
      mine: 200,
      gas: 200,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Scout.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(16);
      delete BuildingStore.ProtossBuilding.FleetBeacon.prototype.items[2];
    },
  },
  IncreaseCarrierCapacity: {
    name: 'IncreaseCarrierCapacity',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function (isEnemy) {
      //Protoss.Carrier.prototype.continuousAttack.count[Number(Boolean(isEnemy))]=8;
      Protoss.Carrier.prototype.interceptorCapacity[
        Number(Boolean(isEnemy))
      ] = 8;
      delete BuildingStore.ProtossBuilding.FleetBeacon.prototype.items[3];
    },
  },
  DevelopDistruptionWeb: {
    name: 'DevelopDistruptionWeb',
    cost: {
      mine: 200,
      gas: 200,
      time: 800,
    },
    effect: function () {
      Magic.DisruptionWeb.enabled = true;
      delete BuildingStore.ProtossBuilding.FleetBeacon.prototype.items[4];
    },
  },
  DevelopArgusJewel: {
    name: 'DevelopArgusJewel',
    cost: {
      mine: 100,
      gas: 100,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Corsair.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ProtossBuilding.FleetBeacon.prototype.items[5];
    },
  },
  DevelopPsionicStorm: {
    name: 'DevelopPsionicStorm',
    cost: {
      mine: 200,
      gas: 200,
      time: 1200,
    },
    effect: function () {
      Magic.PsionicStorm.enabled = true;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[1];
    },
  },
  DevelopHallucination: {
    name: 'DevelopHallucination',
    cost: {
      mine: 150,
      gas: 150,
      time: 800,
    },
    effect: function () {
      Magic.Hallucination.enabled = true;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[2];
    },
  },
  DevelopKhaydarinAmulet: {
    name: 'DevelopKhaydarinAmulet',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Templar.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[3];
    },
  },
  DevelopMindControl: {
    name: 'DevelopMindControl',
    cost: {
      mine: 200,
      gas: 200,
      time: 1200,
    },
    effect: function () {
      Magic.MindControl.enabled = true;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[4];
    },
  },
  DevelopMaelStorm: {
    name: 'DevelopMaelStorm',
    cost: {
      mine: 100,
      gas: 100,
      time: 1000,
    },
    effect: function () {
      Magic.MaelStorm.enabled = true;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[5];
    },
  },
  DevelopArgusTalisman: {
    name: 'DevelopArgusTalisman',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.DarkArchon.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ProtossBuilding.TemplarArchives.prototype.items[6];
    },
  },
  DevelopGraviticBooster: {
    name: 'DevelopGraviticBooster',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Protoss.Observer.prototype.speed[Number(Boolean(isEnemy))] =
        Unit.getSpeedMatrixBy(12);
      delete BuildingStore.ProtossBuilding.Observatory.prototype.items[1];
    },
  },
  DevelopSensorArray: {
    name: 'DevelopSensorArray',
    cost: {
      mine: 150,
      gas: 150,
      time: 1330,
    },
    effect: function (isEnemy) {
      Protoss.Observer.prototype.sight[Number(Boolean(isEnemy))] = 385;
      delete BuildingStore.ProtossBuilding.Observatory.prototype.items[2];
    },
  },
  DevelopRecall: {
    name: 'DevelopRecall',
    cost: {
      mine: 150,
      gas: 150,
      time: 1200,
    },
    effect: function () {
      Magic.Recall.enabled = true;
      delete BuildingStore.ProtossBuilding.ArbiterTribunal.prototype.items[1];
    },
  },
  DevelopStasisField: {
    name: 'DevelopStasisField',
    cost: {
      mine: 150,
      gas: 150,
      time: 1000,
    },
    effect: function () {
      Magic.StasisField.enabled = true;
      delete BuildingStore.ProtossBuilding.ArbiterTribunal.prototype.items[2];
    },
  },
  DevelopKhaydarinCore: {
    name: 'DevelopKhaydarinCore',
    cost: {
      mine: 150,
      gas: 150,
      time: 1660,
    },
    effect: function (isEnemy) {
      Protoss.Arbiter.prototype.MP[Number(Boolean(isEnemy))] = 250;
      delete BuildingStore.ProtossBuilding.ArbiterTribunal.prototype.items[3];
    },
  },
};

export default Upgrade;
