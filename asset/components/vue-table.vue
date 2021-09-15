<template>
    <div class="table-responsive">
        <!--搜索-->
        <div class="col-sm-12 col-md-3" style="padding-left: 0;margin: 20px 0;">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">关键字</span>
                <input v-model="filterKey" placeholder="全局匹配" type="text" class="form-control">
            </div>
        </div>

        <!--每页数量设置-->
        <div class="col-sm-12 col-md-1" style="padding-left: 0;margin: 20px 0;">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">行数</span>
                <input v-model="rows" type="text" class="form-control" number>
            </div>
        </div>
        <!--分页-->
        <div class="col-sm-12 col-md-8" style="text-align: center">
            <ul class="pagination">
                <li v-if="cur!=1"><a href="javascript:" @click="delCur" rel="next">«</a></li>
                <li v-else class="disabled"><span>«</span></li>

                <li v-if="cur-3 > 1 && all > 7"><a href="javascript:" @click="setCur(1)" rel="next">1</a></li>
                <li v-if="cur-3 > 1 && all > 7" class="disabled"><span>...</span></li>

                <li v-for="index in indexs" :class="{ active: cur == index }">
                    <a href="javascript:" @click.prevent="btnClick(index)">
                        {{ index }}
                    </a>
                </li>

                <li v-if="cur+3 < all && all > 7" class="disabled"><span>...</span></li>
                <li v-if="cur+3 < all && all > 7">
                    <a href="javascript:" @click="setCur(all)" rel="next">
                        {{ all }}
                    </a>
                </li>

                <li v-if="cur!=all"><a href="javascript:" @click="addCur" rel="next">»</a></li>
                <li v-else class="disabled"><span>»</span></li>
            </ul>
        </div>
        <br>
        <span class="vue-table-total">共{{ total }}条记录</span>
        <table class="table table-condensed table-hover table-striped small vue-table">
            <thead>
                <tr>
                    <th v-for="key in columns" @click="sortBy(key)" :class="{active: sortKey == key + 'order'}">
                        {{ title[key] }}
                        <span class="arrow" v-if="isOrder[key]" :class="sortOrders[key + 'order'] > 0 ? 'asc' : 'dsc'"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in getData">
                    <td v-for="key in columns" :class="className[key]" v-html="entry[key]['html']"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    module.exports = {
        props: {
            list: Array,
            listParent: Object
        },
        data: function () {
            return {
                sortKey: '',
                filterKey: '',
                columns: [],
                isOrder: {},
                sortOrders: {},
                title: {},
                className: {},
                data: [],
                total: 0,
                rows: 16,
                all: 1, // 总页数
                cur: 1  // 当前页码
            }
        },
        watch: {
            list: function (val, oldVal) {
                var list = [];
                var field = {};
                for (var i=0; i<val.length; i++) {
                    var ix = 0;
                    var res = {};
                    for (var key in val[i]) {
                        var value = val[i][key];
                        if (!field['x' + ix]) {
                            var isOrder = true;
                            var classNames = '';
                            for (var key1 in this.listParent) {
                                var value1 = this.listParent[key1];
                                if (key === key1) {
                                    if (value1.className) {
                                        classNames = value1.className;
                                    }
                                    if (value1.order === false) {
                                        isOrder = false;
                                    }
                                }
                            }
                            field['x' + ix] = {fieldName: key, isOrder: isOrder, classNames: classNames};
                        }

                        if (!(value instanceof Object)) {
                            res[('x' + ix)] = {html: value, order: value, searchText: value};
                            res[('x' + ix + 'order')] = value;
                        } else {
                            var html = value.html ? value.html : '';
                            var order = value.order ? value.order : (value.order === false ? '' : html);
                            var searchText = value.searchText ? value.searchText : (value.searchText === false ? '' : html);
                            value.html = html;
                            value.order = order;
                            value.searchText = searchText;
                            res[('x' + ix)] = value;
                            res[('x' + ix + 'order')] = value.order;
                        }
                        ix++;
                    }
                    list.push(res);
                }
                var keys = [];
                var title = {};
                var classNames = {};
                var isOrder = {};
                for (var index in field) {
                    var value = field[index];
                    keys.push(index);
                    title[index] = value['fieldName'];
                    classNames[index] = value['classNames'];
                    isOrder[index] = value['isOrder'];
                }
                var sortOrders = {};
                keys.forEach(function (key) {
                    sortOrders[key + 'order'] = 1
                });
                this.data = list;
                this.columns = keys;
                this.sortOrders = sortOrders;
                this.title = title;
                this.className = classNames;
                this.isOrder = isOrder;
                this.total = list.length;
                this.all = Math.ceil(this.total/this.rows);
            }
        },
        computed: {
            getData: function () {
                var self = this;
                var data = self.data.filter(function (row) {
                    var searchRegex = new RegExp(self.filterKey, 'i')
                    for (var key in row) {
                        var res = searchRegex.test(row[key]['searchText']);
                        if (res) {
                            return true;
                        }
                    }
                    return false;
                });
                self.setTotal(data.length);

                var order = self.sortOrders[self.sortKey] > 0 ? 'asc' : 'desc';
                data = _.orderBy(data, [self.sortKey], [order]);

                if (!data.length){
                    self.setTotal(0);
                    self.setAll(1);
                    self.setCur(1);
                    return data;
                }
                var arr = [];
                var n = self.rows;

                var all = self.setAll(Math.ceil(self.total/n));
                var cur = self.cur;
                cur = cur > all ? all : cur;
                var start = (cur-1)*n;
                var max = cur*n > data.length ? data.length : cur*n;
                for (var i=start; i<max; i++) {
                    arr.push(data[i]);
                }

                return arr;
            },
            indexs: function(){
                var left = 1;
                var right = this.all;
                var ar = [];
                if(this.all>= 8){
                    if(this.cur > 3 && this.cur < this.all-3){
                        left = this.cur - 3;
                        right = this.cur + 3;
                    }else{
                        if(this.cur<=3){
                            left = 1;
                            right = 7;
                        }else{
                            right = this.all;
                            left = this.all -6;
                        }
                    }
                }
                while (left <= right){
                    ar.push(left);
                    left ++
                }
                return ar;
            }
        },
        methods: {
            addCur: function () {
                this.setCur(this.cur + 1);
            },
            delCur: function () {
                this.setCur(this.cur - 1);
            },
            setCur: function (val) {
                this.cur = val;
            },
            setTotal: function (val) {
                this.total = val;
            },
            setAll: function (val) {
                this.all = val;
            },
            sortBy: function (key) {
                var self = this;
                this.sortKey = this.isOrder[key] ? key + 'order' : '';
                this.columns.forEach(function (k) {
                    if (k != key ) {
                        self.sortOrders[k + 'order'] = 1;
                    }
                });
                this.sortOrders[key + 'order'] = this.sortOrders[key + 'order'] * -1;
            },
            btnClick: function(data){
                if(data != this.cur){
                    this.setCur(data);
                }
            }
        }
    }
</script>

<style>
    .vue-table {
        border: 2px solid #42b983;
        border-radius: 3px;
        background-color: #fff;
    }
    .vue-table-total {
        display: block;
        text-align: center;
        color: #bf722b !important;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: .1rem;
        text-decoration: none;
        text-transform: uppercase;
    }
    .vue-table thead th {
        background-color: #42b983;
        color: rgba(255,255,255,0.66);
        cursor: pointer;
        text-shadow: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -user-select: none;
    }
    .vue-table>thead>tr>th.active {
        background-color: #42b983;
        color: #fff;
    }
    .vue-table>thead>tr>th.active .arrow {
        opacity: 1;
    }
    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }
    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
    }
    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
    }
</style>