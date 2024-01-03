/** @format */
export type Todos = {
  id: string;
  value: string;
  completed: boolean;
};

export type FilterMap = {
  All: () => boolean;
  Active: (todo: Todos) => boolean;
  Completed: (todo: Todos) => boolean;
};

export const FILTER_MAP: FilterMap = {
  All: () => true,
  Active: (todo: Todos) => !todo.completed,
  Completed: (todo: Todos) => todo.completed,
};

export const FILTER_NAMES = Object.keys(FILTER_MAP);

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
