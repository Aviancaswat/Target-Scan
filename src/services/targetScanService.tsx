import type { Content } from "@google/genai";
import { TargetScanRepository } from "../repositories/agent-target-scan/targetScanRepository";

export class AgentTargetScanService {
    static getResponseIA(history: Content[], prompt: string, files?: File[]): AsyncGenerator<string, void, unknown> {
        return TargetScanRepository.generateTextTargetScan(history, prompt, files || []);
    }
}