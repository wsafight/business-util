---
title: 颜色排序算法
description: 颜色也可以排序
---

仍旧记得三年前 Chrome 浏览器在多次排序后，显示出不同的列表。不过这三年中，浏览器的算法由不稳定的快速排序（少于 10 个元素使用插入排序）演变成稳定的 TimSort 算法。
同时浏览器也由仅仅支持字母排序，变成了支持本地语言支持的 API localeCompare。

但浏览器对于颜色排序来说，官方没有提供解决方案。

本文的排序算法来源于 Tomek 的一篇文章 [Sorting colors in JavaScript](https://tomekdev.com/posts/sorting-colors-in-js) 。

代码分析所示:

```HTML
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        ul {
            list-style-type: none;
            margin: 0;
            overflow: hidden;
            padding: 0.5rem 0;
        }

        li {
            display: block;
            float: left;
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 0 0 6px 0;
            font-size: 10px;
            margin: 4px;
            word-break: break-word;
            padding: 4px;
        }
    </style>
</head>
<body>
<h1>Sorting colors</h1>
<p>Example from <a href="https://tomekdev.com/posts/sorting-colors-in-js">https://tomekdev.com/posts/sorting-colors-in-js</a>. Go there to learn more about sorting colors.</p>

<section class="box">
    <h2>Colors unsorted</h2>
    <ul id="unsorted"></ul>
</section>

<section class="box">
    <h2>Colors sorted</h2>
    <ul id="sorted"></ul>
</section>
</body>
<script type="module">
    import colorUtil from "https://cdn.skypack.dev/color-util@2.2.1";

    const colors = [
        '#ffffff',
        '#009cd4',
        '#505e75',
        'rgba(0,0,0,0.1)',
        '#606a79',
        'rgba(0,0,0,0.2)',
        '#1e2837',
        '#e3e6e9',
        '#969eac',
        '#f02913',
        '#eeeeee',
        '#555e74',
        '#000000',
        '#edeef1',
        '#02bd00',
        '#eae7e6',
        '#e3e3e3',
        '#f4f5f6',
        '#e6e6e6',
        'rgba(240,41,19,0.05)',
        '#efeeed',
        '#209bd0',
        '#1f2837',
        '#999999',
        'rgba(0,156,212,0.05)',
        'rgba(63,78,90,0.11)',
        'rgba(80,94,117,0.1)',
        '#868686',
        '#e8e4e1',
        '#fb7c00',
        '#485f79',
        '#e5f1f6',
        '#6e4888',
        '#b9b9b9',
        '#e0e2e8',
        'rgba(232,228,225,0.5)',
        '#f0f0f0',
        '#eaebee',
        '#656d78',
        'rgba(96,106,121,0.8)',
        '#ee0b0b',
        '#b3b3b3',
        'rgba(83,83,83,0.2)',
        '#f9f9f9',
        'rgba(80,94,117,0.5)',
        'rgba(255,255,255,0.1)',
        '#e9e9e9',
        '#f9f8f8',
        '#ff3ea8',
        'rgba(136,183,213,0)',
        '#dddddd',
        '#e0e0e0',
        '#c0c0c0',
        '#eef7fa',
        '#f5f4f3',
        'rgba(96,106,121,0.7)',
        '#adacac',
        '#e1e4e7',
        '#dadada',
        '#8891a7',
        'rgba(0,0,0,0.05)',
        '#fcfcfc',
        '#dcdcdc',
        '#535e73',
        'rgba(80,94,117,0.3)',
        '#9e9e9e',
        '#d4cfcf',
        '#f8d200',
        'rgba(194,225,245,0)',
        '#ffff00',
        '#928f8f',
        'rgba(0,0,0,0.5)',
        'rgba(0,156,212,0.2)',
        '#0295f7',
        '#5d99d0',
        'rgba(96,106,121,0.2)',
        'rgba(255,255,255,0.44)',
        '#dee0e2',
        '#c0c9d1',
        '#48cd35',
        '#5897fb',
        '#e4e4e4',
        '#333333',
        '#f7f6f6',
        '#acb1b5',
        '#e8e8e8',
        '#ff5f57',
        '#ffbe2f',
        '#28ca42',
        '#c9c9c9',
        '#cccccc',
        '#f3f4f5',
        '#e90e11',
        '#8b5ca9',
        '#a9a9a9',
        '#f2fafd',
        '#73468b',
        '#6b7897',
        'rgba(81,95,118,0.5)',
        'rgba(136,136,136,0.47)',
        '#dfdfdf',
        'rgba(158,158,158,0.2)',
        'rgba(2,189,0,0.2)',
        '#e2f2f7',
        'rgba(251,124,0,0.2)',
        '#616e82',
        '#1189ca',
        '#171e2a',
        'rgba(244,245,246,0.5)',
        'rgba(0,0,0,0.3)',
        '#e5f5fa',
        '#ffbc49',
        '#b8b8b8',
        '#c8c8c8',
        '#e5f5fb',
        'rgba(150,158,172,0.1)',
        '#949ead',
        '#59d2fb',
        '#00a9e7',
        '#f7f7f7',
        '#d9dce2',
        '#ecebeb',
        'rgba(0,0,0,0.13)',
        'rgba(101,116,139,0.07)',
        '#a8aeb9',
        'rgba(30,40,55,0.5)',
        '#09aae8',
        '#713996',
        '#fbfbfb',
        '#5ad1fc',
        '#4a4a4a',
        '#e9edf0',
        '#7ec0ee',
        '#f4d309',
    ];

    function renderColors(colors, listName) {
        let list = document.createDocumentFragment();

        for (let i = 0, len = colors.length; i < len; i++) {
            let el = document.createElement('li');
            el.style.backgroundColor = colors[i];
            list.appendChild(el);
        }

        document.querySelector(listName).appendChild(list);
    }

    renderColors(colors, '#unsorted');

    // Sorting
    function blendRgbaWithWhite(rgba) {
        const color = colorUtil.color(rgba);
        const a = color.rgb.a / 255;
        const r = Math.floor(color.rgb.r * a + 0xff * (1 - a));
        const g = Math.floor(color.rgb.g * a + 0xff * (1 - a));
        const b = Math.floor(color.rgb.b * a + 0xff * (1 - a));
        return '#' + ((r << 16) | (g << 8) | b).toString(16);
    }

    function colorDistance(color1, color2) {
        const x =
            Math.pow(color1[0] - color2[0], 2) +
            Math.pow(color1[1] - color2[1], 2) +
            Math.pow(color1[2] - color2[2], 2);
        return Math.sqrt(x);
    }

    const clusters = [
        { name: 'red', leadColor: [255, 0, 0], colors: [] },
        { name: 'orange', leadColor: [255, 128, 0], colors: [] },
        { name: 'yellow', leadColor: [255, 255, 0], colors: [] },
        { name: 'chartreuse', leadColor: [128, 255, 0], colors: [] },
        { name: 'green', leadColor: [0, 255, 0], colors: [] },
        { name: 'spring green', leadColor: [0, 255, 128], colors: [] },
        { name: 'cyan', leadColor: [0, 255, 255], colors: [] },
        { name: 'azure', leadColor: [0, 127, 255], colors: [] },
        { name: 'blue', leadColor: [0, 0, 255], colors: [] },
        { name: 'violet', leadColor: [127, 0, 255], colors: [] },
        { name: 'magenta', leadColor: [255, 0, 255], colors: [] },
        { name: 'rose', leadColor: [255, 0, 128], colors: [] },
        { name: 'black', leadColor: [0, 0, 0], colors: [] },
        { name: 'grey', leadColor: [235, 235, 235], colors: [] },
        { name: 'white', leadColor: [255, 255, 255], colors: [] },
    ];

    function oneDimensionSorting(colors, dim) {
        return colors.sort((colorA, colorB) => colorB.hsl[dim] - colorA.hsl[dim]);
    }

    function sortWithClusters(colorsToSort) {
        const mappedColors = colorsToSort
            .map((color) => {
                const isRgba = color.includes('rgba');
                return isRgba ? blendRgbaWithWhite(color) : color
            })
            .map(colorUtil.color);

        mappedColors.forEach((color) => {
            let minDistance;
            let minDistanceClusterIndex;

            clusters.forEach((cluster, clusterIndex) => {
                const colorRgbArr = [color.rgb.r, color.rgb.g, color.rgb.b];
                const distance = colorDistance(colorRgbArr, cluster.leadColor);
                if (typeof minDistance === 'undefined' || minDistance > distance) {
                    minDistance = distance;
                    minDistanceClusterIndex = clusterIndex;
                }
            });

            clusters[minDistanceClusterIndex].colors.push(color);
        });

        clusters.forEach((cluster) => {
            const dim = ['white', 'grey', 'black'].includes(cluster.name) ? 'l' : 's';
            cluster.colors = oneDimensionSorting(cluster.colors, dim)
        });

        return clusters;
    }

    const sortedClusters = sortWithClusters(colors);
    const sortedColors = sortedClusters.reduce((acc, curr) => {
        const colors = curr.colors.map((color) => color.hex);
        return [...acc, ...colors];
    }, []);
    renderColors(sortedColors, '#sorted');
</script>
</html>
```
