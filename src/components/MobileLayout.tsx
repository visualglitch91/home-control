import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "preact-transitioning";
import { clamp, loadValue, saveValue } from "../utils/general";
import managedScroll, { ManagedScroll } from "../utils/managedScroll";
import { cx } from "../utils/styling";
import Stack from "./Stack";
import TouchButton from "./TouchButton";
import Icon from "./Icon";
import classes from "./MobileLayout.module.scss";

function Tab({
  active,
  title,
  icon,
  onTap,
}: {
  active: boolean;
  title: string;
  icon: string;
  onTap: () => void;
}) {
  return (
    <TouchButton
      type="button"
      className={cx(classes.tab, active && classes.tabActive)}
      onTap={onTap}
    >
      <Icon icon={icon} />
      {title}
    </TouchButton>
  );
}

export default function MobileLayout({
  tabs,
}: {
  tabs: {
    title: string;
    icon: string;
    content: React.ReactNode;
  }[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const managedScrollRef = useRef<ManagedScroll>();

  const [active, setActive] = useState(() => {
    const lastActive = loadValue("last_active_tab");

    if (typeof lastActive !== "number" || isNaN(lastActive)) {
      return 0;
    }

    return clamp(lastActive, 0, tabs.length - 1);
  });

  const content = tabs[active].content;

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const scroll = managedScroll(wrapper);

    managedScrollRef.current = scroll;

    scroll.enable();

    return () => scroll.disable();
  }, []);

  useEffect(() => {
    managedScrollRef.current?.update();
    managedScrollRef.current?.scrollTo(0);
    saveValue("last_active_tab", active);
  }, [active]);

  return (
    <div className={classes.root} ref={wrapperRef}>
      <div className={classes.content}>
        <TransitionGroup duration={250}>
          <CSSTransition
            key={active}
            classNames="mobile-layout__fade"
            onExited={() => managedScrollRef.current?.scrollTo(0)}
            onEntered={() => managedScrollRef.current?.update()}
          >
            <Stack className="mobile-layout__fade">{content}</Stack>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <div className={classes.statusbar} />
      <div className={classes.tabs}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={active === index}
            icon={tab.icon}
            title={tab.title}
            onTap={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}
