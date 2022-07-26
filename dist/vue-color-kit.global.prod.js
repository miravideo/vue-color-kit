/*!
 * vue-color-kit v1.0.8
 * (c) 2022
 * @license MIT
 */
var VueColorKit = (function (e, t) {
  'use strict'
  function o(e) {
    let t = { r: 0, g: 0, b: 0, a: 1 }
    ;/#/.test(e)
      ? (t = (function (e) {
          e = e.slice(1)
          const t = (e) => parseInt(e, 16) || 0
          return {
            r: t(e.slice(0, 2)),
            g: t(e.slice(2, 4)),
            b: t(e.slice(4, 6)),
          }
        })(e))
      : /rgb/.test(e)
      ? (t = i(e))
      : 'string' == typeof e
      ? (t = i(`rgba(${e})`))
      : '[object Object]' === Object.prototype.toString.call(e) && (t = e)
    const { r: o, g: r, b: s, a: l } = t,
      { h: n, s: a, v: c } = (function ({ r: e, g: t, b: o }) {
        ;(e /= 255), (t /= 255), (o /= 255)
        const r = Math.max(e, t, o),
          s = Math.min(e, t, o),
          i = r - s
        let l = 0
        r === s
          ? (l = 0)
          : r === e
          ? (l = t >= o ? (60 * (t - o)) / i : (60 * (t - o)) / i + 360)
          : r === t
          ? (l = (60 * (o - e)) / i + 120)
          : r === o && (l = (60 * (e - t)) / i + 240)
        l = Math.floor(l)
        let n = parseFloat((0 === r ? 0 : 1 - s / r).toFixed(2)),
          a = parseFloat(r.toFixed(2))
        return { h: l, s: n, v: a }
      })(t)
    return { r: o, g: r, b: s, a: void 0 === l ? 1 : l, h: n, s: a, v: c }
  }
  function r(e) {
    const t = document.createElement('canvas'),
      o = t.getContext('2d'),
      r = 2 * e
    return (
      (t.width = r),
      (t.height = r),
      (o.fillStyle = '#ffffff'),
      o.fillRect(0, 0, r, r),
      (o.fillStyle = '#ccd5db'),
      o.fillRect(0, 0, e, e),
      o.fillRect(e, e, e, e),
      t
    )
  }
  function s(e, t, o, r, s, i) {
    const l = 'l' === e,
      n = t.createLinearGradient(0, 0, l ? o : 0, l ? 0 : r)
    n.addColorStop(0.01, s),
      n.addColorStop(0.99, i),
      (t.fillStyle = n),
      t.fillRect(0, 0, o, r)
  }
  function i(e) {
    return 'string' == typeof e
      ? ((e = (/rgba?\((.*?)\)/.exec(e) || ['', '0,0,0,1'])[1].split(',')),
        {
          r: Number(e[0]) || 0,
          g: Number(e[1]) || 0,
          b: Number(e[2]) || 0,
          a: Number(e[3] ? e[3] : 1),
        })
      : e
  }
  var l = t.defineComponent({
    props: {
      color: { type: String, default: '#000000' },
      hsv: { type: Object, default: null },
      size: { type: Number, default: 152 },
    },
    emits: ['selectSaturation'],
    data: () => ({ slideSaturationStyle: {} }),
    mounted() {
      this.renderColor(), this.renderSlide()
    },
    methods: {
      renderColor() {
        const e = this.$refs.canvasSaturation,
          t = this.size,
          o = e.getContext('2d')
        ;(e.width = t),
          (e.height = t),
          (o.fillStyle = this.color),
          o.fillRect(0, 0, t, t),
          s('l', o, t, t, '#FFFFFF', 'rgba(255,255,255,0)'),
          s('p', o, t, t, 'rgba(0,0,0,0)', '#000000')
      },
      renderSlide() {
        this.slideSaturationStyle = {
          left: this.hsv.s * this.size - 5 + 'px',
          top: (1 - this.hsv.v) * this.size - 5 + 'px',
        }
      },
      selectSaturation(e) {
        const { top: t, left: o } = this.$el.getBoundingClientRect(),
          r = e.target.getContext('2d'),
          s = (e) => {
            let s = e.clientX - o,
              i = e.clientY - t
            s < 0 && (s = 0),
              i < 0 && (i = 0),
              s > this.size && (s = this.size),
              i > this.size && (i = this.size),
              (this.slideSaturationStyle = {
                left: s - 5 + 'px',
                top: i - 5 + 'px',
              })
            const l = r.getImageData(
                Math.min(s, this.size - 1),
                Math.min(i, this.size - 1),
                1,
                1
              ),
              [n, a, c] = l.data
            this.$emit('selectSaturation', { r: n, g: a, b: c })
          }
        s(e)
        const i = () => {
          document.removeEventListener('mousemove', s),
            document.removeEventListener('mouseup', i)
        }
        document.addEventListener('mousemove', s),
          document.addEventListener('mouseup', i)
      },
    },
  })
  const n = { ref: 'canvasSaturation' }
  ;(l.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock(
        'div',
        {
          class: 'saturation',
          onMousedown:
            o[1] ||
            (o[1] = t.withModifiers(
              (...t) => e.selectSaturation && e.selectSaturation(...t),
              ['prevent', 'stop']
            )),
        },
        [
          t.createVNode('canvas', n, null, 512),
          t.createVNode(
            'div',
            { style: e.slideSaturationStyle, class: 'slide' },
            null,
            4
          ),
        ],
        32
      )
    )
  }),
    (l.__file = 'src/color/Saturation.vue')
  var a = t.defineComponent({
    props: {
      hsv: { type: Object, default: null },
      width: { type: Number, default: 15 },
      height: { type: Number, default: 152 },
    },
    emits: ['selectHue'],
    data: () => ({ slideHueStyle: {} }),
    mounted() {
      this.renderColor(), this.renderSlide()
    },
    methods: {
      renderColor() {
        const e = this.$refs.canvasHue,
          t = this.width,
          o = this.height,
          r = e.getContext('2d')
        ;(e.width = t), (e.height = o)
        const s = r.createLinearGradient(0, 0, 0, o)
        s.addColorStop(0, '#FF0000'),
          s.addColorStop(0.17, '#FF00FF'),
          s.addColorStop(0.34, '#0000FF'),
          s.addColorStop(0.51, '#00FFFF'),
          s.addColorStop(0.68, '#00FF00'),
          s.addColorStop(0.17 * 5, '#FFFF00'),
          s.addColorStop(1, '#FF0000'),
          (r.fillStyle = s),
          r.fillRect(0, 0, t, o)
      },
      renderSlide() {
        this.slideHueStyle = {
          top: (1 - this.hsv.h / 360) * this.height - 2 + 'px',
        }
      },
      selectHue(e) {
        const { top: t } = this.$el.getBoundingClientRect(),
          o = e.target.getContext('2d'),
          r = (e) => {
            let r = e.clientY - t
            r < 0 && (r = 0),
              r > this.height && (r = this.height),
              (this.slideHueStyle = { top: r - 2 + 'px' })
            const s = o.getImageData(0, Math.min(r, this.height - 1), 1, 1),
              [i, l, n] = s.data
            this.$emit('selectHue', { r: i, g: l, b: n })
          }
        r(e)
        const s = () => {
          document.removeEventListener('mousemove', r),
            document.removeEventListener('mouseup', s)
        }
        document.addEventListener('mousemove', r),
          document.addEventListener('mouseup', s)
      },
    },
  })
  const c = { ref: 'canvasHue' }
  ;(a.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock(
        'div',
        {
          class: 'hue',
          onMousedown:
            o[1] ||
            (o[1] = t.withModifiers(
              (...t) => e.selectHue && e.selectHue(...t),
              ['prevent', 'stop']
            )),
        },
        [
          t.createVNode('canvas', c, null, 512),
          t.createVNode(
            'div',
            { style: e.slideHueStyle, class: 'slide' },
            null,
            4
          ),
        ],
        32
      )
    )
  }),
    (a.__file = 'src/color/Hue.vue')
  var h = t.defineComponent({
    props: {
      color: { type: String, default: '#000000' },
      rgba: { type: Object, default: null },
      width: { type: Number, default: 15 },
      height: { type: Number, default: 152 },
    },
    emits: ['selectAlpha'],
    data: () => ({ slideAlphaStyle: {}, alphaSize: 5 }),
    watch: {
      color() {
        this.renderColor()
      },
      'rgba.a'() {
        this.renderSlide()
      },
    },
    mounted() {
      this.renderColor(), this.renderSlide()
    },
    methods: {
      renderColor() {
        const e = this.$refs.canvasAlpha,
          t = this.width,
          o = this.height,
          i = r(this.alphaSize),
          l = e.getContext('2d')
        ;(e.width = t),
          (e.height = o),
          (l.fillStyle = l.createPattern(i, 'repeat')),
          l.fillRect(0, 0, t, o),
          s('p', l, t, o, 'rgba(255,255,255,0)', this.color)
      },
      renderSlide() {
        this.slideAlphaStyle = { top: this.rgba.a * this.height - 2 + 'px' }
      },
      selectAlpha(e) {
        const { top: t } = this.$el.getBoundingClientRect(),
          o = (e) => {
            let o = e.clientY - t
            o < 0 && (o = 0), o > this.height && (o = this.height)
            let r = parseFloat((o / this.height).toFixed(2))
            this.$emit('selectAlpha', r)
          }
        o(e)
        const r = () => {
          document.removeEventListener('mousemove', o),
            document.removeEventListener('mouseup', r)
        }
        document.addEventListener('mousemove', o),
          document.addEventListener('mouseup', r)
      },
    },
  })
  const u = { ref: 'canvasAlpha' }
  ;(h.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock(
        'div',
        {
          class: 'color-alpha',
          onMousedown:
            o[1] ||
            (o[1] = t.withModifiers(
              (...t) => e.selectAlpha && e.selectAlpha(...t),
              ['prevent', 'stop']
            )),
        },
        [
          t.createVNode('canvas', u, null, 512),
          t.createVNode(
            'div',
            { style: e.slideAlphaStyle, class: 'slide' },
            null,
            4
          ),
        ],
        32
      )
    )
  }),
    (h.__file = 'src/color/Alpha.vue')
  var d = t.defineComponent({
    props: {
      color: { type: String, default: '#000000' },
      width: { type: Number, default: 100 },
      height: { type: Number, default: 30 },
    },
    data: () => ({ alphaSize: 5 }),
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
        const e = this.$el,
          t = this.width,
          o = this.height,
          s = r(this.alphaSize),
          i = e.getContext('2d')
        ;(e.width = t),
          (e.height = o),
          (i.fillStyle = i.createPattern(s, 'repeat')),
          i.fillRect(0, 0, t, o),
          (i.fillStyle = this.color),
          i.fillRect(0, 0, t, o)
      },
    },
  })
  ;(d.render = function (e, o, r, s, i, l) {
    return t.openBlock(), t.createBlock('canvas')
  }),
    (d.__file = 'src/color/Preview.vue')
  var p = t.defineComponent({
    props: {
      suckerCanvas: { type: HTMLCanvasElement, default: null },
      suckerPosition: { type: Array, default: [] },
    },
    data: () => ({
      isOpenSucker: !1,
      suckerPreview: null,
      container: null,
      width: 0,
      height: 0,
      previewSize: 110,
      color: { r: 0, g: 0, b: 0, a: 0 },
    }),
    mounted() {
      this.$nextTick(() => {
        this.container = document.body
      })
    },
    watch: {
      suckerPosition: function (e) {
        if (
          !this.isOpenSucker ||
          !this.suckerPosition ||
          4 !== this.suckerPosition.length ||
          !this.suckerCanvas
        )
          return
        const t = Math.round(e[0] * this.suckerCanvas.width),
          o = Math.round(e[1] * this.suckerCanvas.height)
        console.log('x, y', t, o)
        const r = this.suckerPreview.getContext('2d')
        r.clearRect(0, 0, this.previewSize, this.previewSize)
        const s = t - 5,
          i = o - 5
        for (let e = t - 5; e <= t + 5; e++)
          for (let l = o - 5; l <= o + 5; l++) {
            const { r: n, g: a, b: c, a: h } = this.getColor(e, l)
            r.fillStyle = `rgba(${n}, ${a}, ${c}, ${h})`
            const u = [10 * (e - s), 10 * (l - i), 10, 10]
            if ((r.fillRect(...u), e === t && l === o)) {
              ;(this.color = { r: n, g: a, b: c, a: h }),
                (r.strokeStyle = '#000')
              r.strokeRect(...[u[0], u[1], u[2] - 1, u[3] - 1])
            }
          }
        const l = this.suckerPreview.style
        Object.assign(l, {
          position: 'absolute',
          left: e[2] - this.previewSize / 2 + 'px',
          top: e[3] - this.previewSize / 2 + 'px',
          zIndex: 99999,
        }),
          e[0] >= 0 && e[1] >= 0 && e[0] <= 1 && e[1] <= 1
            ? ((l.display = ''), (l.cursor = 'none'))
            : ((l.display = 'none'), (l.cursor = 'default'))
      },
    },
    methods: {
      openSucker() {
        if (this.isOpenSucker) this.keydownHandler({ keyCode: 27 })
        else {
          if (this.suckerCanvas && 'CANVAS' !== this.suckerCanvas.tagName)
            return
          ;(this.isOpenSucker = !0),
            this.$emit('openSucker', !0),
            (this.suckerPreview = document.createElement('canvas')),
            (this.suckerPreview.width = this.previewSize),
            (this.suckerPreview.height = this.previewSize),
            (this.suckerPreview.style.border = '1px solid #000'),
            (this.suckerPreview.style.borderRadius = '50%'),
            this.container.appendChild(this.suckerPreview),
            this.suckerPreview.addEventListener('click', this.select),
            document.addEventListener('keydown', this.keydownHandler)
        }
      },
      destorySucker() {
        ;(this.isOpenSucker = !1),
          this.$emit('openSucker', !1),
          document.removeEventListener('keydown', this.keydownHandler),
          this.suckerPreview &&
            (this.suckerPreview.removeEventListener('click', this.select),
            this.container.removeChild(this.suckerPreview),
            (this.suckerPreview = null))
      },
      keydownHandler(e) {
        27 === e.keyCode && this.destorySucker()
      },
      getColor(e, t) {
        const o = this.suckerCanvas
          .getContext('2d')
          .getImageData(
            Math.min(e, Math.round(this.suckerCanvas.width - 1)),
            Math.min(t, Math.round(this.suckerCanvas.height - 1)),
            1,
            1
          )
        let [r, s, i, l] = o.data
        return { r: r, g: s, b: i, a: l }
      },
      select(e) {
        let { r: t, g: o, b: r, a: s } = this.color
        ;(s = parseFloat((s / 255).toFixed(2))),
          this.$emit('selectSucker', { r: t, g: o, b: r, a: s })
      },
    },
    unmounted() {
      this.destorySucker()
    },
  })
  const g = t.createVNode(
    'path',
    {
      d:
        'M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1',
    },
    null,
    -1
  )
  ;(p.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock('div', null, [
        (t.openBlock(),
        t.createBlock(
          'svg',
          {
            class: [{ active: e.isOpenSucker }, 'sucker'],
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '-12 -12 48 48',
            onClick:
              o[1] || (o[1] = (...t) => e.openSucker && e.openSucker(...t)),
          },
          [g],
          2
        )),
      ])
    )
  }),
    (p.__file = 'src/color/Sucker.vue')
  var v = t.defineComponent({
    props: {
      name: { type: String, default: '' },
      color: { type: String, default: '' },
    },
    methods: {
      stop(e) {
        e.stopPropagation()
      },
    },
    emits: ['inputColor'],
    setup: (e, { emit: o }) => ({
      modelColor: t.computed({
        get: () => e.color || '',
        set(e) {
          o('inputColor', e)
        },
      }),
    }),
  })
  const m = { class: 'color-type' },
    S = { class: 'name' }
  ;(v.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock('div', m, [
        t.createVNode('span', S, t.toDisplayString(e.name), 1),
        t.withDirectives(
          t.createVNode(
            'input',
            {
              'onUpdate:modelValue': o[1] || (o[1] = (t) => (e.modelColor = t)),
              onKeydown: o[2] || (o[2] = (...t) => e.stop && e.stop(...t)),
              class: 'value',
            },
            null,
            544
          ),
          [[t.vModelText, e.modelColor]]
        ),
      ])
    )
  }),
    (v.__file = 'src/color/Box.vue')
  var f = t.defineComponent({
    name: 'ColorPicker',
    props: {
      color: { type: String, default: '#000000' },
      colorsDefault: { type: Array },
      colorsHistoryKey: { type: String, default: '' },
    },
    emits: ['selectColor'],
    setup(e, { emit: o }) {
      const s = t.ref(),
        i = t.ref([]),
        l = t.ref()
      function n(t) {
        if (!t) return
        const o = i.value || [],
          r = o.indexOf(t)
        r >= 0 && o.splice(r, 1),
          o.length >= 8 && (o.length = 7),
          o.unshift(t),
          (i.value = o || []),
          localStorage &&
            e.colorsHistoryKey &&
            localStorage.setItem(e.colorsHistoryKey, JSON.stringify(o))
      }
      return (
        e.colorsHistoryKey &&
          localStorage &&
          (i.value =
            JSON.parse(localStorage.getItem(e.colorsHistoryKey)) || []),
        (l.value = r(4).toDataURL()),
        t.onUnmounted(() => {
          n(s.value)
        }),
        {
          setColorsHistory: n,
          colorsHistory: i,
          color: s,
          imgAlphaBase64: l,
          selectColor: function (e) {
            o('selectColor', e)
          },
        }
      )
    },
  })
  const k = { class: 'colors' },
    C = { key: 0, class: 'colors history' }
  ;(f.render = function (e, o, r, s, i, l) {
    return (
      t.openBlock(),
      t.createBlock('div', null, [
        t.createVNode('ul', k, [
          (t.openBlock(!0),
          t.createBlock(
            t.Fragment,
            null,
            t.renderList(
              e.colorsDefault,
              (o) => (
                t.openBlock(),
                t.createBlock(
                  'li',
                  { key: o, class: 'item', onClick: (t) => e.selectColor(o) },
                  [
                    t.createVNode(
                      'div',
                      {
                        style: { background: `url(${e.imgAlphaBase64})` },
                        class: 'alpha',
                      },
                      null,
                      4
                    ),
                    t.createVNode(
                      'div',
                      { style: { background: o }, class: 'color' },
                      null,
                      4
                    ),
                  ],
                  8,
                  ['onClick']
                )
              )
            ),
            128
          )),
        ]),
        e.colorsHistory.length
          ? (t.openBlock(),
            t.createBlock('ul', C, [
              (t.openBlock(!0),
              t.createBlock(
                t.Fragment,
                null,
                t.renderList(
                  e.colorsHistory,
                  (o) => (
                    t.openBlock(),
                    t.createBlock(
                      'li',
                      {
                        key: o,
                        class: 'item',
                        onClick: (t) => e.selectColor(o),
                      },
                      [
                        t.createVNode(
                          'div',
                          {
                            style: { background: `url(${e.imgAlphaBase64})` },
                            class: 'alpha',
                          },
                          null,
                          4
                        ),
                        t.createVNode(
                          'div',
                          { style: { background: o }, class: 'color' },
                          null,
                          4
                        ),
                      ],
                      8,
                      ['onClick']
                    )
                  )
                ),
                128
              )),
            ]))
          : t.createCommentVNode('v-if', !0),
      ])
    )
  }),
    (f.__file = 'src/color/Colors.vue')
  var y = t.defineComponent({
    components: {
      Saturation: l,
      Hue: a,
      Alpha: h,
      Preview: d,
      Sucker: p,
      Box: v,
      Colors: f,
    },
    emits: ['changeColor', 'openSucker'],
    props: {
      color: { type: String, default: '#000000' },
      theme: { type: String, default: 'dark' },
      suckerHide: { type: Boolean, default: !0 },
      suckerCanvas: { type: null, default: null },
      suckerPosition: { type: null, default: null },
      colorsDefault: {
        type: Array,
        default: () => [
          '#000000',
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
      colorsHistoryKey: { type: String, default: 'vue-colorpicker-history' },
    },
    data: () => ({
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
    }),
    computed: {
      isLightTheme() {
        return 'light' === this.theme
      },
      totalWidth() {
        return this.hueHeight + 2 * (this.hueWidth + 8)
      },
      previewWidth() {
        return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight)
      },
      rgba() {
        return { r: this.r, g: this.g, b: this.b, a: this.a }
      },
      hsv() {
        return { h: this.h, s: this.s, v: this.v }
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
        return (function ({ r: e, g: t, b: o }, r) {
          const s = (e) => ('0' + Number(e).toString(16)).slice(-2),
            i = `#${s(e)}${s(t)}${s(o)}`
          return r ? i.toUpperCase() : i
        })(this.rgba, !0)
      },
    },
    created() {
      Object.assign(this, o(this.color)),
        this.setText(),
        this.$watch('rgba', () => {
          this.$emit('changeColor', {
            rgba: this.rgba,
            hsv: this.hsv,
            hex: this.modelHex,
          })
        })
    },
    methods: {
      selectSaturation(e) {
        const { r: t, g: r, b: s, h: i, s: l, v: n } = o(e)
        Object.assign(this, { r: t, g: r, b: s, h: i, s: l, v: n }),
          this.setText()
      },
      selectHue(e) {
        const { r: t, g: r, b: s, h: i, s: l, v: n } = o(e)
        Object.assign(this, { r: t, g: r, b: s, h: i, s: l, v: n }),
          this.setText(),
          this.$nextTick(() => {
            this.$refs.saturation.renderColor(),
              this.$refs.saturation.renderSlide()
          })
      },
      selectAlpha(e) {
        ;(this.a = e), this.setText()
      },
      inputHex(e) {
        const { r: t, g: r, b: s, a: i, h: l, s: n, v: a } = o(e)
        Object.assign(this, { r: t, g: r, b: s, a: i, h: l, s: n, v: a }),
          (this.modelHex = e),
          (this.modelRgba = this.rgbaStringShort),
          this.$nextTick(() => {
            this.$refs.saturation.renderColor(),
              this.$refs.saturation.renderSlide(),
              this.$refs.hue.renderSlide()
          })
      },
      inputRgba(e) {
        const { r: t, g: r, b: s, a: i, h: l, s: n, v: a } = o(e)
        Object.assign(this, { r: t, g: r, b: s, a: i, h: l, s: n, v: a }),
          (this.modelHex = this.hexString),
          (this.modelRgba = e),
          this.$nextTick(() => {
            this.$refs.saturation.renderColor(),
              this.$refs.saturation.renderSlide(),
              this.$refs.hue.renderSlide()
          })
      },
      setText() {
        ;(this.modelHex = this.hexString),
          (this.modelRgba = this.rgbaStringShort)
      },
      openSucker(e) {
        this.$emit('openSucker', e)
      },
      selectSucker(e) {
        const { r: t, g: r, b: s, a: i, h: l, s: n, v: a } = o(e)
        Object.assign(this, { r: t, g: r, b: s, a: i, h: l, s: n, v: a }),
          this.setText(),
          this.$nextTick(() => {
            this.$refs.saturation.renderColor(),
              this.$refs.saturation.renderSlide(),
              this.$refs.hue.renderSlide()
          })
      },
      selectColor(e) {
        const { r: t, g: r, b: s, a: i, h: l, s: n, v: a } = o(e)
        Object.assign(this, { r: t, g: r, b: s, a: i, h: l, s: n, v: a }),
          this.setText(),
          this.$nextTick(() => {
            this.$refs.saturation.renderColor(),
              this.$refs.saturation.renderSlide(),
              this.$refs.hue.renderSlide()
          })
      },
    },
  })
  const b = { class: 'color-set' }
  ;(y.render = function (e, o, r, s, i, l) {
    const n = t.resolveComponent('Saturation'),
      a = t.resolveComponent('Hue'),
      c = t.resolveComponent('Alpha'),
      h = t.resolveComponent('Preview'),
      u = t.resolveComponent('Sucker'),
      d = t.resolveComponent('Box'),
      p = t.resolveComponent('Colors')
    return (
      t.openBlock(),
      t.createBlock(
        'div',
        { class: ['hu-color-picker', { light: e.isLightTheme }] },
        [
          t.createVNode('div', b, [
            t.createVNode(
              n,
              {
                ref: 'saturation',
                color: e.rgbString,
                hsv: e.hsv,
                size: e.hueHeight,
                onSelectSaturation: e.selectSaturation,
              },
              null,
              8,
              ['color', 'hsv', 'size', 'onSelectSaturation']
            ),
            t.createVNode(
              a,
              {
                ref: 'hue',
                hsv: e.hsv,
                width: e.hueWidth,
                height: e.hueHeight,
                onSelectHue: e.selectHue,
              },
              null,
              8,
              ['hsv', 'width', 'height', 'onSelectHue']
            ),
            t.createVNode(
              c,
              {
                ref: 'alpha',
                color: e.rgbString,
                rgba: e.rgba,
                width: e.hueWidth,
                height: e.hueHeight,
                onSelectAlpha: e.selectAlpha,
              },
              null,
              8,
              ['color', 'rgba', 'width', 'height', 'onSelectAlpha']
            ),
          ]),
          t.createVNode(
            'div',
            { style: { height: e.previewHeight + 'px' }, class: 'color-show' },
            [
              t.createVNode(
                h,
                {
                  color: e.rgbaString,
                  width: e.previewWidth,
                  height: e.previewHeight,
                },
                null,
                8,
                ['color', 'width', 'height']
              ),
              e.suckerHide
                ? t.createCommentVNode('v-if', !0)
                : (t.openBlock(),
                  t.createBlock(
                    u,
                    {
                      key: 0,
                      'sucker-canvas': e.suckerCanvas,
                      'sucker-position': e.suckerPosition,
                      onOpenSucker: e.openSucker,
                      onSelectSucker: e.selectSucker,
                    },
                    null,
                    8,
                    [
                      'sucker-canvas',
                      'sucker-position',
                      'onOpenSucker',
                      'onSelectSucker',
                    ]
                  )),
            ],
            4
          ),
          t.createVNode(
            d,
            { name: 'HEX', color: e.modelHex, onInputColor: e.inputHex },
            null,
            8,
            ['color', 'onInputColor']
          ),
          t.createVNode(
            d,
            { name: 'RGBA', color: e.modelRgba, onInputColor: e.inputRgba },
            null,
            8,
            ['color', 'onInputColor']
          ),
          t.createVNode(
            p,
            {
              color: e.rgbaString,
              'colors-default': e.colorsDefault,
              'colors-history-key': e.colorsHistoryKey,
              onSelectColor: e.selectColor,
            },
            null,
            8,
            ['color', 'colors-default', 'colors-history-key', 'onSelectColor']
          ),
          t.createCommentVNode(' custom options '),
          t.renderSlot(e.$slots, 'default'),
        ],
        2
      )
    )
  }),
    (y.__file = 'src/color/ColorPicker.vue'),
    (y.install = (e) => {
      e.component(y.name, y)
    })
  var w = {
    install: function (e) {
      e.component(y.name, y)
    },
  }
  return (
    (e.ColorPicker = y),
    (e.default = w),
    Object.defineProperty(e, '__esModule', { value: !0 }),
    e
  )
})({}, Vue)
