
import GrowingTree from "@/components/growing-tree";
import { ProtectedRoute } from "@/components/protected-route";


export default function Page() {
  return (
    <ProtectedRoute>
      <GrowingTree />
    </ProtectedRoute>
  );
}