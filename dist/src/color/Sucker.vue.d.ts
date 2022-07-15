declare const _default: import('vue').DefineComponent<
  {
    suckerCanvas: {
      type: {
        new (): HTMLCanvasElement
        prototype: HTMLCanvasElement
      }
      default: any
    }
    suckerPosition: {
      type: ArrayConstructor
      default: any[]
    }
  },
  unknown,
  {
    isOpenSucker: boolean
    suckerPreview: any
    container: any
    width: number
    height: number
    previewSize: number
    color: {
      r: number
      g: number
      b: number
      a: number
    }
  },
  {},
  {
    openSucker(): void
    destorySucker(): void
    keydownHandler(e: any): void
    getColor(
      x: number,
      y: number
    ): {
      r: number
      g: number
      b: number
      a: number
    }
    select(e: any): void
  },
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  Record<string, any>,
  string,
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      suckerCanvas: HTMLCanvasElement
      suckerPosition: unknown[]
    } & {}
  >,
  {
    suckerCanvas: HTMLCanvasElement
    suckerPosition: unknown[]
  }
>
export default _default
//# sourceMappingURL=Sucker.vue?vue&type=script&lang.d.ts.map
