import path from "node:path";
import fs from "node:fs";

// 文件根目录
const DIR_PATH = path.resolve();
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = [
  "index.md",
  ".vitepress",
  "node_modules",
  ".idea",
  "assets",
];

// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

// 取差值
const intersections = (arr1, arr2) =>
  Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

// 把方法导出直接使用
export function set_sidebar(pathname) {
  // 获取pathname的路径
  const dirPath = path.join(DIR_PATH, pathname);
  // 读取pathname下的所有文件或者文件夹
  const files = fs.readdirSync(dirPath);
  // 过滤掉
  const items = intersections(files, WHITE_LIST);
  // 排序文件名
  items.sort((a, b) => {
    // 提取文件名中的数字部分并比较
    const numA = extractChapterNumber(a);
    const numB = extractChapterNumber(b);
    return numA - numB;
  });
  // getList 函数后面会讲到
  return getList(items, dirPath, pathname);
}

function getList(params, path1, pathname) {
  // 存放结果
  const res = [];
  // 组计数
  let groupCount = 1;
  // 开始遍历params
  for (let file of params) {
    // 拼接目录
    const dir = path.join(path1, file);
    // 判断是否是文件夹
    const isDir = isDirectory(dir);
    if (isDir) {
      // 如果是文件夹,读取之后作为下一次递归参数
      const files = fs.readdirSync(dir);
      const sortedFiles = files.sort((a, b) => {
        // 提取文件名中的数字部分并比较
        const numA = extractChapterNumber(a);
        const numB = extractChapterNumber(b);
        return numA - numB;
      });
      res.push({
        text: `第${groupCount}组`,
        collapsible: true,
        collapsed: true,
        items: getList(sortedFiles, dir, `${pathname}/${file}`),
      });
      groupCount++;
    } else {
      // 获取名字
      const name = path.basename(file);
      // 排除非 md 文件
      const suffix = path.extname(file);
      if (suffix !== ".md") {
        continue;
      }
      res.push({
        text: truncateTitle(name), // 截断或缩略标题
        link: `${pathname}/${name}`,
      });
    }
  }
  // 对name做一下处理，把后缀删除
  res.map((item) => {
    item.text = item.text.replace(/\.md$/, "");
  });
  return res;
}

// 从文件名中提取章节号
function extractChapterNumber(filename) {
  const regex = /第(\d+)章/;
  const match = filename.match(regex);
  if (match) {
    return parseInt(match[1]);
  } else {
    return Infinity; // 处理没有章节号的情况
  }
}

// 截断或缩略标题函数示例
function truncateTitle(title, maxLength = 12) {
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...';
  }
  return title;
}
