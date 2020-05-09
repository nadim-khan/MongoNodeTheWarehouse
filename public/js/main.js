(function() {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDelete').on('click', function() {
        if (!confirm('Confirm Deletion !')) {
            return false;
        }
    });
}());