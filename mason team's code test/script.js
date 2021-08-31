// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  // and much more
  boardDisplay: null,
  cardActiveDispaly: null, 
  isPunishment: false,
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  game.startButton = document.querySelector('.game-stats__button')
  game.scoreDisplay = document.querySelector('.game-stats__score--value')
  game.timerDisplay = document.querySelector('.game-timer__bar')
  game.boardDisplay = document.querySelector('.game-board')
  game.levelDisplay = document.querySelector('.game-stats__level--value')
}

function startGame() {
  let { startButton } = game
   //获取元素的innerText
   //New Game说明是新游戏
   //Start Game说明已经游戏已经结束，要进行新游戏
   //End Game说明游戏再进行中，要结束游戏
    let text = startButton.innerText
    if (text == 'New Game') {
      startButton.innerText = 'End Game'
      updateTimerDisplay()
      handleCardFlip()
    } else if (text == 'Start Game') {
      startButton.innerText = 'End Game'
      game.score = 0
      updateScore(true)
      game.level = 1
      updateLevel()
      updateTimerDisplay()
      handleCardFlip()
  } else if (text == 'End Game') {
    handleGameOver()
  }
}

// sampleSize 这个方法想要冲前一个参数代表这个卡片堆里面随机取出后一个参数的数量的卡片，但是我没想出来怎么写😅···
const sampleSize =([], n = 1) =>{

}

function handleCardFlip() {
  // 获取等级、和游戏主体
  let { level, boardDisplay } = game
  // 获取与等级相对应的卡牌数组 1级为2 2级为8 3级为18
  let tempArr = sampleSize(CARD_TECHS, (level * level) * 2)
  // 将数组再合并一次，保证可以两两对应
  tempArr = tempArr.concat(tempArr)
  // 将数组打乱顺序
  tempArr = sampleSize(tempArr, tempArr.length)
  // 生成卡牌
  let html = ''
  tempArr.forEach(element => {
    html = html + `<div class="card ${ element }" data-tech="${ element }" onclick="handleCardClick(this)">
      <div class="card__face card__face--front"></div>
      <div class="card__face card__face--back"></div>
    </div>`
  });
  
  boardDisplay.style.gridTemplateColumns = `repeat(${ level * 2 }, 1fr)`;
  
  boardDisplay.innerHTML = html;

}

function nextLevel() {
  // 如果等级为3 那么结束游戏 否则升级
   let { level } = game
   if (level == 3) {
     //timeout 给动画反应时间
     setTimeout(() => {
       //结束游戏
       handleGameOver()
     }, 1000)
   } else {
     level++
     game.level = level
     updateLevel()
     updateTimerDisplay()
     setTimeout(() => {
       handleCardFlip()
     }, 1000)
   }
}

function handleGameOver() {
  // 获取分数与开始游戏的按钮
  let { score, startButton } = game
  // 如果倒计时没走完，结束倒计时
  if (game.timerInterval) {
    // 结束倒计时
    clearInterval(game.timerInterval)
  }
  // 更改按钮文字
  startButton.innerText = 'Start Game'
  // 弹出当前分数
  alert(`Congrat, your score is ${ score }`)
}

/*******************************************
/     UI update
/******************************************/

//isInitialization 是否初始化 是重新开始游戏 将分数设置为0 否说明匹配成功 分数 + 当前等级 ^ 2 x 当前倒计时剩余的时间
function updateScore(isInitialization) {
  let { scoreDisplay, level, timer, score } = game
  score = isInitialization ? 0 : (score + (Math.pow(level, 2) * timer));
  game.score = score;
  scoreDisplay.innerText = score;
}

function updateLevel(){
  let {level, levelDisplay} = game
  levelDisplay.innerText = level
}

function updateTimerDisplay() {

  game.timer = 60
  
  let{timerDisplay, timer} = game
  let time = timer

  if(timer < 0){
    handleGameOver()
  } else {
    timerDisplay.innerText = `${timer}`
  }

}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {}

function unBindCardClick(card) {}

function bindCardClick(el) {
  let { cardActiveDispaly, isPunishment, boardDisplay } = game
  if (isPunishment) return false
  el.classList.add('card--flipped')

  if (cardActiveDispaly) {
    var activeTech = cardActiveDispaly.dataset.tech
  }
  let tech = el.dataset.tech

  //将上一次点击的卡片元素与本次点击的卡片元素配对
  //activeTech与tech相同说明配对成功

  if (activeTech === tech) {
    // 配对成功，将上一次点击的卡片元素重置为null
    game.cardActiveDispaly = null
    updateScore()
    // 定义hasFlippedNum（含有card--flipped的卡牌数量）
    let hasFlippedNum = 0
    // 获取当前所有的卡牌元素
    let elementAll = boardDisplay.querySelectorAll('.card')
    // 循环当前所有的卡牌元素，判断每个卡牌是否被翻转
    elementAll.forEach(row => {
      if (row.classList.contains('card--flipped')) {
        hasFlippedNum++
      }
    })
    // 如果被翻转的卡牌数量等于全部的卡牌数量，说明当前全部配对成功
    if (hasFlippedNum == elementAll.length) {
      // 完成这个level 升级
      nextLevel()
    }
  } else {
    if (cardActiveDispaly) {
      game.isPunishment = true
      setTimeout(() => {
        el.classList.remove('card--flipped')
        cardActiveDispaly.classList.remove('card--flipped')
        game.cardActiveDispaly = null
        game.isPunishment = false
      }, 1500)
    } else {
      game.cardActiveDispaly = el
    }
  }

}
