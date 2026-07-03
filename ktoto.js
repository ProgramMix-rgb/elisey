// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================
var lCode = []
var blocks = []
var sMoves = []
var flyingSpikes = []
var player
var home = 0
var camY = 0
var time = 0
var pst = 0
var placeO = 0
var placeOY = 0
var mode = "block"
var modes = ["block", "spike", "del", "psh", "puf"]
var winParticles = []
var bgEffect = 0
var screenShake = 0
var bgStars = []
var lavaParticles = []

// Переменные редактора (УПРОЩЁННАЯ ВЕРСИЯ)
var editorMode = false
var selectedBlockType = 0
var cameraX = 0
var cameraY = 0
var cameraSpeed = 10
var fastCameraSpeed = 25
var gridSize = 40
var showGrid = true
var editorMessage = ""
var editorMessageTimer = 0

// ============================================
// МУЗЫКА - ПРОСТАЯ И РАБОЧАЯ
// ============================================
var bgMusic = null;
var editorMusic = null;
var musicStarted = false;

function initAllMusic() {
    if (!bgMusic) {
        bgMusic = new Audio('BB.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.6;
    }
    if (!editorMusic) {
        editorMusic = new Audio('AM.mp3');
        editorMusic.loop = true;
        editorMusic.volume = 0.6;
    }
}

// Запуск музыки (вызывается при первом клике/нажатии)
function startGameMusic() {
    initAllMusic();
    if (!musicStarted) {
        bgMusic.play().catch(function(){});
        musicStarted = true;
    }
}

// Перезапуск музыки при смерти
function restartMusic() {
    if (bgMusic && !editorMode) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(function(){});
    }
}

// Переключение на музыку редактора
function switchToEditorMusic() {
    initAllMusic();
    bgMusic.pause();
    editorMusic.currentTime = 0;
    editorMusic.play().catch(function(){});
}

// Возврат к игровой музыке
function switchToGameMusic() {
    if (editorMusic) editorMusic.pause();
    if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(function(){});
    }
}

// ============================================
// ГЕНЕРАТОР УРОВНЯ
// ============================================
function generateLevel() {
    lCode = [];
    
    let groundY = 620;
    let x = 800;
    
    for (let i = 0; i < 4; i++) {
        lCode.push("blo", x, groundY);
        x += 40;
    }
    
    let sectionEnd = 1900;
    while (x < sectionEnd) {
        let pattern = floor(random(6));
        
        if (pattern === 0) {
            let len = floor(random(3, 6));
            for (let i = 0; i < len && x < sectionEnd; i++) {
                lCode.push("blo", x, groundY);
                x += 40;
            }
        } else if (pattern === 1) {
            if (groundY > 460) {
                groundY -= 40;
                lCode.push("blo", x, groundY);
                lCode.push("blo", x, groundY + 40);
                x += 40;
                let len = floor(random(2, 4));
                for (let i = 0; i < len && x < sectionEnd; i++) {
                    lCode.push("blo", x, groundY);
                    x += 40;
                }
            } else {
                let len = floor(random(2, 4));
                for (let i = 0; i < len && x < sectionEnd; i++) {
                    lCode.push("blo", x, groundY);
                    x += 40;
                }
            }
        } else if (pattern === 2) {
            if (groundY < 620) {
                groundY += 40;
                let len = floor(random(2, 4));
                for (let i = 0; i < len && x < sectionEnd; i++) {
                    lCode.push("blo", x, groundY);
                    x += 40;
                }
            } else {
                let len = floor(random(2, 4));
                for (let i = 0; i < len && x < sectionEnd; i++) {
                    lCode.push("blo", x, groundY);
                    x += 40;
                }
            }
        } else if (pattern === 3) {
            lCode.push("blo", x, groundY);
            x += 40;
            lCode.push("spi", x, groundY - 40);
            x += 40;
            lCode.push("blo", x, groundY);
            x += 40;
        } else if (pattern === 4) {
            let gapSize = floor(random(2, 4)) * 40;
            x += gapSize;
            let len = floor(random(2, 4));
            for (let i = 0; i < len && x < sectionEnd; i++) {
                lCode.push("blo", x, groundY);
                x += 40;
            }
        } else {
            if (groundY > 500) {
                lCode.push("blo", x, groundY);
                x += 40;
                lCode.push("blo", x, groundY);
                lCode.push("blo", x, groundY - 40);
                x += 40;
                lCode.push("blo", x, groundY - 40);
                x += 40;
            } else {
                let len = floor(random(2, 3));
                for (let i = 0; i < len && x < sectionEnd; i++) {
                    lCode.push("blo", x, groundY);
                    x += 40;
                }
            }
        }
        
        if (groundY < 500 && random() < 0.3) {
            groundY += 40;
        }
    }
    
    while (x < 2000) {
        lCode.push("blo", x, groundY);
        x += 40;
    }
    
    lCode.push("psh", 2000, 370);
    
    x = 2200;
    let sectionEndShip = 7800;
    
    while (x < sectionEndShip) {
        let pattern = floor(random(7));
        
        if (pattern === 0) {
            let len = floor(random(2, 4));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, 150);
                lCode.push("blo", x, 600);
                x += 40;
            }
        } else if (pattern === 1) {
            let len = floor(random(2, 3));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, 100);
                lCode.push("blo", x, 550);
                x += 40;
            }
        } else if (pattern === 2) {
            let len = floor(random(2, 3));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, 200);
                lCode.push("blo", x, 650);
                x += 40;
            }
        } else if (pattern === 3) {
            let len = floor(random(1, 3));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, 250);
                lCode.push("blo", x, 500);
                x += 40;
            }
        } else if (pattern === 4) {
            let len = floor(random(2, 4));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, 100);
                lCode.push("blo", x, 650);
                x += 40;
            }
        } else if (pattern === 5) {
            let len = floor(random(2, 4));
            let midY = floor(random(300, 450));
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, midY);
                x += 40;
            }
        } else if (pattern === 6) {
            let len = floor(random(3, 5));
            let y = 300;
            let direction = 1;
            for (let i = 0; i < len && x < sectionEndShip; i++) {
                lCode.push("blo", x, y);
                y += direction * 40;
                if (y > 450) direction = -1;
                if (y < 250) direction = 1;
                x += 40;
            }
        }
    }
    
    lCode.push("puf", 8000, 370);
    
    x = 8200;
    let sectionEndUfo = 15800;
    
    while (x < sectionEndUfo) {
        let pattern = floor(random(6));
        
        if (pattern === 0) {
            let gapY = floor(random(3, 10)) * 40 + 100;
            let wallHeight = floor(random(3, 5));
            for (let i = 0; i < wallHeight; i++) {
                let y = 100 + i * 40;
                if (abs(y - gapY) > 60) {
                    lCode.push("blo", x, y);
                }
            }
            x += 40;
        } else if (pattern === 1) {
            lCode.push("spi", x, 100);
            lCode.push("spi", x, 620);
            x += 40;
            x += 40;
        } else if (pattern === 2) {
            let topY = floor(random(2, 5)) * 40 + 100;
            let bottomY = topY + 200;
            lCode.push("blo", x, topY);
            lCode.push("blo", x, bottomY);
            x += 40;
            lCode.push("blo", x, topY);
            lCode.push("blo", x, bottomY);
            x += 40;
        } else if (pattern === 3) {
            let count = floor(random(2, 4));
            let startY = floor(random(3, 8)) * 40 + 100;
            for (let i = 0; i < count; i++) {
                lCode.push("blo", x, startY + i * 40);
            }
            x += 40;
        } else if (pattern === 4) {
            lCode.push("blo", x, 580);
            lCode.push("spi", x, 540);
            x += 40;
            lCode.push("blo", x, 580);
            x += 40;
        } else {
            x += 80;
        }
    }
    
    lCode.push("spi", 15800, 620);
    lCode.push("spi", 15840, 620);
    lCode.push("spi", 15880, 620);
}

// ============================================
// SETUP
// ============================================
function setup() {
    createCanvas(1620, 740);

    // Инициализируем музыку, но НЕ запускаем (ждём первого клика)
    initAllMusic();

    for (let i = 0; i < 100; i++) {
        bgStars.push({
            x: random(width * 3),
            y: random(height),
            size: random(1, 3),
            speed: random(0.5, 2),
            brightness: random(100, 255)
        });
    }

    generateLevel();

    for (let i = 0; i < lCode.length; i += 1) {
        if (lCode[i] == "spi") blocks.push(new spike(lCode[i + 1], lCode[i + 2]))
        if (lCode[i] == "blo") blocks.push(new block(lCode[i + 1], lCode[i + 2]))
        if (lCode[i] == "psh") blocks.push(new portal(lCode[i + 1], lCode[i + 2], "ship"))
        if (lCode[i] == "puf") blocks.push(new portal(lCode[i + 1], lCode[i + 2], "ufo"))
    }

    flyingSpikes.push(new flyingSpike(random(3000, 4000), random(200, 500)))
    flyingSpikes.push(new flyingSpike(random(5000, 6000), random(200, 500)))
    flyingSpikes.push(new flyingSpike(random(9000, 10000), random(200, 500)))
    flyingSpikes.push(new flyingSpike(random(11000, 12000), random(200, 500)))
    flyingSpikes.push(new flyingSpike(random(13000, 14000), random(200, 500)))

    background(134, 0, 0);

    player = {
        x: 75,
        y: height - 100,
        yVel: 0,
        dead: false,
        air: false,
        rot: 0,
        xR: 0,
        jumpst: 0,
        c: 0,
        speed: 12,
        mode: "cube",
        ufoJumped: false,

        move: function() {
            if (!this.dead) { this.xR += (player.speed) }
            if (frameCount > 1) { this.y += this.yVel } else { this.y += this.yVel }

            if (this.mode == "cube") {
                if (this.y > height - 99) {
                    this.y -= this.yVel;
                    this.yVel = 0;
                    this.air = false;
                } else {
                    this.yVel += 1.3
                }
                while (this.y > height - 99) { this.y -= 0.1 }
            } else if (this.mode == "ship") {
                let pressing = keyIsDown(32) || mouseIsPressed || keyIsDown(38);
                if (pressing) {
                    this.yVel -= 0.6;
                } else {
                    this.yVel += 0.6;
                }
                if (this.yVel > 8) this.yVel = 8;
                if (this.yVel < -8) this.yVel = -8;

                if (this.y > height - 99) {
                    this.y = height - 99;
                    this.yVel = 0;
                }
                this.air = true;
            } else if (this.mode == "ufo") {
                let pressing = keyIsDown(32) || mouseIsPressed || keyIsDown(38);
                
                if (pressing && !this.ufoJumped) {
                    this.yVel = -13;
                    this.ufoJumped = true;
                }
                
                if (!pressing) {
                    this.ufoJumped = false;
                }
                
                this.yVel += 1.2;
                
                if (this.yVel > 12) this.yVel = 12;
                if (this.yVel < -13) this.yVel = -13;

                if (this.y > height - 99) {
                    this.y = height - 99;
                    this.yVel = 0;
                }
                this.air = true;
            }

            if (this.dead) {
                // ПЕРЕЗАПУСК МУЗЫКИ ПРИ СМЕРТИ
                restartMusic();
                
                home = 1;
                this.dead = false;
                this.y = height - 100;
                this.mode = "cube";
                placeOY = round(placeOY / 40);
                placeO = round(placeO / 40);
                player.xR = 0;
                this.yVel = 0;
                this.ufoJumped = false;
                this.c += 1 * 60 / frameRate()
                if (this.c > 60) {
                    player.dead = false;
                }
            } else {
                this.c = 0
            }
        },

        show: function() {
            if (this.mode == "cube") {
                if (this.air) {
                    this.rot += 8
                } else {
                    if (this.rot > round(this.rot / 90) * 90 + 40) this.rot -= 38
                    else if (this.rot < round(this.rot / 90) * 90 - 40) this.rot += 38
                    else this.rot = round(this.rot / 90) * 90
                }
            } else if (this.mode == "ship") {
                let targetRot = this.yVel * 4;
                this.rot += (targetRot - this.rot) * 0.15;
            } else if (this.mode == "ufo") {
                let targetRot = this.yVel * 3;
                this.rot += (targetRot - this.rot) * 0.2;
            }

            if (this.mode == "cube") {
                if (keyIsDown(32) || mouseIsPressed || keyIsDown(38)) {
                    if (this.air == false) {
                        this.yVel = -13.3;
                        this.air = true;
                    }
                }
            }

            if (!this.dead) {
                translate(75, this.y)
                angleMode(DEGREES)
                rotate(this.rot)

                if (this.mode == "cube") {
                    rectMode(CENTER)
                    fill(0, 0, 0)
                    stroke(255, 0, 0);
                    strokeWeight(6)
                    rect(0, 0, 40)
                } else if (this.mode == "ship") {
                    rectMode(CENTER)
                    fill(56,15,15)
                    stroke(255, 0, 0)
                    strokeWeight(3)
                    beginShape()
                    vertex(-25, -15)
                    vertex(25, 0)
                    vertex(-25, 15)
                    endShape(CLOSE)
                    fill(255, 100, 0)
                    noStroke()
                    triangle(-25, -10, -40, 0, -25, 10)
                } else if (this.mode == "ufo") {
                    rectMode(CENTER)
                    fill(56,15,15)
                    stroke(255, 0, 0)
                    strokeWeight(4)
                    ellipse(0, 5, 50, 18)
                }
            }
        }
    }
    home = 0
}

function ground() {
    fill(0, 0, 0)
    rectMode(CORNER)
    stroke(0, 0, 0)
    strokeWeight(1)
    if (home == 1) {
        rect(-10, height - 100 + 20 + 2, width + 10, placeOY + 150)
        rect(-10, height - 100 + 20 + 2, width + 20, placeOY + 150)
    } else {
        rect(-10, height - 100 + 20 + 2, width + 10, 150)
        rect(-10, height - 100 + 20 + 2, width + 20, 150)
    }
}

function topWall() {
    let wallY = 40;
    
    fill(50, 0, 0);
    rectMode(CORNER);
    stroke(255, 0, 0);
    strokeWeight(4);
    
    rect(-10, wallY - 50, width + 20, 50);
    
    if (!player.dead && home == 0) {
        let playerTop = player.y - 18;
        
        if (playerTop <= wallY) {
            player.dead = true;
            screenShake = 15;
        }
    }
}

function bloodbathEffects() {
    bgEffect += 0.02;
    let bgR = 20 + sin(bgEffect) * 15;
    let bgG = 5 + sin(bgEffect + 1) * 10;
    let bgB = 30 + sin(bgEffect + 2) * 20;
    background(bgR, bgG, bgB);
    
    if (screenShake > 0) {
        translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
        screenShake *= 0.9;
        if (screenShake < 0.5) screenShake = 0;
    }
    
    for (let i = 0; i < bgStars.length; i++) {
        let star = bgStars[i];
        if (!player.dead) {
            star.x -= star.speed * (player.speed / 10);
        }
        if (star.x < -10) {
            star.x = width + 10;
            star.y = random(height);
        }
        fill(255, star.brightness * (0.5 + sin(frameCount * 0.05 + i) * 0.5));
        noStroke();
        ellipse(star.x, star.y, star.size);
    }
    
    stroke(255, 0, 0, 30);
    strokeWeight(1);
    for (let i = -200; i < width + 200; i += 80) {
        let x = i + (-player.xR % 80);
        line(x, 0, x, height - 100);
    }
    for (let i = 0; i < height - 100; i += 80) {
        line(0, i, width, i);
    }
    noStroke();
    
    if (frameCount % 4 == 0 && lavaParticles.length < 50) {
        lavaParticles.push({
            x: random(width),
            y: height - 80 + random(20),
            vx: random(-1, 1),
            vy: random(-3, -1),
            size: random(2, 5),
            life: 60
        });
    }
    
    for (let i = lavaParticles.length - 1; i >= 0; i--) {
        let p = lavaParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life--;
        let alpha = map(p.life, 0, 60, 0, 255);
        fill(255, 100 + random(50), 0, alpha);
        noStroke();
        ellipse(p.x, p.y, p.size);
        if (p.life <= 0 || p.y > height) {
            lavaParticles.splice(i, 1);
        }
    }
}

function winScreen() {
    for (let i = 0; i < height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color(0, 0, 0), color(150, 0, 0), inter);
        stroke(c);
        line(0, i, width, i);
    }
    
    stroke(255, 0, 0, 40);
    strokeWeight(1);
    for (let i = -200; i < width + 200; i += 80) {
        let x = i + (frameCount * 0.5 % 80);
        line(x, 0, x, height);
    }
    for (let i = 0; i < height; i += 80) {
        line(0, i, width, i);
    }
    noStroke();
    
    for (let i = winParticles.length - 1; i >= 0; i--) {
        let p = winParticles[i];
        p.y += p.vy;
        p.vy += 0.3;
        p.x += p.vx;
        p.rot += p.vr;
        
        push();
        translate(p.x, p.y);
        rotate(p.rot);
        
        fill(0, 0, 0);
        stroke(255, 0, 0);
        strokeWeight(3);
        rectMode(CENTER);
        rect(0, 0, p.size, p.size);
        
        noStroke();
        fill(255, 0, 0, 150);
        rect(0, 0, p.size - 8, p.size - 8);
        
        pop();
        
        if (p.y > height + 50) {
            winParticles.splice(i, 1);
        }
    }
    
    if (frameCount % 3 == 0 && winParticles.length < 200) {
        winParticles.push({
            x: random(width),
            y: -20,
            vx: random(-2, 2),
            vy: random(-5, -2),
            rot: random(TWO_PI),
            vr: random(-0.2, 0.2),
            size: random(20, 40)
        });
    }
    
    fill(255, 0, 0);
    stroke(0, 0, 0);
    strokeWeight(4);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("LEVEL COMPLETE!", width / 2, height / 3);
    
    fill(255);
    noStroke();
    textSize(50);
    text("100%", width / 2, height / 2);
    
    textSize(30);
    text("Attempts: 1", width / 2, height / 2 + 80);
    text("Time: " + floor(frameCount / 60) + "s", width / 2, height / 2 + 120);
    
    fill(0, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(6);
    rectMode(CENTER);
    rect(width / 2, height - 150, 300, 80, 10);
    
    fill(255, 0, 0);
    textSize(35);
    text("Play Again", width / 2, height - 150);
}

// ============================================
// УПРОЩЁННЫЙ РЕДАКТОР
// ============================================

function showMessage(msg) {
    editorMessage = msg;
    editorMessageTimer = 90;
}

function drawEditorUI() {
    // Верхняя панель
    fill(0, 0, 0, 200);
    rectMode(CORNER);
    noStroke();
    rect(0, 0, width, 50);
    
    // Заголовок
    fill(255, 0, 0);
    textSize(22);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text("РЕДАКТОР УРОВНЯ", 15, 25);
    textStyle(NORMAL);
    
    // Кнопки выбора блоков
    let btnX = 250;
    let btnSize = 40;
    let btnSpacing = 50;
    
    for (let i = 0; i < 5; i++) {
        if (selectedBlockType === i) {
            fill(255, 0, 0);
            stroke(255, 255, 0);
            strokeWeight(3);
        } else {
            fill(40, 40, 40);
            stroke(150, 150, 150);
            strokeWeight(2);
        }
        rect(btnX, 5, btnSize, btnSize, 5);
        
        noStroke();
        if (i === 0) {
            fill(255, 50, 50);
            rect(btnX + btnSize/2, 5 + btnSize/2, 25, 25);
        } else if (i === 1) {
            fill(255, 100, 0);
            triangle(btnX + 8, 5 + btnSize - 8, btnX + btnSize - 8, 5 + btnSize - 8, btnX + btnSize/2, 5 + 8);
        } else if (i === 2) {
            fill(255, 0, 0);
            textSize(24);
            textAlign(CENTER, CENTER);
            text("X", btnX + btnSize/2, 5 + btnSize/2);
        } else if (i === 3) {
            fill(0, 200, 255);
            rect(btnX + btnSize/2, 5 + btnSize/2, 12, 30);
        } else if (i === 4) {
            fill(0, 255, 150);
            rect(btnX + btnSize/2, 5 + btnSize/2, 12, 30);
        }
        
        fill(255);
        textSize(10);
        textAlign(CENTER, TOP);
        text(i + 1, btnX + btnSize/2, 5 + btnSize + 2);
        
        btnX += btnSpacing;
    }
    
    // Кнопки действий
    btnX = 550;
    let actW = 90;
    let actH = 35;
    let actSpacing = 100;
    
    // Save
    fill(0, 150, 0);
    stroke(0, 200, 0);
    strokeWeight(2);
    rect(btnX, 8, actW, actH, 5);
    fill(255);
    noStroke();
    textSize(13);
    textAlign(CENTER, CENTER);
    text("Save (Q)", btnX + actW/2, 8 + actH/2);
    btnX += actSpacing;
    
    // Load
    fill(0, 0, 150);
    stroke(0, 100, 255);
    strokeWeight(2);
    rect(btnX, 8, actW, actH, 5);
    fill(255);
    noStroke();
    text("Load (L)", btnX + actW/2, 8 + actH/2);
    btnX += actSpacing;
    
    // Clear
    fill(150, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(btnX, 8, actW, actH, 5);
    fill(255);
    noStroke();
    text("Clear (C)", btnX + actW/2, 8 + actH/2);
    btnX += actSpacing;
    
    // Test
    fill(150, 100, 0);
    stroke(255, 150, 0);
    strokeWeight(2);
    rect(btnX, 8, actW, actH, 5);
    fill(255);
    noStroke();
    text("Test (T)", btnX + actW/2, 8 + actH/2);
    
    // Подсказка справа
    fill(255);
    textSize(13);
    textAlign(RIGHT, CENTER);
    text("WASD - камера | Shift - быстро | G - сетка | E - выход", width - 15, 25);
    
    // Нижняя панель с информацией
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, height - 50, width, 50);
    
    fill(255, 255, 0);
    textSize(14);
    textAlign(LEFT, CENTER);
    text("Тип: " + getBlockTypeName(selectedBlockType), 15, height - 25);
    
    fill(255);
    text("Блоков: " + blocks.length, 250, height - 25);
    text("Камера: " + floor(cameraX) + ", " + floor(cameraY), 400, height - 25);
    text("Мышь: " + floor(mouseX + cameraX) + ", " + floor(mouseY + cameraY), 650, height - 25);
    
    // Сообщение
    if (editorMessageTimer > 0) {
        fill(255, 255, 0, min(255, editorMessageTimer * 5));
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text(editorMessage, width / 2, height / 2);
        textStyle(NORMAL);
        editorMessageTimer--;
    }
}

function getBlockTypeName(type) {
    switch(type) {
        case 0: return "Блок";
        case 1: return "Шип";
        case 2: return "Удалить";
        case 3: return "Портал Корабль";
        case 4: return "Портал НЛО";
        default: return "Неизвестно";
    }
}

function saveLevel() {
    let levelData = [];
    for (let block of blocks) {
        levelData.push(block.id);
        levelData.push(block.xh || block.x);
        levelData.push(block.y);
        if (block.type) levelData.push(block.type);
    }
    localStorage.setItem('savedLevel', JSON.stringify(levelData));
    showMessage("Уровень сохранён!");
}

function loadLevel() {
    let savedData = localStorage.getItem('savedLevel');
    if (savedData) {
        blocks = [];
        let levelData = JSON.parse(savedData);
        for (let i = 0; i < levelData.length; i++) {
            if (levelData[i] == "spi") {
                blocks.push(new spike(levelData[i + 1], levelData[i + 2]));
                i += 2;
            } else if (levelData[i] == "blo") {
                blocks.push(new block(levelData[i + 1], levelData[i + 2]));
                i += 2;
            } else if (levelData[i] == "psh") {
                blocks.push(new portal(levelData[i + 1], levelData[i + 2], "ship"));
                i += 2;
            } else if (levelData[i] == "puf") {
                blocks.push(new portal(levelData[i + 1], levelData[i + 2], "ufo"));
                i += 2;
            }
        }
        showMessage("Уровень загружен!");
    } else {
        showMessage("Нет сохранённого уровня!");
    }
}

function clearLevel() {
    blocks = [];
    showMessage("Уровень очищен!");
}

function startTestMode() {
    editorMode = false;
    player.xR = 0;
    player.y = height - 100;
    player.mode = "cube";
    player.dead = false;
    switchToGameMusic();
    showMessage("Тестирование!");
}

function drawGrid() {
    if (!showGrid) return;
    
    stroke(100, 100, 100, 80);
    strokeWeight(1);
    
    for (let x = -cameraX % gridSize; x < width; x += gridSize) {
        line(x, 50, x, height - 50);
    }
    
    for (let y = 50 - cameraY % gridSize; y < height - 50; y += gridSize) {
        line(0, y, width, y);
    }
    
    stroke(150, 150, 150, 120);
    strokeWeight(2);
    
    for (let x = -cameraX % (gridSize * 5); x < width; x += gridSize * 5) {
        line(x, 50, x, height - 50);
    }
    
    for (let y = 50 - cameraY % (gridSize * 5); y < height - 50; y += gridSize * 5) {
        line(0, y, width, y);
    }
}

function placeBlockInEditor() {
    if (!editorMode) return;
    if (mouseY < 50 || mouseY > height - 50) return;
    
    let worldX = mouseX + cameraX;
    let worldY = mouseY + cameraY;
    
    let gridX = round(worldX / gridSize) * gridSize;
    let gridY = round(worldY / gridSize) * gridSize;
    
    // Проверка на дубликаты
    for (let b of blocks) {
        let bx = b.xh || b.x;
        if (abs(gridX - bx) < 5 && abs(gridY - b.y) < 5) return;
    }
    
    if (selectedBlockType === 0) {
        blocks.push(new block(gridX, gridY));
    } else if (selectedBlockType === 1) {
        blocks.push(new spike(gridX, gridY));
    } else if (selectedBlockType === 3) {
        blocks.push(new portal(gridX, gridY, "ship"));
    } else if (selectedBlockType === 4) {
        blocks.push(new portal(gridX, gridY, "ufo"));
    }
}

function deleteBlockInEditor() {
    if (!editorMode) return;
    if (mouseY < 50 || mouseY > height - 50) return;
    
    let worldX = mouseX + cameraX;
    let worldY = mouseY + cameraY;
    
    for (let i = blocks.length - 1; i >= 0; i--) {
        let b = blocks[i];
        let bx = b.xh || b.x;
        if (abs(worldX - bx) < gridSize/2 && abs(worldY - b.y) < gridSize/2) {
            blocks.splice(i, 1);
            break;
        }
    }
}

function drawEditorBlocks() {
    push();
    translate(-cameraX, -cameraY);
    
    for (let block of blocks) {
        let blockX = block.xh || block.x;
        let blockY = block.y;
        
        if (block.id === "blo") {
            fill(0, 0, 0);
            rectMode(CENTER);
            stroke(255, 50, 50);
            strokeWeight(3);
            rect(blockX, blockY, 40);
            noStroke();
            fill(255, 0, 0, 50);
            rect(blockX, blockY, 36);
        } else if (block.id === "spi") {
            fill(0, 0, 0);
            rectMode(CENTER);
            stroke(255, 100, 0);
            strokeWeight(3);
            triangle(blockX - 20, blockY + 20, blockX + 20, blockY + 20, blockX, blockY - 20);
            noStroke();
            fill(255, 50, 0, 50);
            triangle(blockX - 16, blockY + 16, blockX + 16, blockY + 16, blockX, blockY - 16);
        } else if (block.id === "psh" || block.id === "puf") {
            rectMode(CENTER);
            strokeWeight(4);
            if (block.id === "psh") {
                stroke(0, 200, 255);
                fill(0, 200, 255, 100);
            } else {
                stroke(0, 255, 150);
                fill(0, 255, 150, 100);
            }
            rect(blockX, blockY, 40, 200);
            noStroke();
            if (block.id === "psh") fill(180, 240, 255, 150);
            else fill(150, 255, 200, 150);
            rect(blockX, blockY, 20, 180);
        }
    }
    
    pop();
}

function drawPreview() {
    if (mouseY < 50 || mouseY > height - 50) return;
    if (selectedBlockType === 2) return;
    
    let previewX = round((mouseX + cameraX) / gridSize) * gridSize;
    let previewY = round((mouseY + cameraY) / gridSize) * gridSize;
    
    push();
    translate(-cameraX, -cameraY);
    
    // Проверка на существование
    let exists = false;
    for (let b of blocks) {
        let bx = b.xh || b.x;
        if (abs(previewX - bx) < 5 && abs(previewY - b.y) < 5) {
            exists = true;
            break;
        }
    }
    
    if (exists) {
        fill(255, 0, 0, 80);
        stroke(255, 0, 0);
    } else {
        fill(255, 255, 0, 80);
        stroke(255, 255, 0);
    }
    strokeWeight(2);
    rectMode(CENTER);
    rect(previewX, previewY, gridSize, gridSize);
    
    pop();
}

// ============================================
// DRAW
// ============================================
function draw() {
    if (home == 10) {
        winScreen();
        return;
    }

    if (editorMode) {
        background(30, 30, 40);
        
        drawGrid();
        drawEditorBlocks();
        drawPreview();
        drawEditorUI();
        
        // Движение камеры
        let speed = keyIsDown(SHIFT) ? fastCameraSpeed : cameraSpeed;
        if (keyIsDown(87) || keyIsDown(UP_ARROW)) cameraY -= speed;
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) cameraY += speed;
        if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) cameraX -= speed;
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) cameraX += speed;
        
        // Ограничение камеры
        cameraY = constrain(cameraY, -500, 500);
        cameraX = constrain(cameraX, -1000, 20000);
        
    } else {
        push()
        if (player.xR > 16000) { 
            home = 10;
            winParticles = [];
        }

        if (-player.y + height - 100 > height - 100) {
            if (camY > -player.y + height - 100 + 3) camY -= 3
            else if (camY < -player.y + height - 100 - 3) camY += 3
            else camY = -player.y + height - 100
        } else {
            if (camY > -player.y + height - 100 + 3) camY -= player.yVel + 30
        }

        translate(0, camY)
        
        bloodbathEffects();
        
        ground();
        topWall();
        
        player.air = true
        noStroke()
        player.move()
        noStroke()

        for (let i = 0; i < blocks.length; i++) {
            blocks[i].show()
        }
        
        for (let i = 0; i < flyingSpikes.length; i++) {
            flyingSpikes[i].show()
        }
        
        for (let i = 0; i < sMoves.length; i++) {
            sMoves[i].show()
            if (sMoves[i].x < -100) { sMoves.splice(i, 1); i-- }
        }

        push()
        player.show()
        pop()
        pop()
        time = 0;
    }

    if (home == 1) {
        time = 0;
        player.dead = false;
        home = 0
    }
}

// ============================================
// ОБРАБОТКА МЫШИ
// ============================================
function mousePressed() {
    // Запускаем музыку при первом клике
    if (!musicStarted) {
        startGameMusic();
    }
    
    if (editorMode) {
        // Проверка кликов по верхней панели
        if (mouseY < 50) {
            // Кнопки выбора блоков
            let btnX = 250;
            let btnSize = 40;
            let btnSpacing = 50;
            for (let i = 0; i < 5; i++) {
                if (mouseX > btnX && mouseX < btnX + btnSize && mouseY > 5 && mouseY < 5 + btnSize) {
                    selectedBlockType = i;
                    return;
                }
                btnX += btnSpacing;
            }
            
            // Кнопки действий
            btnX = 550;
            let actW = 90;
            let actH = 35;
            let actSpacing = 100;
            
            if (mouseX > btnX && mouseX < btnX + actW && mouseY > 8 && mouseY < 8 + actH) {
                saveLevel(); return;
            }
            btnX += actSpacing;
            if (mouseX > btnX && mouseX < btnX + actW && mouseY > 8 && mouseY < 8 + actH) {
                loadLevel(); return;
            }
            btnX += actSpacing;
            if (mouseX > btnX && mouseX < btnX + actW && mouseY > 8 && mouseY < 8 + actH) {
                clearLevel(); return;
            }
            btnX += actSpacing;
            if (mouseX > btnX && mouseX < btnX + actW && mouseY > 8 && mouseY < 8 + actH) {
                startTestMode(); return;
            }
            return;
        }
        
        // Клики по рабочей области
        if (mouseButton === LEFT) {
            if (selectedBlockType === 2) {
                deleteBlockInEditor();
            } else {
                placeBlockInEditor();
            }
        } else if (mouseButton === RIGHT) {
            deleteBlockInEditor();
        }
    } else {
        placeB();
        if (home == 10) {
            if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
                mouseY > height - 190 && mouseY < height - 110) {
                setup();
            }
        }
    }
}

function mouseDragged() {
    if (editorMode) {
        if (mouseY < 50 || mouseY > height - 50) return;
        if (mouseButton === LEFT) {
            if (selectedBlockType === 2) {
                deleteBlockInEditor();
            } else {
                placeBlockInEditor();
            }
        } else if (mouseButton === RIGHT) {
            deleteBlockInEditor();
        }
    } else {
        placeB();
    }
}

function placeB() {
    if (home == 1) {
        if (mouseIsPressed) {
            if (mode == "block") blocks.push(new block(mouseX + placeO, mouseY - 40 + placeOY))
            if (mode == "spike") blocks.push(new spike(mouseX + placeO, mouseY - 40 + placeOY))
            if (mode == "psh")   blocks.push(new portal(mouseX + placeO, mouseY - 40 + placeOY, "ship"))
            if (mode == "puf")   blocks.push(new portal(mouseX + placeO, mouseY - 40 + placeOY, "ufo"))
            if (mode == "del") {
                for (let i = 0; i < blocks.length; i++) {
                    if (blocks[i].x > mouseX - 20 + placeO && blocks[i].x < mouseX + 20 + placeO &&
                        blocks[i].y > mouseY - 20 + placeOY && blocks[i].y < mouseY + 20 + placeOY) {
                        blocks.splice(i, 1);
                        i--
                    }
                }
            }
        }
    }
}

// ============================================
// КЛАВИАТУРА
// ============================================
function keyPressed() {
    // Запускаем музыку при первом нажатии клавиши
    if (!musicStarted) {
        startGameMusic();
    }
    
    if (key === 'e' || key === 'E') {
        editorMode = !editorMode;
        if (editorMode) {
            cameraX = 0;
            cameraY = 0;
            switchToEditorMusic();
            showMessage("Редактор");
        } else {
            switchToGameMusic();
        }
        return false;
    }
    
    if (editorMode) {
        if (key === '1') selectedBlockType = 0;
        if (key === '2') selectedBlockType = 1;
        if (key === '3') selectedBlockType = 2;
        if (key === '4') selectedBlockType = 3;
        if (key === '5') selectedBlockType = 4;
        
        if (key === 'q' || key === 'Q') saveLevel();
        if (key === 'l' || key === 'L') loadLevel();
        if (key === 'c' || key === 'C') clearLevel();
        if (key === 't' || key === 'T') startTestMode();
        if (key === 'g' || key === 'G') {
            showGrid = !showGrid;
            showMessage("Сетка: " + (showGrid ? "ВКЛ" : "ВЫКЛ"));
        }
        return false;
    }
    
    if (key > 0 && key <= modes.length) {
        mode = modes[key - 1]
    }
    if (keyIsDown(69) && key == '2') {
        home = 1;
        return false;
    }
    if (keyCode == 113) {
        home = 1;
        return false;
    }
    if (key == 9) { home = 1 }
}

// ============================================
// КЛАССЫ ОБЪЕКТОВ
// ============================================
function block(x, y) {
    this.x = round(x / 40) * 40
    this.y = round(y / 40) * 40 + 29
    this.id = "blo"
    this.xh = round(x / 40) * 40

    this.show = function() {
        if (!player.dead && home == 0 && !editorMode) this.x -= (player.speed / 1.4)
        if (home == 1 || player.dead || editorMode) this.x = this.xh;

        fill(0, 0, 0)
        rectMode(CENTER)
        stroke(255, 50, 50)
        strokeWeight(3)
        rect(this.x, this.y, 40)
        noStroke();
        fill(255, 0, 0, 50);
        rect(this.x, this.y, 36);
        stroke(255, 100, 50);
        strokeWeight(2);
        noFill();
        rect(this.x, this.y, 40);
        noStroke();

        let playerLeft = player.x - 18;
        let playerRight = player.x + 18;
        let playerTop = player.y - 18;
        let playerBottom = player.y + 18;

        let blockLeft = this.x - 20;
        let blockRight = this.x + 20;
        let blockTop = this.y - 20;
        let blockBottom = this.y + 20;

        let hit = (playerRight > blockLeft && playerLeft < blockRight &&
                   playerBottom > blockTop && playerTop < blockBottom);

        if (hit && !editorMode) {
            if (player.mode == "cube") {
                if (playerBottom > blockTop && playerBottom < blockTop + 20 && player.yVel >= 0) {
                    player.y = blockTop - 18;
                    player.yVel = 0;
                    player.air = false;
                } else {
                    player.dead = true;
                    screenShake = 10;
                }
            } else if (player.mode == "ship" || player.mode == "ufo") {
                player.dead = true;
                screenShake = 10;
            }
        }
    }
}

function spike(x, y) {
    this.x = round(x / 40) * 40
    this.x2 = round(x / 40) * 40
    this.id = "spi"
    this.y = round(y / 40) * 40 + 29

    this.show = function() {
        if (!player.dead && home == 0 && !editorMode) this.x -= player.speed / 1.4
        if (home == 1 || player.dead || editorMode) this.x = this.x2;

        fill(0, 0, 0)
        rectMode(CENTER)
        stroke(255, 100, 0)
        strokeWeight(3)
        triangle(this.x - 20, this.y + 20, this.x + 20, this.y + 20, this.x, this.y - 20)
        noStroke();
        fill(255, 50, 0, 50);
        triangle(this.x - 16, this.y + 16, this.x + 16, this.y + 16, this.x, this.y - 16);
        noStroke()

        let playerLeft = player.x - 15;
        let playerRight = player.x + 15;
        let playerTop = player.y - 15;
        let playerBottom = player.y + 15;

        let spikeLeft = this.x - 15;
        let spikeRight = this.x + 15;
        let spikeTop = this.y - 15;
        let spikeBottom = this.y + 15;

        if (playerRight > spikeLeft && playerLeft < spikeRight &&
            playerBottom > spikeTop && playerTop < spikeBottom && !editorMode) {
            player.dead = true;
            screenShake = 10;
        }
    }
}

function portal(x, y, type) {
    this.x = round(x / 40) * 40
    this.x2 = round(x / 40) * 40
    this.y = y
    this.type = type
    this.id = (type == "ship") ? "psh" : "puf"
    this.activated = false

    this.show = function() {
        if (!player.dead && home == 0 && !editorMode) this.x -= player.speed / 1.4
        if (home == 1 || player.dead || editorMode) this.x = this.x2;

        rectMode(CENTER)
        strokeWeight(4)
        if (this.type == "ship") {
            stroke(0, 200, 255)
            fill(0, 200, 255, 100)
        } else {
            stroke(0, 255, 150)
            fill(0, 255, 150, 100)
        }
        rect(this.x, height / 2, 40, height)
        noStroke()
        if (this.type == "ship") fill(180, 240, 255, 150)
        else fill(150, 255, 200, 150)
        rect(this.x, height / 2, 20, height - 20)

        if (abs(player.x - this.x) > 100) {
            this.activated = false
        }

        if (!this.activated &&
            player.x > this.x - 20 && player.x < this.x + 20 && !editorMode) {
            player.mode = this.type
            this.activated = true
            player.yVel = 0
            player.ufoJumped = false
            screenShake = 5;
        }
    }
}

function flyingSpike(baseX, baseY) {
    this.baseX = baseX
    this.baseY = baseY
    this.currentY = baseY
    this.active = true
    
    this.show = function() {
        if (!this.active) return
        
        let playerScreenX = 75
        let spikeScreenX = this.baseX - player.xR
        
        if (abs(spikeScreenX - playerScreenX) < 300) {
            let diff = player.y - this.currentY
            if (abs(diff) > 2) {
                this.currentY += diff * 0.05
            }
        } else {
            let diff = this.baseY - this.currentY
            if (abs(diff) > 2) {
                this.currentY += diff * 0.03
            }
        }
        
        fill(255, 0, 0)
        rectMode(CENTER)
        stroke(255, 100, 0)
        strokeWeight(3)
        triangle(spikeScreenX - 15, this.currentY + 15, spikeScreenX + 15, this.currentY + 15, spikeScreenX, this.currentY - 15)
        
        fill(255, 255, 255)
        noStroke()
        ellipse(spikeScreenX - 5, this.currentY - 5, 8, 8)
        ellipse(spikeScreenX + 5, this.currentY - 5, 8, 8)
        
        fill(0, 0, 0)
        let lookDir = player.y > this.currentY ? 2 : -2
        ellipse(spikeScreenX - 5, this.currentY - 5 + lookDir, 4, 4)
        ellipse(spikeScreenX + 5, this.currentY - 5 + lookDir, 4, 4)
        
        let playerLeft = player.x - 15;
        let playerRight = player.x + 15;
        let playerTop = player.y - 15;
        let playerBottom = player.y + 15;

        let spikeLeft = spikeScreenX - 12;
        let spikeRight = spikeScreenX + 12;
        let spikeTop = this.currentY - 12;
        let spikeBottom = this.currentY + 12;

        if (playerRight > spikeLeft && playerLeft < spikeRight &&
            playerBottom > spikeTop && playerTop < spikeBottom) {
            if ((player.mode == "ship" || player.mode == "ufo") && abs(player.yVel) > 6) {
                this.active = false
                screenShake = 8;
            } else {
                player.dead = true
                screenShake = 10;
            }
        }
    }
}