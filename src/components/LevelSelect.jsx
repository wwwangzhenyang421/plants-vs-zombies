import useImage from '../hooks/useImage'
import { Image, Group, Text, Rect } from 'react-konva'

function LevelSelect({ onSelectLevel, onBack }) {
  const [bgImage] = useImage('/images/applied/cover.jpg')
  const [buttonImage] = useImage('/images/applied/botton.png')

  const width = 900
  const height = 600

  const levels = [
    { id: 1, name: 'Level 1', description: 'Easy - 1 Row', rows: 1, initialSun: 200 },
    { id: 2, name: 'Level 2', description: 'Medium - 3 Rows', rows: 3, initialSun: 200 },
    { id: 3, name: 'Level 3', description: 'Hard - 5 Rows', rows: 5, initialSun: 500 }
  ]

  return (
    <Group>
      {/* 背景 */}
      {bgImage ? (
        <Image
          image={bgImage}
          x={0}
          y={0}
          width={width}
          height={height}
        />
      ) : (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#87CEEB"
        />
      )}

      {/* 半透明遮罩 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#000"
        opacity={0.4}
      />

      {/* 标题 - 参考原版主菜单风格 */}
      <Group x={width / 2} y={60}>
        <Text
          text="MAIN MENU"
          x={0}
          y={0}
          fontSize={48}
          fontStyle="bold"
          fill="#4a7c3a"
          align="center"
          offsetX={120}
          shadowColor="#000"
          shadowBlur={10}
          shadowOffset={{ x: 2, y: 2 }}
        />
        <Text
          text="Select Your Level"
          x={0}
          y={50}
          fontSize={24}
          fill="#ffd700"
          align="center"
          offsetX={100}
          shadowColor="#000"
          shadowBlur={5}
        />
      </Group>

      {/* 关卡按钮 - 参考原版设计，使用卡片式布局 */}
      {levels.map((level, index) => {
        // 参考原版：Level 1在右上，Level 2在中间，Level 3在右下
        const positions = [
          { x: width / 2 + 80, y: 150 }, // Level 1 右上
          { x: width / 2 - 150, y: 250 }, // Level 2 中间
          { x: width / 2 - 150, y: 400 }  // Level 3 左下
        ]
        const pos = positions[index]
        const sizes = [
          { w: 260, h: 180 }, // Level 1 较大
          { w: 300, h: 120 }, // Level 2 中等
          { w: 300, h: 100 }  // Level 3 较小
        ]
        const size = sizes[index]
        
        return (
          <Group
            key={level.id}
            x={pos.x}
            y={pos.y}
            onClick={() => onSelectLevel(level)}
            onTap={() => onSelectLevel(level)}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) {
                stage.container().style.cursor = 'pointer'
              }
              // 参考原版：hover时放大
              e.target.scale({ x: 1.15, y: 1.15 })
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) {
                stage.container().style.cursor = 'default'
              }
              e.target.scale({ x: 1, y: 1 })
            }}
          >
            {buttonImage ? (
              <Image
                image={buttonImage}
                width={size.w}
                height={size.h}
              />
            ) : (
              <Rect
                width={size.w}
                height={size.h}
                fill={index === 0 ? '#4caf50' : index === 1 ? '#ff9800' : '#f44336'}
                cornerRadius={12}
                shadowBlur={15}
                shadowColor="#000"
              />
            )}
            <Text
              text={level.name}
              x={size.w / 2}
              y={size.h / 2 - 20}
              fontSize={index === 0 ? 40 : 36}
              fontStyle="bold"
              fill="#fff"
              align="center"
              offsetX={index === 0 ? 60 : 70}
              shadowColor="#000"
              shadowBlur={5}
            />
            <Text
              text={level.description}
              x={size.w / 2}
              y={size.h / 2 + 15}
              fontSize={16}
              fill="#fff"
              align="center"
              offsetX={index === 0 ? 90 : 100}
              shadowColor="#000"
              shadowBlur={3}
            />
          </Group>
        )
      })}

      {/* 返回按钮 */}
      <Group
        x={width / 2 - 100}
        y={height - 80}
        onClick={onBack}
        onTap={onBack}
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
        {buttonImage ? (
          <Image
            image={buttonImage}
            width={200}
            height={60}
          />
        ) : (
          <Rect
            width={200}
            height={60}
            fill="#666"
            cornerRadius={10}
          />
        )}
        <Text
          text="Back"
          x={100}
          y={30}
          fontSize={28}
          fontStyle="bold"
          fill="#fff"
          align="center"
          offsetX={40}
        />
      </Group>
    </Group>
  )
}

export default LevelSelect

