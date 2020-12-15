import Swal from 'sweetalert2';
import EXIF from 'exif-js';
import { Locale } from './Languages';
import { getLocalization } from './Utilities';

const SwalOption = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger btn-block ml-auto',
        cancelButton: 'btn btn-primary btn-block mr-auto'
    },
    buttonsStyling: false
});

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const PopupError = (message) => {
    return Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        showClass: {
            popup: 'fadeIn'
        },
        hideClass: {
            popup: 'fadeOut'
        },
        showConfirmButton: false,
        allowEscapeKey: true,
        timerProgressBar: true,
        heightAuto: false,
        timer: 6000,
    });
}

export const PopupSuccess = (message) => {
    return Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
        showClass: {
            popup: 'fadeIn'
        },
        hideClass: {
            popup: 'fadeOut'
        },
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        heightAuto: false,
        timer: 3000,
    });
};

export const PopupInfo = (message) => {
    return Swal.fire({
        text: message,
        showConfirmButton: false,
        scrollbarPadding: false,
        heightAuto: false,
        allowEscapeKey: true,
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
        reverseButtons: true,
        heightAuto: false
    });
}

export const PopupToast = (message, icon) => {
    return Toast.fire({
        icon: icon,
        title: message
    })
}

export const PopupImage = (filename, unique, imageUrl) => {
    const img = document.getElementById(unique);
    EXIF.getData(img, function() {
        const ex = EXIF.getAllTags(this);
        let html = "<div class='text-center'><strong class='text-center'>"+ filename +"</strong></div><hr>";
        html = "<div class='exif-detail'>";
        let hasExif = Object.keys(ex).length !== 0 && ex.constructor === Object;
        if (hasExif) {
            if (ex.PixelXDimension) {
                html += "Dimension: <strong>" + ex.PixelXDimension + "x" + ex.PixelYDimension + "</strong></br>";
            }
            if (ex.thumbnail) {
                if (ex.thumbnail.blob) {
                    html += "Size: <strong>" + (ex.thumbnail.blob.size / 1000) + "</strong></br>";
                }
            }
            if (ex.DateTime) {
                html += "Date Created: <strong>" + ex.DateTime + "</strong></br>";
            }
            if (ex.Software) {
                html += "Software: <strong>" + ex.Software + "</strong>";
            }
        } else {
            html += "<center>No Metadata found</center>";
        }
        html += "</div>";
        return Swal.fire({
            html: html,
            imageUrl: imageUrl,
            imageAlt: unique,
            showConfirmButton: false,
            heightAuto: false
        })
      });
}

export const PopupCustomConfirmation = (active) => {
    const messages = [Locale.customPopupOne, Locale.customPopupTwo];
    let inputs = messages.map((m,i) =>{
        let label = getLocalization(active, m, 'span', 'trans-lang-opt');
        return `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="custom-confirm-${i}">
                <label class="form-check-label" for="custom-confirm-${i}">${label}</label>
            </div>
        `;
    });
    inputs = inputs.join('</br>');
    return Swal.fire({
        html: inputs,
        title: 'Warning',
        icon: 'warning',
        focusConfirm: false,
        heightAuto: false,
        showCancelButton: true,
        showClass: {
            popup: 'fadeIn'
        },
        hideClass: {
            popup: 'fadeOut'
        },
        confirmButtonText: 'Agree and Continue',
        allowOutsideClick: false,
        preConfirm: () => {
            let results = messages.map((m, i) => {
                return document.getElementById("custom-confirm-" + i).checked;
            });
            results = results.filter(x => x);
            return results.length === messages.length;
        }
    });
}
