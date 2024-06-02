// グローバル変数と定数
let totalMoney = 0;
let totalSpins = 0;
let remainingMedals = 0;
let settingNumber = 0;
let winStarts = 0;
let gamePaused = false;
let bigOrRegWon = false;
let spinSpeed = 200;
let bigWins = 0;
let regWins = 0;
let currentSetting;
const initialInvestment = 1000; // 初回投資金額
const reinvestmentAmount = 1000; // 再投資金額
let startAfterWinCount = 0;

// クラス定義
class Setting {
    constructor() {
        this.settingNum = 0;
        this.big = 0;
        this.reg = 0;
        this.totalProbability = 0; // 合算当選確率
    }

    settingMethod() {
        this.settingNum = Math.floor(Math.random() * 6);
        const settings = [
            [273, 440, 220], 
            [270, 440, 200], 
            [270, 331, 185],
            [259, 315, 155], 
            [259, 255, 145], 
            [255, 255, 130]
        ];
        // 合算当選確率を計算して設定
        [this.big, this.reg, this.totalProbability] = settings[this.settingNum];
    }
}

// ユーティリティ関数
function adjustSpinSpeed(speed) {
    const maxValue = 500; // スピン速度の最大値
    const reversedValue = maxValue - speed; // スライダーの値を逆転させる
    spinSpeed = reversedValue;
}

function clearResultMessage() {
    document.getElementById("resultMessage").textContent = ""; // メッセージを消去
}

function displayResultMessage(message) {
    document.getElementById("resultMessage").innerHTML += message + "<br>";
}

function updateResults() {
    document.getElementById("remainingMedals").textContent = remainingMedals.toLocaleString();
    document.getElementById("totalSpins").textContent = totalSpins.toLocaleString();

    if (!gamePaused && remainingMedals < 3) {
        document.getElementById("retryButton").style.display = "block";
    } else {
        document.getElementById("retryButton").style.display = "none";
    }
}

function displayAdditionalText(message) {
    document.getElementById("additionalText").textContent = message;
}

function clearAdditionalText() {
    document.getElementById("additionalText").textContent = "";
}

function displayNoMedalsOptions() {
    displayResultMessage("メダルがなくなりました。再投資または終了を選択してください。");
}

function displaySetting() {
    // 合算当選確率を表示
    const settingInfo = `設定${currentSetting.settingNum + 1}：BIG確率 ${currentSetting.big}、REG確率 ${currentSetting.reg}、合算当選確率 ${currentSetting.totalProbability}`;
    document.getElementById("settingInfo").textContent = settingInfo;
}

function displayStartAfterWinCount(){
    document.getElementById("startAfter").textContent = `${startAfterWinCount}`;
}

function initializeGame(moneyInput) {
    totalMoney = moneyInput;
    totalSpins = 0;
    remainingMedals = totalMoney / 1000 * 46;
    winStarts = 0;
    bigWins = 0;
    regWins = 0;
    bigOrRegWon = false;

    currentSetting = new Setting(); // 現在の設定を初期化
    currentSetting.settingMethod();
    slumpGraphData = []; // スランプグラフのデータをリセット
    displaySlumpGraph();

    settingNumber = currentSetting.settingNum;

    // UI の表示を修正
    document.getElementById("continueButton").style.display = "none";
    document.getElementById("stopButton").style.display = "none";

    displaySetting(); // 設定情報を表示
    document.getElementById("totalInvestment").textContent = `総投資：${totalMoney}円`;
    updateResults();
}

function playGame() {
    if (!gamePaused) {
        totalSpins++;
        startAfterWinCount++;
        remainingMedals -= 3;
        clearResultMessage();
        const bonus = spin();
        remainingMedals += bonus;

        updateResults();
        displayStartAfterWinCount();
        slumpGraphData.push(remainingMedals);

        // スランプグラフを表示
        displaySlumpGraph();

        if (remainingMedals >= 3) {
            setTimeout(playGame, spinSpeed);
        }
    }
}

function spin() {
    let bonus = 0;
    const grape = Math.floor(Math.random() * 5);
    const cherry = Math.floor(Math.random() * 32);
    const piero = Math.floor(Math.random() * 1092);
    const bell = Math.floor(Math.random() * 1092);
    const replay = Math.floor(Math.random() * 7);
    const big = Math.floor(Math.random() * currentSetting.big);
    const reg = Math.floor(Math.random() * currentSetting.reg);
    const bigOrReg = Math.floor(Math.random() * currentSetting.totalProbability);
    
    if (big === 1 || reg === 1 || bigOrReg === 1) {
        // BIGまたはREGが当たった場合
        if (big === 1) {
            // BIG当選
            bonus += 252;
            bigWins++;
            displayResultMessage("BIG当選！");
            bigOrRegWon = true;
            gamePaused = true;
            startAfterWinCount = 0;
    
            document.getElementById("continueButton").style.display = "block";
            document.getElementById("stopButton").style.display = "block";
        
        }else if(bigOrReg ===1){
            const bigOrRegSelect = Math.random();
            if(bigOrRegSelect ===1){
                bonus += 252;
                bigWins++;
                displayResultMessage("BIG当選！");
                bigOrRegWon = true;
                gamePaused = true;
                startAfterWinCount = 0;
        
                document.getElementById("continueButton").style.display = "block";
                document.getElementById("stopButton").style.display = "block";
            }else{
                bonus += 96;
                regWins++;
                displayResultMessage("REG当選！");
                bigOrRegWon = true;
                gamePaused = true;
                startAfterWinCount = 0;
        
                document.getElementById("continueButton").style.display = "block";
                document.getElementById("stopButton").style.display = "block";
            }
        }
        else {
            // REG当選
            bonus += 96;
            regWins++;
            displayResultMessage("REG当選！");
        }

        bigOrRegWon = true;
        gamePaused = true;
        startAfterWinCount = 0;

        document.getElementById("continueButton").style.display = "block";
        document.getElementById("stopButton").style.display = "block";
    }else{
    }
    // その他の役の判定
    if (grape === 1) {
        bonus += 8;
        displayAdditionalText("グレープが揃いました！");
        setTimeout(() => {
            clearAdditionalText();
        }, 500);
    }

    if (cherry === 1) {
        bonus += 2;
        displayAdditionalText("チェリーが揃いました！");
        setTimeout(() => {
            clearAdditionalText();
        }, 500);
    }

    if (piero === 1) {
        bonus += 10;
        displayAdditionalText("ピエロが揃いました！");
        setTimeout(() => {
            clearAdditionalText();
        }, 500);
    }

    if (bell === 1) {
        bonus += 14;
        displayAdditionalText("ベルが揃いました！");
        setTimeout(() => {
            clearAdditionalText();
        }, 500);
    }

    if (replay === 1) {
        bonus += 3;
        displayAdditionalText("リプレイが揃いました！");
        setTimeout(() => {
            clearAdditionalText();
        }, 500);
    }

    return bonus;
}



function startGame() {
    initializeGame(initialInvestment); // 初回投資金額を設定してゲームを開始
    // ゲーム開始ボタンを非表示に
    document.getElementById("startButton").style.display = "none";
    displayStartAfterWinCount();
    playGame();
}

function invest() {
    totalMoney += reinvestmentAmount;
    remainingMedals += reinvestmentAmount / 1000 * 46;
    updateResults();
    document.getElementById("totalInvestment").textContent = `総投資：${totalMoney}円`;
    gamePaused = false;
    playGame();
}

function continueGame() {
    // ゲームを再開
    totalSpins++;
    remainingMedals -= 3;
    updateResults();
    document.getElementById("continueButton").style.display = "none";
    document.getElementById("stopButton").style.display = "none";
    gamePaused = false;
    playGame();
}

function stopGame() {
    // ゲーム終了
    gamePaused = true;
    displayFinalResults();
}

function calculateGraphDimensions(data, containerWidth, containerHeight) {
    const maxDataValue = Math.max(...data); // データの最大値を取得
    const maxAllowedWidth = containerWidth; // コンテナの幅を最大幅として設定
    const maxAllowedHeight = containerHeight; // コンテナの高さを最大高さとして設定

    // データの長さが0の場合、0を返す
    if (data.length === 0) {
        return { graphWidth: 0, graphHeight: 0 };
    }

    const scaleFactorWidth = maxAllowedWidth / data.length; // データと幅のスケールファクターを計算
    const scaleFactorHeight = maxAllowedHeight / maxDataValue; // データと高さのスケールファクターを計算（最大値で割る）
    const calculatedWidth = Math.min(maxAllowedWidth, data.length * scaleFactorWidth); // 幅を計算し、最大値と比較して選択
    const calculatedHeight = Math.min(maxAllowedHeight, maxDataValue * scaleFactorHeight); // 高さを計算し、最大値と比較して選択
    return { graphWidth: calculatedWidth, graphHeight: calculatedHeight };
}

function displaySlumpGraph() {
    const slumpGraphContainer = document.getElementById("slumpGraph");
    slumpGraphContainer.innerHTML = ""; // グラフを初期化

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const containerWidth = slumpGraphContainer.clientWidth;
    const containerHeight = slumpGraphContainer.clientHeight;
    const { graphWidth, graphHeight } = calculateGraphDimensions(slumpGraphData, containerWidth, containerHeight);
    svg.setAttribute("height", graphHeight);
    svg.setAttribute("width", graphWidth);

    // ラインを描画
    const line = document.createElementNS(svgNS, "polyline");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#ff6600"); // オレンジ色の線
    line.setAttribute("stroke-width", "2");

    const points = []; // 各点の座標を格納する配列
    const interval = slumpGraphData.length > 1 ? (graphWidth / (slumpGraphData.length - 1)) : 0; // データポイント間の水平間隔
    for (let i = 0; i < slumpGraphData.length; i++) {
        points.push(`${i * interval},${graphHeight - (slumpGraphData[i] * graphHeight / 100)}`); // x座標、y座標（データを正規化してグラフの高さに合わせる）
    }
    line.setAttribute("points", points.join(" "));

    svg.appendChild(line);

    slumpGraphContainer.appendChild(svg);
}


// ウィンドウのリサイズ時にグラフを再描画する
window.addEventListener('resize', displaySlumpGraph);


function displayFinalResults() {
    const medalValue = 20;
    const productValue = 2000;
    const totalMedalsValue = remainingMedals * medalValue;
    let profit;

    if (totalMedalsValue >= productValue) {
        const numberOfProducts = Math.floor(totalMedalsValue / productValue);
        const remainingMedalsValue = totalMedalsValue % productValue;

        profit = totalMedalsValue - totalMoney;
        displayResultMessage(`設定:${settingNumber + 1} (BIG: ${bigWins}回, REG: ${regWins}回)<br>`);
        displayResultMessage(`収支：${numberOfProducts * 2000 - totalMoney}円<br>`);
        if (remainingMedalsValue > 0) {
            displayResultMessage(`余りのメダル数：${remainingMedalsValue / medalValue}枚<br>`);
        }
    } else {
        profit = totalMedalsValue - totalMoney;
        displayResultMessage(`余りメダル数：${remainingMedals}枚<br>`);
    }

    if (profit > 0) {
        displayResultMessage(`勝ち！`);
    } else {
        displayResultMessage("負け！<br>");
    }

    document.getElementById("continueButton").style.display = "none";
    document.getElementById("stopButton").style.display = "none";
    document.getElementById("retryButton").style.display = "block";
    document.getElementById("restartButton").style.display ="block";
}





