import React, { PropsWithChildren, useState } from "react";
import { useAtom } from "jotai";
import { GaslessTransactionMethods } from "../constants";
import { Card, CardContent } from "../components/card";
import Icon from "../components/icon";
import StepLayout from "../layouts/stepLayout";
import { selectedGaslessSignerAtom } from "../state";
import { GaslessTransactionOption } from "../types";

type Step5SelectGaslessTransactionMethodProps = {};

const TITLE = "Select Gasless Transaction Method";
const SUBTITLE =
  "Capsule integrates with multiple libraries to sign gasless transactions. Select the library you want to demo with.";

const Step5SelectGaslessTransactionMethod: React.FC<
  PropsWithChildren<Step5SelectGaslessTransactionMethodProps>
> = ({}) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedGaslessSigner, setSelectedGaslessSigner] = useAtom(
    selectedGaslessSignerAtom
  );

  return (
    <StepLayout title={TITLE} subtitle={SUBTITLE}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in fill-both">
        {Object.entries(GaslessTransactionMethods).map(
          ([signer, details], index) => (
            <Card
              key={details.label}
              className={`
        relative overflow-hidden cursor-pointer transition-smooth animate-slide-in-from-bottom fill-both
        hover:shadow-lg hover:scale-[1.02] hover:bg-accent/5
        ${
          selectedGaslessSigner === signer
            ? "border-primary border-2 bg-primary/5"
            : "border-border hover:border-accent"
        }
        ${`delay-${(index % 4) + 1}`}
      `}
              onMouseEnter={() => setHoveredOption(details.label)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() =>
                setSelectedGaslessSigner(signer as GaslessTransactionOption)
              }
            >
              <CardContent className="p-4 h-24 flex flex-col items-center justify-center transition-smooth">
                <div
                  className={`transition-smooth ${
                    selectedGaslessSigner === signer
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon icon={details.icon} />
                </div>
                <h3
                  className={`mt-2 text-sm font-medium text-center transition-smooth ${
                    selectedGaslessSigner === signer
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {details.label}
                </h3>
                <div
                  className={`
            absolute inset-0 bg-primary text-primary-foreground
            p-4 text-sm transition-smooth
            flex items-center justify-center text-center
            backdrop-blur-sm
            ${hoveredOption === details.label ? "opacity-100" : "opacity-0"}
          `}
                >
                  {details.description}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </StepLayout>
  );
};

export default Step5SelectGaslessTransactionMethod;
