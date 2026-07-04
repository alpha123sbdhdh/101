import { FormEvent, useState } from "react";

export function AddressForm({
  onSubmit,
  loading,
}: {
  onSubmit: (address: string) => void;
  loading: boolean;
}) {
  const [address, setAddress] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (address.trim()) onSubmit(address.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="field">
        <label htmlFor="address">Property address</label>
        <input
          id="address"
          placeholder="123 Main St, Baltimore, MD 21201"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? "Getting estimate…" : "Get my estimate"}
      </button>
    </form>
  );
}
