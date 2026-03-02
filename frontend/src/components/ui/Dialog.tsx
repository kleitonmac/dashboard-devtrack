import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from './Button';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const Dialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  isLoading = false,
}: DialogProps) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fade-in" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-lg shadow-xl data-[state=open]:animate-slide-in max-w-md w-full max-h-[90vh] overflow-y-auto">
          {title && (
            <AlertDialog.Title className="text-lg font-semibold text-dark-900">
              {title}
            </AlertDialog.Title>
          )}
          {description && (
            <AlertDialog.Description className="mt-2 text-sm text-dark-600">
              {description}
            </AlertDialog.Description>
          )}
          {children && <div className="mt-md">{children}</div>}

          <div className="flex gap-md justify-end mt-lg">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="md">
                {cancelText}
              </Button>
            </AlertDialog.Cancel>
            {onConfirm && (
              <AlertDialog.Action asChild>
                <Button
                  variant={isDestructive ? 'danger' : 'primary'}
                  size="md"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmText}
                </Button>
              </AlertDialog.Action>
            )}
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

Dialog.displayName = 'Dialog';
