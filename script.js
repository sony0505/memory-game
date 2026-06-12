// --- 題目設定區 ---
const gameSettings = [
    { text: "無線網路", image: "images/wifi.png", description: "這是 Wi-Fi 無線網路，可以讓手機免費上網喔！" },
    { text: "掃描條碼", image: "images/qrcode.png", description: "這是 QR Code 行動條碼，用相機掃一下就可以看到資訊喔！" },
    { text: "行動支付", image: "images/pay.png", description: "這是行動支付，出門不用帶錢包，手機嗶一下就能買菜！" },
    { text: "視訊通話", image: "images/video.png", description: "這是視訊通話，可以從螢幕上看到遠方的孫子喔！" },
];

let cardData = [];
let flippedCards = [];
let matchedCount = 0;
let isProcessing = false;

function prepareCards() {
    cardData = [];
    gameSettings.forEach((item, index) => {
        cardData.push({ id: index + 'a', type: "icon", matchId: index, voice: item.description, imgSrc: item.image });
        cardData.push({ id: index + 'b', type: "text", matchId: index, voice: item.description, content: item.text });
    });
}

function speak(text) {
    window.speechSynthesis.cancel();
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    prepareCards();
    const shuffledData = shuffle([...cardData]);

    shuffledData.forEach(data => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = data.id;
        card.dataset.matchId = data.matchId;
        card.dataset.voice = data.voice;
        card.innerText = '❓';

        if (data.type === "icon") {
            card.classList.add('icon-card');
            card.dataset.imgSrc = data.imgSrc;
        } else {
            card.classList.add('text-card');
            card.dataset.content = data.content;
        }

        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (isProcessing) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    
    if (this.classList.contains('icon-card')) {
        this.innerText = ''; 
        this.style.backgroundImage = `url('${this.dataset.imgSrc}')`;
    } else {
        this.innerText = this.dataset.content;
    }

    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    isProcessing = true;
    const [card1, card2] = flippedCards;
    const msgBox = document.getElementById('message-box');

    if (card1.dataset.matchId === card2.dataset.matchId) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        const successText = card1.dataset.voice;
        msgBox.innerText = "答對了！" + successText;
        speak("答對了！" + successText);
        
        matchedCount += 2;
        flippedCards = [];
        isProcessing = false;

        if (matchedCount === cardData.length) {
            setTimeout(() => {
                msgBox.innerText = "🎉 太棒了！全部過關！阿公阿嬤好厲害！";
                speak("太棒了！全部過關！阿公阿嬤好厲害！");
            }, 1000);
        }
    } else {
        msgBox.innerText = "哎呀，不一樣喔，再試試看！";
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.innerText = '❓';
            card1.style.backgroundImage = 'none';
            card2.classList.remove('flipped');
            card2.innerText = '❓';
            card2.style.backgroundImage = 'none';
            msgBox.innerText = "繼續加油！";
            flippedCards = [];
            isProcessing = false;
        }, 1500);
    }
}

function initGame() {
    matchedCount = 0;
    flippedCards = [];
    isProcessing = false;
    document.getElementById('message-box').innerText = "歡迎來挑戰！點擊卡片開始吧！";
    window.speechSynthesis.cancel();
    createBoard();
}

// 使用更現代且穩定的事件監聽方式來啟動遊戲
document.addEventListener('DOMContentLoaded', initGame);