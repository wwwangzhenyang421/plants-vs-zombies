// 统一的植物类型定义
export const PLANT_TYPES = {
  peashooter: {
    type: 'peashooter',
    name: 'Peashooter',
    cost: 100,
    damage: 20,
    health: 100,
    cooldown: 0,
    range: Infinity,
    description: 'Shoots peas at zombies',
    projectileType: 'pea' // 豌豆
  },
  iceshooter: {
    type: 'iceshooter',
    name: 'Ice Shooter',
    cost: 175,
    damage: 30,
    health: 100,
    cooldown: 0,
    range: Infinity,
    description: 'Shoots ice peas at zombies',
    projectileType: 'icepea' // 寒冰豌豆
  },
  sunflower: {
    type: 'sunflower',
    name: 'Sunflower',
    cost: 50,
    health: 100,
    sunProduction: 25,
    interval: 24000, // 24秒产生一次阳光
    cooldown: 0,
    description: 'Produces sunlight'
  },
  wallnut: {
    type: 'wallnut',
    name: 'Wall-nut',
    cost: 50,
    health: 1000, 
    cooldown: 0,
    description: 'High health barrier'
  },
  lotusleaf: {
    type: 'lotusleaf',
    name: 'Lotus Leaf',
    cost: 25,
    health: 50,
    cooldown: 0,
    description: 'Can only be placed on water. Other plants can be placed on it.'
  }
}

// 植物类型数组（用于UI显示）
export const PLANT_TYPES_ARRAY = Object.values(PLANT_TYPES)

