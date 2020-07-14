
fillForm = () => {
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
                    url: "http://localhost:3000/api/sliders",
                    dataType: "json"
                }).done(function(res) {
                    d.resolve(res.sliders);                            
                });

                return d.promise();
            }
        },
        fields: [
            { name: "id", type: "number", width: 50, title: "ID" },
            {
                name: "url", type: "text", width: 200, title: "Image", align: 'center',
                itemTemplate: function(value, item) {
                   return `<img src="http://localhost:3000${value.replace("public", "")}" "width="100" height="100">`
               }
            },
            { name: "createdAt", type: "datetime", title: "Created At"},
            { name: "updatedAt",type: "datetime", title: "Updated At"},
            { name: "isActive", type: "checkbox", title: "Is Active", sorting: false },
            { type: "control", width: 100, editButton: false, deleteButton: false,
                itemTemplate: function(value, item) {
                    var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);

                    var $customViewButton = $("<button>").attr({class: "customGridViewbutton jsgrid-button jsgrid-search-button"})
                    .click(function(e) {
                        window.location.href = `${HOST}/sliders/${item.id}/show`
                    })


                    var $customEditButton = $("<button>").attr({class: "customGridEditbutton jsgrid-button jsgrid-edit-button"})
                    .click(function(e) {
                        window.location.href = `${HOST}/sliders/${item.id}/edit`
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
                                    url: `http://localhost:3000/api/sliders/${item.id}`,
                                    method: 'DELETE'
                                }).done(res => {
                                    if (res.success == true) {
                                        swal("Hình ảnh đã được xóa!", {
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
}
