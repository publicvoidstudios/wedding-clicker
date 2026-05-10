import { CLICK_FAN_RING_CLICKS } from '@/config/gameConfig';

export const achievements = [
  {
    id: 'shop_master',
    title: 'Праздник на полную катушку',
    description: 'Скупите все улучшения до последнего.',
  },
  {
    id: 'click_fan',
    title: 'Настоящий фанат кликеров',
    description: `Сделайте ${CLICK_FAN_RING_CLICKS} кликов / тапов на сайте.`,
  },
  {
    id: 'calendar_guest',
    title: 'Вооружен, значит предупрежден',
    description: 'Сохраните день свадьбы через «Добавить в календарь» в блоке с датой.',
  },
  {
    id: 'lang_detective',
    title: 'О вы из англии',
    description: 'Поковыряйте переключатель RU / EN в шапке — иногда язык это не только слова.',
  },
  {
    id: 'dj',
    title: 'Пошла жара',
    description: 'Купите в магазине апгрейд «Диджей» и пусть на празднике будет свой саунд.',
  },
  {
    id: 'cake',
    title: 'Я несу тортик!',
    description: 'Тортик, твою мать!',
  },
  {
    id: 'photographer',
    title: 'Что это у тебя?',
    description: 'Купите в магазине апгрейд «Фотограф».',
  },
  {
    id: 'fuss',
    title: 'Главный суетолог',
    description: 'Скрытая ачивка',
  },
  {
    id: 'achiever',
    title: 'Достигатор',
    description: 'Соберите все остальные ачивки. Вы же любите все проходить на 100%, да?',
  },
] as const;

export type AchievementId = (typeof achievements)[number]['id'];

export type AchievementEntry = (typeof achievements)[number];

const byId = new Map<string, AchievementEntry>(
  achievements.map((a) => [a.id, a]),
);

export function getAchievement(id: string): AchievementEntry | undefined {
  return byId.get(id);
}

export function isAchievementId(id: string): id is AchievementId {
  return byId.has(id);
}
