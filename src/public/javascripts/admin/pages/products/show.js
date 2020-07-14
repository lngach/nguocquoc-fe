
loadForm = (id) => {
    $.ajax({
        url: `http://localhost:3000/api/products/${id}`,
        dataType: "json"
    }).done(res => {
        let product = res.product
        if (product) {
            $('#id').text(product.id)
            $('#name').text(product.name)
            $('#price').text(product.price)
            $('#warranty').text(product.warranty)
            $('#content').html(product.content)
            $('#views').text(product.views)
            $('#sales').text(product.sales)
            $('#created-at').text(product.createdAt)
            $('#updated-at').text(product.updatedAt)
            $('#previewImage').prop('src', `http://localhost:3000${product.image.replace('public', '')}`)
            product.state == true ?  $('#status').text('Còn Hàng') : $('#status').text('Hết Hàng')
            product.isActive == true ?  $('#is-active').text('Hiện') : $('#is-active').text('Ẩn')
            // $('#provider_id').val(product.providerID)
            // loadCategoryByProductType(product.productTypeID)
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