export interface Command {
    data: { name: string; toJSON: () => unknown };
    cooldown?: number;
    execute: (...args: unknown[]) => Promise<void>;
}