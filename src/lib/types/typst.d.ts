declare module "@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js" {
  interface TypstCompiler {
    svg(options: { mainFileContent: string }): Promise<string>
    render(options: { mainFileContent: string }): Promise<any>
  }

  interface TypstModule {
    setCompilerInitOptions(options: {
      getModule: () => string
    }): void
    setRendererInitOptions(options: {
      getModule: () => string
    }): void
    svg(options: { mainFileContent: string }): Promise<string>
    render(options: { mainFileContent: string }): Promise<any>
  }

  const typst: TypstModule
  export default typst
}

declare global {
  interface Window {
    $typst: any
  }
}
