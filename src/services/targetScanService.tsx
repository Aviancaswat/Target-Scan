import type { GenerateContentResponse } from "@google/genai";
import { targetScanRepository } from "../repositories/agent-target-scan/targetScanRepository";

export class AgentTargetScanService {
    static async getResponseIA(prompt: string): Promise<GenerateContentResponse> {
        return await targetScanRepository.generateTextTargetScan(prompt)
    }
}