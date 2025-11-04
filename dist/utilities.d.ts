import { exec } from 'node:child_process';
export declare const executeCommand: (params: {
    command: string;
    override?: typeof exec;
}) => Promise<string[]>;
