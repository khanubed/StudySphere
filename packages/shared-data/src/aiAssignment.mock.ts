import {
  AssignmentAnalysisReport,
  GrammarIssue,
  CitationItem,
  WritingScore,
  StructureOutlineNode,
} from '@studysphere/shared-types';

export const mockAssignmentRawText = `Byzantine Fault Tolerance and Distributed Consensus Protocols in Modern Relational Architectures

Abstract
Distributed consensus algorithms ensure data consistency across multiple replica nodes in the presence of arbitrary server failures. Traditional protocols like Paxos and Raft provide crash fault tolerance but fails when Byzantine malicious actors tamper with state transitions. This paper evaluates the throughput and latency trade-offs of Practical Byzantine Fault Tolerance (PBFT) compared to Raft under asynchronous networking workloads.

1. Introduction and Problem Statement
Distributed database systems requires robust consensus mechanisms to prevent split-brain anomalies and data corruption. When a lot of nodes participate in transaction validation, network partitioning causes significant leader election delays. While Raft operates efficiently under benign crash conditions, it assumes that all cluster nodes are honest and authenticated.

2. Related Work and Literature Review
Lamport et al. originally formalized the Byzantine Generals Problem in 1982, demonstrating that 3f + 1 replicas are mathematically required to tolerate f arbitrary failures. Castro and Liskov introduced PBFT to reduce cryptographic overhead from exponential to polynomial time complexity. Recent blockchain and decentralized ledger systems have adopted variations of Tendermint and HotStuff for pipelined consensus.

3. System Architecture and Methodology
Our experimental testbed deploys a 7-node cluster across three geographic cloud regions. Each node executes an in-memory transactional key-value store using Raft or PBFT state machine replication. We measure transactional commit latency, network throughput (transactions per second), and leader failover duration under synthetic Poisson transaction arrival rates.

4. Experimental Results and Evaluation
The experimental benchmarks demonstrate that Raft achieves 14,200 TPS with a mean commit latency of 4.2 milliseconds. In contrast, PBFT achieves 8,400 TPS with a mean commit latency of 11.6 milliseconds due to the three-phase quadratic message complexity O(n^2) during pre-prepare, prepare, and commit rounds.

5. References
[1] L. Lamport, R. Shostak, and M. Pease, "The Byzantine Generals Problem," ACM TOPLAS, 1982.
[2] M. Castro and B. Liskov, "Practical Byzantine Fault Tolerance," in OSDI '99, 1999.
[3] D. Ongaro and J. Ousterhout, "In Search of an Understandable Consensus Algorithm," in USENIX ATC '14, 2014.`;

export const mockGrammarIssues: GrammarIssue[] = [
  {
    id: 'iss-001',
    line: 6,
    originalText: 'but fails when Byzantine malicious actors',
    suggestedText: 'but fail when Byzantine malicious actors',
    category: 'grammar',
    explanation: 'Subject-verb agreement: Plural subject "protocols" requires plural verb "fail" rather than singular "fails".',
    status: 'pending',
  },
  {
    id: 'iss-002',
    line: 9,
    originalText: 'Distributed database systems requires robust',
    suggestedText: 'Distributed database systems require robust',
    category: 'grammar',
    explanation: 'Subject-verb agreement: Plural noun phrase "systems" takes base verb form "require".',
    status: 'pending',
  },
  {
    id: 'iss-003',
    line: 10,
    originalText: 'When a lot of nodes participate',
    suggestedText: 'When numerous nodes participate',
    category: 'tone',
    explanation: 'Academic tone: The colloquial quantifier "a lot of" should be replaced with formal academic phrasing such as "numerous" or "multiple".',
    status: 'pending',
  },
  {
    id: 'iss-004',
    line: 11,
    originalText: 'causes significant leader election delays',
    suggestedText: 'induces substantial leader election latency',
    category: 'style',
    explanation: 'Vocabulary elevation: Using "induces substantial latency" provides higher academic precision in distributed computing papers.',
    status: 'pending',
  },
  {
    id: 'iss-005',
    line: 18,
    originalText: '7-node cluster',
    suggestedText: 'seven-node cluster',
    category: 'style',
    explanation: 'Formatting convention: Numbers below 10 in formal manuscripts should be spelled out as words unless attached to units of measure.',
    status: 'pending',
  },
];

export const mockCitations: CitationItem[] = [
  {
    id: 'cit-001',
    rawText: 'L. Lamport, R. Shostak, and M. Pease, "The Byzantine Generals Problem," ACM TOPLAS, 1982.',
    formattedText: '[1] L. Lamport, R. Shostak, and M. Pease, "The Byzantine Generals Problem," ACM Trans. Program. Lang. Syst., vol. 4, no. 3, pp. 382–401, Jul. 1982, doi: 10.1145/357172.357176.',
    style: 'IEEE',
    missingFields: ['DOI / Page range'],
    isValid: true,
  },
  {
    id: 'cit-002',
    rawText: 'M. Castro and B. Liskov, "Practical Byzantine Fault Tolerance," in OSDI \'99, 1999.',
    formattedText: '[2] M. Castro and B. Liskov, "Practical Byzantine fault tolerance," in Proc. 3rd Symp. Oper. Syst. Des. Implementation (OSDI), 1999, pp. 173–186.',
    style: 'IEEE',
    missingFields: [],
    isValid: true,
  },
  {
    id: 'cit-003',
    rawText: 'D. Ongaro and J. Ousterhout, "In Search of an Understandable Consensus Algorithm," in USENIX ATC \'14, 2014.',
    formattedText: '[3] D. Ongaro and J. Ousterhout, "In search of an understandable consensus algorithm (Raft)," in Proc. 2014 USENIX Annu. Tech. Conf. (USENIX ATC 14), 2014, pp. 305–319.',
    style: 'IEEE',
    missingFields: [],
    isValid: true,
  },
];

export const mockWritingScore: WritingScore = {
  overall: 88,
  readability: 84,
  clarity: 90,
  grammar: 92,
  tone: 82,
  structure: 86,
};

export const mockStructureOutline: StructureOutlineNode[] = [
  { section: 'Title & Abstract', status: 'found' },
  { section: '1. Introduction and Problem Statement', status: 'found' },
  { section: '2. Related Work and Literature Review', status: 'found' },
  { section: '3. System Architecture and Methodology', status: 'found' },
  { section: '4. Experimental Results and Evaluation', status: 'found' },
  {
    section: '5. Discussion & Limitations',
    status: 'missing',
    recommendation: 'Academic journals strongly recommend a dedicated Discussion section detailing fault models and network latency boundaries.',
  },
  { section: '6. References & Bibliography', status: 'found' },
];

export const mockAssignmentReports: AssignmentAnalysisReport[] = [
  {
    id: 'rep-001',
    title: 'Byzantine Fault Tolerance in Distributed Relational Architectures',
    rawText: mockAssignmentRawText,
    wordCount: 286,
    readingTimeMinutes: 1.2,
    tokensUsed: 10,
    citationStyle: 'IEEE',
    writingScore: mockWritingScore,
    grammarIssues: mockGrammarIssues,
    citations: mockCitations,
    structureOutline: mockStructureOutline,
    createdAt: '2026-08-29T16:00:00Z',
    updatedAt: '2026-08-29T16:00:00Z',
  },
];
