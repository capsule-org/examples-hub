import { Plus, Trash2 } from "react-feather";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";

export type UserOp = {
  value: string;
};

type BatchOperationsFormProps = {
  userOps: UserOp[];
  onAddOperation: () => void;
  onRemoveOperation: (index: number) => void;
  onValueChange: (index: number, value: string) => void;
  onSign: () => void;
  loading: boolean;
  error: string;
  txHash: string;
};

const BatchOperationsForm: React.FC<BatchOperationsFormProps> = ({
  userOps,
  onAddOperation,
  onRemoveOperation,
  onValueChange,
  onSign,
  loading,
  error,
  txHash,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Batch Change X Values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userOps.map((op, index) => (
          <div
            key={index}
            className="flex items-center gap-2">
            <Input
              type="number"
              value={op.value}
              onChange={(e) => onValueChange(index, e.target.value)}
              placeholder={`Value for operation ${index + 1}`}
              className="flex-1"
            />
            {userOps.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveOperation(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={onAddOperation}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Operation
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {txHash && (
          <Alert>
            <AlertDescription>Transaction Hash: {txHash}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSign}
          disabled={loading || userOps.some((op) => !op.value)}
          className="w-full">
          {loading ? "Processing..." : "Sign and Send Batch Operations"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BatchOperationsForm;
