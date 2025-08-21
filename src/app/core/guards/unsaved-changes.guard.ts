// unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';
import Swal from 'sweetalert2';

export interface CanComponentDeactivate {
  canExit: () => boolean;
}

export const UnsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = async (component) => {
  // If component says it's safe, allow navigation
  if (component.canExit()) return true;

  const result = await Swal.fire({
    title: 'Unsaved changes',
    text: 'You have unsaved changes. Do you really want to leave?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    // Colors you asked: confirm red, cancel info-blue
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#17a2b8',
    reverseButtons: true,
    focusCancel: true,
    // optional sizing
    width: 420
  });

  return !!result.isConfirmed; // true if Confirm clicked
};
