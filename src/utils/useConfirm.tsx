import BorderButton from "../components/BorderButton";
import DialogBase from "../components/DialogBase";
import Stack from "../components/Stack";
import useModal from "./useModal";

export function useConfirm() {
  const [mount, modals] = useModal();

  function confirm({
    title,
    onConfirm,
  }: {
    title: string;
    onConfirm: () => void;
  }) {
    mount((unmount) => (
      <DialogBase title={title} onClose={unmount}>
        <Stack>
          <BorderButton onTap={unmount}>Cancelar</BorderButton>
          <BorderButton
            primary
            onTap={() => {
              unmount();
              onConfirm();
            }}
          >
            Confirmar
          </BorderButton>
        </Stack>
      </DialogBase>
    ));
  }

  return [confirm, modals] as const;
}
