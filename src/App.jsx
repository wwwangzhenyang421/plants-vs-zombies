import { useState, useEffect, useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import StartScreen from './components/StartScreen'
import LevelSelect from './components/LevelSelect'
import GameBoard from './components/GameBoard'
import GameOver from './components/GameOver'
import Almanac from './components/Almanac'
import HelpScreen from './components/HelpScreen'
import { PLANT_TYPES } from './constants/plantTypes'

const GRID_SIZE = 80
const GRID_COLS = 9
const MAX_GRID_ROWS = 5

function App() {
  const [gameState, setGameState] = useState('start') // start, levelSelect, playing, paused, win, lose, levelComplete
  const [currentLevel, setCurrentLevel] = useState(1) // 当前关卡 1-3
  const [gridRows, setGridRows] = useState(5) // 当前关卡的行数
  const [sunlight, setSunlight] = useState(200)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [plants, setPlants] = useState([])
  const [zombies, setZombies] = useState([])
  const [projectiles, setProjectiles] = useState([])
  const [sunDrops, setSunDrops] = useState([]) // 可点击的阳光掉落物
  const [wave, setWave] = useState(1)
  const [showAlmanac, setShowAlmanac] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showNotice, setShowNotice] = useState(true) // 游戏开始时显示notice
  const [showZombieComing, setShowZombieComing] = useState(false) // 显示僵尸接近提示
  const noticeTimerRef = useRef(null) // 公告自动关闭定时器
  
  const animationFrameRef = useRef(null)
  const lastTimeRef = useRef(Date.now())
  const zombieSpawnTimerRef = useRef(0)
  const sunSpawnTimerRef = useRef(0)
  const zombiesSpawnedThisWaveRef = useRef(0) // 当前波次已生成的僵尸数
  const zombiesKilledThisWaveRef = useRef(0) // 当前波次已消灭的僵尸数
  const maxWaves = 5 // 总波次数
  const projectileIdCounterRef = useRef(0) // 豌豆ID计数器，确保唯一性

  // 僵尸类型定义 - 减慢速度
  const zombieTypes = {
    normal: { health: 200, speed: 0.2, damage: 100 }, // 从0.5减慢到0.2
    cone: { health: 370, speed: 0.2, damage: 100 } // 从0.5减慢到0.2
  }

  // 选择关卡
  const handleSelectLevel = (level) => {
    setCurrentLevel(level.id)
    setGridRows(level.rows)
    setSunlight(level.initialSun)
    setGameState('playing')
    setPlants([])
    setZombies([])
    setProjectiles([])
    setSunDrops([])
    setWave(1)
    setIsPaused(false)
    setShowNotice(true) // 显示notice
    setShowZombieComing(false)
    zombieSpawnTimerRef.current = 0
    sunSpawnTimerRef.current = 0
    zombiesSpawnedThisWaveRef.current = 0
    zombiesKilledThisWaveRef.current = 0
    
    // 清除之前的定时器
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current)
    }
    
    // 5秒后自动关闭notice
    noticeTimerRef.current = setTimeout(() => {
      handleCloseNotice()
    }, 5000)
  }

  // 关闭公告
  const handleCloseNotice = () => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current)
      noticeTimerRef.current = null
    }
    setShowNotice(false)
    // 公告关闭后，显示僵尸接近提示
    setShowZombieComing(true)
    // 2秒后隐藏僵尸接近提示，然后开始生成僵尸
    setTimeout(() => {
      setShowZombieComing(false)
    }, 2000)
  }

  // 开始游戏（直接开始，不再选择难度）
  const handleStartGame = (usePool = false) => {
    setCurrentLevel(usePool ? 2 : 1) // 1=普通模式, 2=池塘模式
    setGridRows(5) // 固定5行
    setSunlight(200)
    setGameState('playing')
    setPlants([])
    setZombies([])
    setProjectiles([])
    setSunDrops([])
    setWave(1)
    setIsPaused(false)
    setShowNotice(true) // 显示notice
    setShowZombieComing(false)
    zombieSpawnTimerRef.current = 0
    sunSpawnTimerRef.current = 0
    zombiesSpawnedThisWaveRef.current = 0
    zombiesKilledThisWaveRef.current = 0
    
    // 清除之前的定时器
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current)
    }
    
    // 5秒后自动关闭notice
    noticeTimerRef.current = setTimeout(() => {
      handleCloseNotice()
    }, 5000)
  }

  // 暂停/继续游戏
  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  // 关卡完成（简化：直接胜利）
  const handleLevelComplete = () => {
    handleGameOver(true)
  }

  // 游戏结束（失败）
  const handleGameOver = (isWin = false) => {
    setGameState(isWin ? 'win' : 'lose')
  }

  // 获取当前波次应该生成的僵尸数量
  const getZombiesPerWave = (waveNum) => {
    return Math.min(5 + waveNum * 2, 15) // 第1波5个，每波+2，最多15个
  }

  // 生成可点击的阳光掉落物
  const spawnSunDrop = (x, y, fromSunflower = false, targetY = undefined, plantRow = undefined) => {
    const plantCardWidth = 80
    // x和y是相对于游戏区域的坐标（不包括plantCardWidth和顶部工具栏）
    // 在GameBoard中渲染时会加上偏移
    const finalX = x !== undefined ? x : Math.random() * (GRID_COLS * GRID_SIZE - 100) + 50
    const finalY = y !== undefined ? y : Math.random() * (gridRows * GRID_SIZE - 100) + 50
    
    // 如果是向日葵产生的，从植物位置开始掉落，必须落到该行的底部（地上）
    // 如果不是，直接出现在随机位置（自然产生的）
    let startY, finalTargetY
    if (fromSunflower) {
      // 向日葵产生的：从植物顶部开始，落到该行的底部
      startY = y !== undefined ? y : 0
      // 如果提供了plantRow，使用它；否则从y计算
      const row = plantRow !== undefined ? plantRow : (y !== undefined ? Math.floor(y / GRID_SIZE) : 0)
      // 目标位置是该行的底部（完全落到地上），确保太阳完全落到地面
      finalTargetY = targetY !== undefined ? targetY : (row + 1) * GRID_SIZE - 20 // 留一点边距，确保在地面上
    } else {
      // 自然产生的：直接出现在随机位置
      startY = finalY
      finalTargetY = finalY
    }
    
    setSunDrops(prev => [...prev, {
      id: Date.now() + Math.random(), // 添加随机数确保唯一性
      x: finalX,
      y: startY, // 当前y位置
      targetY: finalTargetY, // 掉落目标y位置
      value: 25,
      lifetime: 10000, // 10秒后消失
      velocity: fromSunflower ? 2 : 0, // 掉落速度，向日葵产生的有速度（增加到2，让掉落更快）
      isFalling: fromSunflower // 是否正在掉落
    }])
  }

  // 收集阳光
  const collectSun = (sunId) => {
    const sunDrop = sunDrops.find(s => s.id === sunId)
    if (sunDrop) {
      setSunlight(prev => prev + sunDrop.value)
      setSunDrops(prev => prev.filter(s => s.id !== sunId))
    }
  }

  // 检查是否是水池区域
  const isPoolArea = (row) => {
    return currentLevel === 2 && row >= Math.floor((gridRows - 3) / 2) && row < Math.floor((gridRows - 3) / 2) + 3
  }

  // 放置植物
  const handlePlacePlant = (row, col, plantType) => {
    // 确保有选中的植物，且阳光足够，且位置有效
    if (!plantType || !PLANT_TYPES[plantType]) {
      return
    }
    
    const plantInfo = PLANT_TYPES[plantType]
    
    // 检查阳光是否足够
    if (sunlight < plantInfo.cost) {
      return
    }
    
    // 检查位置是否在有效范围内
    if (row < 0 || row >= gridRows || col < 0 || col >= GRID_COLS) {
      return
    }
    
    // 检查位置是否已有植物（区分荷叶和其他植物）
    const existingPlants = plants.filter(p => p.row === row && p.col === col)
    const hasLotusLeaf = existingPlants.some(p => p.type === 'lotusleaf')
    const hasOtherPlant = existingPlants.some(p => p.type !== 'lotusleaf')
    
    // 特殊规则：荷叶只能放在水池区域
    if (plantType === 'lotusleaf') {
      if (!isPoolArea(row)) {
        return // 荷叶只能放在水池区域
      }
      // 荷叶不能放在已有植物的位置（包括其他荷叶或其他植物）
      if (existingPlants.length > 0) {
        return
      }
    } else {
      // 其他植物：如果放在水池区域，必须先有荷叶
      if (isPoolArea(row)) {
        if (!hasLotusLeaf) {
          return // 水池区域必须先放荷叶
        }
        // 如果位置已经有其他植物（非荷叶），不允许放置
        if (hasOtherPlant) {
          return
        }
        // 如果位置只有荷叶，允许放置（与荷叶共存）
      } else {
        // 非水池区域：如果位置已有任何植物，不允许
        if (existingPlants.length > 0) {
          return
        }
      }
    }
    
    // 放置植物（与荷叶共存，不移除荷叶）
    setPlants(prev => [...prev, {
      id: Date.now(),
      type: plantType,
      row,
      col,
      health: plantInfo.health,
      lastShot: 0,
      lastSun: 0
    }])
    
    // 扣除阳光
    setSunlight(prev => prev - plantInfo.cost)
    
    // 取消选择（放置后自动取消）
    setSelectedPlant(null)
  }

  // 使用ref存储最新状态
  const plantsRef = useRef(plants)
  const zombiesRef = useRef(zombies)
  const waveRef = useRef(wave)
  const zombiesSpawnedRef = useRef(0)
  const zombiesKilledRef = useRef(0)
  const pendingZombieUpdatesRef = useRef(new Map()) // 存储待处理的僵尸伤害更新

  useEffect(() => {
    plantsRef.current = plants
  }, [plants])

  useEffect(() => {
    zombiesRef.current = zombies
  }, [zombies])

  useEffect(() => {
    waveRef.current = wave
  }, [wave])

  useEffect(() => {
    zombiesSpawnedRef.current = zombiesSpawnedThisWaveRef.current
  }, [wave])

  useEffect(() => {
    zombiesKilledRef.current = zombiesKilledThisWaveRef.current
  }, [wave])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current)
      }
    }
  }, [])

  // 游戏主循环
  useEffect(() => {
    // 如果还在显示公告或僵尸接近提示，不开始游戏循环
    if (gameState !== 'playing' || isPaused || showNotice || showZombieComing) return
    
    // 重置时间引用
    lastTimeRef.current = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      lastTimeRef.current = now

      // 先收集需要更新的僵尸伤害（在更新位置之前）
      const zombiesToUpdate = new Map() // 存储需要更新的僵尸 {id: damage}
      const projectilesToRemove = new Set() // 存储需要移除的豌豆ID
      
      // 先处理豌豆碰撞，收集伤害信息
      setProjectiles(prevProjectiles => {
        const updatedProjectiles = prevProjectiles.map(projectile => {
          // 检查豌豆是否已经无效（防御性编程）
          if (!projectile || !projectile.id) {
            projectilesToRemove.add(projectile?.id || 'invalid')
            return null
          }

          const newX = projectile.x + 5
          const hitZombie = zombiesRef.current.find(z => 
            z && z.row === projectile.row && 
            z.health > 0 &&
            Math.abs(z.x - newX) < 30
          )
          
          if (hitZombie) {
            // 记录需要更新的僵尸伤害
            const currentDamage = zombiesToUpdate.get(hitZombie.id) || 0
            zombiesToUpdate.set(hitZombie.id, currentDamage + projectile.damage)
            // 标记这个豌豆需要移除
            projectilesToRemove.add(projectile.id)
            return null
          }

          // 检查是否超出边界
          if (newX > GRID_COLS * GRID_SIZE) {
            projectilesToRemove.add(projectile.id)
            return null
          }

          // 正常移动
          return { ...projectile, x: newX }
        }).filter(p => p !== null && p !== undefined) // 过滤掉null和undefined

        // 更新豌豆状态（确保所有需要移除的都被移除）
        return updatedProjectiles.filter(p => p && !projectilesToRemove.has(p.id))
      })

      // 更新僵尸 - 同时处理位置更新和伤害更新
      setZombies(prevZombies => {
        const updatedZombies = prevZombies.map(zombie => {
          // 先应用伤害（如果有）
          let zombieWithDamage = zombie
          const damage = zombiesToUpdate.get(zombie.id)
          if (damage !== undefined && damage > 0) {
            const newHealth = zombie.health - damage
            // 检查是否被击杀
            if (zombie.health > 0 && newHealth <= 0) {
              zombiesKilledThisWaveRef.current += 1
            }
            zombieWithDamage = { ...zombie, health: newHealth }
          }

          // 如果僵尸已经死亡，不再更新位置
          if (zombieWithDamage.health <= 0) {
            return zombieWithDamage
          }

          // 更新位置
          const newX = zombieWithDamage.x - zombieWithDamage.speed * (deltaTime / 16)
          
          // 检查是否到达左边界（游戏失败）
          if (newX < 0) {
            handleGameOver(false) // 失败
            return zombieWithDamage
          }

          // 检查碰撞 - 优先攻击非荷叶植物（上层植物）
          const plantsInPath = plantsRef.current.filter(p => 
            p.row === zombieWithDamage.row && 
            p.col * GRID_SIZE <= newX + 40 && 
            (p.col + 1) * GRID_SIZE >= newX
          )
          // 优先攻击非荷叶植物，如果没有则攻击荷叶
          const plantInPath = plantsInPath.find(p => p.type !== 'lotusleaf') || plantsInPath[0]

          if (plantInPath) {
            // 攻击植物
            setPlants(prevPlants => 
              prevPlants.map(p => 
                p.id === plantInPath.id 
                  ? { ...p, health: p.health - zombieTypes[zombieWithDamage.type].damage * (deltaTime / 1000) }
                  : p
              ).filter(p => p.health > 0)
            )
            return zombieWithDamage
          }

          return { ...zombieWithDamage, x: newX }
        })

        return updatedZombies.filter(z => z.health > 0)
      })

      // 更新植物功能：射击、阳光生产
      setPlants(prevPlants => {
        return prevPlants.map(plant => {
          const plantInfo = PLANT_TYPES[plant.type]
          if (!plantInfo) return plant
          
          // 豌豆射手和寒冰射手：射击逻辑
          if (plant.type === 'peashooter' || plant.type === 'iceshooter') {
            // 查找同一行的僵尸（在植物右侧）
            const zombiesInRow = zombiesRef.current.filter(z => 
              z.row === plant.row && 
              z.x > plant.col * GRID_SIZE &&
              z.health > 0
            )
            
            // 如果有僵尸且冷却时间到了，发射子弹
            if (zombiesInRow.length > 0 && now - plant.lastShot > 1500) {
              const targetZombie = zombiesInRow[0]
              // 使用计数器确保ID唯一性，避免React key冲突
              const projectileId = `projectile_${Date.now()}_${++projectileIdCounterRef.current}_${Math.random()}`
              setProjectiles(prev => [...prev, {
                id: projectileId,
                row: plant.row,
                x: plant.col * GRID_SIZE + GRID_SIZE / 2, // 相对位置，会在Projectile组件中加上偏移
                targetX: targetZombie.x,
                damage: plantInfo.damage,
                projectileType: plantInfo.projectileType || 'pea' // 豌豆或寒冰豌豆
              }])
              return { ...plant, lastShot: now }
            }
          } 
          // 向日葵：生产阳光
          else if (plant.type === 'sunflower') {
            if (now - plant.lastSun > plantInfo.interval) {
              // 向日葵生成可点击的阳光掉落物（出现在植物位置，然后完全落到地上）
              // 坐标是相对于游戏区域的（不包括plantCardWidth和顶部工具栏）
              const sunX = plant.col * GRID_SIZE + GRID_SIZE / 2
              const sunY = plant.row * GRID_SIZE // 从植物顶部开始掉落
              // 目标位置是该行的底部（完全落到地上），让太阳可以完全落到地面
              const targetY = (plant.row + 1) * GRID_SIZE - 20 // 该行底部，留一点边距
              spawnSunDrop(sunX, sunY, true, targetY, plant.row) // 标记为向日葵产生的，传递plant.row
              return { ...plant, lastSun: now }
            }
          }
          // 坚果墙：只阻挡，不需要特殊逻辑（碰撞检测已处理）
          
          return plant
        })
      })


      // 生成僵尸 - 波次系统，减慢生成速度
      const zombiesPerWave = getZombiesPerWave(waveRef.current)
      if (zombiesSpawnedThisWaveRef.current < zombiesPerWave) {
        zombieSpawnTimerRef.current += deltaTime
        // 减慢生成速度：从1500-4000ms改为3000-8000ms
        const spawnInterval = Math.max(3000, 8000 - waveRef.current * 500)
        if (zombieSpawnTimerRef.current > spawnInterval) {
          zombieSpawnTimerRef.current = 0
          zombiesSpawnedThisWaveRef.current++
          const row = Math.floor(Math.random() * gridRows)
          // 波次越高，路障僵尸概率越大
          const coneChance = 0.3 + waveRef.current * 0.1
          const zombieType = Math.random() < coneChance ? 'cone' : 'normal'
          setZombies(prev => [...prev, {
            id: Date.now(),
            type: zombieType,
            row,
            x: GRID_COLS * GRID_SIZE + 50, // 相对位置，会在Zombie组件中加上偏移
            health: zombieTypes[zombieType].health,
            maxHealth: zombieTypes[zombieType].health,
            speed: zombieTypes[zombieType].speed
          }])
        }
      }

      // 检查波次完成条件
      if (zombiesSpawnedThisWaveRef.current >= zombiesPerWave && 
          zombiesRef.current.length === 0 && 
          zombiesKilledThisWaveRef.current >= zombiesPerWave) {
        // 当前波次完成
        if (waveRef.current >= maxWaves) {
          // 所有波次完成，关卡完成！
          handleLevelComplete()
        } else {
          // 进入下一波
          setWave(prev => prev + 1)
          zombiesSpawnedThisWaveRef.current = 0
          zombiesKilledThisWaveRef.current = 0
          zombieSpawnTimerRef.current = 0
          // 奖励阳光
          setSunlight(prev => prev + 50)
        }
      }

      // 生成自然阳光掉落物
      sunSpawnTimerRef.current += deltaTime
      if (sunSpawnTimerRef.current > 8000) {
        sunSpawnTimerRef.current = 0
        spawnSunDrop()
      }

      // 更新阳光掉落物（掉落动画和自动消失）
      setSunDrops(prev => {
        return prev.map(sun => {
          // 如果正在掉落，更新y位置
          if (sun.isFalling && sun.velocity > 0) {
            // 使用更快的掉落速度（velocity * deltaTime，而不是除以16）
            const newY = sun.y + sun.velocity * (deltaTime / 10) // 加快掉落速度
            // 如果到达或超过目标位置，停止掉落
            if (newY >= sun.targetY) {
              return {
                ...sun,
                y: sun.targetY,
                velocity: 0,
                isFalling: false
              }
            }
            return {
              ...sun,
              y: newY,
              lifetime: sun.lifetime - deltaTime
            }
          }
          // 已经停止掉落，只更新生命周期
          return {
            ...sun,
            lifetime: sun.lifetime - deltaTime
          }
        }).filter(sun => sun.lifetime > 0)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, isPaused, gridRows, showNotice, showZombieComing])

  // 计算画布尺寸 - 根据游戏状态动态调整
  const getCanvasSize = () => {
    if (gameState === 'start' || gameState === 'levelSelect') {
      return { width: 900, height: 600 } // 启动屏和关卡选择使用统一尺寸
    }
    // 游戏进行中：左侧植物卡片(80) + 间距(10) + 网格(9列*80) + 右侧间距(110)
    const plantCardWidth = 80
    return {
      width: plantCardWidth + 10 + GRID_COLS * GRID_SIZE + 110,
      height: gridRows * GRID_SIZE + 150
    }
  }
  
  const { width: canvasWidth, height: canvasHeight } = getCanvasSize()

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {gameState === 'start' && (
            <StartScreen 
              onStartGame={handleStartGame}
              onShowHelp={() => setShowHelp(true)}
            />
          )}

          {gameState === 'playing' && (
            <GameBoard
              gridSize={GRID_SIZE}
              gridCols={GRID_COLS}
              gridRows={gridRows}
              sunlight={sunlight}
              selectedPlant={selectedPlant}
              onSelectPlant={setSelectedPlant}
              onPlacePlant={handlePlacePlant}
              plants={plants}
              zombies={zombies}
              projectiles={projectiles}
              sunDrops={sunDrops}
              onCollectSun={collectSun}
              wave={wave}
              maxWaves={maxWaves}
              currentLevel={currentLevel}
              isPaused={isPaused}
              onPause={handlePause}
              onBackToMenu={() => setGameState('start')}
              onOpenAlmanac={() => setShowAlmanac(true)}
              showNotice={showNotice}
              showZombieComing={showZombieComing}
              onCloseNotice={handleCloseNotice}
            />
          )}

          {(gameState === 'win' || gameState === 'lose' || gameState === 'levelComplete') && (
            <GameOver 
              isWin={gameState === 'win' || gameState === 'levelComplete'}
              currentLevel={currentLevel}
              wave={wave}
              onRestart={() => {
                setSunlight(200)
                setPlants([])
                setZombies([])
                setProjectiles([])
                setSunDrops([])
                setWave(1)
                setIsPaused(false)
                zombieSpawnTimerRef.current = 0
                sunSpawnTimerRef.current = 0
                zombiesSpawnedThisWaveRef.current = 0
                zombiesKilledThisWaveRef.current = 0
                setGameState('playing')
              }}
              onBackToStart={() => setGameState('start')}
            />
          )}
        </Layer>
      </Stage>

      {showAlmanac && (
        <Almanac onClose={() => setShowAlmanac(false)} />
      )}

      {showHelp && (
        <HelpScreen onClose={() => setShowHelp(false)} />
      )}
    </div>
  )
}

export default App

