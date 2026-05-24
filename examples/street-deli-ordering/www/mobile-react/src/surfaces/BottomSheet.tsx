/**
 * BottomSheet -- reusable bottom sheet primitive.
 *
 * @see www/mobile/styles.css → .bottom-sheet, .overlay
 */

import type { ReactNode } from 'react';
import styles from './BottomSheet.module.css';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  if (!open) return null;
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.bottomSheet}>
        <div className={styles.sheetHandle} />
        {children}
      </div>
    </>
  );
}
