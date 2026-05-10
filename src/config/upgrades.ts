import type { Upgrade } from '@/types/upgrade'

/**
 * Конфигурация предметов магазина. `img` — компонент из `components/shop-items/`.
 *
 * **Привязка к блоку:** задайте `curvyAnchor` так же, как `shop-anchor` на нужном
 * `CurvyBlock` в `App.vue`. Тогда `position` — координаты внутри этого блока
 * (`position: absolute`, контейнер на весь блок).
 *
 * **Без `curvyAnchor`** — предмет показывается глобальным слоем на всём документе
 * (`PurchasedLayer`, высота страницы).
 */
export const upgrades: Upgrade[] = [
  {
    id: 'dj',
    name: 'Диджей',
    cost: 10,
    cps: 1,
    img: () => import('@/components/shop-items/DjDecor.vue'),
    curvyAnchor: 'venue',
    position: {
      desktop: { top: '35%', right: '30%', left: 'auto', width: '200px' },
      mobile: { top: '28%', right: '20%', left: 'auto', width: '120px' },
    },
  },
  {
    id: 'photo',
    name: 'Фотограф',
    cost: 50,
    cps: 2,
    img: () => import('@/components/shop-items/PhotoDecor.vue'),
    curvyAnchor: 'photo',
    position: {
      desktop: { top: '60%', right: '60%', left: 'auto', width: '200px' },
      mobile: { top: '50%', right: '65%', left: 'auto', width: '120px' },
    },
  },
  {
    id: 'cake',
    name: 'Торт',
    cost: 200,
    cps: 4,
    img: () => import('@/components/shop-items/CakeDecor.vue'),
    curvyAnchor: 'cake',
    position: {
      desktop: { bottom: '50%', right: '70%', top: 'auto', left: 'auto', width: '200px' },
      mobile: { bottom: '60%', right: '70%', top: 'auto', left: 'auto', width: '120px' },
    },
  },

  {
    id: 'flowers',
    name: 'Цветы',
    cost: 500,
    cps: 10,
    img: () => import('@/components/shop-items/FlowersDecor.vue'),
    curvyAnchor: 'dress',
    position: {
      desktop: { top: '25%', left: '60%', width: '200px' },
      mobile: { top: '25%', left: '60%', width: '120px' },
    },
  },
]
