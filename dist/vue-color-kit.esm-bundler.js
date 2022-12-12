/*!
 * vue-color-kit v1.0.10
 * (c) 2022
 * @license MIT
 */
import {
  defineComponent,
  openBlock,
  createBlock,
  withModifiers,
  createVNode,
  computed,
  toDisplayString,
  withDirectives,
  vModelText,
  ref,
  onUnmounted,
  Fragment,
  renderList,
  createCommentVNode,
  resolveComponent,
  renderSlot,
} from 'vue'

function setColorValue(color) {
  let rgba = { r: 0, g: 0, b: 0, a: 1 }
  if (/#/.test(color)) {
    rgba = hex2rgb(color)
  } else if (/rgb/.test(color)) {
    rgba = rgb2rgba(color)
  } else if (typeof color === 'string') {
    rgba = rgb2rgba(`rgba(${color})`)
  } else if (Object.prototype.toString.call(color) === '[object Object]') {
    rgba = color
  }
  const { r, g, b, a } = rgba
  const { h, s, v } = rgb2hsv(rgba)
  return { r, g, b, a: a === undefined ? 1 : a, h, s, v }
}
function createAlphaSquare(size) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const doubleSize = size * 2
  canvas.width = doubleSize
  canvas.height = doubleSize
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, doubleSize, doubleSize)
  ctx.fillStyle = '#ccd5db'
  ctx.fillRect(0, 0, size, size)
  ctx.fillRect(size, size, size, size)
  return canvas
}
function createLinearGradient(direction, ctx, width, height, color1, color2) {
  // l horizontal p vertical
  const isL = direction === 'l'
  const gradient = ctx.createLinearGradient(
    0,
    0,
    isL ? width : 0,
    isL ? 0 : height
  )
  gradient.addColorStop(0.01, color1)
  gradient.addColorStop(0.99, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}
function rgb2hex({ r, g, b }, toUpper) {
  const change = (val) => ('0' + Number(val).toString(16)).slice(-2)
  const color = `#${change(r)}${change(g)}${change(b)}`
  return toUpper ? color.toUpperCase() : color
}
function hex2rgb(hex) {
  hex = hex.slice(1)
  const change = (val) => parseInt(val, 16) || 0 // Avoid NaN situations
  return {
    r: change(hex.slice(0, 2)),
    g: change(hex.slice(2, 4)),
    b: change(hex.slice(4, 6)),
  }
}
function rgb2rgba(rgba) {
  if (typeof rgba === 'string') {
    rgba = (/rgba?\((.*?)\)/.exec(rgba) || ['', '0,0,0,1'])[1].split(',')
    return {
      r: Number(rgba[0]) || 0,
      g: Number(rgba[1]) || 0,
      b: Number(rgba[2]) || 0,
      a: Number(rgba[3] ? rgba[3] : 1),
    }
  } else {
    return rgba
  }
}
function rgb2hsv({ r, g, b }) {
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (max === min) {
    h = 0
  } else if (max === r) {
    if (g >= b) {
      h = (60 * (g - b)) / delta
    } else {
      h = (60 * (g - b)) / delta + 360
    }
  } else if (max === g) {
    h = (60 * (b - r)) / delta + 120
  } else if (max === b) {
    h = (60 * (r - g)) / delta + 240
  }
  h = Math.floor(h)
  let s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
  let v = parseFloat(max.toFixed(2))
  return { h, s, v }
}

var script = defineComponent({
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    hsv: {
      type: Object,
      default: null,
    },
    size: {
      type: Number,
      default: 152,
    },
  },
  emits: ['selectSaturation'],
  data() {
    return {
      slideSaturationStyle: {},
    }
  },
  // Can’t monitor, otherwise the color will change when you change yourself
  // watch: {
  //     color() {
  //         this.renderColor()
  //     }
  // },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas = this.$refs.canvasSaturation
      const size = this.size
      const ctx = canvas.getContext('2d')
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, size, size)
      createLinearGradient(
        'l',
        ctx,
        size,
        size,
        '#FFFFFF',
        'rgba(255,255,255,0)'
      )
      createLinearGradient('p', ctx, size, size, 'rgba(0,0,0,0)', '#000000')
    },
    renderSlide() {
      this.slideSaturationStyle = {
        left: this.hsv.s * this.size - 5 + 'px',
        top: (1 - this.hsv.v) * this.size - 5 + 'px',
      }
    },
    selectSaturation(e) {
      const {
        top: saturationTop,
        left: saturationLeft,
      } = this.$el.getBoundingClientRect()
      const ctx = e.target.getContext('2d')
      const mousemove = (e) => {
        let x = e.clientX - saturationLeft
        let y = e.clientY - saturationTop
        if (x < 0) {
          x = 0
        }
        if (y < 0) {
          y = 0
        }
        if (x > this.size) {
          x = this.size
        }
        if (y > this.size) {
          y = this.size
        }
        // Do not modify the dom by monitoring data changes, otherwise when the color is #ffffff, the slide will go to the lower left corner
        this.slideSaturationStyle = {
          left: x - 5 + 'px',
          top: y - 5 + 'px',
        }
        // If you use the maximum value, the selected pixel will be empty, and the empty default is black
        const imgData = ctx.getImageData(
          Math.min(x, this.size - 1),
          Math.min(y, this.size - 1),
          1,
          1
        )
        const [r, g, b] = imgData.data
        this.$emit('selectSaturation', { r, g, b })
      }
      mousemove(e)
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
  },
})

const _hoisted_1 = { ref: 'canvasSaturation' }

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock(
      'div',
      {
        class: 'saturation',
        onMousedown:
          _cache[1] ||
          (_cache[1] = withModifiers(
            (...args) =>
              _ctx.selectSaturation && _ctx.selectSaturation(...args),
            ['prevent', 'stop']
          )),
      },
      [
        createVNode('canvas', _hoisted_1, null, 512 /* NEED_PATCH */),
        createVNode(
          'div',
          {
            style: _ctx.slideSaturationStyle,
            class: 'slide',
          },
          null,
          4 /* STYLE */
        ),
      ],
      32 /* HYDRATE_EVENTS */
    )
  )
}

script.render = render
script.__file = 'src/color/Saturation.vue'

var script$1 = defineComponent({
  props: {
    hsv: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 15,
    },
    height: {
      type: Number,
      default: 152,
    },
  },
  emits: ['selectHue'],
  data() {
    return {
      slideHueStyle: {},
    }
  },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas = this.$refs.canvasHue
      const width = this.width
      const height = this.height
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#FF0000') // red
      gradient.addColorStop(0.17 * 1, '#FF00FF') // purple
      gradient.addColorStop(0.17 * 2, '#0000FF') // blue
      gradient.addColorStop(0.17 * 3, '#00FFFF') // green
      gradient.addColorStop(0.17 * 4, '#00FF00') // green
      gradient.addColorStop(0.17 * 5, '#FFFF00') // yellow
      gradient.addColorStop(1, '#FF0000') // red
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    },
    renderSlide() {
      this.slideHueStyle = {
        top: (1 - this.hsv.h / 360) * this.height - 2 + 'px',
      }
    },
    selectHue(e) {
      const { top: hueTop } = this.$el.getBoundingClientRect()
      const ctx = e.target.getContext('2d')
      const mousemove = (e) => {
        let y = e.clientY - hueTop
        if (y < 0) {
          y = 0
        }
        if (y > this.height) {
          y = this.height
        }
        this.slideHueStyle = {
          top: y - 2 + 'px',
        }
        // If you use the maximum value, the selected pixel will be empty, and the empty default is black
        const imgData = ctx.getImageData(0, Math.min(y, this.height - 1), 1, 1)
        const [r, g, b] = imgData.data
        this.$emit('selectHue', { r, g, b })
      }
      mousemove(e)
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
  },
})

const _hoisted_1$1 = { ref: 'canvasHue' }

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock(
      'div',
      {
        class: 'hue',
        onMousedown:
          _cache[1] ||
          (_cache[1] = withModifiers(
            (...args) => _ctx.selectHue && _ctx.selectHue(...args),
            ['prevent', 'stop']
          )),
      },
      [
        createVNode('canvas', _hoisted_1$1, null, 512 /* NEED_PATCH */),
        createVNode(
          'div',
          {
            style: _ctx.slideHueStyle,
            class: 'slide',
          },
          null,
          4 /* STYLE */
        ),
      ],
      32 /* HYDRATE_EVENTS */
    )
  )
}

script$1.render = render$1
script$1.__file = 'src/color/Hue.vue'

var script$2 = defineComponent({
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    rgba: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 15,
    },
    height: {
      type: Number,
      default: 152,
    },
  },
  emits: ['selectAlpha'],
  data() {
    return {
      slideAlphaStyle: {},
      alphaSize: 5,
    }
  },
  watch: {
    color() {
      this.renderColor()
    },
    'rgba.a'() {
      this.renderSlide()
    },
  },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas = this.$refs.canvasAlpha
      const width = this.width
      const height = this.height
      const size = this.alphaSize
      const canvasSquare = createAlphaSquare(size)
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, width, height)
      createLinearGradient(
        'p',
        ctx,
        width,
        height,
        'rgba(255,255,255,0)',
        this.color
      )
    },
    renderSlide() {
      this.slideAlphaStyle = {
        top: this.rgba.a * this.height - 2 + 'px',
      }
    },
    selectAlpha(e) {
      const { top: hueTop } = this.$el.getBoundingClientRect()
      const mousemove = (e) => {
        let y = e.clientY - hueTop
        if (y < 0) {
          y = 0
        }
        if (y > this.height) {
          y = this.height
        }
        let a = parseFloat((y / this.height).toFixed(2))
        this.$emit('selectAlpha', a)
      }
      mousemove(e)
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
  },
})

const _hoisted_1$2 = { ref: 'canvasAlpha' }

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock(
      'div',
      {
        class: 'color-alpha',
        onMousedown:
          _cache[1] ||
          (_cache[1] = withModifiers(
            (...args) => _ctx.selectAlpha && _ctx.selectAlpha(...args),
            ['prevent', 'stop']
          )),
      },
      [
        createVNode('canvas', _hoisted_1$2, null, 512 /* NEED_PATCH */),
        createVNode(
          'div',
          {
            style: _ctx.slideAlphaStyle,
            class: 'slide',
          },
          null,
          4 /* STYLE */
        ),
      ],
      32 /* HYDRATE_EVENTS */
    )
  )
}

script$2.render = render$2
script$2.__file = 'src/color/Alpha.vue'

var script$3 = defineComponent({
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      alphaSize: 5,
    }
  },
  watch: {
    color() {
      this.renderColor()
    },
  },
  mounted() {
    this.renderColor()
  },
  methods: {
    renderColor() {
      const canvas = this.$el
      const width = this.width
      const height = this.height
      const size = this.alphaSize
      const canvasSquare = createAlphaSquare(size)
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, width, height)
    },
  },
})

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock('canvas')
}

script$3.render = render$3
script$3.__file = 'src/color/Preview.vue'

var script$4 = defineComponent({
  props: {
    suckerCanvas: {
      type: HTMLCanvasElement,
      default: null,
    },
    suckerPosition: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isOpenSucker: false,
      suckerPreview: null,
      container: null,
      width: 0,
      height: 0,
      previewSize: 110,
      color: { r: 0, g: 0, b: 0, a: 0 },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.container = document.body
    })
  },
  watch: {
    suckerPosition: function (val) {
      if (
        !this.isOpenSucker ||
        !this.suckerPosition ||
        this.suckerPosition.length !== 4 ||
        !this.suckerCanvas
      )
        return
      const x = Math.round(val[0] * this.suckerCanvas.width)
      const y = Math.round(val[1] * this.suckerCanvas.height)
      console.log('x, y', x, y)
      const ctx = this.suckerPreview.getContext('2d')
      ctx.clearRect(0, 0, this.previewSize, this.previewSize)
      const mr = 5
      const sx = x - mr
      const sy = y - mr
      for (let _x = x - mr; _x <= x + mr; _x++) {
        for (let _y = y - mr; _y <= y + mr; _y++) {
          const { r, g, b, a } = this.getColor(_x, _y)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
          const box = [(_x - sx) * 10, (_y - sy) * 10, 10, 10]
          ctx.fillRect(...box)
          if (_x === x && _y === y) {
            this.color = { r, g, b, a }
            ctx.strokeStyle = '#000'
            const bbox = [box[0], box[1], box[2] - 1, box[3] - 1]
            ctx.strokeRect(...bbox)
          }
        }
      }
      const style = this.suckerPreview.style
      Object.assign(style, {
        position: 'absolute',
        left: val[2] - this.previewSize / 2 + 'px',
        top: val[3] - this.previewSize / 2 + 'px',
        zIndex: 99999,
      })
      if (val[0] >= 0 && val[1] >= 0 && val[0] <= 1 && val[1] <= 1) {
        style.display = ''
        style.cursor = 'none'
      } else {
        // @ts-ignore
        style.display = 'none'
        style.cursor = 'default'
      }
    },
  },
  methods: {
    openSucker() {
      if (!this.isOpenSucker) {
        if (this.suckerCanvas && this.suckerCanvas.tagName !== 'CANVAS') {
          return
        }
        this.isOpenSucker = true
        this.$emit('openSucker', true)
        this.suckerPreview = document.createElement('canvas')
        this.suckerPreview.width = this.previewSize
        this.suckerPreview.height = this.previewSize
        this.suckerPreview.style.border = '1px solid #000'
        this.suckerPreview.style.borderRadius = '50%'
        this.container.appendChild(this.suckerPreview)
        this.suckerPreview.addEventListener('click', this.select)
        document.addEventListener('keydown', this.keydownHandler)
      } else {
        // The processing logic is the same as pressing the esc key
        this.keydownHandler({ keyCode: 27 })
      }
    },
    destorySucker() {
      this.isOpenSucker = false
      this.$emit('openSucker', false)
      document.removeEventListener('keydown', this.keydownHandler)
      if (this.suckerPreview) {
        // @ts-ignore
        this.suckerPreview.removeEventListener('click', this.select)
        this.container.removeChild(this.suckerPreview)
        this.suckerPreview = null
      }
    },
    keydownHandler(e) {
      // esc
      if (e.keyCode === 27) {
        this.destorySucker()
      }
    },
    getColor(x, y) {
      // @ts-ignore
      const ctx = this.suckerCanvas.getContext('2d')
      const imgData = ctx.getImageData(
        Math.min(x, Math.round(this.suckerCanvas.width - 1)),
        Math.min(y, Math.round(this.suckerCanvas.height - 1)),
        1,
        1
      )
      let [r, g, b, a] = imgData.data
      return { r, g, b, a }
    },
    select(e) {
      let { r, g, b, a } = this.color
      a = parseFloat((a / 255).toFixed(2))
      this.$emit('selectSucker', { r, g, b, a })
    },
  },
  unmounted() {
    this.destorySucker()
  },
})

const _hoisted_1$3 = /*#__PURE__*/ createVNode(
  'path',
  {
    d:
      'M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1',
  },
  null,
  -1 /* HOISTED */
)

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock('div', null, [
      (openBlock(),
      createBlock(
        'svg',
        {
          class: [{ active: _ctx.isOpenSucker }, 'sucker'],
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '-12 -12 48 48',
          onClick:
            _cache[1] ||
            (_cache[1] = (...args) =>
              _ctx.openSucker && _ctx.openSucker(...args)),
        },
        [_hoisted_1$3],
        2 /* CLASS */
      )),
    ])
  )
}

script$4.render = render$4
script$4.__file = 'src/color/Sucker.vue'

var script$5 = defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  methods: {
    stop(e) {
      e.stopPropagation()
    },
  },
  emits: ['inputColor'],
  setup(props, { emit }) {
    const modelColor = computed({
      get() {
        return props.color || ''
      },
      set(val) {
        emit('inputColor', val)
      },
    })
    return {
      modelColor,
    }
  },
})

const _hoisted_1$4 = { class: 'color-type' }
const _hoisted_2 = { class: 'name' }

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock('div', _hoisted_1$4, [
      createVNode('span', _hoisted_2, toDisplayString(_ctx.name), 1 /* TEXT */),
      withDirectives(
        createVNode(
          'input',
          {
            'onUpdate:modelValue':
              _cache[1] || (_cache[1] = ($event) => (_ctx.modelColor = $event)),
            onKeydown:
              _cache[2] ||
              (_cache[2] = (...args) => _ctx.stop && _ctx.stop(...args)),
            class: 'value',
          },
          null,
          544 /* HYDRATE_EVENTS, NEED_PATCH */
        ),
        [[vModelText, _ctx.modelColor]]
      ),
    ])
  )
}

script$5.render = render$5
script$5.__file = 'src/color/Box.vue'

var script$6 = defineComponent({
  name: 'ColorPicker',
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    colorsDefault: {
      type: Array,
    },
    colorsHistoryKey: {
      type: String,
      default: '',
    },
  },
  emits: ['selectColor'],
  setup(props, { emit }) {
    const color = ref()
    const colorsHistory = ref([])
    const imgAlphaBase64 = ref()
    if (props.colorsHistoryKey && localStorage) {
      colorsHistory.value =
        JSON.parse(localStorage.getItem(props.colorsHistoryKey)) || []
    }
    imgAlphaBase64.value = createAlphaSquare(4).toDataURL()
    onUnmounted(() => {
      setColorsHistory(color.value)
    })
    function setColorsHistory(color) {
      if (!color) {
        return
      }
      const colors = colorsHistory.value || []
      // @ts-ignore
      const index = colors.indexOf(color)
      if (index >= 0) {
        colors.splice(index, 1)
      }
      if (colors.length >= 8) {
        colors.length = 7
      }
      // @ts-ignore
      colors.unshift(color)
      colorsHistory.value = colors || []
      if (localStorage && props.colorsHistoryKey)
        localStorage.setItem(props.colorsHistoryKey, JSON.stringify(colors))
    }
    function selectColor(color) {
      emit('selectColor', color)
    }
    return {
      setColorsHistory,
      colorsHistory,
      color,
      imgAlphaBase64,
      selectColor,
    }
  },
})

const _hoisted_1$5 = { class: 'colors' }
const _hoisted_2$1 = {
  key: 2,
  class: 'none',
}
const _hoisted_3 = {
  key: 0,
  class: 'colors history',
}

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock('div', null, [
      createVNode('ul', _hoisted_1$5, [
        (openBlock(true),
        createBlock(
          Fragment,
          null,
          renderList(_ctx.colorsDefault, (item) => {
            return (
              openBlock(),
              createBlock(
                'li',
                {
                  key: item,
                  class: ['item', item ? 'item' : 'item border1'],
                  onClick: ($event) => _ctx.selectColor(item),
                },
                [
                  item
                    ? (openBlock(),
                      createBlock(
                        'div',
                        {
                          key: 0,
                          style: { background: `url(${_ctx.imgAlphaBase64})` },
                          class: 'alpha',
                        },
                        null,
                        4 /* STYLE */
                      ))
                    : createCommentVNode('v-if', true),
                  item
                    ? (openBlock(),
                      createBlock(
                        'div',
                        {
                          key: 1,
                          style: { background: item },
                          class: 'color',
                        },
                        null,
                        4 /* STYLE */
                      ))
                    : (openBlock(), createBlock('div', _hoisted_2$1)),
                ],
                10 /* CLASS, PROPS */,
                ['onClick']
              )
            )
          }),
          128 /* KEYED_FRAGMENT */
        )),
      ]),
      _ctx.colorsHistory.length
        ? (openBlock(),
          createBlock('ul', _hoisted_3, [
            (openBlock(true),
            createBlock(
              Fragment,
              null,
              renderList(_ctx.colorsHistory, (item) => {
                return (
                  openBlock(),
                  createBlock(
                    'li',
                    {
                      key: item,
                      class: 'item',
                      onClick: ($event) => _ctx.selectColor(item),
                    },
                    [
                      createVNode(
                        'div',
                        {
                          style: { background: `url(${_ctx.imgAlphaBase64})` },
                          class: 'alpha',
                        },
                        null,
                        4 /* STYLE */
                      ),
                      createVNode(
                        'div',
                        {
                          style: { background: item },
                          class: 'color',
                        },
                        null,
                        4 /* STYLE */
                      ),
                    ],
                    8 /* PROPS */,
                    ['onClick']
                  )
                )
              }),
              128 /* KEYED_FRAGMENT */
            )),
          ]))
        : createCommentVNode('v-if', true),
    ])
  )
}

script$6.render = render$6
script$6.__file = 'src/color/Colors.vue'

var script$7 = defineComponent({
  components: {
    Saturation: script,
    Hue: script$1,
    Alpha: script$2,
    Preview: script$3,
    Sucker: script$4,
    Box: script$5,
    Colors: script$6,
  },
  emits: ['changeColor', 'openSucker'],
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    theme: {
      type: String,
      default: 'dark',
    },
    suckerHide: {
      type: Boolean,
      default: true,
    },
    suckerCanvas: {
      type: null,
      default: null,
    },
    suckerPosition: {
      type: null,
      default: null,
    },
    colorsDefault: {
      type: Array,
      default: () => [
        '',
        '#FFFFFF',
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        'rgba(0,0,0,0)',
      ],
    },
    colorsHistoryKey: {
      type: String,
      default: 'vue-colorpicker-history',
    },
  },
  data() {
    return {
      hueWidth: 15,
      hueHeight: 152,
      previewHeight: 30,
      modelRgba: '',
      modelHex: '',
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      h: 0,
      s: 0,
      v: 0,
      noneColor: true,
    }
  },
  computed: {
    isLightTheme() {
      return this.theme === 'light'
    },
    totalWidth() {
      return this.hueHeight + (this.hueWidth + 8) * 2
    },
    previewWidth() {
      return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight)
    },
    rgba() {
      return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
      }
    },
    hsv() {
      return {
        h: this.h,
        s: this.s,
        v: this.v,
      }
    },
    rgbString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    },
    rgbaStringShort() {
      return `${this.r}, ${this.g}, ${this.b}, ${this.a}`
    },
    rgbaString() {
      return `rgba(${this.rgbaStringShort})`
    },
    hexString() {
      return rgb2hex(this.rgba, true)
    },
  },
  created() {
    Object.assign(this, setColorValue(this.color))
    this.setText()
    this.$watch('rgba', () => {
      this.$emit('changeColor', {
        noneColor: this.noneColor,
        rgba: this.rgba,
        hsv: this.hsv,
        hex: this.modelHex,
      })
    })
  },
  methods: {
    selectSaturation(color) {
      const { r, g, b, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, h, s, v })
      this.setText()
    },
    selectHue(color) {
      const { r, g, b, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
      })
    },
    selectAlpha(a) {
      this.a = a
      this.setText()
    },
    inputHex(color) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.modelHex = color
      this.modelRgba = this.rgbaStringShort
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
    inputRgba(color) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.modelHex = this.hexString
      this.modelRgba = color
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
    setText() {
      this.modelHex = this.hexString
      this.modelRgba = this.rgbaStringShort
    },
    openSucker(isOpen) {
      this.$emit('openSucker', isOpen)
    },
    selectSucker(color) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
    selectColor(color) {
      this.noneColor = color === ''
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
  },
})

const _hoisted_1$6 = { class: 'color-set' }

function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Saturation = resolveComponent('Saturation')
  const _component_Hue = resolveComponent('Hue')
  const _component_Alpha = resolveComponent('Alpha')
  const _component_Preview = resolveComponent('Preview')
  const _component_Sucker = resolveComponent('Sucker')
  const _component_Box = resolveComponent('Box')
  const _component_Colors = resolveComponent('Colors')

  return (
    openBlock(),
    createBlock(
      'div',
      {
        class: ['hu-color-picker', { light: _ctx.isLightTheme }],
      },
      [
        createVNode('div', _hoisted_1$6, [
          createVNode(
            _component_Saturation,
            {
              ref: 'saturation',
              color: _ctx.rgbString,
              hsv: _ctx.hsv,
              size: _ctx.hueHeight,
              onSelectSaturation: _ctx.selectSaturation,
            },
            null,
            8 /* PROPS */,
            ['color', 'hsv', 'size', 'onSelectSaturation']
          ),
          createVNode(
            _component_Hue,
            {
              ref: 'hue',
              hsv: _ctx.hsv,
              width: _ctx.hueWidth,
              height: _ctx.hueHeight,
              onSelectHue: _ctx.selectHue,
            },
            null,
            8 /* PROPS */,
            ['hsv', 'width', 'height', 'onSelectHue']
          ),
          createVNode(
            _component_Alpha,
            {
              ref: 'alpha',
              color: _ctx.rgbString,
              rgba: _ctx.rgba,
              width: _ctx.hueWidth,
              height: _ctx.hueHeight,
              onSelectAlpha: _ctx.selectAlpha,
            },
            null,
            8 /* PROPS */,
            ['color', 'rgba', 'width', 'height', 'onSelectAlpha']
          ),
        ]),
        createVNode(
          'div',
          {
            style: { height: _ctx.previewHeight + 'px' },
            class: 'color-show',
          },
          [
            createVNode(
              _component_Preview,
              {
                color: _ctx.rgbaString,
                width: _ctx.previewWidth,
                height: _ctx.previewHeight,
              },
              null,
              8 /* PROPS */,
              ['color', 'width', 'height']
            ),
            !_ctx.suckerHide
              ? (openBlock(),
                createBlock(
                  _component_Sucker,
                  {
                    key: 0,
                    'sucker-canvas': _ctx.suckerCanvas,
                    'sucker-position': _ctx.suckerPosition,
                    onOpenSucker: _ctx.openSucker,
                    onSelectSucker: _ctx.selectSucker,
                  },
                  null,
                  8 /* PROPS */,
                  [
                    'sucker-canvas',
                    'sucker-position',
                    'onOpenSucker',
                    'onSelectSucker',
                  ]
                ))
              : createCommentVNode('v-if', true),
          ],
          4 /* STYLE */
        ),
        createVNode(
          _component_Box,
          {
            name: 'HEX',
            color: _ctx.modelHex,
            onInputColor: _ctx.inputHex,
          },
          null,
          8 /* PROPS */,
          ['color', 'onInputColor']
        ),
        createVNode(
          _component_Box,
          {
            name: 'RGBA',
            color: _ctx.modelRgba,
            onInputColor: _ctx.inputRgba,
          },
          null,
          8 /* PROPS */,
          ['color', 'onInputColor']
        ),
        createVNode(
          _component_Colors,
          {
            color: _ctx.rgbaString,
            'colors-default': _ctx.colorsDefault,
            'colors-history-key': _ctx.colorsHistoryKey,
            onSelectColor: _ctx.selectColor,
          },
          null,
          8 /* PROPS */,
          ['color', 'colors-default', 'colors-history-key', 'onSelectColor']
        ),
        createCommentVNode(' custom options '),
        renderSlot(_ctx.$slots, 'default'),
      ],
      2 /* CLASS */
    )
  )
}

script$7.render = render$7
script$7.__file = 'src/color/ColorPicker.vue'

script$7.install = (Vue) => {
  Vue.component(script$7.name, script$7)
}

function install(Vue) {
  Vue.component(script$7.name, script$7)
}
var index = { install }

export default index
export { script$7 as ColorPicker }
