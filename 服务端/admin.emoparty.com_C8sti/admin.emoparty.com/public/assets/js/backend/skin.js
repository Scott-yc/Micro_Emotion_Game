define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'skin/index' + location.search,
                    // add_url: 'skin/add',
                    edit_url: 'skin/edit',
                    // del_url: 'skin/del',
                    multi_url: 'skin/multi',
                    import_url: 'skin/import',
                    table: 'skin',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), operate: 'LIKE', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'access', title: __('Access'), searchList: {"1":__('Access 1'),"2":__('Access 2')}, formatter: Table.api.formatter.normal},
                        {field: 'number', title: __('Number')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,
                            formatter: function(value, row, index) {
                                var that = $.extend({}, this);
                                var table = $(that.table).clone(true);
                                // operate-edit编辑  perate-del删除
                                //判断什么时候显示什么时候不显示
                                if (row.id === 1) {
                                    $(table).data("operate-edit", null); // 列表页面隐藏 .编辑operate-edit  - 删除按钮operate-del
                                }
                                that.table = table;
                                return Table.api.formatter.operate.call(that, value, row, index);
                            }
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            if ($("#c-access").val() == 1){
                $("#number").hide();
            }else{
                $("#number").show();
            }
            $(document).on("change", "#c-access", function(){
                //变更后的回调事件
                if ($(this).val() == 1){
                    $("#number").hide();
                }else{
                    $("#number").show();
                }
            });
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
