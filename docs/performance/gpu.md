# 利用 gpu 加速数据运算

## GPGPU 介绍

通用图形处理器（General-purpose computing on graphics processing units，简称GPGPU），是一种利用处理图形任务的图形处理器来计算原本由中央处理器处理的通用计算任务。这些通用计算常常与图形处理没有任何关系。由于现代图形处理器强大的并行处理能力和可编程流水线，令流处理器可以处理非图形数据。特别在面对单指令流多数据流（SIMD），且数据处理的运算量远大于数据调度和传输的需要时，通用图形处理器在性能上大大超越了传统的中央处理器应用程序。

<div style="float: right">更新时间: {docsify-updated}</div>
