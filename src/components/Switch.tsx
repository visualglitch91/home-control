import { css, styled } from "../utils/styling";

const Wrapper = styled(
  "label",
  css`
    display: inline-block;
    -webkit-tap-highlight-color: transparent;

    & i {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 26px;
      vertical-align: text-bottom;
      transition: all 0.3s linear;
    }

    & i::before {
      content: "";
      position: absolute;
      left: 0;
      width: 42px;
      height: 14px;
      background-color: #20293c;
      border-radius: 11px;
      transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
      transition: all 0.25s linear;
      top: 4.5px;
    }

    & i::after {
      content: "";
      position: absolute;
      left: 0;
      width: 22px;
      height: 22px;
      background-color: #70889e;
      border-radius: 11px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
      transform: translate3d(2px, 2px, 0);
      transition: all 0.2s ease-in-out;
    }

    &:active i::after {
      width: 28px;
      transform: translate3d(2px, 2px, 0);
    }

    &:active input:checked + i::after {
      transform: translate3d(16px, 2px, 0);
    }

    & input {
      display: none;
    }

    & input:checked + i::after {
      background-color: #dc456c;
    }

    & input:checked + i::after {
      transform: translate3d(22px, 2px, 0);
    }

    &:hover input:not(:disabled) + i::after {
      background-color: #7ca6cc;
    }

    &:hover input:not(:disabled):checked + i::after {
      background-color: #f36e90;
    }

    & input:not(:disabled) + i::before,
    & input:not(:disabled) + i::after {
      cursor: pointer;
    }

    & input:disabled + i::before {
      background-color: #60687a;
      opacity: 0.6;
    }

    & input:disabled + i::after {
      background-color: #414a52;
    }
  `
);

export default function Switch({
  checked,
  disabled,
  onInput,
}: {
  checked: boolean;
  disabled?: boolean;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <Wrapper>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => {
          /*
           * Preact has some bug that changes
           * the checkbox state despite the
           * checked prop
           */
          e.currentTarget.checked = checked;
          onInput(e);
        }}
      />
      <i />
    </Wrapper>
  );
}
