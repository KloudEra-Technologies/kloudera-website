import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // Matching the hashing method in auth.ts
  return crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET || "kloudera-secret")
    .update(password)
    .digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.systemConfig.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.serviceItem.deleteMany({});
  await prisma.hardwareProduct.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.jobListing.deleteMany({});
  await prisma.leadSubmission.deleteMany({});
  await prisma.meetingBooking.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kloudera.tech";
  const adminRawPassword = process.env.ADMIN_PASSWORD || "KlouderaSecureAdmin2026!";
  const hashedPassword = hashPassword(adminRawPassword);

  const admin = await prisma.user.create({
    data: {
      name: "Security Commander",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 3. Create Services
  const services = [
    {
      title: "Cyber Security Command",
      slug: "cyber-security",
      category: "Security",
      description: "Enterprise-grade threat protection, continuous SOC monitoring, zero-trust integration, identity posture management, and compliance enforcement.",
      icon: "ShieldAlert",
      details: JSON.stringify({
        tagline: "Securing your operations against evolving digital threats.",
        subsections: [
          { name: "Zero Trust Architecture", desc: "Perimeterless security models designed around identity and context." },
          { name: "Continuous SOC & SIEM Monitoring", desc: "Around-the-clock event scanning and automated anomaly mitigation." },
          { name: "Endpoint & Cloud Armor", desc: "Device protection, workspace containers, and secure SaaS gateways." },
          { name: "Penetration Testing (VAPT)", desc: "Controlled security attacks to identify and remediate infrastructure weaknesses." }
        ]
      })
    },
    {
      title: "AI & Cognitive Automation",
      slug: "ai-solutions",
      category: "AI",
      description: "Developing neural networks, custom agentic workflows, conversational interfaces, and analytics platforms to drive operational efficiencies.",
      icon: "BrainCircuit",
      details: JSON.stringify({
        tagline: "Powering decisions with cognitive workflows and predictive models.",
        subsections: [
          { name: "Generative AI Integration", desc: "Deploying enterprise LLMs inside secure workspace parameters." },
          { name: "AI Agents & Automation", desc: "Autonomous bots that execute complex multi-step workflows." },
          { name: "Machine Learning Pipelines", desc: "Custom data training, predictive modeling, and analytics." },
          { name: "Copilot Studio Enablement", desc: "Tailoring Microsoft Copilot to your corporate data repositories." }
        ]
      })
    },
    {
      title: "Microsoft Solutions Suite",
      slug: "microsoft-solutions",
      category: "Microsoft",
      description: "Maximizing ROI with secure Microsoft 365 migrations, Azure Cloud scaling, Defender deployments, and Entra identity setups.",
      icon: "Microsoft",
      details: JSON.stringify({
        tagline: "Deploying and managing Microsoft's premium enterprise ecosystems.",
        subsections: [
          { name: "Azure Cloud Architectures", desc: "High availability environments, virtualization, and SQL setups." },
          { name: "Microsoft 365 & Copilot", desc: "Seamless migration, modern workplace collaboration, and security settings." },
          { name: "Entra ID & Defender", desc: "Unified identity verification, single sign-on, and device compliance." },
          { name: "Power Platform Systems", desc: "Low-code app design and automation flows connected to your SQL databases." }
        ]
      })
    },
    {
      title: "Cloud & GPU Infrastructure",
      slug: "cloud-infrastructure",
      category: "Cloud",
      description: "Architecting hybrid cloud architectures, virtual private networks, high-compute GPU scaling, and robust backup pipelines.",
      icon: "CloudLightning",
      details: JSON.stringify({
        tagline: "Scalable computing environments designed for maximum throughput.",
        subsections: [
          { name: "GPU Supercomputing", desc: "Provisioning high-capacity GPU systems for AI model training." },
          { name: "Hybrid Networking & VPNs", desc: "Linking physical enterprise servers with multi-cloud resources." },
          { name: "Storage & Disaster Recovery", desc: "Automated, encrypted offsite backups with rapid snapshot recovery." },
          { name: "SaaS Scale Architecture", desc: "Containerized hosting (Docker, Kubernetes) for high-traffic environments." }
        ]
      })
    },
    {
      title: "Managed IT Services",
      slug: "managed-it",
      category: "Managed IT",
      description: "Proactive IT support desk, infrastructure monitoring, routine hardware cycles, and CTO-level digital consulting.",
      icon: "Cpu",
      details: JSON.stringify({
        tagline: "Outsource your IT operations to our specialized team.",
        subsections: [
          { name: "24/7 Support Desk", desc: "Remote and onsite technical troubleshooting for systems and devices." },
          { name: "Hardware Procurement", desc: "Sourcing enterprise MacBooks, GPUs, and network hardware at scale." },
          { name: "Compliance Auditing", desc: "Aligning IT setups with ISO 27001, SOC 2, and local privacy standards." },
          { name: "IT Strategy Consulting", desc: "Structuring tech roadmaps to accelerate corporate digital transitions." }
        ]
      })
    }
  ];

  for (const s of services) {
    await prisma.serviceItem.create({ data: s });
  }
  console.log("Services seeded.");

  // 4. Create Hardware Products
  const products = [
    {
      name: "Apple MacBook Pro (M4 Max)",
      slug: "macbook-pro-m4-max",
      category: "MacBooks",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
      description: "The ultimate developer workstation, powered by the Apple M4 Max chip with up to 128GB of unified memory and hardware-accelerated ray tracing.",
      specs: JSON.stringify({
        Chip: "Apple M4 Max with 16‑core CPU and 40‑core GPU",
        Memory: "Up to 128GB Unified Memory (400GB/s bandwidth)",
        Storage: "512GB to 8TB Superfast SSD",
        Display: "16.2-inch Liquid Retina XDR (120Hz ProMotion, 1600 nits)",
        Ports: "3x Thunderbolt 5, HDMI, SDXC, MagSafe 3",
        Battery: "Up to 24 hours of usage"
      }),
      features: JSON.stringify([
        "Extreme machine learning compilation and compilation speeds",
        "Configured out-of-the-box for AI developers and enterprise designers",
        "Supports up to four external high-resolution Pro Display XDR screens",
        "Secure Enclave authentication with Face ID"
      ]),
      hotspots: JSON.stringify([
        { x: 30, y: 40, label: "M4 Max Silicon", desc: "Dedicated neural engine executing 38 trillion ops/sec." },
        { x: 75, y: 15, label: "Retina XDR Screen", desc: "Stunning 1,000,000:1 contrast ratio with mini-LED array." },
        { x: 10, y: 80, label: "Thunderbolt 5 Ports", desc: "Bi-directional bandwidth up to 120Gbps for storage pools." }
      ]),
    },
    {
      name: "Nvidia HGX H100 (8x GPU System)",
      slug: "nvidia-hgx-h100",
      category: "GPUs",
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop",
      description: "The premier infrastructure node for large-scale language model training, AI inferencing, and high-performance computing.",
      specs: JSON.stringify({
        Architecture: "Nvidia Hopper GPU Architecture",
        "Total VRAM": "640GB HBM3 Memory (across 8x H100 GPUs)",
        Performance: "Up to 32 PetaFLOPS of FP8 Tensor Core compute",
        Interconnect: "Nvidia NVSwitch system at 7.2TB/s bi-directional",
        Networking: "8x 400Gb/s InfiniBand links",
        Power: "Typical draw of 10.2kW per 10U system"
      }),
      features: JSON.stringify([
        "Transformer Engine acceleration for massive LLM models (e.g. GPT-4 scale)",
        "Secure Multi-Instance GPU (MIG) supporting isolated workflows",
        "Integrated liquid-cooled manifolds or high-flow air systems",
        "Optimized for cluster deployment in private datacenters"
      ]),
      hotspots: JSON.stringify([
        { x: 50, y: 50, label: "Hopper Silicon Matrix", desc: "4nm TSMC lithography with 80 billion transistors per die." },
        { x: 20, y: 30, label: "NVSwitch Fabric", desc: "Permits unified GPU memory access across nodes." },
        { x: 80, y: 70, label: "InfiniBand NICs", desc: "Ultra-low-latency high-throughput datacenter clustering." }
      ]),
    },
    {
      name: "Kloudera CloudRack Server R960",
      slug: "kloudera-cloudrack-r960",
      category: "Servers",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
      description: "Enterprise rack server engineered for hyper-virtualization, database acceleration, and core cloud hosting deployments.",
      specs: JSON.stringify({
        Processor: "Dual 5th Gen Intel Xeon Scalable Processors (up to 128 cores)",
        Memory: "Up to 8TB DDR5 ECC RAM (32 DIMM slots)",
        Drive: "Up to 24x NVMe U.2 SSD drives with hardware RAID",
        Network: "Quad 10/25GbE SFP28 and Dual 100GbE ports",
        Management: "Integrated iDRAC9 telemetry with zero-touch deployment",
        Security: "Silicon Root of Trust, Secure Boot, System Lockdown"
      }),
      features: JSON.stringify([
        "PCIe Gen 5 support for next-generation expansion and network cards",
        "Redundant hot-swappable 2400W Titanium power supplies",
        "Active threat containment via hardware-enforced hypervisor locks",
        "Intelligent thermal cooling arrays reducing rack power waste"
      ]),
      hotspots: JSON.stringify([
        { x: 45, y: 35, label: "Dual Intel Xeon CPUs", desc: "High core count processors with built-in matrix acceleration." },
        { x: 85, y: 55, label: "Hot-swap NVMe Bays", desc: "U.2 storage pools swapping in real-time under active operations." },
        { x: 15, y: 20, label: "Titanium Power Modules", desc: "96% efficiency ratings under peak computational loads." }
      ]),
    }
  ];

  for (const p of products) {
    await prisma.hardwareProduct.create({ data: p });
  }
  console.log("Products seeded.");

  // 5. Create Testimonials
  const testimonials = [
    {
      author: "Sarah Jenkins",
      role: "Chief Information Security Officer",
      company: "Apex Global FinTech",
      content: "Kloudera Technologies transformed our infrastructure. Their Cyber Security command center caught and mitigated three major threat attempts on day one, and their zero-trust setup gave our hybrid team complete compliance safety.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      author: "David Chen",
      role: "VP of Engineering & AI Research",
      company: "Synthetix Labs",
      content: "The Nvidia HGX systems provided by Kloudera allowed us to cut our LLM training time by 40%. Their technical team didn't just ship hardware; they optimized our clustering and network switches for maximum CUDA output.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      author: "Marcus Miller",
      role: "Director of IT Operations",
      company: "Metro Health Group",
      content: "Migrating 10,000 mailboxes and active systems to Microsoft 365 was a daunting task. Kloudera handled it flawlessly. Their Entra ID configuration and Defender deployment saved our IT helpdesk hundreds of hours.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("Testimonials seeded.");

  // 6. Create Partners
  const partners = [
    { name: "Microsoft Gold Partner", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Nvidia Partner Network", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Cisco Integrator", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cisco_logo.svg" },
    { name: "Cloudflare Partner", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg" }
  ];

  for (const p of partners) {
    await prisma.partner.create({ data: p });
  }
  console.log("Partners seeded.");

  // 7. Create System Configurations
  const configs = [
    {
      key: "meeting_settings",
      value: JSON.stringify({
        businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5] }, // Mon-Fri
        holidays: ["2026-01-01", "2026-12-25"], // New Year, Christmas
        bufferTime: 15, // Minutes
        durations: [30, 45, 60] // Allowed slot durations in mins
      })
    },
    {
      key: "homepage_meta",
      value: JSON.stringify({
        title: "Kloudera Technologies | Secure Enterprise AI Command",
        metaDescription: "Future-proof your enterprise with world-class Cyber Security, cognitive AI workflows, Microsoft solutions, and premium GPU systems.",
        analyticsEnabled: true,
        reducedMotionAvailable: true,
        highContrastAvailable: true
      })
    }
  ];

  for (const c of configs) {
    await prisma.systemConfig.create({ data: c });
  }
  console.log("System configs seeded.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
