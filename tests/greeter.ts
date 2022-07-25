import { Greeter } from "#types/Greeter";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";

const HELLO_WORLD_EN: string = "Hello, world!";

describe("Greeter", () => {
  let greeter: Greeter;

  beforeEach(async () => {
    await deployments.fixture();

    greeter = await ethers.getContract<Greeter>("Greeter");
  });

  it("should revert when the new greeting has zero length", async () => {
    await expect(greeter.setGreeting("")).to.be.revertedWith(
      "GreeterZeroLengthGreeting",
    );
  });

  it("should return the new greeting once it's changed", async () => {
    const greeting = await greeter.greet();
    await expect(greeter.setGreeting(HELLO_WORLD_EN))
      .to.emit(greeter, "GreetingChanged")
      .withArgs(greeting, HELLO_WORLD_EN);
    expect(await greeter.greet()).to.equal(HELLO_WORLD_EN);
  });
});
