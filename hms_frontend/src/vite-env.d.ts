/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  
  // 為路徑別名添加類型聲明
  declare module '@/*' {
    const value: any
    export default value
  }