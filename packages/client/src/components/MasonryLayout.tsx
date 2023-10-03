import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "../utils/general";
import { styled } from "@mui/joy";

const gutter = 32;
const smallerColumnWidth = 320;
const largerColumnWidth = 340;

const Wrapper = styled("div")({
  padding: "8px",
  transition: "opacity 70ms linear",
});

export default function MasonryLayout({
  className,
  items: _items,
}: {
  className?: string;
  items: (React.ReactNode | false | undefined | null)[];
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...Children.toArray(_items)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;
    const columnWidth =
      availableWidth < 1000 ? smallerColumnWidth : largerColumnWidth;

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
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    let readyTimeout: number;
    //@ts-expect-error no typings for macy
    import("macy").then(({ default: Macy }) => {
      macyRef.current = Macy({
        margin: { x: gutter, y: gutter },
        container: node,
        columns: getColumnCount(),
      });

      readyTimeout = window.setTimeout(setReady, 50, true);

      window.addEventListener("resize", onResize);
    });

    const resizeObserver = new ResizeObserver(onResize);
    const mutationObserver = new MutationObserver(onResize);

    resizeObserver.observe(node);
    mutationObserver.observe(node, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
    //eslint-disable-next-line
  }, []);

  return (
    <Wrapper style={{ opacity: ready ? 1 : 0 }} className={className}>
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
        ))}
      </div>
    </Wrapper>
  );
}