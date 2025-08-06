/**
 * Tron Component TypeScript Definitions
 */

export interface Reactive<T> {
  value: T;
  update(): this;
  valueOf(): T;
  toString(): string;
}

export interface ReactiveArray<T> extends Reactive<T[]> {
  render(template: string | ((item: T, index: number) => string)): string;
  push(...items: T[]): number;
  pop(): T | undefined;
  shift(): T | undefined;
  unshift(...items: T[]): number;
  splice(start: number, deleteCount?: number, ...items: T[]): T[];
  sort(compareFn?: (a: T, b: T) => number): this;
  reverse(): this;
}

export interface Computed<T> {
  readonly value: T;
}

export interface PropConfig {
  name: string;
  type?: StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor;
  default?: any;
  required?: boolean;
  validator?: (value: any) => boolean;
}

export interface ComponentContext {
  react<T>(value: T): T extends any[] ? ReactiveArray<T[0]> : Reactive<T>;
  element: HTMLElement;
  event(handler: Function, methodName?: string): Function & { toString(): string };
  props(propList: Array<string | PropConfig>): Record<string, any>;
  computed<T>(fn: () => T): Computed<T>;
  render(template: string | (() => string)): void;
  onMounted(callback: () => void): void;
  onUpdated(callback: () => void): void;
  onBeforeUpdate(callback: () => void): void;
  onUnmounted(callback: () => void): void;
}

export declare function component(
  tagName: string,
  definition: (context: ComponentContext) => void
): typeof HTMLElement;

export default { component };