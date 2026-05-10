import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_MAX = 768

/**
 * Для выбора `position.mobile` vs `position.desktop` в апгрейдах.
 */
export function useIsMobile() {
  const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < MOBILE_MAX : false)

  function update() {
    isMobile.value = window.innerWidth < MOBILE_MAX
  }

  onMounted(() => {
    window.addEventListener('resize', update)
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile, breakpoint: MOBILE_MAX }
}
