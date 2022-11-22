import { css, cx, styled } from "../../utils/styling";
import TouchButton from "../TouchButton";
import Icon from "../Icon";

export const Wrapper = styled(
  TouchButton,
  css`
    height: 100%;
    margin: 0;
    padding: 0 8px 0 8px;
    border: none;
    border-top: 2px solid transparent;
    outline: none;
    background: transparent;
    font-size: 9px;
    color: inherit;
    display: flex;
    flex-direction: column;
    row-gap: 3px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 100ms linear;
    text-transform: uppercase;
    flex: 1;
    transition: all 80ms cubic-bezier(0.76, 0, 0.24, 1);

    & > i {
      font-size: 20px;
    }

    &.hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.active {
      font-weight: bolder;
      border-color: #dc456c;
    }
  `
);

export default function Tab({
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
    <Wrapper type="button" className={cx(active && "active")} onTap={onTap}>
      <Icon icon={icon} />
      {title}
    </Wrapper>
  );
}
