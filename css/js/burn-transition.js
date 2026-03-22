// ============ BURN TRANSITION OVERLAY ============
// Adapted from CodePen by Nidal95 (ByjKzbE)
// This file adds a burning paper WebGL effect as an overlay
// It captures the current login screen and burns it away to reveal the dashboard

(function () {
    'use strict';

    // Expose a global function that app.js will call
    window.startBurnTransition = function (onBurnComplete) {

        // --- Create the fire overlay canvas ---
        const canvasEl = document.createElement('canvas');
        canvasEl.id = 'fire-overlay';
        canvasEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100vh;pointer-events:none;z-index:9999;';
        document.body.appendChild(canvasEl);

        const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

        // --- Shader sources (embedded directly, no external script tags needed) ---
        const vsSource = `
            precision mediump float;
            varying vec2 vUv;
            attribute vec2 a_position;

            void main() {
                vUv = a_position;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision mediump float;

            varying vec2 vUv;
            uniform vec2 u_resolution;
            uniform float u_progress;
            uniform float u_time;
            uniform sampler2D u_text;

            float rand(vec2 n) {
                return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 n) {
                const vec2 d = vec2(0., 1.);
                vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
                return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
            }

            float fbm(vec2 n) {
                float total = 0.0, amplitude = .4;
                for (int i = 0; i < 4; i++) {
                    total += noise(n) * amplitude;
                    n += n;
                    amplitude *= 0.6;
                }
                return total;
            }

            void main() {
                vec2 uv = vUv;
                uv.x *= min(1., u_resolution.x / u_resolution.y);
                uv.y *= min(1., u_resolution.y / u_resolution.x);

                vec2 screenUv = vUv * 0.5 + 0.5;
                screenUv.y = 1.0 - screenUv.y;

                float t = u_progress;

                vec4 textColor = texture2D(u_text, screenUv);
                vec3 color = textColor.rgb;

                float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));

                float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
                color -= vec3(.99, .95, .99) * paper_darkness;

                vec3 fire_color = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, .0);
                float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
                show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));

                float fire_border = .02 * show_fire;
                float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
                fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
                color += fire_color * fire_edge;

                float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);

                gl_FragColor = vec4(color, opacity);
            }
        `;

        // --- WebGL Setup ---
        const gl = canvasEl.getContext('webgl', { alpha: true, premultipliedAlpha: false })
            || canvasEl.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });

        if (!gl) {
            console.warn('Burn transition: WebGL not supported, falling back.');
            canvasEl.remove();
            if (onBurnComplete) onBurnComplete();
            return;
        }

        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function createShader(sourceCode, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, sourceCode);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Burn shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(vsSource, gl.VERTEX_SHADER);
        const fragmentShader = createShader(fsSource, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) {
            console.warn('Burn transition: shader compilation failed, falling back.');
            canvasEl.remove();
            if (onBurnComplete) onBurnComplete();
            return;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Burn shader link error:', gl.getProgramInfoLog(program));
            canvasEl.remove();
            if (onBurnComplete) onBurnComplete();
            return;
        }

        // Get uniforms
        const uniforms = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const name = gl.getActiveUniform(program, i).name;
            uniforms[name] = gl.getUniformLocation(program, name);
        }

        // Setup vertex buffer (fullscreen quad)
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // --- Capture the login screen as a texture ---
        // We create a texture from the login wrapper's visual state
        // Instead of html2canvas (heavy), we fill with the login background color/gradient
        const textCanvas = document.createElement('canvas');
        const textCtx = textCanvas.getContext('2d');
        textCanvas.width = 2048;
        textCanvas.height = 1024;

        // Paint the login screen background to match #login-wrapper's bg
        const gradient = textCtx.createLinearGradient(0, 0, textCanvas.width, textCanvas.height);
        gradient.addColorStop(0, '#020510');
        gradient.addColorStop(0.5, '#020510');
        gradient.addColorStop(1, '#020510');
        textCtx.fillStyle = gradient;
        textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

        // Add subtle grid pattern dots to match cyber-grid
        textCtx.fillStyle = 'rgba(0, 255, 255, 0.03)';
        for (let x = 0; x < textCanvas.width; x += 40) {
            for (let y = 0; y < textCanvas.height; y += 40) {
                textCtx.fillRect(x, y, 1, 1);
            }
        }

        // Add orb glows
        const addOrb = (cx, cy, radius, color) => {
            const orbGrad = textCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            orbGrad.addColorStop(0, color);
            orbGrad.addColorStop(1, 'transparent');
            textCtx.fillStyle = orbGrad;
            textCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
        };
        addOrb(400, 100, 300, 'rgba(0, 255, 255, 0.08)');
        addOrb(1600, 800, 400, 'rgba(164, 132, 251, 0.06)');

        // Upload as WebGL texture
        const textTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // --- Sizing ---
        function resizeCanvas() {
            canvasEl.width = window.innerWidth * devicePixelRatio;
            canvasEl.height = window.innerHeight * devicePixelRatio;
            gl.viewport(0, 0, canvasEl.width, canvasEl.height);
            gl.uniform2f(uniforms.u_resolution, canvasEl.width, canvasEl.height);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // --- Animation loop ---
        const startTime = performance.now();
        // Duration of the burn in ms — tune this for speed
        // Original pen uses 8000ms; we use 3500ms for a snappier login transition
        const BURN_DURATION = 2500;
        let animationProgress = 0.3; // Start at 0.3 like the original
        let burnCompleted = false;

        function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function render() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / BURN_DURATION;

            if (elapsed <= 1) {
                animationProgress = 0.3 + 0.7 * easeInOut(elapsed);
            } else {
                // Burn complete — remove canvas and notify
                canvasEl.style.display = 'none';
                window.removeEventListener('resize', resizeCanvas);

                if (!burnCompleted) {
                    burnCompleted = true;
                    // Clean up DOM
                    setTimeout(() => {
                        canvasEl.remove();
                    }, 100);
                    if (onBurnComplete) onBurnComplete();
                }
                return;
            }

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(uniforms.u_time, currentTime);
            gl.uniform1f(uniforms.u_progress, animationProgress);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textTexture);
            gl.uniform1i(uniforms.u_text, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }

        render();
    };
})();
