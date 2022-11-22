import { forwardRef } from "react";
import { AbstractComponent, PropsOf } from "./typings";

export { css, keyframes } from "goober";

export function cx(...classNames: (string | null | undefined | false)[]) {
  return classNames.filter(Boolean).join(" ");
}

type ComponentWithMergedClasses<C extends AbstractComponent> =
  React.ComponentType<PropsOf<C>> & {
    withComponent: <D extends AbstractComponent>(
      Component: D
    ) => ComponentWithMergedClasses<D>;
  };

/*
 * Do not user goober's styled because
 * it adds a bunch of kb and it has some
 * css declaration order issues
 */
export function styled<C extends AbstractComponent>(
  Component: C,
  ...classNames: string[]
) {
  //@ts-ignore
  const NewComponent: any = forwardRef(
    ({ className, ...props }: PropsOf<C>, ref: any) => (
      //@ts-ignore
      <Component
        {...props}
        ref={ref}
        className={cx(className, ...classNames)}
      />
    )
  );

  NewComponent.withComponent = function <C extends AbstractComponent>(
    Component: C
  ) {
    return styled(Component, ...classNames);
  };

  return NewComponent as ComponentWithMergedClasses<C>;
}
