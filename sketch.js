let gameState = "WAITING"; // WAITING, READY, NOW, WIN, LOSE, EARLY
let timer = 0;
let flashTime = 0;
let playerReactionTime = 0;

// 敵の反応速度（日本人の平均反射神経：220ミリ秒）
const ENEMY_REACTION_TIME = 265; 

// アニメーション用の位置変数
let playerX = 150;
let enemyX = 450;
let slashX = 0;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
}

function draw() {
  // 背景（状態によって色を変える）
  if (gameState === "NOW") {
    background(255, 50, 50); // 「！」の時は画面が真っ赤に！
  } else {
    background(230, 240, 250); // 普段はさわやかな青空風
  }

  // 地面を描く
  fill(100, 150, 100);
  noStroke();
  rect(0, 300, width, 100);

  // キャラクターの描画（ただの四角だけど色と位置で表現！）
  drawCharacters();

  // 中央のUIテキスト表示
  drawUI();

  // --- ゲームのルール処理 ---
  if (gameState === "READY") {
    if (millis() > flashTime) {
      gameState = "NOW";
      timer = millis(); // 「！」が出た瞬間
    }
  } 
  else if (gameState === "NOW") {
    // プレイヤーが押す前に敵の反応時間が過ぎたら負け
    if (millis() - timer > ENEMY_REACTION_TIME) {
      gameState = "LOSE";
      enemyX = 200; // 敵が一瞬で間合いを詰めてくる
    }
  }
}

// キャラクターを描く関数
function drawCharacters() {
  stroke(0);
  strokeWeight(2);

  // プレイヤー（青い四角）
  if (gameState === "WIN") {
    fill(50, 100, 255);
    rect(playerX, 220, 40, 80); // 勝ったら直立
  } else if (gameState === "EARLY") {
    fill(150);
    rect(playerX, 240, 40, 60); // お手付きはズッコケる
  } else {
    fill(50, 100, 255);
    rect(playerX, 240, 40, 60); // 普段の構え
  }

  // 敵（赤い四角）
  if (gameState === "LOSE") {
    fill(255, 50, 50);
    rect(enemyX, 220, 40, 80); // 敵が勝ったら直立
  } else if (gameState === "WIN") {
    fill(200); // 敵が負けたらグレーになって倒れる
    push();
    translate(enemyX, 280);
    rotate(HALF_PI);
    rect(0, 0, 40, 80);
    pop();
  } else {
    fill(255, 50, 50);
    rect(enemyX, 240, 40, 60); // 普段の構え
  }

  // 斬撃エフェクト（プレイヤーが勝ったとき）
  if (gameState === "WIN") {
    stroke(255, 255, 0);
    strokeWeight(8);
    line(430, 210, 470, 290);
  }
}

// 文字を表示する関数
function drawUI() {
  noStroke();
  fill(0);
  textSize(24);

  if (gameState === "WAITING") {
    textSize(32);
    text("刹那の見切り 抜刀編", width / 2, 100);
    textSize(20);
    text("画面クリック か スペースキー で開始", width / 2, 150);
  } 
  else if (gameState === "READY") {
    textSize(28);
    text("はっけよい...", width / 2, 100);
  } 
  else if (gameState === "NOW") {
    fill(255, 255, 0);
    textSize(80);
    text("！", width / 2, 120);
  } 
  else if (gameState === "WIN") {
    fill(0, 150, 0);
    textSize(36);
    text("勝負あり！", width / 2, 80);
    textSize(20);
    fill(0);
    text(`あなたの反応: ${playerReactionTime} ms`, width / 2, 130);
    text(`（日本平均の壁: ${ENEMY_REACTION_TIME} ms）`, width / 2, 160);
    text("クリックで次へ", width / 2, 350);
  } 
  else if (gameState === "LOSE") {
    fill(200, 0, 0);
    textSize(36);
    text("おそい！", width / 2, 80);
    textSize(20);
    fill(0);
    text(`敵が動いた速さ: ${ENEMY_REACTION_TIME} ms`, width / 2, 130);
    text("クリックで次へ", width / 2, 350);
  } 
  else if (gameState === "EARLY") {
    fill(150, 100, 0);
    textSize(36);
    text("お手付き！", width / 2, 80);
    textSize(20);
    fill(0);
    text("あせってはならぬ", width / 2, 130);
    text("クリックで次へ", width / 2, 350);
  }
}

// 入力があったときの処理
function action() {
  if (gameState === "WAITING") {
    resetGame();
    gameState = "READY";
  } 
  else if (gameState === "READY") {
    gameState = "EARLY";
  } 
  else if (gameState === "NOW") {
    playerReactionTime = Math.floor(millis() - timer);
    playerX = 400; // プレイヤーが一瞬で相手の目の前に移動！
    gameState = "WIN";
  } 
  else if (gameState === "WIN" || gameState === "LOSE" || gameState === "EARLY") {
    gameState = "WAITING";
  }
}

function mousePressed() { action(); }
function keyPressed() { if (key === ' ') action(); }

function resetGame() {
  playerX = 150;
  enemyX = 450;
  flashTime = millis() + random(2000, 5000); 
}
