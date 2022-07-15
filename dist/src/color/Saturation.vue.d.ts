declare const _default: import('vue').DefineComponent<
  {
    color: {
      type: StringConstructor
      default: string
    }
    hsv: {
      type: ObjectConstructor
      default: any
    }
    size: {
      type: NumberConstructor
      default: number
    }
  },
  unknown,
  {
    slideSaturationStyle: {}
  },
  {},
  {
    renderColor(): void
    renderSlide(): void
    selectSaturation(e: any): void
  },
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  'selectSaturation'[],
  'selectSaturation',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      color: string
      hsv: Record<string, any>
      size: number
    } & {}
  >,
  {
    color: string
    hsv: Record<string, any>
    size: number
  }
>
export default _default
//# sourceMappingURL=Saturation.vue?vue&type=script&lang.d.ts.map
