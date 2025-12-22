import { exec } from 'node:child_process';
export declare const executeCommand: (params: {
    command: string;
    hideOutput?: boolean;
    override?: typeof exec;
}) => Promise<string[]>;
