import { useRef, useState } from "react";
import Timer from "../utils/Timer";
import Button from "./Button";
import Icon from "./Icon";
import classes from "./DialogBase.module.scss";

export default function DialogBase({
  title,
  children,
  onClose,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [keepOpenTimer] = useState(() => {
    const timer = new Timer("timeout");
    timer.start(() => {}, 100);
    return timer;
  });

  function keepOpen() {
    keepOpenTimer.start(() => {}, 10);
  }

  function onOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === overlayRef.current && !keepOpenTimer.isRunning()) {
      onClose();
    }
  }

  return (
    <div className={classes.wrapper} ref={overlayRef} onClick={onOverlayClick}>
      <div
        className={classes.root}
        onMouseDown={keepOpen}
        onTouchStart={keepOpen}
      >
        <div className={classes.header}>
          {title}
          <Button onTap={onClose}>
            <Icon icon="close" />
          </Button>
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
}
