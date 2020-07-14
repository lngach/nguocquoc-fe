

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
        url: `http://localhost:3000/api/products/${id}`,
        dataType: "json"
    }).done(res => {
        let product = res.product
        if (product) {
            $('#id').val(product.id)
            $('#name').val(product.name)
            $('#price').val(product.price)
            $('#warranty').val(product.warranty)
            $('#content').froalaEditor('html.set', product.content)
            $('#previewImage').prop('src', `http://localhost:3000${product.image.replace('public', '')}`)
            product.status == true ? $('#status-yes').prop('checked', true) : $('#status-no').prop('checked', true)
            product.isActive == true ? $('#is-active-yes').prop('checked', true) : $('#is-active-no').prop('checked', true)
            $('#provider_id').val(product.providerID)
            $('#category_id').val(product.categoryID)
            $('#product_type_id').val(product.productTypeID)
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

loadCategory = () => {
    $.ajax({
        url: 'http://localhost:3000/api/categories',
        dataType: "json"
    }).done(res => {
        let categories = res.categories
        let categoriesOptions = ''
        categories.forEach(item => {
            categoriesOptions += `<option value="${item.id}" > ${item.name} </option>`
        })
        $('#category_id').html(categoriesOptions)
    })
}



loadProductType = () => {
    $.ajax({
        url: `http://localhost:3000/api/product-types`,
        dataType: "json"
    }).done(res => {
        let product_types = res.product_types
        let productTypeOptions = ''
        product_types.forEach(item => {
            productTypeOptions += `<option value="${item.id}" > ${item.name} </option>`
        })
        $('#product_type_id').html(productTypeOptions)
    })
}

loadProvider = () => {
    $.ajax({
        url: 'http://localhost:3000/api/providers',
        dataType: "json"
    }).done(res => {
        let providers = res.providers
        let providerOptions = ''
        providers.forEach(item => {
            providerOptions += `<option value="${item.id}" > ${item.name} </option>`
        })                    
        $('#provider_id').html(providerOptions)

    })
}

save = (data) => {
    let id = data.get('id')
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? 'http://localhost:3000/api/products' : `http://localhost:3000/api/products/${id}`
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
            window.location.href = `${HOST}/admin/products/${res.product.id}/edit?message=${res.message}`
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
