import useImage from '../hooks/useImage'
import { Image, Group, Rect, Circle } from 'react-konva'
import { PLANT_TYPES } from '../constants/plantTypes'

function Plant({ plant, gridSize }) {
  const [peashooterImage] = useImage('/images/applied/plants1.gif') // 豌豆射手
  const [iceshooterImage] = useImage('/images/applied/plants2.gif') // 寒冰射手
  const [sunflowerImage] = useImage('/images/applied/sunflower1.gif')
  const [wallnutImage] = useImage('/images/applied/nut.gif')
  const [lotusLeafImage] = useImage('/images/applied/lotus_leaf.png') // 荷叶

  // 获取植物信息
  const plantInfo = PLANT_TYPES[plant.type] || PLANT_TYPES.peashooter

  const getPlantImage = () => {
    switch (plant.type) {
      case 'peashooter':
        return peashooterImage // plants1.gif 是豌豆射手
      case 'iceshooter':
        return iceshooterImage // plants2.gif 是寒冰射手
      case 'sunflower':
        return sunflowerImage
      case 'wallnut':
        return wallnutImage
      case 'lotusleaf':
        return lotusLeafImage // 荷叶
      default:
        return peashooterImage
    }
  }

  const getPlantColor = () => {
    switch (plant.type) {
      case 'peashooter':
        return '#4a7c3a'
      case 'sunflower':
        return '#ffd700'
      case 'wallnut':
        return '#8b4513'
      case 'lotusleaf':
        return '#4a7c3a' // 荷叶颜色
      default:
        return '#4a7c3a'
    }
  }

  const toolbarHeight = 100
  const x = plant.col * gridSize + gridSize / 2 // 无10 padding，匹配宽度
  const baseY = toolbarHeight + plant.row * gridSize + gridSize / 2
  // 荷叶稍微下移，让它显示在其他植物背后
  const y = plant.type === 'lotusleaf' ? baseY + gridSize * 0.25 : baseY

  // 使用统一的植物类型定义获取最大生命值
  const maxHealth = plantInfo.health
  const healthPercent = plant.health / maxHealth

  return (
    <Group x={x} y={y} listening={false}>
      {/* 植物图片 */}
      {getPlantImage() && (
        <Image
          image={getPlantImage()}
          width={gridSize * 0.7} // 缩小避免溢出
          height={gridSize * 0.7}
          offsetX={gridSize * 0.35}
          offsetY={plant.type === 'lotusleaf' ? gridSize * 0.5 : gridSize * 0.45} // 荷叶稍微下移
        />
      )}

      {/* 植物占位符（如果图片未加载） */}
      {!getPlantImage() && (
        <Circle
          radius={gridSize * 0.3} // 缩小
          fill={getPlantColor()}
        />
      )}

      {/* 健康条 - 下移健康条 */}
      <Group y={gridSize * 0.45}>
        <Rect
          width={gridSize * 0.7}
          height={4}
          fill="#333"
          offsetX={gridSize * 0.35}
        />
        <Rect
          width={gridSize * 0.7 * healthPercent}
          height={4}
          fill={healthPercent > 0.5 ? '#4caf50' : healthPercent > 0.25 ? '#ff9800' : '#f44336'}
          offsetX={gridSize * 0.35}
        />
      </Group>
    </Group>
  )
}

export default Plant