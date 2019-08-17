#实现一歌webpack plugin
1.配置开发环境  
思路:开发webpack插件，配置一个webpack项目，然后将插件运行，开发成功后，将插件文件打包发布。   
   1.1创建项目   
   ```$xslt
mkdir webpack-plugin
cd mkdir
npm init
```
   1.2配置webpack，建立webpack.plugin.js
   ```$xslt
const path = require("path");

const PATHS = {
	lib: path.join(__dirname, "/index.js"),
	build: path.join(__dirname, "build"),
};

module.exports = {
	entry: {
		lib: PATHS.lib,
	},
	output: {
		path: PATHS.build,
		filename: "[name].js",
	}
};
``` 
1.3 入口文件index.js
```$xslt
console.log('index')
```
1.4 package.json scripts
```$xslt
"scripts": {
    "build:plugin": "webpack --config webpack.plugin.js --mode production"
  }
```
2.编写插件文件   
    2.1src/demo-plugin.js
```$xslt

module.exports = class DemoPlugin {
	constructor() {
	}
	apply() {
           console.log('applying')
	    })
	}
}
```
2.2 webpack.plugin.js使用插件 
```$xslt
const DemoPlugin = require("./src/demo-plugin.js");

module.exports = {
  ...
  // 引入 plugin
  plugins: [new DemoPlugin()],
};

```
运行npm run build:plugin，终端打印出applying，说明插件生效。
```$xslt
applying
Hash: 98c8997160aa995a58a4
Version: webpack 4.12.0
Time: 93ms
Built at: 2019-04-29 14:34:31
 Asset       Size  Chunks             Chunk Names
lib.js  956 bytes       0  [emitted]  lib
[0] ./index.js 26 bytes {0} [built]。
```
2.2 传参,在应用插件时，参数会传到constructor里
```$xslt
module.exports = class DemoPlugin {
    constructor(options) {
        this.options = options
    }
    apply() {
        console.log('apply', this.options)
    }
}
```
使用插件时传入参数
```$xslt
module.exports = {
    ...
    plugins: [new DemoPlugin({ name: 'demo' })],
}
```
运行npm run build:plugin,打印出传递的参数。   
2.3理解webpack的compiler和compilation，在之前的 webpack plugin 基本结构中介绍，apply 函数能够用来访问 webpack 的核心。具体的做法是，apply 函数的参数为 compiler
```$xslt
module.exports = class DemoPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        console.log(compiler)
    }
}
```
再次运行 npm run build:plugin，会发现终端上打印出了 compiler 的全部信息，其中 hooks 字段占了绝大部分。
对照着官方文档，你会发现每一个 hook 对应一个特定的阶段。 例如，emit 实践是在向输出目录发送资源之前执行。这样就可以通过监听 hook 来实现控制编译过程。
```$xslt
module.exports = class DemoPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        compiler.plugin('emit', (compilation, next) => {
            console.log(compilation)

            next()
        })
    }
}
```
运行 npm run build:plugin 会显示出比以前更多的信息，因为编译对象包含webpack 遍历的整个依赖关系图。 你可以访问与此相关的所有内容，包括 entries, chunks, modules, assets等。
2.4 通过 Compilation 写入文件   
可以通过 compilation 的 assets 对象来编写新的文件，或是修改已经创建的文件。为了更好地写入文件，我们引入一个 npm 包
```$xslt
npm install webpack-sources --save-dev
```
```$xslt
const { RawSource } = require("webpack-sources");

module.exports = class DemoPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        const { name } = this.options;

        compiler.plugin('emit', (compilation, next) => {
            compilation.assets[name] = new RawSource("demo");

            next()
        })
    }
}
```
在终端运行 npm run build:plugin
```$xslt
Hash: 98c8997160aa995a58a4
Version: webpack 4.12.0
Time: 95ms
Built at: 2019-04-29 16:08:52
 Asset       Size  Chunks             Chunk Names
lib.js  956 bytes       0  [emitted]  lib
  demo    4 bytes          [emitted]
[0] ./index.js 26 bytes {0} [built]

```
在 Asset 那里一列内，出现了我们自定的 demo 文件。
3.打包插件发布
webpack.build.js
```$xslt

```


