import useImage from '../hooks/useImage'
import { Image, Group, Rect, Text, Stage, Layer } from 'react-konva'

function HelpScreen({ onClose }) {
  const [bgImage] = useImage('/images/applied/notice.jpg')
  const [buttonImage] = useImage('/images/applied/botton.png')

  const width = 800
  const height = 600

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
        <Group>
          <Stage width={width} height={height}>
            <Layer>
              {/* 背景 - 使用公告.jpg */}
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
                  fill="#f5e6d3"
                />
              )}

              {/* 标题 */}
              <Text
                text="游戏说明"
                x={width / 2}
                y={34}
                fontSize={36}
                fontStyle="bold"
                fill="#4a7c3a"
                align="center"
                offsetX={90}
                shadowColor="#000"
                shadowBlur={5}
              />

              {/* 操作说明 */}
              <Group x={50} y={105}>
                <Text
                  text="🎮 游戏操作："
                  x={0}
                  y={0}
                  fontSize={24}
                  fontStyle="bold"
                  fill="#2d5016"
                />
                <Text
                  text="1. 点击左侧植物卡片选择植物"
                  x={20}
                  y={40}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="2. 点击网格单元格放置植物"
                  x={20}
                  y={70}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="3. 点击阳光掉落物收集阳光"
                  x={20}
                  y={100}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="4. 植物会自动射击僵尸"
                  x={20}
                  y={130}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="5. 向日葵每24秒产生一次阳光"
                  x={20}
                  y={160}
                  fontSize={18}
                  fill="#333"
                />
              </Group>

              <Group x={50} y={300}>
                <Text
                  text="🌱 植物类型："
                  x={0}
                  y={0}
                  fontSize={24}
                  fontStyle="bold"
                  fill="#2d5016"
                />
                <Text
                  text="• 豌豆射手 (100阳光) - 向僵尸发射豌豆"
                  x={20}
                  y={40}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="• 寒冰射手 (175阳光) - 向僵尸发射寒冰豌豆"
                  x={20}
                  y={70}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="• 向日葵 (50阳光) - 产生阳光"
                  x={20}
                  y={100}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="• 坚果墙 (50阳光) - 高生命值屏障"
                  x={20}
                  y={130}
                  fontSize={18}
                  fill="#333"
                />
                <Text
                  text="• 荷叶 (25阳光) - 水上托举其它植物"
                  x={20}
                  y={160}
                  fontSize={18}
                  fill="#333"
                />
              </Group>

              <Group x={50} y={495}>
                <Text
                  text="🎯 游戏目标："
                  x={0}
                  y={0}
                  fontSize={24}
                  fontStyle="bold"
                  fill="#2d5016"
                />
                <Text
                  text="保卫你的草坪！不要让僵尸到达左侧！"
                  x={20}
                  y={40}
                  fontSize={18}
                  fill="#333"
                />
              </Group>

              {/* 关闭按钮 */}
              <Group
                x={width - 80}
                y={20}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  onClose()
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  onClose()
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
                {buttonImage ? (
                  <Image
                    image={buttonImage}
                    width={50}
                    height={50}
                    listening={true}
                  />
                ) : (
                  <Rect
                    width={50}
                    height={50}
                    fill="#f44336"
                    cornerRadius={25}
                    listening={true}
                  />
                )}
                <Text
                  text="✕"
                  x={25}
                  y={15}
                  fontSize={24}
                  fill="#fff"
                  align="center"
                  offsetX={12}
                  listening={false}
                />
              </Group>
            </Layer>
          </Stage>
        </Group>
      </div>
    </div>
  )
}

export default HelpScreen

