save = (data) => {
    let id = data.get('id')
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? 'http://localhost:3000/api/sliders' : `http://localhost:3000/api/sliders/${id}`
    $.ajax({
        method: method,
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false
    }).done(res => {
        if (res.success == true) {
            $('#formTemplate').trigger('reset')
            window.location.href = `${HOST}/sliders/${res.slider.id}/edit?message=${res.message}`
        } else {
            $('.card-text').html(
                `<div class="alert alert-icon-right alert-danger alert-dismissible mb-2" role="alert">` +
                    `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
                    `<span aria-hidden="true">×</span>` +
                    `</button>` +
                    `<strong>${res.message}</strong>` +
                `</div>`
            )
        }
    }).fail(() => {
        $('.card-text').html(
            `<div class="alert alert-icon-right alert-danger alert-dismissible mb-2" role="alert">` +
                `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
                `<span aria-hidden="true">×</span>` +
                `</button>` +
                `<strong>Đã Xảy Ra Lỗi. Vui Lòng Thử Lại Sau!</strong>` +
            `</div>`
        )
    })
}

loadEditForm = (id, message) => {
    if (message.length > 0) {
        $('.card-text').html(
            `<div class="alert alert-icon-right alert-success alert-dismissible mb-2" role="alert">` +
                `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
                `<span aria-hidden="true">×</span>` +
                `</button>` +
                `<strong>${message}</strong>` +
            `</div>`
        )
    }

    $.ajax({
        url: `http://localhost:3000/api/sliders/${id}`,
        dataType: "json"
    }).done(res => {
        let slider = res.slider
        if (slider) {
            $('#id').val(slider.id)
            $('#previewImage').prop('src', `http://localhost:3000${slider.url.replace('public', '')}`)
            product.status == true ? $('#status-yes').prop('checked', true) : $('#status-no').prop('checked', true)
            product.isActive == true ? $('#is-active-yes').prop('checked', true) : $('#is-active-no').prop('checked', true)
        } else {
            $('.card-text').html(
                `<div class="alert alert-icon-right alert-danger alert-dismissible mb-2" role="alert">` +
                    `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
                    `<span aria-hidden="true">×</span>` +
                    `</button>` +
                    `<strong>${res.message}</strong>` +
                `</div>`
            )
        }
    }).fail(() => {
        $('.card-text').html(
            `<div class="alert alert-icon-right alert-danger alert-dismissible mb-2" role="alert">` +
                `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
                `<span aria-hidden="true">×</span>` +
                `</button>` +
                `<strong>Đã Xảy Ra Lỗi. Vui Lòng Thử Lại Sau!</strong>` +
            `</div>`
        )
    })
}
