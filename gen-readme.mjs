import {
    writeFile
} from 'node:fs/promises'
import sidebar from './sidebar.json' with { type: "json" };

const header = `# 实用工具

本来想记录业务类型的算法，但业务上大部分问题都和算法无关。

所以本库修改由记录实用工具。

记录的工具源自于工作，生活，开源软件，算法网站，以及他人书籍。

当前网址为: https://wsafight.github.io/business-util/
`


const main = async () => {
    // const astorContents = await readFile('./astro.config.mjs', 'utf-8')
    console.log(sidebar)
    let content = [header]
    sidebar.forEach(item => {
        content.push(`* ${item.label}`)
        item.items.forEach(subItem => {
            content.push(`    * [${subItem.label}](https://wsafight.github.io/business-util/${subItem.slug})`)
        })
        content.push('')
    })
    await writeFile('./README.md', content.join('\n'))
    console.log(content)
}

main()