import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  primaryAction: () => void;
  primaryText: string;
  secondaryText?: string;
}

const modalActionStyles = "!text-sm !px-3 !py-2";

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  primaryAction,
  primaryText,
  secondaryText,
}) => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <Transition as={Fragment} appear show={isOpen}>
          <Dialog as="div" className={"z-50 relative"} onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center min-h-full justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                  leave="ease-in duration-200"
                >
                  <Dialog.Panel className="w-full max-w-md overflow-hidden transform rounded-md bg-white p-6 shadow-md text-left align-middle transition-all">
                    <Dialog.Title
                      as="h3"
                      className={"text-lg font-medium leading-6 text-gray-900"}
                    >
                      {title}
                    </Dialog.Title>
                    <Dialog.Description
                      as="p"
                      className={"my-4 text-sm text-gray-500"}
                    >
                      {content}
                    </Dialog.Description>
                    <div className="flex w-full space-x-4 justify-end items-center">
                      <Button
                        type="button"
                        className={modalActionStyles}
                        onClick={onClose}
                        secondary
                      >
                        {secondaryText ?? "Cancel"}
                      </Button>
                      <Button
                        type="button"
                        className={modalActionStyles}
                        onClick={() => primaryAction()}
                      >
                        {primaryText}
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};
