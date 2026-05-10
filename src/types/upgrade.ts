import type { Component } from 'vue'

/** CSS positioning: decor on full-page layer (see PurchasedLayer, Teleport to body) */
export type PositionStyle = Record<string, string>

export interface Upgrade {
  id: string
  name: string
  cost: number
  cps: number
  img: () => Promise<{ default: Component }>
  /**
   * Якорь: тот же id, что `shop-anchor` у `CurvyBlock`.
   * Если не задано — предмет рисуется глобальным слоем (`PurchasedLayer`).
   */
  curvyAnchor?: string
  /** Позиция внутри якоря или документа: `top` / `left` / `right` / `width` и т.д. */
  position: {
    desktop: PositionStyle
    mobile: PositionStyle
  }
}
