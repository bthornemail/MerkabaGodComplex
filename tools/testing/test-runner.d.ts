#!/usr/bin/env node
declare class TestRunner {
    private results;
    private startTime;
    runAllTests(): Promise<void>;
    private runTestSuite;
    private executeVitest;
    private parseTestMetrics;
    private generateReport;
    private generateDetailedReport;
}
export { TestRunner };
//# sourceMappingURL=test-runner.d.ts.map