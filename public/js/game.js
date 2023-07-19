import socket from "/js/socket.js";

export let k = window.innerWidth / 3;
export let gridSize;
export let grid;
let canMove = 1;

socket.on('solved', function() {
    canMove = 0
});

socket.on('init', function(data) {
    grid = Array.from({
        length: data
    }, () => (Array.from({
        length: data
    }, () => (0))));
    gridSize = k / data;
});

socket.on('setgrid', function(data) {
    for (let count in data) {
        grid[data[count][0]][data[count][1]] = data[count][2];
    }
});

document.addEventListener("touchstart", function(event) {
    on(event.touches[0].clientX, event.touches[0].clientY);
    event.preventDefault();
});

document.addEventListener("mousedown", function(event) {
    on(event.clientX, event.clientY);
    event.preventDefault();
});

function on(x2, y2) {
    if (canMove) {
        for (let count in grid) {
            for (let coun in grid[count]) {
                if (x2 > coun * gridSize && x2 < coun * gridSize + gridSize && y2 > count * gridSize && y2 < count * gridSize + gridSize && grid[count][coun] < 6) {
                    grid[count][coun]++;
                    if (!(grid[count][coun] % 6)) grid[count][coun] = 0;
                }
            }
        }
        socket.emit("grid", grid);
    }
};

