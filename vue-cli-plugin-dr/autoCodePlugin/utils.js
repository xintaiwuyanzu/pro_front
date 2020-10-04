const BJSON = require('buffer-json');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path')
const {isWindows} = require('@vue/cli-shared-utils')

const directories = new Set();
const nocacheSet = new Set();

/**
 * 这里复制了cache-loader的write方法，没办法直接引用
 * @param key
 * @param data
 * @param callback
 */
function write(key, data, callback) {
    const dirname = path.dirname(key);
    const content = BJSON.stringify(data);

    if (directories.has(dirname)) {
        // for performance skip creating directory
        fs.writeFile(key, content, 'utf-8', callback);
    } else {
        mkdirp(dirname, mkdirErr => {
            if (mkdirErr) {
                callback(mkdirErr);
                return;
            }
            directories.add(dirname);
            fs.writeFile(key, content, 'utf-8', callback);
        });
    }
}

module.exports = {
    add(p) {
        nocacheSet.add(p)
    },
    cacheWrite(key, data, callback) {
        const {result} = data
        const sources = result[1].sources
        for (const s in sources) {
            const p = path.resolve(sources[s])
            if (nocacheSet.has(p)) {
                callback()
                return;
            }
        }
        write(key, data, callback)
    },
    /**
     * 这里复制了vue-plugin-babel的exclude方法，没办法直接引用
     * @param filePath
     */
    vueExclude(options, drOptions) {
        function genTranspileDepRegex(transpileDependencies) {
            const deps = transpileDependencies.map(dep => {
                if (typeof dep === 'string') {
                    const depPath = path.join('node_modules', dep, '/')
                    return isWindows
                        ? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
                        : depPath
                } else if (dep instanceof RegExp) {
                    return dep.source
                }
            })
            return deps.length ? new RegExp(deps.join('|')) : null
        }

        const transpileDepRegex = genTranspileDepRegex(options.transpileDependencies)
        const dirName = p => path.dirname(require.resolve(p))
        const cliServicePath = dirName('@vue/cli-service')

        const excludePkgs = drOptions.libs.map(dirName)
        const startWith = p => {
            for (const i in excludePkgs) {
                if (p.startsWith(excludePkgs[i])) {
                    return true
                }
            }
            return false
        }
        return filepath => {
            // always transpile js in vue files
            if (/\.vue\.jsx?$/.test(filepath)) {
                return false
            }
            // 排除自定义lib
            if (startWith(filepath)) {
                return false
            }
            // exclude dynamic entries from cli-service
            if (filepath.startsWith(cliServicePath)) {
                return true
            }
            // only include @babel/runtime when the @vue/babel-preset-app preset is used
            if (
                process.env.VUE_CLI_TRANSPILE_BABEL_RUNTIME &&
                filepath.includes(path.join('@babel', 'runtime'))
            ) {
                return false
            }

            // check if this is something the user explicitly wants to transpile
            if (transpileDepRegex && transpileDepRegex.test(filepath)) {
                return false
            }
            // Don't transpile node_modules
            return /node_modules/.test(filepath)
        }
    }
}
