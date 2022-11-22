import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cx } from "../utils/styling";
import { useDebouncedCallback } from "../utils/general";
import classes from "./MasonryLayout.module.scss";

const gutter = 16;
const smallerColumnWidth = 300;
const largerColumnWidth = 400;

function MasonryLayoutItem({
  children,
  onSizeChange,
}: {
  children: React.ReactNode;
  onSizeChange: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const onSizeChangeRef = useRef<() => void>(onSizeChange);

  useEffect(() => {
    onSizeChangeRef.current = onSizeChange;
  }, [onSizeChange]);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      onSizeChangeRef.current();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.observe(node);
    };
  }, []);

  return (
    <div className={classes.item} ref={nodeRef}>
      {children}
    </div>
  );
}

export default function MasonryLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...Children.toArray(children)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;
    const columnWidth =
      window.innerWidth < 700 ? smallerColumnWidth : largerColumnWidth;

    const columnCount = Math.max(
      1,
      Math.floor(availableWidth / (columnWidth + gutter))
    );

    return columnCount;
  }, []);

  const recalculateMacy = useCallback(() => {
    if (macyRef.current) {
      macyRef.current.options.columns = getColumnCount();
      macyRef.current.recalculate(true);
    }
  }, [getColumnCount]);

  const onResize = useDebouncedCallback(recalculateMacy);

  useEffect(() => {
    let readyTimeout: number;
    //@ts-expect-error no typings for macy
    import("macy").then(({ default: Macy }) => {
      macyRef.current = Macy({
        container: nodeRef.current!,
        columns: getColumnCount(),
      });

      readyTimeout = window.setTimeout(setReady, 100, true);

      window.addEventListener("resize", onResize);
    });

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResize);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div
      className={cx(className, classes.root)}
      style={{ opacity: ready ? 1 : 0 }}
    >
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <MasonryLayoutItem key={index} onSizeChange={recalculateMacy}>
            {item}
          </MasonryLayoutItem>
        ))}
      </div>
    </div>
  );
}
