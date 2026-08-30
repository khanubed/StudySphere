import { AISummarizerSession } from '@studysphere/shared-types';

export const mockAISummarizerSessions: AISummarizerSession[] = [
  {
    id: 'sum-ses-001',
    userId: 'usr-stu-001',
    title: 'Unit 3: Relational Database Normalization & BCNF Proofs',
    fileName: 'DBMS_Unit3_Normalization_Decomposition.pdf',
    fileSize: 4280000,
    fileType: 'application/pdf',
    totalPages: 24,
    wordCount: 7850,
    depth: 'detailed',
    tokensUsed: 420,
    status: 'completed',
    createdAt: '2026-08-28T10:30:00.000Z',
    updatedAt: '2026-08-28T10:32:15.000Z',
    shortSummary:
      'Database Normalization minimizes data redundancy and eliminates insertion, update, and deletion anomalies. Boyce-Codd Normal Form (BCNF) strictly requires that for every functional dependency X → Y, X must be a superkey. While 3NF guarantees dependency preservation and lossless join, BCNF guarantees lossless join but may not always preserve all functional dependencies.',
    detailedSummary:
      '### Executive Synthesis: Relational Normalization & Functional Dependencies\n\n#### 1. Fundamental Anomalies in Unnormalized Schemas\n- **Redundancy Anomaly**: Storing redundant tuple attributes leads to wasted disk storage and memory cache thrashing.\n- **Update Anomaly**: Updating a single attribute requires scanning and mutating multiple matching tuples; inconsistency occurs if partially executed.\n- **Deletion Anomaly**: Deleting a dependent child record inadvertently deletes the parent attribute entity.\n\n#### 2. Normal Forms Hierarchy & Criteria\n- **First Normal Form (1NF)**: All attribute domains must contain atomic (indivisible) scalar values only. No repeating multi-valued groups.\n- **Second Normal Form (2NF)**: Must be in 1NF and contain NO partial dependencies (non-prime attributes must depend entirely on the whole candidate key, not a proper subset).\n- **Third Normal Form (3NF)**: Must be in 2NF and contain NO transitive dependencies (for $X \\to Y$, either $X$ is a superkey OR $Y$ is a prime attribute).\n- **Boyce-Codd Normal Form (BCNF)**: Stricter than 3NF. For EVERY non-trivial functional dependency $X \\to Y$, $X$ MUST be a superkey. Eliminates anomalies caused by overlapping candidate keys.\n\n#### 3. Lossless Decomposition vs. Dependency Preservation\n- **Lossless Join Theorem**: Decomposition of $R$ into $R_1, R_2$ is lossless if and only if $R_1 \\cap R_2 \\to R_1$ OR $R_1 \\cap R_2 \\to R_2$.\n- **Trade-off Matrix**: BCNF guarantees lossless decomposition but does not guarantee functional dependency preservation. In practice, critical OLTP transactional systems favor 3NF when dependency preservation is mandatory.',
    keyConcepts: [
      {
        term: 'Functional Dependency (FD)',
        definition: 'A formal integrity constraint between two sets of attributes X and Y in relation R, denoted X → Y, where identical values of X strictly determine identical values of Y.',
        examRelevance: 'high',
        pageReference: 3,
      },
      {
        term: 'Boyce-Codd Normal Form (BCNF)',
        definition: 'A relational schema where for every non-trivial functional dependency X → Y, X is strictly a superkey of the relation.',
        examRelevance: 'high',
        pageReference: 12,
      },
      {
        term: 'Lossless-Join Decomposition',
        definition: 'A property ensuring that natural join on decomposed sub-relations reconstructs the exact original relation without producing spurious tuples.',
        examRelevance: 'high',
        pageReference: 16,
      },
      {
        term: 'Transitive Dependency',
        definition: 'A condition where functional dependency X → Z holds by virtue of X → Y and Y → Z, where Y is neither a candidate key nor a subset of X.',
        examRelevance: 'medium',
        pageReference: 8,
      },
      {
        term: 'Candidate Key',
        definition: 'A minimal superkey—a set of attributes that uniquely identifies tuples such that no proper subset has the uniqueness property.',
        examRelevance: 'high',
        pageReference: 5,
      },
    ],
    formulas: [
      {
        id: 'f-01',
        title: 'Lossless Join Condition',
        latex: '(R_1 \\cap R_2 \\to R_1) \\lor (R_1 \\cap R_2 \\to R_2)',
        explanation: 'Decomposition of relation R into R1 and R2 is lossless if the intersection of their attribute schemas forms a superkey for at least one of the relations.',
        variables: [
          { symbol: 'R_1, R_2', name: 'Decomposed sub-relations', unit: 'Schemas' },
          { symbol: '\\cap', name: 'Attribute intersection', unit: 'Set' },
          { symbol: '\\to', name: 'Functional dependency determination' },
        ],
      },
      {
        id: 'f-02',
        title: 'Closure of Attribute Set X (X+)',
        latex: 'X^+ = \\{ A \\mid F \\models X \\to A \\}',
        explanation: 'The set of all attributes functionally determined by X under the given set of functional dependencies F.',
        variables: [
          { symbol: 'X^+', name: 'Attribute Closure of X' },
          { symbol: 'F', name: 'Given Functional Dependency Set' },
        ],
      },
    ],
    flashcards: [
      {
        id: 'fc-01',
        front: 'What is the strict condition for a relation R with functional dependencies F to be in BCNF?',
        back: 'For every non-trivial functional dependency X → Y in F, X must be a superkey of R.',
        tag: 'BCNF Rule',
        mastered: true,
      },
      {
        id: 'fc-02',
        front: 'What is the key difference between 3NF and BCNF regarding dependency conditions?',
        back: 'In 3NF, for X → Y, either X is a superkey OR Y is a prime attribute. In BCNF, X MUST be a superkey (the prime attribute exemption is removed).',
        tag: '3NF vs BCNF',
        mastered: false,
      },
      {
        id: 'fc-03',
        front: 'Can every relational schema be decomposed into BCNF while simultaneously preserving all functional dependencies?',
        back: 'No. BCNF decomposition always guarantees Lossless Join, but it does NOT always guarantee Dependency Preservation.',
        tag: 'Decomposition Theorems',
        mastered: true,
      },
      {
        id: 'fc-04',
        front: 'How do you test if a decomposition of R into R1 and R2 is Lossless?',
        back: 'Compute (R1 ∩ R2)+. If (R1 ∩ R2)+ contains all attributes of R1 or all attributes of R2, the decomposition is lossless.',
        tag: 'Lossless Algorithm',
        mastered: false,
      },
    ],
    questions: [
      {
        id: 'q-01',
        type: 'short',
        question: 'Define partial dependency with an illustrative example.',
        marks: 2,
        modelAnswer:
          'A partial dependency occurs when a non-prime attribute is functionally dependent on only a part of a composite candidate key rather than the entire key. Example: In relation R(StudentID, CourseID, StudentName), StudentName depends only on StudentID, which is a proper subset of candidate key {StudentID, CourseID}.',
        keyPoints: [
          'Occurs with composite candidate keys',
          'Violates 2nd Normal Form',
          'Eliminated by projecting into independent relation',
        ],
      },
      {
        id: 'q-02',
        type: 'long',
        question:
          'Consider relation R(A, B, C, D, E) with FDs: {A -> BC, CD -> E, B -> D, E -> A}. Find all candidate keys and determine the highest normal form of R.',
        marks: 10,
        modelAnswer:
          'Step 1: Compute attribute closures. Closure of (A)+ = {A, B, C, D, E}. Closure of (E)+ = {E, A, B, C, D}. Closure of (CD)+ = {C, D, E, A, B}. Closure of (BC)+ = {B, C, D, E, A}. Candidate Keys are: {A}, {E}, {BC}, {CD}. Prime attributes: {A, B, C, D, E}. Since all attributes are prime, R is trivially in 3NF. Check BCNF: in B -> D, B is not a superkey. Therefore, the highest normal form of R is 3NF.',
        keyPoints: [
          'Candidate keys: {A}, {E}, {BC}, {CD}',
          'All attributes are prime -> 3NF holds',
          'B -> D violates BCNF -> Highest normal form is 3NF',
        ],
      },
      {
        id: 'q-03',
        type: 'viva',
        question: 'Why would an enterprise database architect intentionally choose 3NF over BCNF for an OLTP banking system?',
        marks: 5,
        modelAnswer:
          'In OLTP banking systems, integrity enforcement on every update/insert must be microsecond-fast. If dependencies are not preserved in BCNF, verifying cross-table constraints requires expensive multi-table joins. 3NF guarantees dependency preservation, allowing localized single-table validation at the cost of minor, controlled redundancy.',
        keyPoints: [
          'Cross-table join overhead during constraint validation',
          'Dependency preservation ensures atomic row-level checks',
          'Controlled trade-off between join performance and redundancy',
        ],
      },
    ],
    mindMap: {
      id: 'mm-root',
      label: 'Relational Database Normalization',
      tag: 'Core Paradigm',
      children: [
        {
          id: 'mm-1',
          label: 'Anomalies (Problem Space)',
          children: [
            { id: 'mm-1a', label: 'Insertion Anomaly (Null requirements)' },
            { id: 'mm-1b', label: 'Deletion Anomaly (Loss of side data)' },
            { id: 'mm-1c', label: 'Update Anomaly (Data divergence)' },
          ],
        },
        {
          id: 'mm-2',
          label: 'Functional Dependencies',
          children: [
            { id: 'mm-2a', label: 'Trivial vs Non-Trivial FDs' },
            { id: 'mm-2b', label: "Armstrong's Axioms (Reflexivity, Augmentation, Transitivity)" },
            { id: 'mm-2c', label: 'Attribute Closure Algorithm (X+)' },
          ],
        },
        {
          id: 'mm-3',
          label: 'Normal Forms Hierarchy',
          children: [
            { id: 'mm-3a', label: '1NF: Atomic Domains Only' },
            { id: 'mm-3b', label: '2NF: No Partial Dependencies' },
            { id: 'mm-3c', label: '3NF: No Transitive Dependencies' },
            { id: 'mm-3d', label: 'BCNF: All Determinants are Superkeys' },
          ],
        },
        {
          id: 'mm-4',
          label: 'Decomposition Properties',
          children: [
            { id: 'mm-4a', label: 'Lossless Join Property (Mandatory)' },
            { id: 'mm-4b', label: 'Dependency Preservation (Desirable)' },
          ],
        },
      ],
    },
  },
  {
    id: 'sum-ses-002',
    userId: 'usr-stu-001',
    title: 'Operating Systems: Virtual Memory & Page Replacement Algorithms',
    fileName: 'OS_VirtualMemory_Paging_TLB.pdf',
    fileSize: 3100000,
    fileType: 'application/pdf',
    totalPages: 18,
    wordCount: 5600,
    depth: 'standard',
    tokensUsed: 310,
    status: 'completed',
    createdAt: '2026-08-27T14:15:00.000Z',
    updatedAt: '2026-08-27T14:17:00.000Z',
    shortSummary:
      'Virtual memory provides an illusion of vast contiguous address spaces. Page tables map logical addresses to physical frames. Page faults trigger disk I/O. Optimal page replacement (Belady) provides a theoretical lower bound, while LRU and Clock approximations are utilized in production kernels.',
    detailedSummary:
      '### Virtual Memory Architecture & Paging Mechanisms\n\n1. **Hardware Memory Management Unit (MMU)**: Logical address is split into page number (p) and page offset (d).\n2. **Translation Lookaside Buffer (TLB)**: High-speed associative hardware cache. TLB Hit gives instant physical frame; TLB Miss triggers hierarchical page table walk.\n3. **Page Replacement Algorithms**:\n   - **FIFO**: Simple queue, but suffers from Belady’s Anomaly (increasing frame count can increase page faults).\n   - **LRU (Least Recently Used)**: Replaces page unused for longest time. Optimal in stack properties, implemented via hardware reference bits or clock algorithms.\n   - **Optimal (OPT)**: Replaces page that will not be used for longest future duration. Serves as theoretical benchmark.',
    keyConcepts: [
      {
        term: 'Translation Lookaside Buffer (TLB)',
        definition: 'A specialized hardware associative cache storing recent virtual-to-physical address translations to accelerate memory access.',
        examRelevance: 'high',
        pageReference: 4,
      },
      {
        term: "Belady's Anomaly",
        definition: 'The phenomenon where allocating more physical page frames to a process paradoxically increases the number of page faults under FIFO replacement.',
        examRelevance: 'high',
        pageReference: 11,
      },
      {
        term: 'Thrashing',
        definition: 'A state where the CPU spends significantly more time swapping pages between main memory and swap space than executing application instructions.',
        examRelevance: 'high',
        pageReference: 15,
      },
    ],
    formulas: [
      {
        id: 'f-os-01',
        title: 'Effective Memory Access Time (EMAT)',
        latex: 'EMAT = h \\cdot (t_{TLB} + t_m) + (1 - h) \\cdot (t_{TLB} + 2t_m)',
        explanation: 'Average time required to access a memory location considering TLB hit ratio h, TLB search time t_TLB, and main memory access latency t_m.',
        variables: [
          { symbol: 'h', name: 'TLB Hit Ratio', unit: '0.0 - 1.0' },
          { symbol: 't_{TLB}', name: 'TLB lookup latency', unit: 'ns' },
          { symbol: 't_m', name: 'RAM access latency', unit: 'ns' },
        ],
      },
    ],
    flashcards: [
      {
        id: 'fc-os-01',
        front: "Which page replacement algorithm suffers from Belady's Anomaly?",
        back: 'FIFO (First-In, First-Out) Page Replacement Algorithm.',
        tag: 'OS Anomalies',
        mastered: true,
      },
      {
        id: 'fc-os-02',
        front: 'What is the working set model used for in virtual memory?',
        back: 'It defines the set of pages a process is actively referencing during a time window Δ to prevent system thrashing.',
        tag: 'Working Set Model',
        mastered: false,
      },
    ],
    questions: [
      {
        id: 'q-os-01',
        type: 'short',
        question: 'What happens during a Page Fault Interrupt in an OS?',
        marks: 2,
        modelAnswer:
          'When an unmapped or invalid page is accessed, the MMU raises a page fault trap. The OS kernel saves process context, locates the desired page in secondary swap storage, loads it into an available physical RAM frame, updates the page table entry to valid, and restarts the faulting CPU instruction.',
        keyPoints: [
          'Hardware MMU trap raised',
          'Disk I/O loads missing frame into RAM',
          'Page table updated & instruction restarted',
        ],
      },
    ],
    mindMap: {
      id: 'mm-os-root',
      label: 'Virtual Memory & Paging',
      tag: 'Kernel Subsystem',
      children: [
        {
          id: 'mm-os-1',
          label: 'Address Translation',
          children: [
            { id: 'mm-os-1a', label: 'Logical (Page, Offset)' },
            { id: 'mm-os-1b', label: 'TLB Associative Lookup' },
            { id: 'mm-os-1c', label: 'Multi-Level Page Tables' },
          ],
        },
        {
          id: 'mm-os-2',
          label: 'Page Replacement Algorithms',
          children: [
            { id: 'mm-os-2a', label: 'FIFO & Belady Anomaly' },
            { id: 'mm-os-2b', label: 'LRU & Clock Approximations' },
            { id: 'mm-os-2c', label: 'Optimal Benchmark' },
          ],
        },
      ],
    },
  },
];
