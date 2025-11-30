import { TargetScanRepository } from "../repositories/agent-target-scan/targetScanRepository";

export class AgentTargetScanService {
    static async *getResponseIA(prompt: string, files?: File[]): AsyncGenerator<string> {
        const streamResponse = TargetScanRepository.generateTextTargetScan(prompt, files || []);
        for await (const part of streamResponse) {
            yield part;
        }
    }
}