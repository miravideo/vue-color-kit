declare const _default: import('vue').DefineComponent<
  {
    color: {
      type: StringConstructor
      default: string
    }
    colorsDefault: {
      type: ArrayConstructor
    }
    colorsHistoryKey: {
      type: StringConstructor
      default: string
    }
  },
  {
    setColorsHistory: (color: string) => void
    colorsHistory: import('vue').Ref<any[]>
    color: import('vue').Ref<any>
    imgAlphaBase64: import('vue').Ref<any>
    selectColor: (color: any) => void
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  'selectColor'[],
  'selectColor',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      color: string
      colorsHistoryKey: string
    } & {
      colorsDefault?: unknown[]
    }
  >,
  {
    color: string
    colorsHistoryKey: string
  }
>
export default _default
//# sourceMappingURL=Colors.vue?vue&type=script&lang.d.ts.map
