const injects = require('./inject')
const path = require('path')
const matchers = Object.entries(injects).map(([key, i]) => {
    return {key, matcher: i.injectMatcher}
})

const split = (m, arr) => {
    return arr.map(i => {
        if (m.matcher.test(i)) {
            return i.split(m.matcher)
                .map(s => {
                    if (m.matcher.test(s)) {
                        return {injectKey: m.key}
                    } else {
                        return s
                    }
                })
        } else {
            return [i]
        }
    }).reduce((a, i) => {
        a.push(...i)
        return a
    }, [])
}

/**
 * 解析器，返回代码是否需要插入代码
 */
module.exports = ({content, options}) => {
    const {context, libs} = options
    let inject = false
    //过滤掉别的库，只关注自己写的代码
    let r = path.relative(process.cwd(), context)
    if (r.indexOf('node_modules') === 0) {
        r = r.split(path.sep)[1]
        if (r !== '@dr') {
            inject = true
        }
    } else {
        inject = true
    }
    let contentArr = inject ? [content] : matchers.reduce((arr, m) => split(m, arr), [content])
    return Promise.resolve(
        {
            /**
             * 是否需要插入代码
             */
            inject: contentArr.length > 1,
            /**
             *源码数组
             * 如果是string的话，直接join
             * 如果是Object的话，对象格式是{injectKey}
             */
            contentArr
        }
    )
}
