$(document).ready(function() {
    $('#rsrtable').DataTable({
        ordering: false,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
    });
});
