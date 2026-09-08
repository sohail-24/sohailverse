import type { LearningPathStage, FeaturedVideo, DevOpsNote } from "../types/devops";

export const learningPathStages: LearningPathStage[] = [
  {
    id: "notes",
    stepNumber: 1,
    title: "Notes",
    subtitle: "Key concepts, commands and diagrams",
    accentColor: "purple",
    chips: [
      { label: "Quick Notes", iconName: "book" },
      { label: "Cheat Sheets", iconName: "terminal" },
      { label: "Diagrams", iconName: "file" },
    ],
    summary:
      "Sohail's personal engineering notebook and curated quick-reference guides. High-yield cheat sheets, CLI syntax, network diagrams, and cloud architectures.",
    mentalModel: "PROBLEM → QUICK CHEAT SHEET → COPY COMMAND → RUNBOOK",
    architectureDiagram: `
┌─────────────────────────────────────────────────────────────┐
│                 ENGINEERING NOTEBOOK                         │
├───────────────────┬───────────────────┬─────────────────────┤
│ Networking Notes  │ AWS Cloud Notes   │ DevOps & Linux      │
│ CIDR, DNS, Ports  │ IAM, VPC, S3, EC2 │ Containers, Git, CI │
└───────────────────┴───────────────────┴─────────────────────┘
    `,
    coreConcepts: [
      {
        topic: "Quick Notes & Architecture",
        description: "Direct summaries of networking, cloud topologies, and container lifecycles.",
        details: [
          "Curated notes explaining complex systems without academic jargon",
          "Visual ASCII and architecture diagrams of zero-trust networks",
          "Production checklists for deploying workloads reliably",
        ],
      },
      {
        topic: "Commands & Cheat Sheets",
        description: "Field-tested CLI commands for fast terminal diagnostics and day-to-day operations.",
        details: [
          "Network troubleshooting: curl, dig, netstat, tcpdump",
          "Docker runtime: build, inspect, exec, networks, volumes",
          "Kubernetes cluster inspection: kubectl get, logs, exec, rollout",
        ],
      },
    ],
    essentialCommands: [
      {
        command: "curl -Iv https://sohailverse.dev",
        explanation: "Quick test of TLS handshake, server response codes, and HTTP response headers.",
      },
      {
        command: "kubectl get events --sort-by='.metadata.creationTimestamp'",
        explanation: "Troubleshoot cluster issues and container crashes in real-time chronological order.",
      },
    ],
  },
  {
    id: "networking",
    stepNumber: 2,
    title: "Networking",
    subtitle: "Understand how the internet works",
    accentColor: "cyan",
    chips: [
      { label: "IP, DNS, Subnet", iconName: "monitor" },
      { label: "Firewalls", iconName: "shield" },
      { label: "Real Examples", iconName: "network" },
    ],
    summary:
      "Every cloud service, server, and container relies on networking fundamentals. Once you grasp IP addresses, subnets, routing, and ports, cloud computing and Kubernetes orchestration become second nature.",
    mentalModel: "YOU → ROUTER → INTERNET → SERVER",
    architectureDiagram: `
┌─────────┐      ┌─────────┐      ┌────────────┐      ┌─────────┐
│ Client  │ ──── │ Router  │ ──── │  Internet  │ ──── │ Server  │
│ Browser │      │ Gateway │      │ DNS + BGP  │      │ (Port)  │
└─────────┘      └─────────┘      └────────────┘      └─────────┘
   192.168.1.5     192.168.1.1        Public IP          443 / 80
    `,
    coreConcepts: [
      {
        topic: "IP Addressing & CIDR",
        description:
          "Unique addresses identifying devices. IPv4 (32-bit, e.g. 192.168.1.1) and IPv6 (128-bit).",
        details: [
          "Private IP Ranges: 10.0.0.0/8 (Enterprise), 172.16.0.0/12 (Containers), 192.168.0.0/16 (Home/Local)",
          "CIDR Math: /24 gives 256 addresses (251 usable in AWS VPC), /16 gives 65,536 addresses",
          "Public IPs route across the global internet; Private IPs require NAT to communicate externally",
        ],
      },
      {
        topic: "DNS Resolution Flow",
        description:
          "The phonebook of the web. Translates human-friendly names (sohaildevops.com) into machine IPs.",
        details: [
          "Resolution Chain: Browser Cache → OS Resolver → Recursive Resolver → Root Nameserver (.) → TLD Nameserver (.com) → Authoritative Nameserver",
          "Core Record Types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification)",
          "TTL (Time To Live): Dictates how long intermediate resolvers cache the query answer",
        ],
      },
      {
        topic: "Ports, TCP & UDP",
        description:
          "Ports direct traffic to specific applications running on a server. Transport protocols define delivery rules.",
        details: [
          "TCP (Transmission Control Protocol): Connection-oriented, 3-way handshake (SYN, SYN-ACK, ACK), guaranteed in-order delivery. Used by HTTP/HTTPS, SSH.",
          "UDP (User Datagram Protocol): Fast, connectionless, no retransmission. Ideal for DNS queries, video streaming, VoIP.",
          "Standard Ports: HTTP (80), HTTPS (443), SSH (22), DNS (53), PostgreSQL (5432), MySQL (3306)",
        ],
      },
      {
        topic: "Firewalls, NAT & Security Groups",
        description:
          "Traffic filtering and address translation ensuring internal workloads remain protected.",
        details: [
          "Stateful vs Stateless: Security Groups are stateful (return traffic automatically allowed); NACLs are stateless (both ingress and egress must be defined)",
          "NAT Gateways: Allows private subnet instances to fetch security updates from the internet while blocking unsolicited incoming traffic",
        ],
      },
    ],
    essentialCommands: [
      {
        command: "dig example.com +trace",
        explanation: "Traces the recursive DNS lookup step-by-step from root servers down to the authoritative answer.",
      },
      {
        command: "curl -Iv https://example.com",
        explanation: "Inspects HTTP headers, TLS certificate negotiation, and response status without downloading body content.",
      },
      {
        command: "netstat -tuln",
        explanation: "Lists all currently open listening TCP/UDP ports and sockets on your local Linux machine.",
      },
      {
        command: "traceroute -n 8.8.8.8",
        explanation: "Shows each intermediate network router hop and round-trip latency to the target destination.",
      },
    ],
  },
  {
    id: "aws",
    stepNumber: 3,
    title: "AWS",
    subtitle: "Explore cloud and core services",
    accentColor: "orange",
    chips: [
      { label: "EC2, S3, RDS", iconName: "cloud" },
      { label: "IAM & Security", iconName: "lock" },
      { label: "Hands-on Labs", iconName: "flask" },
    ],
    summary:
      "AWS provides on-demand cloud infrastructure at global scale. Rather than racking physical hardware, you provision resilient compute, object storage, virtual networks, and managed databases with security built in.",
    mentalModel: "USER → CLOUDFRONT → ALB / EC2 → RDS / S3",
    architectureDiagram: `
┌────────┐     ┌────────────┐     ┌─────────┐     ┌───────────┐
│ User   │ ──► │ CloudFront │ ──► │ ALB     │ ──► │ EC2 Fleet │
│ Client │     │ CDN Edge   │     │ (VPC)   │     │ (Autoscale)
└────────┘     └────────────┘     └─────────┘     └─────┬─────┘
                                                        │
                                          ┌─────────────┴─────────────┐
                                          ▼                           ▼
                                    ┌───────────┐               ┌───────────┐
                                    │ RDS (SQL) │               │ S3 Bucket │
                                    └───────────┘               └───────────┘
    `,
    coreConcepts: [
      {
        topic: "Virtual Private Cloud (VPC)",
        description:
          "Your isolated slice of the AWS network. Enforces network boundaries, segmentation, and routing.",
        details: [
          "Public Subnets: Have a route to an Internet Gateway (IGW); used for load balancers and bastion hosts",
          "Private Subnets: No direct internet route; houses sensitive databases and application servers",
          "Multi-AZ Architecture: Spreading subnets across 2+ Availability Zones ensures high availability",
        ],
      },
      {
        topic: "Compute & Storage (EC2 & S3)",
        description:
          "The foundational building blocks of cloud compute and virtually unlimited object storage.",
        details: [
          "EC2 Instances: Virtual servers running Linux/Windows. Sized by vCPU, memory, and network throughput",
          "EBS Volumes: Block storage attached to EC2 instances for OS and stateful files",
          "S3 (Simple Storage Service): 99.999999999% durability object storage with static hosting and lifecycle archival",
        ],
      },
      {
        topic: "IAM & Security Governance",
        description:
          "Controls authentication and authorization across every AWS API and resource.",
        details: [
          "Principle of Least Privilege: Grant only the exact permissions needed, never broad wildcard AdministratorAccess",
          "IAM Roles: Temporary credential tokens assumed by EC2 instances or Lambda functions without storing hardcoded keys",
          "MFA Enforcement: Mandatory Multi-Factor Authentication on root and privileged accounts",
        ],
      },
      {
        topic: "Managed Databases & Observability",
        description:
          "Offloading database operational overhead while monitoring performance and costs.",
        details: [
          "Amazon RDS: Automated patching, automated snapshots, read replicas, and Multi-AZ synchronous standby failover",
          "CloudWatch: Centralized metrics, log streams, and threshold alarms that trigger autoscaling",
        ],
      },
    ],
    essentialCommands: [
      {
        command: "aws s3 ls",
        explanation: "Lists all Amazon S3 buckets currently provisioned under your active AWS account credentials.",
      },
      {
        command: "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]'",
        explanation: "Outputs a formatted table of all EC2 instances, their runtime states, and assigned public IPs.",
      },
      {
        command: "aws sts get-caller-identity",
        explanation: "Returns the AWS Account ID, IAM User or Role ARN currently active in your shell environment.",
      },
      {
        command: "aws route53 list-hosted-zones",
        explanation: "Lists all public and private Route53 DNS zones managed in your infrastructure.",
      },
    ],
  },
  {
    id: "devops",
    stepNumber: 4,
    title: "DevOps",
    subtitle: "Bring it all together",
    accentColor: "lime",
    chips: [
      { label: "Linux, Git, Docker", iconName: "terminal" },
      { label: "CI/CD", iconName: "git" },
      { label: "Kubernetes", iconName: "k8s" },
    ],
    summary:
      "DevOps bridges software development and system stability. By combining version control, containerization, automated CI/CD pipelines, and declarative GitOps, teams ship high-quality code rapidly and reliably.",
    mentalModel: "CODE → GIT → BUILD → TEST → CONTAINERIZE → CI/CD → DEPLOY → MONITOR → AUTOMATE",
    architectureDiagram: `
┌───────┐      ┌───────┐      ┌────────┐      ┌─────────────┐      ┌────────────┐
│ Code  │ ───► │ Git   │ ───► │ CI/CD  │ ───► │ Container   │ ───► │ Kubernetes │
│ Repo  │      │ Push  │      │ GitHub │      │ Docker Hub  │      │ Cluster    │
└───────┘      └───────┘      └────────┘      └─────────────┘      └─────┬──────┘
                                                                         │
                                                             ┌───────────┴───────────┐
                                                             ▼                       ▼
                                                       ┌───────────┐           ┌───────────┐
                                                       │ ArgoCD    │           │ Grafana   │
                                                       │ (GitOps)  │           │ (Metrics) │
                                                       └───────────┘           └───────────┘
    `,
    coreConcepts: [
      {
        topic: "Linux & Shell Automation",
        description:
          "The engine powering cloud infrastructure. Mastery of process management, permissions, and bash automation.",
        details: [
          "File permissions (chmod, chown) and POSIX access controls",
          "Systemd service units for keeping daemons alive across reboots",
          "Text wrangling with grep, awk, sed, and piping streams",
        ],
      },
      {
        topic: "Containers & Docker",
        description:
          "Packaging applications with all dependencies into lightweight, immutable, reproducible execution environments.",
        details: [
          "Dockerfile Optimization: Multi-stage builds, non-root users, leveraging build cache layers",
          "Containers vs VMs: Shared OS kernel, millisecond startup times, near-zero overhead",
          "Container Networking & Volumes: Bridge networks, DNS service discovery, and persistent storage mounts",
        ],
      },
      {
        topic: "CI/CD Pipelines",
        description:
          "Automated pipelines testing, building, scanning, and deploying code on every pull request.",
        details: [
          "Automated linting and unit test execution on pull request creation",
          "Security vulnerability scanning of container images (Trivy, Snyk)",
          "Automated release tagging, semantic versioning, and container registry publishing",
        ],
      },
      {
        topic: "Kubernetes & GitOps",
        description:
          "Production container orchestration ensuring self-healing, rolling updates, and declarative drift correction.",
        details: [
          "Pods, Deployments, ReplicaSets: Desired state reconciliation and zero-downtime rolling updates",
          "Services & Ingress: Routing traffic into pods via ClusterIP, NodePort, and LoadBalancers",
          "GitOps with ArgoCD: Git is the single source of truth; any cluster drift is automatically reverted",
        ],
      },
    ],
    essentialCommands: [
      {
        command: "docker build -t app:v1 . && docker run -d -p 8080:80 app:v1",
        explanation: "Builds a Docker image using local Dockerfile and launches it in background with port 80 mapped to 8080.",
      },
      {
        command: "kubectl get pods -A -o wide",
        explanation: "Inspects all running pods across all namespaces including node assignment and IP details.",
      },
      {
        command: "kubectl rollout status deployment/my-app",
        explanation: "Monitors the real-time progress of a Kubernetes zero-downtime deployment rolling update.",
      },
      {
        command: "terraform plan && terraform apply",
        explanation: "Declaratively reviews proposed cloud infrastructure changes and reconciles actual state with code.",
      },
    ],
  },
  {
    id: "learn-test-projects",
    stepNumber: 5,
    title: "Learn & Test Projects",
    subtitle: "Build real projects and test your skills",
    accentColor: "amber",
    chips: [
      { label: "Guided Projects", iconName: "code" },
      { label: "Quizzes & Tests", iconName: "check" },
      { label: "Track Progress", iconName: "chart" },
    ],
    summary:
      "Transform knowledge into practical capability. Deploy real cloud architectures, containerize microservices, run automated tests, and track your milestone progress.",
    mentalModel: "LEARN → PRACTICE → BUILD → TEST → GROW",
    architectureDiagram: `
┌─────────────────────────────────────────────────────────────┐
│                  HANDS-ON PRACTICE LABS                     │
├───────────────────┬───────────────────┬─────────────────────┤
│ Static Web on S3  │ Kubernetes Deploy │ CI/CD GitHub Action │
│ CloudFront + SSL  │ ReplicaSets & SVC │ Automated Pipeline  │
└───────────────────┴───────────────────┴─────────────────────┘
    `,
    coreConcepts: [
      {
        topic: "Guided Projects",
        description: "Real production deployments designed with zero guesswork.",
        details: [
          "Deploy static websites with S3 and CloudFront global CDN distribution",
          "Containerize web services with Docker and orchestrate on Kubernetes",
          "Implement declarative CI/CD workflows and automated health checks",
        ],
      },
      {
        topic: "Quizzes, Tests & Progress",
        description: "Validate your mastery through hands-on terminal exercises and conceptual quizzes.",
        details: [
          "Interactive quizzes embedded directly inside each learning stage",
          "Real-time terminal command verification against simulated servers",
          "Persistent tracking of completed paths, projects, and notes",
        ],
      },
    ],
    essentialCommands: [
      {
        command: "terraform apply -auto-approve",
        explanation: "Provisions declarative cloud infrastructure with automated state reconciliation.",
      },
      {
        command: "docker compose up -d --build",
        explanation: "Builds and launches a full multi-tier microservices environment locally with a single command.",
      },
    ],
  },
];

export const featuredVideos: FeaturedVideo[] = [
  {
    id: "ip-address-explained",
    title: "What is an IP Address?",
    category: "Networking",
    duration: "12:34",
    thumbnailStyle: "network",
    description:
      "A complete, beginner-friendly walkthrough of IP addressing. Learn how devices talk across networks, why subnets matter, and what happens when you type an address into your browser.",
    takeaway:
      "IP addresses are digital home addresses for computers. Understanding IPv4, private ranges, and CIDR is the secret key to designing clean AWS VPCs and Kubernetes pod networks.",
    chapters: [
      { timestamp: "00:00", title: "Introduction & The Postal Mailbox Analogy" },
      { timestamp: "02:40", title: "IPv4 Anatomy & The 4 Octets (0-255)" },
      { timestamp: "05:15", title: "Public vs Private IP Ranges (RFC 1918)" },
      { timestamp: "08:50", title: "Subnetting & CIDR Math (/24 vs /16)" },
      { timestamp: "11:10", title: "Quick Terminal Commands for Engineers" },
    ],
    keyCommands: ["ip addr show", "ping -c 4 8.8.8.8", "ip route show", "curl ifconfig.me"],
  },
  {
    id: "aws-in-10-minutes",
    title: "AWS in 10 Minutes",
    category: "AWS",
    duration: "15:20",
    thumbnailStyle: "aws",
    description:
      "Cut through the marketing noise and grasp the core anatomy of AWS. Explore global regions, EC2 virtual servers, S3 storage buckets, and IAM security in a concise visual lesson.",
    takeaway:
      "The cloud is just someone else's computer with an API. AWS becomes simple when you view it as 4 core pillars: Compute (EC2), Storage (S3), Networking (VPC), and Security (IAM).",
    chapters: [
      { timestamp: "00:00", title: "What is Cloud Computing Really?" },
      { timestamp: "03:10", title: "AWS Global Footprint: Regions & AZs" },
      { timestamp: "06:30", title: "Launching Your First EC2 Instance" },
      { timestamp: "10:15", title: "Storing & Serving Files with Amazon S3" },
      { timestamp: "13:40", title: "AWS Free Tier Budget Alarms & Cost Guardrails" },
    ],
    keyCommands: [
      "aws sts get-caller-identity",
      "aws ec2 describe-instances",
      "aws s3 ls",
      "aws s3 mb s3://my-unique-bucket-name",
    ],
  },
  {
    id: "docker-explained-simply",
    title: "Docker Explained Simply",
    category: "DevOps",
    duration: "14:10",
    thumbnailStyle: "docker",
    description:
      "Eliminate 'it works on my machine' once and for all. Understand what containers are, how they differ from VMs, and how to write production-ready Dockerfiles with multi-stage builds.",
    takeaway:
      "Containers isolate your application process and its exact OS dependencies into a lightweight package that runs identically on your laptop, CI server, or Kubernetes cluster.",
    chapters: [
      { timestamp: "00:00", title: "The 'It Works on My Machine' Dilemma" },
      { timestamp: "02:50", title: "Containers vs Heavy Virtual Machines" },
      { timestamp: "05:30", title: "Writing Your First Dockerfile" },
      { timestamp: "09:10", title: "Port Mapping, Volumes & Data Persistence" },
      { timestamp: "12:00", title: "Multi-Stage Builds to Shrink Image Size" },
    ],
    keyCommands: [
      "docker build -t myapp:1.0 .",
      "docker run -d -p 80:80 myapp:1.0",
      "docker ps -a",
      "docker logs -f <container_id>",
    ],
  },
];

export const devopsNotes: DevOpsNote[] = [
  {
    id: "networking-notes",
    title: "Networking Notes",
    subtitle: "Key concepts, commands and diagrams.",
    category: "Networking",
    accentColor: "pink",
    tags: ["CIDR", "DNS", "Ports", "TCP/UDP", "Firewalls"],
    lastUpdated: "Updated 2026",
    summary:
      "Sohail's curated engineering notes on computer networking, OSI layers, IP routing, subnet calculators, and network diagnostics for cloud and DevOps engineers.",
    keyPrinciples: [
      "Always design VPCs with non-overlapping CIDR blocks to permit future peering and transit gateways.",
      "Security Groups should never expose port 22 (SSH) or 3389 (RDP) directly to 0.0.0.0/0.",
      "Use TTL of 300 seconds during active DNS migrations, increasing to 86400 once stable.",
      "TCP SYN retransmission timeouts are almost always security group / firewall drops, not application bugs.",
    ],
    cheatSheets: [
      {
        title: "CIDR Quick Reference Table",
        snippet: `/32 = 1 IP (Single Host)
/30 = 4 IPs (Point-to-Point Links)
/28 = 16 IPs (Small Subnet)
/24 = 256 IPs (Standard App Subnet, 251 usable in AWS)
/20 = 4,096 IPs
/16 = 65,536 IPs (Standard VPC Size)`,
        description: "AWS reserves 5 IPs in every subnet: .0 (network), .1 (VPC router), .2 (DNS), .3 (future use), .255 (broadcast).",
      },
      {
        title: "Essential Network Diagnostic Commands",
        snippet: `# Check DNS propagation across Google DNS
dig @8.8.8.8 sohaildevops.com +noall +answer

# Test port reachability and TCP handshake
nc -zv 192.168.1.50 443

# Show active established network connections
ss -tunap

# Inspect system DNS resolver configuration
cat /etc/resolv.conf`,
        description: "Standard Linux commands for debugging network latency, packet loss, and port connectivity.",
      },
    ],
  },
  {
    id: "aws-notes",
    title: "AWS Notes",
    subtitle: "Important services and use cases.",
    category: "AWS",
    accentColor: "lime",
    tags: ["IAM", "S3", "VPC", "EC2", "RDS"],
    lastUpdated: "Updated 2026",
    summary:
      "Personal architecture cheat sheets for AWS services, multi-AZ high availability patterns, IAM policy structures, and cloud cost management guidelines.",
    keyPrinciples: [
      "Root account is for billing and account setup only. Day-to-day operations should always use IAM Identity Center or Roles.",
      "Store application state in managed databases or S3; treat EC2 compute instances as disposable cattle, not pets.",
      "Configure S3 Object Lock and Multi-Factor Authentication Delete on mission-critical archival buckets.",
      "Enable AWS Budgets and CloudWatch billing alerts with SNS email notification on day zero.",
    ],
    cheatSheets: [
      {
        title: "IAM Least-Privilege Policy Template",
        snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::sohailverse-assets/*"
    }
  ]
}`,
        description: "Restricts access strictly to read and write within the dedicated bucket prefix without allowing bucket deletion or permission tampering.",
      },
      {
        title: "VPC Subnet Allocation Best Practice",
        snippet: `# VPC CIDR: 10.0.0.0/16
Public Subnet 1 (AZ-a):  10.0.1.0/24  (NAT Gateway A, ALB)
Public Subnet 2 (AZ-b):  10.0.2.0/24  (NAT Gateway B, ALB)
Private Subnet 1 (AZ-a): 10.0.10.0/24 (App Servers / EKS Nodes)
Private Subnet 2 (AZ-b): 10.0.20.0/24 (App Servers / EKS Nodes)
Database Subnet 1 (AZ-a): 10.0.30.0/24 (RDS PostgreSQL Primary)
Database Subnet 2 (AZ-b): 10.0.40.0/24 (RDS PostgreSQL Standby)`,
        description: "Clean separation of public, private compute, and isolated database tiers across 2 independent Availability Zones.",
      },
    ],
  },
  {
    id: "devops-linux-notes",
    title: "DevOps & Linux Notes",
    subtitle: "Docker, Kubernetes and CI/CD pipelines.",
    category: "DevOps & Linux",
    accentColor: "cyan",
    tags: ["Docker", "Helm", "GitOps", "Bash", "ArgoCD"],
    lastUpdated: "Updated 2026",
    summary:
      "Production-ready snippets for Docker multi-stage builds, Kubernetes troubleshooting manifests, Helm chart structures, and Linux system administration.",
    keyPrinciples: [
      "Never run containers as root (UID 0). Always create a dedicated non-root user in the Dockerfile.",
      "Always declare CPU and Memory requests and limits on every Kubernetes pod to prevent node starvation.",
      "Use Git tags (v1.2.3) and commit SHA digests for image tags; never deploy 'latest' in production.",
      "All infrastructure changes must happen through Git pull requests (GitOps) with automated linting and terraform plan validation.",
    ],
    cheatSheets: [
      {
        title: "Production Multi-Stage Dockerfile",
        snippet: `# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && chown -R appuser:nodejs /app
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        description: "Produces a minimal, secure ~80MB container image without devDependencies, source code, or root permissions.",
      },
      {
        title: "Kubernetes Emergency Triage Commands",
        snippet: `# Check pod crash logs and previous crash output
kubectl logs -f <pod-name> --previous

# Inspect why a pod is in CrashLoopBackOff or Pending
kubectl describe pod <pod-name>

# View cluster events ordered by timestamp
kubectl get events --sort-by='.metadata.creationTimestamp'

# Quick shell into a running pod
kubectl exec -it <pod-name> -- /bin/sh

# Top pods consuming highest CPU & Memory
kubectl top pods -A`,
        description: "Essential commands for debugging Kubernetes outages, OOMKilled crashes, and probe failures.",
      },
    ],
  },
];
