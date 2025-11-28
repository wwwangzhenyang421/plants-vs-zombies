import useImage from '../hooks/useImage'
import { Image, Group, Rect, Circle } from 'react-konva'

function Zombie({ zombie, gridSize }) {
  // 根据僵尸类型选择不同的图片
  const [normalZombieImage] = useImage('/images/applied/zoombie1_walk.gif')
  const [coneZombieImage] = useImage('/images/applied/zoombie2_walk.gif')
  
  const zombieImage = zombie.type === 'cone' ? coneZombieImage : normalZombieImage

  const toolbarHeight = 100
  const x = 10 + zombie.x
  const y = toolbarHeight + zombie.row * gridSize + gridSize / 2

  const healthPercent = zombie.health / zombie.maxHealth

  return (
    <Group x={x} y={y} listening={false}>
      {/* 僵尸图片 */}
      {zombieImage && (
        <Image
          image={zombieImage}
          width={gridSize * 0.9}
          height={gridSize * 0.9}
          offsetX={gridSize * 0.45}
          offsetY={gridSize * 0.45}
        />
      )}

      {/* 僵尸占位符（如果图片未加载） */}
      {!zombieImage && (
        <Circle
          radius={gridSize * 0.4}
          fill={zombie.type === 'cone' ? '#8b4513' : '#4a7c3a'}
        />
      )}

      {/* 健康条 */}
      <Group y={gridSize * 0.5}>
        <Rect
          width={gridSize * 0.8}
          height={4}
          fill="#333"
          offsetX={gridSize * 0.4}
        />
        <Rect
          width={gridSize * 0.8 * healthPercent}
          height={4}
          fill={healthPercent > 0.5 ? '#f44336' : healthPercent > 0.25 ? '#ff9800' : '#4caf50'}
          offsetX={gridSize * 0.4}
        />
      </Group>

      {/* 路障标识 */}
      {zombie.type === 'cone' && (
        <Rect
          x={-gridSize * 0.3}
          y={-gridSize * 0.4}
          width={gridSize * 0.2}
          height={gridSize * 0.2}
          fill="#8b4513"
          opacity={0.8}
        />
      )}
    </Group>
  )
}

export default Zombie

