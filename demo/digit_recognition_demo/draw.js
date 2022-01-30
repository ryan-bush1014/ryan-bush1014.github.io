let anim_id;
        let canvas = document.getElementById("mnistCanvas");
        let ctx = canvas.getContext("2d");

        function output_to_digit(out) {
            let max = 0;
            let digit = -1;
            for (let i = 0; i < 10; ++i) {
                if (out[i] > max) {
                    digit = i;
                    max = out[i];
                }
            }
            return digit;
        }

        let nn = new NeuralNet([784, 16, 16, 10], model_weights, model_biases);

        function draw_and_predict() {
            clearInterval(anim_id);
            ctx.clearRect(0, 0, 280, 280);
            let digit = mnist[Math.floor(Math.random() * 10)].get();
            let counter = 0;
            var anim = setInterval(function () {
                ctx.clearRect(0, 0, 280, 280);
                for (let row = 0; row < 28; ++row) {
                    for (let col = 0; col < 28; ++col) {
                        let r = 5 / (1 + Math.exp(-(counter - (row + col) / 5) / 2));
                        let brightness = digit[row * 28 + col];
                        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
                        ctx.beginPath();
                        ctx.arc(col * 10 + 5, row * 10 + 5, r, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
                counter++;
                if (counter >= 30) {
                    clearInterval(anim);
                }
            }, 1000 / 30);
            anim_id = anim;


            let out = nn.eval(digit)[3];
            let max = 0;
            let max_index = -1;
            for (let i = 0; i < 10; ++i) {
                let meter = document.getElementById("conf_" + i);
                meter.classList.remove("bestAnswer");
                if (out[i] > max) {
                    max = out[i];
                    max_index = i;
                }
                meter.style.setProperty('--confidence', ((1 - out[i]) * 100) + '%');
            }
            document.getElementById("conf_" + max_index).classList.add("bestAnswer");
        }

        window.onload = draw_and_predict;