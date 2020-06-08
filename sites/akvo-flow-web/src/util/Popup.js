import Swal from 'sweetalert2';

const SwalOption = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary'
    },
    buttonsStyling: false
});

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const PopupError = (message) => {
    return Swal.fire({
        title:"Error",
        text:message,
        icon:"error",
        showClass: {popup: 'fadeIn'},
        hideClass: {popup: 'fadeOut'},
        showConfirmButton:false,
        allowEscapeKey:true,
        timerProgressBar: true,
        timer: 6000,
    });
}

export const PopupSuccess = (message) => {
    return Swal.fire({
        title:"Success",
        text:message,
        icon:"success",
        showClass: {popup: 'fadeIn'},
        hideClass: {popup: 'fadeOut'},
        showConfirmButton:false,
        allowOutsideClick: false,
        allowEscapeKey:false,
        timerProgressBar: true,
        timer: 3000,
    });
};

export const PopupInfo = (message) => {
    return Swal.fire({
        text:message,
        showConfirmButton:false,
        scrollbarPadding:false,
        allowEscapeKey:true,
    });
}

export const PopupAsk = (message, options) => {
    return SwalOption.fire({
        title: 'Warning',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: options.confirm.opt,
        cancelButtonText: options.cancel.opt,
        reverseButtons: true
    });
}

export const PopupToast = (message, icon) => {
    return Toast.fire({
      icon: icon,
      title: message
    })
}

