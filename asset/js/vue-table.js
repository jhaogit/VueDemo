window.$vueDemoTable = function (Vue) {
    Vue.component('vueDemoTable', require('../components/vue-table.vue'));
    Vue.directive('table', {
        bind: function (el) {

        }
    })
};

