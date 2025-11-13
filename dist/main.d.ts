export declare const run: () => Promise<{
    latestTag: string;
    commitsInLatestRelease: string[];
    commitsSinceLatestRelease: string[];
    headOfLatestRelease: string;
    baseSinceLatestRelease: string;
    headSinceLatestRelease: string;
}>;
