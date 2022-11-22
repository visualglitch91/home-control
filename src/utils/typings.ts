export type AbstractComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type PropsOf<C extends AbstractComponent> = JSX.LibraryManagedAttributes<
  C,
  React.ComponentProps<C>
>;
