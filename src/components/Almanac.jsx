import { useState } from 'react'
import useImage from '../hooks/useImage'
import { Image, Group, Rect, Text } from 'react-konva'
import { Stage, Layer } from 'react-konva'
import { PLANT_TYPES_ARRAY } from '../constants/plantTypes'

function Almanac({ onClose }) {
  const [bgImage] = useImage('/images/小部分组件/公告.jpg')
  const [frameImage] = useImage('/images/小部分组件/关卡.png')
  const [plantImage] = useImage('/images/小部分组件/介绍植物.png')
  const [zombieImage] = useImage('/images/小部分组件/介绍僵尸.png')
  const [closeButtonImage] = useImage('/images/小部分组件/返回.png')

  const width = 800
  const height = 600

  const [activeTab, setActiveTab] = useState('plants') // 'plants' or 'zombies'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: width,
          height: height,
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Stage width={width} height={height}>
          <Layer>
            {/* 背景 */}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#f5e6d3"
              cornerRadius={10}
            />

            {/* 边框装饰 */}
            {frameImage && (
              <Image
                image={frameImage}
                x={0}
                y={0}
                width={width}
                height={height}
                opacity={0.3}
              />
            )}

            {/* 标题 */}
            <Text
              text="Almanac"
              x={width / 2}
              y={30}
              fontSize={48}
              fontStyle="bold"
              fill="#4a7c3a"
              align="center"
              offsetX={120}
            />

            {/* 标签页 */}
            <Group y={100}>
              <Group
                x={width / 2 - 150}
                onClick={() => setActiveTab('plants')}
                onTap={() => setActiveTab('plants')}
                onMouseEnter={(e) => {
                  e.target.getStage().container().style.cursor = 'pointer'
                }}
                onMouseLeave={(e) => {
                  e.target.getStage().container().style.cursor = 'default'
                }}
              >
                <Rect
                  width={120}
                  height={40}
                  fill={activeTab === 'plants' ? '#8bc34a' : '#ccc'}
                  cornerRadius={5}
                />
                <Text
                  text="Plants"
                  x={60}
                  y={20}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={35}
                />
              </Group>

              <Group
                x={width / 2 + 30}
                onClick={() => setActiveTab('zombies')}
                onTap={() => setActiveTab('zombies')}
                onMouseEnter={(e) => {
                  e.target.getStage().container().style.cursor = 'pointer'
                }}
                onMouseLeave={(e) => {
                  e.target.getStage().container().style.cursor = 'default'
                }}
              >
                <Rect
                  width={120}
                  height={40}
                  fill={activeTab === 'zombies' ? '#8bc34a' : '#ccc'}
                  cornerRadius={5}
                />
                <Text
                  text="Zombies"
                  x={60}
                  y={20}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={40}
                />
              </Group>
            </Group>

            {/* 内容区域 */}
            <Group y={160}>
              {activeTab === 'plants' && (
                <Group>
                  {plantImage && (
                    <Image
                      image={plantImage}
                      x={width / 2 - 200}
                      y={50}
                      width={400}
                      height={300}
                    />
                  )}

                  {/* 动态显示所有植物信息 */}
                  {PLANT_TYPES_ARRAY.map((plantInfo, index) => {
                    const baseY = 350 + index * 90
                    return (
                      <Group key={plantInfo.type}>
                        <Text
                          text={`${plantInfo.name} - Cost: ${plantInfo.cost}`}
                          x={width / 2}
                          y={baseY}
                          fontSize={24}
                          fill="#4a7c3a"
                          align="center"
                          offsetX={100}
                        />
                        <Text
                          text={plantInfo.description}
                          x={width / 2}
                          y={baseY + 30}
                          fontSize={18}
                          fill="#666"
                          align="center"
                          offsetX={plantInfo.description.length * 5}
                        />
                        {plantInfo.type === 'peashooter' && (
                          <Text
                            text={`Damage: ${plantInfo.damage}`}
                            x={width / 2}
                            y={baseY + 55}
                            fontSize={16}
                            fill="#888"
                            align="center"
                            offsetX={50}
                          />
                        )}
                        {plantInfo.type === 'wallnut' && (
                          <Text
                            text={`Health: ${plantInfo.health}`}
                            x={width / 2}
                            y={baseY + 55}
                            fontSize={16}
                            fill="#888"
                            align="center"
                            offsetX={50}
                          />
                        )}
                      </Group>
                    )
                  })}
                </Group>
              )}

              {activeTab === 'zombies' && (
                <Group>
                  {zombieImage && (
                    <Image
                      image={zombieImage}
                      x={width / 2 - 200}
                      y={50}
                      width={400}
                      height={300}
                    />
                  )}

                  <Text
                    text="Normal Zombie"
                    x={width / 2}
                    y={370}
                    fontSize={24}
                    fill="#4a7c3a"
                    align="center"
                    offsetX={80}
                  />
                  <Text
                    text="Basic zombie enemy"
                    x={width / 2}
                    y={400}
                    fontSize={18}
                    fill="#666"
                    align="center"
                    offsetX={80}
                  />

                  <Text
                    text="Cone Zombie"
                    x={width / 2}
                    y={450}
                    fontSize={24}
                    fill="#4a7c3a"
                    align="center"
                    offsetX={80}
                  />
                  <Text
                    text="Zombie with extra health"
                    x={width / 2}
                    y={480}
                    fontSize={18}
                    fill="#666"
                    align="center"
                    offsetX={100}
                  />
                </Group>
              )}
            </Group>

            {/* 关闭按钮 */}
            <Group
              x={width - 60}
              y={20}
              onClick={onClose}
              onTap={onClose}
              onMouseEnter={(e) => {
                e.target.getStage().container().style.cursor = 'pointer'
                e.target.scale({ x: 1.1, y: 1.1 })
              }}
              onMouseLeave={(e) => {
                e.target.getStage().container().style.cursor = 'default'
                e.target.scale({ x: 1, y: 1 })
              }}
            >
              <Rect
                width={40}
                height={40}
                fill="#f44336"
                cornerRadius={20}
              />
              <Text
                text="×"
                x={20}
                y={20}
                fontSize={32}
                fontStyle="bold"
                fill="#fff"
                align="center"
                offsetX={8}
              />
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Almanac

