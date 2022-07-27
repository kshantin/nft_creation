import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Greeter", {
    from: deployer!,
    args: ["test"],
    log: true,
  });
};
deploy.tags = ["Greeter"];
export default deploy;
