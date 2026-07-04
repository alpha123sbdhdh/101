import { PageTransition } from "../components/PageTransition";
import { AddressForm } from "../valuation/AddressForm";
import { ValuationResult } from "../valuation/ValuationResult";
import { useValuation } from "../valuation/useValuation";

export function SellRoute() {
  const valuation = useValuation();

  return (
    <PageTransition>
      <h1 className="page-heading">Sell your home</h1>
      <p className="page-sub">
        Get an instant estimate of what your home could be worth. This is a mock estimate for now —
        real valuation providers can be plugged in later.
      </p>

      <AddressForm onSubmit={(address) => valuation.mutate(address)} loading={valuation.isPending} />

      {valuation.isError && (
        <p className="error-text" style={{ marginTop: 16 }}>
          Something went wrong getting your estimate. Try again.
        </p>
      )}

      {valuation.data && (
        <div style={{ marginTop: 24 }}>
          <ValuationResult result={valuation.data} />
        </div>
      )}
    </PageTransition>
  );
}
