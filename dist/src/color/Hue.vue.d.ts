declare const _default: import('vue').DefineComponent<
  {
    hsv: {
      type: ObjectConstructor
      default: any
    }
    width: {
      type: NumberConstructor
      default: number
    }
    height: {
      type: NumberConstructor
      default: number
    }
  },
  unknown,
  {
    slideHueStyle: {}
  },
  {},
  {
    renderColor(): void
    renderSlide(): void
    selectHue(e: any): void
  },
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  'selectHue'[],
  'selectHue',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      hsv: Record<string, any>
      width: number
      height: number
    } & {}
  >,
  {
    hsv: Record<string, any>
    width: number
    height: number
  }
>
export default _default
//# sourceMappingURL=Hue.vue?vue&type=script&lang.d.ts.map
