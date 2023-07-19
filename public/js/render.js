import {
    k,
    gridSize,
    grid,
    canMove,
    turns
} from "/js/game.js";

import socket from "/js/socket.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let o = Date.now();
let ka;

canvas.oncontextmenu = function(e) {
    e.preventDefault();
};

let colors = ["#E60000", "#E68E00", "#E6E500", "#45E600", "#0049E6", "#7000E6", "#FF5B5B", "#FFBC50", "#FFFE5A", "#92FF63", "#568CFF", "#B773FF"];

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

let fill = "#858585";
socket.on('solved', function() {
    fill = "#00AB1C";
    setTimeout(() => {
        location.reload()
    }, 4000)
});

requestAnimationFrame(function draw() {
    if (
        canvas.width !== window.innerWidth ||
        canvas.height !== window.innerHeight
    ) {
        update();
    };
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "#E2E2E2";
    for (let count = 0; count < k; count += gridSize) {
        ctx.beginPath();
        ctx.moveTo(count, 0);
        ctx.lineTo(count, k);
        ctx.stroke();
    };
    for (let count = 0; count < k; count += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, count);
        ctx.lineTo(k, count);
        ctx.stroke();
    };
    for (let count in grid) {
        for (let coun in grid) {
            ctx.fillStyle = colors[grid[count][coun]];
            ctx.fillRect(coun * gridSize, count * gridSize, gridSize, gridSize)
        }
    };
    ctx.font = `20px arial`;
    ctx.fillStyle = "#000000";
    if (canMove) {
    ctx.fillText(`${turns} moves made`, window.innerWidth / 2, 20);
    ka = Date.now();
    ctx.fillText('Time: ' + (ka - o) / 1000, window.innerWidth / 2, 40);
    } else {
    ctx.fillText(`Completed in ${turns} turns`, window.innerWidth / 2, 20);
    ctx.fillText(`Completed in ${(ka - o) / 1000} seconds`, window.innerWidth / 2, 40);
    };
    requestAnimationFrame(draw);
});

