import './style.css'

const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 600
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')!

interface GameEntity {
  x: number
  y: number
  width: number
  height: number
  draw(): void
  update(): void
}

class Player implements GameEntity {
  x: number
  y: number
  width = 50
  height = 30
  speed = 5
  projectiles: Projectile[] = []

  constructor() {
    this.x = canvas.width / 2 - this.width / 2
    this.y = canvas.height - 50
  }

  draw() {
    ctx.fillStyle = '#0f0'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.projectiles.forEach((p, i) => {
      if (p.y + p.height < 0) {
        this.projectiles.splice(i, 1)
      }
      p.update()
    })
  }

  shoot() {
    this.projectiles.push(new Projectile(this.x + this.width / 2 - 2.5, this.y))
  }
}

class Enemy implements GameEntity {
  x: number
  y: number
  width = 40
  height = 30
  speed = 1

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  draw() {
    ctx.fillStyle = '#f00'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.y += this.speed
    this.draw()
  }
}

class Projectile implements GameEntity {
  x: number
  y: number
  width = 5
  height = 10
  speed = 5

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  draw() {
    ctx.fillStyle = '#ff0'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.y -= this.speed
    this.draw()
  }
}

class Game {
  player: Player
  enemies: Enemy[] = []
  score = 0
  gameOver = false

  constructor() {
    this.player = new Player()
    this.spawnEnemies()
    this.addEventListeners()
    this.gameLoop()
  }

  spawnEnemies() {
    const cols = 8
    const rows = 3
    const spacing = 60
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.enemies.push(new Enemy(i * spacing + 100, j * spacing + 50))
      }
    }
  }

  addEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.player.x -= this.player.speed
      }
      if (e.key === 'ArrowRight') {
        this.player.x += this.player.speed
      }
      if (e.key === ' ') {
        this.player.shoot()
      }
    })
  }

  checkCollisions() {
    this.player.projectiles.forEach((p, pi) => {
      this.enemies.forEach((e, ei) => {
        if (
          p.x < e.x + e.width &&
          p.x + p.width > e.x &&
          p.y < e.y + e.height &&
          p.y + p.height > e.y
        ) {
          this.player.projectiles.splice(pi, 1)
          this.enemies.splice(ei, 1)
          this.score += 10
        }
      })
    })
  }

  gameLoop() {
    if (this.gameOver) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    this.player.update()
    this.enemies.forEach(e => e.update())
    this.checkCollisions()
    
    // Draw score
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${this.score}`, 10, 30)
    
    // Check game over
    if (this.enemies.some(e => e.y + e.height > canvas.height)) {
      this.gameOver = true
      ctx.fillStyle = '#fff'
      ctx.font = '40px Arial'
      ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2)
    } else {
      requestAnimationFrame(() => this.gameLoop())
    }
  }
}

new Game()
