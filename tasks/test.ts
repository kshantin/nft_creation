import { outputFile, readJSON } from "fs-extra";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";

interface Method {
  contract: string;
  method: string;
  gasData: number[];
}

interface Deployment {
  name: string;
  deployedBytecode: string;
  gasData: number[];
}

interface Report {
  config: {
    metadata: {
      compiler: {
        version: string;
      };
      settings: {
        optimizer: {
          enabled: boolean;
          runs: number;
        };
      };
    };
  };
  info: {
    methods: Record<string, Method>;
    deployments: Deployment[];
  };
}

const sort = (data: number[]) => data.sort((a, b) => a - b);

const sum = (data: number[]) => data.reduce((a, b) => a + b, 0);

const quantile = (data: number[], q: number) => {
  const sorted = sort(data);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base]! + rest * (sorted[base + 1]! - sorted[base]!);
  } else {
    return sorted[base]!;
  }
};

task(TASK_TEST, "Runs mocha tests", async (taskArgs, _hre, runSuper) => {
  const res = await runSuper(taskArgs);

  try {
    const now = Math.floor(Date.now() / 1000);
    const ethGasReporterReport: Report = await readJSON(
      "./gasReporterOutput.json",
    );

    const report: string[] = [];
    report.push("# TYPE build info");
    const optimizerRuns = ethGasReporterReport.config.metadata.settings
      .optimizer.enabled
      ? ethGasReporterReport.config.metadata.settings.optimizer.runs
      : 0;
    // TODO: add `evm_version` label
    report.push(
      `build_info{solc_version="${ethGasReporterReport.config.metadata.compiler.version}",optimizer_runs="${optimizerRuns}"} 1`,
    );

    let methods: Method[] = Object.values(ethGasReporterReport.info.methods);
    if (ethGasReporterReport.info.deployments.length > 0) {
      report.push("# TYPE contract_size_bytes gauge");
      report.push("# UNIT contract_size_bytes bytes");

      for (const { name, deployedBytecode, gasData } of ethGasReporterReport
        .info.deployments) {
        const size = Buffer.from(
          deployedBytecode.replace(/__\$\w*\$__/g, "0".repeat(40)).slice(2),
          "hex",
        ).length;
        if (size > 0) {
          report.push(`contract_size_bytes{contract="${name}"} ${size}`);
        }
        methods.push({
          contract: name,
          gasData,
          method: "constructor",
        });
      }
    }

    methods = methods.filter(({ gasData }) => gasData.length > 0);
    if (methods.length > 0) {
      report.push("# TYPE contract_function_gas_usage summary");

      for (const { contract, gasData, method } of methods) {
        report.push(
          `contract_function_gas_usage_count{contract="${contract}",function="${method}"} ${gasData.length}`,
        );

        report.push(
          `contract_function_gas_usage_sum{contract="${contract}",function="${method}"} ${sum(
            gasData,
          )}`,
        );

        if (gasData.length > 1) {
          report.push(
            `contract_function_gas_usage{contract="${contract}",function="${method}",quantile="0.5"} ${quantile(
              gasData,
              0.5,
            )}`,
          );
          report.push(
            `contract_function_gas_usage{contract="${contract}",function="${method}",quantile="0.9"} ${quantile(
              gasData,
              0.9,
            )}`,
          );
          report.push(
            `contract_function_gas_usage{contract="${contract}",function="${method}",quantile="0.99"} ${quantile(
              gasData,
              0.99,
            )}`,
          );
        }
      }

      report.push(`contract_function_gas_usage_created ${now}`);
    }

    report.push("# EOF");
    await outputFile("./gas-profile-report.txt", report.join("\n"));
  } finally {
    return res;
  }
});
