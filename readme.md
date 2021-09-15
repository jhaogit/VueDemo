# Vue.js Demo

## 演示地址

[http://qq15725.oschina.io/vuedemo](http://qq15725.oschina.io/vuedemo)

## 依赖
- bootstrap.css
- Vue.js 2.*
- lodash.js

```html
<link rel="stylesheet" href="lib/css/bootstrap.min.css">
<script src="lib/js/vue.min.js"></script>
<script src="lib/js/lodash.min.js"></script>
```

## 开始

```html
<script src="vueDemoTable.js"></script>
```
引入 `vueDemoTable.js` 然后 `Vue.use($vueDemoTable);`即可


## 使用

HTML 部分
```html
<div id="app">
    <vue-demo-table
            :list="list"
            :list-parent="listParent"
    >
    </vue-demo-table>
</div>
```

Javascript 部分
```html
<script>
Vue.use($vueDemoTable);
var vm = new Vue({
    el: '#app',
    data: {
        list: [],
        listParent: {}
    },
    methods: {
        setList: function(val, listParent = {}) {
            this.list = val;
            this.listParent = listParent;
        }
    }
});
vm.setList(
        [
            {
                '用户昵称': '<a href="javascript:">Erica Wright</a>',
                '手机号码': 18103760000,
                '最近登录时间': '43分钟前',
                '注册时间': '3月前',
                '状态': '正常'
            }
        ]
);
</script>
```

## 更多

### 排序参数与搜索参数

```html
<script>
    var list = [
        {
            '用户昵称': {
                html: '<a href="javascript:">Erica Wright</a>',
                order: false,
                // 排序参数false为 这条信息的这个字段不参与排序
                searchText: 'Erica Wright'
                // 搜索时匹配的Text 属性可选参数 false 同上
                // 上两项不填 即等于 html
            },
            '手机号码': 18103760000,
            // 参数不为对象时 三项参数 都为这个值
            '最近登录时间': {
                html: '43分钟前',
                order: 1477466166
            },
            '注册时间': {
                html: '3月前',
                order: 1467806349
            },
            '状态': {
                html: '正常',
                order: 1
            }
        },
        {
            '用户昵称': {
                html: '<a href="javascript:">Arlene</a>',
                order: false,
                searchText: 'Arlene'
            },
            '手机号码': 18103760001,
            '最近登录时间': {
                html: '2小时前',
                order: 1477460601
            },
            '注册时间': {
                html: '2月前',
                order: 1470655403
            },
            '状态': {
                html: '正常',
                order: 1
            }
        }
    ];
    vm.setList(list);
</script>
```

### 单列数据是否需要排序
传递第二个参数
是否需要排序 及 单列的className
```html
<script>
var list = [
        {
            '用户昵称': {
                html: '<a href="javascript:">Erica Wright</a>',
                order: false,
                // 排序参数false为 这条信息的这个字段不参与排序
                searchText: 'Erica Wright'
                // 搜索时匹配的Text 属性可选参数 false 同上
                // 上两项不填 即等于 html
            },
            '手机号码': 18103760000,
            // 参数不为对象时 三项参数 都为这个值
            '最近登录时间': {
                html: '43分钟前',
                order: 1477466166
            },
            '注册时间': {
                html: '3月前',
                order: 1467806349
            },
            '状态': {
                html: '正常',
                order: 1
            }
        }
    ];
    var listParent = {
        '用户昵称': {
            order: false,
            className: 'am-link-muted'
            // class将添加在每行这列的td上
        }
    };
    vm.setList(list, listParent);
</script>
```

## 警告

- 懒得做大量的搜索,排序的偷懒解决方案
- 因为是前端进行 所以必须所有数据输出到前端处理