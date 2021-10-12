export interface SchedulerJob extends Function {
  active?: boolean
  allowRecurse?: boolean
}

let isFlushing = false
let isFlushPending = false
const __DEV__ = true
const queue: SchedulerJob[] = []
let flushIndex = 0

const resolvedPromise: Promise<any> = Promise.resolve()
let currentFlushPromise: Promise<void> | null = null

const RECURSION_LIMIT = 100
type CountMap = Map<SchedulerJob, number>

export function nextTick(fn?: () => void): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  // eslint-disable-next-line promise/prefer-await-to-then
  return fn ? p.then(fn) : p
}

export function queueJob(job: SchedulerJob) {
  // The dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  if (
    queue.length === 0 ||
    !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )
  ) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush(): void {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    // eslint-disable-next-line promise/prefer-await-to-then
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs(seen?: CountMap): void {
  isFlushPending = false
  isFlushing = true
  /* istanbul ignore else  */
  if (__DEV__) {
    seen = seen || new Map()
  }

  // Conditional usage of checkRecursiveUpdate must be determined out of
  // try ... catch block since Rollup by default de-optimizes treeshaking
  // inside try-catch. This can leave all warning code unshaked. Although
  // they would get eventually shaken by a minifier like terser, some minifiers
  // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : /* istanbul ignore next  */ () => {} // eslint-disable-line @typescript-eslint/no-empty-function

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job.active !== false) {
        /* istanbul ignore if  */
        if (__DEV__ && check(job)) {
          continue
        }

        job()
      }
    }
  } finally {
    flushIndex = 0
    queue.length = 0

    isFlushing = false
    currentFlushPromise = null
  }
}

function checkRecursiveUpdates(seen: CountMap, fn: SchedulerJob): boolean {
  const count = seen.get(fn) || 0
  /* istanbul ignore if */
  if (count > RECURSION_LIMIT) {
    console.warn(
      `Maximum recursive updates exceeded. ` +
      `This means you have a reactive effect that is mutating its own ` +
      `dependencies and thus recursively triggering itself.`
    )
    return true
  }

  seen.set(fn, count + 1)
  return false
}