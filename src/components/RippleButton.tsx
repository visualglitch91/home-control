import { forwardRef } from "react";
import Ripples from "react-ripples";

const spanStyle = {
  position: "absolute" as const,
};

const RippleButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    //@ts-expect-error
    <Ripples {...props} role="button">
      {props.children}
      <span
        style={spanStyle}
        ref={(spanRef) => {
          if (ref && "current" in ref) {
            //@ts-expect-error
            ref.current = spanRef?.parentElement;
          }
        }}
      />
    </Ripples>
  );
});

export default RippleButton;