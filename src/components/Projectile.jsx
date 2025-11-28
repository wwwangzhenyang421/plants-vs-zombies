import useImage from '../hooks/useImage'
import { Image, Group, Circle } from 'react-konva'

function Projectile({ projectile, gridSize }) {
  const [peaImage] = useImage('/images/applied/plants1_pea.gif') // 豌豆
  const [icepeaImage] = useImage('/images/applied/plants2_pea.gif') // 寒冰豌豆
  
  // 根据projectileType选择对应的豌豆图片
  const projectileImage = projectile.projectileType === 'icepea' ? icepeaImage : peaImage
  
  const toolbarHeight = 100
  const x = 10 + projectile.x
  const y = toolbarHeight + projectile.row * gridSize + gridSize / 2

  return (
    <Group x={x} y={y} listening={false}>
      {projectileImage ? (
        <Image
          image={projectileImage}
          width={gridSize * 0.4}
          height={gridSize * 0.4}
          offsetX={gridSize * 0.2}
          offsetY={gridSize * 0.2}
        />
      ) : (
        <Circle
          radius={gridSize * 0.15}
          fill={projectile.projectileType === 'icepea' ? '#87ceeb' : '#4a7c3a'}
          stroke={projectile.projectileType === 'icepea' ? '#4682b4' : '#2d5016'}
          strokeWidth={2}
        />
      )}
    </Group>
  )
}

export default Projectile

