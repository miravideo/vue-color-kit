<template>
  <div class="page">
    <div class="bg">
      <div class="cover">
        <color-picker
          :theme="theme"
          :color="color"
          :sucker-hide="false"
          :sucker-canvas="suckerCanvas"
          @changeColor="changeColor"
        />
      </div>
    </div>
    <canvas id="myCanvas" style="{z-index: 999}"/>
  </div>
</template>

<script>
import imgCover from './cover.jpg'
import { ColorPicker } from '/@/'
export default {
  components: {
    ColorPicker,
  },
  data() {
    return {
      color: '#1BC7B1',
      suckerCanvas: null,
      suckerArea: [],
      theme: '',
      inAnimation: false,
      img: new Image(),
    }
  },
  mounted() {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 200
    canvas.top = 100;
    canvas.left = 100;
    this.img.src = imgCover;
    setTimeout(() => {
      ctx.drawImage(this.img, 0, 0, 300, 200)
    }, 100)
    Object.assign(canvas.style, {
      position: 'absolute',
      left: 0 + 'px',
      top: 0 + 'px',
    })
    this.suckerCanvas = canvas;
  },
  methods: {
    changeColor(color) {
      const { r, g, b, a } = color.rgba
      this.color = `rgba(${r}, ${g}, ${b}, ${a})`
    },
  },
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

body {
  margin: 0;
}
.page {
  height: 100vh;
  .bg {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .title {
      color: #fff;
      font-size: 48px;
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    }
    .cover {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
    }
  }
}
@keyframes line {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(0);
  }
}
.anim-pull {
  animation: line 0.6s;
}
</style>
