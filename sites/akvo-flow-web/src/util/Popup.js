import Swal from 'sweetalert2';

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
