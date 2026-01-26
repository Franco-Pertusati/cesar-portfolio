export interface Toast {
  title: string
  message? : string
  icon? : string
  variant?: 'default' | 'succes' | 'error' | 'warning'
}
