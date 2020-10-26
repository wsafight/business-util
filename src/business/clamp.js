export function clamp(val, max, min) {
    if (max < min) {
        throw new Error('最小值不应该大于最大值');
    }
    return Math.max(min, Math.min(val, max));
}
