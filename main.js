'use strict';

var clickCellId = -1;
const rowsIndex=[
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]
];

const colsIndex=[
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15]
];

const boxSum = 1+2+3+4;

var timerId;
var gameTime=0.0;

function onTick() {
    gameTime += 0.15;
    // console.log('gameTime :', gameTime);
    $('#timeTxt').text('Time : '+gameTime.toFixed(2)+' Secs');
}

$(()=>{
    $("#menu").hide();
    console.log('ready to rock ');

    $('.sudo-table').hide();

    $('#playbtn').click(()=>{
        $('#playbtn').hide();
        $('.sudo-table').show();

        timerId = setInterval(onTick, 150);
    });

    // create 4x4 cells
    for (let i = 0; i < 16; i++) {
        $('.sudo-table').append('<div data-id="'+i+'" class="sudo-cell active"></div>');
    }

    $(document).click((e)=>{
        if($(e.target).hasClass('sudo-cell')){
            console.log('click on sudo cell');
        } else {
            $("#menu").hide();
        }
    });

    loadRandomValues();

    // click listener
    // $('.sudo-cell.active').click((e)=>{
    //     console.log('cell click. val = '+$(e.target).text()+'id='+$(e.target).data('id'));
    //     clickCellId = $(e.target).data('id');
    //     // show menu
    //     $("#menu").css({
    //             'left': $(e.target).offset().left + $(e.target).width()*0.25,
    //             'top': $(e.target).offset().top + $(e.target).height()*0.35
    //     }).show();
    // });

    // mouse over listener
    $('.sudo-cell.active').on('mouseover',(e)=>{
        // show menu
        $("#menu").show();
        // console.log('cell click. val = '+$(e.target).text()+'id='+$(e.target).data('id'));
        clickCellId = $(e.target).data('id');
        
        // show menu
        $("#menu").css({
            'left': $(e.target).offset().left + $(e.target).width()*0.25,
            'top': $(e.target).offset().top + $(e.target).height()*0.35
    }).show();
    });


    $("#menu>.num").click((e)=>{
        $('.sudo-table :nth-child('+(clickCellId+1)+')').text($(e.target).text());
        checkForGameComplete();
    });
});

function checkForGameComplete() {
    var isGameWon = true;
    for (let i = 0; i < rowsIndex.length; i++) {
        const rows = rowsIndex[i];
        const cols = colsIndex[i];
        var colSum=0, rowSum=0;
        for (let j = 0; j < rows.length; j++) {
            rowSum += parseInt($('.sudo-table :nth-child('+(rows[j]+1)+')').text());
            colSum += parseInt($('.sudo-table :nth-child('+(cols[j]+1)+')').text());
        }
        if(rowSum!=boxSum || colSum!=boxSum){
            console.log('error in sum');
            isGameWon = false;
            break;
        }
    }

    if(isGameWon){
        console.log('isGameWon :', isGameWon);
        clearInterval(timerId);
        $('#timeTxt').text('Game Won !! Time taken : '+gameTime.toFixed(2)+' Secs');
        $('.sudo-cell.active').unbind('mouseover');
        $("#menu").hide();
    }
}

function loadRandomValues() {
    var valArr = [1,2,3,4];
    valArr.sort(shuff);
    var rowIndex = [0,1,2,3];
    // randIndexes.sort(shuff);

    //playable condition only when all box have atleast 1;
    var randIndexes = [];

    for (let i = 0; i < 2; i++) {
        if(i==0){
            const rndPos = parseInt(Math.random()*4);
            randIndexes.push(rndPos);
            rowIndex.splice(rowIndex.indexOf(rndPos),1);
            var nxtRndPos;
            if(rndPos<2){
                nxtRndPos = parseInt(Math.random()*2+2);
            }else{
                nxtRndPos = parseInt(Math.random()*2);
            }
            randIndexes.push(nxtRndPos);
            rowIndex.splice(rowIndex.indexOf(nxtRndPos),1);
        }else{
            if(shuff()>0){
                randIndexes.push(rowIndex[0]);
                randIndexes.push(rowIndex[1]);
            }else{
                randIndexes.push(rowIndex[1]);
                randIndexes.push(rowIndex[0]);
            }
        }
    }

    console.log('randIndexes :', randIndexes);

    
    for (let i = 0; i < valArr.length; i++) {
        const index = rowsIndex[i][randIndexes[i]];

        $('.sudo-table :nth-child('+(index+1)+')').text(valArr[i]);
        $('.sudo-table :nth-child('+(index+1)+')').removeClass('active');
    }
    
    console.log('valArr :', valArr);
    

}

function shuff() { return 0.5 - Math.random() }