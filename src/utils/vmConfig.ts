import { VMConfig } from "../handler/scaleHandler";

export default {
  templateId: 1,
  targetHostId: 1,
  storeSrc: "/storage/templates/ubuntu-20.04",
  dest: "/vms/instance-001",
  storePool: "default-pool",
  vmName: "test-vm-01",
  vmCpuSocket: 1,
  vmCpuCore: 4,
  vmMemory: 4096,
} satisfies VMConfig;
