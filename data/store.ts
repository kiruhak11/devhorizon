// data/store.ts
export interface StoreItem {
  id: number;
  title: string;
  description: string;
  price: number;
  effect: number;
  type: "subscription" | "itemlives" | "itemMana" | "item";
}

export const storeItems: StoreItem[] = [
  {
    id: 1,
    title: "Подписка премиум на месяц",
    description: "Доступ к премиум контенту на месяц.",
    price: 200,
    effect: 2,
    type: "subscription",
  },
  {
    id: 2,
    title: "Подписка Эксперт на месяц",
    description: "Доступ к Эксперт контенту на месяц.",
    price: 400,
    effect: 3,
    type: "subscription",
  },
  {
    id: 3,
    title: "Подписка Эксперт+ на месяц",
    description: "Доступ к Эксперт+ контенту на месяц.",
    price: 1000,
    effect: 4,
    type: "subscription",
  },
  {
    id: 4,
    title: "Зелье жизни",
    description: "Восстанавливает 5 жизней.",
    price: 50,
    effect: 5,
    type: "itemlives",
  },
  {
    id: 5,
    title: "Зелье маны",
    description: "Восстанавливает 5 маны.",
    price: 30,
    effect: 5,
    type: "itemMana",
  },
  {
    id: 6,
    title: "Могучее зелье",
    description: "Восстанавливает 50 маны и 50 жизней",
    price: 50,
    effect: 5,
    type: "item",
  },
];
