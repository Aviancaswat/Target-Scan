import type { GenerateContentResponse } from "@google/genai";
import { TargetScanRepository } from "../repositories/agent-target-scan/targetScanRepository";

export class AgentTargetScanService {
    static async getResponseIA(prompt: string, files?: File[]): Promise<GenerateContentResponse> {
        return await TargetScanRepository.generateTextTargetScan(prompt, files || []);
    }
}