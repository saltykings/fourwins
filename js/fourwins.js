
//some shitty variable

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//7 breit / 7 hoch

var rows = 7;
var columns = 7;

function gameArea(){
    this.rowColumns = createRowColumns(rows,columns),
    
    this.draw = function(){
        //Cells ist ein array mit array
        console.log("calling draw of gameArea");
        console.log("rows: " + this.rowColumns.length);
        for(i = 0; i < this.rowColumns.length; i++){
            var row = this.rowColumns[i];
            for(j = 0; j < row.length; j++){
                var cell = row[j];
                cell.draw();
            }
        }
    },

    this.findClicked = function(x,y){
        for(i = 0; i < this.rowColumns.length; i++){
        var row = this.rowColumns[i];
            for(j = 0; j < row.length; j++){
                var cell = row[j];
                if(cell.isClicked(x,y)){
                    return cell;
                }
            }
        }
    },

    this.reset = function(){
        for(i = 0; i < this.rowColumns.length; i++){
            var row = this.rowColumns[i];
                for(j = 0; j < row.length; j++){
                    var cell = row[j];
                   cell.clicked = false;
                   cell.draw();
                }
            }
    }


}

var myGameArea = new gameArea();

myGameArea.draw();

//cell is a single cell in the gamespace 
function cell(x, y, width, height){
    this.x = x,
    this.y = y,
    this.width = width,
    this.height = height,
    this.clicked = false,

    this.color = '#999966',
    this.owner = undefined,

    this.draw = function(){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(this.x, this.y, this.width, this.height); 
        //ctx.fillStyle = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6); //Random color

        if(this.owner != undefined){
            this.color = this.owner.color;
        }
        ctx.fillStyle = this.color;
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);

    },

    this.setOwner = function(owner){
        this.owner = owner;
    },

    //isClicked returns true if the click coordinates are inside the area of the cell
    this.isClicked = function(x,y) {
        if(
            x >= this.x && 
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height){
                return true;
            }

        return false;
        }
}

//if restart is used, all cells are reset
function restart(){
    myGameArea.reset();
}

//createRowColumns returns an array of rows containing row arrays which contain cells.
function createRowColumns(rows, columns){
    console.log("createRowColumns start: rows:%s, colums:%s", rows,columns)
    //rows contains multiple row arrays
    var rowColumns = [];
    //erzeuge x rows
    for(var i = 0; i < rows; i++){
        //a row contains cells
        var row = [];
        //now we add cells by the amount of columns we want (the cell knows its x and y)
        for(var j = 0; j < columns; j++){
            console.log("creating cell: (%s|%s)", i,j)
            row.push(new cell(i* 50, j * 50, 50, 50, ctx));
        }
        
        //add the row to the list of rows
        rowColumns.push(row);
    }

    return rowColumns;
}

var player1 = {
    color: '#FF0000'
}

var player2 = {
    color: '#0000FF'
}

//rightclick
canvas.addEventListener('contextmenu', 
function(e) {
    e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    var clickedCell = myGameArea.findClicked(x,y);

    if(clickedCell != undefined){
        console.log(clickedCell);
        clickedCell.setOwner(player2);
        clickedCell.clicked = true;
        clickedCell.draw();
    }else{
        console.log("player2 did not click on a cell");
    }
}, false);

canvas.addEventListener('click',function(e){
    var x = e.clientX;
    var y = e.clientY;

    console.log("player1 clicked! (%s|%s)",x,y);
    var clickedCell = myGameArea.findClicked(x,y);

   if(clickedCell != undefined){
       console.log(clickedCell)
       clickedCell.setOwner(player1);
       clickedCell.clicked = true;
       clickedCell.draw();
   }else{
       console.log("player1 did not click on a cell");
   }
}, false)