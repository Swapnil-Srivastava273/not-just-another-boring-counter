"use strict"
const main=document.getElementById("main");
const ctx=main.getContext("2d");
const cos30=3**0.5/2;
main.height=innerHeight;
main.width=innerWidth;

// TBD: Background gradients, boards, buttons
// Gotta initiate all the towers
// Animation random or coordinated?
// Gotta find some beautiful gradients
// So, what tower size to pick?
// 10 rows
// If more than two should cover just less than half of the screen.
// x direction should be perfectly fit.
let tempside=main.height/10;
let tempcols=Math.ceil(main.width/(tempside*cos30));
let side=main.width/((tempcols-1)*cos30);
let towers=[];
class Tower{
    // Height, position , animation , item.
    // Isometric angles : width fixed.
    // Draw, animate, z index adjustment, precise center location
    constructor(height,x,y,item){
        this.height=height;
        // x and y assume origin at bottom left
        this.x=x;
        this.y=y;
        this.item=item;
    }
    draw(){
        let cx=this.x*side*cos30,cy=main.height-this.y*side/2-this.height;
        // Top
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
    }

}
for(let i=0;i<tempcols;i++){
    
    for(let j=0;j<10;j++){
        if(j==0){
            towers.push([]);
        }
        if((i+j)%2==0){
            towers[i].push(new Tower(Math.random()*(main.height-side*5),i,j));
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
//Test Run
for(let j=9;j>=0;j--){
    for(let i=0;i<tempcols;i++){
        if(towers[i][j]){
            towers[i][j].draw();
        }
    }
}