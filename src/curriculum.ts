export type CurriculumModule = {
  id: string
  order: number
  title: string
  subtitle: string
  duration: string
  sectionCount: number
  status: 'available' | 'planned'
  signals: string[]
}

export const essentialCurriculum: CurriculumModule[] = [
  { id: 'arrays', order: 1, title: 'Arrays', subtitle: 'Indexed data, traversal and mutation', duration: '35–45 min', sectionCount: 10, status: 'available', signals: ['index', 'ordered data', 'one pass'] },
  { id: 'strings', order: 2, title: 'Strings', subtitle: 'Character sequences and scanning', duration: '35–45 min', sectionCount: 10, status: 'available', signals: ['characters', 'substring', 'parsing'] },
  { id: 'hash-maps-sets', order: 3, title: 'Hash Maps & Sets', subtitle: 'Fast lookup, counting and membership', duration: '40–45 min', sectionCount: 10, status: 'available', signals: ['fast lookup', 'frequency', 'seen before'] },
  { id: 'two-pointers', order: 4, title: 'Two Pointers', subtitle: 'Eliminate possibilities from two positions', duration: '35–45 min', sectionCount: 10, status: 'available', signals: ['sorted', 'pair', 'opposite ends'] },
  { id: 'sliding-window', order: 5, title: 'Sliding Window', subtitle: 'Maintain a changing contiguous range', duration: '40–45 min', sectionCount: 10, status: 'available', signals: ['contiguous', 'longest', 'fixed window'] },
  { id: 'prefix-sums', order: 6, title: 'Prefix Sums', subtitle: 'Precompute cumulative information', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['range sum', 'many queries', 'cumulative'] },
  { id: 'sorting', order: 7, title: 'Sorting', subtitle: 'Use order to expose structure', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['order', 'ranking', 'grouping'] },
  { id: 'binary-search', order: 8, title: 'Binary Search', subtitle: 'Discard half the search space', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['sorted', 'monotonic', 'target'] },
  { id: 'stacks', order: 9, title: 'Stacks', subtitle: 'Last-in, first-out reasoning', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['most recent', 'nested', 'undo'] },
  { id: 'queues', order: 10, title: 'Queues', subtitle: 'First-in, first-out processing', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['arrival order', 'processing', 'BFS later'] },
  { id: 'linked-lists', order: 11, title: 'Linked Lists', subtitle: 'Nodes connected by references', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['next pointer', 'insertion', 'node'] },
  { id: 'recursion', order: 12, title: 'Recursion', subtitle: 'Solve a problem through smaller copies', duration: '40–45 min', sectionCount: 10, status: 'planned', signals: ['base case', 'subproblem', 'call stack'] },
  { id: 'big-o', order: 13, title: 'Big-O', subtitle: 'Reason about growth and trade-offs', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['scaling', 'time', 'space'] },
]

export const systemDesignCurriculum: CurriculumModule[] = [
  { id: 'http-https', order: 1, title: 'HTTP / HTTPS', subtitle: 'Requests, responses and secure web communication', duration: '35–45 min', sectionCount: 8, status: 'available', signals: ['request/response', 'status codes', 'TLS'] },
  { id: 'tcp-vs-udp', order: 2, title: 'TCP vs UDP', subtitle: 'Reliability, ordering and latency at the transport layer', duration: '35–45 min', sectionCount: 8, status: 'available', signals: ['reliability', 'latency', 'datagrams'] },
  { id: 'dns', order: 3, title: 'DNS', subtitle: 'How domain names become network destinations', duration: '40–45 min', sectionCount: 8, status: 'available', signals: ['resolution', 'records', 'TTL'] },
  { id: 'tls', order: 4, title: 'TLS', subtitle: 'Certificates, encryption and secure connections', duration: '40–45 min', sectionCount: 8, status: 'planned', signals: ['certificate', 'handshake', 'encryption'] },
  { id: 'ip-addresses', order: 5, title: 'IP Addresses', subtitle: 'Addressing hosts across networks', duration: '35–45 min', sectionCount: 8, status: 'planned', signals: ['IPv4', 'IPv6', 'routing'] },
  { id: 'ports', order: 6, title: 'Ports', subtitle: 'How traffic reaches the right process', duration: '30–40 min', sectionCount: 8, status: 'planned', signals: ['443', 'socket', 'endpoint'] },
  { id: 'websockets', order: 7, title: 'WebSockets', subtitle: 'Long-lived two-way communication', duration: '35–45 min', sectionCount: 8, status: 'planned', signals: ['real time', 'persistent connection', 'push'] },
  { id: 'http-versions', order: 8, title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3', subtitle: 'How the web transport stack evolved', duration: '40–45 min', sectionCount: 8, status: 'planned', signals: ['multiplexing', 'QUIC', 'head-of-line'] },
  { id: 'request-lifecycle', order: 9, title: 'Request / Response Lifecycle', subtitle: 'Trace a browser request end to end', duration: '40–45 min', sectionCount: 8, status: 'planned', signals: ['browser', 'server', 'render'] },
  { id: 'proxies', order: 10, title: 'Proxies', subtitle: 'Intermediaries between clients and servers', duration: '35–45 min', sectionCount: 8, status: 'planned', signals: ['forward proxy', 'gateway', 'intermediary'] },
  { id: 'reverse-proxies', order: 11, title: 'Reverse Proxies', subtitle: 'Routing traffic in front of services', duration: '35–45 min', sectionCount: 8, status: 'planned', signals: ['load balancing', 'TLS termination', 'routing'] },
  { id: 'cdns', order: 12, title: 'CDNs', subtitle: 'Serve content close to users', duration: '35–45 min', sectionCount: 8, status: 'planned', signals: ['edge', 'cache', 'latency'] },
]

export const getCurriculumModule = (id: string) => [...essentialCurriculum, ...systemDesignCurriculum].find((module) => module.id === id)
