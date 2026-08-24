export type HypotechHousehold = 'single' | 'joint'

export interface HypotechWidgetOptions {
  project: string
  partner: string
  unit?: number
  unitId?: number
  parking?: string
  household?: HypotechHousehold
  baseUrl?: string
  title?: string
  loading?: 'lazy' | 'eager'
  minimumHeight?: number
}

export interface HypotechWidgetConfiguration {
  unit?: number
  unitId?: number
  parking?: string
  household?: HypotechHousehold
}

export interface HypotechWidgetInstance {
  readonly element: HTMLIFrameElement
  configure(configuration: HypotechWidgetConfiguration): void
  destroy(): void
}

export interface HypotechWidgetApi {
  readonly version: string
  mount(target: string | Element, options: HypotechWidgetOptions): HypotechWidgetInstance
}

export interface HypotechWidgetMessageBase {
  source: 'hypotech-widget'
  version: string
  project: string
  partner: string
}

export interface HypotechWidgetReadyMessage extends HypotechWidgetMessageBase {
  type: 'ready'
  unitId: number
}

export interface HypotechWidgetResizeMessage extends HypotechWidgetMessageBase {
  type: 'resize'
  height: number
}

export interface HypotechWidgetUnitChangeMessage extends HypotechWidgetMessageBase {
  type: 'unit-change'
  unitId: number
}

export type HypotechWidgetMessage =
  | HypotechWidgetReadyMessage
  | HypotechWidgetResizeMessage
  | HypotechWidgetUnitChangeMessage

declare global {
  interface Window {
    HypotechWidget: HypotechWidgetApi
  }
}
