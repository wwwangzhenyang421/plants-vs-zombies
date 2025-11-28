import useImage from '../hooks/useImage'
import { Image, Group, Rect, Text } from 'react-konva'

function GameOver({ isWin, isLevelComplete, currentLevel, wave, onContinue, onRestart, onBackToStart }) {
  const [failImage] = useImage('/images/applied/fail.png')
  const [buttonImage] = useImage('/images/applied/botton.png')

  const width = 900
  const height = 600

  return (
    <Group>
      {/* 半透明黑色遮罩 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#000"
        opacity={0.8}
      />

              {/* 失败图片（如果失败） */}
              {!isWin && failImage && (
                <Image
                  image={failImage}
                  x={width / 2 - 150}
                  y={height / 2 - 100}
                  width={300}
                  height={200}
                  opacity={0.9}
                />
              )}

      {/* 胜利/失败 文字 */}
      <Group x={width / 2} y={height / 2 - 120}>
        <Text
          text={isLevelComplete ? "🎉 Level Complete! 🎉" : isWin ? "🎉 Victory! 🎉" : "💀 Game Over 💀"}
          x={0}
          y={0}
          fontSize={isLevelComplete ? 64 : isWin ? 72 : 64}
          fontStyle="bold"
          fill={isWin || isLevelComplete ? "#4caf50" : "#f44336"}
          align="center"
          offsetX={isLevelComplete ? 220 : isWin ? 200 : 180}
          shadowColor="#000"
          shadowBlur={15}
          shadowOffset={{ x: 3, y: 3 }}
        />
        {isLevelComplete && (
          <>
            <Text
              text={`Level ${currentLevel} Complete!`}
              x={0}
              y={80}
              fontSize={32}
              fontStyle="bold"
              fill="#ffd700"
              align="center"
              offsetX={120}
              shadowColor="#000"
              shadowBlur={8}
            />
            {currentLevel < 3 && (
              <Text
                text="Continue to Next Level?"
                x={0}
                y={120}
                fontSize={24}
                fill="#fff"
                align="center"
                offsetX={120}
                shadowColor="#000"
                shadowBlur={5}
              />
            )}
          </>
        )}
        {isWin && !isLevelComplete && (
          <Text
            text="You Survived All Waves!"
            x={0}
            y={80}
            fontSize={32}
            fontStyle="bold"
            fill="#ffd700"
            align="center"
            offsetX={150}
            shadowColor="#000"
            shadowBlur={8}
          />
        )}
        {!isWin && !isLevelComplete && (
          <Text
            text={`Reached Wave ${wave}`}
            x={0}
            y={80}
            fontSize={28}
            fill="#fff"
            align="center"
            offsetX={100}
            shadowColor="#000"
            shadowBlur={5}
          />
        )}
      </Group>

      {/* 继续下一关按钮（关卡完成时显示） */}
      {isLevelComplete && currentLevel < 3 && onContinue && (
        <Group
          x={width / 2 - 100}
          y={height / 2}
          onClick={onContinue}
          onTap={onContinue}
          onMouseEnter={(e) => {
            e.target.getStage().container().style.cursor = 'pointer'
            e.target.scale({ x: 1.1, y: 1.1 })
          }}
          onMouseLeave={(e) => {
            e.target.getStage().container().style.cursor = 'default'
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
              fill="#4caf50"
              cornerRadius={10}
            />
          )}
          <Text
            text="Continue"
            x={100}
            y={20}
            fontSize={28}
            fontStyle="bold"
            fill="#fff"
            align="center"
            offsetX={60}
          />
        </Group>
      )}

      {/* 重玩按钮 */}
      {buttonImage && (
        <Group
          x={width / 2 - 100}
          y={isLevelComplete && currentLevel < 3 ? height / 2 + 80 : height / 2}
          onClick={onRestart}
          onTap={onRestart}
          onMouseEnter={(e) => {
            e.target.getStage().container().style.cursor = 'pointer'
            e.target.scale({ x: 1.1, y: 1.1 })
          }}
          onMouseLeave={(e) => {
            e.target.getStage().container().style.cursor = 'default'
            e.target.scale({ x: 1, y: 1 })
          }}
        >
          <Image
            image={buttonImage}
            width={200}
            height={60}
          />
          <Text
            text="Play Again"
            x={100}
            y={20}
            fontSize={28}
            fontStyle="bold"
            fill="#fff"
            align="center"
            offsetX={60}
          />
        </Group>
      )}

      {/* 返回主菜单按钮 */}
      {buttonImage && (
        <Group
          x={width / 2 - 100}
          y={isLevelComplete && currentLevel < 3 ? height / 2 + 160 : height / 2 + 80}
          onClick={onBackToStart}
          onTap={onBackToStart}
          onMouseEnter={(e) => {
            e.target.getStage().container().style.cursor = 'pointer'
            e.target.scale({ x: 1.1, y: 1.1 })
          }}
          onMouseLeave={(e) => {
            e.target.getStage().container().style.cursor = 'default'
            e.target.scale({ x: 1, y: 1 })
          }}
        >
          <Image
            image={buttonImage}
            width={200}
            height={60}
          />
          <Text
            text="Main Menu"
            x={100}
            y={20}
            fontSize={28}
            fontStyle="bold"
            fill="#fff"
            align="center"
            offsetX={60}
          />
        </Group>
      )}
    </Group>
  )
}

export default GameOver

