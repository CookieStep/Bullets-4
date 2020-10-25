interface Collection<A>{
    map: Map<bigint, A>
    empty: Array<bigint>
    push(item: A): bigint
    push(...items: A[]): bigint[]
    delete(id: bigint): boolean
    delete(...ids: bigint[]): void
    forEach(callbackfn: (value: A, key: bigint, col: Collection<A>) => void): void
    filter(callbackfn: (value: A, key: bigint, col: Collection<A>) => boolean): Collection<A>
    remove(callbackfn: (value: A, key: bigint, col: Collection<A>) => boolean): (A| A[])
    scan(): bigint[]
    clear(): void
    get(id: bigint): A
    set(id: bigint, value: A): Collection<A>
    has(id: bigint): boolean
    asArray(): A[]
}
declare class Collection<A>{constructor(...items: A[])}