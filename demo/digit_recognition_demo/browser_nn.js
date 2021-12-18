function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function dot_prod(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; ++i) {
        sum += v1[i] * v2[i];
    }
    return sum;
}

function matrix_vector_mult(m, v) {
    let out = new Array(m.length);
    for (let i = 0; i < m.length; ++i) {
        out[i] = dot_prod(m[i], v);
    }
    return out;
}

function vector_add(v1, v2) {
    let out = new Array(v1.length);
    for (let i = 0; i < v1.length; ++i) {
        out[i] = v1[i] + v2[i];
    }
    return out;
}

function vector_sigmoid(v) {
    let out = new Array(v.length);
    for (let i = 0; i < v.length; ++i) {
        out[i] = sigmoid(v[i]);
    }
    return out;
}

function copy_matrix_dim(m) {
    let out = new Array(m.length);
    for (let i = 0; i < m.length; ++i) {
        out[i] = new Array(m[i].length).fill(0);
    }
    return out;
}

function copy_matrix_dim_three(m) {
    let out = new Array(m.length);
    for (let i = 0; i < m.length; ++i) {
        out[i] = new Array(m[i].length);
        for (let j = 0; j < m[i].length; ++j) {
            out[i][j] = new Array(m[i][j].length).fill(0);
        }
    }
    return out;
}

function n_dim_matrix_add_mutate(m1, m2) {
    if (m1.constructor === Array & m1[0].constructor === Array) {
        for (let i = 0; i < m1.length; ++i) {
            n_dim_matrix_add_mutate(m1[i], m2[i]);
        }
    } else {
        for (let i = 0; i < m1.length; ++i) {
            m1[i] += m2[i];
        }
    }
}

class Layer {
    constructor(weights, biases) {
        this.weights = weights;
        this.biases = biases;
    }
}

class NeuralNet {
    constructor(layer_sizes, weights, biases) {
        this.layers = new Array(layer_sizes.length);
        this.layers[0] = new Layer(null, null);

        if (weights === undefined || biases === undefined) {
            this.weights = new Array(layer_sizes.length - 1);
            this.biases = new Array(layer_sizes.length - 1);
            for (let l = 0; l < this.weights.length; ++l) {
                this.weights[l] = new Array(layer_sizes[l + 1]);
                this.biases[l] = new Array(layer_sizes[l + 1]);
                for (let j = 0; j < this.weights[l].length; ++j) {
                    this.weights[l][j] = new Array(layer_sizes[l]);
                    this.biases[l][j] = Math.random() * 2 - 1;
                    for (let k = 0; k < this.weights[l][j].length; ++k) {
                        this.weights[l][j][k] = Math.random() * 2 - 1;
                    }
                }
            }
        } else {
            this.weights = weights;
            this.biases = biases;
        }

        for (let i = 1; i < this.layers.length; ++i) {
            this.layers[i] = new Layer(this.weights[i - 1], this.biases[i - 1]);
        }
    }
    eval(input_nodes) {
        let net_state = new Array(this.layers.length);
        net_state[0] = input_nodes;
        for (let i = 1; i < this.layers.length; ++i) {
            net_state[i] = vector_sigmoid(vector_add(matrix_vector_mult(this.layers[i].weights, net_state[i - 1]), this.layers[i].biases));
        }
        return net_state;
    }
}