import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { FaTimes } from "react-icons/fa";
import "./Modal.css";

export default function Modal({
  open,
  locked = false,
  onClose,
  children,
}: {
  open: boolean;
  locked?: boolean;
  onClose: Function;
  children: ReactElement;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  // work out which classes should be applied to the dialog element
  const dialogClasses = useMemo(() => {
    const _arr = ["modal"];
    if (!open) _arr.push("modal--closing");

    return _arr.join(" ");
  }, [open]);

  // Assuming onClose is the function to handle closing the dialog
  const onCloseDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  // Eventlistener: trigger onclose when cancel detected
  const onCancel = useCallback(
    (e: FormEvent<HTMLDialogElement>) => {
      e.preventDefault();
      if (!locked) onClose();
    },
    [locked, onClose],
  );

  // Eventlistener: trigger onclose when click outside
  const onClick = useCallback(
    ({ target }: { target: EventTarget }) => {
      const { current: el } = modalRef;
      if (target === el && !locked) onClose();
    },
    [locked, onClose],
  );

  // Eventlistener: trigger close click on anim end
  const onAnimEnd = useCallback(() => {
    const { current: el } = modalRef;
    if (!open) el?.close();
  }, [open]);

  // when open changes run open/close command
  useEffect(() => {
    const { current: el } = modalRef;
    if (open) el?.showModal();
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      className={dialogClasses}
      onClose={onCloseDialog}
      onCancel={onCancel}
      onClick={onClick}
      onAnimationEnd={onAnimEnd}
    >
      <button
        title="Close modal"
        type="button"
        className="absolute right-0 top-1 border-transparent bg-transparent text-white shadow-none"
        tabIndex={0}
        onClick={onCloseDialog}
      >
        <FaTimes size={20} />
      </button>
      <div className="modal__container">{children}</div>
    </dialog>
  );
}
