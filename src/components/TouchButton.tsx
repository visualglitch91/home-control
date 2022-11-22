import { useEffect, useRef, useState } from "react";
import useLatestRef from "../utils/useLatestRef";
import { isTouchDevice } from "../utils/general";
import { cx } from "../utils/styling";
import Timer from "../utils/Timer";
import ListenerGroup from "../utils/ListenerGroup";
import RippleButton from "./RippleButton";

type Point = [number, number];

export interface TouchButtonProps {
  className?: string;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: React.ButtonHTMLAttributes<HTMLButtonElement>["children"];
  style?: React.ButtonHTMLAttributes<HTMLButtonElement>["style"];
  onMouseDown?: React.ButtonHTMLAttributes<HTMLButtonElement>["onMouseDown"];
  onTap?: () => void;
  onPress?: () => void;
  onHold?: () => void;
  onDoubleTap?: () => void;
}

function getPointFromEvent(e: any): Point {
  return "touches" in e && e.touches.length > 0
    ? [e.touches[0].pageX, e.touches[0].pageY]
    : "changedTouches" in e && e.changedTouches.length > 0
    ? [e.changedTouches[0].pageX, e.changedTouches[0].pageY]
    : [e.pageX, e.pageY];
}

export default function TouchButton({
  children,
  className,
  onTap,
  onPress,
  onHold,
  onDoubleTap,
  ...props
}: TouchButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const tapOnly = !onPress && !onHold && onDoubleTap;

  const handlerRefs = useLatestRef({
    onTap,
    onPress,
    onHold,
    onDoubleTap,
  });

  useEffect(() => {
    const button = buttonRef.current;
    const listenerGroup = new ListenerGroup();
    let doubleTapTimeout = new Timer("timeout");
    let pressTimeout = new Timer("timeout");
    let holdInterval = new Timer("interval");

    if (!button) {
      return;
    }

    if (!isTouchDevice) {
      listenerGroup.subscribe(button, "mouseenter", () => {
        setHover(true);
      });

      listenerGroup.subscribe(button, "mouseleave", () => {
        setHover(false);
      });
    }

    if (tapOnly) {
      listenerGroup.subscribe(button, "click", () => {
        handlerRefs.current.onTap?.();
      });

      return;
    } else {
      let initialPosition: Point = [0, 0];
      let touchStartAt = 0;
      let aborted = false;

      const onTap = () => {
        const { onTap, onDoubleTap } = handlerRefs.current;

        if (!onDoubleTap) {
          onTap?.();
          return;
        }

        if (doubleTapTimeout.isRunning()) {
          doubleTapTimeout.stop();
          onDoubleTap?.();
          return;
        }

        doubleTapTimeout.start(() => {
          onTap?.();
        }, 150);
      };

      const onTouchStart = (e: any) => {
        touchStartAt = Date.now();
        aborted = false;

        initialPosition = getPointFromEvent(e);

        pressTimeout.start(onPressStart, 400);
      };

      const onTouchEnd = (e: any) => {
        if (aborted) {
          return;
        }

        pressTimeout.stop();
        holdInterval.stop();

        const timeDelta = Date.now() - touchStartAt;

        if (timeDelta < 100) {
          onTap();
        }
      };

      const onPressStart = () => {
        if (aborted) {
          return;
        }

        handlerRefs.current.onPress?.();

        holdInterval.start(() => {
          handlerRefs.current.onHold?.();
        }, 500);
      };

      const abort = () => {
        aborted = true;
        doubleTapTimeout.stop();
        pressTimeout.stop();
        holdInterval.stop();
      };

      const onTouchMove = (e: any) => {
        const currentPosition = getPointFromEvent(e);
        const deltaX = Math.abs(currentPosition[0] - initialPosition[0]);
        const deltaY = Math.abs(currentPosition[1] - initialPosition[1]);

        if (deltaX > 20 || deltaY > 20) {
          abort();
        }
      };

      listenerGroup.subscribe(
        button,
        isTouchDevice ? "touchstart" : "mousedown",
        onTouchStart
      );

      listenerGroup.subscribe(
        button,
        isTouchDevice ? "touchmove" : "mousemove",
        onTouchMove
      );

      listenerGroup.subscribe(
        button,
        isTouchDevice ? "touchend" : "mouseup",
        onTouchEnd
      );

      //@ts-expect-error
      listenerGroup.subscribe(window, "bscroll:scrollStart", abort);
      listenerGroup.subscribe(document.body, "mouseleave", abort);
    }

    return () => {
      doubleTapTimeout.stop();
      pressTimeout.stop();
      holdInterval.stop();
      listenerGroup.unsubscribeAll();
    };
  }, [tapOnly, handlerRefs]);

  return (
    <RippleButton
      {...props}
      className={cx(className, hover && "hover", props.disabled && "disabled")}
      ref={buttonRef}
    >
      {children}
    </RippleButton>
  );
}
