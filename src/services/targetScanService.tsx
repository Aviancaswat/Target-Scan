import { TargetScanRepository } from "../repositories/agent-target-scan/targetScanRepository";

export class AgentTargetScanService {
    static getResponseIA(prompt: string, files?: File[]): AsyncGenerator<string, void, unknown> {
        return TargetScanRepository.generateTextTargetScan(prompt, files || []);
    }
}