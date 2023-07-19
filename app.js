const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
let solutions = [];
let length = 3;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/game.html');
});

function testSolution(gr, t) {
    let used = [0, 0, 0, 0, 0, 0];
    for (let count = 0; count < gr.length; count++) {
        for (let coun = 0; coun < gr[count].length; coun++) {
            let setback = 0;
            if (gr[count][coun] > 5) {
                setback = 1;
                gr[count][coun] -= 6;
            };
            used[gr[count][coun]]++;
            let difference = 3;
            if (gr[count][coun] > 2) difference = -3;
            let fact = false;
            for (let cou = 1; cou < gr.length; cou++) {
                if (gr[count - cou]) {
                    if (gr[count - cou][coun] === gr[count][coun] || gr[count - cou][coun] === gr[count][coun] + difference) {
                        fact = true;
                    }
                }
                if (gr[count + cou]) {
                    if (gr[count + cou][coun] === gr[count][coun] || gr[count + cou][coun] === gr[count][coun] + difference) {
                        fact = true;
                    }
                }
                if (gr[count][coun - cou]) {
                    if (gr[count][coun - cou] === gr[count][coun] || gr[count][coun - cou] === gr[count][coun] + difference) {
                        fact = true;
                    }
                }
                if (gr[count][coun + cou]) {
                    if (gr[count][coun + cou] === gr[count][coun] || gr[count][coun + cou] === gr[count][coun] + difference) {
                        fact = true;
                    }
                }
            }
            if (fact) {
                return false;
            }
            if (setback) gr[count][coun] += 6;
        }
    }
    if (used.indexOf(0) === -1) {
        if (t) {
            solutions.push(gr)
        } else {
            io.emit('solved');
        }
    }
};

let c = [0, 1, 2, 3, 4, 5];
let p = c;

function per(array) {
    if (!array.length) {
        return [array];
    }
    const permutations = [];
    for (let i = 0; i < array.length; i++) {
        const subarray = array.slice(0, i)
            .concat(array.slice(i + 1));
        for (const permutation of per(subarray)) {
            permutations.push([array[i], ...permutation]);
        }
    }

    return permutations;
};

function cos(array) {
    const combinations = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            for (let k = j + 1; k < array.length; k++) {
                combinations.push([array[i], array[j], array[k]]);
            }
        }
    }
    return combinations;
};

function sols() {
    for (let count in cos(c)) {
        let e = p.concat(cos(c)[count]);
        let h = per(e);
        for (let cou in h) {
            let d = Math.sqrt(h[cou].length);
            let z = [];
            for (let count = 0; count < h[cou].length; count += d) {
                let c = [];
                for (let j = count; j < count + d; j++) {
                    c.push(h[cou][j]);
                };
                z.push(c);
            }
            testSolution(z, true);
        }
    }
    console.log('grid permutations compiled!');
};

sols();

let picks = [];

function roll() {
    let k = Math.floor(Math.random() * length);
    let h = Math.floor(Math.random() * length);
    for (let c in picks) {
        if (picks[c][0] === k && picks[c][1] === h) {
            roll();
            return false;
        }
    }
    picks.push([k, h]);
};

function pickTiles(leng) {
    for (let count = 0; count < leng; count++) {
        roll();
    };
};

function pickup() {
    let k = [];
    let o = solutions[Math.floor(Math.random() * solutions.length)];
    for (let count in picks) {
        o[picks[count][0]][picks[count][1]] = o[picks[count][0]][picks[count][1]] + 6;
        k.push([picks[count][0], picks[count][1], o[picks[count][0]][picks[count][1]]]);
    };
    return k;
};

io.on('connection', (socket) => {
    socket.on('grid', function(data) {
        testSolution(data, false);
    });
    socket.emit('init', length);
    picks.splice(0, picks.length);
    pickTiles(4);
    socket.emit('setgrid', pickup());
});

io.on('solved', () => {
    socket.emit('solved');
    socket.emit('setgrid', pickup());
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
