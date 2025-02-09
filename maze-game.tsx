"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

// Maze levels (0: path, 1: wall, 2: start, 3: end)
const levels = [
  {
    layout: [
      [2, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 3, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    name: "Easy",
  },
  {
    layout: [
      [2, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    name: "Medium",
  },
  {
    layout: [
      [2, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    name: "Hard",
  },
]

const Cell = ({ type }: { type: number }) => {
  const colors = {
    0: "bg-gray-200", // Path
    1: "bg-gray-800", // Wall
    2: "bg-green-500", // Start
    3: "bg-red-500", // End
  }
  return <div className={`w-8 h-8 ${colors[type as keyof typeof colors]}`} />
}

const Player = ({ x, y }: { x: number; y: number }) => (
  <div
    className="absolute w-6 h-6 bg-blue-500 rounded-full"
    style={{ left: `${x * 2}rem`, top: `${y * 2}rem`, transition: "all 0.2s" }}
  />
)

const MazeGame = () => {
  const [level, setLevel] = useState(0)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [gameWon, setGameWon] = useState(false)

  const currentMaze = levels[level].layout

  const initializePlayer = useCallback(() => {
    for (let y = 0; y < currentMaze.length; y++) {
      for (let x = 0; x < currentMaze[y].length; x++) {
        if (currentMaze[y][x] === 2) {
          setPlayerPos({ x, y })
          return
        }
      }
    }
  }, [currentMaze])

  useEffect(() => {
    initializePlayer()
    setGameWon(false)
  }, [initializePlayer]) // Removed unnecessary dependency: level

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      setPlayerPos((prev) => {
        const newX = prev.x + dx
        const newY = prev.y + dy
        if (
          newX >= 0 &&
          newX < currentMaze[0].length &&
          newY >= 0 &&
          newY < currentMaze.length &&
          currentMaze[newY][newX] !== 1
        ) {
          if (currentMaze[newY][newX] === 3) {
            setGameWon(true)
          }
          return { x: newX, y: newY }
        }
        return prev
      })
    },
    [currentMaze],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1)
          break
        case "ArrowDown":
          movePlayer(0, 1)
          break
        case "ArrowLeft":
          movePlayer(-1, 0)
          break
        case "ArrowRight":
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [movePlayer])

  const nextLevel = () => {
    if (level < levels.length - 1) {
      setLevel(level + 1)
    } else {
      alert("Congratulations! You've completed all levels!")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Maze Game</h1>
      <div className="mb-4">
        <p className="text-xl font-semibold">Level: {levels[level].name}</p>
      </div>
      <div className="relative border-2 border-gray-400">
        {currentMaze.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <Cell key={`${x}-${y}`} type={cell} />
            ))}
          </div>
        ))}
        <Player x={playerPos.x} y={playerPos.y} />
      </div>
      {gameWon && (
        <div className="mt-4">
          <p className="text-xl font-semibold mb-2">Level Complete!</p>
          <Button onClick={nextLevel}>{level < levels.length - 1 ? "Next Level" : "Restart Game"}</Button>
        </div>
      )}
      <div className="mt-4">
        <p>Use arrow keys to move the player (blue circle) to the end (red square).</p>
      </div>
    </div>
  )
}

export default MazeGame

