# 利用 gpu 加速数据运算

## GPGPU 介绍

通用图形处理器（General-purpose computing on graphics processing units，简称 GPGPU），是一种利用处理图形任务的图形处理器来计算原本由中央处理器处理的通用计算任务。这些通用计算常常与图形处理没有任何关系。由于现代图形处理器强大的并行处理能力和可编程流水线，令流处理器可以处理非图形数据。特别在面对单指令流多数据流（SIMD），且数据处理的运算量远大于数据调度和传输的需要时，通用图形处理器在性能上大大超越了传统的中央处理器应用程序。

利用 WebGL 可以加速运算。

```js
window.gpu =  {
    create: function(code, size){
        size = size || 256;
        code = code || '';
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var gl = this.gl = canvas.getContext('webgl');


        // 创建顶点着色器，只是传递了贴图坐标
        var vertexShaderSource = 'attribute vec4 position;varying vec2 vCoord;void main() {vCoord = position.xy * 0.5 + 0.5;gl_Position = position;}';
        // 创建片元着色器，根据贴图坐标贴图。
        var fragmentShaderSource = 'precision highp float;varying vec2 vCoord;uniform sampler2D map;void main(void) {vec4 color = texture2D(map, vCoord);' + code + 'gl_FragColor = color;}';
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        // 创建程序对象
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        this.program = program;

        // 顶点数据传输 创建一个面覆盖整个画布
        var vertices = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]);
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var aPosition = gl.getAttribLocation(program, 'position');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
    },

    run: function(canvas){
        var gl = this.gl;
        var program = this.program;
        var texture = gl.createTexture();
        var uMap = gl.getUniformLocation(program, 'map');

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        


        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.uniform1i(uMap, 0);				

        // 绘制
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        // 从最终绘制的画面上，获取颜色信息作为最终处理结果数据。
        var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        return pixels;
    }
};
```

github 上有将 javascript 转换为着色器语言的库 [gpu.js](https://github.com/gpujs/gpu.js) 。

<div style="float: right">更新时间: {docsify-updated}</div>
