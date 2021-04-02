function encode(n, bits) {
    let parities = 0;
    let bitCount = 0;
    let out = new Array(n);
    for (let i = 1; i < n; i++) {
        if (Math.log(i) / Math.log(2) % 1 !== 0) {
            parities = (i * bits[bitCount]) ^ parities;
            out[i] = bitCount < bits.length ? bits[bitCount] : 0;
            bitCount++;
        }
    }
    for (let i = 1; i < n; i *= 2) {
        out[i] = parities % 2;
        parities -= out[i];
        parities /= 2;
    }
    out[0] = parity(out);
    return out;
}

function decode(bits) {
    let error = bits.reduce((a, b, i) => a ^ (b * i), 0);
    let bitCount = 0;
    if (parity(bits) === 0 && error !== 0) {
        return false;
    }
    flip(bits, error);
    let out = new Array(Math.trunc(bits.length - Math.log(bits.length) / Math.log(2)) - 1);
    for (let i = 3; i < bits.length; i++) {
        if (Math.log(i) / Math.log(2) % 1 !== 0) {
            out[bitCount] = bits[i];
            bitCount++;
        }
    }
    return out;
}

function encodeChunks(n, bits) {
    let prebitchunk = n - Math.log(n) / Math.log(2) - 1;
    let out = [];
    for (let i = 0; i < bits.length; i += prebitchunk) {
        out = out.concat(encode(n, bits.slice(i, i + prebitchunk)))
    }
    return out;
}

function interlaceChunks(n, bits) {
    let groups = Math.ceil(bits.length / n);
    let out = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) {
        out[i] = bits[(i % groups) * n + (i - i % groups) / groups];
    }
    return out;
}

function deinterlaceChunks(n, bits) {
    let groups = Math.ceil(bits.length / n);
    let out = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) {
        out[(i % groups) * n + (i - i % groups) / groups] = bits[i];
    }
    return out;
}

function decodeChunks(n, bits) {
    let out = [];
    for (let i = 0; i < bits.length; i += n) {
        out = out.concat(decode(bits.slice(i, i + n)));
    }
    return out;
}


function parity(bits) {
    return bits.reduce((a, b) => a ^ b, 0);
}

function flip(bits, i) {
    bits[i] = bits[i] === 1 ? 0 : 1;
}

function read(bits) {
    let out = '';
    for (let i = 0; i < bits.length; i += 8) {
        let code = parseInt(bits.slice(i, i + 8).join(''), 2);
        if (code === 3) {
            return out;
        } else {
            out += String.fromCharCode(code);
        }
    }
    return out;
}

function hammingData(bits) {
    let out = [];
    for (let i = 3; i < bits.length; i++) {
        if (Math.log(i) / Math.log(2) % 1 !== 0) {
            out.push(bits[i]);
        }
    }
    return out;
}


function hammingDataChunks(n, bits) {
    let out = [];
    for (let i = 0; i < bits.length; i += n) {
        out = out.concat(hammingData(bits.slice(i, i + n)));
    }
    return out;
}

function send(string) {
    let n = 16;
    let bits = string.split('').reduce((a, b) => a.concat(b.charCodeAt(0).toString(2).padStart(8, '0').split('').map(x => parseInt(x))), []).concat([0, 0, 0, 0, 0, 0, 1, 1]);
    let encoded = interlaceChunks(n, encodeChunks(n, bits));
    let index = string.length * 5;
    for(let i = 0; i < Math.min(string.length + 1, 3); i++){
        flip(encoded, index + i);
    }
    let deinterlaced = deinterlaceChunks(n, encoded);
    let received = hammingDataChunks(n, deinterlaced);
    let decoded = decodeChunks(n, deinterlaced);
    return [string, read(received), read(decoded)];
}

function display(arr) {
    let displayLen = 2000;
    let animationLen = 500;
    let transmission = $('#transmission');
    console.log(transmission);
    let display = $('#display');
    let text = document.querySelector('#text');

    $('body').animate({ backgroundColor: '#2196f3' }, animationLen*2);
    transmission.fadeOut(animationLen, () => {
        text.innerHTML = `Sent: "${arr[0]}"`;
        display.fadeIn(animationLen, () => {
            setTimeout(() => {
                $('body').animate({ backgroundColor: '#3f51b5' }, animationLen*2);
                display.fadeOut(animationLen, () => {
                    text.innerHTML = `Received: "${arr[1]}"`;
                    display.fadeIn(animationLen, () => {
                        setTimeout(() => {
                            $('body').animate({ backgroundColor: '#2196f3' }, animationLen*2);
                            display.fadeOut(animationLen, () => {
                                text.innerHTML = `Repaired: "${arr[2]}"`;
                                display.fadeIn(animationLen, () => {
                                    setTimeout(() => {
                                        $('body').animate({ backgroundColor: '#03a9f4' }, animationLen*2);
                                        display.fadeOut(animationLen, () => {
                                            transmission.fadeIn(animationLen);
                                        })
                                    }, displayLen)
                                });
                            })
                        }, displayLen)
                    });
                })
            }, displayLen)
        });
    });
}


function input(ele) {
    if (event.key === 'Enter') {
        display(send(ele.value))
    }
}