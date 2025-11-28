import { useState, useEffect } from 'react'
import useImage from '../hooks/useImage'
import { Image, Group, Rect, Text, Circle, Line } from 'react-konva'
import Plant from './Plant'
import Zombie from './Zombie'
import Projectile from './Projectile'
import { PLANT_TYPES_ARRAY } from '../constants/plantTypes'

function GameBoard({
  gridSize,
  gridCols,
  gridRows,
  sunlight,
  selectedPlant,
  onSelectPlant,
  onPlacePlant,
  plants,
  zombies,
  projectiles,
  sunDrops,
  onCollectSun,
  wave,
  maxWaves,
  currentLevel,
  isPaused,
  onPause,
  onBackToMenu,
  onOpenAlmanac,
  showNotice = false,
  showZombieComing = false,
  onCloseNotice
}) {
  const canvasWidth = 900
  const canvasHeight = 600
  const toolbarHeight = 100
  const calculatedGridSize = (canvasHeight - toolbarHeight) / gridRows // 100 for rows=5
  const finalGridSize = gridSize || calculatedGridSize

  const elementHeight = toolbarHeight * 0.6 // 减小到60%避免堆叠
  const elementMargin = (toolbarHeight - elementHeight) / 2
  const elementWidth = elementHeight * 1.2 // 稍宽，避免挤压
  const buttonSize = 50 // 独立按钮大小，圆形小点

  const [sandImage] = useImage('/images/applied/sand.jpg')
  const [poolImage] = useImage('/images/applied/pool.jpg')
  const [sunImage] = useImage('/images/applied/sunshine.gif')
  const [sunCountImage] = useImage('/images/applied/sun_count.png')
  const [topblankImage] = useImage('/images/applied/topblank.png')
  const [sunshineImage] = useImage('/images/applied/sunshine.gif')
  const [noticeDaytimeImage] = useImage('/images/applied/notice_daytime.png')
  const [noticePoolImage] = useImage('/images/applied/notice_pool.png')
  const [zombieComingImage] = useImage('/images/applied/zoombie_coming.png')
  
  // 根据关卡选择告示图片
  const noticeImage = currentLevel === 2 ? noticePoolImage : noticeDaytimeImage
  
  // 获取僵尸接近提示图片的原始尺寸，保持宽高比
  const [zombieComingSize, setZombieComingSize] = useState({ width: 400, height: 100 })
  
  useEffect(() => {
    if (zombieComingImage) {
      // zombieComingImage 是标准的 Image 对象，可以直接获取宽高
      const originalWidth = zombieComingImage.width || 400
      const originalHeight = zombieComingImage.height || 100
      const aspectRatio = originalWidth / originalHeight
      // 设置宽度为400，根据原始宽高比计算高度
      const displayWidth = 400
      const displayHeight = displayWidth / aspectRatio
      setZombieComingSize({ width: displayWidth, height: displayHeight })
    }
  }, [zombieComingImage])
  
  // 植物图片
  const [peashooterImage] = useImage('/images/applied/plants1.gif')
  const [iceshooterImage] = useImage('/images/applied/plants2.gif')
  const [sunflowerImage] = useImage('/images/applied/sunflower1.gif')
  const [wallnutImage] = useImage('/images/applied/nut.gif')
  const [lotusLeafImage] = useImage('/images/applied/lotus_leaf.png')

  // 获取植物图片
  const getPlantCardImage = (plantType) => {
    switch (plantType) {
      case 'peashooter':
        return peashooterImage
      case 'iceshooter':
        return iceshooterImage
      case 'sunflower':
        return sunflowerImage
      case 'wallnut':
        return wallnutImage
      case 'lotusleaf':
        return lotusLeafImage
      default:
        return null
    }
  }

  // 使用统一的植物类型定义
  const plantTypes = PLANT_TYPES_ARRAY

  const handleCellClick = (row, col) => {
    if (!selectedPlant) return
    
    const plantInfo = plantTypes.find(p => p.type === selectedPlant)
    if (!plantInfo) return
    
    if (sunlight >= plantInfo.cost) {
      onPlacePlant(row, col, selectedPlant)
    }
  }

  return (
    <Group>
      {/* 每一行使用不同的背景 - sand.jpg和pool.jpg交替 */}
      {Array.from({ length: gridRows }).map((_, row) => {
        const usePool = currentLevel === 2 && row >= Math.floor((gridRows - 3) / 2) && row < Math.floor((gridRows - 3) / 2) + 3
        const bgImage = usePool ? poolImage : sandImage
        
        return (
          <Group key={`bg-${row}`}>
            {bgImage && (
              <Image
                image={bgImage}
                x={0}
                y={toolbarHeight + row * finalGridSize}
                width={canvasWidth}
                height={finalGridSize}
              />
            )}
            {!bgImage && (
              <Rect
                x={0}
                y={toolbarHeight + row * finalGridSize}
                width={canvasWidth}
                height={finalGridSize}
                fill={usePool ? '#2196f3' : '#8bc34a'}
              />
            )}
          </Group>
        )
      })}

      {/* 植物 - 先渲染荷叶（底层），再渲染其他植物（上层） */}
      {plants
        .filter(p => p.type === 'lotusleaf')
        .map(plant => (
          <Plant
            key={plant.id}
            plant={plant}
            gridSize={finalGridSize}
          />
        ))}
      {plants
        .filter(p => p.type !== 'lotusleaf')
        .map(plant => (
          <Plant
            key={plant.id}
            plant={plant}
            gridSize={finalGridSize}
          />
        ))}

      {/* 僵尸 */}
      {zombies.map(zombie => (
        <Zombie
          key={zombie.id}
          zombie={zombie}
          gridSize={finalGridSize}
        />
      ))}

      {/* 子弹 */}
      {projectiles.map(projectile => (
        <Projectile
          key={projectile.id}
          projectile={projectile}
          gridSize={finalGridSize}
        />
      ))}

      {/* 网格 - 放在植物、僵尸、子弹之后，但在太阳之前 */}
      {Array.from({ length: gridRows }).map((_, row) =>
        Array.from({ length: gridCols }).map((_, col) => {
          const cellX = col * finalGridSize
          const cellY = toolbarHeight + row * finalGridSize
          // 检查这个位置是否已有植物（区分荷叶和其他植物）
          // 如果只有荷叶，其他植物可以放置；如果有其他植物，不能放置
          const plantsAtCell = plants.filter(p => p.row === row && p.col === col)
          const hasOtherPlant = plantsAtCell.some(p => p.type !== 'lotusleaf')
          const hasLotusLeaf = plantsAtCell.some(p => p.type === 'lotusleaf')
          // 如果选中的是荷叶，检查是否有任何植物；如果选中的是其他植物，只检查是否有其他植物（不包括荷叶）
          const isLotusLeafSelected = selectedPlant === 'lotusleaf'
          const hasPlant = isLotusLeafSelected 
            ? plantsAtCell.length > 0  // 荷叶不能放在任何植物上
            : hasOtherPlant  // 其他植物不能放在其他植物上（但可以放在荷叶上）
          
          return (
            <Group key={`grid-${row}-${col}`} listening={!hasPlant}>
              <Rect
                x={cellX}
                y={cellY}
                width={finalGridSize}
                height={finalGridSize}
                stroke={selectedPlant && !hasPlant ? '#4a7c3a' : 'transparent'}
                strokeWidth={2}
                fill={selectedPlant && !hasPlant ? 'rgba(74, 124, 58, 0.1)' : 'transparent'}
                listening={!hasPlant}
                onClick={(e) => {
                  e.cancelBubble = true
                  if (!hasPlant) {
                    handleCellClick(row, col)
                  }
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  if (!hasPlant) {
                    handleCellClick(row, col)
                  }
                }}
                onMouseEnter={(e) => {
                  if (!selectedPlant || hasPlant) return
                  e.target.stroke('#4a7c3a')
                  e.target.fill('rgba(74, 124, 58, 0.2)')
                  const stage = e.target.getStage()
                  if (stage) {
                    stage.container().style.cursor = 'pointer'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedPlant || hasPlant) return
                  e.target.stroke('transparent')
                  e.target.fill('transparent')
                  const stage = e.target.getStage()
                  if (stage) {
                    stage.container().style.cursor = 'default'
                  }
                }}
              />
            </Group>
          )
        })
      )}

      {/* 可点击的阳光掉落物 - 放在最上层，确保可以被点击 */}
      {sunDrops.map(sun => (
        <Group
          key={sun.id}
          x={sun.x}
          y={toolbarHeight + sun.y}
          listening={true}
          onClick={(e) => {
            e.cancelBubble = true
            onCollectSun(sun.id)
          }}
          onTap={(e) => {
            e.cancelBubble = true
            onCollectSun(sun.id)
          }}
          onMouseEnter={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'pointer'
            }
            e.target.scale({ x: 1.2, y: 1.2 })
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'default'
            }
            e.target.scale({ x: 1, y: 1 })
          }}
        >
          {/* 更大的透明点击区域，确保可以点击 */}
          <Circle
            radius={25}
            fill="transparent"
            listening={true}
          />
          {/* 太阳图片或圆形 */}
          {sunImage ? (
            <Image
              image={sunImage}
              width={30}
              height={30}
              offsetX={15}
              offsetY={15}
              listening={true}
            />
          ) : (
            <Circle
              radius={15}
              fill="#ffd700"
              stroke="#ffaa00"
              strokeWidth={2}
              listening={true}
            />
          )}
        </Group>
      ))}

      {/* 顶部工具栏 - 使用topblank.png作为背景 */}
      {topblankImage ? (
        <Image
          image={topblankImage}
          x={0}
          y={0}
          width={canvasWidth}
          height={toolbarHeight}
        />
      ) : (
        <Rect
          x={0}
          y={0}
          width={canvasWidth}
          height={toolbarHeight}
          fill="#4a7c3a"
          opacity={0.9}
        />
      )}

      {/* 最左边：sunshine和阳光数值，统一高度60% */}
      <Group x={20} y={elementMargin}>
        {/* sunshine.gif */}
        {sunshineImage && (
          <Image
            image={sunshineImage}
            width={elementWidth}
            height={elementHeight}
          />
        )}
        
        {/* 阳光数值显示在sunshine正下方 */}
        <Text
          text={sunlight}
          x={elementWidth / 2}
          y={elementHeight + 5}
          fontSize={16}
          fontStyle="bold"
          fill="#ffd700"
          align="center"
          offsetX={elementWidth / 4}
          offsetY={8}
          shadowColor="#000"
          shadowBlur={3}
        />
      </Group>

      {/* 植物选择 - 放在顶部栏topblank里面，横向排列，使用gif图片，和sunshine一样高度 */}
      <Group x={120} y={elementMargin} listening={true}>
        {plantTypes.map((plantType, index) => {
          const canAfford = sunlight >= plantType.cost
          const isSelected = selectedPlant === plantType.type
          const plantCardSize = elementHeight // 和sunshine一样高
          const plantImage = getPlantCardImage(plantType.type)
          
          return (
            <Group
              key={plantType.type}
              x={index * (plantCardSize + 15)}
              listening={true}
              onClick={(e) => {
                e.cancelBubble = true
                if (canAfford) {
                  onSelectPlant(isSelected ? null : plantType.type)
                }
              }}
              onTap={(e) => {
                e.cancelBubble = true
                if (canAfford) {
                  onSelectPlant(isSelected ? null : plantType.type)
                }
              }}
              onMouseEnter={(e) => {
                if (canAfford) {
                  const stage = e.target.getStage()
                  if (stage) {
                    stage.container().style.cursor = 'pointer'
                  }
                  e.target.scale({ x: 1.1, y: 1.1 })
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'default'
                }
                e.target.scale({ x: 1, y: 1 })
              }}
            >
              <Group>
                {/* 植物gif图片 - 直接使用，不要背景框 */}
                {plantImage && (
                  <Image
                    image={plantImage}
                    width={plantCardSize}
                    height={plantCardSize}
                    opacity={canAfford ? 1 : 0.5}
                  />
                )}
                
                {/* 选中状态边框 */}
                {isSelected && (
                  <Rect
                    width={plantCardSize}
                    height={plantCardSize}
                    fill="transparent"
                    stroke="#ff6b00"
                    strokeWidth={3}
                    shadowBlur={10}
                    shadowColor="#000"
                  />
                )}
                
                {/* 价格显示 - 正下方 */}
                <Text
                  text={plantType.cost}
                  x={plantCardSize / 2}
                  y={plantCardSize + 5}
                  fontSize={12}
                  fontStyle="bold"
                  fill={canAfford ? '#ffd700' : '#999'}
                  align="center"
                  offsetX={plantCardSize / 4}
                  offsetY={6}
                  listening={false}
                  shadowColor="#000"
                  shadowBlur={2}
                />
              </Group>
            </Group>
          )
        })}
      </Group>

      {/* 右侧按钮区域 - 两个自定义按钮：暂停/继续、返回主菜单，美化成小圆按钮 */}
      <Group x={canvasWidth - (buttonSize * 2 + 30)} y={toolbarHeight - buttonSize - 5}>
        {/* 暂停/继续按钮 */}
        <Group
          x={0}
          listening={true}
          onClick={(e) => {
            e.cancelBubble = true
            onPause && onPause()
          }}
          onTap={(e) => {
            e.cancelBubble = true
            onPause && onPause()
          }}
          onMouseEnter={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'pointer'
            }
            e.target.scale({ x: 1.1, y: 1.1 })
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'default'
            }
            e.target.scale({ x: 1, y: 1 })
          }}
        >
          <Circle
            radius={buttonSize / 2}
            fill="#4a7c3a"
            stroke="#2d5016"
            strokeWidth={2}
            shadowBlur={5}
            shadowColor="#000"
            shadowOpacity={0.3}
          />
          <Text
            text={isPaused ? '▶' : '⏸'}
            x={0}
            y={0}
            fontSize={24}
            fill="#fff"
            align="center"
            offsetX={12}
            offsetY={12}
          />
        </Group>

        {/* 返回主菜单按钮 */}
        <Group
          x={buttonSize + 20}
          listening={true}
          onClick={(e) => {
            e.cancelBubble = true
            onBackToMenu && onBackToMenu()
          }}
          onTap={(e) => {
            e.cancelBubble = true
            onBackToMenu && onBackToMenu()
          }}
          onMouseEnter={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'pointer'
            }
            e.target.scale({ x: 1.1, y: 1.1 })
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'default'
            }
            e.target.scale({ x: 1, y: 1 })
          }}
        >
          <Circle
            radius={buttonSize / 2}
            fill="#f44336"
            stroke="#d32f2f"
            strokeWidth={2}
            shadowBlur={5}
            shadowColor="#000"
            shadowOpacity={0.3}
          />
          <Text
            text="←"
            x={0}
            y={0}
            fontSize={24}
            fill="#fff"
            align="center"
            offsetX={12}
            offsetY={12}
          />
        </Group>
      </Group>


      {/* 暂停遮罩 - 可点击继续 */}
      {isPaused && (
        <Group
          listening={true}
          onClick={(e) => {
            e.cancelBubble = true
            onPause && onPause()
          }}
          onTap={(e) => {
            e.cancelBubble = true
            onPause && onPause()
          }}
        >
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="#000"
            opacity={0.7}
            listening={true}
          />
          <Text
            text="PAUSED - Click to Resume"
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            fontSize={48}
            fontStyle="bold"
            fill="#fff"
            align="center"
            offsetX={canvasWidth / 3}
            offsetY={24}
            shadowColor="#000"
            shadowBlur={10}
            listening={true}
          />
        </Group>
      )}

      {/* 游戏开始提示 - notice_daytime.png，可点击关闭或5秒后自动关闭 */}
      {showNotice && noticeImage && (
        <Group
          listening={true}
          onClick={(e) => {
            e.cancelBubble = true
            onCloseNotice && onCloseNotice()
          }}
          onTap={(e) => {
            e.cancelBubble = true
            onCloseNotice && onCloseNotice()
          }}
        >
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="#000"
            opacity={0.5}
            listening={true}
          />
          <Image
            image={noticeImage}
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            width={600}
            height={400}
            offsetX={300}
            offsetY={200}
            listening={true}
          />
        </Group>
      )}

      {/* 僵尸接近提示 - zoombie_coming.png，显示在blank下方，保持原始宽高比 */}
      {showZombieComing && zombieComingImage && (
        <Group>
          <Image
            image={zombieComingImage}
            x={canvasWidth / 2}
            y={toolbarHeight + 20}
            width={zombieComingSize.width}
            height={zombieComingSize.height}
            offsetX={zombieComingSize.width / 2}
            offsetY={zombieComingSize.height / 2}
          />
        </Group>
      )}
    </Group>
  )
}

export default GameBoard