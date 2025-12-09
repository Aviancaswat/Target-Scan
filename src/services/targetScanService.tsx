import { TargetScanRepository } from "@/repositories/agent-target-scan/targetScanRepository";
import type { Content } from "@google/genai";

export class AgentTargetScanService {
    static getResponseIA(history: Content[], prompt: string, files?: File[]): AsyncGenerator<string, void, unknown> {
        return TargetScanRepository.generateTextTargetScan(history, prompt, files || []);
    }
}