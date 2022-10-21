// DimensionalWeight.js

import SharedMethods from '/components/SharedMethods.js';
import CopyButton from '/components/CopyButton.js';

const template = `
  <div class="pt-4 pb-5 px-5 mx-auto col-12 col-xl-8">
    <div class="position-relative bg-white border rounded mb-2" style="height: 50vw; min-height: 230px; max-height: 400px">
      <canvas class="w-100 h-100"></canvas>
      <input type="color" class="position-absolute form-control form-control-color bottom-0 end-0 me-2 mb-2" v-model="color" />
    </div>

    <div class="form-floating mb-2">
      <input type="number" min="0" max="1000" step="1" class="form-control pe-5" id="number-input" placeholder="Pakete" v-model.number="number" @focus="$event.target.select()" />
      <label for="number-input">Pakete</label>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-boxes position-absolute top-50 translate-middle-y me-3 end-0 text-muted" viewBox="0 0 16 16">
        <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z" />
      </svg>
    </div>

    <div class="row pb-4 mb-4 border-bottom">
      <div class="col-12 col-md mb-2 mb-md-0">
        <div class="form-floating mb-1">
          <input type="number" min="0" max="1000" step="1" class="form-control pe-5" id="length-input" placeholder="Länge" v-model.number="length" @focus="$event.target.select()" />
          <label for="length-input">Länge</label>

          <select class="form-select position-absolute w-auto top-0 end-0 text-muted border-0 bg-transparent" v-model="dimensionUnit" tabindex="-1">
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
          </select>
        </div>

        <input type="range" class="form-range d-none d-md-inline" min="0" max="1000" step="1" v-model.number="length" tabindex="-1" />
      </div>

      <div class="col-auto align-items-center p-0 d-none d-md-flex">
        <i class="bi bi-x-lg mb-4"></i>
      </div>

      <div class="col-12 col-md mb-2 mb-md-0">
        <div class="form-floating mb-1">
          <input type="number" min="0" max="1000" step="1" class="form-control pe-5" id="width-input" placeholder="Länge" v-model.number="width" @focus="$event.target.select()" />
          <label for="width-input">Breite</label>

          <select class="form-select position-absolute w-auto top-0 end-0 text-muted border-0 bg-transparent" v-model="dimensionUnit" tabindex="-1">
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
          </select>
        </div>

        <input type="range" class="form-range d-none d-md-inline" min="0" max="1000" step="1" v-model.number="width" tabindex="-1" />
      </div>

      <div class="col-auto align-items-center p-0 d-none d-md-flex">
        <i class="bi bi-x-lg mb-4"></i>
      </div>

      <div class="col-12 col-md">
        <div class="form-floating mb-1">
          <input type="number" min="0" max="1000" step="1" class="form-control pe-5" id="height-input" placeholder="Länge" v-model.number="height" @focus="$event.target.select()" />
          <label for="height-input">Höhe</label>

          <select class="form-select position-absolute w-auto top-0 end-0 text-muted border-0 bg-transparent" v-model="dimensionUnit" tabindex="-1">
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
          </select>
        </div>

        <input type="range" class="form-range d-none d-md-inline" min="0" max="1000" step="1" v-model.number="height" tabindex="-1" />
      </div>
    </div>

    <div class="row row-cols-1 row-cols-sm-2 g-4">
      <div class="col d-none">
        <div class="card card-body text-end">
          <small class="d-block text-muted">Paketvolumen</small>

          <div class="d-flex flex-nowrap justify-content-end">
            <p class="h2 mb-0 me-2">{{ formatNumbersLocal(volume, 2) }}</p>
            <select class="w-auto form-select form-select-lg border-0" v-model="volumeUnit">
              <option value="cbm">m³</option>
              <option value="ccm">cm³</option>
              <option value="cuin">in³</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card text-end">
          <div class="card-body">
            <small class="d-block text-muted">Sendungsvolumen</small>

            <div class="d-flex flex-nowrap justify-content-end">
              <p class="h2 mb-0 me-2">{{ formatNumbersLocal(volume * number, 2) }}</p>
              <select class="w-auto form-select form-select-lg border-0" v-model="volumeUnit">
                <option value="cbm">m³</option>
                <option value="ccm">cm³</option>
                <option value="cuin">in³</option>
              </select>
            </div>

            <p class="text-muted">@ {{ number }} Pakete</p>
            <CopyButton :value="formatNumbersLocal(volume * number, 2)" />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card text-end">
          <div class="card-body">
            <small class="d-block text-muted">Volumengewicht</small>

            <div class="d-flex flex-nowrap justify-content-end">
              <p class="h2 mb-0 me-2">{{ formatNumbersLocal(dimensionalWeight) }}</p>
              <select class="w-auto form-select form-select-lg border-0" v-model="weightUnit">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>

            <p class="text-muted">@ 200 kg/m³</p>
            <CopyButton :value="dimensionalWeight" />
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default {
  name: 'DimensionalWeight',
  mixins: [SharedMethods],
  components: {
    CopyButton,
  },
  data() {
    return {
      number: 1,
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: 'cm',
      volumeUnit: 'cbm',
      weightUnit: 'kg',
      // --
      canvas: null,
      ctx: null,
      color: '#183264',
    };
  },
  computed: {
    baseVolume() {
      // base volume in m³
      const converter = this.dimensionUnit === 'cm' ? 0.01 : this.dimensionUnit === 'inch' ? 0.0254 : 1;

      return this.length * this.width * this.height * converter ** 3;
    },
    volume() {
      const converter = this.volumeUnit === 'ccm' ? 100 : this.volumeUnit === 'cuin' ? 39.3701 : 1;

      return this.baseVolume * converter ** 3;
    },
    dimensionalWeight() {
      const converter = this.weightUnit === 'lb' ? 2.20462 : 1;

      return Math.ceil(this.baseVolume * this.number * 200 * converter);
    },
  },
  methods: {
    draw() {
      // resize canvas
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      // clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // wobble the cube using a sine wave
      const wobble = (Math.sin(Date.now() / 250) * this.canvas.height) / 50;

      // draw the cube
      this.drawCube(this.canvas.width / 2, this.canvas.height / 1.7 + wobble + this.height / 2, Number(this.width), Number(this.length), Number(this.height), this.color);

      requestAnimationFrame(this.draw);
    },
    shadeColor(color, percent) {
      const num = parseInt(color.substr(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;

      return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    },
    drawCube(x, y, wx, wy, h, color) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - wx, y - wx * 0.5);
      this.ctx.lineTo(x - wx, y - h - wx * 0.5);
      this.ctx.lineTo(x, y - h * 1);
      this.ctx.closePath();
      this.ctx.fillStyle = this.shadeColor(color, -10);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + wy, y - wy * 0.5);
      this.ctx.lineTo(x + wy, y - h - wy * 0.5);
      this.ctx.lineTo(x, y - h * 1);
      this.ctx.closePath();
      this.ctx.fillStyle = this.shadeColor(color, 10);
      this.ctx.strokeStyle = this.shadeColor(color, 50);
      this.ctx.stroke();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(x, y - h);
      this.ctx.lineTo(x - wx, y - h - wx * 0.5);
      this.ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
      this.ctx.lineTo(x + wy, y - h - wy * 0.5);
      this.ctx.closePath();
      this.ctx.fillStyle = this.shadeColor(color, 20);
      this.ctx.strokeStyle = this.shadeColor(color, 60);
      this.ctx.stroke();
      this.ctx.fill();
    },
  },
  mounted() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    setTimeout(() => {
      this.length = Math.floor((Math.floor(Math.random() * (150 - 80 + 1)) + 80) / 10) * 10;
      this.width = Math.floor((Math.floor(Math.random() * (150 - 80 + 1)) + 80) / 10) * 10;
      this.height = Math.floor((Math.floor(Math.random() * (150 - 80 + 1)) + 80) / 10) * 10;
    }, 0);

    this.draw();
  },
  template,
};
