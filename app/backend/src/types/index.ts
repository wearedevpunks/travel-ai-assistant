export type FirstArgument<T extends (...args: any) => any> = Parameters<T>[0]
