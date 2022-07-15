declare const _default: import('vue').DefineComponent<
  {
    color: {
      type: StringConstructor
      default: string
    }
    theme: {
      type: StringConstructor
      default: string
    }
    suckerHide: {
      type: BooleanConstructor
      default: boolean
    }
    suckerCanvas: {
      type: any
      default: any
    }
    suckerPosition: {
      type: any
      default: any
    }
    colorsDefault: {
      type: ArrayConstructor
      default: () => string[]
    }
    colorsHistoryKey: {
      type: StringConstructor
      default: string
    }
  },
  unknown,
  {
    hueWidth: number
    hueHeight: number
    previewHeight: number
    modelRgba: string
    modelHex: string
    r: number
    g: number
    b: number
    a: number
    h: number
    s: number
    v: number
  },
  {
    isLightTheme(): boolean
    totalWidth(): number
    previewWidth(): number
    rgba(): object
    hsv(): object
    rgbString(): string
    rgbaStringShort(): string
    rgbaString(): string
    hexString(): string
  },
  {
    selectSaturation(color: any): void
    selectHue(color: any): void
    selectAlpha(a: any): void
    inputHex(color: string): void
    inputRgba(color: string): void
    setText(): void
    openSucker(isOpen: boolean): void
    selectSucker(color: string): void
    selectColor(color: string): void
  },
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  ('changeColor' | 'openSucker')[],
  'changeColor' | 'openSucker',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      color: string
      theme: string
      suckerHide: boolean
      suckerCanvas: any
      suckerPosition: any
      colorsDefault: unknown[]
      colorsHistoryKey: string
    } & {}
  >,
  {
    color: string
    theme: string
    suckerHide: boolean
    suckerCanvas: any
    suckerPosition: any
    colorsDefault: unknown[]
    colorsHistoryKey: string
  }
>
export default _default
//# sourceMappingURL=ColorPicker.vue?vue&type=script&lang.d.ts.map
