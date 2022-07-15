declare const _default: import('vue').DefineComponent<
  {
    color: {
      type: StringConstructor
      default: string
    }
    rgba: {
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
    slideAlphaStyle: {}
    alphaSize: number
  },
  {},
  {
    renderColor(): void
    renderSlide(): void
    selectAlpha(e: any): void
  },
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  'selectAlpha'[],
  'selectAlpha',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      color: string
      rgba: Record<string, any>
      width: number
      height: number
    } & {}
  >,
  {
    color: string
    rgba: Record<string, any>
    width: number
    height: number
  }
>
export default _default
//# sourceMappingURL=Alpha.vue?vue&type=script&lang.d.ts.map
