<template>
  <div>
    <svg
      :class="{ active: isOpenSucker }"
      class="sucker"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-12 -12 48 48"
      @click="openSucker"
    >
      <path
        d="M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import imgSucker from '../img/sucker.png'
export default defineComponent({
  props: {
    suckerCanvas: {
      type: HTMLCanvasElement, // HTMLCanvasElement
      default: null,
    },
    suckerPosition: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      isOpenSucker: false, // Whether it is in the straw state
      suckerPreview: null, // Preview color dom next to the straw
      container: null,
      width: 0,
      height: 0,
      previewSize: 110,
      color: {r: 0, g: 0, b: 0, a: 0},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.container = document.body;
    });
  },
  watch: {
    suckerPosition: function(val) {
      if (!this.isOpenSucker || !this.suckerPosition || (this.suckerPosition.length !== 4) || !this.suckerCanvas) return

      const x = Math.round(val[0] * this.suckerCanvas.width);
      const y = Math.round(val[1] * this.suckerCanvas.height);
      console.log('x, y', x, y)

      const ctx = this.suckerPreview.getContext('2d')
      ctx.clearRect(0, 0, this.previewSize, this.previewSize);
      const mr = 5;
      const sx = x - mr;
      const sy = y - mr

      for (let _x=x - mr; _x <= x + mr;_x++) {
        for (let _y=y - mr; _y<= y + mr ;_y++) {
          const {r, g, b, a} = this.getColor(_x, _y)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          const box = [(_x - sx) * 10, (_y - sy) * 10, 10, 10];
          ctx.fillRect(...box);
          if (_x === x && _y === y){
            this.color = {r, g, b, a};
            ctx.strokeStyle = '#000';
            const bbox = [box[0], box[1], box[2] -1, box[3] -1]
            ctx.strokeRect(...bbox);
          }
        }
      }
      const style = this.suckerPreview.style;
      Object.assign(style, {
        position: 'absolute',
        left: val[2] - (this.previewSize / 2) + 'px',
        top: val[3] - (this.previewSize / 2) + 'px',
        zIndex: 99999, // The level of the preview color of the small circle of the eyedropper cannot exceed the color selector
      })

      if (val[0] >= 0 && val[1] >= 0 && val[0] <= 1 && val[1] <= 1) {
        style.display = ''
        style.cursor = 'none'
      } else {
        // @ts-ignore
        style.display = 'none'
        style.cursor = 'default'
      }
    }
  },
  methods: {
    openSucker() {
      if (!this.isOpenSucker) {
        if (this.suckerCanvas && this.suckerCanvas.tagName !== 'CANVAS') {
          return
        }
        this.isOpenSucker = true
        this.$emit('openSucker', true)
        this.suckerPreview = document.createElement('canvas');
        this.suckerPreview.width = this.previewSize;
        this.suckerPreview.height = this.previewSize;
        this.suckerPreview.style.border = "1px solid #000"
        this.suckerPreview.style.borderRadius = "50%"

        this.container.appendChild(this.suckerPreview);

        this.suckerPreview.addEventListener('click', this.select)
        document.addEventListener('keydown', this.keydownHandler)
      } else {
        // The processing logic is the same as pressing the esc key
        this.keydownHandler({ keyCode: 27 })
      }
    },
    keydownHandler(e: any) {
      // esc
      if (e.keyCode === 27) {
        this.isOpenSucker = false
        this.$emit('openSucker', false)
        document.removeEventListener('keydown', this.keydownHandler)
        this.suckerPreview.removeEventListener('click', this.select)
        if (this.suckerPreview) {
          // @ts-ignore
          this.container.removeChild(this.suckerPreview)
          this.suckerPreview = null
        }
      }
    },
    getColor(x:number, y:number) {
      // @ts-ignore
      const ctx = this.suckerCanvas.getContext('2d')
      const imgData = ctx.getImageData(
          Math.min(x, Math.round(this.suckerCanvas.width - 1)),
          Math.min(y, Math.round(this.suckerCanvas.height - 1)),
          1,
          1
      )
      let [r, g, b, a] = imgData.data;
      return {r, g, b, a}
    },

    select(e: any) {
        let {r, g, b, a} = this.color;
        a = parseFloat((a / 255).toFixed(2))
        this.$emit('selectSucker', { r, g, b, a })
    },
  },
})
</script>

<style lang="scss">
.sucker {
  width: 30px;
  fill: #9099a4;
  background: #2e333a;
  cursor: pointer;
  transition: all 0.3s;
  &:hover,
  &.active {
    fill: #1593ff;
  }
}
</style>
