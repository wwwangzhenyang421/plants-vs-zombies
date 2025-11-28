import { useState } from 'react'
import useImage from '../hooks/useImage'
import { Image, Group, Text, Rect } from 'react-konva'

function StartScreen({ onStartGame, onShowHelp }) {
  const [coverImage] = useImage('/images/applied/cover.jpg')
  const [titleImage] = useImage('/images/applied/title.jpg')
  const [menuImage] = useImage('/images/applied/menu.png')
  const [buttonImage] = useImage('/images/applied/botton.png')
  
  const [showGameMode, setShowGameMode] = useState(false)

  const width = 900
  const height = 600

  const handleStartClick = () => {
    setShowGameMode(true)
  }

  const handleModeSelect = (hasPool) => {
    setShowGameMode(false)
    onStartGame(hasPool)
  }

  return (
    <Group>
      {/* 背景 - cover.jpg */}
      {coverImage ? (
        <Image
          image={coverImage}
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
          fill="#2d5016"
        />
      )}

      {/* 左上角 - title.jpg，宽度为整个宽度的2/3 */}
      {titleImage && (
        <Image
          image={titleImage}
          x={20}
          y={20}
          width={width * 2 / 3}
          height={120}
        />
      )}

      {/* 右下角区域 */}
      <Group x={width - 250} y={height - 300}>
        {/* 两个按钮 */}
        {!showGameMode ? (
          <>
            {/* 注意事项按钮 - 下方 */}
            <Group
              x={15}
              y={120}
              listening={true}
              onClick={(e) => {
                e.cancelBubble = true
                onShowHelp && onShowHelp()
              }}
              onTap={(e) => {
                e.cancelBubble = true
                onShowHelp && onShowHelp()
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'pointer'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1.1, y: 1.1 })
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'default'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1, y: 1 })
                }
              }}
            >
              <Group
                offsetX={100}
                offsetY={25}
              >
                {buttonImage ? (
                  <Image
                    image={buttonImage}
                    width={200}
                    height={50}
                    listening={true}
                  />
                ) : (
                  <Rect
                    width={200}
                    height={50}
                    fill="#ff9800"
                    cornerRadius={8}
                    listening={true}
                  />
                )}
                <Text
                  text="注意事项"
                  x={100}
                  y={15}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={50}
                  listening={false}
                />
              </Group>
            </Group>

            {/* 开始游戏按钮 - 上方 */}
            <Group
              x={15}
              y={60}
              listening={true}
              onClick={(e) => {
                e.cancelBubble = true
                handleStartClick()
              }}
              onTap={(e) => {
                e.cancelBubble = true
                handleStartClick()
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'pointer'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1.1, y: 1.1 })
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'default'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1, y: 1 })
                }
              }}
            >
              <Group
                offsetX={100}
                offsetY={25}
              >
                {buttonImage ? (
                  <Image
                    image={buttonImage}
                    width={200}
                    height={50}
                    listening={true}
                  />
                ) : (
                  <Rect
                    width={200}
                    height={50}
                    fill="#4caf50"
                    cornerRadius={8}
                    listening={true}
                  />
                )}
                <Text
                  text="开始游戏"
                  x={100}
                  y={15}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={50}
                  listening={false}
                />
              </Group>
            </Group>
          </>
        ) : (
          <>
            {/* 模式选择：全部陆地 - 下方 */}
            <Group
              x={15}
              y={120}
              listening={true}
              onClick={(e) => {
                e.cancelBubble = true
                handleModeSelect(false)
              }}
              onTap={(e) => {
                e.cancelBubble = true
                handleModeSelect(false)
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'pointer'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1.1, y: 1.1 })
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'default'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1, y: 1 })
                }
              }}
            >
              <Group
                offsetX={100}
                offsetY={25}
              >
                {buttonImage ? (
                  <Image
                    image={buttonImage}
                    width={200}
                    height={50}
                    listening={true}
                  />
                ) : (
                  <Rect
                    width={200}
                    height={50}
                    fill="#4caf50"
                    cornerRadius={8}
                    listening={true}
                  />
                )}
                <Text
                  text="全部陆地"
                  x={100}
                  y={15}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={50}
                  listening={false}
                />
              </Group>
            </Group>

            {/* 模式选择：中间三行泳池 - 上方 */}
            <Group
              x={15}
              y={60}
              listening={true}
              onClick={(e) => {
                e.cancelBubble = true
                handleModeSelect(true)
              }}
              onTap={(e) => {
                e.cancelBubble = true
                handleModeSelect(true)
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'pointer'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1.1, y: 1.1 })
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = 'default'
                }
                const group = e.target.getParent()
                if (group) {
                  group.scale({ x: 1, y: 1 })
                }
              }}
            >
              <Group
                offsetX={100}
                offsetY={25}
              >
                {buttonImage ? (
                  <Image
                    image={buttonImage}
                    width={200}
                    height={50}
                    listening={true}
                  />
                ) : (
                  <Rect
                    width={200}
                    height={50}
                    fill="#2196f3"
                    cornerRadius={8}
                    listening={true}
                  />
                )}
                <Text
                  text="中间三行泳池"
                  x={100}
                  y={15}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#fff"
                  align="center"
                  offsetX={70}
                  listening={false}
                />
              </Group>
            </Group>
          </>
        )}
      </Group>
    </Group>
  )
}

export default StartScreen
