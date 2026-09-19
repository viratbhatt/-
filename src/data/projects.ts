export type Project = {
  title: string
  category: string
  summary: string
  description: string
  technologies: string[]
  problem: string
  role: string
  approach: string
  architecture: string
  challenges: string[]
  learnings: string[]
  links?: {
    github?: string
    live?: string
  }
}

export const projects: Project[] = [
  {
    title: 'Local AI Knowledge Assistant',
    category: 'AI systems',
    summary:
      'A local-first AI assistant exploring RAG, streaming responses, and operational simplicity in a modern React + Spring Boot application.',
    description:
      'A local-first AI assistant built with React, Spring Boot, Python services, and Ollama, exploring retrieval-augmented generation, streaming interactions, and practical AI application architecture.',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'Python', 'Ollama', 'RAG'],
    problem:
      'The goal was to design an AI application that felt responsive and useful without depending on external cloud services for every interaction.',
    role: 'Senior engineer leading frontend architecture, system design, and AI integration patterns.',
    approach:
      'I designed a lightweight frontend for conversational UX, paired it with backend orchestration for retrieval and context assembly, and kept the stack intentionally local-first for experimentation and reliability.',
    architecture:
      'React frontend + TypeScript interfaces + Spring Boot API + Python service + Ollama model runtime + retrieval pipeline for local document context.',
    challenges: [
      'Balancing streaming UX with manageable backend latency.',
      'Structuring retrieval and context assembly so the assistant stayed grounded.',
      'Creating a clean developer workflow for local experimentation without brittle dependencies.'
    ],
    learnings: [
      'Local AI systems are highly usable when the orchestration layer is simple and deliberate.',
      'The best AI interfaces are clear, honest, and fast enough to feel natural.'
    ],
    links: {
      github: undefined,
      live: undefined,
    },
  },
  {
    title: 'AWS Cloud Learning Platform',
    category: 'Cloud engineering',
    summary:
      'A full-stack learning platform for exploring AWS services locally with Spring Boot, SDK integrations, and cloud-native local emulation.',
    description:
      'A full-stack application for exploring AWS services locally using Spring Boot, AWS SDK, LocalStack, DynamoDB, S3, SQS, SNS, and Lambda.',
    technologies: ['Java', 'Spring Boot', 'AWS SDK', 'DynamoDB', 'S3', 'SQS', 'SNS', 'LocalStack'],
    problem:
      'Cloud education and experimentation often feel disconnected from the real operational realities of AWS workflows and dependencies.',
    role: 'Full-stack engineer owning platform design, backend services, and developer experience.',
    approach:
      'I built a local-first AWS sandbox so teams could explore service behaviour, payload flows, and integration patterns without requiring a full cloud footprint.',
    architecture:
      'Spring Boot application layer with AWS SDK clients, LocalStack-backed services, and a developer-friendly interface for service orchestration and testing.',
    challenges: [
      'Modeling event-driven flows across SQS, SNS, and local storage services.',
      'Keeping the environment reproducible for developers and learners.',
      'Designing interfaces that revealed complexity without making the platform feel opaque.'
    ],
    learnings: [
      'Locally emulated cloud infrastructure is a powerful tool for building confidence before deployment.',
      'Developer clarity matters as much as technical correctness in distributed systems.'
    ],
    links: {
      github: undefined,
      live: undefined,
    },
  },
  {
    title: 'Payment Experience Platform',
    category: 'Frontend architecture',
    summary:
      'A modular frontend engineering project focused on reusable components, payment workflows, and scalable navigation experiences.',
    description:
      'A modular frontend engineering project focused on reusable components, micro-frontends, payment workflows, and scalable navigation experiences.',
    technologies: ['React', 'TypeScript', 'JavaScript', 'Micro-frontends'],
    problem:
      'Payment and checkout experiences are complex enough that a fragmented frontend quickly becomes brittle and hard to evolve.',
    role: 'Frontend architect focused on reusable patterns, navigation composition, and interface consistency.',
    approach:
      'I separated the experience into modular, reusable surfaces and centered the work around clarity, extensibility, and resilient component composition.',
    architecture:
      'A composable frontend with modular domain sections, shared component primitives, and a navigation model that preserved context during workflow transitions.',
    challenges: [
      'Maintaining product clarity while supporting a growing set of workflows.',
      'Designing reusable interaction primitives without losing the feeling of a cohesive experience.',
      'Making the platform resilient to future feature additions without major rework.'
    ],
    learnings: [
      'Good frontend architecture shows up in the product long before it is visible in a diagram.',
      'Strong design systems reduce cognitive load and help teams move faster with less risk.'
    ],
    links: {
      github: undefined,
      live: undefined,
    },
  },
]
