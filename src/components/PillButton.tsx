import { styled, css } from "../utils/styling";
import Icon from "./Icon";

const Wrapper = styled(
  "button",
  css`
    height: 100%;
    margin: 0;
    padding: 6px 8px;
    border: none;
    outline: none;
    font-size: 11px;
    color: #f64270;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 60ms linear;
    border-radius: 5px;
    font-weight: bolder;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.1);
    column-gap: 6px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  `
);

export default function PillButton({
  className,
  icon,
  label,
  onClick,
}: {
  className?: string;
  icon?: string;
  label?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Wrapper type="button" className={className} onClick={onClick}>
      {icon && <Icon size={14} icon={icon} />}
      {label}
    </Wrapper>
  );
}
