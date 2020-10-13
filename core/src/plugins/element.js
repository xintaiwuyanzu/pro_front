import element from "element-ui";

export default (vue, router, store, opt) => {
    vue.use(element, Object.assign({size: 'small', zIndex: 3000}, opt))
}
