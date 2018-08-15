//=========== 踩地雷 JavaScript =========== 

//=========== 初始變數與function ================


/*==== 變數 ====*/
/*==== js為動態宣告變數,java.c++.c#...皆為靜態定型宣告變數 ====*/
nummines      = 10;            // 炸彈數量
minWidth      = 10;            // 地雷區寬度
minHeight     = 10;            // 地雷區長度
bombs         = new Array(10); // 地雷map (-1代表炸彈,0代表非炸彈且周圍無炸彈,數字代表周為炸彈數)
IsFirstButton = true;          // 遊戲起始點
alltime       = 180;           // 遊戲時間總長
numOfhearts   = 3;             // 愛心總數
numOfBombs    = 0;             // 紀錄插旗炸彈數量
numOfFlags    = 0;             // 紀錄插旗總數量

var queue = new Array();    // 建立queue


/*==== 建立二維bombs陣列 ====*/
/*==== js無二維陣列,因此先宣告一維,再把一維中宣告陣列 ====*/
for (i = 0; i < 10; i++)
{
    // 宣告一維陣列中產生二維
    bombs[i] = new Array(10);
    // 初始值皆為0 (尚未放入炸彈)
    for (j = 0; j < 10; j++)
    {
        bombs[i][j] = 0;
    }
}

/*==== 建立可以傳入X,Y值 並回傳button物件 ====*/
function getbtn(x,y)
{
    return document.getElementById(x+'_'+y);
}

//================================

//=========== 初始function ================

/*==== 初始化時,呼叫產生地雷區 ====*/
function createBombplace()
{
    // 取得踩地雷區html ID
    place = document.getElementById('bomb_place');

    // 製作地雷區Buttons
    for (i = 0; i < minWidth; i++) {
        for (j = 0 ; j < minHeight; j++) {
            // 製作button
            cell = document.createElement('button');
            // 設定每個btn的id,Ex:1_2(第一列從左數來第二個)
            cell.setAttribute('id', i + '_' + j);
            // 設定每個btn屬性(長寬,顏色,外觀)
            cell.setAttribute('style', 'height:60px;width:69px');
            // 設定每個btn原先屬性
            this.Battrsetting(cell);
            // 設定每個btn按下去觸發行為
            cell.setAttribute('onclick','push(this)');
            // 設定每個btn滾輪觸發行為
            cell.setAttribute('onmousewheel','wheel(this)');
            // 設定每個btn無空隙
            cell.innerHTML = '&nbsp';
            // 將btn放入地雷區中
            place.appendChild(cell);
        }
        /*== 透過innerHTML可以針對HTML和JS做雙向互動,做取得元素以及加入元素 ==*/
        // 設定換行
        place.innerHTML += "<br>";
    }

    // 將炸彈放進地雷區,並記住炸彈位址
    putBombs();

    // 計算框格周圍炸彈數,並記錄
    cntBombs();

    // 產生倒數器
    countTimer();
}

/*==== 將炸彈用亂數放入地雷區,並記錄位址 ====*/
function putBombs() {
    count = 0;
    while (count < nummines) {
        // 隨機亂數取出x,y位址
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);

        // 若炸彈無重複,將炸彈放入地雷區
        if (bombs[x][y] != -1) {
            bombs[x][y] = -1;
            count++;
        }
    }
}

/*==== 紀錄周圍炸彈數目 ====*/
function cntBombs() {
    // cnt紀錄跑多少次
    var cnt = 1;
    // 地雷區為 0_0 ~ 9_9 , 總共100個
    while (cnt <= 100) {
        // 要判斷的btn
        var btn_x;
        var btn_y;

        for (i = 0 ; i < 10 ; i++) {
            btn_x = i;
            for (j = 0; j < 10; j++) {
                btn_y = j;
                var numofbombs = arroundBombs(btn_x, btn_y);
                bombs[i][j] = numofbombs;
            }
        }
        cnt++;
    }
}

/*==== 數周圍炸彈數目 ====*/
function arroundBombs(x, y) {
    // 紀錄炸彈數
    var countbombs = 0;

    // 若目標地區非炸彈
    if (bombs[x][y] != -1) {

        // 若是在非地雷邊邊(-1,-1),(-1,0),(-1,+1),(0,-1),(0,+1),(+1,-1),(+1,0),(+1,+1)
        if (x != 0 && x != 9 && y != 0 && y != 9) {
            if (bombs[x - 1][y - 1] == -1) countbombs++;
            if (bombs[x - 1][y]     == -1) countbombs++;
            if (bombs[x - 1][y + 1] == -1) countbombs++;
            if (bombs[x][y - 1]     == -1) countbombs++;
            if (bombs[x][y + 1]     == -1) countbombs++;
            if (bombs[x + 1][y - 1] == -1) countbombs++;
            if (bombs[x + 1][y]     == -1) countbombs++;
            if (bombs[x + 1][y + 1] == -1) countbombs++;
        }
        // 若是在上面一排
        else if (x == 0) {
            // 不是上排角角(0,-1),(0,+1),(+1,-1),(+1,0),(+1,+1)
            if (y != 0 && y != 9) {
                if (bombs[x][y - 1]     == -1) countbombs++;
                if (bombs[x][y + 1]     == -1) countbombs++;
                if (bombs[x + 1][y - 1] == -1) countbombs++;
                if (bombs[x + 1][y]     == -1) countbombs++;
                if (bombs[x + 1][y + 1] == -1) countbombs++;
            }
            // 當處於(0,0)時 (0,+1),(+1,0),(+1,+1)
            else if (y == 0) {
                if (bombs[x][y + 1]     == -1) countbombs++;
                if (bombs[x + 1][y]     == -1) countbombs++;
                if (bombs[x + 1][y + 1] == -1) countbombs++;
            }
            // 當處於(0,9)時 (0,-1),(+1,-1),(+1,0)
            else {
                if (bombs[x][y - 1]     == -1) countbombs++;
                if (bombs[x + 1][y - 1] == -1) countbombs++;
                if (bombs[x + 1][y]     == -1) countbombs++;
            }
        }
        // 若是在下面一排
        else if (x == 9) {
            // 不是下排角角(0,-1),(-1,-1),(-1,0),(-1,+1),(0,+1)
            if (y != 0 && y != 9) {
                if (bombs[x][y - 1]     == -1) countbombs++;
                if (bombs[x - 1][y - 1] == -1) countbombs++;
                if (bombs[x - 1][y]     == -1) countbombs++;
                if (bombs[x - 1][y + 1] == -1) countbombs++;
                if (bombs[x][y + 1]     == -1) countbombs++;
            }
            // 當處於(9,0)時 (-1,0),(-1,+1),(0,+1)
            else if (x == 9) {
                if (bombs[x - 1][y]     == -1) countbombs++;
                if (bombs[x - 1][y + 1] == -1) countbombs++;
                if (bombs[x][y + 1]     == -1) countbombs++;
            }
            // 當處於(9,9)時 (0,-1),(-1,-1),(-1,0)
            else {
                if (bombs[x][y - 1]     == -1) countbombs++;
                if (bombs[x - 1][y - 1] == -1) countbombs++;
                if (bombs[x - 1][y]     == -1) countbombs++;
            }
        }
        // 若是在左邊一排 (-1,0),(-1,+1),(0,+1),(+1,0),(+1,+1)
        else if (y == 0) {
            if (bombs[x - 1][y]     == -1) countbombs++;
            if (bombs[x - 1][y + 1] == -1) countbombs++;
            if (bombs[x][y + 1]     == -1) countbombs++;
            if (bombs[x + 1][y]     == -1) countbombs++;
            if (bombs[x + 1][y + 1] == -1) countbombs++;
        }
        // 若是在右邊一排 (-1,-1),(-1,0),(0,-1),(+1,-1),(+1,0)
        else {
            if (bombs[x][y - 1]     == -1) countbombs++;
            if (bombs[x - 1][y - 1] == -1) countbombs++;
            if (bombs[x - 1][y]     == -1) countbombs++;
            if (bombs[x + 1][y - 1] == -1) countbombs++;
            if (bombs[x + 1][y]     == -1) countbombs++;
        }
    }
    else {
        // 若為炸彈
        countbombs = -1;
    }
    return countbombs;
}

/*==== 原先屬性設定 =====*/
function Battrsetting(btn)
{
    // 屬性設定
    btn.style.backgroundColor    = '#DCF1A1';
    btn.style.border             = 'dashed';
    btn.style.borderColor        = '#AEC965';
}

/*==== 共同變色後屬性設定 ====*/
function attrsetting(btn) {
    // 屬性設定
    btn.style.backgroundRepeat   = 'no-repeat';
    btn.style.backgroundPosition = 'center';
    btn.style.backgroundSize     = '48px 53px';
    btn.style.backgroundColor    = '#56B48C';
    btn.style.borderColor        = '#A7C763';
}

/*==== 格式化倒數器 ========*/
function syntextTime(alltime)
{
    var m = Math.floor(alltime / 60);
    var s = alltime % 60;

    // 若為個位數,前面補0
    if (s < 10) s = "0" + s;

    var timetext = "0" + m + "'" + s + "''";
    return timetext;

}

/*==== 產生倒數 ====*/
function countTimer()
{
    // 格式化倒數器
    timetext = syntextTime(alltime);
    // 傳入html中
    document.getElementById("time").innerText = timetext;
}

//================================

/*==== 開始倒數 ====*/
function timer()
{
    // 若開始,每一秒去做倒數
    setInterval("timmer()", 1000);
}
// setInterval function扣此參數
function timmer()
{
    // 倒數扣秒數
    if( --alltime == 0 ) gameOver();
    // 傳入html中
    document.getElementById("time").innerText = syntextTime(alltime);

}

//================================

//=========== 觸發事件 ================

/*==== 觸發按下button ====*/
function push(btn)
{
    // 判斷是否起始進入遊戲,並開始倒數計時
    if (IsFirstButton)
    {
        timer();
        IsFirstButton = false;
    }

    // 擷取ID,去判斷是否在bombs陣列內
    var ID  = btn.id;
    // btn 座標
    var x   = ID.substr(0,1);
    var y   = ID.substr(2,1);
    // 產生button變數
    var btn = document.getElementById(ID);

    // 踩到炸彈,設置炸彈圖片
    if (bombs[x][y] == -1) {
        // 圖片URL("url('相對路徑')")
        var picURL           = "url('pic/explosion.png')";

        // 設定炸彈區域屬性
        btn.style.background = picURL;

        // 共同屬性設定
        this.attrsetting(btn);

        // 若愛心沒有則gameover,否則省去一個愛心
        if ( --numOfhearts > 0)
        {
            img_heart = document.getElementById('h' + numOfhearts);
            img_heart.style.display = "none";
        }
        else
        {
            gameOver(1);
        }


    }
    // 非踩到炸彈,設置數字圖片
    else if (bombs[x][y] > 0) {

        // 翻開數字
        openNum(x, y);
        // 共同屬性設定
        this.attrsetting(btn);

    }
    // 空白區域
    else
    {
        doOpenSpace(btn,x,y);
    }

    // 按過的按鈕無法再操作
    btn.disabled = true;
}

/*==== 觸發滑動button ====*/
function wheel(btn)
{
    var x = btn.id.substr(0,1);
    var y = btn.id.substr(2,1);

    // 進行插旗
    if (!this.IsOpen(x,y))
    {
        // 設定插旗效果
        btn.style.backgroundImage = "url('pic/flag.png')";
        // 共同屬性設定
        this.attrsetting(btn);
        // 旗子數量增加
        numOfFlags++;

        // 判斷插旗是否為炸彈,是的話要把旗標設true並且記錄炸彈數
        if(bombs[x][y] == -1)
        {
            numOfBombs++;
        }
        // 若插旗為同樣炸彈數量且為對的區域,勝利 (可能有先爆掉的+插旗對的數量)
        if ( ((numOfBombs+(3-numOfhearts)) == nummines) && (bombs[x][y] == -1))
        {
            if(numOfFlags == nummines)
            gameOver(0);
        }

    }
    // 取消插旗
    else
    {
        // 旗子數量減少
        numOfFlags--;

        // 背景設空,設回原先屬性
        btn.style.backgroundImage = "";
        this.Battrsetting(btn);

        // 判斷取消插旗是否為炸彈, 是的話要把旗標設false並且記錄炸彈數
        if (bombs[x][y] == -1)
        {
            numOfBombs--;
        }
    }
}

//================================

/*==== 翻開空白區域(bfs algo.) ====*/
function doOpenSpace(btn,x,y)
{
    // 傳入原先button物件以及其x與y值
    // 在queue中放入目標btn,並做開啟動作
    queue.push(btn);
    openNum(x, y);

    while(queue.length > 0)
    {
        // 取出btn (js的)
        var goal_btn = queue.shift();
        var x = parseInt(goal_btn.id.substr(0, 1));
        var y = parseInt(goal_btn.id.substr(2, 1));


        // 開始去判斷目標btn周圍是否有白色,並且塞入queue中
        // 判斷標準: 不能為null && 不能為炸彈(-1) && 還沒打開過

        // 判斷上方
        if ( (getbtn( (x - 1), y) != null) && (bombs[x-1][y] >=0 ) && !IsOpen((x-1),y))
        {
            // 做打開動作
            openNum((x - 1), y);
            // 若為空白區域(0),要塞去queue
            if (bombs[x - 1][y] == 0) queue.push(getbtn((x - 1), y));
            // 禁止再度更改btn,若為已插旗則跳過
            getbtn((x - 1), y).disabled = true;
        }
        // 判斷右方
        if ((getbtn(x, (y + 1)) != null) && (bombs[x][y + 1] >= 0) && !IsOpen(x, (y + 1)))
        {
            // 做打開動作
            openNum(x, (y + 1));
            // 若為空白區域(0),要塞去queue
            if (bombs[x][y + 1] == 0) queue.push(getbtn(x, (y + 1)));
            // 禁止再度更改btn,若為已插旗則跳過
            getbtn(x, (y + 1)).disabled = true;
        }
        // 判斷下方
        if ((getbtn((x + 1), y) != null) && (bombs[x + 1][y] >= 0) && !IsOpen((x + 1), y))
        {
            // 做打開動作
            openNum((x + 1), y);
            // 若為空白區域(0),要塞去queue
            if (bombs[x + 1][y] == 0) queue.push(getbtn((x + 1), y));
            // 禁止再度更改btn,若為已插旗則跳過
            getbtn((x + 1), y).disabled = true;
        }
        // 判斷左方
        if ((getbtn(x, (y - 1)) != null) && (bombs[x][y - 1] >= 0) && !IsOpen(x, (y - 1)))
        {
            // 做打開動作
            openNum(x, (y - 1));
            // 若為空白區域(0),要塞去queue
            if (bombs[x][y - 1] == 0) queue.push(getbtn(x, (y - 1)));
            // 禁止再度更改btn,若為已插旗則跳過
            getbtn(x, (y - 1)).disabled = true;
        }

    }

}

/*==== 翻開數字 =====*/
function openNum(a,b)
{
    // 將x,y座標值轉換為btn物件
    var bbtn = document.getElementById(a+'_'+b);
    // 針對數字做背景設定(大於0代表數字,等於0為空白)
    switch (bombs[a][b])
    {
        case 1:
            bbtn.style.backgroundImage = "url('pic/number/one.png')";
            break;
        case 2:
            bbtn.style.backgroundImage = "url('pic/number/two.png')";
            break;
        case 3:
            bbtn.style.backgroundImage = "url('pic/number/three.png')";
            break;
        case 4:
            bbtn.style.backgroundImage = "url('pic/number/four.png')";
            break;
        case 5:
            bbtn.style.backgroundImage = "url('pic/number/five.png')";
            break;
        case 6:
            bbtn.style.backgroundImage = "url('pic/number/six.png')";
            break;
        case 7:
            bbtn.style.backgroundImage = "url('pic/number/seven.png')";
            break;
        case 8:
            bbtn.style.backgroundImage = "url('pic/number/eight.png')";
            break;
        case 0:
            bbtn.style.backgroundColor = '#56B48C';
            break;
    }
    // 共同屬性設定
    this.attrsetting(bbtn);
}

/*==== 判斷是否開過(用底色變更作為判斷) ====*/
function IsOpen(x,y)
{
    var btn = document.getElementById(x+'_'+y);

    if (btn.style.backgroundColor == "rgb(86, 180, 140)")
        return true;
    else
        return false;
}

/*==== game over 事件 =====*/
function gameOver(num)
{
    switch(num)
    {
        case 0: document.getElementById("gameover_text").innerText = "YOU WIN!";
            break;
        case 1: document.getElementById("gameover_text").innerText = "YOU LOSE!";
            break;
    
    }
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
}

