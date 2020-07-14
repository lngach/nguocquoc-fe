
fillForm = () => {
    $.ajax({
        url: "http://localhost:3000/api/product-types",
        dataType: "json"
    }).done(res => {
        let product_types = res.product_types
        $.ajax({
            url: "http://localhost:3000/api/providers",
            dataType: "json"
        }).done(res2 => {
            let providers = res2.providers
            $.ajax({
                url: "http://localhost:3000/api/categories",
                dataType: "json"
            }).done(res4 => {
                let categories = res4.categories
                $("#basicScenario").jsGrid({
                    width: "100%",
                    sorting: true,
                    paging: true,
                    autoload: true,
                    pageSize: 10,
                    selecting: true,
                    pageButtonCount: 5,
                    controller: {
                        loadData: () => {
                            var d = $.Deferred();
    
                            $.ajax({
                                url: "http://localhost:3000/api/products",
                                dataType: "json"
                            }).done(function(res3) {
                                d.resolve(res3.products);                            
                            });
    
                            return d.promise();
                        }
                    },
                    fields: [
                        { name: "id", type: "number", width: 50, title: "ID" },
                        { name: "name", type: "text", width: 200, title: "Name" },
                        { name: "slug", type: "text", width: 200, title: "Slug" },
                        {
                             name: "image", type: "text", width: 200, title: "Avatar", align: 'center',
                             itemTemplate: function(value, item) {
                                return `<img src="http://localhost:3000${value.replace("public", "")}" "width="100" height="100">`
                            }
                        },
                        { name: "price", type: "number", width: 150, title: "Price", align: 'center' },
                        { name: "views", type: "number", width: 50, title: "Views", align: 'center'  },
                        { name: "sales", type: "number", width: 50, title: "Sales", align: 'center'  },
                        { name: "warranty", type: "number", width: 100, title: "Warranty", align: 'center'  },
                        { 
                            name: "productTypeID", title: "Product Type", type: "select",
                            items: product_types, valueField: "id", textField: "name"
                            
                        },
                        { 
                            name: "providerID", title: "Provider", type: "select",
                            items: providers, valueField: "id", textField: "name"
                            
                        },
                        { 
                            name: "categoryID", title: "Category", type: "select",
                            items: categories, valueField: "id", textField: "name"
                            
                        },
                        { name: "createdAt", type: "datetime", title: "Created At"},
                        { name: "updatedAt",type: "datetime", title: "Updated At"},
                        { name: "isActive", type: "checkbox", title: "Is Active", sorting: false },
                        { type: "control", width: 100, editButton: false, deleteButton: false,
                            itemTemplate: function(value, item) {
                                var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
    
                                var $customViewButton = $("<button>").attr({class: "customGridViewbutton jsgrid-button jsgrid-search-button"})
                                .click(function(e) {
                                    window.location.href = `${HOST}/admin/products/${item.id}/show`
                                })
    
    
                                var $customEditButton = $("<button>").attr({class: "customGridEditbutton jsgrid-button jsgrid-edit-button"})
                                .click(function(e) {
                                    window.location.href = `${HOST}/admin/products/${item.id}/edit`
                                })
    
                                var $customDeleteButton = $("<button>").attr({class: "customGridDeletebutton jsgrid-button jsgrid-delete-button"})
                                .click(function(e) {
                                    swal({
                                        title: "Bạn có chắc muốn xóa?",
                                        text: "Một khi đã xóa không thể khôi phục!",
                                        icon: "warning",
                                        buttons: ["Hủy", "Xóa"],
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            $.ajax({
                                                url: `http://localhost:3000/api/products/${item.id}`,
                                                method: 'DELETE'
                                            }).done(res => {
                                                if (res.success == true) {
                                                    swal("Sản phẩm đã được xóa!", {
                                                        icon: "success",
                                                    })
                                                    fillForm()
                                                } else {
                                                    swal("Đã xảy ra lỗi!", {
                                                        icon: "error",
                                                    })
                                                }
                                            }).fail(() => {
                                                swal("Đã xảy ra lỗi!", {
                                                    icon: "error",
                                                })
                                            })
                                            
                                        } else {
                                            return
                                        }
                                    })
                                })
    
                                return $("<div>").append($customViewButton).append($customEditButton).append($customDeleteButton);
                            }
                        }
                    ]
                });
            })
                
        })

    })
}
