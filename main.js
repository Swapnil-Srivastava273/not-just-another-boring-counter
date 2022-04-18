"use strict"
const main=document.getElementById("main");
const ctx=main.getContext("2d");
const cos30=3**0.5/2;
main.height=innerHeight;
main.width=innerWidth;
let counter=0;
// TBD: Background gradients, boards, buttons
// Gotta initiate all the towers
// Animation random or coordinated?
// Gotta find some beautiful gradients
// So, what tower size to pick?
// 10 rows
// If more than two should cover just less than half of the screen.
// x direction should be perfectly fit.
const ROWS=12;
let tempside=main.height/ROWS;
let tempcols=Math.ceil(main.width/(tempside*cos30));
let side=main.width/((tempcols-1)*cos30);
let towers=[];
let boardWidth=side*cos30*1.25;
let boardHeight=boardWidth*94/128;
let poleHeight=boardHeight;
//let imgContent=0;
document.querySelector(':root').style.setProperty("--fz",boardHeight/3+'px');
let maxHGlobal=main.height-side*ROWS/2;
let tInit=Date.now();
let t=0;
let lvl2boards=[];
let scoreboards=[];
main.style.zIndex=tempcols*ROWS+1;
let clickFunc=()=>{
    
    for(let b of lvl2boards){
        b.img.classList.add("lvl2-done");
    }
    
    document.removeEventListener("click",clickFunc);
}
document.addEventListener("click",clickFunc);
let resizeIsRepeating=false; //for throttling otherwise canvas will update too much and blink
window.addEventListener("resize",e=>{ //without this resize=boom 💥
    if(!resizeIsRepeating){
        resizeIsRepeating=true;
        setTimeout(()=>{
            resizeIsRepeating=false;
            main.height=innerHeight;
            main.width=innerWidth;
        },10);
    }
});
function updateScoreBoard(){
    for(let b of scoreboards){
        b.span2.innerText=counter;
    }
}
class Boards{
    // x,y,element
    constructor(x,y,tower,imgContent){
        this.x=x;
        this.y=y;
        this.tower=tower;
        this.element=document.createElement("div");
        this.element.classList.add("board");
        this.element.style.width=`${boardWidth}px`;
        this.element.style.height=`${boardHeight}px`;
        this.element.style.zIndex=ROWS-this.y;
        this.element.onclick=()=>{this.handleClick()};
        this.imgContent=imgContent;
        if(this.imgContent==4){
            this.isScore=true;
        }
        if(this.isScore){
            this.element.classList.add("score");
            let span1=document.createElement("span");
            span1.innerText="Counter:";
            //let br=document.createElement("br");
            let span2=document.createElement("span");
            span2.innerText=counter;
            this.element.appendChild(span1);
            //this.element.appendChild(br);
            this.element.appendChild(span2);
            this.span1=span1;
            this.span2=span2;
            scoreboards.push(this);

        }else{
            this.img=document.createElement("img");
            this.img.src=images[this.imgContent];
            if(this.imgContent==0){
                this.img.classList.add("lvl2");
                lvl2boards.push(this)
            }
            this.element.appendChild(this.img);
            //this.element.style.visibility='hidden';
        }
        document.body.appendChild(this.element);

    }
    draw(){
        let cx=this.x*side*cos30,cy=main.height-this.y*side/2-this.tower.height;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.lineTo(cx,cy-poleHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.clearRect(cx-boardWidth/2,cy-poleHeight-boardHeight,boardWidth,boardHeight);
        ctx.strokeRect(cx-boardWidth/2,cy-poleHeight-boardHeight,boardWidth,boardHeight);
        ctx.lineWidth=0.1;
        this.element.style.left=`${cx-boardWidth/2}px`;
        this.element.style.top=`${cy-poleHeight-boardHeight}px`
    }
    handleClick(){
        if(this.imgContent==1){
            counter++;
            updateScoreBoard();
        }else if(this.imgContent==2){
            if(counter>0){
                counter--;
            }
            updateScoreBoard();
        }else if(this.imgContent==3){

            counter=0;
            updateScoreBoard();
        }
    }

}
class Tower{
    // Height, position , animation , item.
    // Isometric angles : width fixed.
    // Draw, animate, z index adjustment, precise center location
    constructor(maxH,x,y,phase,freq){
        //this.height=height;
        // x and y assume origin at bottom left
        this.x=x;
        this.y=y;
        this.maxH=maxH;
        this.phase=phase;
        this.freq=freq;
        this.height=Math.sin(this.phase+Math.PI*this.freq*t)**4*this.maxH;
        this.item=null;
    }
    draw(){
        this.height=Math.sin(this.phase+Math.PI*this.freq*t)**4*this.maxH;
        let cx=this.x*side*cos30,cy=main.height-this.y*side/2-this.height;
        // Top
        //debugger
        ctx.lineWidth=0.1;
        ctx.beginPath();
        ctx.moveTo(cx-side*cos30,cy);
        ctx.lineTo(cx,cy-side/2);
        ctx.lineTo(cx+side*cos30,cy);
        ctx.lineTo(cx,cy+side/2);
        ctx.closePath();
        ctx.fillStyle=topG;
        ctx.fill();
        ctx.stroke();
        // Left
        ctx.beginPath();
        ctx.moveTo(cx-side*cos30,cy);
        ctx.lineTo(cx,cy+side/2);
        ctx.lineTo(cx,main.height);
        ctx.lineTo(cx-side*cos30,main.height);
        ctx.closePath();
        ctx.fillStyle=leftG;
        ctx.fill();
        ctx.stroke();
        // Right
        ctx.beginPath();
        ctx.moveTo(cx,cy+side/2);
        ctx.lineTo(cx+side*cos30,cy);
        ctx.lineTo(cx+side*cos30,main.height);
        ctx.lineTo(cx,main.height);        
        ctx.closePath();
        ctx.fillStyle=rightG;
        ctx.fill();
        ctx.stroke();
        if(this.item){
            this.item.draw();
        }
    }

}
for(let i=0;i<tempcols;i++){
    
    for(let j=0;j<ROWS;j++){
        if(j==0){
            towers.push([]);
        }
        if((i+j)%2==0){
            let tow=new Tower(maxHGlobal*Math.random(),i,j,Math.random()*Math.PI,1/(4+6*Math.random()));
            if(Math.random()>0.5){
                let bo=new Boards(i,j,tow,Math.floor(Math.random()*5));
                tow.item=bo;
            }
            towers[i].push(tow);
            // towers[i].push(new Tower(0,i,j));
            
        }else{
            towers[i].push(null);
        }
    }
}

let topG=ctx.createLinearGradient(0,0,main.width,main.height);
topG.addColorStop(0,'#f5a467');
topG.addColorStop(1,'#d66c1c');
let leftG=ctx.createLinearGradient(0,0,main.width,main.height);
leftG.addColorStop(0,'#7d604b');
leftG.addColorStop(1,'#402818');
let rightG=ctx.createLinearGradient(0,0,main.width,main.height);
rightG.addColorStop(0,'#ad612f');
rightG.addColorStop(1,'#69320e');
ctx.strokeStyle="#000";
ctx.lineWidth=0.1;

function run(){
    ctx.clearRect(0,0,main.width,main.height);
    let temp=Date.now();
    t=(temp-tInit)/1000;
    for(let j=ROWS-1;j>=0;j--){
        for(let i=0;i<tempcols;i++){
            if(towers[i][j]){
                towers[i][j].draw();
            }
        }
    }
    requestAnimationFrame(run);
}
run();